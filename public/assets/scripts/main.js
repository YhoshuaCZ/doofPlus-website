/**
 * DoofPlus Landing Page behavior: translations, navigation, accordions,
 * billing toggle, About-the-Product video and demo requests.
 * Every feature checks that its elements exist, so the same script
 * runs on index.html, demo.html, terms.html and privacy.html.
 */

/** Base URL of the DoofPlus Web Application. Set it when the Web Application is deployed. */
const WEB_APP_URL = '';

/** Embed URL of the About-the-Product video (YouTube). Set it when the video is published. */
const VIDEO_URL = '';

const translations = { en, es };
const LANG_KEY = 'doofplus-lang';
const REQUEST_KEY = 'doofplus-demo-request';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

let currentLang = readStorage(() => localStorage, LANG_KEY) || 'en';

/* ---------- Storage helpers (storage can be blocked in private windows) ---------- */

function readStorage(getStorage, key) {
  try {
    return getStorage().getItem(key);
  } catch (error) {
    return null;
  }
}

function writeStorage(getStorage, key, value) {
  try {
    getStorage().setItem(key, value);
  } catch (error) {
    // The page keeps working without persistence.
  }
}

/* ---------- Translations ---------- */

/**
 * Returns the text of a dotted key (e.g. "hero.title") in the current language.
 * @param {string} key - Key of the text inside the translation files.
 * @param {Object} [vars] - Values that replace {name} placeholders.
 * @returns {string|undefined} The translated text, or undefined if the key does not exist.
 */
function t(key, vars = {}) {
  let text = key.split('.').reduce((node, part) => (node ? node[part] : undefined), translations[currentLang]);
  if (typeof text !== 'string') return undefined;
  Object.keys(vars).forEach(name => {
    text = text.replace(`{${name}}`, escapeHtml(vars[name]));
  });
  return text;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

/**
 * Updates every translatable element and the active state of the language buttons.
 */
function updateTexts() {
  document.documentElement.lang = currentLang;

  document.querySelectorAll('[data-i18n]').forEach(element => {
    if (element.hasAttribute('data-i18n-vars')) return;
    const text = t(element.getAttribute('data-i18n'));
    if (text !== undefined) element.innerHTML = text;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const text = t(element.getAttribute('data-i18n-placeholder'));
    if (text !== undefined) element.placeholder = text;
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    const text = t(element.getAttribute('data-i18n-aria'));
    if (text !== undefined) element.setAttribute('aria-label', text);
  });

  document.querySelectorAll('[data-i18n-alt]').forEach(element => {
    const text = t(element.getAttribute('data-i18n-alt'));
    if (text !== undefined) element.alt = text;
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    const active = btn.getAttribute('data-lang') === currentLang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  updateBilling();
  renderDemoRequest();
}

function setupLanguage() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.getAttribute('data-lang');
      writeStorage(() => localStorage, LANG_KEY, currentLang);
      updateTexts();
    });
  });
}

/* ---------- Navigation ---------- */

function setupNavigation() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.menu-toggle');
  if (navbar && toggle) {
    toggle.addEventListener('click', () => {
      const open = navbar.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    navbar.querySelectorAll('.nav-links a, .nav-actions a').forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Highlights the navbar link of the section in view.
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [...links].map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(section => observer.observe(section));
}

/** Points the segment buttons to the Web Application, or to the workspace section while it is not deployed. */
function setupAppLinks() {
  const paths = { qa: '/login?segment=qa', production: '/login?segment=production', register: '/register' };
  document.querySelectorAll('[data-app-segment]').forEach(link => {
    const path = paths[link.getAttribute('data-app-segment')];
    link.href = WEB_APP_URL ? WEB_APP_URL + path : '#workspace';
  });
}

/* ---------- Accordions (Features and FAQ) ---------- */

function openAccordionItem(accordion, index) {
  accordion.querySelectorAll('.accordion-item').forEach((item, i) => {
    const open = i === index;
    item.classList.toggle('open', open);
    item.querySelector('.accordion-header').setAttribute('aria-expanded', String(open));
  });
  if (accordion.getAttribute('data-accordion') === 'features') {
    document.querySelectorAll('.feature-panel').forEach(panel => {
      panel.classList.toggle('active', Number(panel.getAttribute('data-panel')) === index);
    });
  }
}

function setupAccordions() {
  document.querySelectorAll('[data-accordion]').forEach(accordion => {
    accordion.querySelectorAll('.accordion-header').forEach((header, index) => {
      header.addEventListener('click', () => openAccordionItem(accordion, index));
    });
  });

  // "Learn more" links of the services open the related feature.
  const features = document.querySelector('[data-accordion="features"]');
  document.querySelectorAll('[data-feature]').forEach(link => {
    link.addEventListener('click', () => openAccordionItem(features, Number(link.getAttribute('data-feature'))));
  });
}

/* ---------- Plans ---------- */

let billing = 'monthly';

function updateBilling() {
  document.querySelectorAll('[data-billing]').forEach(btn => {
    const active = btn.getAttribute('data-billing') === billing;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-price-monthly]').forEach(price => {
    price.textContent = price.getAttribute(billing === 'monthly' ? 'data-price-monthly' : 'data-price-annual');
  });
  document.querySelectorAll('[data-period]').forEach(period => {
    period.textContent = t(billing === 'monthly' ? 'plans.per_month' : 'plans.per_year');
  });
  document.querySelectorAll('[data-note-monthly]').forEach(note => {
    note.textContent = t(note.getAttribute(billing === 'monthly' ? 'data-note-monthly' : 'data-note-annual'));
  });
}

function setupBilling() {
  document.querySelectorAll('[data-billing]').forEach(btn => {
    btn.addEventListener('click', () => {
      billing = btn.getAttribute('data-billing');
      updateBilling();
    });
  });
}

/* ---------- About-the-Product video ---------- */

function setupVideo() {
  const play = document.querySelector('[data-video-play]');
  const link = document.querySelector('[data-video-link]');
  const soon = document.querySelector('.video-soon');
  if (!play) return;

  if (!VIDEO_URL) {
    if (link) link.hidden = true;
    play.addEventListener('click', () => { soon.hidden = false; });
    return;
  }

  if (link) link.href = VIDEO_URL.replace('/embed/', '/watch?v=');
  play.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = `${VIDEO_URL}?autoplay=1`;
    frame.title = t('product.player_title');
    frame.allow = 'autoplay; encrypted-media; picture-in-picture';
    frame.allowFullscreen = true;
    play.closest('.video-player').appendChild(frame);
  });
}

/* ---------- Demo request ---------- */

function setFieldError(input, error, show) {
  input.closest('.field').classList.toggle('invalid', show);
  input.setAttribute('aria-invalid', String(show));
  if (error) error.hidden = !show;
}

/**
 * Validates a demo request form. Valid requests are kept in sessionStorage
 * and the confirmation is shown on demo.html.
 */
function setupDemoForms() {
  document.querySelectorAll('.demo-form').forEach(form => {
    const email = form.querySelector('input[name="email"]');
    const emailError = email.closest('.field').querySelector('.field-error');
    const accept = form.querySelector('input[name="accept"]');
    const acceptError = form.querySelector('[data-accept-error]');
    const banner = form.querySelector('.form-error');

    email.addEventListener('input', () => {
      if (email.closest('.field').classList.contains('invalid') && EMAIL_PATTERN.test(email.value.trim())) {
        setFieldError(email, emailError, false);
      }
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      const emailValid = EMAIL_PATTERN.test(email.value.trim());
      const acceptValid = !accept || accept.checked;
      setFieldError(email, emailError, !emailValid);
      if (acceptError) acceptError.hidden = acceptValid;
      banner.hidden = emailValid && acceptValid;
      if (!emailValid) {
        email.focus();
        return;
      }
      if (!acceptValid) {
        accept.focus();
        return;
      }

      const request = {
        id: `DR-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        email: email.value.trim(),
        lab: form.querySelector('input[name="lab"]').value.trim(),
        segment: form.querySelector('input[name="segment"]:checked').value,
        date: new Date().toISOString()
      };
      writeStorage(() => sessionStorage, REQUEST_KEY, JSON.stringify(request));

      const redirect = form.getAttribute('data-redirect');
      if (redirect) {
        window.location.href = `${redirect}#received`;
      } else {
        showDemoSuccess();
      }
    });
  });
}

function getDemoRequest() {
  try {
    return JSON.parse(readStorage(() => sessionStorage, REQUEST_KEY));
  } catch (error) {
    return null;
  }
}

function showDemoSuccess() {
  const form = document.querySelector('[data-demo-view="form"]');
  const success = document.querySelector('[data-demo-view="success"]');
  if (!form || !success || !getDemoRequest()) return;
  form.hidden = true;
  success.hidden = false;
  renderDemoRequest();
  window.scrollTo({ top: 0 });
}

/** Fills the request summary in the current language. */
function renderDemoRequest() {
  const success = document.querySelector('[data-demo-view="success"]');
  const request = getDemoRequest();
  if (!success || success.hidden || !request) return;

  const segment = request.segment === 'production' ? t('form.prod') : t('form.qa');
  const date = new Intl.DateTimeFormat(currentLang === 'es' ? 'es-PE' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(request.date));
  const values = { id: request.id, email: request.email, lab: request.lab || t('demo.no_lab'), segment, date };

  success.querySelector('.success-text').innerHTML = t('demo.success_text', { email: request.email });
  success.querySelectorAll('[data-request]').forEach(field => {
    field.textContent = values[field.getAttribute('data-request')];
  });
  success.querySelector('[data-request-step]').textContent = t(request.segment === 'production' ? 'demo.n2_prod' : 'demo.n2_qa');
}

/* ---------- Start ---------- */

document.addEventListener('DOMContentLoaded', () => {
  setupLanguage();
  setupNavigation();
  setupAppLinks();
  setupAccordions();
  setupBilling();
  setupVideo();
  setupDemoForms();
  updateTexts();
  if (window.location.hash === '#received') showDemoSuccess();
});
