// vitest.setup.js'
import { config } from '@vue/test-utils'
import i18n from './src/i18n'
config.global.plugins = [i18n]

console.log("vitest.setup.js")