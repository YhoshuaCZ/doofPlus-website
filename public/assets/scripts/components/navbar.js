/**
 * Navbar of the landing page (US44): mobile menu and highlight of the section in view.
 */
export function initializeNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.menu-toggle');

  if (navbar && toggle) {
    const setOpen = open => {
      navbar.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(!navbar.classList.contains('open')));
    navbar.querySelectorAll('.nav-links a, .nav-actions a').forEach(link => {
      link.addEventListener('click', () => setOpen(false));
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  highlightSectionInView();
}

function highlightSectionInView() {
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
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
