// import Vue from 'vue'
import { createI18n } from 'vue-i18n'
import json_es from './locales/es.json'

const i18n=createI18n({
  globalInjection: true,
  legacy: true, // Set to false to use Composition API
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  silentFallbackWarn: true,

  silentTranslationWarn: true,

  messages:{
    es:json_es
  }
})

export default i18n