import { i18n } from '../i18n.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Contact inquiry form (US04): the visitor sends a question to the DoofPlus team.
 * A valid inquiry replaces the form with a confirmation in the current language.
 */
export function initializeContactInquiry() {
  const form = document.querySelector('.contact-form');
  const success = document.querySelector('[data-contact-success]');
  if (!form || !success) return;

  const fields = {
    name: { input: form.elements.name, isValid: value => value.trim().length > 0 },
    email: { input: form.elements.email, isValid: value => EMAIL_PATTERN.test(value.trim()) },
    message: { input: form.elements.message, isValid: value => value.trim().length > 0 }
  };
  const banner = form.querySelector('.form-error');
  let sent = null;

  Object.values(fields).forEach(field => {
    field.input.addEventListener('input', () => {
      if (field.input.getAttribute('aria-invalid') === 'true' && field.isValid(field.input.value)) {
        setInvalid(field.input, false);
      }
    });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    const invalid = Object.values(fields).filter(field => !field.isValid(field.input.value));
    Object.values(fields).forEach(field => setInvalid(field.input, invalid.includes(field)));
    banner.hidden = invalid.length === 0;
    if (invalid.length) return invalid[0].input.focus();

    sent = { name: form.elements.name.value.trim(), email: form.elements.email.value.trim() };
    form.hidden = true;
    success.hidden = false;
    renderConfirmation();
    success.focus();
  });

  success.querySelector('[data-contact-again]').addEventListener('click', () => {
    form.reset();
    sent = null;
    success.hidden = true;
    form.hidden = false;
    fields.name.input.focus();
  });

  /** Fills the confirmation text in the current language. */
  function renderConfirmation() {
    if (!sent) return;
    success.querySelector('.success-text').innerHTML = i18n.t('form.success_text', sent);
  }

  i18n.subscribe(renderConfirmation);
}

function setInvalid(input, invalid) {
  input.closest('.field').classList.toggle('invalid', invalid);
  input.setAttribute('aria-invalid', String(invalid));
  input.closest('.field').querySelector('.field-error').hidden = !invalid;
}
