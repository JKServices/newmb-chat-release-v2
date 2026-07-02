"use client";

import {
  cleanText,
  downloadCanvas,
  roundRect,
  wrapText
} from "@/lib/image-utils";

type MemeActionsProps = {
  question: string;
  answer: string;
};

function setupCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  const scale = window.devicePixelRatio || 2;

  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas is not supported.");
  }

  ctx.scale(scale, scale);
  ctx.textBaseline = "top";

  return { canvas, ctx };
}

function drawQuestionBubble(
  ctx: CanvasRenderingContext2D,
  question: string,
  canvasWidth: number,
  startY: number,
  options?: {
    maxBubbleWidth?: number;
    fontSize?: number;
    paddingX?: number;
    paddingY?: number;
  }
) {
  const maxBubbleWidth = options?.maxBubbleWidth ?? 420;
  const paddingX = options?.paddingX ?? 18;
  const paddingY = options?.paddingY ?? 13;
  const fontSize = options?.fontSize ?? 21;

  ctx.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif`;

  const lines = wrapText(ctx, question, maxBubbleWidth - paddingX * 2);
  const lineHeight = Math.round(fontSize * 1.45);
  const bubbleHeight = lines.length * lineHeight + paddingY * 2;
  const widestLine = Math.max(
    ...lines.map((line) => ctx.measureText(line).width),
    80
  );
  const bubbleWidth = Math.min(maxBubbleWidth, widestLine + paddingX * 2);

  const x = canvasWidth - bubbleWidth - 48;
  const y = startY;

  ctx.fillStyle = "#6bbcff";
  roundRect(ctx, x, y, bubbleWidth, bubbleHeight, 24);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  lines.forEach((line, index) => {
    ctx.fillText(line, x + paddingX, y + paddingY + index * lineHeight);
  });

  return y + bubbleHeight + 44;
}

function drawNewMbProfile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  darkText = false
) {
  ctx.fillStyle = "#1c1c1e";
  ctx.beginPath();
  ctx.arc(x + 23, y + 23, 23, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font =
    "900 15px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("뉴", x + 23, y + 13);
  ctx.textAlign = "left";

  ctx.fillStyle = darkText ? "#111111" : "#d1d1d6";
  ctx.font =
    "800 18px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
  ctx.fillText("뉴MB", x + 58, y + 1);
}

function drawChatAnswerBubble(
  ctx: CanvasRenderingContext2D,
  answer: string,
  x: number,
  y: number,
  maxWidth: number,
  darkMode: boolean
) {
  const cleanAnswer = cleanText(answer);
  const rawLines = cleanAnswer.split("\n");
  const wrappedLines: string[] = [];

  rawLines.forEach((line, index) => {
    if (!line.trim()) {
      wrappedLines.push("");
      return;
    }

    if (index === 0) {
      wrappedLines.push(line);
      return;
    }

    ctx.font =
      "500 23px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    wrappedLines.push(...wrapText(ctx, line, maxWidth - 42));
  });

  const lineHeight = 36;
  const bubbleHeight = wrappedLines.length * lineHeight + 34;

  ctx.fillStyle = darkMode ? "#2c2c2e" : "#ffffff";
  roundRect(ctx, x, y, maxWidth, bubbleHeight, 25);
  ctx.fill();

  ctx.fillStyle = darkMode ? "#ffffff" : "#111111";

  wrappedLines.forEach((line, index) => {
    if (index === 0) {
      ctx.font =
        "900 30px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    } else {
      ctx.font =
        "500 23px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    }

    ctx.fillText(line, x + 22, y + 19 + index * lineHeight);
  });

  return y + bubbleHeight;
}

function splitAnswerForPoster(answer: string) {
  const cleaned = cleanText(answer);
  const lines = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const title = lines[0] || "Reset";
  const body = lines.slice(1).join("\n") || "오늘 경기는 아직 끝나지 않았습니다.";

  return {
    title,
    body
  };
}

function drawPosterText(
  ctx: CanvasRenderingContext2D,
  answer: string,
  width: number
) {
  const { title, body } = splitAnswerForPoster(answer);

  ctx.textAlign = "center";

  ctx.fillStyle = "#6bbcff";
  ctx.font =
    "900 42px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
  ctx.fillText(title.toUpperCase(), width / 2, 210);

  ctx.fillStyle = "#ffffff";
  ctx.font =
    "950 74px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";

  const bodyLines = wrapText(ctx, body, 700);
  const bigLines = bodyLines.slice(0, 5);
  const lineHeight = 88;
  const totalHeight = bigLines.length * lineHeight;
  const startY = 385 - totalHeight / 2;

  bigLines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight);
  });

  ctx.fillStyle = "#8e8e93";
  ctx.font =
    "700 24px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
  ctx.fillText("UNOFFICIAL PARODY AI", width / 2, 760);

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(150, 815, 600, 1);

  ctx.fillStyle = "#ffffff";
  ctx.font =
    "900 44px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
  ctx.fillText("뉴MB.chat", width / 2, 865);

  ctx.fillStyle = "#8e8e93";
  ctx.font =
    "600 22px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
  ctx.fillText("newmb.chat", width / 2, 1135);

  ctx.textAlign = "left";
}

export default function MemeActions({ question, answer }: MemeActionsProps) {
  function makePosterImage() {
    const { canvas, ctx } = setupCanvas(900, 1200);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 900, 1200);

    ctx.fillStyle = "rgba(107,188,255,0.12)";
    ctx.beginPath();
    ctx.arc(450, 130, 310, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath();
    ctx.arc(450, 400, 520, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 2;
    roundRect(ctx, 42, 42, 816, 1116, 38);
    ctx.stroke();

    ctx.fillStyle = "#8e8e93";
    ctx.font =
      "800 20px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(question.slice(0, 46), 450, 92);
    ctx.textAlign = "left";

    drawPosterText(ctx, answer, 900);

    downloadCanvas(canvas, "newmb-poster.png");
  }

  function makeKakaoImage() {
    const { canvas, ctx } = setupCanvas(900, 1200);

    ctx.fillStyle = "#b7c7d8";
    ctx.fillRect(0, 0, 900, 1200);

    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillRect(0, 0, 900, 98);

    ctx.fillStyle = "#111111";
    ctx.font =
      "900 30px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("뉴MB", 450, 32);
    ctx.textAlign = "left";

    const afterQuestionY = drawQuestionBubble(ctx, question, 900, 150, {
      maxBubbleWidth: 430,
      fontSize: 21
    });

    drawNewMbProfile(ctx, 54, afterQuestionY, true);

    drawChatAnswerBubble(ctx, answer, 112, afterQuestionY + 44, 650, false);

    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.font =
      "700 22px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("newmb.chat", 450, 1135);

    downloadCanvas(canvas, "newmb-kakao.png");
  }

  return (
    <div className="meme-actions">
      <button type="button" onClick={makePosterImage}>
        포스터 짤 저장
      </button>
      <button type="button" onClick={makeKakaoImage}>
        카톡 짤 저장
      </button>
    </div>
  );
}
