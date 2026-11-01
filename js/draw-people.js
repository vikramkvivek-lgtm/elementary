// =====================================================================
// draw-people.js — drawing the players
//
// Fielders, base runners, the pitcher's animated windup, and the batter's swing.
// =====================================================================

// Batters who hit left-handed. SWITCH hitters bat from the side opposite the pitcher.
const LEFTY = new Set([
  "Corbin Carroll",
  "Shohei Ohtani",
  "Yordan Alvarez",
  "Pete Crow-Armstrong",
  "Matt Olson",
  "Brice Turang",
  "Christian Yelich",
  "Jake Bauers",
  "Sal Frelick",
  "Garrett Mitchell",
  "Freddie Freeman",
  "Kyle Tucker",
  "Max Muncy",
  "Hyeseong Kim",
  "Cody Bellinger",
  "Ben Rice",
  "Austin Wells",
  "Trent Grisham",
  "Anthony Volpe",
  "Kyle Schwarber",
  "Bryce Harper",
  "Bryson Stott",
  "Brandon Marsh",
  "Justin Crawford",
  "Josh Naylor",
  "J.P. Crawford",
  "Brendan Donovan",
  "Luke Raley",
  "Cole Young",
  "Riley Greene",
  "Kerry Carpenter",
  "Parker Meadows",
]);
const SWITCH = new Set(["Elly De La Cruz", "Tommy Edman", "Cal Raleigh", "Wenceel Pérez"]);

// Uniform colors for each team: [jersey, trim, pants, caption stripe].
const KIT = {
  TB: ["#F4F1E8", "#092C5C", "#092C5C", "#8FBCE6"],
  MIL: ["#F2EAD3", "#13294B", "#F2EAD3", "#FFC52F"],
  LA: ["#F4F1E8", "#1E4FA0", "#1E4FA0"],
  NY: ["#A9B1BA", "#1C2841", "#1C2841"],
  PHI: ["#F4F1E8", "#C8102E", "#C8102E"],
  SEA: ["#2B3A44", "#0C8C8C", "#0C2C56"],
  DET: ["#A9B1BA", "#0C2340", "#0C2340"],
};

// Uniform colors for "you" or "cpu".
const kitOf = (team) => KIT[(team === "you" ? MY : CPU).abbr] || KIT.TB;

// The team in the field (the one not batting).
const fieldTeam = () => (S && batTeam() === "you" ? "cpu" : "you");

// Skin tones; each player always gets the same one, based on their name.
const SKIN = ["#C99A78", "#8D5B3E", "#E2B892", "#6B4430", "#B7825E"];
const skinOf = (n) => SKIN[[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % SKIN.length];

// Draw a thick line (used for arms, legs and bats).
function line(x1, y1, x2, y2, w, c) {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// Draw a small player with feet at (x, y). k = size, kit = uniform colors.
// small full-body figure, feet at (x,y)

function figure(x, y, k, kit, o = {}) {
  const [jer, acc, pants] = [kit[0], kit[1], kit[0]],
    lean = (o.lean || 0) * k * 7,
    cr = o.crouch ? k * 4 : 0;
  const hipY = y - 15 * k + cr,
    shY = y - 29 * k + cr * 1.4,
    hx = x,
    sx = x + lean;
  line(hx - 2 * k, hipY, x - (o.spread || 4) * k, y, 3 * k, pants);
  line(hx + 2 * k, hipY, x + (o.spread || 4) * k, y, 3 * k, pants);
  ctx.fillStyle = "#222";
  ctx.fillRect(x - (o.spread || 4) * k - 2 * k, y - 1.5 * k, 4 * k, 2 * k);
  ctx.fillRect(x + (o.spread || 4) * k - 2 * k, y - 1.5 * k, 4 * k, 2 * k);
  ctx.fillStyle = jer;
  ctx.beginPath();
  ctx.moveTo(hx - 4.5 * k, hipY);
  ctx.lineTo(sx - 5.5 * k, shY);
  ctx.lineTo(sx + 5.5 * k, shY);
  ctx.lineTo(hx + 4.5 * k, hipY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = acc;
  ctx.fillRect(hx - 4.5 * k, hipY - 1.5 * k, 9 * k, 1.6 * k);
  const ar = o.arms || "down";
  if (ar === "ready") {
    line(sx - 5 * k, shY + 2 * k, sx - 6 * k, shY + 10 * k, 2.4 * k, jer);
    line(sx + 5 * k, shY + 2 * k, sx + 6 * k, shY + 10 * k, 2.4 * k, jer);
    ctx.fillStyle = "#6B4226";
    ctx.beginPath();
    ctx.arc(sx - 6.5 * k, shY + 11 * k, 2.6 * k, 0, 7);
    ctx.fill();
  } else if (ar === "out") {
    line(sx - 5 * k, shY + 2 * k, sx - 11 * k, shY + 8 * k, 2.4 * k, jer);
    line(sx + 5 * k, shY + 2 * k, sx + 11 * k, shY + 8 * k, 2.4 * k, jer);
  } else {
    line(sx - 5 * k, shY + 2 * k, sx - 6.5 * k, shY + 12 * k, 2.4 * k, jer);
    line(sx + 5 * k, shY + 2 * k, sx + 6.5 * k, shY + 12 * k, 2.4 * k, jer);
  }
  ctx.fillStyle = o.skin || "#C99A78";
  ctx.beginPath();
  ctx.arc(sx, shY - 4.2 * k, 3.8 * k, 0, 7);
  ctx.fill();
  ctx.fillStyle = acc;
  if (o.helmet) {
    ctx.beginPath();
    ctx.arc(sx, shY - 5 * k, 4.4 * k, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(sx - 4.4 * k, shY - 5.4 * k, 8.8 * k, 1.6 * k);
  } else {
    ctx.beginPath();
    ctx.arc(sx, shY - 5.4 * k, 3.9 * k, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(sx - 1 * k, shY - 5.6 * k, 6 * k, 1.4 * k);
  }
}

// Where the 7 fielders stand (pitcher and catcher are drawn separately).
const FIELDPOS = [
  [276, 236],
  [228, 206],
  [134, 206],
  [84, 236],
  [66, 150],
  [180, 136],
  [294, 150],
];

function drawFielders() {
  if (!S) return;
  const kit = kitOf(fieldTeam());
  FIELDPOS.forEach(([x, y], i) =>
    figure(x, y, i > 3 ? 0.55 : 0.68, kit, { arms: "ready", crouch: i <= 3, spread: 5 }),
  );
}

// How far a runner has moved off the base (0 = on the base, 1 = next base).
function runnerLead(i, now) {
  const P = S.P,
    inPlay = S.phase === "hit";
  if (S.stealOn === i && P && !P.done && now > P.t0)
    return clamp(0.25 + ((now - P.t0) / P.dur) * 0.75, 0, 1);
  if (batTeam() === "cpu" && S.cpuWillSteal === i && ["select", "aim", "meter"].includes(S.phase))
    return 0.34;
  if (batTeam() === "you" && S.stealOn === i) return 0.26;
  return inPlay ? 0.3 : 0.14;
}

function drawRunners(now) {
  if (!S) return;
  const kit = kitOf(batTeam());
  S.bases.forEach((r, i) => {
    if (!r || i > 2) return;
    const [x0, y0] = BASEPOS[i],
      [x1, y1] = i < 2 ? BASEPOS[i + 1] : [180, 426],
      f = runnerLead(i, now);
    const x = x0 + (x1 - x0) * f,
      y = y0 + (y1 - y0) * f;
    figure(x, y, 0.62, kit, {
      helmet: true,
      crouch: true,
      lean: f > 0.3 ? 0.8 : 0.2,
      spread: f > 0.4 ? 6 : 5,
      arms: "out",
      skin: skinOf(r.n),
    });
  });
}

// The pitcher's windup, animated with keyframes.
// w goes from 0 to 1 during the windup and 1 to 2 during the follow-through.
// K(keys, w) blends between keyframes to find where a body part is.
function drawPitcher(now) {
  const team = fieldTeam(),
    kit = S ? kitOf(team) : KIT.TB,
    [jer, acc] = kit;
  const p =
    S && S.P ? S.P.p : S && team === "you" ? myPitcher() : S ? cpuPitcher() : MY.rotation[0];
  const st = styleOf(p),
    sd = p.hand === "R" ? -1 : 1,
    skin = skinOf(p.n),
    sl = st.slot,
    A = st.arm,
    kick = st.kick,
    str = st.stride;
  let w = 0;
  if (S && S.P) {
    const P = S.P;
    w =
      now < P.t0
        ? clamp((now - P.wind) / (P.t0 - P.wind || 1), 0, 1)
        : 1 + clamp((now - P.t0) / 400, 0, 1);
  }
  const K = (keys, v) => {
    for (let i = 1; i < keys.length; i++) {
      if (v <= keys[i][0]) {
        const [a, ax, ay] = keys[i - 1],
          [b, bx, by] = keys[i],
          t = (v - a) / (b - a || 1),
          e = t * t * (3 - 2 * t);
        return [ax + (bx - ax) * e, ay + (by - ay) * e];
      }
    }
    const l = keys[keys.length - 1];
    return [l[1], l[2]];
  };
  ctx.save();
  ctx.translate(180, 232);
  ctx.scale(st.k, st.k);
  ctx.translate(-180, -232);
  const cx = 180;
  // a lower slot tilts the upper body toward the glove side
  const tilt = sl * 9;
  const hip = K(
    [
      [0, 0, 213],
      [0.35, 0, 211 - kick * 1],
      [0.7, -sd * 2 * str, 214],
      [1, -sd * 3 * str, 217],
      [2, -sd * 4 * str, 218],
    ],
    w,
  );
  const hipX = cx + hip[0],
    hipY = hip[1];
  const sh = K(
    [
      [0, 0, 196],
      [0.35, sd * 1, 194],
      [0.7, sd * 2, 198],
      [1, -sd * (3 + tilt), 200 + sl * 4],
      [2, -sd * (6 + tilt * 0.6), 206],
    ],
    w,
  );
  const shX = cx + sh[0],
    shY = sh[1];
  const HK = st.hk
    ? st.hk(sd, A, sl)
    : [
        [0, 0, 205],
        [0.35, 0, 203],
        [0.55, sd * 15 * A, 214],
        [0.75, sd * (13 + 6 * sl) * A, 178 + 10 * sl],
        [0.92, sd * (8 + 12 * sl) * A, 171 + 18 * sl],
        [1, sd * (1 + 15 * sl) * A, 177 + 19 * sl - (A - 1) * 8],
        [1.4, -sd * 8, 214],
        [2, -sd * 9, 220],
      ];
  const hand = K(HK, w);
  const glove = K(
    st.gk
      ? st.gk(sd)
      : [
          [0, 1, 205],
          [0.35, 1, 203],
          [0.6, -sd * 12, 198 + sl * 3],
          [1, -sd * 10, 210],
          [2, -sd * 7, 212],
        ],
    w,
  );
  const kneeUp = 222 - kick * 17,
    footUp = 232 - kick * 18;
  const pivotF = K(
    [
      [0, sd * 4, 232],
      [1, sd * 4, 232],
      [1.5, sd * 6, 222],
      [2, sd * 3, 224],
    ],
    w,
  );
  const kickK = K(
    [
      [0, -sd * 4, 222],
      [0.15, -sd * 4, 222],
      [0.38, -sd * (4 + 3 * kick), kneeUp],
      [0.6, -sd * 9 * str, 220],
      [1, -sd * 12 * str, 226],
      [2, -sd * 12 * str, 226],
    ],
    w,
  );
  const kickF = K(
    [
      [0, -sd * 4, 232],
      [0.15, -sd * 4, 232],
      [0.38, -sd * (4 - kick), footUp],
      [0.6, -sd * 12 * str, 232],
      [1, -sd * 15 * str, 234],
      [2, -sd * 15 * str, 234],
    ],
    w,
  );
  const pivK = [(hipX + cx + pivotF[0]) / 2 + sd * 1.5, (hipY + pivotF[1]) / 2];
  line(hipX + sd * 2.5, hipY, pivK[0], pivK[1], 3.6, jer);
  line(pivK[0], pivK[1], cx + pivotF[0], pivotF[1], 3.2, jer);
  line(hipX - sd * 2.5, hipY, cx + kickK[0], kickK[1], 3.6, jer);
  line(cx + kickK[0], kickK[1], cx + kickF[0], kickF[1], 3.2, jer);
  ctx.fillStyle = "#1C1C1C";
  [
    [cx + pivotF[0], pivotF[1]],
    [cx + kickF[0], kickF[1]],
  ].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.ellipse(x, y, 3, 1.6, 0, 0, 7);
    ctx.fill();
  });
  ctx.fillStyle = jer;
  ctx.beginPath();
  ctx.moveTo(hipX - 5, hipY);
  ctx.lineTo(shX - 7, shY);
  ctx.lineTo(shX + 7, shY);
  ctx.lineTo(hipX + 5, hipY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = acc;
  ctx.fillRect(hipX - 5, hipY - 2, 10, 2);
  ctx.fillStyle = acc;
  ctx.font = "800 4.5px system-ui";
  ctx.textAlign = "center";
  ctx.fillText((team === "you" ? MY : CPU).abbr, (hipX + shX) / 2, shY + 8);
  const gs = [shX - sd * 6, shY + 2],
    ge = [(gs[0] + cx + glove[0]) / 2 - sd * 3, (gs[1] + glove[1]) / 2 + 2];
  line(gs[0], gs[1], ge[0], ge[1], 3, jer);
  line(ge[0], ge[1], cx + glove[0], glove[1], 2.8, jer);
  ctx.fillStyle = "#5B3A22";
  ctx.beginPath();
  ctx.arc(cx + glove[0], glove[1], 3.6, 0, 7);
  ctx.fill();
  const headX = shX - sd * sl * 2.5;
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(headX, shY - 6, 4.8, 0, 7);
  ctx.fill();
  ctx.fillStyle = acc;
  ctx.beginPath();
  ctx.arc(headX, shY - 7.2, 4.9, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(headX - 5, shY - 7.6, 10, 1.8);
  const ts = [shX + sd * 6, shY + 1],
    hx = cx + hand[0],
    hy = hand[1];
  const mx = (ts[0] + hx) / 2,
    my = (ts[1] + hy) / 2,
    dx = hx - ts[0],
    dy = hy - ts[1],
    L = Math.hypot(dx, dy) || 1,
    bend = st.longArm && w > 0.45 && w < 0.7 ? 1 : Math.max(3, 15 * A - L * 0.3);
  const el = [mx + (-dy / L) * bend * sd * -1, my + (dx / L) * bend * sd * -1];
  line(ts[0], ts[1], el[0], el[1], 3.2, jer);
  line(el[0], el[1], hx, hy, 2.8, skin);
  if (w > 0.72 && w < 1.25) {
    for (let i = 1; i <= 6; i++) {
      const pw = K(HK, w - i * 0.035);
      ctx.strokeStyle = "rgba(255,255,255," + (0.5 - i * 0.07) + ")";
      ctx.lineWidth = 3.2 - i * 0.35;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(cx + pw[0], pw[1]);
      ctx.stroke();
    }
  }
  if (w < 1) {
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(hx, hy, 1.6, 0, 7);
    ctx.fill();
  }
  ctx.restore();
}

// The batter, from behind. Bats left or right. sw goes 0 -> 1 during a swing.
function drawBatter(now) {
  if (!S || S.phase === "over" || S.phase === "mission-over") return;
  const b = curBatter(),
    pHand = (batTeam() === "you" ? cpuPitcher() : myPitcher()).hand;
  const side = LEFTY.has(b.n) ? "L" : SWITCH.has(b.n) ? (pHand === "R" ? "L" : "R") : "R";
  const m = side === "R" ? 1 : -1,
    X = (v) => 180 + m * (v - 180);
  const [jer, acc, pants] = kitOf(batTeam()),
    skin = skinOf(b.n);
  // swing timing from the latest swing or contact
  let st = -1;
  if (S.ring) st = S.ring.t;
  if (S.Hit && S.Hit.t0 > st) st = S.Hit.t0 - 60;
  const sw = st > 0 ? clamp((now - st) / 220, 0, 1) : 0;
  const stride = sw > 0 ? 6 : 0;
  // legs
  line(X(96), 364, X(86 - stride), 430, 8, pants);
  line(X(106), 364, X(120), 430, 8, pants);
  ctx.fillStyle = "#141414";
  ctx.beginPath();
  ctx.ellipse(X(84 - stride), 431, 8, 3.5, 0, 0, 7);
  ctx.ellipse(X(122), 431, 8, 3.5, 0, 0, 7);
  ctx.fill();
  // torso turns during swing
  const turn = sw * 6;
  ctx.fillStyle = jer;
  ctx.beginPath();
  ctx.moveTo(X(88), 366);
  ctx.lineTo(X(84 + turn), 312);
  ctx.lineTo(X(114 + turn), 314);
  ctx.lineTo(X(112), 366);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = acc;
  ctx.fillRect(Math.min(X(88), X(112)), 362, Math.abs(X(112) - X(88)), 3);
  ctx.fillStyle = acc;
  ctx.font = "bold 15px " + getComputedStyle(document.documentElement).getPropertyValue("--cond");
  ctx.textAlign = "center";
  ctx.font = "800 10px " + getComputedStyle(document.documentElement).getPropertyValue("--cond");
  ctx.fillText((batTeam() === "you" ? MY : CPU).abbr, X(99 + turn / 2), 329);
  ctx.font = "bold 15px " + getComputedStyle(document.documentElement).getPropertyValue("--cond");
  ctx.fillText(String(((b.n.length * 7) % 60) + 1), X(99 + turn / 2), 347);
  // head with batting helmet and ear flap
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(X(100 + turn), 300, 9.5, 0, 7);
  ctx.fill();
  ctx.fillStyle = acc;
  ctx.beginPath();
  ctx.arc(X(100 + turn), 297, 10.5, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(X(96 + turn), 301, 5, 6.5, 0, 0, 7);
  ctx.fill();
  ctx.fillRect(
    Math.min(X(100 + turn), X(113 + turn)),
    294,
    Math.abs(X(113 + turn) - X(100 + turn)),
    3,
  );
  // hands and bat: rest angle cocked up-back, sweeps through the zone, wraps over the shoulder
  const hx = X(104 + sw * 12),
    hy = 322 + sw * 6;
  line(X(106 + turn), 316, hx, hy, 6, jer);
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(hx, hy, 4, 0, 7);
  ctx.fill();
  const a0 = -2.2,
    a1 = 0.05,
    a2 = 2.1;
  const ang = sw < 0.55 ? a0 + (a1 - a0) * (sw / 0.55) : a1 + (a2 - a1) * ((sw - 0.55) / 0.45);
  const len = sw > 0.2 && sw < 0.75 ? 82 : 74,
    bx = hx + m * Math.cos(ang) * len,
    by = hy + Math.sin(ang) * len * (sw > 0.2 && sw < 0.75 ? 0.35 : 1);
  ctx.strokeStyle = "#C9A26B";
  ctx.lineCap = "round";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(hx, hy);
  ctx.lineTo(bx, by);
  ctx.stroke();
  ctx.lineWidth = 5.5;
  ctx.beginPath();
  ctx.moveTo(hx + (bx - hx) * 0.55, hy + (by - hy) * 0.55);
  ctx.lineTo(bx, by);
  ctx.stroke();
  ctx.textAlign = "left";
}
