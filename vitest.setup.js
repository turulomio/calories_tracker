// vitest.setup.js'
import { config } from '@vue/test-utils'
import i18n from './src/i18n'
// config.global.plugins = [i18n]

import { expect, test,vi } from 'vitest'
import { useI18n } from "vue-i18n";
vi.mock("vue-i18n");

useI18n.mockReturnValue({
  t: (tKey) => tKey,
});

config.global.mocks = {
    $t: (tKey) => tKey,
  };
console.log("vitest.setup.js")