// Stremio Enhanced: Main World Bridge
// This script runs in the same context as web.stremio.com
// It listens for plugins and executes them to access window.services.core

(function() {
  console.log('Stremio Enhanced: Main world bridge ready.');

  window.addEventListener('message', (event) => {
    // Basic security check: ensure it comes from our content script
    if (event.source !== window || !event.data || event.data.type !== 'INJECT_PLUGIN') {
      return;
    }

    const { pluginName, jsText } = event.data;
    console.log(`Stremio Enhanced: Executing plugin [${pluginName}] in MAIN world.`);

    try {
      // Create a wrapper for the plugin
      const script = document.createElement('script');
      script.textContent = jsText;
      script.dataset.stremioEnhanced = 'plugin';
      document.documentElement.appendChild(script);
      // script.remove(); // Optional: clean up if plugin doesn't need the tag anymore
    } catch (err) {
      console.error(`Stremio Enhanced: Failed to execute plugin [${pluginName}].`, err);
    }
  });

})();
