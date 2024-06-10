import axios from 'axios';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { setIsAppLoading } from './containers/App/AppSlice';
import { store } from './store';
import { getItem } from './utils/storage';

export const resources = {};

export enum ELanguages {
  'se' = 'se',
  'en' = 'en',
}
i18n.use(initReactI18next).init({
  lng: getItem('language') || ELanguages.se,
  defaultNS: 'translations',
  fallbackLng: ELanguages.en,
  resources,
  keySeparator: false, // we do not use keys in form messages.welcome

  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

const getTranslation = async (lang: ELanguages) => {
  return await axios
    .get(
      lang === ELanguages.en ? process.env.REACT_APP_TRANSLATION_URL_EN! : process.env.REACT_APP_TRANSLATION_URL_SE! 
    )
    .then(res => res.data);
};

const addTranslations = async () => {
  const enTranslations = await getTranslation(ELanguages.en);
  const seTranslations = await getTranslation(ELanguages.se);
  console.log('enTranslations', enTranslations);
  console.log('seTranslations', seTranslations);
  i18n.addResourceBundle(ELanguages.en, 'translations', enTranslations);
  i18n.addResourceBundle(ELanguages.se, 'translations', seTranslations);
  store.dispatch(setIsAppLoading(false));
};

addTranslations();

export default i18n;
