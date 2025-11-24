"use client";

import { useState, useEffect } from "react";
import { getHistory, clearHistory, deleteHistoryItem, formatTimestamp, HistoryItem } from "@/lib/historyUtils";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHistory: (code: string) => void;
}

export default function HistoryPanel({ isOpen, onClose, onSelectHistory }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = () => {
    setHistory(getHistory());
  };

  const handleClearAll = () => {
    if (confirm("모든 실행 내역을 삭제하시겠습니까?")) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleDelete = (timestamp: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHistoryItem(timestamp);
    loadHistory();
  };

  const handleSelect = (code: string) => {
    onSelectHistory(code);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Sidebar Panel */}
      <div className="fixed top-0 right-0 h-full w-[500px] bg-gray-900 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">📜 실행 내역</h2>
          <div className="flex gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition"
              >
                전체 삭제
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition"
            >
              닫기
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <p>실행 내역이 없습니다.</p>
              <p className="text-sm mt-2">코드를 실행하면 여기에 저장됩니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.timestamp}
                  onClick={() => handleSelect(item.code)}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:bg-gray-750 hover:border-gray-600 cursor-pointer transition group"
                >
                  {/* Timestamp and Delete */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">{formatTimestamp(item.timestamp)}</span>
                    <button
                      onClick={(e) => handleDelete(item.timestamp, e)}
                      className="text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition"
                    >
                      삭제
                    </button>
                  </div>

                  {/* Code Preview */}
                  <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap break-words line-clamp-4 bg-gray-900 p-2 rounded">
                    {item.code}
                  </pre>

                  {/* Stats */}
                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    <span>{item.code.split("\n").length} 줄</span>
                    <span>{item.code.length} 글자</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
          총 {history.length}개의 내역 (최대 20개 저장)
        </div>
      </div>
    </>
  );
}
