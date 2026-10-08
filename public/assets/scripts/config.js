/**
 * Settings of the Landing Page that depend on other DoofPlus products.
 */

/** Base URL of the DoofPlus Web Application. Set it when the Web Application is deployed. */
export const WEB_APP_URL = '';

/** Embed URL of the About-the-Product video (e.g. https://www.youtube.com/embed/<id>). */
export const VIDEO_URL = '';

/** Web Application routes opened by the segment access buttons (US48). */
export const APP_ROUTES = {
  qa: '/login?segment=qa',
  production: '/login?segment=production',
  register: '/register'
};
