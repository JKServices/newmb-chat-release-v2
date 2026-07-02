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

function splitAnswerForPoster(answer: string) {
  const lines = cleanText(answer)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const keyword = lines[0] || "Reset";
  const body = lines.slice(1).join("\n") || "오늘 경기는 아직 끝나지 않았습니다.";

  return {
    keyword,
    body
  };
}

function drawPoster(
  ctx: CanvasRenderingContext2D,
  question: string,
  answer: string
) {
  const { keyword, body } = splitAnswerForPoster(answer);

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 900, 900);

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  roundRect(ctx, 1, 1, 898, 898, 62);
  ctx.stroke();

  // Question at top
  ctx.fillStyle = "#b8b8bd";
  ctx.font =
    "700 27px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";

  const questionLines = wrapText(ctx, question, 760).slice(0, 3);
  const questionStartY = 84;

  questionLines.forEach((line, index) => {
    ctx.fillText(line, 70, questionStartY + index * 38);
  });

  // Red line below question
  const redLineY = questionStartY + questionLines.length * 38 + 28;
  ctx.fillStyle = "#ff2d55";
  roundRect(ctx, 70, redLineY, 180, 12, 999);
  ctx.fill();

  // Keyword below red line
  const keywordY = redLineY + 42;
  ctx.fillStyle = "#ffffff";
  ctx.font =
    "950 82px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
  ctx.fillText(keyword, 70, keywordY);

  // Answer below keyword
  ctx.font =
    "850 50px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
  const answerLines = wrapText(ctx, body, 760).slice(0, 6);
  const answerStartY = keywordY + 110;
  const answerLineHeight = 66;

  answerLines.forEach((line, index) => {
    ctx.fillText(line, 70, answerStartY + index * answerLineHeight);
  });

  // Watermark
  ctx.fillStyle = "#8e8e93";
  ctx.font =
    "700 26px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
  ctx.fillText("newmb.chat · 비공식 패러디", 70, 820);
}

function drawKakaoInputBar(ctx: CanvasRenderingContext2D, y: number) {
  ctx.fillStyle = "rgba(244, 246, 248, 0.96)";
  ctx.fillRect(0, y, 900, 84);

  ctx.fillStyle = "#7b8794";
  ctx.font =
    "500 34px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("+", 44, y + 21);

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 86, y + 16, 660, 52, 26);
  ctx.fill();

  ctx.fillStyle = "#a0a5aa";
  ctx.font =
    "500 20px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
  ctx.fillText("메시지 입력", 110, y + 31);

  ctx.fillStyle = "#7b8794";
  ctx.font =
    "700 22px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
  ctx.fillText("전송", 780, y + 30);

  ctx.textAlign = "left";
}

export default function MemeActions({ question, answer }: MemeActionsProps) {
  function makePosterImage() {
    const { canvas, ctx } = setupCanvas(900, 900);
    drawPoster(ctx, question, answer);
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

    const watermarkY = answerBottom + 20;
    const inputY = watermarkY + 34;
    const finalHeight = Math.min(1200, Math.max(680, inputY + 84));

    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.font =
      "700 19px -apple-system, BlinkMacSystemFont, Pretendard, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("newmb.chat", 450, watermarkY);

    drawKakaoInputBar(ctx, inputY);

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
