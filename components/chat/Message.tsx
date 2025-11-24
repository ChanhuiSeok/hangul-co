import { MessageData } from "./types";

interface MessageProps {
  message: MessageData;
}

export default function Message({ message }: MessageProps) {
  if (message.isMine) {
    // 내 메시지
    return (
      <div className="flex items-end justify-end">
        <span className="text-xs text-gray-600 mr-2">{message.timestamp}</span>
        <div className="bg-yellow-300 rounded-lg p-2 shadow-sm max-w-xs">
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    );
  }

  // 상대방 메시지
  return (
    <div className="flex items-start">
      <div
        className={`w-10 h-10 rounded-full ${message.senderAvatarColor} flex items-center justify-center text-white font-semibold mr-2`}
      >
        {message.senderAvatar}
      </div>
      <div>
        {message.senderName && <div className="text-xs text-gray-700 mb-1">{message.senderName}</div>}
        <div className="flex items-end">
          <div className="bg-white rounded-lg p-2 shadow-sm max-w-xs">
            <p className="text-sm">{message.content}</p>
          </div>
          <span className="text-xs text-gray-600 ml-2">{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
