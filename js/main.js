/**
 * AgriLink - Main UI Interactions
 * Handles:
 * - Mobile drawer navigation open/close & backdrop clicks
 * - Header shadow on scroll
 * - Accessible keyboard navigation (Escape to close mobile menu)
 */

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');
  const siteHeader = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile navigation drawer
  function toggleNav(forceState) {
    if (!navMenu || !navToggle) return;
    const shouldOpen = typeof forceState === 'boolean' 
      ? forceState 
      : !navMenu.classList.contains('open');

    navMenu.classList.toggle('open', shouldOpen);
    navToggle.classList.toggle('open', shouldOpen);
    navToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');

    if (navOverlay) {
      navOverlay.classList.toggle('open', shouldOpen);
    }

    // Prevent body scroll when drawer is open
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNav();
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      toggleNav(false);
    });
  }

  // Close menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleNav(false);
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
      toggleNav(false);
    }
  });

  // Subtle header shadow on window scroll
  window.addEventListener('scroll', () => {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  // Global Toast function
  function showToast(message) {
    let toast = document.getElementById('agrilink-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'agrilink-toast';
      toast.className = 'agrilink-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  }
  window.agriLinkToast = showToast;

  // Global Demo Mode & Reset Demo Controls (for index, farmer, industry, etc.)
  const btnDemoMode = document.getElementById('btn-demo-mode');
  const btnResetDemo = document.getElementById('btn-reset-demo');
  const t = window.AgriLinkI18n ? window.AgriLinkI18n.t : (k => k);

  // Note: matches.js, impact.js, and clusters.js attach their own handlers to also re-render their data
  // Only attach fallback handlers here if not already handled by page controllers
  const pageHasDedicatedController = document.getElementById('matches-table-body') || 
                                     document.getElementById('chart-farmer-earnings') || 
                                     document.getElementById('clusters-list');

  if (!pageHasDedicatedController) {
    if (btnDemoMode) {
      btnDemoMode.addEventListener('click', () => {
        if (window.AgriLinkAPI) {
          window.AgriLinkAPI.loadDemoData();
          showToast(t('demo.loaded_success'));
        }
      });
    }

    if (btnResetDemo) {
      btnResetDemo.addEventListener('click', () => {
        if (window.AgriLinkAPI) {
          window.AgriLinkAPI.clearDemoData();
          showToast(t('demo.reset_success'));
        }
      });
    }
  }
});

