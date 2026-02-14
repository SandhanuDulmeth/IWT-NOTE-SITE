/* =============================================
   IWT NOTE SITE — Copy Button for Code Blocks
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initCodeCopy();
});

function initCodeCopy() {
    document.querySelectorAll('.code-block').forEach(block => {
        const copyBtn = block.querySelector('.copy-btn');
        const codeEl = block.querySelector('code');

        if (!copyBtn || !codeEl) return;

        copyBtn.addEventListener('click', async () => {
            const text = codeEl.textContent;

            try {
                await navigator.clipboard.writeText(text);
                showCopied(copyBtn);
            } catch {
                // Fallback for older browsers
                fallbackCopy(text);
                showCopied(copyBtn);
            }
        });
    });
}

function showCopied(btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '✓ Copied!';
    btn.classList.add('copied');

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('copied');
    }, 2000);
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
