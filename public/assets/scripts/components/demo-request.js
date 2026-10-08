import { i18n } from '../i18n.js';
import { readStorage, writeStorage } from '../utils/storage.js';

const REQUEST_KEY = 'doofplus-demo-request';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Demo request forms (US04) of index.html and demo.html.
 * A valid request is kept in sessionStorage and its confirmation is shown on demo.html.
 */
export function initializeDemoRequest() {
  document.querySelectorAll('.demo-form').forEach(attachForm);

  i18n.subscribe(renderConfirmation);
  if (window.location.hash === '#received') showConfirmation();
}

function attachForm(form) {
  const email = form.querySelector('input[name="email"]');
  const emailError = email.closest('.field').querySelector('.field-error');
  const accept = form.querySelector('input[name="accept"]');
  const acceptError = form.querySelector('[data-accept-error]');
  const banner = form.querySelector('.form-error');

  email.addEventListener('input', () => {
    if (email.getAttribute('aria-invalid') === 'true' && isValidEmail(email.value)) {
      setInvalid(email, emailError, false);
    }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    const emailValid = isValidEmail(email.value);
    const acceptValid = !accept || accept.checked;
    setInvalid(email, emailError, !emailValid);
    if (acceptError) acceptError.hidden = acceptValid;
    banner.hidden = emailValid && acceptValid;

    if (!emailValid) return email.focus();
    if (!acceptValid) return accept.focus();

    writeStorage(() => sessionStorage, REQUEST_KEY, JSON.stringify({
      id: `DR-2026-${Math.floor(Math.random() * 9000) + 1000}`,
      email: email.value.trim(),
      lab: form.querySelector('input[name="lab"]').value.trim(),
      segment: form.querySelector('input[name="segment"]:checked').value,
      date: new Date().toISOString()
    }));

    if (form.dataset.redirect) {
      window.location.href = `${form.dataset.redirect}#received`;
    } else {
      window.history.replaceState(null, '', '#received');
      showConfirmation();
    }
  });
}

function isValidEmail(value) {
  return EMAIL_PATTERN.test(value.trim());
}

function setInvalid(input, error, invalid) {
  input.closest('.field').classList.toggle('invalid', invalid);
  input.setAttribute('aria-invalid', String(invalid));
  if (error) error.hidden = !invalid;
}

function getRequest() {
  try {
    return JSON.parse(readStorage(() => sessionStorage, REQUEST_KEY));
  } catch (error) {
    return null;
  }
}

/** Replaces the form with the confirmation of the request. */
function showConfirmation() {
  const form = document.querySelector('[data-demo-view="form"]');
  const confirmation = document.querySelector('[data-demo-view="success"]');
  if (!form || !confirmation || !getRequest()) return;

  form.hidden = true;
  confirmation.hidden = false;
  renderConfirmation();
  window.scrollTo({ top: 0 });
  confirmation.querySelector('h1').focus();
}

/** Fills the request summary in the current language. */
function renderConfirmation() {
  const confirmation = document.querySelector('[data-demo-view="success"]');
  const request = getRequest();
  if (!confirmation || confirmation.hidden || !request) return;

  const production = request.segment === 'production';
  const values = {
    id: request.id,
    email: request.email,
    lab: request.lab || i18n.t('demo.no_lab'),
    segment: i18n.t(production ? 'form.prod' : 'form.qa'),
    date: new Intl.DateTimeFormat(i18n.locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(request.date))
  };

  confirmation.querySelector('.success-text').innerHTML = i18n.t('demo.success_text', { email: request.email });
  confirmation.querySelectorAll('[data-request]').forEach(field => {
    field.textContent = values[field.dataset.request];
  });
  confirmation.querySelector('[data-request-step]').textContent = i18n.t(production ? 'demo.n2_prod' : 'demo.n2_qa');
}
