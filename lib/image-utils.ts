export function cleanText(value: string) {
  return value.replace(/\\n/g, "\n").trim();
}

export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  const cleaned = cleanText(text);
  const rawLines = cleaned.split("\n");
  const lines: string[] = [];

  for (const rawLine of rawLines) {
    if (!rawLine.trim()) {
      lines.push("");
      continue;
    }

    let currentLine = "";

    for (const char of rawLine) {
      const testLine = currentLine + char;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) lines.push(currentLine);
  }

  return lines;
}

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
