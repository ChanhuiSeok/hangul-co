export interface HistoryItem {
  code: string;
  timestamp: number;
}

const HISTORY_KEY = "hangul-code-history";
const MAX_HISTORY_ITEMS = 20;

export function saveToHistory(code: string): void {
  if (!code.trim()) return;

  try {
    const history = getHistory();
    const newItem: HistoryItem = {
      code,
      timestamp: Date.now(),
    };

    // 새 항목을 맨 앞에 추가
    const updatedHistory = [newItem, ...history];

    // 최대 개수로 제한
    const limitedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error("히스토리 저장 실패:", error);
  }
}

export function getHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as HistoryItem[];
  } catch (error) {
    console.error("히스토리 불러오기 실패:", error);
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("히스토리 삭제 실패:", error);
  }
}

export function deleteHistoryItem(timestamp: number): void {
  try {
    const history = getHistory();
    const updatedHistory = history.filter((item) => item.timestamp !== timestamp);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("히스토리 항목 삭제 실패:", error);
  }
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  // 날짜 표시
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${month}/${day} ${hours}:${minutes.toString().padStart(2, "0")}`;
}
