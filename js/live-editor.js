/* =============================================
   IWT NOTE SITE — Live Code Editor
   Supports multiple editor instances per page.
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initializeLiveEditors();
});

/* ---------- Initialize All Editors on Page ---------- */
function initializeLiveEditors() {
    const editors = document.querySelectorAll('.live-editor-container');
    editors.forEach((container, index) => {
        new LiveEditor(container, index);
    });
}

/* ---------- LiveEditor Class ---------- */
class LiveEditor {
    constructor(container, index) {
        this.container = container;
        this.index = index;

        // Query elements within this container
        this.htmlEditor = container.querySelector('.editor-html');
        this.cssEditor = container.querySelector('.editor-css');
        this.jsEditor = container.querySelector('.editor-js');
        this.preview = container.querySelector('.preview-frame');
        this.tabs = container.querySelectorAll('.editor-tab');
        this.resetBtn = container.querySelector('.reset-btn');
        this.fullscreenBtn = container.querySelector('.fullscreen-btn');
        this.refreshBtn = container.querySelector('.refresh-btn');
        this.consolebody = container.querySelector('.editor-console-body');
        this.consoleSection = container.querySelector('.editor-console');

        if (!this.htmlEditor || !this.preview) return;

        // Wrap editors and initialize line numbers
        this.wrappers = {
            html: this.wrapEditor(this.htmlEditor),
            css: this.wrapEditor(this.cssEditor),
            js: this.wrapEditor(this.jsEditor)
        };

        // Store original code for reset
        this.originalCode = {
            html: this.htmlEditor.value,
            css: this.cssEditor ? this.cssEditor.value : '',
            js: this.jsEditor ? this.jsEditor.value : ''
        };

        this.debounceTimer = null;

        this.bindEvents();
        this.updatePreview();
    }

    /* ---------- Wrap Editor with Line Numbers ---------- */
    wrapEditor(editor) {
        if (!editor) return null;

        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';

        // Handle visibility state from editor
        if (editor.classList.contains('hidden')) {
            wrapper.classList.add('hidden');
            editor.classList.remove('hidden');
        }

        const lineNumbers = document.createElement('div');
        lineNumbers.className = 'line-numbers';

        editor.parentNode.insertBefore(wrapper, editor);
        wrapper.appendChild(lineNumbers);
        wrapper.appendChild(editor);

        // Initial update
        this.updateLineNumbers(editor, lineNumbers);

        // Bind specific events for line numbers
        editor.addEventListener('input', () => this.updateLineNumbers(editor, lineNumbers));
        editor.addEventListener('scroll', () => { lineNumbers.scrollTop = editor.scrollTop; });

        return wrapper;
    }

    updateLineNumbers(editor, lineNumbers) {
        const lines = editor.value.split('\n').length;
        lineNumbers.innerHTML = Array(lines).fill(0).map((_, i) => i + 1).join('<br>');
    }

    /* ---------- Event Bindings ---------- */
    bindEvents() {
        // Live preview on input
        const allEditors = [this.htmlEditor, this.cssEditor, this.jsEditor].filter(Boolean);
        allEditors.forEach(editor => {
            editor.addEventListener('input', () => this.debouncedUpdate());
        });

        // Tab switching
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });

        // Reset
        this.resetBtn?.addEventListener('click', () => this.reset());

        // Fullscreen
        this.fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());

        // Refresh
        this.refreshBtn?.addEventListener('click', () => this.updatePreview());

        // Tab key support (insert 2 spaces)
        allEditors.forEach(editor => {
            editor.addEventListener('keydown', (e) => this.handleKeydown(e, editor));
        });

        // Escape to exit fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.container.classList.contains('fullscreen')) {
                this.container.classList.remove('fullscreen');
            }
        });
    }

    /* ---------- Debounced Preview Update ---------- */
    debouncedUpdate() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.updatePreview(), 300);
    }

    /* ---------- Update Preview ---------- */
    updatePreview() {
        const html = this.htmlEditor.value;
        const css = this.cssEditor ? this.cssEditor.value : '';
        const js = this.jsEditor ? this.jsEditor.value : '';

        // Clear console
        if (this.consolebody) {
            this.consolebody.innerHTML = '';
        }

        // Build full document
        // We intercept console.log/warn/error from the iframe and post messages back
        const consoleCapture = `
<script>
(function() {
  var _origLog   = console.log;
  var _origWarn  = console.warn;
  var _origError = console.error;

  function send(type, args) {
    try {
      parent.postMessage({
        type: 'live-editor-console',
        editorIndex: ${this.index},
        level: type,
        message: Array.from(args).map(function(a) {
          return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a);
        }).join(' ')
      }, '*');
    } catch(e) {}
  }

  console.log   = function() { send('log',   arguments); _origLog.apply(console, arguments); };
  console.warn  = function() { send('warn',  arguments); _origWarn.apply(console, arguments); };
  console.error = function() { send('error', arguments); _origError.apply(console, arguments); };

  window.onerror = function(msg, src, line) {
    send('error', ['Error: ' + msg + ' (line ' + line + ')']);
  };
})();
<\/script>`;

        const fullCode = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>${css}</style>
</head>
<body>
${html}
${consoleCapture}
<script>${js}<\/script>
</body>
</html>`;

        this.preview.srcdoc = fullCode;

        // Show console section if JS is present
        if (this.consoleSection) {
            this.consoleSection.style.display = js.trim() ? 'block' : 'none';
        }
    }

    /* ---------- Tab Switching ---------- */
    switchTab(tab) {
        const lang = tab.dataset.lang;

        // Update tab active state
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Show/hide wrappers
        Object.entries(this.wrappers).forEach(([key, wrapper]) => {
            if (!wrapper) return;
            if (key === lang) {
                wrapper.classList.remove('hidden');
            } else {
                wrapper.classList.add('hidden');
            }
        });
    }

    /* ---------- Reset to Original Code ---------- */
    reset() {
        this.htmlEditor.value = this.originalCode.html;
        if (this.cssEditor) this.cssEditor.value = this.originalCode.css;
        if (this.jsEditor) this.jsEditor.value = this.originalCode.js;

        // Update all line numbers
        Object.values(this.wrappers).forEach(wrapper => {
            if (wrapper) {
                const editor = wrapper.querySelector('.code-editor');
                const lineNumbers = wrapper.querySelector('.line-numbers');
                this.updateLineNumbers(editor, lineNumbers);
            }
        });

        this.updatePreview();
    }

    /* ---------- Fullscreen Toggle ---------- */
    toggleFullscreen() {
        this.container.classList.toggle('fullscreen');
    }

    /* ---------- Tab Key → Insert Spaces ---------- */
    handleKeydown(e, editor) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 2;

            // Trigger input for line numbers & preview
            editor.dispatchEvent(new Event('input'));
        }
    }
}

/* ---------- Console Message Listener ---------- */
window.addEventListener('message', (e) => {
    if (!e.data || e.data.type !== 'live-editor-console') return;

    const containers = document.querySelectorAll('.live-editor-container');
    const container = containers[e.data.editorIndex];
    if (!container) return;

    const body = container.querySelector('.editor-console-body');
    if (!body) return;

    const line = document.createElement('div');
    line.className = 'log-line';
    if (e.data.level === 'error') line.classList.add('log-error');
    if (e.data.level === 'warn') line.classList.add('log-warn');
    line.textContent = `[${e.data.level}] ${e.data.message}`;
    body.appendChild(line);

    // Auto-scroll
    body.scrollTop = body.scrollHeight;
});
