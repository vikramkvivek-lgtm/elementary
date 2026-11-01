// =====================================================================
// input.js — taps and clicks
//
// Every button has a data-a="..." name. The click handler below looks at
// that name and calls the right function. Taps on the field are swings
// (batting) or aiming/releasing (pitching).
// =====================================================================

document.getElementById("panel").addEventListener("click", (ev) => {
  const btn = ev.target.closest("button");
  if (!btn) return;
  const a = btn.dataset.a,
    i = btn.dataset.i;
  if (a === "set") {
    const k = btn.dataset.k;
    setup[k] = isNaN(+i) ? i : +i;
    if (k === "mine") {
      setup.starter = 0;
      setup.batter = 0;
    }
    renderPanel();
  } else if (a === "mstart") {
    startMission();
  } else if (a === "retry") {
    startMission();
  } else if (a === "start" || a === "again") {
    document.getElementById("log").innerHTML = "";
    newGame();
  } else if (a === "menu") {
    S = null;
    document.getElementById("log").innerHTML = "";
    renderBoard();
    renderPanel();
  } else if (a === "pitch") choosePitch(+i);
  else if (a === "release") release();
  else if (a === "challenge") {
    if (S.phase === "challenge") runChallenge("you");
  } else if (a === "accept") acceptCall();
  else if (a === "steal") toggleSteal(+i);
  else if (a === "sac") toggleSac();
  else if (a === "pick") pickoff(+i);
  else if (a === "bullpen") {
    if (["select", "aim", "meter"].includes(S.phase)) {
      S.phase = "bullpen";
      renderPanel();
    }
  } else if (a === "sub") {
    S.myP = +i;
    logMsg(MY.rotation[S.myP].n + " comes in to pitch.");
    S.phase = "select";
    S.sel = null;
    renderPanel();
  } else if (a === "nosub") {
    S.phase = "select";
    renderPanel();
  }
});

// Taps on the field.
cv.addEventListener("pointerdown", (ev) => {
  if (!S) return;
  const r = cv.getBoundingClientRect(),
    x = ((ev.clientX - r.left) * W) / r.width,
    y = ((ev.clientY - r.top) * H) / r.height,
    now = performance.now();
  if (S.phase === "flight-bat") swing(x, y, now);
  else if (S.phase === "aim") aimAt(x, y);
  else if (S.phase === "meter") release();
});
