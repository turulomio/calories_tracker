import { config } from '@vue/test-utils';
// import i18n from '@/i18n';
// import { createApp } from 'vue'



// const app = createApp({
//   setup() {
//     const { t } = VueI18n.useI18n() // call `useI18n`, and spread `t` from  `useI18n` returning
//     return { t } // return render context that included `t`
//   }
// })

// Configura un mock simple para vue-i18n
config.global.mocks = {
  $t: (msg) => msg,
  // $i18n: i18n,
  // $app: app
};
config.global.is_testing=true
console.log("Testing...")
// console.log(i18n)

// // NOTE: not needed with `globals: true`
// import { vi } from 'vitest'

// createTestingPinia({
//   createSpy: vi.fn,
// })

import { createI18n } from 'vue-i18n';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';

// Mocking any modules as necessary
vi.mock('path-to-module-to-mock', () => {
  return {
    // Mock implementation
  };
});

// Setup for vue-i18n
const i18n = createI18n({
  locale: 'en', // default locale
  fallbackLocale: 'en', // fallback locale
  messages: {
    en: {
      // English translations
    },
    // Other locales...
  },
});

// Setup for Pinia with testing utilities
const testingPinia = createTestingPinia({
  createSpy: vi.fn, // Using Vitest's spy function
});

// Global setup for Vue Test Utils
// If using Vue Test Utils, you can set global configuration here

// Export a function to setup global configurations
export function setupGlobalConfigs() {
  return {
    global: {
      plugins: [i18n, testingPinia],
      // Additional global configurations or mocks can be added here
    },
  };
}
