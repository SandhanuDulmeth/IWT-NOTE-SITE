/* =============================================
   IWT NOTE SITE — Search Functionality
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initSearch();
});

/* Pre-built search index */
const SEARCH_INDEX = [
    // HTML
    { title: 'Internet, Web & HTML', topic: 'html', page: 'lectures/html-lecture1.html', section: '#html-intro' },
    { title: 'HTML Elements & Tags', topic: 'html', page: 'lectures/html-lecture2.html', section: '#html-elements' },
    { title: 'HTML Structure', topic: 'html', page: 'lectures/html-lecture2.html', section: '#html-structure' },
    { title: 'HTML Attributes', topic: 'html', page: 'lectures/html-lecture2.html', section: '#html-attributes' },
    { title: 'HTML Formatting', topic: 'html', page: 'lectures/html-lecture2.html', section: '#html-formatting' },
    { title: 'Block vs Inline', topic: 'html', page: 'lectures/html-lecture2.html', section: '#html-block-inline' },
    { title: 'Lists & Semantic HTML', topic: 'html', page: 'lectures/html-lecture3.html', section: '#html-semantic' },
    { title: 'HTML Tables & Images', topic: 'html', page: 'lectures/html-lecture3.html', section: '#html-tables' },
    { title: 'HTML Links & Paths', topic: 'html', page: 'lectures/html-lecture4.html', section: '#html-links' },
    { title: 'HTML Forms & Input', topic: 'html', page: 'lectures/html-lecture4.html', section: '#html-forms' },

    // CSS
    { title: 'What is CSS?', topic: 'css', page: 'lectures/css-lecture1.html', section: '#css-what' },
    { title: 'Applying CSS', topic: 'css', page: 'lectures/css-lecture1.html', section: '#css-apply' },
    { title: 'CSS Syntax & Selectors', topic: 'css', page: 'lectures/css-lecture1.html', section: '#css-syntax' },
    { title: 'CSS Combinators', topic: 'css', page: 'lectures/css-lecture1.html', section: '#css-combinators' },
    { title: 'Div & Span', topic: 'css', page: 'lectures/css-lecture1.html', section: '#css-divspan' },
    { title: 'CSS Limitations', topic: 'css', page: 'lectures/css-lecture2.html', section: '#css-limitations' },
    { title: 'Sass Preprocessor', topic: 'css', page: 'lectures/css-lecture2.html', section: '#css-sass' },
    { title: 'Other Preprocessors', topic: 'css', page: 'lectures/css-lecture2.html', section: '#css-others' },
    { title: 'Modern CSS Features', topic: 'css', page: 'lectures/css-lecture2.html', section: '#css-modern' },
    { title: 'Attribute Selectors', topic: 'css', page: 'lectures/css-lecture2.html', section: '#css-attribute' },
    { title: 'CSS Display & Box Model', topic: 'css', page: 'lectures/css-lecture3.html', section: '#css-display' },
    { title: 'CSS Flexbox', topic: 'css', page: 'lectures/css-lecture3.html', section: '#css-flexbox' },
    { title: 'Flex Properties', topic: 'css', page: 'lectures/css-lecture3.html', section: '#css-flex-props' },
    { title: 'Flex Layouts', topic: 'css', page: 'lectures/css-lecture3.html', section: '#css-flex-layout' },
    { title: 'Responsive Design', topic: 'css', page: 'lectures/css-lecture3.html', section: '#css-responsive' },
    { title: 'Media Queries', topic: 'css', page: 'lectures/css-lecture3.html', section: '#css-media' },
    { title: 'CSS Visual Styling', topic: 'css', page: 'lectures/css-lecture4.html', section: '#css-visual' },
    { title: 'CSS Spacing & Sizing', topic: 'css', page: 'lectures/css-lecture4.html', section: '#css-spacing' },
    { title: 'CSS Layout Properties', topic: 'css', page: 'lectures/css-lecture4.html', section: '#css-layout' },

    // JavaScript
    { title: 'Introduction to JavaScript', topic: 'js', page: 'javascript.html', section: '#js-intro' },
    { title: 'Variables & Data Types', topic: 'js', page: 'javascript.html', section: '#js-variables' },
    { title: 'JavaScript Functions', topic: 'js', page: 'javascript.html', section: '#js-functions' },
    { title: 'DOM Manipulation', topic: 'js', page: 'javascript.html', section: '#js-dom' },
    { title: 'Event Handling', topic: 'js', page: 'javascript.html', section: '#js-events' },
    { title: 'Async & Promises', topic: 'js', page: 'javascript.html', section: '#js-async' },
    { title: 'JavaScript Practice Exercises', topic: 'js', page: 'javascript.html', section: '#js-practice' },

    // PHP
    { title: 'Introduction to PHP', topic: 'php', page: 'lectures/php-lecture1.html', section: '#php-intro' },
    { title: 'PHP Setup', topic: 'php', page: 'lectures/php-lecture1.html', section: '#php-setup' },
    { title: 'PHP Syntax', topic: 'php', page: 'lectures/php-lecture1.html', section: '#php-syntax' },
    { title: 'PHP Variables & Types', topic: 'php', page: 'lectures/php-lecture1.html', section: '#php-variables' },
    { title: 'PHP Operators', topic: 'php', page: 'lectures/php-lecture1.html', section: '#php-operators' },
    { title: 'PHP Control Structures', topic: 'php', page: 'lectures/php-lecture1.html', section: '#php-control' },
    { title: 'PHP Loops', topic: 'php', page: 'lectures/php-lecture1.html', section: '#php-loops' },
    { title: 'PHP Indexed Arrays', topic: 'php', page: 'lectures/php-lecture2.html', section: '#php-indexed' },
    { title: 'PHP Associative Arrays', topic: 'php', page: 'lectures/php-lecture2.html', section: '#php-assoc' },
    { title: 'PHP Multidimensional Arrays', topic: 'php', page: 'lectures/php-lecture2.html', section: '#php-multi' },
    { title: 'PHP Array Functions', topic: 'php', page: 'lectures/php-lecture2.html', section: '#php-arr-funcs' },
    { title: 'PHP Array Operators', topic: 'php', page: 'lectures/php-lecture2.html', section: '#php-arr-ops' },
    { title: 'PHP Functions', topic: 'php', page: 'lectures/php-lecture2.html', section: '#php-functions' },
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
