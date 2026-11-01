import SwiftUI

@main
struct Diamond26App: App {
    var body: some Scene {
        WindowGroup {
            GameView()
                // The game page handles the notch and home indicator itself
                // (it uses viewport-fit=cover and env(safe-area-inset-*)).
                .ignoresSafeArea()
        }
    }
}
