import { NextResponse } from "next/server";
import { claude, CLAUDE_MODEL, CHAT_SYSTEM_PROMPT } from "@/lib/claude";
import { keywordCannedReply } from "@/lib/ai-helpers";

export const dynamic = "force-dynamic";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
}

const MAX_HISTORY = 12;

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    (v.role === "user" || v.role === "assistant") &&
    typeof v.content === "string"
  );
}

function lastUserMessage(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { error: "messages array is required" },
      { status: 400 }
    );
  }

  const valid = body.messages.filter(isChatMessage);
  if (valid.length === 0) {
    return NextResponse.json(
      { error: "No valid messages supplied" },
      { status: 400 }
    );
  }

  // Trim to the most recent N messages to keep the prompt compact.
  const trimmed = valid.slice(-MAX_HISTORY);
  const lastUser = lastUserMessage(trimmed);

  // No API key configured — return a sensible canned reply.
  if (!claude) {
    return NextResponse.json({ reply: keywordCannedReply(lastUser) });
  }

  try {
    const response = await claude.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 400,
      system: CHAT_SYSTEM_PROMPT,
      messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const reply =
      textBlock && textBlock.type === "text"
        ? textBlock.text.trim()
        : keywordCannedReply(lastUser);

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({
      reply:
        "I'm having a brief moment of difficulty reaching the catalogue. Could you ask again in a moment?",
    });
  }
}
