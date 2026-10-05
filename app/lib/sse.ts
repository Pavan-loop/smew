export type StreamEvent =
  | { type: "visitor"; visitor_id: string; protocol: number }
  | { type: "text"; text: string; language?: "en" | "kn" | "kanglish" }
  | { type: "error"; text: string }
  | {
      type: "action";
      action: "show_lead_form";
      language: "en" | "kn" | "kanglish";
    }
  | { type: "done" }
  | { type: "ping" };

function decodeFrame(frame: string): StreamEvent | null {
  const data = frame
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");
  if (!data) return null;
  const event = JSON.parse(data) as StreamEvent;
  if (
    !event ||
    !["visitor", "text", "error", "action", "done", "ping"].includes(event.type)
  ) {
    throw new Error("Invalid chatbot event");
  }
  if (
    (event.type === "text" || event.type === "error") &&
    typeof event.text !== "string"
  )
    throw new Error("Invalid message");
  return event;
}

export async function readSSE(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: StreamEvent) => void,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let complete = false;
  function drain(final: boolean) {
    const frames = buffer.split(/\r?\n\r?\n/);
    buffer = frames.pop() ?? "";
    if (final && buffer.trim()) {
      frames.push(buffer);
      buffer = "";
    }
    for (const frame of frames) {
      const event = decodeFrame(frame);
      if (event) {
        if (event.type === "done") complete = true;
        onEvent(event);
      }
    }
  }
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      if (buffer.length > 65536) throw new Error("Chat frame is too large");
      drain(false);
    }
    buffer += decoder.decode();
    drain(true);
    if (!complete) throw new Error("Chat response was interrupted");
  } finally {
    reader.releaseLock();
  }
}
