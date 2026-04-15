const urls = [
  "https://raw.githubusercontent.com/REVENGE977/stremio-aniskip/refs/heads/main/dist/AniSkip.plugin.js",
  "https://github.com/TheIntroDB/stremio-enhanced-plugin/releases/download/0.2.0/tidb.plugin.js",
  "https://raw.githubusercontent.com/Sul-404/Stremio-Addon-Manager/main/addon-manager.1.1.0.plugin.js",
  "https://raw.githubusercontent.com/REVENGE977/SlashToSearch/refs/heads/main/SlashToSearch.plugin.js",
  "https://github.com/0xA18/stremio-enhanced-plugins/releases/download/Beta-3.2/filter-streams.plugin.js",
  "https://github.com/shugi12345/stremio-skip-button/releases/download/v1.1.0/skip-intro.plugin.js",
  "https://github.com/Zcc09/stremio-addon-manager-plugin/releases/download/Release/stremio-addon-manager.plugin.js",
  "https://github.com/JZOnTheGit/stream-quality-picker/releases/download/v1.4.0/stream-quality-picker.plugin.js"
];

async function checkPlugins() {
  for (const url of urls) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      const text = await res.text();
      const hasConfig = text.includes('registerSettings');
      console.log(`[${hasConfig ? 'CONFIG' : 'NO CONFIG'}] ${url.split('/').pop()}`);
    } catch (e) {
      console.error(`[ERROR] ${url.split('/').pop()}: ${e.message}`);
    }
  }
}

checkPlugins();
