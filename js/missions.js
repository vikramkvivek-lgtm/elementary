// =====================================================================
// missions.js — mission mode (short challenges)
//
// In mission mode, every pitch resets the count and bases. Each swing or
// pitch uses up one of your "shots". Hit the goal before you run out!
// =====================================================================

// Start the mission chosen on the menu.
function startMission() {
  S = baseState();
  S.mode = "mission";
  const M = Object.assign({ used: 0, prog: 0 }, MISSIONS[setup.mission]);
  S.mission = M;
  S.half = M.type === "bat" ? 0 : 1;
  S.runs.you[0] = 0;
  S.runs.cpu[0] = 0;
  if (M.type === "bat") S.idx.you = setup.batter;
  MY.lineup.forEach((b) => (S.st[b.n] = { ab: 0, h: 0, hr: 0, rbi: 0, bb: 0, k: 0 }));
  document.getElementById("log").innerHTML = "";
  logMsg("Mission: " + M.d + (M.type === "bat" ? ". Taken pitches don’t use a swing." : "."));
  renderBoard();
  showCall(M.t, M.d);
  S.phase = "idle";
  renderPanel();
  setTimeout(nextPitch, 1700);
}

// Words shown on screen for each result.
const EVT = {
  "1B": "Single",
  "2B": "Double",
  "3B": "Triple",
  HR: "Home run!",
  OUT: "Out",
  ball: "Ball",
  called: "Strike",
  swinging: "Swing and a miss",
  foul: "Foul",
};

// Called after every pitch in a mission: update progress, then win, lose or keep going.
function missionPitch(evt) {
  const M = S.mission;
  S.b = 0;
  S.s = 0;
  S.bases = [null, null, null];
  const counts = !(M.type === "bat" && (evt === "ball" || evt === "called"));
  if (counts) M.used++;
  const hit = M.counts.includes(evt);
  if (hit) M.prog++;
  if (M.type === "pitch") S.idx.cpu++;
  if (evt === "HR" && navigator.vibrate) navigator.vibrate([40, 40, 80]);
  renderBoard();
  showCall(
    EVT[evt] || evt,
    hit ? M.unit + ": " + M.prog + " of " + M.need : M.shots - M.used + " left",
  );
  S.phase = "idle";
  if (M.prog >= M.need) return setTimeout(() => missionEnd(true), 1500);
  if (M.used >= M.shots) return setTimeout(() => missionEnd(false), 1500);
  renderPanel();
  setTimeout(nextPitch, 1400);
}

// Show "Mission complete" or "Mission failed".
function missionEnd(won) {
  S.phase = "mission-over";
  S.over = true;
  S.missionWon = won;
  renderPanel();
  showCall(
    won ? "Mission complete" : "Mission failed",
    S.mission.unit + ": " + S.mission.prog + " of " + S.mission.need,
  );
  if (won && navigator.vibrate) navigator.vibrate([60, 40, 60, 40, 120]);
}
