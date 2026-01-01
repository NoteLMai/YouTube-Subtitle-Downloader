# YouTube Subtitle Downloader

<p align="center">
  <img src="icon128.png" alt="YouTube Subtitle Downloader Logo" width="128" height="128">
</p>

<p align="center">
  <strong>The simplest way to download YouTube subtitles in 70+ languages</strong>
</p>

<p align="center">
  <a href="https://chrome.google.com/webstore">
    <img src="https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white" alt="Chrome Extension">
  </a>
  <img src="https://img.shields.io/badge/Version-1.0.0-brightgreen" alt="Version 1.0.0">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT License">
  <img src="https://img.shields.io/badge/Languages-70+-purple" alt="70+ Languages">
</p>

<p align="center">
  <a href="https://chrome.google.com/webstore">Add to Chrome</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#supported-languages">Languages</a> •
  <a href="#faq">FAQ</a>
</p>

---

## Overview

**YouTube Subtitle Downloader** is a lightweight Chrome extension that lets you download YouTube video subtitles with one click. Export captions in SRT format (with timestamps) or TXT format (plain text), or copy directly to your clipboard. With support for **70+ languages** via a convenient right-click menu, you can download subtitles in any language YouTube provides—no configuration, no API key, no account required.

### Why Choose This Extension?

| Feature | Our Extension | Other Tools |
|---------|--------------|-------------|
| **Language Selection** | 70+ languages via right-click menu | Limited or none |
| **Format Options** | SRT, TXT, Clipboard | Usually SRT only |
| **Setup Required** | Zero configuration | Often requires API keys |
| **Privacy** | 100% local, no data collection | May track usage |
| **Price** | Completely free | Often freemium |
| **Interface** | Clean right-click menu | Pop-up windows |

---

## Features

### 🎯 Core Features

- **One-Click Download**: Click the extension icon to instantly download subtitles in SRT format
- **Multiple Export Formats**: Choose between SRT (with timestamps), TXT (plain text), or copy to clipboard
- **70+ Language Support**: Select from any language YouTube provides via the right-click context menu
- **Smart File Naming**: Files automatically include video title and language code (e.g., `Video_Title_en.srt`)
- **Toast Notifications**: Visual feedback confirms successful downloads, copies, or errors

### 📄 Export Format Comparison

| Format | Description | Best Use Cases |
|--------|-------------|----------------|
| **SRT** | Standard subtitle format with precise timestamps | Video players (VLC, Windows Media Player), video editing software (Premiere Pro, Final Cut Pro, DaVinci Resolve), adding subtitles to your own videos |
| **TXT** | Clean plain text, auto-formatted into readable paragraphs | Reading, note-taking, studying, AI summarization tools (ChatGPT, Claude, Gemini), translation |
| **Clipboard** | Copy text directly without file download | Quick paste into documents, chat applications, emails |

### 🔐 Privacy-First Design

- **No Data Collection**: We don't collect, store, or transmit any user data
- **No Analytics**: Zero tracking, zero telemetry, zero third-party services
- **Local Processing**: All subtitle processing happens entirely in your browser
- **No Server**: No backend servers involved—your downloads stay completely private
- **No Account Required**: Use immediately without signup or login
- **Open Source**: Transparent codebase you can verify yourself

---

## Installation

### From Chrome Web Store (Recommended)

1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (link coming soon)
2. Click **Add to Chrome**
3. Confirm the installation when prompted
4. The extension icon appears in your browser toolbar

**Supported Browsers**: Chrome, Microsoft Edge, Brave, Opera, Vivaldi, and other Chromium-based browsers.

### From Source (Developer Mode)

1. Download or clone this repository:
   ```bash
   git clone https://github.com/NoteLMai/YouTube-Subtitle-Downloader.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `app/YouTube Subtitle Downloader` folder
6. The extension icon appears in your toolbar

---

## Usage

### Quick Download (One-Click SRT)

1. Navigate to any YouTube video that has subtitles or captions
2. **Play the video briefly** (even for 1-2 seconds) to trigger subtitle loading
3. Click the extension icon in your browser toolbar
4. Your SRT file downloads automatically with the video title as filename

### Right-Click Context Menu

Right-click the extension icon to access all options:

#### 📄 Format Menu

| Option | Action |
|--------|--------|
| **SRT (with timestamps)** | Download subtitles with full timing information |
| **TXT (plain text)** | Download clean text without timestamps |
| **Copy to clipboard** | Copy subtitle text directly—no file download |

#### 🌍 Language Menu

| Option | Description |
|--------|-------------|
| **✓ Auto (current subtitle)** | Downloads whatever language is currently displayed |
| **30 Common Languages** | Quick access to English, Spanish, Japanese, Chinese, etc. |
| **All 70+ YouTube Languages** | Use "Auto" with YouTube's language settings for any language |

### Download Workflow Examples

**Example 1: Download English SRT**
1. Go to YouTube video → Play briefly
2. Right-click extension icon → Language → English
3. Click extension icon
4. File downloads: `Video_Title_en.srt`

**Example 2: Copy Japanese Subtitles**
1. Go to YouTube video → Play briefly
2. Right-click extension icon → Language → Japanese
3. Right-click extension icon → Format → Copy to clipboard
4. Paste anywhere with Ctrl+V / Cmd+V

**Example 3: Download Multiple Languages**
1. Select first language → Click icon → Download
2. Select second language → Click icon → Download
3. Each file is named with its language code

---

## Supported Languages

### Quick-Access Languages (30)

Available directly in the right-click menu:

| Region | Languages |
|--------|-----------|
| **Americas** | English, Spanish, Portuguese |
| **Europe** | French, German, Italian, Dutch, Polish, Russian, Ukrainian, Swedish, Danish, Norwegian, Finnish, Czech, Greek |
| **Asia** | Japanese, Korean, Chinese (Simplified), Chinese (Traditional), Hindi, Bengali, Indonesian, Malay, Vietnamese, Thai, Filipino |
| **Middle East** | Arabic, Turkish, Hebrew |

### All Supported Languages (70+)

Using the **"Auto"** option, you can download subtitles in any language YouTube provides:

<details>
<summary><strong>Full Language List (Click to Expand)</strong></summary>

**European Languages:**
- English (US, UK, India)
- Spanish (Spain, Latin America, US)
- Portuguese (Portugal, Brazil)
- French (France, Canada)
- German, Italian, Dutch, Polish
- Russian, Ukrainian, Belarusian
- Swedish, Danish, Norwegian, Finnish
- Czech, Slovak, Hungarian, Romanian
- Bulgarian, Serbian, Croatian, Slovenian
- Greek, Albanian, Macedonian
- Estonian, Latvian, Lithuanian
- Icelandic, Bosnian
- Catalan, Galician, Basque

**Asian Languages:**
- Japanese, Korean
- Chinese (Simplified, Traditional, Hong Kong)
- Hindi, Bengali, Tamil, Telugu
- Marathi, Gujarati, Kannada, Malayalam
- Punjabi, Odia, Assamese, Nepali, Sinhala
- Thai, Vietnamese, Indonesian, Malay
- Filipino, Burmese, Khmer, Lao

**Middle Eastern & African Languages:**
- Arabic, Hebrew, Persian
- Turkish, Urdu
- Swahili, Afrikaans, Amharic, Zulu

**Central Asian Languages:**
- Georgian, Armenian, Azerbaijani
- Kazakh, Kyrgyz, Uzbek, Mongolian

</details>

---

## Technical Details

### How It Works

1. **URL Interception**: The extension uses `chrome.webRequest` API to monitor YouTube's `timedtext` API endpoints
2. **Subtitle Capture**: When you play a video, YouTube loads subtitle data—the extension captures this URL automatically
3. **Language Selection**: Choose your preferred language from the right-click menu; the extension modifies the API URL accordingly
4. **Format Conversion**: On download/copy action, the extension fetches JSON data from YouTube and converts it to SRT or TXT format
5. **Instant Export**: Uses native browser download API or clipboard API for fast, reliable exports

### File Structure

```
YouTube Subtitle Downloader/
├── manifest.json       # Extension configuration (Manifest V3)
├── background.js       # Service worker: URL interception, context menus
├── content.js          # Content script: download logic, format conversion
├── icon16.png          # Toolbar icon (16x16)
├── icon48.png          # Extension page icon (48x48)
├── icon128.png         # Chrome Web Store icon (128x128)
└── README.md           # This documentation
```

### Required Permissions

| Permission | Purpose |
|------------|---------|
| `storage` | Store selected language preference locally |
| `webRequest` | Intercept YouTube's subtitle API URLs |
| `contextMenus` | Create right-click menu options |
| `clipboardWrite` | Enable "Copy to clipboard" feature |
| `host_permissions: youtube.com` | Access YouTube pages only |

### SRT Format Output

The extension generates standard SRT files compatible with all major video players and editors:

```srt
1
00:00:01,000 --> 00:00:04,500
Welcome to this tutorial video.

2
00:00:05,000 --> 00:00:09,200
Today we'll learn about Python
programming fundamentals.

3
00:00:10,000 --> 00:00:14,800
Let's start with variables and data types.
```

### TXT Format Output

Plain text output is automatically formatted for readability:
- Removes timing information
- Cleans up `[Music]`, `[Applause]`, and similar tags
- Formats text into readable paragraphs
- Removes duplicate lines

---

## Use Cases

### 📚 Education & Learning
- Download lecture subtitles for offline study
- Search through video content as text
- Create study notes from educational videos
- Review course material at your own pace

### 🌍 Language Learning
- Practice reading in your target language
- Compare subtitles in different languages
- Study vocabulary in context
- Improve listening comprehension

### ✍️ Content Creation
- Generate transcripts for blog posts
- Quote videos accurately with timestamps
- Repurpose video content into written formats
- Create accessible content

### 🎬 Video Production
- Add subtitles to your own videos
- Import into Premiere Pro, Final Cut Pro, DaVinci Resolve
- Translate and localize video content
- Create multilingual versions

### 🔍 Research & Reference
- Archive important video information
- Search through video content as text
- Find specific quotes or statements
- Document video sources

### ♿ Accessibility
- Make video content accessible offline
- Provide text alternatives for audio content
- Support viewers with hearing impairments

---

## FAQ

### General Questions

**Q: Why do I need to play the video first?**
> YouTube loads captions dynamically when you start playing. The extension intercepts this data, so you need to trigger the loading by playing briefly. Even 1-2 seconds is enough.

**Q: Can I download auto-generated subtitles?**
> Yes! The extension works with both manually uploaded captions and YouTube's auto-generated subtitles. Auto-generated captions are available on most videos.

**Q: What if a video doesn't have subtitles?**
> Not all videos have subtitles available. Check if the video has a CC button in the player. If there are no captions, the extension will show a notification.

### Language Questions

**Q: How do I download subtitles in a specific language?**
> Right-click the extension icon → Language → Select your language → Click the icon to download.

**Q: What if my language isn't in the menu?**
> Use the "Auto" option with YouTube's built-in language settings. Change the caption language in YouTube, then download with "Auto" selected.

**Q: Can I download multiple languages for one video?**
> Yes! Select the first language and download, then select another language and download again. Each file will have the language code in the filename.

### Format Questions

**Q: Should I use SRT or TXT format?**
> Use **SRT** if you need timestamps (video editing, synced playback). Use **TXT** for reading, studying, or using with AI tools like ChatGPT.

**Q: Can I edit the downloaded subtitles?**
> Absolutely! SRT and TXT are plain text formats. Open them in any text editor (Notepad, VS Code, etc.) to edit.

**Q: Are downloaded SRT files compatible with my video editor?**
> SRT is the universal subtitle format. It works with VLC, Premiere Pro, Final Cut Pro, DaVinci Resolve, and virtually all video software.

### Troubleshooting

**Q: Download not working?**
1. Make sure you're on a YouTube watch page (`youtube.com/watch?v=...`)
2. Play the video for a few seconds
3. Check if the video has subtitles (CC button)
4. Try refreshing the page
5. Try selecting a different language

**Q: Wrong language downloaded?**
> Make sure to select your desired language from the right-click menu before clicking the icon.

**Q: Copy to clipboard not working?**
> Some browsers may block clipboard access on certain pages. Make sure you're on the YouTube page when copying.

---

## Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Fully Supported | Recommended |
| Edge | ✅ Fully Supported | Chromium-based |
| Brave | ✅ Fully Supported | Chromium-based |
| Opera | ✅ Fully Supported | Chromium-based |
| Vivaldi | ✅ Fully Supported | Chromium-based |
| Firefox | ❌ Not Available | Different extension API |
| Safari | ❌ Not Available | Different extension API |

---

## Related Tools

- **[YouTube Video Summarizer](../YouTube%20Video%20Summarizer/)** - AI-powered video summaries with chapters and timestamps
- **[YouTube Transcript Generator](https://notelm.ai/tools/youtube-transcript-generator)** - Online tool to generate YouTube transcripts
- **[NoteLM.ai](https://notelm.ai)** - Your AI-powered productivity companion

---

## Support

Having issues or suggestions? We'd love to hear from you:

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/NoteLMai/YouTube-Subtitle-Downloader/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/NoteLMai/YouTube-Subtitle-Downloader/discussions)
- 📧 **Email**: hello@notelm.ai
- 🌐 **Website**: [notelm.ai](https://notelm.ai)

---

## License

MIT License - Feel free to modify and distribute.

```
MIT License

Copyright (c) 2024-2026 NoteLM.ai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Credits

Built with ❤️ by [NoteLM.ai](https://notelm.ai) - Your AI-powered note-taking companion.

<p align="center">
  <a href="https://notelm.ai">
    <img src="https://notelm.ai/logo.svg" alt="NoteLM.ai" width="120">
  </a>
</p>

---

## Version History

### v1.0.0 (Current Release)
- 🎉 Initial public release
- ✨ One-click subtitle download in SRT format
- 📄 Multiple export formats: SRT, TXT, Clipboard
- 🌍 70+ language support via right-click menu
- 📁 Smart file naming with video title and language code
- 🔔 Toast notifications for action feedback
- 🧹 Auto-clean [Music], [Applause] tags in TXT format
- 🔒 Privacy-first design with zero data collection
