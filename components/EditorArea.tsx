"use client";

import { ChangeEvent, useRef } from "react";
import { parseObjectDotNotation, convertToExecutableCommands, EventBinding } from "@/lib/parser";

interface EditorAreaProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRunCode?: (result: { commands: any[]; eventBindings: EventBinding[] }) => void;
}

export default function EditorArea({ code, onCodeChange, onRunCode }: EditorAreaProps) {
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

      // 부모 컴포넌트로 명령어와 이벤트 바인딩 전달
      onRunCode?.({ commands, eventBindings: parseResult.eventBindings });
      // alert(`✅ ${commands.length}개 명령어가 실행되었습니다!`);
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

  const blocks = [
    { label: "채팅목록1", value: "채팅목록1" },
    { label: "채팅목록2", value: "채팅목록2" },
    { label: "채팅목록3", value: "채팅목록3" },
    { label: "채팅방1", value: "채팅방1" },
    { label: "채팅방2", value: "채팅방2" },
    { label: "채팅방3", value: "채팅방3" },
    { label: ".", value: "." },
    { label: "클릭", value: "클릭" },
    { label: "=", value: "=" },
    { label: "보여주기", value: "보여주기" },
    { label: '전송("")', value: '전송("")' },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
        <h2 className="text-sm font-semibold">편집기</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRunCode}
            className="px-4 py-1 text-xs bg-green-600 hover:bg-green-500 rounded font-bold transition"
          >
            ▶ 실행
          </button>
          <button
            onClick={handleResetCode}
            className="px-4 py-1 text-xs bg-red-700 hover:bg-red-700 rounded font-semibold transition"
          >
            입력한 값 삭제
          </button>
        </div>
      </div>

      {/* Block Buttons */}
      <div className="px-4 py-2 bg-gray-900 border-b border-gray-700">
        <div className="flex flex-wrap gap-2">
          {blocks.map((block) => (
            <button
              key={block.label}
              onClick={() => insertBlock(block.value)}
              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded font-mono transition"
              title={`"${block.value}" 삽입`}
            >
              {block.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Input */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          placeholder="여기에 한글 코드를 입력하세요..."
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
      <div className="px-4 py-2 bg-gray-900 border-t border-gray-700 text-xs text-gray-400">
        줄: {code.split("\n").length} | 글자: {code.length}
      </div>
    </div>
  );
}
