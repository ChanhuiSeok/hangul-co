"use client";

import { useRef, useEffect, useState } from "react";

interface DrawingCanvasProps {
  onClose: () => void;
  onSend: (imageUrl: string) => void;
}

// 색상 팔레트
const COLORS = [
  { name: "검정", value: "#000000" },
  { name: "빨강", value: "#EF4444" },
  { name: "주황", value: "#F97316" },
  { name: "노랑", value: "#EAB308" },
  { name: "초록", value: "#22C55E" },
  { name: "파랑", value: "#3B82F6" },
  { name: "보라", value: "#A855F7" },
  { name: "분홍", value: "#EC4899" },
];

// 배경 색상
const BG_COLORS = [
  { name: "투명", value: "transparent" },
  { name: "흰색", value: "#FFFFFF" },
  { name: "밝은 회색", value: "#F3F4F6" },
  { name: "노란색", value: "#FEF9C3" },
  { name: "분홍색", value: "#FCE7F3" },
  { name: "파란색", value: "#DBEAFE" },
  { name: "초록색", value: "#DCFCE7" },
];

// 이모티콘 템플릿
interface Template {
  name: string;
  emoji: string;
  draw: (ctx: CanvasRenderingContext2D, color: string) => void;
}

const bgColor = "transparent";
export default function DrawingCanvas({ onClose, onSend }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 크기 설정
    canvas.width = 600;
    canvas.height = 400;

    // 배경 색상 적용 (투명이 아닌 경우만)
    if (bgColor !== "transparent") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 기본 그리기 설정
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    setContext(ctx);
  }, [bgColor]);

  // 색상 변경
  useEffect(() => {
    if (!context) return;
    context.strokeStyle = currentColor;
    context.fillStyle = currentColor;
  }, [currentColor, context]);

  // 선 굵기 변경
  useEffect(() => {
    if (!context) return;
    context.lineWidth = lineWidth;
  }, [lineWidth, context]);

  const getCanvasCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    return { x, y };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!context) return;

    const { x, y } = getCanvasCoordinates(e);

    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;

    const { x, y } = getCanvasCoordinates(e);

    // 펜 압력을 선 굵기에 반영 (지원하는 경우)
    if (e.pressure > 0) {
      context.lineWidth = lineWidth + e.pressure * 3;
    }

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (context) {
      context.lineWidth = lineWidth; // 선 굵기 복원
    }
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;

    // 투명 배경인 경우 clearRect로 완전히 지우기
    if (bgColor === "transparent") {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    } else {
      // 배경색으로 채우기
      context.fillStyle = bgColor;
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleSend = () => {
    if (!canvasRef.current) return;

    // 캔버스를 이미지로 변환
    const imageUrl = canvasRef.current.toDataURL("image/png");
    onSend(imageUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-3 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-black font-semibold">이모티콘 메이커</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 색상 팔레트 */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">펜 색상</h3>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setCurrentColor(color.value)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  currentColor === color.value ? "border-gray-900 scale-110" : "border-gray-300"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
        {/* 선 굵기 */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">선 굵기: {lineWidth}px</h3>
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-full"
          />
        </div>
        {/* 캔버스 */}
        <div
          className="border-2 border-gray-300 rounded-lg overflow-hidden mb-4"
          style={{
            backgroundImage:
              bgColor === "transparent"
                ? "linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%, #e5e7eb), linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%, #e5e7eb)"
                : undefined,
            backgroundSize: bgColor === "transparent" ? "20px 20px" : undefined,
            backgroundPosition: bgColor === "transparent" ? "0 0, 10px 10px" : undefined,
            backgroundColor: bgColor === "transparent" ? "#f9fafb" : undefined,
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-auto touch-none cursor-crosshair"
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
            style={{ touchAction: "none" }}
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 justify-end">
          <button onClick={clearCanvas} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-black">
            전체 지우기
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg font-semibold text-black"
          >
            전송 📤
          </button>
        </div>
      </div>
    </div>
  );
}
