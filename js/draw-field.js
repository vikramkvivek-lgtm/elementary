// =====================================================================
// draw-field.js — the stadium: sky, lights, crowd, grass, dirt and bases
// =====================================================================

function drawField(now) {
  let g = ctx.createLinearGradient(0, 0, 0, 120);
  g.addColorStop(0, "#081522");
  g.addColorStop(1, "#1D3A4E");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 120);
  [
    [26, 12],
    [334, 12],
  ].forEach(([x, y]) => {
    ctx.fillStyle = "rgba(255,236,180,.18)";
    ctx.beginPath();
    ctx.arc(x, y + 6, 26, 0, 7);
    ctx.fill();
    ctx.fillStyle = "#FFF4D6";
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 2; j++) ctx.fillRect(x - 8 + i * 4.5, y + j * 5, 3, 3);
  });
  ctx.fillStyle = "#1A2530";
  ctx.fillRect(0, 68, W, 52);
  crowd.forEach(([x, y, c]) => {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, 3, 3);
  });
  ctx.fillStyle = "#123A28";
  ctx.fillRect(0, 118, W, 9);
  ctx.fillStyle = "#F5B841";
  ctx.fillRect(0, 118, W, 1.5);
  ctx.fillStyle = "#2E5E3A";
  ctx.fillRect(0, 127, W, H - 127);
  for (let i = 0; i < 9; i++) {
    const y0 = 127 + Math.pow(i / 9, 1.6) * 313,
      y1 = 127 + Math.pow((i + 0.5) / 9, 1.6) * 313;
    ctx.fillStyle = "#346841";
    ctx.fillRect(0, y0, W, y1 - y0);
  }
  ctx.fillStyle = "#B9734B";
  ctx.beginPath();
  ctx.ellipse(180, 248, 212, 74, 0, 0, 7);
  ctx.fill();
  ctx.fillStyle = "#3A7046";
  ctx.beginPath();
  ctx.moveTo(180, 206);
  ctx.lineTo(276, 250);
  ctx.lineTo(180, 336);
  ctx.lineTo(84, 250);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#B9734B";
  ctx.beginPath();
  ctx.ellipse(180, 420, 96, 34, 0, 0, 7);
  ctx.fill();
  ctx.strokeStyle = "rgba(246,243,234,.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(180, 426);
  ctx.lineTo(372, 180);
  ctx.moveTo(180, 426);
  ctx.lineTo(-12, 180);
  ctx.stroke();
  ctx.fillStyle = "#C68356";
  ctx.beginPath();
  ctx.ellipse(180, 232, 26, 9, 0, 0, 7);
  ctx.fill();
  ctx.fillStyle = "#F6F3EA";
  ctx.fillRect(174, 229, 12, 2.5);
  BASEPOS.forEach(([x, y], i) => {
    const on = S && S.bases[i];
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, 0.5);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = on ? "#F5B841" : "#F6F3EA";
    ctx.fillRect(-5, -5, 10, 10);
    ctx.restore();
  });
  ctx.fillStyle = "#F6F3EA";
  ctx.beginPath();
  ctx.moveTo(166, 420);
  ctx.lineTo(194, 420);
  ctx.lineTo(194, 426);
  ctx.lineTo(180, 433);
  ctx.lineTo(166, 426);
  ctx.closePath();
  ctx.fill();
}
