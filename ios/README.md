# Diamond 26 for iPhone

This is a small iPhone app that shows the game (`../index.html` plus the `css` and `js` folders) full screen. All the gameplay is in those
files, so if you change the game there, the app picks up the change the next time you build.

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
5. Drag the two Swift files from `ios/Sources/` into the `Diamond26` folder in Xcode's left sidebar:
   - `ios/Sources/Diamond26App.swift`
   - `ios/Sources/GameView.swift`

   In the dialog that pops up, **uncheck "Copy items if needed"** and make sure the **Diamond26** target is checked.
6. Now drag the game itself in the same way: `index.html`, the `css` folder and the `js` folder (all from the
   top of the repo). In the dialog:
   - Don't copy the files: uncheck **"Copy items if needed"**, or in newer Xcode set **Action** to
     **"Reference files in place"**. That way the app always uses the real files.
   - Keep the folders as real folders: choose **"Create folder references"**, or in newer Xcode set
     **Groups** to **"Create folders"**. The `css` and `js` folders should show up **blue** in the sidebar,
     not yellow. This matters: `index.html` looks for `css/style.css` and `js/...` inside the app.
   - Make sure the **Diamond26** target is checked.
7. Click the blue **Diamond26** project at the top of the sidebar → **General** tab → **Deployment Info**:
   check **iPhone** only and **Portrait** only.
8. Choose an iPhone simulator at the top of the window and press **⌘R** to run.

### Running on your own iPhone

1. Plug in the iPhone and choose it at the top of the Xcode window.
2. Go to the project's **Signing & Capabilities** tab, check **Automatically manage signing**, and pick your Apple ID as the Team.
3. Press **⌘R**. The first time, the iPhone will ask you to trust the developer in
   **Settings → General → VPN & Device Management**.

With a free Apple ID the app stops opening after 7 days. Run it from Xcode again to refresh it.

## Before putting it on the App Store

The rosters use real MLB players and team names. That's fine for playing on your own phone, but the
App Store needs licenses for those, so a public version should use made-up players and teams.
