import { MessageData } from "./types";

interface MessageProps {
  message: MessageData;
}

export default function Message({ message }: MessageProps) {
  const handleImageLoad = () => {
    // 이미지 로드 완료 후 스크롤을 위한 커스텀 이벤트 발생
    window.dispatchEvent(new CustomEvent("message-image-loaded"));
  };

  if (message.isMine) {
    // 내 메시지
    return (
      <div className="flex items-end justify-end">
        <span className="text-xs text-gray-600 mr-2">{message.timestamp}</span>
        <div className="text-black rounded-lg max-w-xs overflow-hidden">
          {message.imageUrl ? (
            <img src={message.imageUrl} alt="그림 메시지" className="w-[210px] h-auto" onLoad={handleImageLoad} />
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
        style={{ backgroundColor: message.senderAvatarColor }}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-2`}
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
