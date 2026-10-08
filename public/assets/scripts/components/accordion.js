/**
 * Accordions of the Features (US02) and FAQ (US05) sections. One item is open at a time.
 * In the Features accordion, the open item also selects its preview panel.
 */
export function initializeAccordions() {
  document.querySelectorAll('[data-accordion]').forEach(accordion => {
    accordion.querySelectorAll('.accordion-header').forEach((header, index) => {
      header.addEventListener('click', () => openItem(accordion, index));
    });
  });

  // "Learn more" links of the services open the related feature.
  const features = document.querySelector('[data-accordion="features"]');
  document.querySelectorAll('[data-feature]').forEach(link => {
    link.addEventListener('click', () => openItem(features, Number(link.dataset.feature)));
  });
}

function openItem(accordion, index) {
  if (!accordion) return;
  accordion.querySelectorAll('.accordion-item').forEach((item, i) => {
    const open = i === index;
    item.classList.toggle('open', open);
    item.querySelector('.accordion-header').setAttribute('aria-expanded', String(open));
  });

  if (accordion.dataset.accordion === 'features') {
    document.querySelectorAll('.feature-panel').forEach(panel => {
      panel.classList.toggle('active', Number(panel.dataset.panel) === index);
    });
  }
}
