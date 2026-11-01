// =====================================================================
// batting.js — when you're the batter
//
// You tap the field to swing. Timing and how close your tap is to the ball
// decide whether you miss, foul it off, or put it in play.
// =====================================================================

// You tapped at (x, y).
//   t   — how far along the pitch is (1 = right at the plate)
//   err — how early (-) or late (+) you were, in milliseconds
//   d   — how far your tap was from the ball
//   q   — swing quality from 0 to 1, from timing (ts) and aim (ss)
//   e   — final hit strength, which also uses the batter's power and contact
function swing(x, y, now) {
  const P = S.P;
  if (!P || P.swung || P.done || now < P.t0) return;
  P.swung = true;
  S.ring = { x, y, t: now };
  const t = (now - P.t0) / P.dur,
    err = (t - 1) * P.dur,
    a = Math.abs(err),
    D = S.D;
  const fin = toScreen(P.target),
    d = Math.hypot(x - fin[0], y - fin[1]) / ZW;
  if (a > D.ok || d > D.reach) {
    const why =
      a > D.ok
        ? err < 0
          ? "Way out in front"
          : "Too late"
        : y < fin[1]
          ? "Swung over it"
          : "Swung under it";
    P.pending = { k: "whiff", why };
    return;
  }
  const ts = 1 - 0.8 * clamp((a - D.perfect) / (D.ok - D.perfect), 0, 1),
    ss = 1 - d / D.reach,
    q = ts * 0.55 + ss * 0.45;
  const b = curBatter();
  P.done = true;
  const cp = ballPos(P, t);
  if (q < 0.38 || (q < 0.5 && Math.random() < 0.5)) {
    foulAnim(cp);
    setTimeout(() => {
      callPitch("foul");
    }, 700);
    return;
  }
  const e =
    q +
    (b.pw - 80) / 200 +
    (b.c - 80) / 400 +
    (Math.random() - 0.5) * 0.25 -
    (cpuPitcher().st - 80) / 400;
  const pull = err < 0 ? "pull" : "oppo";
  hitResult(e, b, cp, pull, 0);
}

// You didn't swing: the umpire calls it a ball or a strike.
function resolveTake() {
  const P = S.P;
  P.done = true;
  umpDecides(P.target);
}
