import type { ChatRoomData, MessageData } from "@/components/chat/types";

export function formatTimestamp(date: Date = new Date()): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours < 12 ? "오전" : "오후";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = minutes.toString().padStart(2, "0");

  return `${period} ${displayHours}:${displayMinutes}`;
}

export const COLOR_MAP = {
  yellow: "bg-yellow-400",
  green: "bg-green-500",
  purple: "bg-purple-400",
  blue: "bg-blue-400",
  red: "bg-red-400",
  orange: "bg-orange-400",
  pink: "bg-pink-400",
} as const;

export const FRIEND = {
  FIRST: "기헌",
  SECOND: "현우",
  THIRD: "우리 가족",
} as const;

// 지민이와의 대화
export const messagesJimin: MessageData[] = [
  {
    id: "1",
    content: "야 너 어제 수학쌤이 내준 숙제 했어??",
    timestamp: formatTimestamp(new Date("2025-11-24T07:28:00")),
    date: new Date("2025-11-24T07:28:00"),
    isMine: false,
    senderName: FRIEND.FIRST,
    senderAvatar: FRIEND.FIRST.charAt(0),
    senderAvatarColor: "bg-yellow-400",
  },
  {
    id: "2",
    content: "ㅇㅇ 방금 다 했는데 너무 어려웠음 ㅠㅠ",
    timestamp: formatTimestamp(new Date("2025-11-24T07:29:00")),
    date: new Date("2025-11-24T07:29:00"),
    isMine: true,
  },
  {
    id: "3",
    content: "헐 나 아직 안했는데 ㅋㅋㅋ",
    timestamp: formatTimestamp(new Date("2025-11-24T07:29:00")),
    date: new Date("2025-11-24T07:29:00"),
    isMine: false,
    senderAvatar: FRIEND.FIRST.charAt(0),
    senderAvatarColor: "bg-yellow-400",
  },
  {
    id: "4",
    content: "5번 문제 진짜 모르겠어 ㅜㅜ 이따 같이 풀어보자",
    timestamp: formatTimestamp(new Date("2025-11-24T07:30:00")),
    date: new Date("2025-11-24T07:30:00"),
    isMine: false,
    senderAvatar: FRIEND.FIRST.charAt(0),
    senderAvatarColor: "bg-yellow-400",
  },
  {
    id: "5",
    content: "ㅇㅋㅇㅋ 오늘 아침 일찍 와라",
    timestamp: formatTimestamp(new Date("2025-11-24T07:31:00")),
    date: new Date("2025-11-24T07:31:00"),
    isMine: true,
  },
];

// 현우와의 대화
export const messagesHyunwoo: MessageData[] = [
  {
    id: "1",
    content: "야 롤 할래?",
    timestamp: "오후 8:30",
    date: new Date("2025-11-20T20:30:00"),
    isMine: false,
    senderName: FRIEND.SECOND,
    senderAvatar: FRIEND.SECOND.charAt(0),
    senderAvatarColor: "bg-green-400",
  },
  {
    id: "2",
    content: "오 ㄱㄱ",
    timestamp: "오후 8:31",
    date: new Date("2025-11-20T20:31:00"),
    isMine: true,
  },
  {
    id: "3",
    content: "근데 숙제 다 했어?",
    timestamp: "오후 8:31",
    date: new Date("2025-11-20T20:31:00"),
    isMine: true,
  },
  {
    id: "4",
    content: "ㅇㅇ 다 했음 ㅋㅋ",
    timestamp: "오후 8:32",
    date: new Date("2025-11-20T20:32:00"),
    isMine: false,
    senderAvatar: FRIEND.SECOND.charAt(0),
    senderAvatarColor: "bg-green-400",
  },
  {
    id: "5",
    content: "그럼 한 판만 ㄱㄱ",
    timestamp: "오후 8:33",
    date: new Date("2025-11-20T20:33:00"),
    isMine: true,
  },
];

// 우리 가족 💕 단톡방 대화
export const messagesFamily: MessageData[] = [
  {
    id: "1",
    content: "길동아 오늘 저녁 몇 시에 집에 와?",
    timestamp: "오후 5:00",
    date: new Date("2025-11-22T17:00:00"),
    isMine: false,
    senderName: "엄마",
    senderAvatar: "엄",
    senderAvatarColor: "bg-yellow-400",
  },
  {
    id: "2",
    content: "7시쯤 갈게요~",
    timestamp: "오후 5:05",
    date: new Date("2025-11-22T17:05:00"),
    isMine: true,
  },
  {
    id: "3",
    content: "오케이! 저녁 뭐 먹고 싶어?",
    timestamp: "오후 5:06",
    date: new Date("2025-11-22T17:06:00"),
    isMine: false,
    senderName: "엄마",
    senderAvatar: "엄",
    senderAvatarColor: "bg-yellow-400",
  },
  {
    id: "4",
    content: "치킨!!! 🍗",
    timestamp: "오후 5:07",
    date: new Date("2025-11-22T17:07:00"),
    isMine: true,
  },
  {
    id: "5",
    content: "나도 치킨 찬성 ㅋㅋㅋ",
    timestamp: "오후 5:08",
    date: new Date("2025-11-22T17:08:00"),
    isMine: false,
    senderName: "누나",
    senderAvatar: "누",
    senderAvatarColor: "bg-purple-400",
  },
  {
    id: "6",
    content: "그럼 치킨 시킬게~",
    timestamp: "오후 5:10",
    date: new Date("2025-11-22T17:10:00"),
    isMine: false,
    senderName: "엄마",
    senderAvatar: "엄",
    senderAvatarColor: "bg-yellow-400",
  },
  {
    id: "7",
    content: "우리 가족 최고 👍",
    timestamp: "오후 5:11",
    date: new Date("2025-11-22T17:11:00"),
    isMine: true,
  },
];

// 채팅방 목록
export const sampleChatRooms: ChatRoomData[] = [
  {
    id: "1",
    name: "기헌",
    avatar: "기",
    avatarColor: "bg-yellow-400",
    lastMessage: "ㅇㅋㅇㅋ 내일 아침 일찍 와!",
    lastMessageTime: "오후 5:31",
    unreadCount: 1,
    isSelected: true,
  },
  {
    id: "2",
    name: "현우",
    avatar: "현",
    avatarColor: "bg-green-400",
    lastMessage: "그럼 한 판만 하자!",
    lastMessageTime: "오후 8:33",
    unreadCount: 0,
    isSelected: false,
  },
  {
    id: "3",
    name: "우리 가족 💕",
    avatar: "🏠",
    avatarColor: "bg-purple-400",
    lastMessage: "우리 가족 최고 👍",
    lastMessageTime: "오후 5:11",
    unreadCount: 2,
    isSelected: false,
  },
];

// 각 채팅방의 메시지 매핑
export const chatRoomMessages: Record<string, MessageData[]> = {
  "1": messagesJimin,
  "2": messagesHyunwoo,
  "3": messagesFamily,
};
