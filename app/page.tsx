"use client";

import { useState } from "react";
import PreviewArea from "@/components/PreviewArea";
import EditorArea from "@/components/EditorArea";
import HistoryPanel from "@/components/HistoryPanel";
import { EventBinding } from "@/lib/parser";

// 정답 케이스 타입
type AnswerCase = "click1" | "click2" | "click3" | "send1" | "send2" | "send3";

export default function Home() {
  const [code, setCode] = useState("");
  const [commands, setCommands] = useState<any[]>([]);
  const [eventBindings, setEventBindings] = useState<EventBinding[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // 점수 및 정답 체크 상태
  const [score, setScore] = useState(0);
  const [completedCases, setCompletedCases] = useState<Set<AnswerCase>>(new Set());

  const handleRunCode = (result: { commands: any[]; eventBindings: EventBinding[] }) => {
    console.log("🚀 명령어 실행:", result.commands);
    console.log("🔗 이벤트 바인딩:", result.eventBindings);
    setCommands(result.commands);
    setEventBindings(result.eventBindings);
  };

  return (
    <main className="flex flex-col h-full bg-gray-50 overflow-y-scroll">
      {/* Header */}
      <header className="bg-indigo-700 text-white px-4 py-1 shadow-lg flex items-center justify-between">
        <h1 className="text-md font-bold">상서중학교 - 나만의 채팅 만들기 🧑‍💻</h1>
        <div className="flex items-center gap-4">
          <div className="px-2 py-1 bg-yellow-500 text-black rounded-lg font-bold text-sm">점수: {score}점</div>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="px-2 py-1 text-sm bg-slate-700 border border-slate-400 rounded-lg font-semibold shadow-md"
          >
            📜 실행 내역
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Preview Area */}
        <div className="p-1 h-[480px]">
          <PreviewArea code={code} commands={commands} eventBindings={eventBindings} />
        </div>

        {/* Editor Area */}
        <div className="h-64 border-t-2 border-gray-300 h-[320px]">
          <EditorArea
            code={code}
            onCodeChange={setCode}
            onRunCode={handleRunCode}
            completedCases={completedCases}
            onScoreUpdate={(newCases, points) => {
              setCompletedCases(newCases);
              setScore((prev) => prev + points);
            }}
          />
        </div>
      </div>

      {/* History Panel */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectHistory={(historyCode) => {
          setCode(historyCode);
        }}
      />
    </main>
  );
}
