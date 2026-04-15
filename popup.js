// Stremio Enhanced Popup JS v1.0.8

const REGISTRY_URL = 'https://raw.githubusercontent.com/REVENGE977/stremio-enhanced-registry/main/registry.json';

document.addEventListener('DOMContentLoaded', async () => {
  const themesList = document.getElementById('themes-list');
  const pluginsList = document.getElementById('plugins-list');
  const saveBtn = document.getElementById('save-btn');
  const tabs = document.querySelectorAll('.tab-btn');

  // Tab Management
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const contentId = `${tab.dataset.tab}-list`;
      const content = document.getElementById(contentId);
      if (content) content.classList.add('active');
    });
  });

  // Fetch Registry and Current Settings
  try {
    const [registryResponse, settings] = await Promise.all([
      fetch(REGISTRY_URL),
      chrome.storage.local.get(['enabledThemes', 'enabledPlugins'])
    ]);

    if (!registryResponse.ok) throw new Error(`HTTP ${registryResponse.status}`);
    const registry = await registryResponse.json();
    
    const enabledThemes = new Set(settings.enabledThemes || []);
    const enabledPlugins = new Set(settings.enabledPlugins || []);

    // Fetch Configs from active Stremio tab
    let pluginConfigs = {};
    let activeTabId = null;
    try {
      const stremioTabs = await chrome.tabs.query({ url: '*://web.stremio.com/*' });
      if (stremioTabs.length > 0) {
        activeTabId = stremioTabs[0].id;
        pluginConfigs = await getConfigsFromTab(activeTabId);
      }
    } catch (e) {
      console.warn("Could not fetch configs from Stremio tab", e);
    }

    // Render Themes
    themesList.innerHTML = '';
    registry.themes.forEach(theme => {
      themesList.appendChild(createCard(theme, 'theme', enabledThemes.has(theme.download), null, activeTabId));
    });

    // Render Plugins
    pluginsList.innerHTML = '';
    registry.plugins.forEach(plugin => {
      const baseName = plugin.download.split('/').pop().replace('.plugin.js', '');
      const configData = pluginConfigs[baseName];
      pluginsList.appendChild(createCard(plugin, 'plugin', enabledPlugins.has(plugin.download), configData, activeTabId));
    });

    if (registry.themes.length === 0) themesList.innerHTML = '<div class="loading">No themes found in registry.</div>';
    if (registry.plugins.length === 0) pluginsList.innerHTML = '<div class="loading">No plugins found in registry.</div>';

  } catch (err) {
    console.error('Stremio Enhanced: Popup error.', err);
    themesList.innerHTML = `<div class="loading">Error loading registry: ${err.message}</div>`;
    pluginsList.innerHTML = `<div class="loading">Error loading registry: ${err.message}</div>`;
  }

  // Save and Refresh
  saveBtn.addEventListener('click', async () => {
    try {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      const selectedThemes = Array.from(document.querySelectorAll('.theme-switch:checked')).map(el => el.dataset.url);
      const selectedPlugins = Array.from(document.querySelectorAll('.plugin-switch:checked')).map(el => el.dataset.url);

      await chrome.storage.local.set({
        enabledThemes: selectedThemes,
        enabledPlugins: selectedPlugins
      });

      console.log('Stremio Enhanced: Settings saved.');

      // Refresh any Stremio tab
      const stremioTabs = await chrome.tabs.query({ url: '*://web.stremio.com/*' });
      
      if (stremioTabs.length > 0) {
        saveBtn.textContent = 'Refreshing...';
        for (const tab of stremioTabs) {
          chrome.tabs.reload(tab.id);
        }
        setTimeout(() => {
          saveBtn.textContent = 'Done! Reloaded.';
          setTimeout(() => {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save & Refresh';
            saveBtn.style.backgroundColor = '';
          }, 1000);
        }, 500);
      } else {
        saveBtn.textContent = 'Saved! Open Stremio Web.';
        setTimeout(() => {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save & Refresh';
          saveBtn.style.backgroundColor = '';
        }, 2000);
      }
    } catch (err) {
      console.error('Stremio Enhanced: Save failed.', err);
      saveBtn.textContent = 'Error saving.';
      saveBtn.disabled = false;
    }
  });
});

async function getConfigsFromTab(tabId) {
  const results = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: () => {
      try {
        const schemas = JSON.parse(localStorage.getItem('se_schemas') || '{}');
        const data = {};
        for (const plugin in schemas) {
          data[plugin] = {
            schema: schemas[plugin],
            values: {}
          };
          schemas[plugin].forEach(setting => {
            const raw = localStorage.getItem(`se_setting_${plugin}_${setting.key}`);
            data[plugin].values[setting.key] = raw !== null ? JSON.parse(raw) : setting.defaultValue;
          });
        }
        return data;
      } catch(e) {
        return null;
      }
    }
  });
  return results[0]?.result || {};
}

function createCard(item, type, isEnabled, configData = null, tabId = null) {
  const div = document.createElement('div');
  div.className = 'item-card';
  
  const hasConfig = configData && configData.schema && configData.schema.length > 0;
  const pluginBaseName = item.download.split('/').pop().replace('.plugin.js', '');

  let headerHtml = `
    <div class="item-header">
      <div class="item-name">${item.name || 'Unknown'}</div>
      <div style="display: flex; align-items: center; gap: 8px;">
        ${hasConfig ? `<button class="cog-btn" title="Configure Plugin">⚙️</button>` : ''}
        <label class="switch">
          <input type="checkbox" class="${type}-switch" data-url="${item.download}" ${isEnabled ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
    </div>
    <div class="item-author">by ${item.author || 'Anonymous'} (v${item.version || '0.0.0'})</div>
    <div class="item-desc">${item.description || 'No description provided.'}</div>
  `;

  div.innerHTML = headerHtml;

  if (hasConfig) {
    const configPanel = document.createElement('div');
    configPanel.className = 'config-panel';
    configPanel.style.display = 'none';

    configData.schema.forEach(setting => {
      const row = document.createElement('div');
      row.className = 'config-row';
      row.title = setting.description || '';
      
      const label = document.createElement('label');
      label.textContent = setting.label || setting.key;
      
      let input;
      const currentValue = configData.values[setting.key];

      if (setting.type === 'toggle' || setting.type === 'boolean') {
        input = document.createElement('label');
        input.className = 'switch config-switch';
        input.innerHTML = `
          <input type="checkbox" ${currentValue ? 'checked' : ''}>
          <span class="slider"></span>
        `;
        const checkbox = input.querySelector('input');
        checkbox.addEventListener('input', async (e) => saveConfigValue(pluginBaseName, setting.key, e.target.checked, tabId));
      } else {
        input = document.createElement('input');
        input.type = 'text';
        input.className = 'config-input';
        input.value = currentValue !== undefined && currentValue !== null ? currentValue : '';
        input.addEventListener('input', async (e) => saveConfigValue(pluginBaseName, setting.key, e.target.value, tabId));
      }
      
      row.appendChild(label);
      row.appendChild(input);
      configPanel.appendChild(row);
    });

    div.appendChild(configPanel);

    // Toggle config panel visibility
    const cogBtn = div.querySelector('.cog-btn');
    cogBtn.addEventListener('click', () => {
      configPanel.style.display = configPanel.style.display === 'none' ? 'block' : 'none';
      cogBtn.style.opacity = configPanel.style.display === 'block' ? '1' : '0.6';
    });
  }

  return div;
}

async function saveConfigValue(plugin, key, value, tabId) {
  if (!tabId) return;
  await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (p, k, v) => {
      localStorage.setItem(`se_setting_${p}_${k}`, JSON.stringify(v));
    },
    args: [plugin, key, value]
  });
  
  const saveBtn = document.getElementById('save-btn');
  saveBtn.textContent = 'Config Updated! Click to Refresh';
  saveBtn.style.backgroundColor = '#28a745';
}

