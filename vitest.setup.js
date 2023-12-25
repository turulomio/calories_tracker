 import { config } from '@vue/test-utils';

// Configura un mock simple para vue-i18n
config.global.mocks = {
  $t: (msg) => msg,
  $i18n: {
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en: {} }
  }
};
