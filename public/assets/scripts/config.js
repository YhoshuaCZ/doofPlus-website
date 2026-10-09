/**
 * Settings of the Landing Page that depend on other DoofPlus products.
 */

/** Base URL of the DoofPlus Web Application. Set it when the Web Application is deployed. */
export const WEB_APP_URL = '';

/**
 * Embed URLs of the videos (e.g. https://www.youtube.com/embed/<id>).
 * Paste each URL when the video is published on YouTube.
 */
export const VIDEO_URLS = {
  product: '',
  team: ''
};

/** Web Application routes opened by the segment access buttons (US48). */
export const APP_ROUTES = {
  qa: '/login?segment=qa',
  production: '/login?segment=production',
  register: '/register'
};
