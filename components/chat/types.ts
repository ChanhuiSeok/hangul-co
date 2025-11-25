export interface ChatRoomData {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isSelected?: boolean;
}

export interface MessageData {
  id: string;
  content: string;
  timestamp: string;
  date?: Date; // 메시지 날짜
  isMine: boolean;
  senderName?: string;
  senderAvatar?: string;
  senderAvatarColor?: string;
  imageUrl?: string; // 그림 메시지 이미지 URL
}
