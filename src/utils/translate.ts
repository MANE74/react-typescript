import i18n, { TOptions } from 'i18next';
/**
 * Translates text.
 *
 * @param key The i18n key.
 */
export function translate(key: string, params?: TOptions | string) {
  return key ? i18n.t(key, params) : '';
}
