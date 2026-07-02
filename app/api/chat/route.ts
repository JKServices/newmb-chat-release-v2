import { NextResponse } from "next/server";
import { createLocalReply } from "@/lib/local-replies";
import { NEWMB_SYSTEM_PROMPT } from "@/lib/newmb-prompt";
import { getOpenAIClient } from "@/lib/openai-client";
import { findReplyInDb } from "@/lib/reply-db";
import { checkChatRateLimit, makeRateLimitHeaders } from "@/lib/rate-limit";

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

function makeRateLimitAnswer(reason?: "hourly" | "burst") {
  if (reason === "hourly") {
    return [
      "오늘 인터뷰는 여기까지입니다.",
      "",
      "한 시간에 질문은 10개까지입니다.",
      "잠시 라커룸에서 정비하고 오겠습니다."
    ].join("\n");
  }

  return [
    "잠시 템포를 낮추겠습니다.",
    "",
    "압박이 너무 강합니다.",
    "조금만 천천히 들어오세요."
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        {
          answer:
            "Review\n\n요청 형식이 맞지 않습니다.\n전술지부터 다시 확인하겠습니다.",
          source: "blocked"
        },
        {
          status: 415
        }
      );
    }

    const contentLength = Number(request.headers.get("content-length") || "0");

    if (contentLength > 4096) {
      return NextResponse.json(
        {
          answer:
            "Too Long\n\n질문이 너무 깁니다.\n감독님 인터뷰는 짧을수록 강합니다.",
          source: "blocked"
        },
        {
          status: 413
        }
      );
    }

    const rateLimit = checkChatRateLimit(request);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          answer: makeRateLimitAnswer(rateLimit.reason),
          source: "rate-limit"
        },
        {
          status: 429,
          headers: makeRateLimitHeaders(rateLimit)
        }
      );
    }

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
