import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import hu from '@/locales/hu.json'
import en from '@/locales/en.json'

i18n.use(initReactI18next).init({
  resources: {
    hu: { translation: hu },
    en: { translation: en },
  },
  lng: 'hu',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
