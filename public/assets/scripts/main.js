import { i18n } from './i18n.js';
import { initializeLanguageSwitcher } from './components/language-switcher.js';
import { initializeNavbar } from './components/navbar.js';
import { initializeSegmentAccess } from './components/segment-access.js';
import { initializeAccordions } from './components/accordion.js';
import { initializeBillingToggle } from './components/billing-toggle.js';
import { initializeProductVideo } from './components/product-video.js';
import { initializeDemoRequest } from './components/demo-request.js';
import { initializeMagneticEffect } from './effects/magnetic.effect.js';

/**
 * Entry point shared by index.html, demo.html, terms.html and privacy.html.
 * Each component checks that its elements exist on the current page.
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await i18n.init();
  } catch (error) {
    // The HTML already contains the English texts, so the page stays usable.
    console.error(error);
  }

  initializeLanguageSwitcher();
  initializeNavbar();
  initializeSegmentAccess();
  initializeAccordions();
  initializeBillingToggle();
  initializeProductVideo();
  initializeDemoRequest();
  initializeMagneticEffect();
});
