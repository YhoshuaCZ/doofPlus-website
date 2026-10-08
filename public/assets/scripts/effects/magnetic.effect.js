/**
 * Magnetic effect for call-to-action buttons marked with data-magnetic:
 * the button follows the mouse slightly and returns with a soft bounce.
 * It only reacts to a mouse and is disabled when the visitor prefers reduced motion.
 */
const MAX_OFFSET = 8;

export function initializeMagneticEffect() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  document.querySelectorAll('[data-magnetic]').forEach(element => {
    element.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      element.style.transition = 'transform 80ms linear';
      element.style.transform = `translate(${(x * MAX_OFFSET).toFixed(1)}px, ${(y * MAX_OFFSET).toFixed(1)}px)`;
    });

    element.addEventListener('pointerleave', () => {
      element.style.transition = 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      element.style.transform = '';
    });
  });
}
