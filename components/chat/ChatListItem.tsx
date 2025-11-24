import { ChatRoomData, MessageData } from "./types";

interface ChatListItemProps {
  chatRoom: ChatRoomData;
  chatMessages: MessageData[];
  onClick?: () => void;
}

export default function ChatListItem({ chatRoom, chatMessages, onClick }: ChatListItemProps) {
  return (
    <div
      id={`채팅목록${chatRoom.id}`}
      onClick={onClick}
      className={`relative flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
        chatRoom.isSelected ? "bg-yellow-50" : ""
      }`}
    >
      {/* ID 표시 */}
      <div className="absolute top-1 right-1 bg-blue-700 text-white font-bold text-sm px-1.5 py-0.5 rounded">
        ID: <span className="text-yellow-200">채팅목록{chatRoom.id}</span>
      </div>
      <div
        className={`w-12 h-12 rounded-full ${chatRoom.avatarColor} flex items-center justify-center text-white font-semibold mr-3`}
      >
        {chatRoom.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-gray-900">{chatRoom.name}</span>
          <span className="text-xs text-gray-500">{chatRoom.lastMessageTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">{chatMessages[chatMessages.length - 1]?.content}</p>
          {chatRoom.unreadCount > 0 && (
            <span className="ml-2 bg-yellow-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {chatRoom.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
