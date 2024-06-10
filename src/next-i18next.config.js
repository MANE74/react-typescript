const { ELanguages } = require('./i18n');

module.exports = {
  i18n: {
    defaultLocale: ELanguages.en,
    locales: [ELanguages.en, ELanguages.se],
  },
  react: { useSuspense: false }, //this line
};
