/* =============================================
   IWT NOTE SITE — Main App Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initMobileMenu();
  setActiveNavLink();
  initSmoothScroll();
});

/* ---------- Mobile Hamburger Menu ---------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (!hamburger || !sidebar) return;

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  // Close sidebar when clicking outside (mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
      }
    }
  });

  // Close sidebar on nav link click (mobile)
  sidebar.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
      }
    });
  });
}

/* ---------- Active Navigation Link ---------- */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link[data-page]');

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('data-page');
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ---------- Smooth Scroll for Anchors ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ---------- Sidebar Toggle (Desktop) ---------- */
function initSidebarToggle() {
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  if (!toggleBtn) return;

  const STORAGE_KEY = 'iwt-sidebar-collapsed';

  // Restore saved preference (desktop only)
  if (window.innerWidth > 768) {
    const isCollapsed = localStorage.getItem(STORAGE_KEY) === 'true';
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    }
  }

  toggleBtn.addEventListener('click', () => {
    // Only toggle on desktop
    if (window.innerWidth <= 768) return;

    document.body.classList.toggle('sidebar-collapsed');
    const collapsed = document.body.classList.contains('sidebar-collapsed');
    localStorage.setItem(STORAGE_KEY, collapsed);
  });

  // Remove collapsed class when resizing to mobile
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      document.body.classList.remove('sidebar-collapsed');
    } else {
      // Restore preference when going back to desktop
      const isCollapsed = localStorage.getItem(STORAGE_KEY) === 'true';
      if (isCollapsed) {
        document.body.classList.add('sidebar-collapsed');
      }
    }
  });
}
