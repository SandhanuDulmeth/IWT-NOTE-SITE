document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const practicalItems = document.querySelectorAll('.practical-item');
    const searchInput = document.getElementById('practical-search-input');
    const completionChecks = document.querySelectorAll('.practical-check');

    // Load saved progress
    loadProgress();

    // Filter Functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            practicalItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Search Functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        practicalItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const tag = item.querySelector('.practical-tag').textContent.toLowerCase();

            if (title.includes(searchTerm) || tag.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });


    // Progress Tracking with LocalStorage
    completionChecks.forEach(check => {
        check.addEventListener('change', (e) => {
            const id = e.target.getAttribute('data-id');
            saveProgress(id, e.target.checked);
            updateMiniProgress();
        });
    });

    function loadProgress() {
        const savedProgress = JSON.parse(localStorage.getItem('iwt-practicals-progress')) || {};

        completionChecks.forEach(check => {
            const id = check.getAttribute('data-id');
            if (savedProgress[id]) {
                check.checked = true;
            }
        });
        updateMiniProgress();
    }

    function saveProgress(id, isChecked) {
        const savedProgress = JSON.parse(localStorage.getItem('iwt-practicals-progress')) || {};
        if (isChecked) {
            savedProgress[id] = true;
        } else {
            delete savedProgress[id];
        }
        localStorage.setItem('iwt-practicals-progress', JSON.stringify(savedProgress));
    }

    function updateMiniProgress() {
        const total = completionChecks.length;
        const checked = document.querySelectorAll('.practical-check:checked').length;
        const percentage = total === 0 ? 0 : Math.round((checked / total) * 100);

        const miniProgressLabel = document.getElementById('mini-progress-label');
        const miniProgressFill = document.getElementById('mini-progress-fill');

        if (miniProgressLabel) miniProgressLabel.textContent = `${percentage}%`;
        if (miniProgressFill) miniProgressFill.style.width = `${percentage}%`;
    }
});

// Toggle Answer Function (Global)
function toggleAnswer(id) {
    const answerDiv = document.getElementById(`answer-${id}`);
    const btn = document.querySelector(`button[onclick="toggleAnswer('${id}')"]`);

    if (answerDiv.style.display === 'block') {
        answerDiv.style.display = 'none';
        btn.innerHTML = '<span>👁️</span> View Answer';
    } else {
        answerDiv.style.display = 'block';
        btn.innerHTML = '<span>🙈</span> Hide Answer';
    }
}
