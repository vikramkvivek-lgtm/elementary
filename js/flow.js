// =====================================================================
// flow.js — innings and pitches
//
// How the game moves along: start a half-inning, then the next pitch,
// then the next... Also the math for where the ball is as it flies.
// =====================================================================

// Start the top or bottom of an inning: clear outs, count and bases.
function startHalf() {
  S.outs = 0;
  S.b = 0;
  S.s = 0;
  S.bases = [null, null, null];
  S.stealOn = null;
  S.sacOn = false;
  S.diseng = 0;
  S.cpuWillSteal = null;
  S.runs[batTeam()][S.inn - 1] = 0;
  if (S.inn > S.innings && S.half === 0)
    ["you", "cpu"].forEach((t) => {
      if (S.chal[t] === 0) {
        S.chal[t] = 1;
      }
    });
  renderBoard();
  showCall(
    (S.half ? "Bottom " : "Top ") + ord(S.inn),
    S.half ? "You’re pitching" : "You’re batting",
  );
  S.phase = "idle";
  renderPanel();
  setTimeout(nextPitch, 1600);
}

// Get ready for the next pitch.
// If you're batting, the CPU throws. If you're pitching, wait for you to pick a pitch.
// (When you pitch, the CPU may secretly decide to steal; see S.cpuWillSteal.)
function nextPitch() {
  if (!S || S.over) return;
  S.P = null;
  S.Hit = null;
  S.ring = null;
  if (batTeam() === "you") {
    cpuThrow();
  } else {
    const B = S.bases;
    S.cpuWillSteal = null;
    if (S.mode === "game") {
      if (B[0] && !B[1] && B[0].s >= 75 && Math.random() < 0.3) S.cpuWillSteal = 0;
      else if (B[1] && !B[2] && B[1].s >= 88 && Math.random() < 0.15) S.cpuWillSteal = 1;
    }
    S.phase = "select";
    S.sel = null;
    S.aim = null;
    renderPanel();
  }
}

// The CPU picks a pitch and where to throw it.
// strikeP is the chance it throws a strike; it changes with the count.
function cpuThrow() {
  if (S.cpuP === 0 && S.cpuPC >= CPU.staff[0].lim) {
    S.cpuP = 1;
    logMsg(CPU.name + " goes to the bullpen: " + cpuPitcher().n + ".");
  }
  const p = cpuPitcher(),
    pt = pick(p.ar);
  let strikeP = S.mode === "mission" ? 0.78 : S.b === 3 ? 0.78 : S.s === 2 && S.b < 2 ? 0.38 : 0.56;
  let x, y;
  if (Math.random() < strikeP) {
    x = (Math.random() < 0.5 ? -1 : 1) * rnd(0.15, 0.95);
    y = (Math.random() < 0.5 ? -1 : 1) * rnd(0.1, 0.95);
  } else if (Math.random() < 0.5) {
    x = (Math.random() < 0.5 ? -1 : 1) * rnd(1.12, 1.6);
    y = rnd(-1.3, 1.3);
  } else {
    x = rnd(-1.2, 1.2);
    y = (Math.random() < 0.5 ? -1 : 1) * rnd(1.12, 1.55);
  }
  S.cpuPC++;
  launchPitch(p, pt, [x, y], "bat");
}

// Send a pitch toward the plate. Faster pitches (higher mph) take less time (dur).
// t0 is when the ball leaves the hand, after the windup.
function launchPitch(p, pt, target, mode) {
  const dur = (520 + (100 - pt[1]) * 28) * S.D.fly;
  const rel = releasePoint(p);
  S.P = {
    p,
    pt,
    target,
    rel,
    brk: [pt[2], pt[3]],
    mode,
    t0: performance.now() + 850 * styleOf(p).tempo,
    wind: performance.now(),
    dur,
    swung: false,
    done: false,
    pending: null,
  };
  S.phase = mode === "bat" ? "flight-bat" : "flight-pitch";
  S.last = pt[1] + " mph " + pt[0];
  renderPanel();
}

// Where the ball is on screen at time t (0 = release, 1 = at the plate).
// The break (curve) mostly happens late, like a real pitch. Returns [x, y, size].
function ballPos(P, t) {
  const tt = clamp(t, 0, 1);
  const [tx, ty] = toScreen(P.target);
  const bx = (P.brk[0] * ZW) / 2,
    by = (-P.brk[1] * ZH) / 2;
  const sx = P.rel[0] + (tx - bx - P.rel[0]) * tt,
    sy = P.rel[1] + (ty - by - P.rel[1]) * tt;
  const k = tt * tt * tt;
  return [sx + bx * k, sy + by * k, 2 + 9 * Math.pow(tt, 1.6)];
}
