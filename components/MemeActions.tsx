"use client";

import { cleanText, downloadCanvas, roundRect, wrapText } from "@/lib/image-utils";

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
  startY: number
) {
  const maxBubbleWidth = 420;
  const paddingX = 18;
  const paddingY = 13;

  ctx.font =
    "600 21px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";

  const lines = wrapText(ctx, question, maxBubbleWidth - paddingX * 2);
  const lineHeight = 31;
  const bubbleHeight = lines.length * lineHeight + paddingY * 2;
  const widestLine = Math.max(...lines.map((line) => ctx.measureText(line).width), 80);
  const bubbleWidth = Math.min(maxBubbleWidth, widestLine + paddingX * 2);

  const x = canvasWidth - bubbleWidth - 44;
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
  y: number
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
    "800 15px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("뉴", x + 23, y + 13);
  ctx.textAlign = "left";

  ctx.fillStyle = "#d1d1d6";
  ctx.font =
    "700 18px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
  ctx.fillText("뉴MB", x + 58, y + 1);
}

function drawAnswerBubble(
  ctx: CanvasRenderingContext2D,
  answer: string,
  x: number,
  y: number,
  maxWidth: number,
  darkMode: boolean
) {
  ctx.font =
    "700 28px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";

  const lines = cleanText(answer).split("\n");
  const wrappedLines: string[] = [];

  lines.forEach((line, index) => {
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
        "800 30px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    } else {
      ctx.font =
        "500 23px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    }

    ctx.fillText(line, x + 22, y + 19 + index * lineHeight);
  });

  return y + bubbleHeight;
}

export default function MemeActions({ question, answer }: MemeActionsProps) {
  function makePosterImage() {
    const { canvas, ctx } = setupCanvas(900, 1200);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 900, 1200);

    ctx.fillStyle = "#ffffff";
    ctx.font =
      "800 42px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    ctx.fillText("뉴MB.chat", 64, 64);

    const afterQuestionY = drawQuestionBubble(ctx, question, 900, 170);

    drawNewMbProfile(ctx, 64, afterQuestionY);

    drawAnswerBubble(ctx, answer, 122, afterQuestionY + 44, 650, true);

    ctx.fillStyle = "#8e8e93";
    ctx.font =
      "600 22px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("newmb.chat", 450, 1135);

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
      "800 30px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("뉴MB", 450, 32);
    ctx.textAlign = "left";

    const afterQuestionY = drawQuestionBubble(ctx, question, 900, 150);

    drawNewMbProfile(ctx, 54, afterQuestionY);

    drawAnswerBubble(ctx, answer, 112, afterQuestionY + 44, 650, false);

    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.font =
      "600 22px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
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
