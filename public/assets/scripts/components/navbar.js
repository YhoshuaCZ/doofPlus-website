import { i18n } from '../i18n.js';

/**
 * Navbar of the landing page (US44): full-screen mobile menu and
 * highlight of the section in view in the desktop and mobile links.
 */
export function initializeNavbar() {
  initializeMobileMenu();
  highlightSectionInView();
}

function initializeMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  const setOpen = open => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', i18n.t(open ? 'nav.close' : 'nav.menu') || '');
    document.body.classList.toggle('menu-open', open);
  };

  toggle.addEventListener('click', () => setOpen(menu.hidden));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });

  // The menu only exists on mobile: close it if the screen grows to desktop size.
  window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches) setOpen(false);
  });

  i18n.subscribe(() => setOpen(!menu.hidden));
}

function highlightSectionInView() {
  const links = [...document.querySelectorAll('.nav-links a[href^="#"], .mobile-links a[href^="#"]')];
  const ids = [...new Set(links.map(link => link.getAttribute('href')))];
  const sections = ids.map(id => document.querySelector(id)).filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        const current = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', current);
        if (current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(section => observer.observe(section));
}
