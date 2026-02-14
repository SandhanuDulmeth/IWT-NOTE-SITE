/* =============================================
   IWT NOTE SITE — Search Functionality
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initSearch();
});

/* Pre-built search index */
const SEARCH_INDEX = [
    // HTML
    { title: 'Introduction to HTML', topic: 'html', page: 'html.html', section: '#html-intro' },
    { title: 'HTML Elements & Tags', topic: 'html', page: 'html.html', section: '#html-elements' },
    { title: 'HTML Attributes', topic: 'html', page: 'html.html', section: '#html-attributes' },
    { title: 'HTML Forms & Input', topic: 'html', page: 'html.html', section: '#html-forms' },
    { title: 'Semantic HTML', topic: 'html', page: 'html.html', section: '#html-semantic' },
    { title: 'HTML Tables', topic: 'html', page: 'html.html', section: '#html-tables' },
    { title: 'HTML Practice Exercises', topic: 'html', page: 'html.html', section: '#html-practice' },

    // CSS
    { title: 'Introduction to CSS', topic: 'css', page: 'css.html', section: '#css-intro' },
    { title: 'CSS Selectors', topic: 'css', page: 'css.html', section: '#css-selectors' },
    { title: 'CSS Box Model', topic: 'css', page: 'css.html', section: '#css-boxmodel' },
    { title: 'CSS Flexbox', topic: 'css', page: 'css.html', section: '#css-flexbox' },
    { title: 'CSS Grid', topic: 'css', page: 'css.html', section: '#css-grid' },
    { title: 'CSS Animations', topic: 'css', page: 'css.html', section: '#css-animations' },
    { title: 'CSS Practice Exercises', topic: 'css', page: 'css.html', section: '#css-practice' },

    // JavaScript
    { title: 'Introduction to JavaScript', topic: 'js', page: 'javascript.html', section: '#js-intro' },
    { title: 'Variables & Data Types', topic: 'js', page: 'javascript.html', section: '#js-variables' },
    { title: 'JavaScript Functions', topic: 'js', page: 'javascript.html', section: '#js-functions' },
    { title: 'DOM Manipulation', topic: 'js', page: 'javascript.html', section: '#js-dom' },
    { title: 'Event Handling', topic: 'js', page: 'javascript.html', section: '#js-events' },
    { title: 'Async & Promises', topic: 'js', page: 'javascript.html', section: '#js-async' },
    { title: 'JavaScript Practice Exercises', topic: 'js', page: 'javascript.html', section: '#js-practice' },

    // PHP
    { title: 'Introduction to PHP', topic: 'php', page: 'php.html', section: '#php-intro' },
    { title: 'PHP Variables & Types', topic: 'php', page: 'php.html', section: '#php-variables' },
    { title: 'PHP Control Structures', topic: 'php', page: 'php.html', section: '#php-control' },
    { title: 'PHP Functions', topic: 'php', page: 'php.html', section: '#php-functions' },
    { title: 'Forms & Superglobals', topic: 'php', page: 'php.html', section: '#php-forms' },
    { title: 'MySQL Integration', topic: 'php', page: 'php.html', section: '#php-mysql' },
    { title: 'PHP Practice Exercises', topic: 'php', page: 'php.html', section: '#php-practice' },
];

let activeResultIndex = -1;

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        activeResultIndex = -1;

        if (query.length < 2) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }

        const results = SEARCH_INDEX.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.topic.toLowerCase().includes(query)
        );

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item" style="color: var(--text-muted); cursor: default;">No results found</div>';
            searchResults.classList.add('active');
            return;
        }

        searchResults.innerHTML = results.map((item, i) => `
      <a href="${item.page}${item.section}" class="search-result-item" data-index="${i}">
        <span class="result-topic ${item.topic}">${item.topic.toUpperCase()}</span>
        <span>${item.title}</span>
      </a>
    `).join('');

        searchResults.classList.add('active');
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        const items = searchResults.querySelectorAll('.search-result-item[href]');
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeResultIndex = Math.min(activeResultIndex + 1, items.length - 1);
            updateActiveResult(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeResultIndex = Math.max(activeResultIndex - 1, 0);
            updateActiveResult(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeResultIndex >= 0 && items[activeResultIndex]) {
                items[activeResultIndex].click();
            }
        } else if (e.key === 'Escape') {
            searchResults.classList.remove('active');
            searchInput.blur();
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.sidebar-search')) {
            searchResults.classList.remove('active');
        }
    });
}

function updateActiveResult(items) {
    items.forEach(item => item.classList.remove('active'));
    if (activeResultIndex >= 0 && items[activeResultIndex]) {
        items[activeResultIndex].classList.add('active');
        items[activeResultIndex].scrollIntoView({ block: 'nearest' });
    }
}
