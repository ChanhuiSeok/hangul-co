"use client";

import { useState } from "react";
import PreviewArea from "@/components/PreviewArea";
import EditorArea from "@/components/EditorArea";
import { EventBinding } from "@/lib/parser";

export default function Home() {
  const [code, setCode] = useState("");
  const [commands, setCommands] = useState<any[]>([]);
  const [eventBindings, setEventBindings] = useState<EventBinding[]>([]);

  const handleRunCode = (result: { commands: any[]; eventBindings: EventBinding[] }) => {
    console.log("🚀 명령어 실행:", result.commands);
    console.log("🔗 이벤트 바인딩:", result.eventBindings);
    setCommands(result.commands);
    setEventBindings(result.eventBindings);
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-2 px-4 shadow-lg">
        <h1 className="text-xl font-bold">상서중학교 - 나만의 채팅 만들기 🧑‍💻</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Preview Area */}
        <div className="p-4">
          <PreviewArea code={code} commands={commands} eventBindings={eventBindings} />
        </div>

        {/* Editor Area */}
        <div className="h-64 border-t-2 border-gray-300">
          <EditorArea code={code} onCodeChange={setCode} onRunCode={handleRunCode} />
        </div>
      </div>
    </main>
  );
}
