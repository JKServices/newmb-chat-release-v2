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

  return { canvas, ctx, scale };
}

function cropCanvas(
  sourceCanvas: HTMLCanvasElement,
  width: number,
  height: number,
  scale: number
) {
  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = width * scale;
  croppedCanvas.height = height * scale;
  croppedCanvas.style.width = `${width}px`;
  croppedCanvas.style.height = `${height}px`;

  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return sourceCanvas;
  }

  croppedCtx.drawImage(
    sourceCanvas,
    0,
    0,
    width * scale,
    height * scale,
    0,
    0,
    width * scale,
    height * scale
  );

  return croppedCanvas;
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
    "900 13px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("MB", x + 23, y + 14);
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

export default function MemeActions({ question, answer }: MemeActionsProps) {
  function makePosterImage() {
    const { canvas, ctx } = setupCanvas(900, 1200);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 900, 1200);

    ctx.fillStyle = "#ffffff";
    ctx.font =
      "900 42px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    ctx.fillText("뉴MB.chat", 64, 64);

    const afterQuestionY = drawQuestionBubble(ctx, question, 900, 170, {
      maxBubbleWidth: 420,
      fontSize: 21
    });

    drawNewMbProfile(ctx, 64, afterQuestionY);

    drawChatAnswerBubble(ctx, answer, 122, afterQuestionY + 44, 650, true);

    ctx.fillStyle = "#8e8e93";
    ctx.font =
      "700 22px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("newmb.chat", 450, 1135);

    downloadCanvas(canvas, "newmb-poster.png");
  }

  function makeKakaoImage() {
    const { canvas, ctx, scale } = setupCanvas(900, 1200);

    ctx.fillStyle = "#b7c7d8";
    ctx.fillRect(0, 0, 900, 1200);

    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillRect(0, 0, 900, 92);

    ctx.fillStyle = "#111111";
    ctx.font =
      "900 30px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("뉴MB", 450, 29);
    ctx.textAlign = "left";

    const afterQuestionY = drawQuestionBubble(ctx, question, 900, 130, {
      maxBubbleWidth: 430,
      fontSize: 21
    });

    drawNewMbProfile(ctx, 54, afterQuestionY, true);

    const answerBottom = drawChatAnswerBubble(
      ctx,
      answer,
      112,
      afterQuestionY + 44,
      650,
      false
    );

    const finalHeight = Math.min(1200, Math.max(650, answerBottom + 92));

    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.font =
      "700 21px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("newmb.chat", 450, finalHeight - 50);

    const croppedCanvas = cropCanvas(canvas, 900, finalHeight, scale);

    downloadCanvas(croppedCanvas, "newmb-kakao.png");
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
