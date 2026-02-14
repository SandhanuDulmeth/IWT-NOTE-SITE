/* =============================================
   IWT NOTE SITE — Theme Toggle
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});

function initTheme() {
    const saved = localStorage.getItem('iwt-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');

    applyTheme(theme);

    // Sidebar toggle button
    const sidebarToggle = document.getElementById('theme-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleTheme);
    }

    // Top bar toggle button (mobile)
    const topBarToggle = document.getElementById('theme-toggle-mobile');
    if (topBarToggle) {
        topBarToggle.addEventListener('click', toggleTheme);
    }

    // Listen for OS theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('iwt-theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('iwt-theme', next);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeButtons(theme);
}

function updateThemeButtons(theme) {
    const icon = theme === 'dark' ? '☀️' : '🌙';
    const label = theme === 'dark' ? 'Light Mode' : 'Dark Mode';

    // Sidebar button
    const sidebarToggle = document.getElementById('theme-toggle');
    if (sidebarToggle) {
        sidebarToggle.innerHTML = `<span>${icon}</span> ${label}`;
    }

    // Mobile button
    const mobileToggle = document.getElementById('theme-toggle-mobile');
    if (mobileToggle) {
        mobileToggle.textContent = icon;
    }
}
