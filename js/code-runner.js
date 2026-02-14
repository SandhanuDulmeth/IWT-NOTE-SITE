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
    // Pure CSS (no "html" in label)
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
 * CSS Runner — wrap CSS in a sample HTML template to visualize
 */
function runCSS(code, container) {
    const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            margin: 0;
        }
        /* User CSS below */
        ${code}
    </style>
</head>
<body>
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <p>This is a paragraph with some <strong>bold text</strong>, <em>italic text</em>, and a <a href="#">hyperlink</a>.</p>
    <ul>
        <li>Unordered list item 1</li>
        <li>Unordered list item 2</li>
        <li>Unordered list item 3</li>
    </ul>
    <ol>
        <li>Ordered list item 1</li>
        <li>Ordered list item 2</li>
    </ol>
    <div class="box" style="margin: 10px 0;">
        <p>A &lt;div&gt; element with class "box"</p>
    </div>
    <table border="1" cellpadding="8" cellspacing="0">
        <tr><th>Header 1</th><th>Header 2</th></tr>
        <tr><td>Cell 1</td><td>Cell 2</td></tr>
        <tr><td>Cell 3</td><td>Cell 4</td></tr>
    </table>
    <br>
    <button>Button Element</button>
    <input type="text" placeholder="Input field" style="margin-left: 8px;">
</body>
</html>`;

    const iframe = document.createElement('iframe');
    iframe.className = 'live-preview';
    iframe.sandbox = 'allow-scripts';
    iframe.srcdoc = template;
    container.appendChild(iframe);

    iframe.addEventListener('load', () => {
        try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            const height = doc.documentElement.scrollHeight;
            iframe.style.height = Math.min(Math.max(height + 20, 100), 500) + 'px';
        } catch (e) {
            iframe.style.height = '300px';
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
