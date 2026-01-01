// YouTube Subtitle Downloader - Content Script

// Prevent duplicate listener registration (SPA navigation may re-inject script)
if (window.__ytSubtitleDownloaderLoaded) {
  throw new Error('Script already loaded');
}
window.__ytSubtitleDownloaderLoaded = true;

// Language code to name mapping for display (70+ YouTube supported languages)
const LANGUAGE_NAMES = {
  // Major world languages
  'en': 'English', 'en-GB': 'English (UK)', 'en-IN': 'English (India)',
  'es': 'Spanish', 'es-419': 'Spanish (Latin America)', 'es-US': 'Spanish (US)',
  'pt': 'Portuguese', 'pt-PT': 'Portuguese (Portugal)',
  'fr': 'French', 'fr-CA': 'French (Canada)',
  'de': 'German', 'it': 'Italian', 'nl': 'Dutch',
  // Asian languages
  'ja': 'Japanese', 'ko': 'Korean',
  'zh-CN': 'Chinese (Simplified)', 'zh-TW': 'Chinese (Traditional)', 'zh-HK': 'Chinese (Hong Kong)',
  'zh': 'Chinese', 'zh-Hans': 'Chinese (Simplified)', 'zh-Hant': 'Chinese (Traditional)',
  'hi': 'Hindi', 'bn': 'Bengali', 'ta': 'Tamil', 'te': 'Telugu',
  'mr': 'Marathi', 'gu': 'Gujarati', 'kn': 'Kannada', 'ml': 'Malayalam',
  'pa': 'Punjabi', 'or': 'Odia', 'as': 'Assamese', 'ne': 'Nepali', 'si': 'Sinhala',
  'th': 'Thai', 'vi': 'Vietnamese', 'id': 'Indonesian', 'ms': 'Malay',
  'fil': 'Filipino', 'my': 'Burmese', 'km': 'Khmer', 'lo': 'Lao',
  // European languages
  'ru': 'Russian', 'uk': 'Ukrainian', 'pl': 'Polish', 'cs': 'Czech',
  'sk': 'Slovak', 'hu': 'Hungarian', 'ro': 'Romanian', 'bg': 'Bulgarian',
  'sr': 'Serbian', 'sr-Latn': 'Serbian (Latin)', 'hr': 'Croatian', 'sl': 'Slovenian',
  'el': 'Greek', 'tr': 'Turkish', 'sv': 'Swedish', 'da': 'Danish',
  'no': 'Norwegian', 'fi': 'Finnish', 'et': 'Estonian', 'lv': 'Latvian', 'lt': 'Lithuanian',
  'is': 'Icelandic', 'sq': 'Albanian', 'mk': 'Macedonian', 'be': 'Belarusian',
  'bs': 'Bosnian', 'ca': 'Catalan', 'gl': 'Galician', 'eu': 'Basque',
  // Middle Eastern & African languages
  'ar': 'Arabic', 'he': 'Hebrew', 'iw': 'Hebrew', 'fa': 'Persian', 'ur': 'Urdu',
  'sw': 'Swahili', 'af': 'Afrikaans', 'am': 'Amharic', 'zu': 'Zulu',
  // Central Asian languages
  'ka': 'Georgian', 'hy': 'Armenian', 'az': 'Azerbaijani',
  'kk': 'Kazakh', 'ky': 'Kyrgyz', 'uz': 'Uzbek', 'mn': 'Mongolian',
};

chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case 'DOWNLOAD_SUBTITLES':
    case 'DOWNLOAD_SRT':
      downloadSRT(message.url, message.targetLang);
      break;
    case 'DOWNLOAD_TXT':
      downloadTXT(message.url, message.targetLang);
      break;
    case 'COPY_TEXT':
      copyText(message.url, message.targetLang);
      break;
  }
});

function getVideoTitle() {
  const el = document.querySelector('h1 yt-formatted-string') || document.querySelector('meta[name="title"]');
  return (el?.textContent || el?.content || document.title.replace(' - YouTube', '')).trim() || 'subtitles';
}

// Build URL with target language
function buildUrlWithLanguage(baseUrl, targetLang) {
  if (!targetLang) return baseUrl;
  
  const url = new URL(baseUrl);
  
  // Change the lang parameter
  url.searchParams.set('lang', targetLang);
  
  // For translated subtitles, we may need to set tlang
  // If the target language is different from the video's original language
  const originalLang = url.searchParams.get('lang');
  if (originalLang && originalLang !== targetLang) {
    url.searchParams.set('tlang', targetLang);
  }
  
  return url.toString();
}

// Extract language code from URL
function extractLangFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('lang') || urlObj.searchParams.get('tlang') || 'unknown';
  } catch {
    return 'unknown';
  }
}

// Get display name for language code
function getLanguageName(langCode) {
  if (!langCode || langCode === 'unknown') return '';
  // Handle variants like zh-Hans, zh-Hant
  const baseLang = langCode.split('-')[0];
  return LANGUAGE_NAMES[langCode] || LANGUAGE_NAMES[baseLang] || langCode.toUpperCase();
}

// Download as SRT (with timestamps)
async function downloadSRT(url, targetLang) {
  try {
    const finalUrl = buildUrlWithLanguage(url, targetLang);
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const srt = convertToSRT(data);
    
    if (!srt.trim()) {
      showNotification('No subtitles available for this language.', 'warning');
      return;
    }
    
    const langCode = extractLangFromUrl(finalUrl);
    const langSuffix = langCode !== 'unknown' ? `_${langCode}` : '';
    const filename = sanitizeFilename(getVideoTitle()) + langSuffix + '.srt';
    
    downloadFile(srt, filename, 'text/plain');
    
    const langName = getLanguageName(langCode);
    showNotification(langName ? `SRT downloaded! (${langName})` : 'SRT downloaded!');
  } catch (err) {
    console.error('Download SRT error:', err);
    showNotification('Download failed. Try another language.', 'error');
  }
}

// Download as plain TXT (no timestamps)
async function downloadTXT(url, targetLang) {
  try {
    const finalUrl = buildUrlWithLanguage(url, targetLang);
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const text = convertToPlainText(data);
    
    if (!text.trim()) {
      showNotification('No subtitles available for this language.', 'warning');
      return;
    }
    
    const langCode = extractLangFromUrl(finalUrl);
    const langSuffix = langCode !== 'unknown' ? `_${langCode}` : '';
    const filename = sanitizeFilename(getVideoTitle()) + langSuffix + '.txt';
    
    downloadFile(text, filename, 'text/plain');
    
    const langName = getLanguageName(langCode);
    showNotification(langName ? `TXT downloaded! (${langName})` : 'TXT downloaded!');
  } catch (err) {
    console.error('Download TXT error:', err);
    showNotification('Download failed. Try another language.', 'error');
  }
}

// Copy plain text to clipboard
async function copyText(url, targetLang) {
  try {
    const finalUrl = buildUrlWithLanguage(url, targetLang);
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const text = convertToPlainText(data);
    
    if (!text.trim()) {
      showNotification('No subtitles available for this language.', 'warning');
      return;
    }
    
    await navigator.clipboard.writeText(text);
    
    const langCode = extractLangFromUrl(finalUrl);
    const langName = getLanguageName(langCode);
    showNotification(langName ? `Copied! (${langName})` : 'Copied to clipboard!');
  } catch (err) {
    console.error('Copy text error:', err);
    showNotification('Failed to copy. Please try again.', 'error');
  }
}

function downloadFile(content, filename, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// Convert to SRT format (with timestamps)
function convertToSRT(json) {
  let srt = '', i = 1;
  for (const e of json.events || []) {
    if (!e.segs?.length) continue;
    const text = e.segs.map(s => s.utf8 || '').join('').trim();
    if (!text) continue;
    srt += `${i++}\n${formatTime(e.tStartMs || 0)} --> ${formatTime((e.tStartMs || 0) + (e.dDurationMs || 0))}\n${text}\n\n`;
  }
  return srt;
}

// Convert to plain text (no timestamps, properly formatted)
function convertToPlainText(json) {
  const lines = [];
  let lastText = '';
  
  for (const e of json.events || []) {
    if (!e.segs?.length) continue;
    const text = e.segs.map(s => s.utf8 || '').join('').trim();
    if (!text || text === lastText) continue; // Skip duplicates
    
    // Clean up the text: remove musical notes and other special characters
    const cleanText = text
      .replace(/♪/g, '')
      .replace(/\[.*?\]/g, '') // Remove [Music], [Applause], etc.
      .trim();
    
    if (cleanText) {
      lines.push(cleanText);
      lastText = text;
    }
  }
  
  // Join lines and format paragraphs
  return lines.join(' ')
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/([.!?])\s+/g, '$1\n\n') // Add paragraph breaks after sentences
    .trim();
}

function formatTime(ms) {
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000), mm = ms % 1000;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(mm).padStart(3,'0')}`;
}

function sanitizeFilename(name) {
  return name.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, ' ').trim().slice(0, 200);
}

// Show notification toast
function showNotification(message, type = 'success') {
  // Remove existing notification
  const existing = document.getElementById('yt-subtitle-notification');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.id = 'yt-subtitle-notification';
  toast.textContent = message;
  
  // Different colors for different types
  const gradients = {
    success: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    error: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
  };
  
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: ${gradients[type] || gradients.success};
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 999999;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add animation keyframes
  if (!document.getElementById('yt-subtitle-styles')) {
    const style = document.createElement('style');
    style.id = 'yt-subtitle-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
