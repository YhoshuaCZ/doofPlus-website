import { i18n } from '../i18n.js';

/**
 * EN / ES buttons of the navbar and footer (US46).
 * The active button is marked with the "active" class and aria-pressed.
 */
export function initializeLanguageSwitcher() {
  const buttons = document.querySelectorAll('.lang-btn');

  const update = () => {
    buttons.forEach(button => {
      const active = button.dataset.lang === i18n.currentLang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  buttons.forEach(button => {
    button.addEventListener('click', () => i18n.setLanguage(button.dataset.lang));
  });

  i18n.subscribe(update);
  update();
}
