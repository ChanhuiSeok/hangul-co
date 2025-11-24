import { ChatRoomData } from "./types";
import ChatListItem from "./ChatListItem";

interface ChatListProps {
  chatRooms: ChatRoomData[];
  onChatRoomClick?: (chatRoomId: string) => void;
}

export default function ChatList({ chatRooms, onChatRoomClick }: ChatListProps) {
  return (
    <div className="w-80 border-r border-gray-200 flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold">채팅</h2>
      </div>

      {/* 채팅방 목록 */}
      <div className="flex-1 overflow-y-auto">
        {chatRooms.map((chatRoom) => (
          <ChatListItem
            key={chatRoom.id}
            chatRoom={chatRoom}
            onClick={() => onChatRoomClick?.(chatRoom.id)}
          />
        ))}
      </div>
    </div>
  );
}
