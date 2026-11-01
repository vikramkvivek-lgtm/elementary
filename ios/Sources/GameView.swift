import SwiftUI
import UIKit
import WebKit

/// Shows the HTML game (index.html, bundled with the app) full screen.
struct GameView: UIViewRepresentable {
    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> WKWebView {
        let content = WKUserContentController()
        content.add(context.coordinator, name: "haptic")
        content.addUserScript(WKUserScript(source: Self.bridgeJS,
                                           injectionTime: .atDocumentStart,
                                           forMainFrameOnly: true))

        let config = WKWebViewConfiguration()
        config.userContentController = content

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.isOpaque = false                 // no white flash before the page draws
        webView.backgroundColor = .systemBackground
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        if let url = Bundle.main.url(forResource: "index", withExtension: "html") {
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        } else {
            webView.loadHTMLString("<h2 style='font-family:system-ui;padding:24px'>index.html is missing from the app bundle. See ios/README.md.</h2>", baseURL: nil)
        }
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    /// Runs inside the page before the game's own script.
    /// - Gives the page a working navigator.vibrate (Safari on iOS doesn't have one) that
    ///   triggers real iPhone haptics. The game already calls it on home runs and missions.
    /// - Turns off pinch/double-tap zoom and long-press text selection so taps feel like a game.
    private static let bridgeJS = """
    navigator.vibrate = function (pattern) {
      var pulses = Array.isArray(pattern) ? pattern.length : 1;
      window.webkit.messageHandlers.haptic.postMessage(pulses);
      return true;
    };
    document.addEventListener('DOMContentLoaded', function () {
      var m = document.querySelector('meta[name=viewport]');
      if (m) m.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
      var s = document.createElement('style');
      s.textContent = 'html,body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}';
      document.head.appendChild(s);
    });
    """

    final class Coordinator: NSObject, WKScriptMessageHandler {
        func userContentController(_ userContentController: WKUserContentController,
                                   didReceive message: WKScriptMessage) {
            let pulses = message.body as? Int ?? 1
            if pulses >= 5 {
                // Mission complete
                UINotificationFeedbackGenerator().notificationOccurred(.success)
            } else {
                // Home run
                UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
            }
        }
    }
}
