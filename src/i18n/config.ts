/**
 * i18n Configuration
 * 
 * Multi-language support with:
 * - English (default)
 * - Arabic (RTL)
 * - Language persistence in localStorage
 * - Automatic RTL detection and application
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  ar: {
    translation: arTranslations,
  },
};

// Get stored language or default to 'en'
const getStoredLanguage = (): string => {
  try {
    return localStorage.getItem('i18nextLng') || 'en';
  } catch {
    return 'en';
  }
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    react: {
      useSuspense: false,
    },
  });

// Apply RTL/LTR direction on language change
i18n.on('languageChanged', (lng) => {
  const direction = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;
  document.documentElement.lang = lng;
  
  // Add/remove RTL class for additional styling hooks
  if (direction === 'rtl') {
    document.documentElement.classList.add('rtl');
    document.documentElement.classList.remove('ltr');
  } else {
    document.documentElement.classList.add('ltr');
    document.documentElement.classList.remove('rtl');
  }
  
  // Store in localStorage for persistence
  try {
    localStorage.setItem('i18nextLng', lng);
    localStorage.setItem('textDirection', direction);
  } catch (error) {
    console.warn('Failed to save language preference:', error);
  }
});

// Set initial direction
const initialDirection = i18n.language === 'ar' ? 'rtl' : 'ltr';
document.documentElement.dir = initialDirection;
document.documentElement.lang = i18n.language;

// Add initial direction class
if (initialDirection === 'rtl') {
  document.documentElement.classList.add('rtl');
} else {
  document.documentElement.classList.add('ltr');
}

export default i18n;