"use client";

import { ChangeEvent } from "react";
import { parseObjectDotNotation, convertToExecutableCommands } from "@/lib/parser";

interface EditorAreaProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRunCode?: (commands: any[]) => void;
}

export default function EditorArea({ code, onCodeChange, onRunCode }: EditorAreaProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onCodeChange(e.target.value);
  };

  const handleRunCode = () => {
    try {
      // 한글 코드 파싱
      const actions = parseObjectDotNotation(code);
      const commands = convertToExecutableCommands(actions);
      console.log("actions", actions);

      console.log("📝 파싱된 명령어:", actions);
      console.log("✅ 실행 가능한 명령어:", commands);

      if (commands.length === 0) {
        alert("실행할 명령어가 없습니다!");
        return;
      }

      // 부모 컴포넌트로 명령어 전달
      onRunCode?.(commands);
      // alert(`✅ ${commands.length}개 명령어가 실행되었습니다!`);
    } catch (error) {
      console.error("파싱 오류:", error);
      alert("코드 실행 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
        <h2 className="text-sm font-semibold">에디터</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRunCode}
            className="px-4 py-1 text-xs bg-green-600 hover:bg-green-500 rounded font-semibold transition"
          >
            ▶ 실행
          </button>
        </div>
      </div>

      {/* Editor Input */}
      <div className="flex-1 relative">
        <textarea
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
