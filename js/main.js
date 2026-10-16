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
});
