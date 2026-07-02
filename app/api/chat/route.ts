import { NextResponse } from "next/server";
import { createLocalReply } from "@/lib/local-replies";
import { getOpenAIClient } from "@/lib/openai-client";
import { NEWMB_SYSTEM_PROMPT } from "@/lib/newmb-prompt";

export const runtime = "nodejs";

type ChatRequest = {
  question?: string;
};

function sanitizeQuestion(value: unknown) {
  if (typeof value !== "string") return "";

  return value
    .replace(/\0/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}

function sanitizeAnswer(value: string) {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n")
    .trim()
    .slice(0, 800);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;
    const question = sanitizeQuestion(body.question);

    if (!question) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    const client = getOpenAIClient();

    if (!client) {
      return NextResponse.json({
        answer: createLocalReply(question),
        source: "local"
      });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: NEWMB_SYSTEM_PROMPT,
      input: question,
      max_output_tokens: 180
    });

    const answer =
      typeof response.output_text === "string" && response.output_text.trim()
        ? sanitizeAnswer(response.output_text)
        : createLocalReply(question);

    return NextResponse.json({
      answer,
      source: "openai"
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        answer:
          "Reset\n\n지금은 연결이 흔들립니다.\n전술판 다시 보고 오겠습니다.",
        source: "fallback"
      },
      { status: 200 }
    );
  }
}
