# Diamond 26 for iPhone

This is a small iPhone app that shows the game from `../index.html` full screen. All the gameplay is in that
HTML file, so if you change the game there, the app picks up the change the next time you build.

The app adds a few things the browser version doesn't have:

- An app icon on your home screen, and no browser address bar.
- Real iPhone vibrations ("haptics") on home runs and when you finish a mission.
- No accidental zooming or text selection when you tap fast.

## What you need

- A Mac with **Xcode** installed (free from the Mac App Store). iPhone apps can only be built on a Mac.
- An iPhone and a USB cable (optional; the iPhone Simulator in Xcode works too).
- An Apple ID. A free one lets you put the app on your own phone. Publishing to the App Store needs the paid Apple Developer Program.

## One-time setup (about 10 minutes)

1. Clone this repo onto the Mac and switch to the `claude/baseball-game-xxe0gt` branch.
2. Open Xcode and choose **File → New → Project… → iOS → App**. Click Next.
3. Fill in:
   - Product Name: `Diamond26`
   - Interface: **SwiftUI**, Language: **Swift**
   - Leave Testing System and Storage at their defaults.
   - Click Next, pick this repo's `ios` folder as the location, and click Create.
4. In the left sidebar, delete the two files Xcode made: `ContentView.swift` and `Diamond26App.swift`
   (choose **Move to Trash**).
5. Drag these files from Finder into the `Diamond26` folder in Xcode's left sidebar:
   - `ios/Sources/Diamond26App.swift`
   - `ios/Sources/GameView.swift`
   - `index.html` (from the top of the repo)

   In the dialog that pops up, **uncheck "Copy items if needed"** (so the app always uses the real files)
   and make sure the **Diamond26** target is checked.
6. Click the blue **Diamond26** project at the top of the sidebar → **General** tab → **Deployment Info**:
   check **iPhone** only and **Portrait** only.
7. Choose an iPhone simulator at the top of the window and press **⌘R** to run.

### Running on your own iPhone

1. Plug in the iPhone and choose it at the top of the Xcode window.
2. Go to the project's **Signing & Capabilities** tab, check **Automatically manage signing**, and pick your Apple ID as the Team.
3. Press **⌘R**. The first time, the iPhone will ask you to trust the developer in
   **Settings → General → VPN & Device Management**.

With a free Apple ID the app stops opening after 7 days. Run it from Xcode again to refresh it.

## Before putting it on the App Store

The rosters use real MLB players and team names. That's fine for playing on your own phone, but the
App Store needs licenses for those, so a public version should use made-up players and teams.
