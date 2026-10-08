/**
 * Safe access to Web Storage. Storage can be blocked (e.g. private windows),
 * so every read and write falls back silently and the page keeps working.
 */

/**
 * @param {() => Storage} getStorage - Returns localStorage or sessionStorage.
 * @param {string} key - Storage key.
 * @returns {string|null} The stored value, or null if it is missing or unavailable.
 */
export function readStorage(getStorage, key) {
  try {
    return getStorage().getItem(key);
  } catch (error) {
    return null;
  }
}

/**
 * @param {() => Storage} getStorage - Returns localStorage or sessionStorage.
 * @param {string} key - Storage key.
 * @param {string} value - Value to store.
 */
export function writeStorage(getStorage, key, value) {
  try {
    getStorage().setItem(key, value);
  } catch (error) {
    // Without storage the preference only lasts for the current page.
  }
}
