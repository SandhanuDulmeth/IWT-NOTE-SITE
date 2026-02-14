/* =============================================
   IWT NOTE SITE — Progress Tracking
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initProgress();
});

const STORAGE_KEY = 'iwt-progress';

/* Total sections per topic */
const TOPIC_SECTIONS = {
    html: ['html-intro', 'html-elements', 'html-attributes', 'html-forms', 'html-semantic', 'html-tables', 'html-practice'],
    css: ['css-intro', 'css-selectors', 'css-boxmodel', 'css-flexbox', 'css-grid', 'css-animations', 'css-practice'],
    js: ['js-intro', 'js-variables', 'js-functions', 'js-dom', 'js-events', 'js-async', 'js-practice'],
    php: ['php-intro', 'php-variables', 'php-control', 'php-functions', 'php-forms', 'php-mysql', 'php-practice']
};

function getProgress() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
}

function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function initProgress() {
    const progress = getProgress();

    // Bind topic page checkboxes
    document.querySelectorAll('.completion-toggle input[type="checkbox"]').forEach(checkbox => {
        const sectionId = checkbox.getAttribute('data-section');
        if (!sectionId) return;

        // Restore state
        checkbox.checked = !!progress[sectionId];

        checkbox.addEventListener('change', () => {
            const p = getProgress();
            if (checkbox.checked) {
                p[sectionId] = true;
            } else {
                delete p[sectionId];
            }
            saveProgress(p);
            updateProgressUI();
            updateNavCheckmarks();
        });
    });

    updateProgressUI();
    updateNavCheckmarks();
}

/* Update progress bar and percentage on home page */
function updateProgressUI() {
    const progress = getProgress();
    const allSections = Object.values(TOPIC_SECTIONS).flat();
    const completed = allSections.filter(s => progress[s]).length;
    const total = allSections.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Home page progress
    const progressFill = document.getElementById('progress-fill');
    const progressPercent = document.getElementById('progress-percentage');
    const completedCount = document.getElementById('completed-count');
    const totalCount = document.getElementById('total-count');

    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressPercent) progressPercent.textContent = `${percent}%`;
    if (completedCount) completedCount.textContent = completed;
    if (totalCount) totalCount.textContent = total;

    // Sidebar mini progress
    const miniProgressFill = document.getElementById('mini-progress-fill');
    const miniProgressLabel = document.getElementById('mini-progress-label');
    if (miniProgressFill) miniProgressFill.style.width = `${percent}%`;
    if (miniProgressLabel) miniProgressLabel.textContent = `${percent}%`;

    // Update individual topic progress on home page cards
    Object.keys(TOPIC_SECTIONS).forEach(topic => {
        const sections = TOPIC_SECTIONS[topic];
        const topicCompleted = sections.filter(s => progress[s]).length;
        const topicPercent = Math.round((topicCompleted / sections.length) * 100);

        const cardProgress = document.getElementById(`${topic}-card-progress`);
        if (cardProgress) {
            cardProgress.textContent = `${topicCompleted}/${sections.length} completed`;
        }
    });
}

/* Update checkmarks in navigation sidebar */
function updateNavCheckmarks() {
    const progress = getProgress();

    Object.keys(TOPIC_SECTIONS).forEach(topic => {
        const sections = TOPIC_SECTIONS[topic];
        const allCompleted = sections.every(s => progress[s]);
        const navCheck = document.querySelector(`.nav-link[data-page="${getPageForTopic(topic)}"] .completion-check`);
        if (navCheck) {
            navCheck.classList.toggle('visible', allCompleted);
        }
    });
}

function getPageForTopic(topic) {
    const pages = { html: 'html.html', css: 'css.html', js: 'javascript.html', php: 'php.html' };
    return pages[topic] || '';
}
