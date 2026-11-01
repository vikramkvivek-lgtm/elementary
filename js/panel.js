// =====================================================================
// panel.js — the white panel under the field
//
// renderPanel() rebuilds it every time something changes. What it shows
// depends on S.phase: the menu, the batter card, the pitch buttons, the
// challenge buttons, or the final score.
// =====================================================================

// The Contact / Power / Speed bars on the batter card.
function rateRows(b) {
  return (
    '<div class="rate">' +
    [
      ["Contact", b.c],
      ["Power", b.pw],
      ["Speed", b.s],
    ]
      .map(
        ([l, v]) =>
          `<span>${l}</span><div class="bar"><i style="width:${v}%"></i></div><span>${v}</span>`,
      )
      .join("") +
    "</div>"
  );
}

// Text like "2-for-3, HR, 2 RBI" for a batter.
function todayLine(n) {
  const s = S.st[n];
  if (!s) return "";
  if (!s.ab && !s.bb) return "First at-bat today";
  let t = s.h + "-for-" + s.ab;
  if (s.hr) t += ", " + (s.hr > 1 ? s.hr + " HR" : "HR");
  if (s.rbi) t += ", " + s.rbi + " RBI";
  if (s.bb) t += ", " + s.bb + " BB";
  return t;
}

// Rebuild the panel for whatever is happening right now.
function renderPanel() {
  const el = document.getElementById("panel");
  if (!S || S.phase === "menu") {
    return renderMenu(el);
  }
  if (S.phase === "mission-over") {
    const M = S.mission;
    el.innerHTML = `<div class="sub">${M.d}</div><div class="final">${S.missionWon ? "Complete" : "Failed"}</div>
      <div class="today">${M.unit}: ${M.prog} of ${M.need}, using ${M.used} of ${M.shots} ${M.type === "bat" ? "swings" : "pitches"}.</div>
      <button class="go" data-a="retry">Try again</button><button class="ghost" style="width:100%;margin-top:8px" data-a="menu">Back to menu</button>`;
    return;
  }
  if (S.phase === "over") {
    const y = total("you"),
      c = total("cpu"),
      perf = MY.lineup
        .map((b) => ({ b, s: S.st[b.n] }))
        .filter((x) => x.s.h || x.s.rbi)
        .sort((a, b) => b.s.h * 2 + b.s.hr * 3 + b.s.rbi - (a.s.h * 2 + a.s.hr * 3 + a.s.rbi))
        .slice(0, 3);
    el.innerHTML =
      `<div class="sub">${y > c ? MY.name + " wins." : CPU.name + " takes this one."}</div><div class="final">${MY.abbr} ${y}, ${CPU.abbr} ${c}</div>` +
      (perf.length
        ? '<div class="lbl">Top performers</div><ul class="perf">' +
          perf.map((x) => `<li>${x.b.n}: ${todayLine(x.b.n)}</li>`).join("") +
          "</ul>"
        : "") +
      '<button class="go" data-a="again">Play again</button><button class="ghost" style="width:100%;margin-top:8px" data-a="menu">Change settings</button>';
    return;
  }
  const b = curBatter();
  if (S.phase === "challenge") {
    const c = S.pend,
      mine = batTeam() === "you";
    el.innerHTML = `<div class="who"><h2>${c.call === "called" ? "Called strike" : "Called ball"}</h2><span class="pos">${S.chal.you} challenge${S.chal.you === 1 ? "" : "s"} left</span></div>
      <div class="today">${mine ? b.n + " can" : myPitcher().n + " can"} challenge. ABS will check the pitch against the zone.</div>
      <div class="chal"><button class="go" data-a="challenge">Challenge</button><button class="go" style="background:var(--btn2);color:var(--btn2-text)" data-a="accept">Accept call</button></div>
      <div class="timer"><i id="ctimer"></i></div>`;
    return;
  }
  if (S.phase === "abs") {
    el.innerHTML =
      '<div class="who"><h2>ABS review</h2><span class="pos">Checking the pitch</span></div><p class="hint">The automated system is tracking where the ball crossed the plate.</p>';
    return;
  }
  if (batTeam() === "you") {
    const p = cpuPitcher();
    el.innerHTML = `<div class="who"><h2>${b.n}</h2><span class="pos">${b.p} · ${b.o} OVR</span></div><div class="today">${todayLine(b.n)}</div>${rateRows(b)}
      <p class="hint">Tap the ball as it reaches the plate to swing. Let it go to take the pitch. Facing ${p.n} (${S.cpuPC} pitches). Delivery: ${styleOf(p).d.toLowerCase()}.</p>`;
    if (S.mode === "game") {
      const B = S.bases,
        btns = [];
      if (B[0] && !B[1])
        btns.push(
          `<button class="pbtn${S.stealOn === 0 ? " sel" : ""}" data-a="steal" data-i="0">${S.stealOn === 0 ? "Running" : "Steal 2nd"}<small>${B[0].n.split(" ").slice(1).join(" ")}, spd ${B[0].s}</small></button>`,
        );
      if (B[1] && !B[2])
        btns.push(
          `<button class="pbtn${S.stealOn === 1 ? " sel" : ""}" data-a="steal" data-i="1">${S.stealOn === 1 ? "Running" : "Steal 3rd"}<small>${B[1].n.split(" ").slice(1).join(" ")}, spd ${B[1].s}</small></button>`,
        );
      if (B[2] && S.outs < 2)
        btns.push(
          `<button class="pbtn${S.sacOn ? " sel" : ""}" data-a="sac">${S.sacOn ? "Sac fly on" : "Sac fly"}<small>Lift it to score</small></button>`,
        );
      if (btns.length)
        el.innerHTML += `<div class="pitches">${btns.join("")}</div>${S.stealOn != null ? '<p class="hint">The runner goes on the next pitch.</p>' : ""}${S.sacOn ? '<p class="hint">Your batter will lift a fly ball on the next pitch.</p>' : ""}`;
    }
  } else {
    const p = myPitcher(),
      { e, pc } = fatigue();
    let body = `<div class="who"><h2>${p.n}</h2><span class="pos">${pc} pitches</span></div><div class="today" style="margin:2px 0 0">${styleOf(p).d}</div>
      <div class="row"><div class="energy"><div class="bar"><i style="width:${Math.round(e * 100)}%;background:${e < 0.3 ? "var(--accent)" : "var(--btn)"}"></i></div></div><button class="ghost" data-a="bullpen">Change pitcher</button></div>
      <div class="today" style="margin-top:8px">At bat: ${b.n}, ${b.p} (Con ${b.c} / Pow ${b.pw})</div>
      <div class="pitches">${p.ar.map((a, i) => `<button class="pbtn${S.sel === i ? " sel" : ""}" data-a="pitch" data-i="${i}">${a[0]}<small>${a[1]} mph</small></button>`).join("")}</div>`;
    if (S.mode === "game" && ["select", "aim"].includes(S.phase) && S.bases.some(Boolean)) {
      const left = 2 - (S.diseng || 0);
      body += `<div class="pitches">${S.bases.map((r, i) => (r ? `<button class="pbtn" data-a="pick" data-i="${i}" ${left <= 0 ? 'disabled style="opacity:.45"' : ""}>Pick off ${["1st", "2nd", "3rd"][i]}<small>${r.n.split(" ").slice(1).join(" ")}, spd ${r.s}</small></button>` : "")).join("")}</div>
        <p class="hint">Watch the runner cam for a big lead. ${left > 0 ? left + " pickoff attempt" + (left === 1 ? "" : "s") + " left this at-bat." : "No pickoff attempts left this at-bat."}</p>`;
    }
    if (S.phase === "select") body += '<p class="hint">Pick a pitch.</p>';
    if (S.phase === "aim") body += '<p class="hint">Tap the field where you want to locate it.</p>';
    if (S.phase === "meter")
      body +=
        '<div class="meter"><div class="needle" id="needle"></div></div><button class="go" data-a="release">Release</button><p class="hint">Stop the needle in the green for best accuracy. Tapping the field works too.</p>';
    if (S.phase === "bullpen")
      body = `<div class="lbl" style="margin-top:0">Bring in a new pitcher</div><div class="choices">${MY.rotation.map((r, i) => (i === S.myP ? "" : `<button data-a="sub" data-i="${i}">${r.n} (${S.pc[r.n] || 0})</button>`)).join("")}</div><button class="ghost" style="width:100%;margin-top:8px" data-a="nosub">Keep ${p.n}</button>`;
    el.innerHTML = body;
  }
}

// The start menu: team, mode, opponent, pitcher, innings and difficulty.
function renderMenu(el) {
  MY = MINE[setup.mine];
  if (TEAMS[setup.opp].abbr === MY.abbr) setup.opp = 0;
  const ch = (items, key, lab) =>
    '<div class="choices">' +
    items
      .map(
        ([v, l]) =>
          `<button class="${setup[key] === v ? "sel" : ""}" data-a="set" data-k="${key}" data-i="${v}">${l}</button>`,
      )
      .join("") +
    "</div>";
  const last = (n) => n.split(" ").slice(1).join(" ");
  let h = `<h1>Diamond 26</h1><p class="sub">${UMP.n} has the plate. Each team gets ${CHALLENGES} ABS challenges in a full game.</p>
    <div class="lbl">Your team</div>${ch(
      MINE.map((t, i) => [i, t.name + " " + t.ovr]),
      "mine",
    )}
    <ol class="lineup">${MY.lineup.map((b) => `<li>${b.n} <span>${b.p}</span></li>`).join("")}</ol>
    <div class="lbl">Mode</div>${ch(
      [
        ["game", "Full game"],
        ["missions", "Missions"],
      ],
      "mode",
    )}
    <div class="lbl">Opponent</div>${ch(
      TEAMS.map((t, i) => [i, t.name + " " + t.ovr]).filter(([i]) => TEAMS[i].abbr !== MY.abbr),
      "opp",
    )}`;
  if (setup.mode === "game") {
    h += `<div class="lbl">Starting pitcher</div>${ch(
      MY.rotation.map((r, i) => [i, last(r.n)]),
      "starter",
    )}
      <div class="lbl">Innings</div>${ch(
        [
          [3, "3"],
          [6, "6"],
          [9, "9"],
        ],
        "innings",
      )}
      <div class="lbl">Difficulty</div>${ch(
        Object.entries(DIFF).map(([k, d]) => [k, d.label]),
        "diff",
      )}
      <button class="go" data-a="start">Play ball</button>`;
  } else {
    const M = MISSIONS[setup.mission];
    h += `<div class="lbl">Mission</div>${ch(
      MISSIONS.map((m, i) => [i, m.t]),
      "mission",
    )}
      <p class="hint" style="margin-top:8px">${M.d}.</p>
      <div class="lbl">${M.type === "bat" ? "Batter" : "Pitcher"}</div>${
        M.type === "bat"
          ? ch(
              MY.lineup.map((b, i) => [i, last(b.n)]),
              "batter",
            )
          : ch(
              MY.rotation.map((r, i) => [i, last(r.n)]),
              "starter",
            )
      }
      <div class="lbl">Difficulty</div>${ch(
        Object.entries(DIFF).map(([k, d]) => [k, d.label]),
        "diff",
      )}
      <button class="go" data-a="mstart">Start mission</button>`;
  }
  el.innerHTML = h;
}
