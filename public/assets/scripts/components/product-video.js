import { i18n } from '../i18n.js';
import { VIDEO_URL } from '../config.js';

/**
 * About-the-Product video (US49). The player loads the YouTube embed only when
 * the visitor presses play. If the video is not published or cannot be loaded,
 * a message explains where to watch it.
 */
export function initializeProductVideo() {
  const player = document.querySelector('.video-player');
  const play = document.querySelector('[data-video-play]');
  const link = document.querySelector('[data-video-link]');
  const message = document.querySelector('.video-soon');
  if (!player || !play) return;

  const showMessage = key => {
    message.setAttribute('data-i18n', key);
    message.innerHTML = i18n.t(key);
    message.hidden = false;
  };

  if (!VIDEO_URL) {
    if (link) link.hidden = true;
    play.addEventListener('click', () => showMessage('product.soon'));
    return;
  }

  if (link) link.href = VIDEO_URL.replace('/embed/', '/watch?v=');

  play.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = `${VIDEO_URL}?autoplay=1`;
    frame.title = i18n.t('product.player_title');
    frame.allow = 'autoplay; encrypted-media; picture-in-picture';
    frame.allowFullscreen = true;
    frame.addEventListener('error', () => showMessage('product.unavailable'));
    player.appendChild(frame);
    play.hidden = true;
  });
}
