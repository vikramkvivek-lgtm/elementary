// =====================================================================
// pitchers.js — each pitcher's windup and arm angle
//
// Every pitcher has their own delivery style:
//   tag    — word that pops up at release ("SLINGSHOT!")
//   slot   — arm angle: 0 = straight over the top, 1 = sidearm
//   kick   — how high the leg lifts     stride — how long the step is
//   k      — body size                  arm    — arm length
//   tempo  — windup speed (smaller = quicker)
//   d      — description shown on screen
//   hk/gk  — optional custom hand/glove paths (Misiorowski has one)
// =====================================================================

const STYLE = {
  "Jacob Misiorowski": {
    tag: "SKY HIGH",
    longArm: true,
    hk: (sd, A, sl) => [
      [0, 0, 205],
      [0.3, 0, 203],
      [0.46, sd * 9 * A, 214],
      [0.6, sd * 21 * A, 223],
      [0.66, sd * 21 * A, 222],
      [0.8, sd * 16 * A, 186],
      [0.9, sd * 7 * A, 170],
      [1, sd * (1 + 15 * sl) * A, 177 + 19 * sl - (A - 1) * 8],
      [1.4, -sd * 9, 216],
      [2, -sd * 10, 222],
    ],
    gk: (sd) => [
      [0, 1, 205],
      [0.3, 1, 203],
      [0.5, -sd * 12, 200],
      [0.68, -sd * 13, 199],
      [0.85, -sd * 11, 203],
      [1, -sd * 8, 212],
      [2, -sd * 6, 214],
    ],
    slot: 0.08,
    kick: 1,
    stride: 1.2,
    k: 1.13,
    arm: 1.1,
    tempo: 1,
    d: "Tall, over the top, huge stride",
  },
  "Shohei Ohtani": {
    tag: "HIGH HEAT",
    slot: 0.32,
    kick: 0.45,
    stride: 1.1,
    k: 1.05,
    arm: 1.05,
    tempo: 0.9,
    d: "High three-quarter, quick lift",
  },
  "Cam Schlittler": {
    tag: "OVER THE TOP",
    slot: 0.05,
    kick: 0.9,
    stride: 1.05,
    k: 1.08,
    arm: 1,
    tempo: 1,
    d: "Straight over the top",
  },
  "Chris Sale": {
    tag: "SLINGSHOT",
    slot: 0.88,
    kick: 0.7,
    stride: 1.15,
    k: 1.08,
    arm: 1.22,
    tempo: 0.85,
    d: "Low slot, long slingy arm",
  },
  "Cristopher Sánchez": {
    tag: "SINKER SLOT",
    slot: 0.62,
    kick: 0.7,
    stride: 1,
    k: 1.05,
    arm: 1.08,
    tempo: 1.05,
    d: "Low three-quarter sinkerballer",
  },
  "Quinn Priester": {
    tag: "THREE-QUARTER",
    slot: 0.35,
    kick: 0.8,
    stride: 1,
    k: 1.03,
    arm: 1,
    tempo: 1,
    d: "Three-quarter",
  },
  "Chad Patrick": {
    tag: "THREE-QUARTER",
    slot: 0.38,
    kick: 0.75,
    stride: 1,
    k: 1,
    arm: 1,
    tempo: 0.95,
    d: "Three-quarter",
  },
  "Abner Uribe": {
    tag: "MAX EFFORT",
    slot: 0.42,
    kick: 0.6,
    stride: 1.1,
    k: 1.03,
    arm: 1.05,
    tempo: 0.8,
    d: "Max-effort three-quarter",
  },
  "Trevor Megill": {
    tag: "STRAIGHT DOWN",
    slot: 0.1,
    kick: 0.8,
    stride: 1.1,
    k: 1.12,
    arm: 1.08,
    tempo: 1,
    d: "Tall, over the top",
  },
  "Yoshinobu Yamamoto": {
    tag: "NO-KICK STRIDE",
    slot: 0.15,
    kick: 0.12,
    stride: 1.3,
    k: 0.95,
    arm: 1,
    tempo: 1.1,
    d: "Barely lifts the leg, long stride",
  },
  "Edwin Díaz": {
    tag: "WHIP",
    slot: 0.55,
    kick: 0.6,
    stride: 1.1,
    k: 1.04,
    arm: 1.1,
    tempo: 0.9,
    d: "Low three-quarter whip",
  },
  "Max Fried": {
    tag: "SMOOTH",
    slot: 0.3,
    kick: 0.85,
    stride: 1.05,
    k: 1.03,
    arm: 1,
    tempo: 1,
    d: "Smooth three-quarter",
  },
  "David Bednar": {
    tag: "OVER THE TOP",
    slot: 0.15,
    kick: 0.8,
    stride: 1,
    k: 1.03,
    arm: 1,
    tempo: 1,
    d: "Over the top",
  },
  "Jesús Luzardo": {
    tag: "LOW SLOT",
    slot: 0.5,
    kick: 0.7,
    stride: 1,
    k: 1,
    arm: 1.05,
    tempo: 0.95,
    d: "Low three-quarter",
  },
  "Jhoan Duran": {
    tag: "EXTENSION",
    slot: 0.25,
    kick: 0.7,
    stride: 1.15,
    k: 1.1,
    arm: 1.05,
    tempo: 0.9,
    d: "High three-quarter, big extension",
  },
  "Logan Gilbert": {
    tag: "EXTENSION",
    slot: 0.2,
    kick: 0.8,
    stride: 1.35,
    k: 1.12,
    arm: 1.08,
    tempo: 1,
    d: "Tall with huge extension",
  },
  "Andrés Muñoz": {
    tag: "ARM SPEED",
    slot: 0.45,
    kick: 0.6,
    stride: 1.1,
    k: 1.02,
    arm: 1.05,
    tempo: 0.85,
    d: "Three-quarter, all arm speed",
  },
  "Tarik Skubal": {
    tag: "HIGH KICK",
    slot: 0.3,
    kick: 0.95,
    stride: 1.1,
    k: 1.05,
    arm: 1.03,
    tempo: 1,
    d: "High kick, high three-quarter",
  },
  "Will Vest": {
    tag: "THREE-QUARTER",
    slot: 0.4,
    kick: 0.7,
    stride: 1,
    k: 1,
    arm: 1,
    tempo: 0.95,
    d: "Three-quarter",
  },
};

// A pitcher's style, or a plain three-quarter delivery if they don't have one.
const styleOf = (p) =>
  STYLE[p.n] || {
    tag: "THREE-QUARTER",
    slot: 0.3,
    kick: 0.8,
    stride: 1,
    k: 1,
    arm: 1,
    tempo: 1,
    d: "Three-quarter",
  };

// Where the ball leaves the pitcher's hand on screen (matches the drawing).
// release point in screen space, matching the drawn delivery

function releasePoint(p) {
  const st = styleOf(p),
    sd = p.hand === "R" ? -1 : 1,
    k = st.k;
  const x = 180 + sd * (1 + 15 * st.slot) * st.arm,
    y = 177 + 19 * st.slot - (st.arm - 1) * 8;
  return [180 + (x - 180) * k, 232 + (y - 2 - 232) * k];
}
