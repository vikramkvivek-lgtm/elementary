// =====================================================================
// rosters.js — teams, players, missions and difficulty settings
//
// This file is all data. Change numbers here to make players better or
// worse, add a mission, or tune how hard the game is.
//
// BATTERS:  { n: name, p: position, c: contact, pw: power, s: speed, o: overall }
//   c  (contact) — how often they hit the ball solidly
//   pw (power)   — how far it goes (home runs!)
//   s  (speed)   — steals, extra bases, triples
//
// PITCHERS: { n: name, hand: "R" or "L", ctl: control, st: stuff, stam/lim: stamina, ar: arsenal }
//   ctl  (control) — how close pitches land to where you aim
//   st   (stuff)   — how hard the pitches are to hit
//   stam (stamina) — how many pitches before they get tired (your pitchers)
//   lim            — pitch count when the CPU goes to the bullpen (999 = never)
//   ar   (arsenal) — list of pitches: [name, mph, sideways break, up/down break]
// =====================================================================

// ---------- Your teams ----------
const DREAM = {
  name: "Tampa Bay",
  abbr: "TB",
  ovr: 99,
  lineup: [
    { n: "Corbin Carroll",      p: "RF", c: 95, pw: 90, s: 99, o: 99 },
    { n: "Elly De La Cruz",     p: "SS", c: 92, pw: 96, s: 99, o: 99 },
    { n: "Shohei Ohtani",       p: "DH", c: 98, pw: 99, s: 92, o: 99 },
    { n: "Yordan Alvarez",      p: "LF", c: 99, pw: 99, s: 60, o: 99 },
    { n: "Pete Crow-Armstrong", p: "CF", c: 94, pw: 94, s: 99, o: 99 },
    { n: "Junior Caminero",     p: "3B", c: 94, pw: 98, s: 70, o: 99 },
    { n: "Matt Olson",          p: "1B", c: 93, pw: 97, s: 60, o: 99 },
    { n: "William Contreras",   p: "C",  c: 95, pw: 88, s: 60, o: 99 },
    { n: "Brice Turang",        p: "2B", c: 94, pw: 80, s: 97, o: 99 },
  ],
  rotation: [
    { n: "Jacob Misiorowski",  hand: "R", ctl: 92, st: 99, stam: 99,
      ar: [["4-Seam", 101, 0.15, 0.2], ["Slider", 91, 1.0, -0.4], ["Curve", 85, -0.3, -1.3]] },
    { n: "Shohei Ohtani",      hand: "R", ctl: 93, st: 99, stam: 95,
      ar: [["4-Seam", 99, 0.1, 0.2], ["Sweeper", 85, 1.5, -0.2], ["Splitter", 89, 0, -1.1]] },
    { n: "Cam Schlittler",     hand: "R", ctl: 94, st: 99, stam: 97,
      ar: [["4-Seam", 98, 0.1, 0.2], ["Cutter", 92, 0.5, -0.1], ["Curve", 82, 0.4, -1.3]] },
    { n: "Chris Sale",         hand: "L", ctl: 97, st: 99, stam: 95,
      ar: [["4-Seam", 95, -0.1, 0.2], ["Slider", 79, -1.3, -0.5], ["Changeup", 86, 0.5, -0.7]] },
    { n: "Cristopher Sánchez", hand: "L", ctl: 98, st: 99, stam: 99,
      ar: [["Sinker", 95, 0.6, -0.5], ["Changeup", 85, 0.7, -0.9], ["Slider", 85, -0.8, -0.4]] },
  ],
};

const BREW = {
  name: "Milwaukee Super Team",
  abbr: "MIL",
  ovr: 99,
  lineup: [
    { n: "Jackson Chourio",   p: "RF", c: 96, pw: 96, s: 99, o: 99 },
    { n: "Brice Turang",      p: "2B", c: 95, pw: 85, s: 97, o: 99 },
    { n: "William Contreras", p: "C",  c: 99, pw: 92, s: 62, o: 99 },
    { n: "Christian Yelich",  p: "DH", c: 96, pw: 94, s: 80, o: 99 },
    { n: "Jake Bauers",       p: "1B", c: 94, pw: 95, s: 60, o: 99 },
    { n: "Sal Frelick",       p: "CF", c: 98, pw: 80, s: 95, o: 99 },
    { n: "Caleb Durbin",      p: "3B", c: 96, pw: 84, s: 85, o: 99 },
    { n: "Garrett Mitchell",  p: "LF", c: 92, pw: 90, s: 97, o: 99 },
    { n: "Joey Ortiz",        p: "SS", c: 95, pw: 82, s: 85, o: 99 },
  ],
  rotation: [
    { n: "Jacob Misiorowski", hand: "R", ctl: 93, st: 99, stam: 99,
      ar: [["4-Seam", 101, 0.15, 0.2], ["Slider", 91, 1.0, -0.4], ["Curve", 85, -0.3, -1.3]] },
    { n: "Quinn Priester",    hand: "R", ctl: 96, st: 97, stam: 99,
      ar: [["Sinker", 95, 0.6, -0.5], ["Slider", 87, 1.0, -0.4], ["Curve", 81, 0.3, -1.3]] },
    { n: "Chad Patrick",      hand: "R", ctl: 96, st: 97, stam: 97,
      ar: [["4-Seam", 95, 0.1, 0.2], ["Cutter", 92, 0.5, -0.1], ["Slider", 86, 1.1, -0.4]] },
    { n: "Abner Uribe",       hand: "R", ctl: 90, st: 99, stam: 70,
      ar: [["Sinker", 101, 0.6, -0.5], ["Slider", 89, 1.2, -0.4]] },
    { n: "Trevor Megill",     hand: "R", ctl: 92, st: 99, stam: 70,
      ar: [["4-Seam", 100, 0.1, 0.2], ["Curve", 86, 0.3, -1.3]] },
  ],
};

// The teams you can pick on the menu, and the one currently in use.
const MINE = [DREAM, BREW];
let MY = DREAM;

// ---------- CPU opponents ----------
// Each CPU team has a starter (staff[0]) and a closer (staff[1]).
const TEAMS = [
  {
    name: "Los Angeles", abbr: "LA", ovr: 91,
    lineup: [
      { n: "Mookie Betts",      p: "SS", c: 88, pw: 78, s: 70 },
      { n: "Kyle Tucker",       p: "RF", c: 88, pw: 86, s: 75 },
      { n: "Freddie Freeman",   p: "1B", c: 92, pw: 82, s: 45 },
      { n: "Will Smith",        p: "C",  c: 85, pw: 80, s: 40 },
      { n: "Teoscar Hernández", p: "LF", c: 80, pw: 88, s: 50 },
      { n: "Max Muncy",         p: "3B", c: 76, pw: 86, s: 40 },
      { n: "Andy Pages",        p: "CF", c: 80, pw: 80, s: 70 },
      { n: "Tommy Edman",       p: "2B", c: 80, pw: 70, s: 85 },
      { n: "Hyeseong Kim",      p: "DH", c: 76, pw: 60, s: 92 },
    ],
    staff: [
      { n: "Yoshinobu Yamamoto", hand: "R", ctl: 88, st: 94, lim: 92,
        ar: [["4-Seam", 96, 0.1, 0.2], ["Splitter", 90, 0, -1.1], ["Curve", 77, -0.2, -1.4]] },
      { n: "Edwin Díaz",         hand: "R", ctl: 78, st: 93, lim: 999,
        ar: [["4-Seam", 98, 0.1, 0.2], ["Slider", 91, 1.1, -0.4]] },
    ],
  },
  {
    name: "New York", abbr: "NY", ovr: 89,
    lineup: [
      { n: "Trent Grisham",     p: "CF", c: 74, pw: 80, s: 70 },
      { n: "Aaron Judge",       p: "RF", c: 94, pw: 99, s: 55 },
      { n: "Cody Bellinger",    p: "LF", c: 84, pw: 80, s: 70 },
      { n: "Giancarlo Stanton", p: "DH", c: 74, pw: 94, s: 30 },
      { n: "Jazz Chisholm Jr.", p: "2B", c: 76, pw: 86, s: 90 },
      { n: "Ben Rice",          p: "1B", c: 84, pw: 86, s: 45 },
      { n: "Ryan McMahon",      p: "3B", c: 72, pw: 74, s: 45 },
      { n: "Austin Wells",      p: "C",  c: 74, pw: 78, s: 35 },
      { n: "Anthony Volpe",     p: "SS", c: 70, pw: 72, s: 85 },
    ],
    staff: [
      { n: "Max Fried",    hand: "L", ctl: 90, st: 91, lim: 92,
        ar: [["4-Seam", 95, -0.1, 0.2], ["Curve", 75, -0.5, -1.4], ["Sweeper", 81, -1.3, -0.2]] },
      { n: "David Bednar", hand: "R", ctl: 80, st: 89, lim: 999,
        ar: [["4-Seam", 97, 0.1, 0.2], ["Curve", 80, 0.3, -1.3]] },
    ],
  },
  {
    name: "Philadelphia", abbr: "PHI", ovr: 88,
    lineup: [
      { n: "Trea Turner",     p: "SS", c: 88, pw: 76, s: 95 },
      { n: "Kyle Schwarber",  p: "DH", c: 74, pw: 98, s: 35 },
      { n: "Bryce Harper",    p: "1B", c: 88, pw: 88, s: 55 },
      { n: "J.T. Realmuto",   p: "C",  c: 76, pw: 72, s: 60 },
      { n: "Adolis García",   p: "RF", c: 72, pw: 84, s: 70 },
      { n: "Alec Bohm",       p: "3B", c: 84, pw: 70, s: 45 },
      { n: "Bryson Stott",    p: "2B", c: 80, pw: 64, s: 82 },
      { n: "Brandon Marsh",   p: "LF", c: 78, pw: 68, s: 75 },
      { n: "Justin Crawford", p: "CF", c: 80, pw: 58, s: 92 },
    ],
    staff: [
      { n: "Jesús Luzardo", hand: "L", ctl: 82, st: 90, lim: 88,
        ar: [["4-Seam", 97, -0.1, 0.2], ["Sweeper", 85, -1.4, -0.2], ["Changeup", 87, 0.6, -0.8]] },
      { n: "Jhoan Duran",   hand: "R", ctl: 80, st: 95, lim: 999,
        ar: [["4-Seam", 101, 0.1, 0.2], ["Splinker", 98, 0.5, -0.9], ["Curve", 87, 0.3, -1.2]] },
    ],
  },
  {
    name: "Seattle", abbr: "SEA", ovr: 87,
    lineup: [
      { n: "J.P. Crawford",   p: "SS", c: 80, pw: 65, s: 60 },
      { n: "Julio Rodríguez", p: "CF", c: 84, pw: 86, s: 88 },
      { n: "Cal Raleigh",     p: "C",  c: 78, pw: 97, s: 35 },
      { n: "Josh Naylor",     p: "1B", c: 86, pw: 80, s: 55 },
      { n: "Randy Arozarena", p: "LF", c: 78, pw: 80, s: 80 },
      { n: "Brendan Donovan", p: "3B", c: 86, pw: 68, s: 60 },
      { n: "Luke Raley",      p: "DH", c: 72, pw: 80, s: 60 },
      { n: "Cole Young",      p: "2B", c: 76, pw: 62, s: 75 },
      { n: "Victor Robles",   p: "RF", c: 74, pw: 60, s: 85 },
    ],
    staff: [
      { n: "Logan Gilbert", hand: "R", ctl: 90, st: 90, lim: 92,
        ar: [["4-Seam", 96, 0.1, 0.2], ["Splitter", 86, 0, -1.0], ["Slider", 89, 1.0, -0.3]] },
      { n: "Andrés Muñoz",  hand: "R", ctl: 76, st: 94, lim: 999,
        ar: [["4-Seam", 99, 0.1, 0.2], ["Slider", 87, 1.2, -0.4]] },
    ],
  },
  {
    name: "Detroit", abbr: "DET", ovr: 87,
    lineup: [
      { n: "Riley Greene",       p: "LF", c: 84, pw: 86, s: 60 },
      { n: "Gleyber Torres",     p: "2B", c: 82, pw: 74, s: 50 },
      { n: "Spencer Torkelson",  p: "1B", c: 76, pw: 88, s: 40 },
      { n: "Dillon Dingler",     p: "C",  c: 80, pw: 82, s: 40 },
      { n: "Kerry Carpenter",    p: "DH", c: 80, pw: 84, s: 45 },
      { n: "Colt Keith",         p: "3B", c: 80, pw: 72, s: 50 },
      { n: "Wenceel Pérez",      p: "RF", c: 76, pw: 70, s: 75 },
      { n: "Parker Meadows",     p: "CF", c: 72, pw: 68, s: 90 },
      { n: "Javier Báez",        p: "SS", c: 70, pw: 74, s: 65 },
    ],
    staff: [
      { n: "Tarik Skubal", hand: "L", ctl: 94, st: 97, lim: 95,
        ar: [["4-Seam", 97, -0.1, 0.2], ["Changeup", 88, 0.6, -1.0], ["Slider", 89, -0.9, -0.3]] },
      { n: "Will Vest",    hand: "R", ctl: 80, st: 86, lim: 999,
        ar: [["Sinker", 96, 0.5, -0.4], ["Slider", 88, 1.0, -0.4]] },
    ],
  },
];

// Milwaukee can also be a CPU opponent, using the same players as BREW.
TEAMS.push({
  name: "Milwaukee",
  abbr: "MIL",
  ovr: 99,
  lineup: BREW.lineup,
  staff: [
    Object.assign({ lim: 95 }, BREW.rotation[0]),
    Object.assign({ lim: 999 }, BREW.rotation[3]),
  ],
});

// The CPU team you're playing right now.
let CPU = TEAMS[0];

// ---------- Missions ----------
// type: "bat" (you hit) or "pitch" (you pitch)
// need: how many you have to get, shots: how many swings/pitches you get
// counts: which results count toward "need"
const MISSIONS = [
  { id: "doubles", t: "Doubles duel",    d: "Hit 2 doubles in 5 swings",           type: "bat",   need: 2, shots: 5,  counts: ["2B"],                         unit: "Doubles" },
  { id: "hr",      t: "Moonshots",       d: "Hit 3 home runs in 10 swings",        type: "bat",   need: 3, shots: 10, counts: ["HR"],                         unit: "Home runs" },
  { id: "xbh",     t: "Gap power",       d: "Hit 3 extra-base hits in 8 swings",   type: "bat",   need: 3, shots: 8,  counts: ["2B", "3B", "HR"],             unit: "Extra-base hits" },
  { id: "hits",    t: "Hit parade",      d: "Get 5 hits in 8 swings",              type: "bat",   need: 5, shots: 8,  counts: ["1B", "2B", "3B", "HR"],       unit: "Hits" },
  { id: "triple",  t: "Triple threat",   d: "Hit a triple in 6 swings",            type: "bat",   need: 1, shots: 6,  counts: ["3B"],                         unit: "Triples" },
  { id: "whiff",   t: "Whiff machine",   d: "Get 4 swinging strikes in 8 pitches", type: "pitch", need: 4, shots: 8,  counts: ["swinging"],                   unit: "Swinging strikes" },
  { id: "paint",   t: "Paint the black", d: "Throw 5 strikes in 7 pitches",        type: "pitch", need: 5, shots: 7,  counts: ["called", "swinging", "foul"], unit: "Strikes" },
];

// ---------- Umpire and challenges ----------
const UMP = { n: "Dale Kessler", miss: 1 };
const CHALLENGES = 3; // ABS challenges each team gets per game

// ---------- Difficulty ----------
//   perfect  — timing window (ms) for a perfect swing; bigger = easier
//   ok       — timing window (ms) where you still make contact
//   reach    — how far from the ball your tap can be and still hit it
//   fly      — pitch travel time multiplier; bigger = slower pitches
//   meter    — how long the pitching needle takes to sweep (ms); bigger = easier
//   cpuBoost — makes CPU batters better (+) or worse (-)
const DIFF = {
  rookie:  { label: "Rookie",   perfect: 55, ok: 200, reach: 0.6,  fly: 1.4,  meter: 1500, cpuBoost: -0.06 },
  pro:     { label: "Pro",      perfect: 42, ok: 150, reach: 0.48, fly: 1.12, meter: 1150, cpuBoost: 0 },
  allstar: { label: "All-Star", perfect: 30, ok: 112, reach: 0.4,  fly: 0.95, meter: 880,  cpuBoost: 0.05 },
};
