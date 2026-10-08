import { APP_ROUTES, WEB_APP_URL } from '../config.js';

/**
 * Segment access buttons (US48): QA/QC specialists and production supervisors
 * open the sign-in of their own environment in the Web Application.
 * While the Web Application is not deployed, they lead to the workspace section.
 */
export function initializeSegmentAccess() {
  const onIndex = Boolean(document.querySelector('#workspace'));
  document.querySelectorAll('[data-app-segment]').forEach(link => {
    const route = APP_ROUTES[link.dataset.appSegment];
    if (WEB_APP_URL && route) {
      link.href = WEB_APP_URL + route;
    } else {
      link.href = onIndex ? '#workspace' : 'index.html#workspace';
    }
  });
}
