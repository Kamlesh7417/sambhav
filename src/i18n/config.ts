import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

// Import translations directly
import commonEN from '../locales/en/common.json';

const resources = {
  en: {
    common: commonEN
  }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => {
    return import(`../locales/${language}/${namespace}.json`);
  }))
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'mr', 'pa'],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
    ns: ['common', 'orders', 'shipments', 'documents'],
  });

export default i18n;