// =====================================================================
// umpire.js — the umpire and ABS challenges
//
// The umpire misses every 3rd or 4th close call on purpose. When a call
// goes against you, you get a few seconds to challenge it. The ABS
// (automated ball-strike system) then shows where the pitch really was.
// =====================================================================

// The real answer: is this location inside the strike zone?
const absStrike = ([x, y]) => Math.abs(x) <= 1.06 && Math.abs(y) <= 1.06;

// How close a pitch is to the edge of the zone (close pitches are more likely to be challenged).
const edgeDist = ([x, y]) => Math.abs(Math.max(Math.abs(x), Math.abs(y)) - 1.06);

// The umpire makes a call. Sometimes it's wrong on purpose.
// If the call hurts you, show the Challenge button.
// If it hurts the CPU, the CPU might challenge (more likely if the call was wrong).
function umpDecides(loc) {
  if (S.mode === "mission") return callPitch(absStrike(loc) ? "called" : "ball");
  const truth = absStrike(loc) ? "called" : "ball",
    d = edgeDist(loc);
  S.umpCount = (S.umpCount || 0) + 1;
  if (!S.umpNext) S.umpNext = Math.random() < 0.5 ? 3 : 4;
  const miss = S.umpCount >= S.umpNext;
  if (miss) {
    S.umpCount = 0;
    S.umpNext = Math.random() < 0.5 ? 3 : 4;
  }
  const call = miss ? (truth === "called" ? "ball" : "called") : truth;
  const hurt = call === "called" ? batTeam() : batTeam() === "you" ? "cpu" : "you";
  S.pend = { call, truth, loc, hurt };
  if (hurt === "you" && S.chal.you > 0) {
    S.phase = "challenge";
    S.chalEnd = performance.now() + 4500;
    showCall(call === "called" ? "Strike" : "Ball", "Ump " + UMP.n.split(" ")[1]);
    renderPanel();
    return;
  }
  if (hurt === "cpu" && S.chal.cpu > 0) {
    let pr = call !== truth ? 0.72 : d < 0.12 ? 0.18 : 0.03;
    if ((call === "called" && S.s === 2) || (call === "ball" && S.b === 3)) pr += 0.2;
    if (Math.random() < pr) {
      showCall(call === "called" ? "Strike" : "Ball", "Ump " + UMP.n.split(" ")[1]);
      S.phase = "idle";
      renderPanel();
      setTimeout(() => runChallenge("cpu"), 1000);
      return;
    }
  }
  callPitch(call);
}

// You pressed "Accept call" (or the timer ran out).
function acceptCall() {
  if (S.phase !== "challenge") return;
  S.phase = "idle";
  callPitch(S.pend.call);
}

// Play the ABS review. If the umpire was wrong, the call flips.
// If the umpire was right, the team that challenged loses a challenge.
function runChallenge(team) {
  const c = S.pend;
  S.phase = "abs";
  S.abs = { t0: performance.now(), loc: c.loc, over: c.call !== c.truth, truth: c.truth };
  logMsg(
    (team === "you" ? "You challenge" : CPU.name + " challenges") +
      " the " +
      (c.call === "called" ? "strike" : "ball") +
      " call.",
  );
  renderPanel();
  setTimeout(() => {
    const over = c.call !== c.truth;
    if (!over) S.chal[team]--;
    renderBoard();
    showCall(
      over ? "Overturned" : "Call stands",
      over
        ? c.truth === "called"
          ? "ABS says strike"
          : "ABS says ball"
        : team === "you"
          ? "You lose a challenge"
          : CPU.name + " loses a challenge",
    );
    logMsg(
      "ABS: " +
        (over
          ? "call overturned, it’s a " + (c.truth === "called" ? "strike" : "ball") + "."
          : "call stands. " +
            (team === "you" ? "You have " : CPU.name + " has ") +
            S.chal[team] +
            " left."),
    );
    setTimeout(() => {
      S.abs = null;
      callPitch(over ? c.truth : c.call);
    }, 1500);
  }, 1900);
}
