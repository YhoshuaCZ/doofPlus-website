import { i18n } from '../i18n.js';
import { VIDEO_URLS } from '../config.js';

/**
 * About-the-Product (US49) and About-the-Team videos. Each player loads its
 * YouTube embed only when the visitor presses play. If the video is not
 * published or cannot be loaded, a message explains where to watch it.
 * The name in data-video selects the URL in config.js and the i18n texts.
 */
export function initializeVideoPlayers() {
  document.querySelectorAll('[data-video]').forEach(player => {
    const name = player.dataset.video;
    const url = VIDEO_URLS[name];
    const play = player.querySelector('[data-video-play]');
    const link = document.querySelector(`[data-video-link="${name}"]`);
    const message = document.querySelector(`[data-video-soon="${name}"]`);
    if (!play) return;

    const showMessage = key => {
      if (!message) return;
      message.setAttribute('data-i18n', key);
      message.innerHTML = i18n.t(key);
      message.hidden = false;
    };

    if (!url) {
      if (link) link.hidden = true;
      play.addEventListener('click', () => showMessage(`${name}.soon`));
      return;
    }

    if (link) link.href = url.replace('/embed/', '/watch?v=');

    play.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = `${url}?autoplay=1`;
      frame.title = i18n.t(`${name}.player_title`);
      frame.allow = 'autoplay; encrypted-media; picture-in-picture';
      frame.allowFullscreen = true;
      frame.addEventListener('error', () => showMessage(`${name}.unavailable`));
      player.appendChild(frame);
      play.hidden = true;
    });
  });
}
