# IWT Note Site - Technical Documentation

> Complete technical reference for the Educational Web Development Course Website

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [File Structure](#file-structure)
4. [External Libraries & APIs](#external-libraries--apis)
5. [Code Architecture](#code-architecture)
6. [Features Documentation](#features-documentation)
7. [CSS Architecture](#css-architecture)
8. [Configuration & Settings](#configuration--settings)
9. [Browser Compatibility](#browser-compatibility)
10. [Performance Optimization](#performance-optimization)
11. [Troubleshooting](#troubleshooting)
12. [Future Enhancements](#future-enhancements)

---

## 📌 Project Overview

**Project Name:** IWT Note Site  
**Purpose:** Educational website for web development course (HTML, CSS, JavaScript, PHP)  
**Type:** Static website with client-side JavaScript  
**Target Audience:** Students learning web development  
**Hosting:** Can be hosted on any static hosting (GitHub Pages, Netlify, Vercel, Apache)

### Key Features:
- 📚 Lecture-based content organization (4 HTML, 4 CSS, 2 PHP lectures)
- 🎨 Dark/Light theme toggle with OS-preference detection
- 🔍 Search functionality with keyboard navigation
- ✅ Progress tracking with localStorage persistence
- ▶️ Live code execution (HTML, CSS, JS; PHP notice)
- 🎧 Text-to-Speech audio for lecture content
- 📝 Interactive live code editor with multi-tab support
- 📱 Fully responsive design (1024px / 768px / 480px breakpoints)
- 📋 Practicals section with filtering, search, and answer toggling
- ◀️ Sidebar toggle — hide/show navigation on desktop with localStorage persistence

---

## 🛠 Technology Stack

### Core Technologies:
| Technology | Version | Purpose |
|------------|---------|---------|
| HTML5 | - | Structure and content |
| CSS3 | - | Styling, animations, CSS variables |
| JavaScript (ES6+) | - | Interactivity and features |
| Vanilla JS | - | No framework dependencies |

### Why Vanilla JS?
- ✅ Lightweight and fast — no build process required
- ✅ Easy to understand for students learning web development
- ✅ No framework lock-in
- ✅ Works in all modern browsers without transpilation

---

## 📁 File Structure

```
IWT-NOTE-SITE/
│
├── index.html                  # Home page — hero, progress overview, topic cards
├── html.html                   # HTML topic page — lecture cards
├── css.html                    # CSS topic page — lecture cards
├── javascript.html             # JavaScript topic page
├── php.html                    # PHP topic page — lecture cards
├── practicals.html             # Practicals page — exercises with filtering
├── DOCUMENTATION.md            # This file
├── README.md                   # Project readme
│
├── lectures/                   # All lecture pages (10 files)
│   ├── html-lecture1.html      # HTML Lecture 1
│   ├── html-lecture2.html      # HTML Lecture 2
│   ├── html-lecture3.html      # HTML Lecture 3
│   ├── html-lecture4.html      # HTML Lecture 4
│   ├── css-lecture1.html       # CSS Lecture 1
│   ├── css-lecture2.html       # CSS Lecture 2
│   ├── css-lecture3.html       # CSS Lecture 3
│   ├── css-lecture4.html       # CSS Lecture 4
│   ├── php-lecture1.html       # PHP Lecture 1
│   └── php-lecture2.html       # PHP Lecture 2
│
├── practicals/                 # Practical exercises
│   ├── pdfs/                   # PDF files
│   │   ├── Practical Sheet 01.pdf
│   │   └── practical-10.pdf
│   └── answers/                # Answer files
│       └── Practical Sheet 01-answers.pdf
│
├── css/                        # Stylesheets (6 files)
│   ├── style.css               # Main design system (1138 lines)
│   ├── theme.css               # Light/dark theme CSS variables
│   ├── code.css                # Code block styling & syntax colors
│   ├── responsive.css          # Mobile breakpoints (1024/768/480px)
│   ├── live-editor.css         # Live code editor panel styles
│   └── text-to-speech.css      # TTS control panel styles
│
├── js/                         # JavaScript modules (9 files)
│   ├── app.js                  # Core app logic — mobile menu, nav, smooth scroll
│   ├── theme.js                # Theme toggle — localStorage, OS detection
│   ├── search.js               # Search — pre-built index, keyboard nav
│   ├── progress.js             # Progress tracking — checkboxes, progress bars
│   ├── code-copy.js            # Copy code button — clipboard API + fallback
│   ├── code-runner.js          # Run code — HTML/CSS/JS execution in iframes
│   ├── live-editor.js          # Interactive code playground — multi-tab editor
│   ├── text-to-speech.js       # TTS engine — Web Speech API
│   └── practicals.js           # Practicals page — filter, search, answer toggle
│
└── images/                     # Assets
    └── favicon.svg             # Site favicon
```

---

## 📚 External Libraries & APIs

### 1. Browser APIs (Built-in, No External Dependencies)

#### Web Speech API (Text-to-Speech)
- **File:** `js/text-to-speech.js`
- **API Used:** `window.speechSynthesis`
- **Documentation:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **Browser Support:** Chrome, Edge, Safari, Firefox
- **Purpose:** Read lecture content aloud with play/pause/stop/skip controls
- **Key Methods:**
  ```javascript
  speechSynthesis.speak(utterance)    // Start speaking
  speechSynthesis.pause()             // Pause speech
  speechSynthesis.resume()            // Resume speech
  speechSynthesis.cancel()            // Stop speech
  speechSynthesis.getVoices()         // Get available voices
  ```

#### Local Storage API (Progress & Preferences)
- **Files:** `js/progress.js`, `js/theme.js`, `js/text-to-speech.js`, `js/practicals.js`
- **API Used:** `window.localStorage`
- **Documentation:** https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **Purpose:** Persist user progress, theme preference, and TTS settings
- **Storage Keys:**
  ```javascript
  'iwt-progress'              // Object mapping section IDs to completion status
  'iwt-theme'                 // 'light' or 'dark'
  'iwt-tts-speed'             // TTS speed (number, e.g. 1.25)
  'iwt-tts-voice'             // TTS voice index (number)
  'iwt-practicals-progress'   // Object mapping practical IDs to completion status
  ```

#### Clipboard API (Code Copy)
- **File:** `js/code-copy.js`
- **API Used:** `navigator.clipboard.writeText()`
- **Fallback:** `document.execCommand('copy')` for older browsers
- **Documentation:** https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
- **Purpose:** Copy code block content to clipboard

#### Media Query API (Theme Detection)
- **File:** `js/theme.js`
- **API Used:** `window.matchMedia('(prefers-color-scheme: dark)')`
- **Purpose:** Auto-detect user's OS theme preference on first visit

---

### 2. Google Fonts (via CSS @import)

Loaded in `css/style.css` via `@import`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap');
```

**Fonts Used:**
| Font | Weights | CSS Variable | Usage |
|------|---------|--------------|-------|
| **Inter** | 300–800 | `--font-body` | Body text, headings, UI elements |
| **Fira Code** | 400–600 | `--font-code` | Code blocks, monospace content |

**System Fallbacks:**
- Body: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Code: `'Consolas', 'Monaco', monospace`

---

### 3. Optional External Libraries (Not Currently Included)

#### CodeMirror (Advanced Code Editor)
- **Version:** 5.65.2
- **CDN:** `https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/`
- **Purpose:** Could replace textarea in live editor for syntax highlighting
- **Documentation:** https://codemirror.net/5/doc/manual.html
- **License:** MIT

#### Prism.js (Syntax Highlighting)
- **Version:** 1.29.0
- **CDN:** `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/`
- **Purpose:** Could add syntax coloring to static code blocks
- **Documentation:** https://prismjs.com/
- **License:** MIT

---

## 🏗 Code Architecture

### Design Pattern: Function-Based Modules + Class-Based Components

Each feature is isolated in its own file. Simpler features use standalone functions; complex ones use ES6 classes.

#### Initialization Pattern (used in all modules):
```javascript
document.addEventListener('DOMContentLoaded', () => {
    initFeatureName();
});
```

#### Class-Based Pattern (used for TextToSpeech, LiveEditor):
```javascript
class FeatureName {
    constructor() {
        this.init();
    }
    init() { /* setup */ }
    attachEventListeners() { /* bind DOM events */ }
    // Feature-specific methods...
}

document.addEventListener('DOMContentLoaded', () => {
    new FeatureName();
});
```

---

### Module Breakdown:

#### 1. `app.js` — Core Application (122 lines)
```
Functions:
├── initSidebarToggle()  – Toggle sidebar visibility on desktop, save to localStorage
├── initMobileMenu()     – Hamburger toggle, overlay, click-outside close
├── setActiveNavLink()   – Highlight current page in sidebar via data-page
└── initSmoothScroll()   – Smooth scroll for anchor (#) links

Storage Key: 'iwt-sidebar-collapsed'
Values: 'true' | 'false'
Dependencies: localStorage API
```

#### 2. `theme.js` — Theme Toggle (64 lines)
```
Functions:
├── initTheme()           – Load saved/OS theme, bind toggle buttons
├── toggleTheme()         – Switch between light ↔ dark
├── applyTheme(theme)     – Set data-theme attribute on <html>
└── updateThemeButtons()  – Update button icons (☀️/🌙) and labels

Storage Key: 'iwt-theme'
Values: 'light' | 'dark'
Dependencies: localStorage API, matchMedia API
```

#### 3. `search.js` — Search Feature (126 lines)
```
Data:
└── SEARCH_INDEX[]       – Pre-built array of {title, topic, page, section}
                           28 entries across HTML, CSS, JS, PHP topics

Functions:
├── initSearch()         – Bind input events, filter results, keyboard nav
└── updateActiveResult() – Highlight active result during arrow-key navigation

Keyboard Support: ArrowUp, ArrowDown, Enter, Escape
Dependencies: None
```

#### 4. `progress.js` — Progress Tracking (115 lines)
```
Constants:
├── STORAGE_KEY          – 'iwt-progress'
└── TOPIC_SECTIONS{}     – Maps each topic to array of 7 section IDs

Functions:
├── getProgress()        – Read progress object from localStorage
├── saveProgress()       – Write progress object to localStorage
├── initProgress()       – Bind checkboxes, restore saved state
├── updateProgressUI()   – Update progress bars & percentages (home + sidebar)
├── updateNavCheckmarks()– Show ✓ on completed topics in sidebar
└── getPageForTopic()    – Map topic → page filename

Dependencies: localStorage API
```

#### 5. `code-copy.js` — Copy Code Button (52 lines)
```
Functions:
├── initCodeCopy()       – Attach click handlers to .copy-btn elements
├── showCopied(btn)      – Show "✓ Copied!" feedback for 2 seconds
└── fallbackCopy(text)   – Legacy copy via hidden textarea + execCommand

API: navigator.clipboard.writeText()
Fallback: document.execCommand('copy')
Dependencies: Clipboard API
```

#### 6. `code-runner.js` — Run Code Feature (355 lines)
```
Functions:
├── initCodeRunner()       – Find .code-block elements, inject Run buttons
├── detectLanguage(label)  – Parse language from header text (html/css/js/php)
├── createOutputPanel()    – Build output DOM with iframe + console
├── executeCode()          – Route to appropriate runner by language
├── runHTML(code)           – Render HTML in sandboxed iframe via srcdoc
├── runCSS(code)           – Wrap CSS in HTML template, display in iframe
├── runJS(code)            – Execute JS in iframe with console capture
├── escapeScriptContent()  – Escape </script> tags in user code
└── showPHPNotice()        – Display "PHP requires a server" notice

Execution Methods:
  HTML → iframe.srcdoc
  CSS  → Injected into sample HTML template
  JS   → Sandboxed iframe with console.log override
  PHP  → Informational notice (no client-side execution)

Dependencies: None
```

#### 7. `live-editor.js` — Interactive Code Editor (276 lines)
```
Class: LiveEditor
├── constructor(container, index)
├── wrapEditor(editor)        – Add line numbers to textarea
├── updateLineNumbers()       – Sync line numbers on scroll/input
├── bindEvents()              – Tab switching, run, reset, fullscreen
├── debouncedUpdate()         – 300ms debounce before preview refresh
├── updatePreview()           – Combine HTML/CSS/JS into iframe srcdoc
├── switchTab(tab)            – Toggle between HTML/CSS/JS editor panels
├── reset()                   – Restore original code from data attributes
├── toggleFullscreen()        – Toggle fullscreen class on container
└── handleKeydown(e, editor)  – Insert 2 spaces on Tab key

Function: initializeLiveEditors()  – Find all .live-editor-container, create instances
Listener: window message listener  – Capture console output from editor iframes

Update Flow: textarea input → debounce(300ms) → iframe.srcdoc
Dependencies: None (optional: CodeMirror)
```

#### 8. `text-to-speech.js` — TTS Audio (342 lines)
```
Class: TextToSpeech
├── constructor()
├── init()                    – Check API support, load voices
├── getContentSections()      – Gather readable sections from page
├── populateVoices()          – Fill voice dropdown with available voices
├── attachEventListeners()    – Play, pause, stop, skip, speed, voice events
├── play()                    – Start reading from current section
├── speakSection(index)       – Speak a specific section, auto-advance on end
├── pause()                   – Pause current speech
├── resume()                  – Resume paused speech
├── stop()                    – Cancel speech and reset state
├── skipSection(direction)    – Jump forward/backward by one section
├── readSelection()           – Read user's highlighted text selection
├── highlightSection(element) – Visually highlight the current section
├── updateProgress(text)      – Update progress display (word count, etc.)
└── loadPreferences()         – Restore speed and voice from localStorage

Storage Keys: 'iwt-tts-speed', 'iwt-tts-voice'
API: SpeechSynthesis, SpeechSynthesisUtterance
Dependencies: Web Speech API
```

#### 9. `practicals.js` — Practicals Page (104 lines)
```
Inline Functions:
├── Filter buttons            – Show/hide items by topic (data-filter)
├── Search input              – Filter by title or tag text
├── Completion checkboxes     – Track practical completion
├── loadProgress()            – Restore checkbox state from localStorage
├── saveProgress(id, checked) – Save individual practical completion
└── updateMiniProgress()      – Update sidebar mini progress bar

Global Function:
└── toggleAnswer(id)          – Show/hide answer section, toggle button label

Storage Key: 'iwt-practicals-progress'
Dependencies: localStorage API
```

---

## 🎨 CSS Architecture

### Design System (CSS Custom Properties)

**File:** `css/style.css` — 1138 lines

```css
:root {
  /* Topic Colors */
  --color-html: #E44D26;          /* Orange */
  --color-html-light: #f4845f;
  --color-html-bg: rgba(228, 77, 38, 0.08);
  --color-css: #264DE4;           /* Blue */
  --color-css-light: #5c7cfa;
  --color-css-bg: rgba(38, 77, 228, 0.08);
  --color-js: #F7DF1E;            /* Yellow */
  --color-js-dark: #c9a800;
  --color-js-bg: rgba(247, 223, 30, 0.08);
  --color-php: #777BB4;           /* Purple */
  --color-php-light: #9b9ed4;
  --color-php-bg: rgba(119, 123, 180, 0.08);

  /* Spacing Scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;

  /* Typography */
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-code: 'Fira Code', 'Consolas', 'Monaco', monospace;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-md: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 2rem;      /* 32px */
  --font-size-4xl: 2.5rem;    /* 40px */

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
  --shadow-glow: 0 0 20px rgba(99,102,241,0.15);

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;
  --transition-slow: 0.4s ease;

  /* Layout */
  --sidebar-width: 280px;
  --header-height: 64px;
  --content-max-width: 900px;
}
```

---

### Theme Variables

**File:** `css/theme.css` — 75 lines

| Variable | Light Theme | Dark Theme |
|----------|-------------|------------|
| `--bg-primary` | `#f8f9fc` | `#0f0f1a` |
| `--bg-sidebar` | `#ffffff` | `#161625` |
| `--bg-card` | `#ffffff` | `#1a1a2e` |
| `--bg-input` | `#f1f3f9` | `#222238` |
| `--bg-code` | `#1e1e2e` | `#11111b` |
| `--text-primary` | `#1a1a2e` | `#e4e4f0` |
| `--text-secondary` | `#4a4a6a` | `#a0a0bf` |
| `--text-muted` | `#8888a4` | `#6a6a88` |
| `--border` | `#e2e4ef` | `#2a2a44` |
| `--accent` | `#6366f1` | `#818cf8` |
| `--accent-hover` | `#4f46e5` | `#a5b4fc` |
| `--success` | `#10b981` | `#34d399` |
| `--warning` | `#f59e0b` | `#fbbf24` |
| `--error` | `#ef4444` | `#f87171` |

Theme is applied via `data-theme` attribute on `<html>` element.

---

### Responsive Breakpoints

**File:** `css/responsive.css` — 313 lines

```css
/* Tablet (≤ 1024px) */
@media (max-width: 1024px) {
  /* Narrower sidebar (260px), reduced padding */
}

/* Mobile (≤ 768px) */
@media (max-width: 768px) {
  /* Sidebar → off-canvas hamburger menu */
  /* Top bar visible, single-column grids */
  /* Lecture nav → vertical stack */
}

/* Small Mobile (≤ 480px) */
@media (max-width: 480px) {
  /* Base font: 14px, 44px min tap targets */
  /* iOS zoom prevention (16px input font) */
  /* Compact code blocks, full-width buttons */
}
```

---

### Additional CSS Files

| File | Lines | Purpose |
|------|-------|---------|
| `code.css` | - | Code block styling, syntax highlighting colors, header bar |
| `live-editor.css` | - | Editor panels, tabs, preview iframe, console output |
| `text-to-speech.css` | - | TTS floating panel, player controls, progress display |

---

## ⚙️ Configuration & Settings

### LocalStorage Keys Reference

```javascript
// Theme preference
localStorage.getItem('iwt-theme')              // 'light' | 'dark'

// Sidebar collapsed state
localStorage.getItem('iwt-sidebar-collapsed')  // 'true' | 'false'

// Lecture progress (per section)
localStorage.getItem('iwt-progress')            // JSON: {"html-intro": true, "css-selectors": true, ...}

// Practicals progress (per practical)
localStorage.getItem('iwt-practicals-progress') // JSON: {"practical-1": true, ...}

// TTS preferences
localStorage.getItem('iwt-tts-speed')           // Number: 0.5 – 2.0
localStorage.getItem('iwt-tts-voice')           // Number: voice index
```

### Feature Toggles

To disable any feature, comment out the corresponding `<script>` tag in HTML:

```html
<!-- Disable TTS -->
<!-- <script src="js/text-to-speech.js"></script> -->
<!-- <link rel="stylesheet" href="css/text-to-speech.css"> -->

<!-- Disable Live Editor -->
<!-- <script src="js/live-editor.js"></script> -->
<!-- <link rel="stylesheet" href="css/live-editor.css"> -->

<!-- Disable Code Runner -->
<!-- <script src="js/code-runner.js"></script> -->

<!-- Disable Progress Tracking -->
<!-- <script src="js/progress.js"></script> -->
```

### Script Load Order

All scripts use `defer` attribute or `DOMContentLoaded` listener. Recommended order:

```html
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/theme.css">
<link rel="stylesheet" href="css/code.css">
<link rel="stylesheet" href="css/responsive.css">
<link rel="stylesheet" href="css/live-editor.css">
<link rel="stylesheet" href="css/text-to-speech.css">

<script src="js/app.js" defer></script>
<script src="js/theme.js" defer></script>
<script src="js/search.js" defer></script>
<script src="js/progress.js" defer></script>
<script src="js/code-copy.js" defer></script>
<script src="js/code-runner.js" defer></script>
<script src="js/live-editor.js" defer></script>
<script src="js/text-to-speech.js" defer></script>
```

---

## 🌐 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge | IE11 |
|---------|--------|---------|--------|------|------|
| Core Site | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Theme Toggle | ✅ | ✅ | ✅ | ✅ | ✅ |
| Code Copy | ✅ | ✅ | ✅ | ✅ | ❌ |
| Code Runner | ✅ | ✅ | ✅ | ✅ | ❌ |
| Live Editor | ✅ | ✅ | ✅ | ✅ | ❌ |
| Text-to-Speech | ✅ | ✅ | ✅ | ✅ | ❌ |
| LocalStorage | ✅ | ✅ | ✅ | ✅ | ✅ |
| CSS Variables | ✅ | ✅ | ✅ | ✅ | ❌ |

**Notes:**
- **IE11:** Basic functionality only — CSS variables, ES6 classes, and modern APIs are unsupported
- **Safari:** TTS voices may be limited; requires user gesture to start speech
- **Mobile browsers:** Fully supported (iOS Safari, Chrome Android)
- **Minimum recommended:** Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

---

## ⚡ Performance Optimization

### Current Optimizations:

1. **Deferred JavaScript Loading**
   ```html
   <script src="js/app.js" defer></script>
   ```
   All JS files use `defer` to avoid blocking HTML parsing.

2. **Font Display Swap**
   ```css
   @import url('...&display=swap');
   ```
   Fonts use `display=swap` to show fallback text immediately.

3. **Debouncing**
   - Live editor preview: **300ms** debounce
   - Search input: filters on 2+ characters to reduce computation

4. **Minimal Dependencies**
   - Zero external JS libraries in production
   - Only Google Fonts as an external resource

5. **Local Storage Caching**
   - Theme preference loads before paint via `DOMContentLoaded`
   - Progress data persists without network requests

6. **CSS Transitions (not animations)**
   - Theme switching uses 0.3s transitions for smooth visual change
   - Card hover effects use `translateY` for GPU-accelerated transforms

### Performance Metrics (Target):
| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1s |
| Time to Interactive | < 2s |
| Total Page Size | < 500KB |
| Lighthouse Score | > 90 |

---

## 🐛 Troubleshooting

### Common Issues:

#### 1. TTS Not Working
**Problem:** Text-to-speech button doesn't play audio  
**Solutions:**
- Check browser compatibility — Safari requires a user click gesture first
- Ensure the page is served over **HTTPS** (some browsers block TTS on HTTP)
- Try selecting a different voice from the dropdown
- Check if `speechSynthesis` is available: run `'speechSynthesis' in window` in console
- Check console for JavaScript errors

#### 2. Code Runner Shows Blank Output
**Problem:** Run button works but output panel is empty  
**Solutions:**
- Verify the code block has a language label in its header (e.g., "HTML", "CSS", "JavaScript")
- Check that the iframe sandbox isn't blocking content
- Open browser DevTools console for JS errors
- Test with a simple snippet: `<h1>Hello</h1>`
- For PHP code: a notice will appear instead (PHP requires a server)

#### 3. Progress Not Saving
**Problem:** Completed lecture checkmarks reset on page refresh  
**Solutions:**
- Verify localStorage is enabled (not in Incognito/Private mode)
- Check localStorage quota (typically 5–10MB)
- Run `localStorage.getItem('iwt-progress')` in console to inspect data
- Clear localStorage and re-check: `localStorage.removeItem('iwt-progress')`

#### 4. Search Not Finding Results
**Problem:** Typing in search returns "No results found"  
**Solutions:**
- Search requires **at least 2 characters**
- The search index is pre-built in `search.js` — it only searches topic titles, not full page content
- Verify `search.js` is loaded (check Network tab)
- Check that `#search-input` and `#search-results` elements exist in the sidebar

#### 5. Theme Toggle Not Working
**Problem:** Clicking the theme button doesn't change colors  
**Solutions:**
- Check if `theme.js` is loaded (check Network tab)
- Verify `theme.css` defines both `[data-theme="light"]` and `[data-theme="dark"]` rules
- Inspect `<html>` element — it should have a `data-theme` attribute
- Check console for errors
- Try: `document.documentElement.setAttribute('data-theme', 'dark')` in console

#### 6. Live Editor Not Updating Preview
**Problem:** Typing code doesn't update the preview panel  
**Solutions:**
- Preview updates are debounced (300ms delay) — wait a moment after typing
- Check if `live-editor.js` is loaded
- Verify the editor container has class `.live-editor-container`
- Check browser console for iframe-related errors

#### 7. Mobile Menu Not Opening
**Problem:** Hamburger menu doesn't toggle the sidebar  
**Solutions:**
- Check that `app.js` is loaded
- Verify `#hamburger-btn` and `#sidebar` IDs exist in HTML
- Check if `#sidebar-overlay` element exists
- The menu only appears at ≤768px viewport width

#### 8. Sidebar Toggle Not Working (Desktop)
**Problem:** Clicking the toggle button doesn't hide/show the sidebar  
**Solutions:**
- Check that `app.js` is loaded
- Verify `#sidebar-toggle-btn` element exists in the HTML
- The toggle button only appears at >768px viewport width
- Clear localStorage: `localStorage.removeItem('iwt-sidebar-collapsed')`
- Check console for JS errors

---

## 🚀 Future Enhancements

### Planned Features:

| Phase | Feature | Description |
|-------|---------|-------------|
| **Phase 2** | Video Lectures | Embed YouTube/Vimeo with progress tracking |
| **Phase 2** | Quizzes | Multiple choice with auto-grading and score tracking |
| **Phase 2** | PWA Support | Offline access, installable, service worker caching |
| **Phase 2** | Code Challenges | Coding problems with automated testing & leaderboard |
| **Phase 3** | User Accounts | Backend integration (Node.js/PHP), cloud sync, dashboards |
| **Phase 3** | AI Chatbot | Student Q&A and code debugging via AI (OpenAI/Gemini API) |

---

## 📞 Support & Maintenance

### How to Add New Lectures:

1. Create a new HTML file in `lectures/` (e.g., `lectures/js-lecture1.html`)
2. Copy the structure from an existing lecture page (e.g., `css-lecture1.html`)
3. Update the lecture title, content, and sidebar navigation links
4. Ensure all CSS and JS files are linked in the `<head>` and before `</body>`
5. Add the new lecture to the corresponding topic page's card grid
6. Test all features: code copy, code runner, TTS, progress checkboxes
7. Test responsive layout at 1024px, 768px, and 480px breakpoints

### How to Update Styles:

1. Edit `css/style.css` for global changes (use CSS variables for consistency)
2. Edit `css/theme.css` to adjust light/dark theme colors
3. Edit `css/responsive.css` for breakpoint-specific changes
4. Always test **both** light and dark themes after changes
5. Check all three responsive breakpoints

### How to Add New Features:

1. Create a new JS file in `js/` folder
2. Follow the modular pattern: either function-based or class-based
3. Use `DOMContentLoaded` listener for initialization
4. Add the `<script>` tag to all relevant HTML pages
5. If the feature has styling, create a corresponding CSS file in `css/`
6. Document the new feature in this file
7. Test across Chrome, Firefox, Safari, and Edge

---

## 📄 License

This project is for educational purposes.

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| **v1.0** | Feb 2025 | Initial release — core lecture pages, theme toggle, progress tracking |
| **v1.1** | Feb 2025 | Enhanced features — live code runner, code copy buttons, search, live editor, text-to-speech, mobile optimizations, practicals page |
| **v1.2** | Mar 2026 | Sidebar toggle — hide/show navigation bar on desktop with localStorage persistence |

---

**Last Updated:** March 1, 2026  
**Maintained By:** Sandhanu Dulmeth  
**Repository:** IWT-NOTE-SITE
