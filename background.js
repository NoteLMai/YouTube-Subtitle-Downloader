// YouTube Subtitle Downloader - Background Service Worker

const STORAGE_KEY = 'yt_subtitle_url';
const STORAGE_TRACKS_KEY = 'yt_subtitle_tracks';
const STORAGE_SELECTED_LANG_KEY = 'yt_selected_lang';
const STORAGE_SELECTED_FORMAT_KEY = 'yt_selected_format';

// Common languages for quick access menu (subset of YouTube's 70+ supported languages)
const COMMON_LANGUAGES = [
  // Top 30 most commonly used languages
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'ru', name: 'Russian' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'fil', name: 'Filipino' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'cs', name: 'Czech' },
  { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' },
];

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

    // === LANGUAGE SUBMENU ===
    chrome.contextMenus.create({
      id: 'language-menu',
      title: '🌍 Language (70+ supported)',
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

    // Common languages as radio buttons
    for (const lang of COMMON_LANGUAGES) {
      chrome.contextMenus.create({
        id: `lang-${lang.code}`,
        parentId: 'language-menu',
        title: lang.name,
        contexts: ['action'],
        type: 'radio',
        checked: savedLang === lang.code
      });
    }
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
    // Could dynamically update menu based on available languages
    // For now, we use the static common languages list
    sendResponse({ success: true });
  }
  return true;
});
