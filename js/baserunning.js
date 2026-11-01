// =====================================================================
// baserunning.js — steals, sacrifice flies and pickoffs
// =====================================================================

// You tapped "Steal 2nd"/"Steal 3rd". The runner goes on the next pitch.
function toggleSteal(i) {
  if (batTeam() !== "you" || S.over) return;
  if (S.P && S.P.done === false && performance.now() > S.P.t0 + S.P.dur * 0.5) return;
  S.stealOn = S.stealOn === i ? null : i;
  renderPanel();
}

// You tapped "Sac fly". Your batter will try to lift the next pitch.
function toggleSac() {
  if (batTeam() !== "you" || S.over) return;
  S.sacOn = !S.sacOn;
  renderPanel();
}

// The automatic swing for a sac fly. Usually a deep fly out that scores the
// runner from third; sometimes a double; sometimes too shallow.
function sacSwing(P) {
  P.swung = true;
  P.done = true;
  S.sacOn = false;
  const b = curBatter(),
    now = performance.now(),
    cp = ballPos(P, (now - P.t0) / P.dur);
  S.ring = { x: cp[0], y: cp[1], t: now };
  const roll = Math.random(),
    good = 0.55 + (b.pw - 60) / 100;
  let type = "OUT",
    deep = true;
  if (roll < 0.1) type = "2B";
  else if (roll >= 0.1 + good * 0.9) deep = false;
  S.Hit = {
    from: [cp[0], cp[1]],
    to: [180 + rnd(-110, 110), type === "2B" ? 128 : deep ? 132 : 172],
    h: 80,
    dur: 1300,
    r1: 2.5,
    t0: now,
  };
  S.phase = "hit";
  setTimeout(() => inPlay(type, "fly", deep, b, Math.random() < 0.5 ? "pull" : "oppo"), 1380);
}

// You're pitching and tried to pick off runner i. Runners taking a big
// lead (about to steal) are easier to catch. 2 tries per batter.
function pickoff(i) {
  if (!["select", "aim"].includes(S.phase) || batTeam() !== "cpu") return;
  const r = S.bases[i];
  if (!r || (S.diseng || 0) >= 2) return;
  S.diseng = (S.diseng || 0) + 1;
  const bigLead = S.cpuWillSteal === i,
    bn = ["first", "second", "third"][i];
  const pOut = (bigLead ? 0.4 : 0.12) - (r.s > 90 ? 0.04 : 0),
    roll = Math.random();
  if (roll < pOut) {
    S.bases[i] = null;
    S.outs++;
    S.cpuWillSteal = null;
    logMsg("Picked off! " + r.n + " is out at " + bn + ".");
    showCall("Picked off!", r.n);
    renderBoard();
    if (S.outs >= 3) {
      S.b = 0;
      S.s = 0;
      S.phase = "idle";
      renderPanel();
      return setTimeout(endHalf, 1700);
    }
  } else if (roll < pOut + 0.05) {
    let runs = 0;
    for (let j = 2; j >= 0; j--) {
      if (S.bases[j]) {
        if (j === 2) runs++;
        else S.bases[j + 1] = S.bases[j];
        S.bases[j] = null;
      }
    }
    addRuns("cpu", runs);
    logMsg("Throwing error on the pickoff. Runners move up" + (runs ? " and a run scores." : "."));
    showCall("Throwing error", runs ? "Run scores" : "Runners advance");
    if (S.half === 1 && S.inn >= S.innings && total("cpu") > total("you")) {
      S.phase = "idle";
      renderPanel();
      return setTimeout(gameOver, 1600);
    }
  } else {
    if (bigLead && Math.random() < 0.5) S.cpuWillSteal = null;
    logMsg(r.n + " dives back in time.");
    showCall("Safe", 2 - S.diseng + " pickoff" + (2 - S.diseng === 1 ? "" : "s") + " left");
  }
  renderBoard();
  renderPanel();
}
