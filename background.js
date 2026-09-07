// Stremio Enhanced: Background Worker v1.2.1

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'APPLY_ENHANCEMENT') {
    const { url, assetType } = request;
    const tabId = sender.tab?.id || request.tabId;

    if (!tabId) {
      sendResponse({ success: false, error: 'No valid tabId' });
      return;
    }
    
    console.log(`Stremio Enhanced: Background applying [${url}] to tab ${tabId}`);

    fetch(url, { redirect: 'follow' })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status} at ${url}`);
        return response.text();
      })
      .then(codeText => {
        if (assetType === 'theme') {
          chrome.scripting.insertCSS({
            target: { tabId: tabId },
            css: codeText
          }).catch(err => console.error('Stremio Enhanced: CSS insert error', err));
          sendResponse({ success: true });
        } else if (assetType === 'plugin') {
          
          // Apply Web-specific patches to community plugins designed for the Desktop app
          if (url.includes('addon-manager') || url.includes('Sul-404')) {
            // Patch brittle Stremio Desktop DOM selectors to ones that exist on Stremio Web
            codeText = codeText.replace(
              'stremioHeaderInputs: \'[class*="selectable-inputs-container"]\'', 
              'stremioHeaderInputs: \'[class*="selectable-inputs-container"], [class*="dashboard-container"] > div > div\''
            );
            // If it completely fails to find the header, append the button to the body so it's always accessible
            codeText = codeText.replace(
              'if (!inputsContainer) return;', 
              'if (!inputsContainer) inputsContainer = document.body;'
            );
            codeText = codeText.replace(
              'if (!spacingDiv) return;', 
              'if (!spacingDiv) spacingDiv = inputsContainer;'
            );
            // Ensure the toggle button is visible if appended to body
            codeText += `
              setInterval(() => {
                  const btn = document.getElementById('am-header-toggle');
                  if (btn && btn.parentElement === document.body) {
                      btn.style.position = 'fixed';
                      btn.style.bottom = '20px';
                      btn.style.right = '20px';
                      btn.style.zIndex = '99999';
                      btn.style.background = '#4354c5';
                      btn.style.padding = '10px';
                      btn.style.borderRadius = '5px';
                  }
              }, 1000);
            `;
          }

          chrome.scripting.executeScript({
            target: { tabId: tabId },
            world: 'MAIN',
            injectImmediately: true,
            func: (code, pluginUrl) => {
              const pluginName = pluginUrl.split('/').pop();
              const pluginBaseName = pluginName.replace('.plugin.js', '');

              // 1. Mock base electron environment just in case
              if (!window.electron) {
                window.electron = {
                  ipcRenderer: { send: () => {}, on: () => () => {}, invoke: () => Promise.resolve([]) },
                  getMods: () => Promise.resolve([]),
                  getProperties: () => Promise.resolve({})
                };
              }

              // 2. Setup the Core API for Settings Management
              if (!window.StremioEnhancedAPI_Core) {
                window.StremioEnhancedAPI_Core = {
                  _listeners: {},
                  getSetting: (p, k) => {
                    const raw = localStorage.getItem(`se_setting_${p}_${k}`);
                    return Promise.resolve(raw !== null ? JSON.parse(raw) : undefined);
                  },
                  getSettings: (p) => {
                    const schemas = JSON.parse(localStorage.getItem('se_schemas') || '{}');
                    const schema = schemas[p] || [];
                    const result = {};
                    schema.forEach(s => {
                      const raw = localStorage.getItem(`se_setting_${p}_${s.key}`);
                      result[s.key] = raw !== null ? JSON.parse(raw) : s.defaultValue;
                    });
                    return Promise.resolve(result);
                  },
                  saveSetting: (p, k, v) => {
                    localStorage.setItem(`se_setting_${p}_${k}`, JSON.stringify(v));
                    if (window.StremioEnhancedAPI_Core._listeners[p]) {
                      window.StremioEnhancedAPI_Core.getSettings(p).then(allSettings => {
                        window.StremioEnhancedAPI_Core._listeners[p].forEach(cb => {
                          try { cb(allSettings); } catch(e) { console.error(e); }
                        });
                      });
                    }
                    return Promise.resolve(true);
                  },
                  registerSettings: (p, schema) => {
                    const schemas = JSON.parse(localStorage.getItem('se_schemas') || '{}');
                    schema.forEach(s => {
                      if (localStorage.getItem(`se_setting_${p}_${s.key}`) === null && s.defaultValue !== undefined) {
                         localStorage.setItem(`se_setting_${p}_${s.key}`, JSON.stringify(s.defaultValue));
                      }
                    });
                    schemas[p] = schema;
                    localStorage.setItem('se_schemas', JSON.stringify(schemas));
                    return Promise.resolve(true);
                  },
                  onSettingsSaved: (p, cb) => {
                    if (!window.StremioEnhancedAPI_Core._listeners[p]) {
                      window.StremioEnhancedAPI_Core._listeners[p] = [];
                    }
                    window.StremioEnhancedAPI_Core._listeners[p].push(cb);
                  },
                  createPluginAPI: (baseName) => ({
                    logger: {
                      info: (msg) => console.log(`[${baseName}]`, msg),
                      warn: (msg) => console.warn(`[${baseName}]`, msg),
                      error: (msg) => console.error(`[${baseName}]`, msg)
                    },
                    info: (msg) => console.log(`[${baseName}]`, msg),
                    warn: (msg) => console.warn(`[${baseName}]`, msg),
                    error: (msg) => console.error(`[${baseName}]`, msg),
                    getSetting: (key) => window.StremioEnhancedAPI_Core.getSetting(baseName, key),
                    getSettings: () => window.StremioEnhancedAPI_Core.getSettings(baseName),
                    saveSetting: (key, val) => window.StremioEnhancedAPI_Core.saveSetting(baseName, key, val),
                    registerSettings: (schema) => window.StremioEnhancedAPI_Core.registerSettings(baseName, schema),
                    onSettingsSaved: (cb) => window.StremioEnhancedAPI_Core.onSettingsSaved(baseName, cb),
                    showAlert: (msg) => alert(msg),
                    showPrompt: (title, msg, def) => prompt(`${title}\n${msg}`, def)
                  })
                };
              }

              // 3. Execute the plugin code safely
              try {
                console.log(`Stremio Enhanced: [Plugin] Executing ${pluginName}`);
                const api = window.StremioEnhancedAPI_Core.createPluginAPI(pluginBaseName);
                const fn = new Function('StremioEnhancedAPI', `
                  try {
                    ${code}
                  } catch (e) {
                    console.error('Stremio Enhanced: [Plugin] Error inside ${pluginName}:', e);
                  }
                `);
                fn(api);
              } catch (e) {
                console.error(`Stremio Enhanced: Injection error for ${pluginName}:`, e);
              }
            },
            args: [codeText, url]
          });
          sendResponse({ success: true });
        }
      })
      .catch(err => {
        console.error(`Stremio Enhanced: Failed to apply [${url}]. Error: ${err.message}`);
        sendResponse({ success: false, error: err.message });
      });

    return true;
  }
});
