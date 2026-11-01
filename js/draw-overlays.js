// =====================================================================
// draw-overlays.js — things drawn on top of the field
//
// Pitcher name caption, runner cam, strike zone, the ball, tap ring and ABS replay.
// =====================================================================

// The TV-style caption with the pitcher's name, plus the delivery tag at release.
function drawCaption(now) {
  if (!S || !S.P) return;
  const P = S.P,
    st = styleOf(P.p),
    kit = kitOf(fieldTeam());
  const e = now - P.wind,
    end = P.t0 + 650;
  if (now > end) return;
  const cond = getComputedStyle(document.documentElement).getPropertyValue("--cond");
  const inT = clamp(e / 260, 0, 1),
    ease = 1 - Math.pow(1 - inT, 3),
    out = now > P.t0 + 350 ? clamp((now - P.t0 - 350) / 300, 0, 1) : 0;
  const x = -250 + ease * 258 - out * 270,
    y = 134;
  ctx.save();
  ctx.globalAlpha = 1 - out * 0.6;
  ctx.fillStyle = "rgba(8,14,22,.88)";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 236, y);
  ctx.lineTo(x + 226, y + 34);
  ctx.lineTo(x, y + 34);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = kit[3] || kit[1];
  ctx.fillRect(x, y, 5, 34);
  ctx.fillStyle = "#F5B841";
  ctx.fillRect(
    x + 5,
    y + 33,
    Math.max(0, clamp((now - P.wind) / (P.t0 - P.wind || 1), 0, 1) * 221),
    1.5,
  );
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 15px " + cond;
  ctx.fillText(P.p.n.toUpperCase(), x + 12, y + 15);
  ctx.fillStyle = "#B8C7D4";
  ctx.font = "700 8.5px system-ui";
  ctx.fillText(st.d.toUpperCase(), x + 12, y + 28);
  ctx.restore();
  // pop the delivery tag at release
  const r = now - P.t0;
  if (r >= 0 && r < 520) {
    const sd = P.p.hand === "R" ? -1 : 1,
      pop = r < 120 ? r / 120 : 1,
      fade = r > 360 ? 1 - (r - 360) / 160 : 1,
      sc = 0.6 + pop * 0.5;
    const [rx, ry] = P.rel;
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.translate(rx + sd * 40, ry - 14);
    ctx.rotate(sd * -0.12);
    ctx.scale(sc, sc);
    ctx.font = "800 20px " + cond;
    ctx.textAlign = "center";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#0A1520";
    ctx.strokeText(st.tag + "!", 0, 0);
    ctx.fillStyle = "#F5B841";
    ctx.fillText(st.tag + "!", 0, 0);
    ctx.strokeStyle = "rgba(245,184,65,.8)";
    ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(-sd * (50 + i * 4), -6 + i * 9);
      ctx.lineTo(-sd * (68 + i * 6), -8 + i * 12);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.textAlign = "left";
}

// The "runner cam" box in the top-left corner, showing a runner's lead.
function drawCam(now) {
  if (!S || S.mode !== "game" || S.over) return;
  const B = S.bases;
  let i = null;
  if (S.stealOn != null && B[S.stealOn]) i = S.stealOn;
  else if (batTeam() === "cpu" && S.cpuWillSteal != null && B[S.cpuWillSteal]) i = S.cpuWillSteal;
  else i = [0, 1].find((j) => B[j] && !B[j + 1]);
  if (i == null) return;
  const r = B[i],
    x0 = 8,
    y0 = 8,
    w = 124,
    h = 78;
  ctx.fillStyle = "#070B09";
  ctx.fillRect(x0, y0, w, h);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x0, y0, w, h);
  ctx.clip();
  ctx.fillStyle = "#2E5E3A";
  ctx.fillRect(x0, y0 + 40, w, h - 40);
  ctx.fillStyle = "#B9734B";
  ctx.beginPath();
  ctx.moveTo(x0, y0 + 58);
  ctx.lineTo(x0 + w, y0 + 52);
  ctx.lineTo(x0 + w, y0 + 64);
  ctx.lineTo(x0, y0 + 72);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#F6F3EA";
  ctx.fillRect(x0 + 16, y0 + 60, 12, 5);
  const lead = runnerLead(i, now),
    going = S.stealOn === i && S.P && !S.P.done && now > S.P.t0;
  const big =
    batTeam() === "cpu" && S.cpuWillSteal === i && ["select", "aim", "meter"].includes(S.phase);
  const rx = x0 + 22 + Math.min(lead, 1) * 120;
  figure(rx, y0 + 64, 1.25, kitOf(batTeam()), {
    helmet: true,
    crouch: !going,
    lean: going ? 1.4 : big ? 1 : 0.3,
    spread: going ? 8 : 6,
    arms: "out",
    skin: skinOf(r.n),
  });
  ctx.restore();
  ctx.strokeStyle = "#F5B841";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(x0, y0, w, h);
  ctx.fillStyle = "rgba(7,11,9,.75)";
  ctx.fillRect(x0, y0, w, 13);
  ctx.font = "700 9px system-ui";
  ctx.textAlign = "left";
  ctx.fillStyle = "#F6F3EA";
  ctx.fillText("RUNNER CAM · " + ["1B", "2B"][i], x0 + 14, y0 + 9.5);
  if (Math.floor(now / 500) % 2) {
    ctx.fillStyle = "#E5483A";
    ctx.beginPath();
    ctx.arc(x0 + 7, y0 + 6.5, 2.6, 0, 7);
    ctx.fill();
  }
  const tag = going ? "GOING!" : big ? "BIG LEAD" : "";
  if (tag && (going || Math.floor(now / 300) % 2)) {
    ctx.fillStyle = "#E5483A";
    ctx.fillRect(x0 + w - 50, y0 + h - 14, 48, 12);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 8px system-ui";
    ctx.fillText(tag, x0 + w - 47, y0 + h - 5);
  }
}

// The strike zone box, and your aim crosshair when you pitch.
function drawZone(now) {
  const showGrid = S && ["aim", "meter", "select", "bullpen"].includes(S.phase);
  ctx.save();
  ctx.strokeStyle = showGrid ? "rgba(246,243,234,.75)" : "rgba(246,243,234,.35)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash(showGrid ? [] : [5, 4]);
  ctx.strokeRect(ZX - ZW / 2, ZY - ZH / 2, ZW, ZH);
  if (showGrid) {
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = "rgba(246,243,234,.3)";
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(ZX - ZW / 2 + (i * ZW) / 3, ZY - ZH / 2);
      ctx.lineTo(ZX - ZW / 2 + (i * ZW) / 3, ZY + ZH / 2);
      ctx.moveTo(ZX - ZW / 2, ZY - ZH / 2 + (i * ZH) / 3);
      ctx.lineTo(ZX + ZW / 2, ZY - ZH / 2 + (i * ZH) / 3);
      ctx.stroke();
    }
  }
  ctx.restore();
  if (S && S.aim && batTeam() === "cpu" && S.phase !== "select") {
    const [x, y] = toScreen(S.aim);
    ctx.strokeStyle = "#F5B841";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, 7);
    ctx.moveTo(x - 14, y);
    ctx.lineTo(x + 14, y);
    ctx.moveTo(x, y - 14);
    ctx.lineTo(x, y + 14);
    ctx.stroke();
  }
}

// The pitch (with red seams) or the batted ball and its shadow.
function drawBall(now) {
  const P = S && S.P;
  if (!P) return;
  if (S.Hit) {
    const Hh = S.Hit,
      t = clamp((now - Hh.t0) / Hh.dur, 0, 1);
    const x = Hh.from[0] + (Hh.to[0] - Hh.from[0]) * t,
      y = Hh.from[1] + (Hh.to[1] - Hh.from[1]) * t - Math.sin(Math.PI * t) * Hh.h,
      r = 10 + (Hh.r1 - 10) * t;
    ctx.fillStyle = "rgba(0,0,0,.25)";
    ctx.beginPath();
    ctx.ellipse(x, Hh.from[1] + (Hh.to[1] - Hh.from[1]) * t + 3, r, r * 0.4, 0, 0, 7);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(x, y, Math.max(r, 1.2), 0, 7);
    ctx.fill();
    return;
  }
  if (now < P.t0) return;
  const t = (now - P.t0) / P.dur;
  const [x, y, r] = ballPos(P, t);
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 7);
  ctx.fill();
  ctx.strokeStyle = "#C8412E";
  ctx.lineWidth = Math.max(0.6, r * 0.14);
  ctx.beginPath();
  ctx.arc(x - r * 0.5, y, r * 0.7, -0.9, 0.9);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + r * 0.5, y, r * 0.7, Math.PI - 0.9, Math.PI + 0.9);
  ctx.stroke();
}

// The yellow circle that shows where you tapped.
function drawRing(now) {
  if (!S || !S.ring) return;
  const a = 1 - (now - S.ring.t) / 450;
  if (a <= 0) return;
  ctx.strokeStyle = `rgba(245,184,65,${a})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(S.ring.x, S.ring.y, 16 + (1 - a) * 10, 0, 7);
  ctx.stroke();
}

// The ABS review screen: the zone, then the ball, then "Strike" or "Ball".
function drawABS(now) {
  if (!S || !S.abs) return;
  const A = S.abs,
    e = now - A.t0;
  ctx.fillStyle = "rgba(6,14,10,.82)";
  ctx.fillRect(40, 70, 280, 300);
  ctx.strokeStyle = "#F5B841";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 70, 280, 300);
  ctx.fillStyle = "#F6F3EA";
  ctx.font = "700 18px " + getComputedStyle(document.documentElement).getPropertyValue("--cond");
  ctx.textAlign = "center";
  ctx.fillText("ABS review", 180, 96);
  const cx = 180,
    cy = 228,
    zw = 120,
    zh = 150;
  ctx.strokeStyle = "rgba(246,243,234,.9)";
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - zw / 2, cy - zh / 2, zw, zh);
  ctx.strokeStyle = "rgba(246,243,234,.25)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(cx - zw / 2 + (i * zw) / 3, cy - zh / 2);
    ctx.lineTo(cx - zw / 2 + (i * zw) / 3, cy + zh / 2);
    ctx.moveTo(cx - zw / 2, cy - zh / 2 + (i * zh) / 3);
    ctx.lineTo(cx + zw / 2, cy - zh / 2 + (i * zh) / 3);
    ctx.stroke();
  }
  const bx = cx + (A.loc[0] * zw) / 2,
    by = cy - (A.loc[1] * zh) / 2,
    a = clamp((e - 300) / 600, 0, 1);
  if (a > 0) {
    ctx.globalAlpha = a;
    ctx.fillStyle = e > 1900 ? (A.truth === "called" ? "#E2694F" : "#5FB37A") : "#FFFFFF";
    ctx.beginPath();
    ctx.arc(bx, by, (0.06 * zw) / 2 + 5, 0, 7);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  if (e < 1900) {
    ctx.fillStyle = "#9BAC9F";
    ctx.font = "600 14px system-ui";
    ctx.fillText("Tracking pitch" + ".".repeat(1 + (Math.floor(e / 300) % 3)), 180, 350);
  } else {
    ctx.fillStyle = "#F5B841";
    ctx.font = "800 22px " + getComputedStyle(document.documentElement).getPropertyValue("--cond");
    ctx.fillText(A.truth === "called" ? "Strike" : "Ball", 180, 352);
  }
  ctx.textAlign = "left";
}
