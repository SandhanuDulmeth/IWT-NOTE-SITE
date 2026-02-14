# IWT Note Site — Web Development Course

A comprehensive educational website for learning web development, covering **HTML**, **CSS**, **JavaScript**, and **PHP** with lecture notes, code examples, and practice exercises.

## 🚀 Quick Start

1. Open `index.html` in your browser (Chrome, Firefox, or Edge recommended)
2. No server or build tools required — it's all vanilla HTML/CSS/JS
3. PHP topic page contains notes only; actual PHP code requires a server (XAMPP/WAMP)

## 📁 Project Structure

```
IWT NOTE SITE/
├── index.html          ← Home page with course overview
├── html.html           ← HTML topic (7 sections)
├── css.html            ← CSS topic (7 sections)
├── javascript.html     ← JavaScript topic (7 sections)
├── php.html            ← PHP topic (7 sections)
├── README.md           ← This file
├── css/
│   ├── style.css       ← Main design system
│   ├── theme.css       ← Dark/light theme variables
│   ├── code.css        ← Code block & syntax styles
│   └── responsive.css  ← Mobile breakpoints
├── js/
│   ├── app.js          ← Mobile menu, active nav
│   ├── theme.js        ← Theme toggle + localStorage
│   ├── search.js       ← Client-side search
│   ├── progress.js     ← Progress tracking
│   └── code-copy.js    ← Copy code button
└── images/
    └── favicon.svg     ← Site favicon
```

## ✏️ How to Add New Lecture Notes

Each topic page has **7 sections**. To add or modify notes, edit the corresponding `.html` file.

### Adding content to an existing section

Find the `<div class="notes-block">` inside the section and add your notes:

```html
<div class="notes-block">
  <h4>📝 Lecture Notes</h4>
  <ul>
    <li>Your new note here</li>
    <li>Another point with <strong>bold</strong> and <code>code</code></li>
  </ul>
</div>
```

### Adding a new code example

Use this template inside any section:

```html
<div class="code-block">
  <div class="code-header">
    <div class="code-lang">
      <div class="dots"><span></span><span></span><span></span></div>
      <span class="code-lang-label">html</span>  <!-- Change to: css, javascript, php -->
    </div>
    <button class="copy-btn">📋 Copy</button>
  </div>
  <pre><code><!-- Your code here. Use span classes for syntax highlighting:
    .tag    = HTML tags (red-pink)
    .attr   = Attributes (blue)
    .val    = Attribute values (green)
    .str    = Strings (green)
    .kw     = Keywords (purple)
    .fn     = Functions (cyan)
    .cmt    = Comments (grey)
    .num    = Numbers (orange)
    .sel    = CSS selectors (yellow)
    .css-prop = CSS properties (blue)
    .css-val  = CSS values (green)
    .php-var  = PHP variables (purple)
  --></code></pre>
</div>
```

### Adding a new section

1. Add the section HTML inside the `<div class="content-area">`:

```html
<section class="content-section" id="topic-newsection">
  <div class="section-header">
    <h2><span class="section-number">08</span> New Section Title</h2>
    <label class="completion-toggle">
      <input type="checkbox" data-section="topic-newsection">
      <span class="check-box">✓</span>
      <span class="check-label">Done</span>
    </label>
  </div>
  <!-- Add notes-block, code-block, exercise-block here -->
</section>
```

2. Add the section ID to the sidebar "On this page" navigation
3. Add the section ID to `js/search.js` in the `SEARCH_INDEX` array
4. Add the section ID to `js/progress.js` in the `TOPIC_SECTIONS` object

## 🎨 Adding a New Topic

1. Create a new `.html` file (copy an existing topic page as template)
2. Add a nav link in the sidebar of **every** page
3. Add a topic card on `index.html`
4. Add the topic color to `css/style.css` (follow the existing pattern)
5. Add sections to `SEARCH_INDEX` in `js/search.js`
6. Add sections to `TOPIC_SECTIONS` in `js/progress.js`

## ⚙️ Features

| Feature | Description |
|---------|-------------|
| 🌙 Dark/Light Theme | Toggle in sidebar or top bar; persists via localStorage |
| 🔍 Search | Real-time search across all topics and sections |
| ✅ Progress Tracking | Mark sections as completed; progress persists via localStorage |
| 📋 Code Copy | One-click copy for all code blocks |
| 📱 Responsive | Works on desktop, tablet, and mobile |
| 🎨 Color-coded Topics | HTML=orange, CSS=blue, JS=yellow, PHP=purple |

## 🧹 Reset Progress

Open your browser's developer console and run:
```js
localStorage.removeItem('iwt-progress');
location.reload();
```
