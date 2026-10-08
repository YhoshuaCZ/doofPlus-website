import { readStorage, writeStorage } from './utils/storage.js';

const LANG_KEY = 'doofplus-lang';
const DEFAULT_LANG = 'en';

/** BCP 47 tags of the supported languages: English (en-US) and Latin American Spanish (es-419). */
const LANG_TAGS = { en: 'en-US', es: 'es-419' };

/**
 * Loads the texts of the Landing Page from public/assets/i18n/<lang>.json and
 * applies them to the elements that declare data-i18n attributes:
 * - data-i18n: inner HTML of the element.
 * - data-i18n-placeholder, data-i18n-aria, data-i18n-alt: placeholder, aria-label and alt.
 */
export class I18nService {
  constructor() {
    const stored = readStorage(() => localStorage, LANG_KEY);
    this.currentLang = stored in LANG_TAGS ? stored : DEFAULT_LANG;
    this.translations = {};
    this.subscribers = [];
  }

  async init() {
    await this.loadTranslations(this.currentLang);
    this.applyTranslations();
  }

  async loadTranslations(lang) {
    if (this.translations[lang]) return;
    const response = await fetch(new URL(`../i18n/${lang}.json`, import.meta.url));
    if (!response.ok) throw new Error(`Translations for "${lang}" could not be loaded (HTTP ${response.status}).`);
    this.translations[lang] = await response.json();
  }

  async setLanguage(lang) {
    if (!(lang in LANG_TAGS) || lang === this.currentLang) return;
    await this.loadTranslations(lang);
    this.currentLang = lang;
    writeStorage(() => localStorage, LANG_KEY, lang);
    this.applyTranslations();
    this.subscribers.forEach(callback => callback(lang));
  }

  /**
   * Returns the text of a dotted key (e.g. "hero.title") in the current language.
   * @param {string} key - Key inside the translation file.
   * @param {Object} [vars] - Values that replace {name} placeholders; they are HTML-escaped.
   * @returns {string|undefined} The text, or undefined if the key does not exist.
   */
  t(key, vars = {}) {
    let text = key.split('.').reduce((node, part) => (node ? node[part] : undefined), this.translations[this.currentLang]);
    if (typeof text !== 'string') return undefined;
    Object.entries(vars).forEach(([name, value]) => {
      text = text.replace(`{${name}}`, escapeHtml(value));
    });
    return text;
  }

  get locale() {
    return LANG_TAGS[this.currentLang];
  }

  applyTranslations() {
    document.documentElement.lang = this.locale;
    this.applyTo('[data-i18n]', 'data-i18n', (element, text) => { element.innerHTML = text; });
    this.applyTo('[data-i18n-placeholder]', 'data-i18n-placeholder', (element, text) => { element.placeholder = text; });
    this.applyTo('[data-i18n-aria]', 'data-i18n-aria', (element, text) => { element.setAttribute('aria-label', text); });
    this.applyTo('[data-i18n-alt]', 'data-i18n-alt', (element, text) => { element.alt = text; });
  }

  applyTo(selector, attribute, apply) {
    document.querySelectorAll(selector).forEach(element => {
      const text = this.t(element.getAttribute(attribute));
      if (text !== undefined) apply(element, text);
    });
  }

  /** Registers a callback that runs after every language change. */
  subscribe(callback) {
    this.subscribers.push(callback);
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

export const i18n = new I18nService();
