// =====================================================================
// setup.js — the drawing area, the game "state", and small helpers
//
// The most important thing in this file is S, the game state.
// Everything about the current game lives in S (see baseState below).
// =====================================================================

// ---------- Canvas (the picture of the field) ----------
// The field is drawn on a 360 x 440 canvas.
// ZX/ZY is the center of the strike zone; ZW/ZH is its width and height.
const W = 360,
  H = 440,
  ZX = 180,
  ZY = 322,
  ZW = 96,
  ZH = 120;
const cv = document.getElementById("cv"),
  ctx = cv.getContext("2d");

// Make the canvas sharp on any screen size (phones have extra-dense pixels).
function resize() {
  const r = cv.getBoundingClientRect(),
    d = window.devicePixelRatio || 1;
  cv.width = Math.round(r.width * d);
  cv.height = Math.round(((r.width * H) / W) * d);
  const s = cv.width / W;
  ctx.setTransform(s, 0, 0, s, 0, 0);
}
window.addEventListener("resize", resize);

// "Zone" coordinates: (0,0) is the middle of the strike zone and the edges are -1 and 1.
// toScreen turns zone coordinates into canvas pixels; toZone goes the other way.
const toScreen = ([nx, ny]) => [ZX + (nx * ZW) / 2, ZY - (ny * ZH) / 2];
const toZone = (x, y) => [(x - ZX) / (ZW / 2), (ZY - y) / (ZH / 2)];

// 260 random colored dots that make up the crowd in the stands.
const crowd = [];
for (let i = 0; i < 260; i++)
  crowd.push([
    Math.random() * 360,
    72 + Math.random() * 44,
    ["#5A4A3C", "#3E5466", "#7A6A58", "#4E3F4A", "#6B7A6E", "#8A5A44"][i % 6],
  ]);

// Where first, second and third base are drawn on the canvas.
const BASEPOS = [
  [290, 251],
  [180, 197],
  [70, 251],
];

// ---------- State ----------
// S = the current game (null while you're on the menu).
// setup = the choices you made on the menu.
let S = null,
  setup = {
    starter: 0,
    innings: 3,
    diff: "pro",
    opp: 0,
    mine: 0,
    mode: "game",
    mission: 0,
    batter: 0,
  };

// Small helpers used everywhere:
//   rnd(a, b)      random number between a and b
//   clamp(v, a, b) keep v between a and b
//   pick(list)     random item from a list
//   ord(3)         "3rd"
const rnd = (a, b) => a + Math.random() * (b - a),
  clamp = (v, a, b) => Math.max(a, Math.min(b, v)),
  pick = (a) => a[Math.floor(Math.random() * a.length)];
const ord = (n) =>
  n +
  (["th", "st", "nd", "rd"][n % 100 > 10 && n % 100 < 14 ? 0 : n % 10 < 4 ? n % 10 : 0] || "th");

// Who is batting right now: you bat in the top of the inning, the CPU in the bottom.
const batTeam = () => (S.half === 0 ? "you" : "cpu");
// Total runs for "you" or "cpu".
const total = (t) => S.runs[t].reduce((a, b) => a + (b || 0), 0);

// The player at the plate right now.
function curBatter() {
  const t = batTeam();
  const L = t === "you" ? MY.lineup : CPU.lineup;
  return L[S.idx[t] % 9];
}
function myPitcher() {
  return MY.rotation[S.myP];
}
function cpuPitcher() {
  return CPU.staff[S.cpuP];
}

// A fresh game state. What each field means:
//   inn, half      inning number; half 0 = top (you bat), 1 = bottom (you pitch)
//   outs, b, s     outs, balls, strikes
//   bases          [first, second, third] — the runner on each base, or null
//   runs, hits     runs per inning and total hits, for "you" and "cpu"
//   idx            where each team is in its batting order
//   D              the difficulty settings (from DIFF in rosters.js)
//   myP, pc        your current pitcher, and pitch counts by pitcher name
//   cpuP, cpuPC    the CPU's current pitcher and its pitch count
//   st             your batters' stats today (at-bats, hits, home runs...)
//   chal           ABS challenges left for each team
//   phase          what's happening right now (see the list in main.js)
//   P              the pitch in the air;  Hit = the batted ball in the air
//   ring           the yellow circle where you tapped
//   sel, aim       the pitch you chose and where you aimed it
//   last           text like "98 mph 4-Seam" for the scoreboard
function baseState() {
  MY = MINE[setup.mine];
  CPU = TEAMS[setup.opp];
  return {
    inn: 1,
    half: 0,
    outs: 0,
    b: 0,
    s: 0,
    bases: [null, null, null],
    runs: { you: [], cpu: [] },
    hits: { you: 0, cpu: 0 },
    idx: { you: 0, cpu: 0 },
    innings: setup.innings,
    D: DIFF[setup.diff],
    myP: setup.starter,
    pc: {},
    cpuP: 0,
    cpuPC: 0,
    st: {},
    chal: { you: CHALLENGES, cpu: CHALLENGES },
    log: [],
    phase: "idle",
    P: null,
    Hit: null,
    ring: null,
    sel: null,
    aim: null,
    meterT0: 0,
    last: "",
    over: false,
    mode: "game",
  };
}

// Start a full game (the "Play ball" button).
function newGame() {
  S = baseState();
  MY.lineup.forEach((b) => (S.st[b.n] = { ab: 0, h: 0, hr: 0, rbi: 0, bb: 0, k: 0 }));
  logMsg(
    "Play ball. " +
      UMP.n +
      " is behind the plate. Each team has " +
      CHALLENGES +
      " ABS challenges.",
  );
  startHalf();
}
