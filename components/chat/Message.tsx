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
        <div className="text-black rounded-lg max-w-xs overflow-hidden">
          {message.imageUrl ? (
            <img src={message.imageUrl} alt="그림 메시지" className="w-full h-auto" />
          ) : (
            <p className="text-sm bg-yellow-300 p-2">{message.content}</p>
          )}
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
          <div className="bg-white text-black rounded-lg shadow-sm max-w-xs overflow-hidden">
            {message.imageUrl ? (
              <img src={message.imageUrl} alt="그림 메시지" className="w-full h-auto" />
            ) : (
              <p className="text-sm p-2">{message.content}</p>
            )}
          </div>
          <span className="text-xs text-gray-600 ml-2">{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
