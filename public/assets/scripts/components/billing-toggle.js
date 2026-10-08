import { i18n } from '../i18n.js';

/**
 * Monthly / annual toggle of the Plans section (US03).
 * Prices come from data-price-monthly / data-price-annual and notes from translation keys.
 */
export function initializeBillingToggle() {
  const buttons = document.querySelectorAll('[data-billing]');
  if (!buttons.length) return;

  let billing = 'monthly';

  const update = () => {
    const monthly = billing === 'monthly';
    buttons.forEach(button => {
      const active = button.dataset.billing === billing;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-price-monthly]').forEach(price => {
      price.textContent = monthly ? price.dataset.priceMonthly : price.dataset.priceAnnual;
    });
    document.querySelectorAll('[data-period]').forEach(period => {
      period.textContent = i18n.t(monthly ? 'plans.per_month' : 'plans.per_year');
    });
    document.querySelectorAll('[data-note-monthly]').forEach(note => {
      note.textContent = i18n.t(monthly ? note.dataset.noteMonthly : note.dataset.noteAnnual);
    });
  };

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      billing = button.dataset.billing;
      update();
    });
  });

  i18n.subscribe(update);
  update();
}
