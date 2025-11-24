import { MessageData } from "./types";
import Message from "./Message";

interface ChatRoomProps {
  roomId: string;
  roomName: string;
  messages: MessageData[];
  dateLabel?: string;
}

export default function ChatRoom({ roomId, roomName, messages, dateLabel = "2024년 3월 15일 금요일" }: ChatRoomProps) {
  return (
    <div id={`채팅방${roomId}`} className="relative flex-1 flex flex-col bg-[#B2C7D9]">
      {/* ID 표시 */}
      <div className="absolute top-1 right-1 bg-blue-500 text-white font-bold text-sm px-1.5 py-0.5 rounded z-10">
        {`ID: 채팅방${roomId}`}
      </div>
      {/* 채팅방 헤더 */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <h3 className="font-semibold text-gray-900">{roomName}</h3>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 날짜 구분선 */}
        {dateLabel && (
          <div className="flex items-center justify-center">
            <div className="bg-black/10 rounded-full px-4 py-1 text-xs text-gray-900">{dateLabel}</div>
          </div>
        )}

        {/* 메시지 목록 */}
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>

      {/* 메시지 입력창 */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-yellow-400"
          />
          <button className="p-2 bg-yellow-400 hover:bg-yellow-500 rounded-full transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
