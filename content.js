// Stremio Enhanced: Content Script (v1.0.4)

(async function() {
  console.log('Stremio Enhanced: Starting content script...');

  // 1. Fetch preferences from storage
  let settings;
  try {
    settings = await chrome.storage.local.get(['enabledThemes', 'enabledPlugins']);
  } catch (err) {
    console.error('Stremio Enhanced: Failed to read settings.', err);
    return;
  }

  const themes = settings.enabledThemes || [];
  const plugins = settings.enabledPlugins || [];

  if (themes.length === 0 && plugins.length === 0) {
    console.log('Stremio Enhanced: No enhancements enabled.');
    return;
  }

  console.log(`Stremio Enhanced: Requesting ${themes.length} themes and ${plugins.length} plugins from background...`);

  // 2. Simply tell the background to apply everything
  themes.forEach(url => {
    chrome.runtime.sendMessage({ type: 'APPLY_ENHANCEMENT', url: url, assetType: 'theme' });
  });

  plugins.forEach(url => {
    chrome.runtime.sendMessage({ type: 'APPLY_ENHANCEMENT', url: url, assetType: 'plugin' });
  });

  // Listener for tab refresh from the popup
  chrome.runtime.onMessage.addListener((request) => {
    if (request.type === 'REFRESH_ENHANCEMENTS') {
      window.location.reload();
    }
  });

})();
