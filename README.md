<p align="center">
	<a href="https://web.stremio.com/">
		<img src="https://raw.githubusercontent.com/Dxrmy/stremio-enhanced-chrome/main/icon.png" alt="Stremio Enhanced Chrome Icon" width="128">
	</a>
	<h1 align="center">Stremio Enhanced (Web)</h1>
	<h5 align="center">Bring the community power of Stremio Enhanced directly to your browser.</h5>
	<p align="center">
		<a href="https://github.com/Dxrmy/stremio-enhanced-chrome/stargazers">
			<img src="https://img.shields.io/github/stars/Dxrmy/stremio-enhanced-chrome.svg?style=for-the-badge&color=%237B5BF5" alt="stargazers">
		</a>
		<a href="https://github.com/Dxrmy/stremio-enhanced-chrome/issues">
			<img src="https://img.shields.io/github/issues/Dxrmy/stremio-enhanced-chrome?style=for-the-badge&color=%237B5BF5" alt="Issues">
		</a>
		<br>
		<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
			<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
		</a>
		<a href="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions">
			<img src="https://img.shields.io/badge/Chrome_Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Chrome Extension">
		</a>
	</p>
</p>

## 📌 Table of Contents
- [📌 Table of Contents](#-table-of-contents)
- [❓ What is Stremio Enhanced Chrome?](#-what-is-stremio-enhanced-chrome)
- [✨ Features](#-features)
- [📥 Installation](#-installation)
- [🛠️ Usage](#️-usage)
- [🔧 Technical Details](#-technical-details)
- [🤝 Credits](#-credits)
- [⭐ Support the Project](#-support-the-project)
- [🚨 Important Notice](#-important-notice)

## ❓ What is Stremio Enhanced Chrome?

A Chrome Extension port of the popular [Stremio Enhanced](https://github.com/REVENGE977/stremio-enhanced) desktop client. It bridges the gap by injecting community themes and plugins directly into the official Stremio Web interface (`web.stremio.com`), without requiring you to install a separate Electron desktop application.

## ✨ Features
- **Community Themes** – Transform Stremio's look with AMOLED, Modern Glass, and more.
- **Powerful Plugins** – Inject JavaScript plugins to add functionality like **AniSkip**, **TheIntroDB**, and **Addon Manager**.
- **Inline Configuration** – Fully supports user settings (like API keys or feature toggles) via an intuitive popup interface.
- **Zero Native Install** – No heavy Electron app required. Runs smoothly and securely via Chrome's Manifest V3 architecture.

## 📥 Installation

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
- `chrome.scripting.executeScript` to securely push plugins into the `MAIN` DOM world.

## 🤝 Credits

*   [**Stremio Enhanced**](https://github.com/REVENGE977/stremio-enhanced) – The original desktop app created by **REVENGE977**.
*   [**Plugin & Theme Registry**](https://github.com/REVENGE977/stremio-enhanced-registry) – The community hub for all the customizations.
*   Extension ported and maintained by **[Dxrmy](https://github.com/Dxrmy)**.

## ⭐ Support the Project
Consider giving the project a ⭐ star on GitHub! Your support helps more people discover it and keeps me motivated to improve it.

[![Sponsor Me](https://img.shields.io/badge/Sponsor%20Me-%E2%9D%A4-red?style=for-the-badge)](https://github.com/sponsors/Dxrmy)

## 🚨 Important Notice
**This project is not affiliated in any way with Stremio.**  
- **This project** is licensed under the MIT License.

<p align="center">💻 Developed with ❤️ by <a href="https://github.com/Dxrmy">Dxrmy</a> | 📜 Licensed under MIT</p>
