# elementary
Repo for all work as an elementary schooler

## Diamond 26: ABS Edition

A baseball game in a single file: `index.html`. Open it in any browser — no install or build step.

- **Full game:** pick your team, opponent, starting pitcher, innings (3/6/9) and difficulty.
- **Missions:** short challenges like "hit 3 home runs in 10 swings" or "get 4 swinging strikes in 8 pitches".
- **Batting:** tap the ball as it reaches the plate to swing; let it go to take. Steal and sac-fly buttons appear when runners are on.
- **Pitching:** choose a pitch, tap where to throw it, then stop the needle in the green. You can try pickoffs and go to the bullpen.
- **ABS challenges:** the umpire misses some calls. Each team gets 3 challenges to have the automated system review them.

### Where the code is

Open `index.html` in a browser to play. The code is split by topic:

| File | What it does |
|---|---|
| `js/rosters.js` | Teams, player ratings, missions, difficulty. **Start here to tweak the game.** |
| `js/setup.js` | The game state `S` (everything about the current game) and small helpers |
| `js/flow.js` | Starting innings, the next pitch, the CPU choosing pitches |
| `js/batting.js` | Your swing: timing and aim decide the hit |
| `js/pitching.js` | Your pitching (pick, aim, meter) and the CPU batter's swing |
| `js/umpire.js` | Missed calls and ABS challenges |
| `js/baserunning.js` | Steals, sac flies, pickoffs |
| `js/outcomes.js` | Balls, strikes, hits, outs, runs, ending innings and the game |
| `js/missions.js` | Mission mode |
| `js/scoreboard.js` | Scoreboard, big on-screen calls, play-by-play |
| `js/panel.js` | The menu and buttons under the field |
| `js/input.js` | What happens when you tap a button or the field |
| `js/pitchers.js` | Each pitcher's windup style |
| `js/draw-field.js`, `js/draw-people.js`, `js/draw-overlays.js` | Drawing the stadium, players, ball and overlays |
| `js/main.js` | The game loop, plus a list of every game phase |
| `css/style.css` | Colors and layout |
| `ios/` | The iPhone app (see `ios/README.md`) |
