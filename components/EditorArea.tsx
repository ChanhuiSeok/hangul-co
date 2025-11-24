"use client";

import { ChangeEvent, useRef, useState } from "react";
import { parseObjectDotNotation, convertToExecutableCommands, EventBinding } from "@/lib/parser";
import { saveToHistory } from "@/lib/historyUtils";

type AnswerCase = "click1" | "click2" | "click3" | "send1" | "send2" | "send3";

interface EditorAreaProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRunCode?: (result: { commands: any[]; eventBindings: EventBinding[] }) => void;
  completedCases: Set<AnswerCase>;
  onScoreUpdate: (newCases: Set<AnswerCase>, points: number) => void;
}

export default function EditorArea({ code, onCodeChange, onRunCode, completedCases, onScoreUpdate }: EditorAreaProps) {
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
  const [celebrationPoints, setCelebrationPoints] = useState<number>(0);
  const [confettiPieces, setConfettiPieces] = useState<
    Array<{ id: number; angle: number; color: string; delay: number; distance: number }>
  >([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onCodeChange(e.target.value);
  };

  const insertBlock = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newCode = code.substring(0, start) + text + code.substring(end);

    onCodeChange(newCode);

    // 커서를 삽입된 텍스트 뒤로 이동
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + text.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleRunCode = () => {
    try {
      // 한글 코드 파싱
      const parseResult = parseObjectDotNotation(code);
      const commands = convertToExecutableCommands(parseResult.commands);

      console.log("📝 파싱된 명령어:", parseResult.commands);
      console.log("🔗 파싱된 이벤트 바인딩:", parseResult.eventBindings);
      console.log("✅ 실행 가능한 명령어:", commands);

      if (commands.length === 0 && parseResult.eventBindings.length === 0) {
        alert("실행할 명령어가 없습니다!");
        return;
      }

      // 정답 체크
      const newCompletedCases = new Set(completedCases);
      let newCorrectAnswers = 0;

      // 이벤트 바인딩 체크 (채팅목록 클릭 -> 채팅방 보여주기)
      parseResult.eventBindings.forEach((binding) => {
        if (binding.source.object === "채팅목록" && binding.source.event === "클릭") {
          if (binding.target.object === "채팅방" && binding.target.action === "보여주기") {
            // 같은 번호 매칭 확인
            if (binding.source.id === binding.target.id) {
              const caseKey = `click${binding.source.id}` as AnswerCase;
              if (!newCompletedCases.has(caseKey)) {
                newCompletedCases.add(caseKey);
                newCorrectAnswers++;
                console.log(`✅ 정답! 케이스: ${caseKey}`);
              }
            }
          }
        }
      });

      // 명령어 체크 (채팅방 전송)
      commands.forEach((command) => {
        if (command && command.type === "sendMessage" && command.message) {
          // 아무 텍스트나 전송하면 성공
          const caseKey = `send${command.roomId}` as AnswerCase;
          if (!newCompletedCases.has(caseKey)) {
            newCompletedCases.add(caseKey);
            newCorrectAnswers++;
            console.log(`✅ 정답! 케이스: ${caseKey}`);
          }
        }
      });

      // 새로운 정답이 있으면 점수 업데이트 및 축하 메시지
      if (newCorrectAnswers > 0) {
        // 보너스 점수 계산
        let points = 0;
        let bonusMessage = "";

        if (newCorrectAnswers === 6) {
          // 6개 모두 정답: 100점
          points = 100;
          bonusMessage = "🎊 PERFECT! 올클리어! 🎊";
        } else if (newCorrectAnswers === 3) {
          // 3개 정답: 40점
          points = 40;
          bonusMessage = "🌟 COMBO! 🌟";
        } else {
          // 나머지: 개당 10점
          points = newCorrectAnswers * 10;
        }

        onScoreUpdate(newCompletedCases, points);

        // 축하 메시지와 점수 표시
        setCelebrationMessage(bonusMessage || "정답!");
        setCelebrationPoints(points);

        // Confetti 생성 - 중앙에서 사방으로 퍼지는 효과
        // 보너스가 있을 때는 더 많은 confetti
        const confettiCount = newCorrectAnswers >= 3 ? 100 : 60;
        const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE"];
        const newConfetti = Array.from({ length: confettiCount }, (_, i) => ({
          id: Date.now() + i,
          angle: (360 / confettiCount) * i + Math.random() * 10, // 각도를 균등하게 분배
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.2,
          distance: 150 + Math.random() * 150, // 보너스일 때 더 멀리 퍼짐
        }));
        setConfettiPieces(newConfetti);

        setTimeout(() => {
          setCelebrationMessage(null);
          setCelebrationPoints(0);
          setConfettiPieces([]);
        }, 3000);
      }

      // 히스토리에 저장
      saveToHistory(code);

      // 부모 컴포넌트로 명령어와 이벤트 바인딩 전달
      onRunCode?.({ commands, eventBindings: parseResult.eventBindings });
    } catch (error) {
      console.error("파싱 오류:", error);
      alert("코드 실행 중 오류가 발생했습니다.");
    }
  };

  const handleResetCode = () => {
    const result = confirm("입력한 값을 삭제하시겠습니까?");
    if (result) {
      onCodeChange("");
    }
  };

  const handleDeleteOneCharacter = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // 선택된 텍스트가 있으면 그것을 삭제
    if (start !== end) {
      const newCode = code.substring(0, start) + code.substring(end);
      onCodeChange(newCode);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start);
      }, 0);
      return;
    }

    // 커서가 맨 앞에 있으면 지울 것이 없음
    if (start === 0) return;

    // 커서 바로 앞의 한 글자를 삭제 (백스페이스와 동일)
    const newCode = code.substring(0, start - 1) + code.substring(start);
    onCodeChange(newCode);

    // 커서를 한 칸 앞으로 이동
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start - 1, start - 1);
    }, 0);
  };

  const blocks = [
    { label: "채팅목록1", value: "채팅목록1" },
    { label: "채팅목록2", value: "채팅목록2" },
    { label: "채팅목록3", value: "채팅목록3" },
    { label: "채팅방1", value: "채팅방1" },
    { label: "채팅방2", value: "채팅방2" },
    { label: "채팅방3", value: "채팅방3" },
    { type: "command", label: ".", value: ".", bgColor: "#5CDAE0", textColor: "#000000" },
    { type: "command", label: "클릭", value: "클릭", bgColor: "#5CDAE0", textColor: "#000000" },
    { type: "command", label: "=", value: "=", bgColor: "#5CDAE0", textColor: "#000000" },
    { type: "command", label: "보여주기", value: "보여주기", bgColor: "#5CDAE0", textColor: "#000000" },
    { type: "command", label: '전송("")', value: '전송("")', bgColor: "#5CDAE0", textColor: "#000000" },
    { type: "other", label: "엔터(↵)", value: "\n", bgColor: "#C0C6CF", textColor: "#000000" },
  ];

  const commandBlocks = blocks.filter((block) => block.type === "command");
  const objectBlocks = blocks.filter((block) => block.type !== "command");

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white relative overflow-hidden">
      {/* 축하 효과 오버레이 - EditorArea 내부에서만 표시 */}
      {celebrationMessage && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Confetti 효과 - 중앙에서 사방으로 퍼지기 */}
          {confettiPieces.map((piece) => {
            const rad = (piece.angle * Math.PI) / 180;
            const x = Math.cos(rad) * piece.distance;
            const y = Math.sin(rad) * piece.distance;

            return (
              <div
                key={piece.id}
                className="absolute"
                style={
                  {
                    left: "50%",
                    top: "50%",
                    width: "12px",
                    height: "12px",
                    backgroundColor: piece.color,
                    borderRadius: "50%",
                    animation: `confetti-explode 1s ease-out ${piece.delay}s forwards`,
                    transform: "translate(-50%, -50%)",
                    "--x": `${x}px`,
                    "--y": `${y}px`,
                  } as any
                }
              />
            );
          })}

          {/* 축하 메시지 박스 */}
          <div className="text-white px-16 py-10 relative overflow-hidden">
            {/* 반짝이는 배경 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r"></div>

            {/* 빛나는 링 효과 */}
            <div className="absolute inset-0 rounded-3xl animate-ping opacity-30"></div>

            {/* 메시지 내용 */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="text-7xl animate-bounce">🎉</div>
              {celebrationMessage && celebrationMessage !== "정답!" && (
                <div className="text-4xl font-black tracking-wider drop-shadow-2xl animate-pulse text-yellow-200">
                  {celebrationMessage}
                </div>
              )}
              <div className="text-6xl font-black tracking-wider drop-shadow-2xl animate-pulse">정답!</div>
              <div
                className="text-5xl font-bold text-yellow-100 drop-shadow-2xl"
                style={{ animation: "0.5s ease-out 0.2s backwards" }}
              >
                +{celebrationPoints}점
              </div>
            </div>

            {/* 장식 요소 - 더 크고 화려하게 */}
            <div className="absolute top-4 left-4 text-5xl animate-spin">⭐</div>
            <div className="absolute top-4 right-4 text-5xl animate-spin" style={{ animationDirection: "reverse" }}>
              ✨
            </div>
            <div className="absolute bottom-4 left-4 text-5xl animate-bounce">🌟</div>
            <div className="absolute bottom-4 right-4 text-5xl animate-bounce" style={{ animationDelay: "0.2s" }}>
              💫
            </div>
            <div className="absolute top-1/2 left-6 text-4xl animate-ping">🎊</div>
            <div className="absolute top-1/2 right-6 text-4xl animate-ping" style={{ animationDelay: "0.3s" }}>
              🎊
            </div>
          </div>
        </div>
      )}

      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
        <h2 className="font-bold"></h2>
        <div className="flex gap-2">
          <button
            onClick={handleRunCode}
            className="px-4 py-1 text-sm bg-gradient-to-r from-green-500 to-lime-600 rounded
            border-2 border-green-300
            font-bold transition"
          >
            ▶ 실행하기
          </button>
          <button
            className="px-2 py-1 text-xs bg-white/20 rounded transition"
            onClick={() => handleDeleteOneCharacter()}
          >
            🧹 한 글자씩 지우기
          </button>
          <button
            onClick={handleResetCode}
            className="px-2 py-1 text-xs bg-red-700/50 hover:bg-red-700 rounded transition"
          >
            입력한 값 전체 삭제
          </button>
        </div>
      </div>

      {/* Block Buttons */}
      <div className="px-4 py-2 bg-gray-900 border-b border-gray-700">
        <div className="flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            {objectBlocks.map((block) => (
              <button
                key={block.label}
                onClick={() => insertBlock(block.value)}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-500 rounded font-mono transition"
                style={{ backgroundColor: block.bgColor, color: block.textColor }}
                title={`"${block.value}" 삽입`}
              >
                {block.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {" "}
            {commandBlocks.map((block) => (
              <button
                key={block.label}
                onClick={() => insertBlock(block.value)}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-500 rounded font-mono transition"
                style={{ backgroundColor: block.bgColor, color: block.textColor }}
                title={`"${block.value}" 삽입`}
              >
                {block.label}
              </button>
            ))}{" "}
          </div>
        </div>
      </div>

      {/* Editor Input */}
      <div className="flex relative h-[400px]">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          rows={1}
          placeholder="위에 있는 버튼들을 눌러서 코드를 입력해 보세요.."
          className="w-full h-full py-4 pl-8 pr-4 bg-gray-800 text-white font-mono text-sm resize-none focus:outline-none"
          spellCheck={false}
        />

        {/* Line numbers (optional - can be enhanced later) */}
        <div className="absolute left-0 top-0 p-4 text-gray-500 text-sm font-mono pointer-events-none select-none">
          {code.split("\n").map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
      </div>

      {/* Editor Footer */}
      <div className="flex px-4 py-2 bg-gray-900 border-t border-gray-700 text-xs text-gray-400">
        줄: {code.split("\n").length} | 글자: {code.length}
      </div>
    </div>
  );
}
