import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import de from './locales/de.json'
import fr from './locales/fr.json'

const messages = {
  en,
  de,
  fr
}

const savedLocale = localStorage.getItem('userLocale') || 'de'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages,
  silentTranslationWarn: true,
  // Add global injection to make $t reactive
  globalInjection: true
})

// Helper function to update locale
export function setI18nLanguage(i18n, locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('userLocale', locale)
}

export default i18n