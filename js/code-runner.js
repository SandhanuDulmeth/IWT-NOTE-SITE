/* =============================================
   IWT NOTE SITE — Live Code Runner / Preview
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initCodeRunner();
});

function initCodeRunner() {
    document.querySelectorAll('.code-block').forEach(block => {
        const codeEl = block.querySelector('code');
        const header = block.querySelector('.code-header');
        const labelEl = block.querySelector('.code-lang-label');

        if (!codeEl || !header || !labelEl) return;

        const lang = detectLanguage(labelEl.textContent.trim().toLowerCase());
        if (!lang) return; // unrecognized language — no run button

        // Create Run button
        const runBtn = document.createElement('button');
        runBtn.className = 'run-btn';
        runBtn.innerHTML = '▶ Run';
        runBtn.title = lang === 'php' ? 'Show PHP notice' : 'Run code';

        // Insert run button before copy button (or append if no copy btn)
        const copyBtn = header.querySelector('.copy-btn');
        if (copyBtn) {
            header.insertBefore(runBtn, copyBtn);
        } else {
            header.appendChild(runBtn);
        }

        // Create output panel (initially hidden)
        const outputPanel = createOutputPanel();
        block.appendChild(outputPanel);

        // Run button click handler
        runBtn.addEventListener('click', () => {
            executeCode(lang, codeEl, outputPanel);
        });
    });
}

/**
 * Detect language from the free-form label text.
 * Returns: 'html', 'css', 'js', 'php', or null
 */
function detectLanguage(label) {
    // "html + css" or "html" → treat as HTML (iframe handles embedded styles)
    if (label.includes('html')) return 'html';
    // Exclude preprocessor labels — scss/sass/less/stylus are NOT runnable CSS
    if (label.includes('scss') || label.includes('sass') ||
        label.includes('less') || label.includes('stylus')) return null;
    // Pure CSS (no "html" in label, not a preprocessor)
    if (label.includes('css')) return 'css';
    // JavaScript
    if (label.includes('javascript') || label.includes('js')) return 'js';
    // PHP
    if (label.includes('php')) return 'php';
    // Unknown (e.g., "browser", "output")
    return null;
}

/**
 * Create the output panel DOM structure
 */
function createOutputPanel() {
    const panel = document.createElement('div');
    panel.className = 'output-panel';

    const panelHeader = document.createElement('div');
    panelHeader.className = 'output-header';

    const title = document.createElement('span');
    title.className = 'output-title';
    title.textContent = '📺 Output';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'output-close-btn';
    closeBtn.innerHTML = '✕ Close';
    closeBtn.addEventListener('click', () => {
        panel.classList.remove('active');
        // Clean up iframe to free resources
        const iframe = panel.querySelector('iframe');
        if (iframe) iframe.remove();
        const consoleDiv = panel.querySelector('.console-output');
        if (consoleDiv) consoleDiv.innerHTML = '';
        const notice = panel.querySelector('.php-notice');
        if (notice) notice.remove();
        const label = panel.querySelector('.output-label');
        if (label) label.remove();
    });

    panelHeader.appendChild(title);
    panelHeader.appendChild(closeBtn);
    panel.appendChild(panelHeader);

    // Content area for output
    const content = document.createElement('div');
    content.className = 'output-content';
    panel.appendChild(content);

    return panel;
}

/**
 * Route execution to the right handler
 */
function executeCode(lang, codeEl, outputPanel) {
    const code = codeEl.textContent;
    const content = outputPanel.querySelector('.output-content');

    // Clear previous output
    content.innerHTML = '';

    switch (lang) {
        case 'html':
            runHTML(code, content);
            break;
        case 'css':
            runCSS(code, content);
            break;
        case 'js':
            runJS(code, content);
            break;
        case 'php':
            showPHPNotice(content);
            break;
    }

    outputPanel.classList.add('active');
}

/**
 * HTML Runner — render in sandboxed iframe via srcdoc
 */
function runHTML(code, container) {
    const iframe = document.createElement('iframe');
    iframe.className = 'live-preview';
    iframe.sandbox = 'allow-scripts';
    iframe.srcdoc = code;
    container.appendChild(iframe);

    // Auto-resize iframe to content height
    iframe.addEventListener('load', () => {
        try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            const height = doc.documentElement.scrollHeight;
            iframe.style.height = Math.min(Math.max(height + 20, 100), 500) + 'px';
        } catch (e) {
            // Sandbox may block access — use default height
            iframe.style.height = '200px';
        }
    });
}

/**
 * Build a context-aware HTML template based on what the CSS targets.
 * Detects lecture-specific classes, flexbox, grid, positioning, and more
 * to provide matching HTML elements for meaningful CSS preview.
 */
function getSmartCSSTemplate(cssCode) {
    const code = cssCode.toLowerCase();

    // ── Core layout detections ──────────────────────────────────
    const hasFlexbox = code.includes('display: flex') || code.includes('display:flex');
    const hasGrid = code.includes('display: grid') || code.includes('display:grid');
    const hasTable = code.includes('table') || code.includes('td') || code.includes('th');
    const hasForm = code.includes('input') || code.includes('button') || code.includes('form');
    const hasList = code.includes('ul') || code.includes('li') || code.includes('ol');
    const hasImage = code.includes('img');

    // ── Lecture-specific class / structure detections ────────────
    const hasBoxClass = code.includes('.box');
    const hasWrapperClass = code.includes('.wrapper');
    const hasContainerClass = code.includes('.container');
    const hasPageLayout = code.includes('main') && code.includes('aside');
    const hasPosition = code.includes('position:') || code.includes('z-index');
    const hasOverflow = code.includes('overflow:');
    const hasBadgeClass = code.includes('.badge');
    const hasHover = code.includes(':hover');
    const hasCombinators = code.includes('div p') || code.includes('div > p')
        || code.includes('div + p') || code.includes('div ~ p');

    // Start building body content
    let bodyContent = '';

    // ── Page layout with main + aside (Lecture 3, example 6) ────
    if (hasPageLayout) {
        bodyContent += `
    <div class="page" style="margin-bottom:20px;">
      <main>
        <h2>Main Content Area</h2>
        <p>This is the main content section. It takes up most of the space.</p>
      </main>
      <aside>
        <h3>Sidebar</h3>
        <p>Sidebar content here.</p>
      </aside>
    </div>`;
    }

    // ── Flexbox wrapper class (Lecture 3, example 1) ────────────
    if (hasWrapperClass) {
        bodyContent += `
    <div class="wrapper" style="margin-bottom:20px;">
      <div style="padding:10px; background:#e3f2fd;">Item 1</div>
      <div style="padding:10px; background:#bbdefb;">Item 2</div>
      <div style="padding:10px; background:#90caf9;">Item 3</div>
      <div style="padding:10px; background:#64b5f6;">Item 4</div>
    </div>`;
    }

    // ── Flexbox / Grid with .container (Lecture 3, examples 2–5) ─
    if (hasContainerClass && (hasFlexbox || hasGrid)) {
        bodyContent += `
    <div class="container" style="margin-bottom:20px;">
      <div class="item" style="padding:15px; background:#e8f5e9;">Item 1</div>
      <div class="item" style="padding:15px; background:#c8e6c9;">Item 2</div>
      <div class="item" style="padding:15px; background:#a5d6a7;">Item 3</div>
      <div class="item" style="padding:15px; background:#81c784;">Item 4</div>
      <div class="item" style="padding:15px; background:#66bb6a;">Item 5</div>
    </div>`;
    } else if (hasFlexbox || hasGrid) {
        // Generic flex/grid container when no .container class
        bodyContent += `
    <div class="container" style="margin-bottom:20px;">
      <div class="item" style="padding:15px; background:#e8f5e9;">Item 1</div>
      <div class="item" style="padding:15px; background:#c8e6c9;">Item 2</div>
      <div class="item" style="padding:15px; background:#a5d6a7;">Item 3</div>
      <div class="item" style="padding:15px; background:#81c784;">Item 4</div>
      <div class="item" style="padding:15px; background:#66bb6a;">Item 5</div>
    </div>`;
    }

    // ── Media-query .box children (Lecture 3, example 8) ─────────
    if (hasBoxClass && (hasFlexbox || hasGrid || hasContainerClass)) {
        bodyContent += `
    <div class="container" style="margin-bottom:20px;">
      <div class="box" style="padding:15px; background:#fff3e0;">Box 1 — Sample Content</div>
      <div class="box" style="padding:15px; background:#ffe0b2;">Box 2 — Another Box</div>
      <div class="box" style="padding:15px; background:#ffcc80;">Box 3 — Third Box</div>
    </div>`;
    } else if (hasBoxClass) {
        // Standalone .box elements (Lecture 4, spacing examples)
        bodyContent += `
    <div class="box" style="background:#e0e0e0; margin-bottom:10px;">Box 1 — Sample Content</div>
    <div class="box" style="background:#bdbdbd; margin-bottom:10px;">Box 2 — Another Box</div>
    <div class="box" style="background:#9e9e9e; margin-bottom:10px;">Box 3 — Third Box</div>`;
    }

    // ── Position / z-index / badge (Lecture 4, examples 12–13) ──
    if (hasPosition || hasBadgeClass) {
        bodyContent += `
    <div style="position:relative; width:220px; height:160px; background:#e0e0e0; margin:20px 0; border:1px solid #999;">
      <span class="badge" style="background:#f44336; color:#fff; padding:4px 8px; font-size:0.8rem;">Badge</span>
      <div class="box1" style="width:100px; height:80px; background:lightblue; display:flex; align-items:center; justify-content:center;">Box 1</div>
      <div class="box2" style="width:100px; height:80px; background:lightcoral; display:flex; align-items:center; justify-content:center;">Box 2</div>
    </div>`;
    }

    // ── Overflow example (Lecture 4, example 14) ────────────────
    if (hasOverflow) {
        bodyContent += `
    <div class="box" style="width:200px; height:100px; background:#f0f0f0; border:2px solid #333; margin:15px 0; padding:10px;">
      This is a very long text that will overflow the container.
      It has more content than the box can display at once.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </div>`;
    }

    // ── Hover / link effects (Lecture 4, example 15) ────────────
    if (hasHover) {
        bodyContent += `
    <p style="margin:15px 0 5px;">Hover over these links to see effects:</p>
    <a href="#" style="margin-right:10px;">Link One</a>
    <a href="#" style="margin-right:10px;">Link Two</a>
    <a href="#">Link Three</a>`;
    }

    // ── Nested divs for CSS combinators (Lecture 1, example 2) ──
    if (hasCombinators) {
        bodyContent += `
    <div style="border:2px dashed #999; padding:15px; margin:15px 0; background:#fafafa;">
      <p>Direct child paragraph (div &gt; p)</p>
      <div style="padding:10px; background:#f0f0f0; margin:5px 0;">
        <p>Nested paragraph — descendant (div p)</p>
      </div>
    </div>
    <p>Adjacent sibling paragraph (div + p)</p>
    <p>General sibling paragraph (div ~ p)</p>`;
    }

    // ── Table (if detected) ─────────────────────────────────────
    if (hasTable) {
        bodyContent += `
    <table style="border-collapse:collapse; margin:20px 0; width:100%;">
      <thead>
        <tr><th style="padding:8px; border:1px solid #ccc;">Header 1</th><th style="padding:8px; border:1px solid #ccc;">Header 2</th><th style="padding:8px; border:1px solid #ccc;">Header 3</th></tr>
      </thead>
      <tbody>
        <tr><td style="padding:8px; border:1px solid #ccc;">Data 1</td><td style="padding:8px; border:1px solid #ccc;">Data 2</td><td style="padding:8px; border:1px solid #ccc;">Data 3</td></tr>
        <tr><td style="padding:8px; border:1px solid #ccc;">Data 4</td><td style="padding:8px; border:1px solid #ccc;">Data 5</td><td style="padding:8px; border:1px solid #ccc;">Data 6</td></tr>
      </tbody>
    </table>`;
    }

    // ── Forms / attribute selectors (Lecture 2, example 2) ───────
    if (hasForm) {
        bodyContent += `
    <form style="margin:20px 0;">
      <input type="text" placeholder="Text input" style="display:block; margin:5px 0; padding:6px;">
      <input type="email" placeholder="Email input" style="display:block; margin:5px 0; padding:6px;">
      <input type="password" placeholder="Password" style="display:block; margin:5px 0; padding:6px;">
      <button type="button" class="btn" style="margin-top:8px; padding:8px 16px;">Submit Button</button>
    </form>`;
    }

    // ── Lists ───────────────────────────────────────────────────
    if (hasList) {
        bodyContent += `
    <ul style="margin:15px 0 15px 20px;">
      <li>List item one</li>
      <li>List item two</li>
      <li>List item three</li>
    </ul>`;
    }

    // ── Responsive images (Lecture 3, example 7) ────────────────
    if (hasImage) {
        bodyContent += `
    <img src="https://via.placeholder.com/300x200/4fc3f7/ffffff?text=Sample+Image" alt="Sample image" style="display:block; margin:10px 0;">`;
    }

    // ── Always include base elements for general CSS ────────────
    bodyContent += `
    <h1 id="main-title">Heading 1</h1>
    <h2>Heading 2</h2>
    <p class="intro">This is an introductory paragraph with some sample text for styling.</p>
    <p>Another paragraph with <span class="highlight">highlighted text</span> and <a href="https://example.com">a link</a>.</p>
    <div style="margin:15px 0;">
      <span>Regular span</span>
      <span class="highlight" style="margin-left:8px;">Highlighted span</span>
    </div>
    <button style="margin:10px 5px 10px 0;">Button 1</button>
    <button class="btn">Button 2</button>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Reset for consistency */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #fff;
    }
    /* User CSS below */
    ${cssCode}
  </style>
</head>
<body>
  <div class="demo-container">${bodyContent}
  </div>
</body>
</html>`;
}

/**
 * CSS Runner — wrap CSS in a smart HTML template to visualize
 */
function runCSS(code, container) {
    const smartTemplate = getSmartCSSTemplate(code);

    // Add informational label
    const label = document.createElement('div');
    label.className = 'output-label';
    label.textContent = '💡 Preview with matching HTML elements';
    container.appendChild(label);

    // Create iframe with the smart template
    const iframe = document.createElement('iframe');
    iframe.className = 'live-preview css-preview';
    iframe.sandbox = 'allow-same-origin';
    iframe.srcdoc = smartTemplate;
    container.appendChild(iframe);

    iframe.addEventListener('load', () => {
        try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            const height = doc.documentElement.scrollHeight;
            iframe.style.height = Math.min(Math.max(height + 20, 200), 600) + 'px';
        } catch (e) {
            iframe.style.height = '400px';
        }
    });
}

/**
 * JavaScript Runner — execute in sandboxed iframe, capture console output
 */
function runJS(code, container) {
    // Create console output div
    const consoleDiv = document.createElement('div');
    consoleDiv.className = 'console-output';
    container.appendChild(consoleDiv);

    // Listen for messages from the iframe
    const messageHandler = (event) => {
        if (!event.data || event.data.type !== 'console') return;

        const line = document.createElement('div');
        line.className = 'console-line ' + (event.data.level || 'log');

        const prefix = document.createElement('span');
        prefix.className = 'console-prefix';
        prefix.textContent = `[${event.data.level}]`;

        const text = document.createElement('span');
        text.className = 'console-text';
        text.textContent = event.data.args.map(arg => {
            if (typeof arg === 'object') {
                try { return JSON.stringify(arg, null, 2); }
                catch { return String(arg); }
            }
            return String(arg);
        }).join(' ');

        line.appendChild(prefix);
        line.appendChild(text);
        consoleDiv.appendChild(line);

        // Auto-scroll to latest output
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    };

    window.addEventListener('message', messageHandler);

    // Build iframe with overridden console methods
    const iframeCode = `<!DOCTYPE html>
<html><head><script>
(function() {
    const originalConsole = window.console;
    function send(level, args) {
        try {
            const serialized = Array.from(args).map(function(a) {
                if (a === null) return 'null';
                if (a === undefined) return 'undefined';
                if (typeof a === 'object') {
                    try { return JSON.parse(JSON.stringify(a)); }
                    catch(e) { return String(a); }
                }
                return a;
            });
            parent.postMessage({ type: 'console', level: level, args: serialized }, '*');
        } catch(e) {
            parent.postMessage({ type: 'console', level: 'error', args: ['[Serialization error]'] }, '*');
        }
    }
    window.console = {
        log: function() { send('log', arguments); },
        warn: function() { send('warn', arguments); },
        error: function() { send('error', arguments); },
        info: function() { send('info', arguments); },
        clear: function() { send('clear', []); }
    };
    window.onerror = function(msg, url, line, col, err) {
        parent.postMessage({
            type: 'console',
            level: 'error',
            args: ['Runtime Error: ' + msg + (line ? ' (line ' + line + ')' : '')]
        }, '*');
    };
})();
<\/script></head><body><script>
try {
    ${escapeScriptContent(code)}
} catch(e) {
    console.error('Error: ' + e.message);
}
<\/script></body></html>`;

    const iframe = document.createElement('iframe');
    iframe.className = 'js-sandbox';
    iframe.sandbox = 'allow-scripts';
    iframe.style.display = 'none';
    iframe.srcdoc = iframeCode;
    container.appendChild(iframe);

    // Show "no output" if nothing logged after a short delay
    setTimeout(() => {
        if (consoleDiv.children.length === 0) {
            const emptyLine = document.createElement('div');
            emptyLine.className = 'console-line info';
            emptyLine.innerHTML = '<span class="console-prefix">[info]</span> <span class="console-text">Code executed — no console output.</span>';
            consoleDiv.appendChild(emptyLine);
        }
    }, 1000);

    // Clean up message listener after 10 seconds
    setTimeout(() => {
        window.removeEventListener('message', messageHandler);
    }, 10000);
}

/**
 * Escape closing script tags inside user code to prevent breaking the iframe srcdoc
 */
function escapeScriptContent(code) {
    return code.replace(/<\/script>/gi, '<\\/script>');
}

/**
 * PHP Notice — inform user that PHP requires a server
 */
function showPHPNotice(container) {
    const notice = document.createElement('div');
    notice.className = 'php-notice';
    notice.innerHTML = `
        <div class="php-notice-icon">⚠️</div>
        <div class="php-notice-body">
            <strong>PHP requires a server environment</strong>
            <p>PHP code cannot run in the browser. To execute this code, you need a local server like <strong>XAMPP</strong>, <strong>WAMP</strong>, or <strong>MAMP</strong>.</p>
            <div class="php-notice-steps">
                <p><strong>Quick steps:</strong></p>
                <ol>
                    <li>Install XAMPP from <code>apachefriends.org</code></li>
                    <li>Save this code as a <code>.php</code> file in the <code>htdocs</code> folder</li>
                    <li>Start Apache from the XAMPP Control Panel</li>
                    <li>Open <code>localhost/yourfile.php</code> in a browser</li>
                </ol>
            </div>
        </div>
    `;
    container.appendChild(notice);
}
