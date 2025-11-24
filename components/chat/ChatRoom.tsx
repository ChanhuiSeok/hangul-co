import { MessageData } from "./types";
import Message from "./Message";

interface ChatRoomProps {
  roomId: string;
  roomName: string;
  messages: MessageData[];
}

// 날짜 포맷 함수
function formatDateLabel(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const weekday = weekdays[date.getDay()];

  return `${year}년 ${month}월 ${day}일 ${weekday}`;
}

// 두 날짜가 같은 날인지 확인
function isSameDay(date1: Date | undefined, date2: Date | undefined): boolean {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default function ChatRoom({ roomId, roomName, messages }: ChatRoomProps) {
  return (
    <div id={`채팅방${roomId}`} className="relative flex-1 flex flex-col bg-[#B2C7D9]">
      {/* ID 표시 */}
      <div className="absolute top-1 right-1 bg-blue-700 text-white font-bold text-sm px-1.5 py-0.5 rounded z-10">
        ID: <span className="text-yellow-200">채팅방{roomId}</span>
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
        {/* 메시지 목록 - 날짜가 바뀔 때마다 dateLabel 표시 */}
        {messages.map((message, index) => {
          const prevMessage = index > 0 ? messages[index - 1] : null;
          const showDateLabel = index === 0 || !isSameDay(prevMessage?.date, message.date);

          return (
            <div key={message.id}>
              {/* 날짜가 바뀌었거나 첫 메시지인 경우 날짜 구분선 표시 */}
              {showDateLabel && message.date && (
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-black/10 rounded-full px-4 py-1 text-xs text-gray-900">
                    {formatDateLabel(message.date)}
                  </div>
                </div>
              )}
              <Message message={message} />
            </div>
          );
        })}
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
