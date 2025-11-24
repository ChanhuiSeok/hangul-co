"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import ChatList from "./chat/ChatList";
import ChatRoom from "./chat/ChatRoom";
import { sampleChatRooms, chatRoomMessages as initialChatRoomMessages } from "@/constants/chatData";
import { createMessage } from "@/lib/chatUtils";
import { MessageData } from "./chat/types";

interface PreviewAreaProps {
  code: string;
  commands?: any[];
}

export default function PreviewArea({ code, commands = [] }: PreviewAreaProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState("1");
  const [chatRoomMessages, setChatRoomMessages] = useState<Record<string, MessageData[]>>(initialChatRoomMessages);
  const [isChatRoomOpen, setIsChatRoomOpen] = useState(false);

  // 명령어 실행
  useEffect(() => {
    if (commands.length === 0) return;

    console.log("🎯 명령어 실행:", commands);

    commands.forEach((command) => {
      if (command.type === "selectChatRoom") {
        console.log(`📱 채팅방 ${command.roomId}번으로 전환`);
        setSelectedChatRoomId(command.roomId);
        setIsChatRoomOpen(true);
      } else if (command.type === "sendMessage") {
        console.log(`💬 채팅방 ${command.roomId}번에 메시지 전송: ${command.message}`);

        // 새 메시지 생성 (내가 보낸 메시지)
        const newMessage = createMessage(command.message, true);

        // 해당 채팅방의 메시지 배열에 추가
        setChatRoomMessages((prev) => ({
          ...prev,
          [command.roomId]: [...(prev[command.roomId] || []), newMessage],
        }));

        // 메시지를 보낸 채팅방으로 자동 전환
        // setSelectedChatRoomId(command.roomId);
      }
    });
  }, [commands]);

  // 선택된 채팅방 정보 가져오기
  const selectedChatRoom = useMemo(() => {
    return sampleChatRooms.find((room) => room.id === selectedChatRoomId);
  }, [selectedChatRoomId]);

  // 선택된 채팅방의 메시지 가져오기
  const selectedMessages = useMemo(() => {
    return chatRoomMessages[selectedChatRoomId] || [];
  }, [selectedChatRoomId, chatRoomMessages]);

  // 채팅방 목록에서 선택 상태 업데이트
  const updatedChatRooms = useMemo(() => {
    return sampleChatRooms.map((room) => ({
      ...room,
      isSelected: room.id === selectedChatRoomId,
    }));
  }, [selectedChatRoomId]);

  // 채팅방 클릭 핸들러
  const handleChatRoomClick = (id: string) => {
    // setSelectedChatRoomId(id);
    // setIsChatRoomOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 브라우저 스타일 컨테이너 */}
      <div className="flex-1 flex flex-col max-h-[700px] bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        {/* 브라우저 상단 바 */}
        <div className="bg-gray-100 border-b border-gray-300">
          {/* 탭 영역 */}
          <div className="flex items-center px-2 pt-2">
            <div className="flex items-center gap-2 bg-white border border-b-0 border-gray-300 rounded-t-lg px-4 py-2 min-w-[200px]">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm text-gray-700 truncate">미리보기</span>
            </div>
          </div>

          {/* 주소창 영역 */}
          <div className="flex items-center gap-2 px-3 py-2">
            {/* 뒤로/앞으로/새로고침 버튼 */}
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-1.5 rounded text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="p-1.5 rounded text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>

            {/* 주소창 */}
            <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-full px-4 py-1.5">
              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-sm text-gray-600 truncate">localhost:3000/preview</span>
            </div>

            {/* 메뉴 버튼 */}
            <button className="p-1.5 rounded text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 브라우저 콘텐츠 영역 */}
        <div
          ref={previewRef}
          className="flex-1 bg-white overflow-hidden max-h-[600px] min-h-[600px]"
          id="preview-container"
        >
          {/* 카카오톡 스타일 채팅 UI */}
          <div className="flex h-full">
            <ChatList chatRooms={updatedChatRooms} onChatRoomClick={handleChatRoomClick} />
            {isChatRoomOpen && selectedChatRoom && (
              <ChatRoom
                roomId={selectedChatRoomId}
                roomName={selectedChatRoom.name}
                messages={selectedMessages}
                dateLabel="2025년 11월 28일 금요일"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
