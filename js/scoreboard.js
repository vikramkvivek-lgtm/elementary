// =====================================================================
// scoreboard.js — announcements, the play-by-play log, and the scoreboard
// =====================================================================

// Animate a foul ball flying off to the side.
function foulAnim(cp) {
  S.Hit = {
    from: cp,
    to: [cp[0] < 180 ? -20 : 380, rnd(60, 140)],
    h: 40,
    dur: 650,
    r1: 3,
    t0: performance.now(),
  };
}
let callTimer;

// Show big text over the field, like "Home run!", with a smaller line below it.
function showCall(t, sub) {
  if (S && S.note) {
    sub = S.note;
    S.note = "";
  }
  const el = document.getElementById("call");
  el.innerHTML = t + (sub ? "<small>" + sub + "</small>" : "");
  el.classList.remove("show");
  void el.offsetWidth;
  el.classList.add("show");
}

// Add a line to the play-by-play list under the panel (keeps the last 4).
function logMsg(m) {
  S.log.unshift(m);
  S.log = S.log.slice(0, 4);
  document.getElementById("log").innerHTML = S.log.map((x) => "<li>" + x + "</li>").join("");
}

// Draw the scoreboard at the top: runs per inning, R/H/ABS, count, outs, bases and pitch speed.
// In mission mode it shows mission progress instead.
function renderBoard() {
  const el = document.getElementById("board");
  if (S && S.mode === "mission") {
    const M = S.mission,
      dots = (k, m) =>
        '<div class="dots">' +
        Array.from({ length: m }, (_, i) => '<i class="dot' + (i < k ? " on" : "") + '"></i>').join(
          "",
        ) +
        "</div>";
    el.innerHTML = `<table class="line"><tr><td class="tm" style="width:auto">${M.t}</td><td class="r" style="text-align:right">${M.prog} / ${M.need}</td></tr></table>
      <div class="status"><div class="count"><span>${M.type === "bat" ? "Swings" : "Pitches"}</span>${dots(M.shots - M.used, M.shots)}</div>
      <div class="readout">${M.unit}<b>${S.last ? S.last.split(" mph")[0] : "--"}</b>${S.last ? S.last.split("mph ")[1] : "mph"}</div></div>`;
    return;
  }
  if (!S) {
    el.innerHTML =
      '<table class="line"><tr><th style="text-align:left">Diamond 26</th></tr></table>';
    return;
  }
  const n = Math.max(S.innings, S.inn);
  let h = '<table class="line"><tr><th></th>';
  for (let i = 1; i <= n; i++) h += "<th>" + i + "</th>";
  h += "<th>R</th><th>H</th><th>ABS</th></tr>";
  [
    ["you", MY.abbr],
    ["cpu", CPU.abbr],
  ].forEach(([t, a]) => {
    h += '<tr><td class="tm">' + a + "</td>";
    for (let i = 0; i < n; i++) {
      let v = S.runs[t][i];
      if (v === undefined && S.over && t === "cpu" && i === S.inn - 1) v = "X";
      h += "<td>" + (v === undefined ? "" : v) + "</td>";
    }
    h +=
      '<td class="r">' +
      total(t) +
      "</td><td>" +
      S.hits[t] +
      "</td><td>" +
      S.chal[t] +
      "</td></tr>";
  });
  h += "</table>";
  const dots = (k, m) =>
    '<div class="dots">' +
    Array.from({ length: m }, (_, i) => '<i class="dot' + (i < k ? " on" : "") + '"></i>').join(
      "",
    ) +
    "</div>";
  const B = S.bases,
    sq = (on, x, y) =>
      `<rect x="${x}" y="${y}" width="11" height="11" transform="rotate(45 ${x + 5.5} ${y + 5.5})" fill="${on ? "var(--bulb)" : "var(--bulb-off)"}"/>`;
  h +=
    '<div class="status"><div class="count"><span>B</span>' +
    dots(S.b, 3) +
    "<span>S</span>" +
    dots(S.s, 2) +
    "<span>O</span>" +
    dots(S.outs, 2) +
    "</div>";
  h +=
    '<svg width="52" height="40" viewBox="0 0 52 40" aria-label="Bases">' +
    sq(B[1], 20, 3) +
    sq(B[0], 36, 18) +
    sq(B[2], 4, 18) +
    "</svg>";
  h +=
    '<div class="readout">' +
    (S.half ? "Bot " : "Top ") +
    ord(S.inn) +
    "<b>" +
    (S.last ? S.last.split(" mph")[0] : "--") +
    "</b>" +
    (S.last ? S.last.split("mph ")[1] : "mph") +
    "</div></div>";
  el.innerHTML = h;
}
