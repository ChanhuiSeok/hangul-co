// 한글 코드 파싱 유틸리티

export interface Command {
  object: string; // 예: "채팅방"
  id?: string; // 예: "1"
  action: string; // 예: "열기", "보여주기", "보내기"
  argument?: string; // 예: "안녕하세요" (메시지 내용)
}

export interface EventBinding {
  source: {
    object: string; // 예: "채팅목록"
    id?: string; // 예: "1"
    event: string; // 예: "클릭"
  };
  target: {
    object: string; // 예: "채팅방"
    id?: string; // 예: "1"
    action: string; // 예: "열기"
    argument?: string;
  };
}

/**
 * 객체.동작 형식의 한글 코드를 파싱
 * 예: "채팅방1.열기" 또는 "채팅목록1.클릭=채팅방1.열기"
 */
export function parseObjectDotNotation(code: string): { commands: Command[]; eventBindings: EventBinding[] } {
  const commands: Command[] = [];
  const eventBindings: EventBinding[] = [];
  const lines = code.split("\n").filter((line) => line.trim());

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // 이벤트 바인딩 형식인지 확인 (=이 포함된 경우)
    if (trimmedLine.includes("=")) {
      const binding = parseEventBinding(trimmedLine);
      if (binding) {
        eventBindings.push(binding);
      }
    } else {
      // 일반 명령어
      const parsed = parseObjectExpression(trimmedLine);
      if (parsed) {
        commands.push(parsed);
      }
    }
  });

  return { commands, eventBindings };
}

/**
 * 이벤트 바인딩 표현식을 파싱
 * 예: "채팅목록1.클릭=채팅방1.열기"
 */
function parseEventBinding(expr: string): EventBinding | null {
  const parts = expr.split("=").map((p) => p.trim());
  if (parts.length !== 2) return null;

  const [sourcePart, targetPart] = parts;

  // 소스 파싱 (예: "채팅목록1.클릭")
  const sourceDotParts = sourcePart.split(".");
  if (sourceDotParts.length < 2) return null;

  const sourceObjPart = sourceDotParts[0].trim();
  const sourceEventPart = sourceDotParts[1].trim();

  const sourceObjMatch = sourceObjPart.match(/([가-힣]+)(\d+)?/);
  if (!sourceObjMatch) return null;

  const sourceObject = sourceObjMatch[1];
  const sourceId = sourceObjMatch[2];

  // 타겟 파싱 (예: "채팅방1.열기")
  const targetCmd = parseObjectExpression(targetPart);
  if (!targetCmd) return null;

  return {
    source: {
      object: sourceObject,
      id: sourceId,
      event: sourceEventPart,
    },
    target: {
      object: targetCmd.object,
      id: targetCmd.id,
      action: targetCmd.action,
      argument: targetCmd.argument,
    },
  };
}

/**
 * "채팅방1.열기" 또는 "채팅방1.보내기("안녕하세요")" 같은 표현식을 파싱
 */
function parseObjectExpression(expr: string): Command | null {
  // "." 기준으로 분리
  const parts = expr.split(".");
  if (parts.length < 2) return null;

  const objectPart = parts[0].trim(); // "채팅방1"
  let actionPart = parts[1].trim(); // "열기" 또는 "보내기("안녕하세요")"

  // 객체 이름과 ID 분리
  const objMatch = objectPart.match(/([가-힣]+)(\d+)?/);
  if (!objMatch) return null;

  const object = objMatch[1]; // "채팅방"
  const id = objMatch[2]; // "1" (optional)

  // 괄호 안의 인자 추출 (예: 보내기("안녕하세요"))
  let argument: string | undefined;
  const argMatch = actionPart.match(/([가-힣]+)\(["'](.+?)["']\)/);

  if (argMatch) {
    actionPart = argMatch[1]; // "보내기"
    argument = argMatch[2]; // "안녕하세요"
  }

  return {
    object,
    id,
    action: actionPart,
    argument,
  };
}

/**
 * 파싱된 명령어를 실행 가능한 형태로 변환
 */
export function convertToExecutableCommands(commands: Command[]) {
  return commands
    .map((cmd) => {
      // 채팅방 열기/보여주기 패턴
      if (cmd.object === "채팅방" && cmd.id) {
        const validActions = ["열기", "보여주기", "선택", "표시"];
        if (validActions.includes(cmd.action)) {
          return {
            type: "selectChatRoom" as const,
            roomId: cmd.id,
          };
        }

        // 채팅방 메시지 보내기 패턴
        const sendActions = ["전송"];
        if (sendActions.includes(cmd.action) && cmd.argument) {
          return {
            type: "sendMessage" as const,
            roomId: cmd.id,
            message: cmd.argument,
          };
        }
      }

      return null;
    })
    .filter(Boolean);
}
