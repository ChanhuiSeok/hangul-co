import { MessageData } from "@/components/chat/types";

/**
 * 현재 시간을 한국어 형식의 타임스탬프로 변환합니다
 * @returns "오전 10:30" 또는 "오후 3:45" 형식의 문자열
 */
export function formatTimestamp(date: Date = new Date()): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours < 12 ? "오전" : "오후";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = minutes.toString().padStart(2, "0");

  return `${period} ${displayHours}:${displayMinutes}`;
}

/**
 * 새로운 메시지 객체를 생성합니다
 * @param content 메시지 내용
 * @param isMine 내가 보낸 메시지인지 여부
 * @param options 추가 옵션 (senderName, senderAvatar, senderAvatarColor 등)
 * @returns 생성된 MessageData 객체
 */
export function createMessage(
  content: string,
  isMine: boolean,
  options?: {
    senderName?: string;
    senderAvatar?: string;
    senderAvatarColor?: string;
    timestamp?: string;
    date?: Date;
  }
): MessageData {
  return {
    id: generateMessageId(),
    content,
    timestamp: options?.timestamp ?? formatTimestamp(),
    date: options?.date ?? new Date(),
    isMine,
    senderName: options?.senderName,
    senderAvatar: options?.senderAvatar,
    senderAvatarColor: options?.senderAvatarColor,
  };
}

/**
 * 유니크한 메시지 ID를 생성합니다
 * @returns 타임스탬프 기반의 유니크한 ID
 */
function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 채팅방 메시지 배열에 새로운 메시지를 추가합니다
 * @param messages 기존 메시지 배열
 * @param newMessage 추가할 새로운 메시지
 * @returns 새 메시지가 추가된 배열 (불변성 유지)
 */
export function addMessage(messages: MessageData[], newMessage: MessageData): MessageData[] {
  return [...messages, newMessage];
}

/**
 * 메시지 배열에서 특정 ID의 메시지를 삭제합니다
 * @param messages 기존 메시지 배열
 * @param messageId 삭제할 메시지 ID
 * @returns 메시지가 삭제된 새로운 배열
 */
export function removeMessage(messages: MessageData[], messageId: string): MessageData[] {
  return messages.filter((msg) => msg.id !== messageId);
}

/**
 * 메시지 배열에서 특정 ID의 메시지를 수정합니다
 * @param messages 기존 메시지 배열
 * @param messageId 수정할 메시지 ID
 * @param updates 업데이트할 내용
 * @returns 메시지가 수정된 새로운 배열
 */
export function updateMessage(
  messages: MessageData[],
  messageId: string,
  updates: Partial<Omit<MessageData, "id">>
): MessageData[] {
  return messages.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg));
}
