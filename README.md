<div align="center">
  <h1>Stremio Enhanced (Web)</h1>
  <p><b>Bring the community power of Stremio Enhanced directly to your browser.</b></p>
</div>

---

A Chrome Extension port of the popular [Stremio Enhanced](https://github.com/REVENGE977/stremio-enhanced) desktop client. It bridges the gap by injecting community themes and plugins directly into the official Stremio Web interface (`web.stremio.com`), without requiring you to install a separate Electron desktop application.

## ✨ Features
- **Community Themes**: Transform Stremio's look with AMOLED, Modern Glass, and more.
- **Powerful Plugins**: Inject JavaScript plugins to add functionality like **AniSkip**, **TheIntroDB**, and **Addon Manager**.
- **Inline Configuration**: Fully supports the `StremioEnhancedAPI` for plugins that require custom user settings (like API keys or feature toggles) via an intuitive popup interface.
- **Zero Native Install**: No heavy Electron app required. Runs smoothly and securely via Chrome's Manifest V3 architecture.

## ⚙️ Installation

> **Note**: This extension is currently not available on the Chrome Web Store and must be sideloaded.

1. Download or clone this repository to your local machine.
2. Open Google Chrome (or any Chromium-based browser like Brave or Edge) and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** using the toggle switch in the top right corner.
4. Click the **Load unpacked** button.
5. Select the `stremio-enhanced-extension` folder.

## 🛠️ Usage

1. Navigate to [web.stremio.com](https://web.stremio.com).
2. Click the **Stremio Enhanced** extension icon (the puzzle piece) in your browser toolbar.
3. In the **Themes** and **Plugins** tabs, toggle the enhancements you want to use.
4. If a plugin has a ⚙️ (cog) icon next to it, click it to access its specific settings (e.g., API keys or skip preferences).
5. Click **Save & Refresh** to apply the changes instantly to your Stremio session.

## 🔧 Technical Details

Because the official Stremio Web app employs strict Content Security Policies (CSP) and CORS restrictions, this extension uses a combination of advanced Manifest V3 techniques:
- `declarativeNetRequest` to strip CSP headers on-the-fly.
- A **Background Service Worker** to act as a proxy, fetching raw assets directly from GitHub.
- `chrome.scripting.executeScript` to securely push plugins into the `MAIN` DOM world, mocking the `window.electron` environment that Desktop plugins expect.

## 🤝 Credits

*   [**Stremio Enhanced**](https://github.com/REVENGE977/stremio-enhanced) - The original desktop app created by **REVENGE977**.
*   [**Plugin & Theme Registry**](https://github.com/REVENGE977/stremio-enhanced-registry) - The community hub for all the amazing customizations.
*   Extension ported and maintained by **[Dxrmy](https://github.com/Dxrmy)**.
