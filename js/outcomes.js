// =====================================================================
// outcomes.js — what happens after each pitch
//
// Balls, strikes, hits, outs, runners moving, runs scoring,
// and ending the inning or the game.
// =====================================================================

// Turn hit strength (e) into a result:
//   above 0.98 = home run, above 0.88 = double (or triple for fast runners),
//   above 0.7 = probably a single, lower = probably an out.
// Then start the animation of the ball flying (S.Hit).
function hitResult(e, b, cp, dir, cpuSide) {
  let type;
  if (e > 0.98) type = "HR";
  else if (e > 0.88) type = b.s > 88 && Math.random() < 0.3 ? "3B" : "2B";
  else if (e > 0.7) type = Math.random() < (cpuSide ? 0.7 : 0.6 + (b.c - 80) / 100) ? "1B" : "OUT";
  else if (e > 0.5) type = Math.random() < (cpuSide ? 0.32 : 0.25) ? "1B" : "OUT";
  else type = "OUT";
  let kind = null,
    deep = false;
  if (type === "OUT") {
    kind = e > 0.6 ? pick(["fly", "line"]) : pick(["ground", "ground", "fly"]);
    deep = kind === "fly" && e > 0.62;
  }
  const side = dir === "pull" ? (cpuSide ? 1 : -1) : cpuSide ? -1 : 1;
  let to,
    h,
    dur = 1000,
    r1 = 3;
  if (type === "HR") {
    to = [180 + side * rnd(30, 120), 36];
    h = 90;
    dur = 1400;
    r1 = 1.5;
  } else if (type === "2B" || type === "3B") {
    to = [180 + side * rnd(80, 150), 128];
    h = 55;
  } else if (type === "1B") {
    to = [180 + side * rnd(20, 110), rnd(150, 175)];
    h = type && Math.random() < 0.5 ? 8 : 30;
  } else if (kind === "ground") {
    to = [180 + side * rnd(20, 100), rnd(232, 260)];
    h = 4;
    dur = 700;
    r1 = 4;
  } else if (kind === "line") {
    to = [180 + side * rnd(30, 110), rnd(190, 230)];
    h = 14;
    dur = 650;
  } else {
    to = [180 + side * rnd(0, 120), deep ? 132 : rnd(150, 180)];
    h = deep ? 80 : 60;
    dur = 1300;
    r1 = 2.5;
  }
  S.Hit = { from: cp, to, h, dur, r1, t0: performance.now() };
  S.phase = "hit";
  setTimeout(() => inPlay(type, kind, deep, b, dir), dur + 80);
}

// Which part of the field a pulled or opposite-field hit goes to.
const SPOT = { pull: ["left", "left-center"], oppo: ["right", "right-center"] };

// The ball landed: update runners, runs and stats, and announce it.
function inPlay(type, kind, deep, b, dir) {
  if (S.mode === "mission") return missionPitch(type);
  S.stealOn = null;
  if (batTeam() === "cpu") S.cpuDry = type === "OUT" ? (S.cpuDry || 0) + 1 : 0;
  const t = batTeam(),
    mine = t === "you",
    st = mine ? S.st[b.n] : null;
  let runs = 0,
    text = "",
    big = "",
    sub = "";
  if (type !== "OUT") {
    runs = advance(type, b);
    S.hits[t]++;
    if (st) {
      st.ab++;
      st.h++;
      if (type === "HR") st.hr++;
      st.rbi += runs;
    }
    const f = pick(dir === "pull" ? SPOT.pull : SPOT.oppo);
    text = {
      "1B": pick([
        "lines a single to " + f,
        "bloops a single into " + f,
        "grounds a single through the infield",
      ]),
      "2B": "rips a double into the " + f + " gap",
      "3B": "legs out a triple to " + f,
      HR: pick([
        "crushes a home run to " + f,
        "launches one over the " + f + " wall",
        "hits a no-doubter to " + f,
      ]),
    }[type];
    big = { "1B": "Single", "2B": "Double", "3B": "Triple", HR: "Home run!" }[type];
    if (type === "HR" && navigator.vibrate) navigator.vibrate([40, 40, 80]);
  } else {
    const r = recordOut(kind, deep);
    runs = r.r;
    const f =
      kind === "ground"
        ? pick(["short", "second", "third", "first"])
        : pick(["left", "center", "right"]);
    if (r.dp) {
      text = "grounds into a double play";
      big = "Double play";
    } else if (r.sac) {
      text = "hits a sacrifice fly to " + f;
      big = "Sac fly";
    } else {
      text =
        (kind === "ground"
          ? "grounds out to "
          : kind === "line"
            ? "lines out to "
            : "flies out to ") + f;
      big = "Out";
    }
    if (st) {
      if (!r.sac) st.ab++;
      st.rbi += runs;
    }
  }
  if (runs) sub = runs + (runs > 1 ? " runs score" : " run scores");
  addRuns(t, runs);
  logMsg(b.n + " " + text + (runs ? ". " + sub + "." : "."));
  showCall(big, sub);
  endPA();
}

// Move the runners for a walk (BB), single, double, triple or home run.
// Returns how many runs scored.
function advance(type, bat) {
  const B = S.bases;
  let r = 0;
  if (type === "BB") {
    if (B[0]) {
      if (B[1]) {
        if (B[2]) r++;
        B[2] = B[1];
      }
      B[1] = B[0];
    }
    B[0] = bat;
  } else if (type === "1B") {
    if (B[2]) {
      r++;
      B[2] = null;
    }
    if (B[1]) {
      r++;
      B[1] = null;
    }
    if (B[0]) {
      if (B[0].s >= 90 && Math.random() < 0.5) B[2] = B[0];
      else B[1] = B[0];
    }
    B[0] = bat;
  } else if (type === "2B") {
    if (B[2]) r++;
    if (B[1]) r++;
    let n3 = null;
    if (B[0]) {
      if (B[0].s >= 85 && Math.random() < 0.55) r++;
      else n3 = B[0];
    }
    S.bases = [null, bat, n3];
  } else if (type === "3B") {
    r = B.filter(Boolean).length;
    S.bases = [null, null, bat];
  } else if (type === "HR") {
    r = B.filter(Boolean).length + 1;
    S.bases = [null, null, null];
  }
  return r;
}

// Record an out. Ground balls can be double plays; deep fly balls can be sac flies.
function recordOut(kind, deep) {
  const B = S.bases;
  let r = 0,
    outs = 1,
    dp = false,
    sac = false;
  if (kind === "ground") {
    if (B[0] && S.outs < 2 && Math.random() < 0.45) {
      outs = 2;
      dp = true;
      B[0] = null;
    }
    if (S.outs + outs < 3) {
      if (B[2]) {
        r++;
        B[2] = null;
      }
      if (B[1]) {
        B[2] = B[1];
        B[1] = null;
      }
      if (B[0]) {
        B[1] = B[0];
        B[0] = null;
      }
    }
  } else if (kind === "fly" && deep && B[2] && S.outs < 2) {
    r = 1;
    B[2] = null;
    sac = true;
  }
  S.outs += outs;
  return { r, dp, sac };
}

// Add n runs for team t in this inning.
function addRuns(t, n) {
  S.runs[t][S.inn - 1] = (S.runs[t][S.inn - 1] || 0) + n;
  renderBoard();
}

// Handle a pitch that wasn't hit into play: "ball", "called" (strike),
// "swinging" (strike) or "foul". Also finishes any steal attempt.
function callPitch(k) {
  if (S.mode === "mission") return missionPitch(k);
  const b = curBatter(),
    mine = batTeam() === "you";
  if (S.stealOn != null) {
    const from = S.stealOn,
      r = S.bases[from];
    S.stealOn = null;
    if (r && !S.bases[from + 1]) {
      if (k === "foul") {
        S.note = "Runner goes back";
      } else {
        const strongArm = !mine && MY.lineup.some((x) => x.p === "C" && x.c >= 95) ? 0.08 : 0;
        const ok = Math.random() < clamp(0.3 + (r.s / 100) * 0.55 - strongArm, 0.35, 0.9);
        const bn = from === 0 ? "second" : "third";
        if (ok) {
          S.bases[from + 1] = r;
          S.bases[from] = null;
          S.note = r.n.split(" ").slice(1).join(" ") + " steals " + bn;
          logMsg(r.n + " steals " + bn + "!");
        } else {
          S.bases[from] = null;
          S.outs++;
          S.note = "Caught stealing";
          logMsg(r.n + " is caught stealing " + bn + ".");
          if (!mine) S.cpuDry = S.cpuDry || 0;
          if (S.outs >= 3) {
            S.b = 0;
            S.s = 0;
            renderBoard();
            S.note = "";
            showCall("Caught stealing", "Inning over");
            S.phase = "idle";
            renderPanel();
            setTimeout(endHalf, 1700);
            return;
          }
        }
      }
    }
  }
  if (k === "swinging" || k === "called") {
    if (S.s === 2 && !mine) S.cpuDry = (S.cpuDry || 0) + 1;
  }
  if (k === "ball" && S.b === 3 && !mine) S.cpuDry = 0;
  if (k === "ball") {
    S.b++;
    if (S.b === 4) {
      const r = advance("BB", b);
      if (mine) {
        S.st[b.n].bb++;
        S.st[b.n].rbi += r;
      }
      addRuns(batTeam(), r);
      logMsg(b.n + " walks" + (r ? ". A run scores." : "."));
      showCall("Ball four", r ? "Run scores" : "");
      endPA();
      return;
    }
    showCall("Ball " + S.b, S.last);
  } else if (k === "foul") {
    if (S.s < 2) S.s++;
    showCall("Foul", S.last);
  } else {
    S.s++;
    if (S.s === 3) {
      S.outs++;
      if (mine) {
        S.st[b.n].ab++;
        S.st[b.n].k++;
      }
      logMsg(b.n + (k === "called" ? " is caught looking." : " strikes out swinging."));
      showCall("Strike three", k === "called" ? "Caught looking" : "Swinging");
      endPA();
      return;
    }
    showCall(
      k === "called" ? "Strike" : "Swing and a miss",
      S.P && S.P.pending ? S.P.pending.why : S.last,
    );
  }
  renderBoard();
  S.phase = "idle";
  renderPanel();
  setTimeout(nextPitch, 1300);
}

// The batter is done (hit, out, walk or strikeout). Next batter, or end the inning/game.
function endPA() {
  const t = batTeam();
  S.b = 0;
  S.s = 0;
  S.idx[t]++;
  S.diseng = 0;
  S.stealOn = null;
  S.sacOn = false;
  renderBoard();
  S.phase = "idle";
  if (S.half === 1 && S.inn >= S.innings && total("cpu") > total("you")) {
    return setTimeout(() => gameOver(), 1600);
  }
  if (S.outs >= 3) {
    setTimeout(endHalf, 1700);
  } else setTimeout(nextPitch, 1700);
  renderPanel();
}

// Three outs: switch sides, or end the game if someone has won.
function endHalf() {
  if (S.half === 0) {
    if (S.inn >= S.innings && total("cpu") > total("you")) return gameOver();
    S.half = 1;
    startHalf();
  } else {
    if (S.inn >= S.innings && total("you") !== total("cpu")) return gameOver();
    S.inn++;
    S.half = 0;
    startHalf();
  }
}

// Show the final score.
function gameOver() {
  S.over = true;
  S.phase = "over";
  renderBoard();
  renderPanel();
  const y = total("you"),
    c = total("cpu");
  showCall(y > c ? "Ballgame!" : "Final", y + "–" + c);
}
