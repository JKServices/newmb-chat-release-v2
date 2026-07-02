import { NextResponse } from "next/server";
import { createLocalReply } from "@/lib/local-replies";
import { NEWMB_SYSTEM_PROMPT } from "@/lib/newmb-prompt";
import { getOpenAIClient } from "@/lib/openai-client";
import { findReplyInDb } from "@/lib/reply-db";

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
  const cleaned = value
    .replace(/\\n/g, "\n")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n")
    .trim();

  const lines = cleaned
    .split("\n")
    .map((line) => line.trimEnd())
    .slice(0, 8);

  return lines.join("\n").slice(0, 700);
}

function fallbackAnswer(question: string) {
  return createLocalReply(question);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;
    const question = sanitizeQuestion(body.question);

    if (!question) {
      return NextResponse.json(
        {
          error: "Question is required."
        },
        {
          status: 400
        }
      );
    }

    const dbReply = findReplyInDb(question);

    if (dbReply) {
      return NextResponse.json({
        answer: dbReply.answer,
        source: "db",
        scenario: dbReply.scenario
      });
    }

    const client = getOpenAIClient();

    if (!client) {
      return NextResponse.json({
        answer: fallbackAnswer(question),
        source: "local"
      });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: NEWMB_SYSTEM_PROMPT,
      input: question,
      max_output_tokens: 180,
      temperature: 0.95
    });

    const generatedText =
      typeof response.output_text === "string" ? response.output_text : "";

    const answer = generatedText.trim()
      ? sanitizeAnswer(generatedText)
      : fallbackAnswer(question);

    return NextResponse.json({
      answer,
      source: "openai"
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json({
      answer:
        "Reset\n\n지금은 연결이 흔들립니다.\n하지만 경기는 계속됩니다.\n다음 플레이 준비하세요.",
      source: "fallback"
    });
  }
}
