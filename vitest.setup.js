import { config } from '@vue/test-utils';

// Configura un mock simple para vue-i18n
config.global.mocks = {
  $t: (msg) => msg,
  // $i18n: i18n,
  // $app: app
};
config.global.is_testing=true
console.log("Testing...")

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



import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

config.global.vuetify=vuetify




// Global setup for Vue Test Utils
// If using Vue Test Utils, you can set global configuration here

// Export a function to setup global configurations
export function setupGlobalConfigs() {
  return {
    global: {
      plugins: [i18n, testingPinia,vuetify],
      // Additional global configurations or mocks can be added here
    },
  };
}

global.ResizeObserver = require('resize-observer-polyfill')
// console.log(config)