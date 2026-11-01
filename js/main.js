// =====================================================================
// main.js — the game loop (loaded last)
//
// tick() runs about 60 times a second. It checks whether the pitch has
// reached the plate, updates timers, and redraws the whole field.
//
// S.phase tells you what's happening right now:
//   idle          waiting (between pitches, or showing a result)
//   flight-bat    a pitch is coming and you can swing
//   select        you're pitching: pick a pitch
//   aim           tap where to throw it
//   meter         stop the accuracy needle
//   flight-pitch  your pitch is flying to the CPU batter
//   hit           a batted ball is in the air
//   challenge     you can challenge the umpire's call
//   abs           the ABS review is playing
//   bullpen       picking a new pitcher
//   over          game over;  mission-over = mission finished
// =====================================================================

function tick(now) {
  if (S && S.P && !S.P.done) {
    const P = S.P,
      t = (now - P.t0) / P.dur;
    if (P.mode === "bat" && S.sacOn && !P.swung && t >= 0.96 && t < 1.05) {
      sacSwing(P);
    } else if (P.mode === "bat") {
      if (P.pending && t >= 1) {
        P.done = true;
        callPitch("swinging");
      } else if (!P.swung && t > 1 + S.D.ok / P.dur + 0.02) resolveTake();
    } else if (t >= 1) resolveCpuAB();
  }
  if (S && S.phase === "challenge") {
    const left = S.chalEnd - now,
      el = document.getElementById("ctimer");
    if (el) el.style.width = clamp(left / 4500, 0, 1) * 100 + "%";
    if (left <= 0) acceptCall();
  }
  if (S && S.phase === "meter") {
    const n = document.getElementById("needle");
    if (n) n.style.left = meterPos(now) * 100 + "%";
  }
  ctx.clearRect(0, 0, W, H);
  drawField(now);
  drawFielders();
  drawRunners(now);
  drawPitcher(now);
  drawZone(now);
  drawBatter(now);
  drawBall(now);
  drawRing(now);
  drawCaption(now);
  drawCam(now);
  drawABS(now);
  requestAnimationFrame(tick);
}

// Start everything up.
resize();
renderBoard();
renderPanel();
requestAnimationFrame(tick);
