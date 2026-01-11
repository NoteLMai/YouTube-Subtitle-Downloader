// YouTube Subtitle Downloader - Background Service Worker

const STORAGE_KEY = 'yt_subtitle_url';
const STORAGE_TRACKS_KEY = 'yt_subtitle_tracks';
const STORAGE_SELECTED_LANG_KEY = 'yt_selected_lang';
const STORAGE_SELECTED_FORMAT_KEY = 'yt_selected_format';
const STORAGE_AVAILABLE_LANGS_KEY = 'yt_available_langs';

// Track current video's available languages
let currentVideoLanguages = null;
let currentVideoId = null;

// Create context menu items on install
chrome.runtime.onInstalled.addListener(() => {
  createContextMenus();
});

async function createContextMenus() {
  // Get saved preferences
  const result = await chrome.storage.local.get([STORAGE_SELECTED_FORMAT_KEY, STORAGE_SELECTED_LANG_KEY]);
  const savedFormat = result[STORAGE_SELECTED_FORMAT_KEY] || 'srt';
  const savedLang = result[STORAGE_SELECTED_LANG_KEY] || null;
  
  // Clear existing menus first
  chrome.contextMenus.removeAll(() => {
    // === FORMAT SUBMENU ===
    chrome.contextMenus.create({
      id: 'format-menu',
      title: '📄 Format',
      contexts: ['action']
    });

    chrome.contextMenus.create({
      id: 'format-srt',
      parentId: 'format-menu',
      title: 'SRT (with timestamps)',
      contexts: ['action'],
      type: 'radio',
      checked: savedFormat === 'srt'
    });

    chrome.contextMenus.create({
      id: 'format-txt',
      parentId: 'format-menu',
      title: 'TXT (plain text)',
      contexts: ['action'],
      type: 'radio',
      checked: savedFormat === 'txt'
    });

    chrome.contextMenus.create({
      id: 'format-clipboard',
      parentId: 'format-menu',
      title: 'Copy to clipboard',
      contexts: ['action'],
      type: 'radio',
      checked: savedFormat === 'clipboard'
    });

    // === LANGUAGE SUBMENU (Dynamic) ===
    chrome.contextMenus.create({
      id: 'language-menu',
      title: '🌍 Language',
      contexts: ['action']
    });

    // Auto-detect option (uses currently playing subtitle)
    chrome.contextMenus.create({
      id: 'lang-auto',
      parentId: 'language-menu',
      title: 'Auto (current subtitle)',
      contexts: ['action'],
      type: 'radio',
      checked: savedLang === null
    });

    chrome.contextMenus.create({
      id: 'lang-separator',
      parentId: 'language-menu',
      type: 'separator',
      contexts: ['action']
    });

    // Placeholder when no video is loaded
    chrome.contextMenus.create({
      id: 'lang-placeholder',
      parentId: 'language-menu',
      title: '(Play a video to see available languages)',
      contexts: ['action'],
      enabled: false
    });
  });
}

/**
 * Update language menu with available languages from current video
 * Source: captions.playerCaptionsTracklistRenderer.captionTracks
 */
async function updateLanguageMenu(languages, videoId) {
  // Skip if same video
  if (videoId === currentVideoId && currentVideoLanguages) return;
  
  currentVideoId = videoId;
  currentVideoLanguages = languages;
  
  const result = await chrome.storage.local.get([STORAGE_SELECTED_LANG_KEY]);
  const savedLang = result[STORAGE_SELECTED_LANG_KEY] || null;
  
  // Remove old language items (keep format menu and lang-auto)
  const menuIdsToRemove = [];
  
  // We need to recreate the language submenu items
  // First, remove all dynamic language items
  return new Promise((resolve) => {
    chrome.contextMenus.removeAll(() => {
      // Recreate format menu
      chrome.storage.local.get([STORAGE_SELECTED_FORMAT_KEY], (result) => {
        const savedFormat = result[STORAGE_SELECTED_FORMAT_KEY] || 'srt';
        
        // === FORMAT SUBMENU ===
        chrome.contextMenus.create({
          id: 'format-menu',
          title: '📄 Format',
          contexts: ['action']
        });

        chrome.contextMenus.create({
          id: 'format-srt',
          parentId: 'format-menu',
          title: 'SRT (with timestamps)',
          contexts: ['action'],
          type: 'radio',
          checked: savedFormat === 'srt'
        });

        chrome.contextMenus.create({
          id: 'format-txt',
          parentId: 'format-menu',
          title: 'TXT (plain text)',
          contexts: ['action'],
          type: 'radio',
          checked: savedFormat === 'txt'
        });

        chrome.contextMenus.create({
          id: 'format-clipboard',
          parentId: 'format-menu',
          title: 'Copy to clipboard',
          contexts: ['action'],
          type: 'radio',
          checked: savedFormat === 'clipboard'
        });

        // === LANGUAGE SUBMENU ===
        const totalLangs = (languages.manual?.length || 0) + (languages.automatic?.length || 0);
        chrome.contextMenus.create({
          id: 'language-menu',
          title: `🌍 Language (${totalLangs} available)`,
          contexts: ['action']
        });

        // Auto-detect option
        chrome.contextMenus.create({
          id: 'lang-auto',
          parentId: 'language-menu',
          title: 'Auto (current subtitle)',
          contexts: ['action'],
          type: 'radio',
          checked: savedLang === null
        });

        // Add manual subtitles section if available
        if (languages.manual && languages.manual.length > 0) {
          chrome.contextMenus.create({
            id: 'lang-separator-manual',
            parentId: 'language-menu',
            type: 'separator',
            contexts: ['action']
          });
          
          chrome.contextMenus.create({
            id: 'lang-header-manual',
            parentId: 'language-menu',
            title: '── Subtitles ──',
            contexts: ['action'],
            enabled: false
          });

          for (const lang of languages.manual) {
            chrome.contextMenus.create({
              id: `lang-${lang.code}`,
              parentId: 'language-menu',
              title: lang.name || lang.code,
              contexts: ['action'],
              type: 'radio',
              checked: savedLang === lang.code
            });
          }
        }

        // Add automatic captions section if available
        if (languages.automatic && languages.automatic.length > 0) {
          chrome.contextMenus.create({
            id: 'lang-separator-auto',
            parentId: 'language-menu',
            type: 'separator',
            contexts: ['action']
          });
          
          chrome.contextMenus.create({
            id: 'lang-header-auto',
            parentId: 'language-menu',
            title: '── Auto-generated ──',
            contexts: ['action'],
            enabled: false
          });

          for (const lang of languages.automatic) {
            // Prefix with 'a-' to indicate auto-generated (ASR)
            const menuId = `lang-a-${lang.code}`;
            chrome.contextMenus.create({
              id: menuId,
              parentId: 'language-menu',
              title: `${lang.name || lang.code}`,
              contexts: ['action'],
              type: 'radio',
              checked: savedLang === `a-${lang.code}`
            });
          }
        }

        // If no languages found
        if (totalLangs === 0) {
          chrome.contextMenus.create({
            id: 'lang-placeholder',
            parentId: 'language-menu',
            title: '(No subtitles available)',
            contexts: ['action'],
            enabled: false
          });
        }

        resolve();
      });
    });
  });
}

// Intercept YouTube timedtext API requests and extract available tracks
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.url.includes('fmt=json3')) {
      chrome.storage.local.set({ [STORAGE_KEY]: details.url });
      
      // Extract language info from URL
      const urlParams = new URLSearchParams(new URL(details.url).search);
      const lang = urlParams.get('lang');
      if (lang) {
        // Store the base URL and available language
        const baseUrl = details.url.split('&lang=')[0];
        chrome.storage.local.get(STORAGE_TRACKS_KEY, (result) => {
          const tracks = result[STORAGE_TRACKS_KEY] || {};
          tracks[lang] = details.url;
          chrome.storage.local.set({ [STORAGE_TRACKS_KEY]: tracks });
        });
      }
    }
  },
  { urls: ['*://www.youtube.com/api/timedtext*'], types: ['xmlhttprequest'] }
);

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const menuId = info.menuItemId.toString();
  
  // Handle format selection (radio buttons - just save preference)
  if (menuId.startsWith('format-')) {
    const format = menuId.replace('format-', '');
    await chrome.storage.local.set({ [STORAGE_SELECTED_FORMAT_KEY]: format });
    return;
  }
  
  // Handle language selection (radio buttons - just save preference)
  if (menuId.startsWith('lang-')) {
    const langCode = menuId.replace('lang-', '');
    if (langCode === 'auto') {
      await chrome.storage.local.remove(STORAGE_SELECTED_LANG_KEY);
    } else {
      await chrome.storage.local.set({ [STORAGE_SELECTED_LANG_KEY]: langCode });
    }
    return;
  }
});

// Handle extension icon click - use selected format and language
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url?.includes('youtube.com/watch')) return;

  const result = await chrome.storage.local.get([STORAGE_KEY, STORAGE_SELECTED_LANG_KEY, STORAGE_SELECTED_FORMAT_KEY]);
  if (result[STORAGE_KEY]) {
    // Determine message type based on selected format (default to SRT)
    const format = result[STORAGE_SELECTED_FORMAT_KEY] || 'srt';
    let messageType;
    switch (format) {
      case 'txt':
        messageType = 'DOWNLOAD_TXT';
        break;
      case 'clipboard':
        messageType = 'COPY_TEXT';
        break;
      case 'srt':
      default:
        messageType = 'DOWNLOAD_SRT';
        break;
    }
    
    chrome.tabs.sendMessage(tab.id, { 
      type: messageType, 
      url: result[STORAGE_KEY],
      targetLang: result[STORAGE_SELECTED_LANG_KEY] || null
    });
  }
});

// Listen for messages from content script to update available languages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_AVAILABLE_LANGUAGES') {
    // Dynamically update menu based on available languages
    updateLanguageMenu(message.languages, message.videoId)
      .then(() => {
        // Store available languages
        chrome.storage.local.set({ 
          [STORAGE_AVAILABLE_LANGS_KEY]: message.languages 
        });
        sendResponse({ success: true });
      })
      .catch((err) => {
        console.error('Error updating language menu:', err);
        sendResponse({ success: false, error: err.message });
      });
    return true; // Keep channel open for async response
  }
  return false;
});

// Reset language menu when tab changes or closes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (!tab.url?.includes('youtube.com/watch')) {
    // Reset to default menu when not on YouTube video
    currentVideoId = null;
    currentVideoLanguages = null;
  }
});

// Reset when navigating away from video
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (!tab.url.includes('youtube.com/watch')) {
      currentVideoId = null;
      currentVideoLanguages = null;
    }
  }
});
