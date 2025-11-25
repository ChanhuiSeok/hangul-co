"use client";

import { type Dispatch, type SetStateAction, useState, useRef, useEffect } from "react";
import { MessageData } from "./types";
import Message from "./Message";
import DrawingCanvas from "./DrawingCanvas";
import { FRIEND, FRIEND_AVATAR_COLOR } from "@/constants/chatData";

interface ChatRoomProps {
  roomId: string;
  roomName: string;
  messages: MessageData[];
  setMessages: Dispatch<SetStateAction<Record<string, MessageData[]>>>;
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

const PRAISE_MESSAGES = {
  "1": [
    "갑자기??",
    "갑자기??",
    "이건 무슨 이모티콘이야",
    "이건 뭐지",
    "???",
    "???!?!",
    "무슨 그림이야",
    "잘.그.렸.어.요",
    "숙제 같이 하자..",
    "너가 직접 그렸다고?",
    "나 좀 바쁘다...",
    "나 좀 바쁘다...",
    "🍀🍀[행운 당첨] 얼른 손들고 말해주세요!🍀🍀",
  ],
  "2": [
    "롤이나 하자",
    "롤이나 하자",
    "겜하자",
    "아 야!",
    "먼데 먼데",
    "장난하냐~~",
    "뭐냐고~",
    "ㅇㅇㅇㅇㅇㅇ..",
    "ㅎㅇㅎㅇ",
    "먼데 먼데",
    "이모티콘 자랑금지",
    "이모티콘 자랑금지",
    "🍀🍀[행운 당첨] 얼른 손들고 말해주세요!🍀🍀",
  ],
  "3": [
    "오 대박 👍",
    "오 대박 👍",
    "감동받긴 했다 ㅠㅠ",
    "울뻔함 ㅠㅠ",
    "재능있다 👏 계속 그려보자~~",
    "킵고잉",
    "킵고잉ㄱㄱㄱ",
    "귀.여.워.요.잘.그.려.요.",
    "다시 한번 그려봐 ㅋㅋㅋㅋ",
    "계속 이모티콘만 보낼거야?",
    "칭찬한다~ 나 간다~ ✨",
    "칭찬한다~ 나 간다~ ✨",
    "🍀🍀[행운 당첨] 얼른 손들고 말해주세요!🍀🍀",
  ],
} as const;

export default function ChatRoom({ roomId, roomName, messages, setMessages }: ChatRoomProps) {
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    // 이미지 로드를 기다리기 위해 약간 지연 후 스크롤
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  // 이미지 로드 완료 시 추가 스크롤
  useEffect(() => {
    const handleImageLoad = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    window.addEventListener("message-image-loaded", handleImageLoad);
    return () => window.removeEventListener("message-image-loaded", handleImageLoad);
  }, []);

  // 그림 메시지 전송 핸들러
  const handleSendDrawing = (imageUrl: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const newMessage: MessageData = {
      id: `msg-${Date.now()}`,
      content: "이모티콘",
      imageUrl: imageUrl,
      timestamp: timeString,
      date: now,
      isMine: true,
    };

    setMessages((prev) => ({ ...prev, [roomId]: [...(prev[roomId] || []), newMessage] }));

    // 1-2초 후 상대방의 칭찬 메시지 자동 전송
    const delay = Math.random() * 1500 + 100; //  랜덤 딜레이
    setTimeout(() => {
      const praiseData = PRAISE_MESSAGES[roomId as keyof typeof PRAISE_MESSAGES];
      const praiseMessage = praiseData[Math.floor(Math.random() * praiseData.length)];
      const praiseTime = new Date();
      const praiseTimeString = praiseTime.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const senderAvatar =
        roomId === "1" ? FRIEND.FIRST.charAt(0) : roomId === "2" ? FRIEND.SECOND.charAt(0) : FRIEND.THIRD.charAt(0);
      const senderAvatarColor =
        roomId === "1"
          ? FRIEND_AVATAR_COLOR.FIRST
          : roomId === "2"
          ? FRIEND_AVATAR_COLOR.SECOND
          : FRIEND_AVATAR_COLOR.THIRD;

      const praiseMessageData: MessageData = {
        id: `msg-${Date.now()}`,
        content: praiseMessage,
        timestamp: praiseTimeString,
        date: praiseTime,
        isMine: false,
        senderAvatar: senderAvatar,
        senderAvatarColor: senderAvatarColor,
      };

      setMessages((prev) => ({ ...prev, [roomId]: [...(prev[roomId] || []), praiseMessageData] }));
    }, delay);
  };

  return (
    <div id={`채팅방${roomId}`} className="w-full relative overflow-hidden flex-1 flex flex-col bg-[#B2C7D9]">
      {/* ID 표시 */}
      <div className="absolute top-1 right-1 bg-blue-700 text-white font-bold text-sm px-1.5 py-0.5 rounded z-10">
        ID: <span className="text-yellow-200">채팅방{roomId}</span>
      </div>
      {/* 채팅방 헤더 */}
      <div className="px-4 py-2 flex items-center justify-between">
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
        {/* 스크롤 타겟 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력창 */}
      <div className="bg-white border-t border-gray-200 p-2">
        <div className="flex items-center gap-2">
          {/* 채팅방 메뉴 */}
          <button className="p-2 hover:bg-gray-100 rounded" onClick={() => setIsDrawingOpen(true)}>
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

      {/* 그림 그리기 모달 */}
      {isDrawingOpen && <DrawingCanvas onClose={() => setIsDrawingOpen(false)} onSend={handleSendDrawing} />}
    </div>
  );
}
