import { CookiesState } from '../components/RequireCookies/RequireCookies';

// Global Varaibale
const _isSessionStorageAvailable = isSessionStorageAvailable();

// main Funtionality
export const saveItem = (key: string, item: Object) => {
  const allowCookies = localStorage.getItem('allow-cookies');
  const itemString = JSON.stringify(item);
  allowCookies && allowCookies === CookiesState.accepted
    ? localStorage.setItem(key, itemString)
    : sessionStorageSet(key, itemString);
};

export const getItem = (key: string) => {
  const allowCookies = localStorage.getItem('allow-cookies');
  const item: string | null =
    allowCookies && allowCookies === CookiesState.accepted
      ? localStorage.getItem(key)
      : sessionStorageGet(key);

  let itemObject;
  if (item) {
    // if there is an item let's parse it so we can have it ready ;)
    try {
      itemObject = JSON.parse(item);
    } catch {
      itemObject = null;
      console.error('not valid JSON');
    }
  }

  return itemObject;
};

export const deleteItem = (key: string) => {
  const allowCookies = localStorage.getItem('allow-cookies');
  allowCookies && allowCookies === CookiesState.accepted
    ? localStorage.removeItem(key)
    : sessionStorageRemove(key);
};

// session storage
function isSessionStorageAvailable() {
  try {
    sessionStorage.setItem('test', 'value');
    if (sessionStorage.getItem('test') === 'value') {
      sessionStorage.removeItem('test');
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

export const sessionStorageSet = (key: string, item: string) => {
  _isSessionStorageAvailable
    ? sessionStorage.setItem(key, item)
    : sStorageFallbackSet(key, item);
};
export const sessionStorageGet = (key: string) => {
  return _isSessionStorageAvailable
    ? sessionStorage.getItem(key)
    : sStorageFallbackGet(key);
};
export const sessionStorageRemove = (key: string) => {
  if (_isSessionStorageAvailable) sessionStorage.removeItem(key);
  if (!_isSessionStorageAvailable) sStorageFallbackRemove(key);
};

// sessionStorage fallback
export const sessionStorageFallback: { [key: string]: any } = {};

const sStorageFallbackSet = (key: string, value: Object) => {
  sessionStorageFallback[key] = value;
};
const sStorageFallbackGet = (key: string) => {
  if (sessionStorageFallback[key]) return sessionStorageFallback[key];
};
const sStorageFallbackRemove = (key: string) => {
  delete sessionStorageFallback[key];
};

// migrating after accepting cookies

// specifying the reuired key that must moved from session storage to local storage
export const MUST_MOVED_KEYS = [
  'organizationLogo',
  'csrf',
  'language',
  'settings',
  'user',
];

export const moveSessionStorageToLocalStorage = (keys: string[]) => {
  keys.forEach(key => {
    const value = sessionStorageGet(key);
    if (value) {
      localStorage.setItem(key, value);
      sessionStorageRemove(key);
    }
  });
};
