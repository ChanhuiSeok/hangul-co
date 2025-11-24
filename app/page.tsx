"use client";

import { useState } from "react";
import PreviewArea from "@/components/PreviewArea";
import EditorArea from "@/components/EditorArea";

export default function Home() {
  const [code, setCode] = useState("");
  const [commands, setCommands] = useState<any[]>([]);

  const handleRunCode = (executedCommands: any[]) => {
    console.log('🚀 명령어 실행:', executedCommands);
    setCommands(executedCommands);
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 shadow-lg">
        <h1 className="text-2xl font-bold">상서중학교 코딩체험 🧑‍💻</h1>
        <p className="text-sm text-blue-100 mt-1">나만의 웹사이트 만들기</p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Preview Area */}
        <div className="p-4">
          <PreviewArea code={code} commands={commands} />
        </div>

        {/* Editor Area */}
        <div className="h-64 border-t-2 border-gray-300">
          <EditorArea code={code} onCodeChange={setCode} onRunCode={handleRunCode} />
        </div>
      </div>
    </main>
  );
}
