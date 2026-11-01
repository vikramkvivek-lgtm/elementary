// =====================================================================
// pitching.js — when you're the pitcher
//
// Steps: pick a pitch -> tap where to throw it -> stop the needle.
// Then the CPU batter decides whether to swing (resolveCpuAB).
// =====================================================================

// Step 1: you picked pitch number i.
function choosePitch(i) {
  if (S.phase !== "select" && S.phase !== "aim") return;
  S.sel = i;
  S.phase = "aim";
  renderPanel();
}

// Step 2: you tapped where to throw it. Starts the accuracy meter.
function aimAt(x, y) {
  if (S.phase !== "aim") return;
  const [nx, ny] = toZone(x, y);
  S.aim = [clamp(nx, -1.8, 1.8), clamp(ny, -1.8, 1.8)];
  S.phase = "meter";
  S.meterT0 = performance.now();
  renderPanel();
}

// Where the meter needle is: 0 = left edge, 0.5 = middle (perfect), 1 = right edge.
function meterPos(now) {
  return (Math.sin(((now - S.meterT0) / S.D.meter) * Math.PI * 2 - Math.PI / 2) + 1) / 2;
}

// How tired your pitcher is.
//   f  — tiredness from 0 to 1 (makes pitches less accurate and easier to hit)
//   e  — energy left from 0 to 1 (the bar under the pitcher's name)
//   pc — pitch count
function fatigue() {
  const p = myPitcher(),
    pc = S.pc[p.n] || 0,
    lim = 55 + p.stam * 0.45;
  return { f: clamp((pc - lim * 0.75) / (lim * 0.5), 0, 1), e: clamp(1 - pc / lim, 0, 1), pc };
}

// Step 3: you stopped the needle. The farther from the middle, plus low control
// and tiredness, the more the pitch misses where you aimed.
function release() {
  if (S.phase !== "meter") return;
  const pos = meterPos(performance.now()),
    acc = 1 - Math.abs(pos - 0.5) * 2;
  const p = myPitcher(),
    pt = p.ar[S.sel],
    { f } = fatigue();
  const err = ((1 - acc) * 0.85 + (100 - p.ctl) / 260 + f * 0.5) * rnd(0.4, 1),
    ang = rnd(0, Math.PI * 2);
  const target = [S.aim[0] + Math.cos(ang) * err, S.aim[1] + Math.sin(ang) * err];
  S.pc[p.n] = (S.pc[p.n] || 0) + 1;
  S.relAcc = acc;
  if (S.cpuWillSteal != null && S.bases[S.cpuWillSteal] && !S.bases[S.cpuWillSteal + 1]) {
    S.stealOn = S.cpuWillSteal;
    logMsg("The runner is going!");
  }
  S.cpuWillSteal = null;
  launchPitch(p, pt, target, "pitch");
  S.P.t0 = performance.now() + 520 * styleOf(myPitcher()).tempo;
  S.P.wind = performance.now();
}

// The pitch reached the CPU batter. Does it swing? Does it hit it?
//   cd    — how far from the middle of the zone (more than 1 = outside the zone)
//   inZ   — is it a strike?   meat — right down the middle (easy to hit)
//   stuff — how nasty the pitch is
//   sw    — chance the batter swings;  con — chance it makes contact
//   e     — hit strength. S.cpuDry makes the CPU slowly better after many outs in a row.
function resolveCpuAB() {
  const P = S.P;
  P.done = true;
  const b = curBatter(),
    [x, y] = P.target,
    cd = Math.max(Math.abs(x), Math.abs(y)),
    inZ = cd <= 1.02,
    meat = cd < 0.45;
  const p = myPitcher(),
    { f } = fatigue();
  let stuff =
    (p.st - 80) / 250 +
    (Math.abs(P.brk[0]) + Math.abs(P.brk[1])) * 0.03 -
    f * 0.15 +
    (S.relAcc > 0.92 ? 0.04 : 0) -
    S.D.cpuBoost;
  let sw = inZ
    ? 0.62 + (meat ? 0.15 : 0)
    : clamp(0.3 - (cd - 1) * 0.6, 0.03, 0.3) * (S.s === 2 ? 1.3 : 1) * (1 + stuff);
  if (S.b === 3 && !inZ) sw *= 0.55;
  if (Math.random() >= sw) {
    umpDecides(P.target);
    return;
  }
  let con = (inZ ? 0.86 : 0.55) + (b.c - 75) / 180 - stuff * 0.7 - (inZ && cd > 0.75 ? 0.03 : 0);
  if (Math.random() > con) {
    S.ring = {
      x: toScreen(P.target)[0] + rnd(-14, 14),
      y: toScreen(P.target)[1] + rnd(-14, 14),
      t: performance.now(),
    };
    callPitch("swinging");
    return;
  }
  const cp = toScreen(P.target);
  if (Math.random() < 0.34) {
    foulAnim(cp);
    setTimeout(() => callPitch("foul"), 700);
    return;
  }
  const e =
    0.62 +
    (meat ? 0.18 : 0) -
    (inZ && cd > 0.75 ? 0.03 : 0) -
    (!inZ ? 0.1 : 0) +
    (b.pw - 75) / 180 +
    (Math.random() - 0.5) * 0.5 -
    stuff * 0.4 +
    Math.min(0.15, (S.cpuDry || 0) * 0.02);
  hitResult(e, b, cp, Math.random() < 0.5 ? "pull" : "oppo", 1);
}
