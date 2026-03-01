export type Point = { x: number; y: number };

export const redrawCanvas = (
  canvas: HTMLCanvasElement,
  pts: Point[]
): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (pts.length === 0) return;

  ctx.strokeStyle = "rgba(255,0,0,1)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  pts.forEach((p, i) => {
    const x = p.x * canvas.width;
    const y = p.y * canvas.height;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  if (pts.length >= 10) {
    ctx.fillStyle = "rgba(255,0,0,0.1)";
    ctx.fill();
  }
};

export const buildCompositeForBackend = (
  baseImage: string,
  pts: Point[],
  onDone: (composite: string) => void
): void => {
  const img = new Image();
  img.onload = () => {
    const { width, height } = img;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, width, height);

    if (pts.length >= 2) {
      const lineWidth = Math.max(2, Math.round(Math.min(width, height) * 0.008));
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = lineWidth * 1.5;
      ctx.strokeStyle = "#ff2222";
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      pts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x * width, p.y * height);
        else ctx.lineTo(p.x * width, p.y * height);
      });
      ctx.stroke();
      ctx.restore();
    }

    onDone(canvas.toDataURL("image/jpeg", 0.92));
  };
  img.src = baseImage;
};