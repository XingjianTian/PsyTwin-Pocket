const STORAGE_PREFIX = 'psytwin.desktop';

function getKey(key) {
  return `${STORAGE_PREFIX}.${key}`;
}

export function getStorage(key, fallback = null) {
  const value = window.localStorage.getItem(getKey(key));
  return value === null ? fallback : value;
}

export function setStorage(key, value) {
  if (value === undefined || value === null) {
    window.localStorage.removeItem(getKey(key));
    return;
  }

  window.localStorage.setItem(getKey(key), String(value));
}

export function removeStorage(key) {
  window.localStorage.removeItem(getKey(key));
}

export function clearStorage() {
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(STORAGE_PREFIX))
    .forEach((key) => {
      window.localStorage.removeItem(key);
    });
}
