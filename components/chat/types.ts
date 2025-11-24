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
  isMine: boolean;
  senderName?: string;
  senderAvatar?: string;
  senderAvatarColor?: string;
}
