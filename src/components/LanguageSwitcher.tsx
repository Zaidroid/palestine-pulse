/**
 * Language Switcher Component
 * 
 * Full-featured language toggle with:
 * - Automatic RTL/LTR switching
 * - localStorage persistence
 * - Global state synchronization
 */

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useGlobalStore } from '@/store/globalStore';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'ar', name: 'العربية', flag: '🇵🇸', nativeName: 'العربية' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { preferences, setPreferences } = useGlobalStore();

  // Sync with global store on mount
  useEffect(() => {
    if (preferences.language && preferences.language !== i18n.language) {
      i18n.changeLanguage(preferences.language);
    }
  }, []);

  // Apply RTL/LTR direction on language change
  useEffect(() => {
    const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
    
    // Add/remove RTL class for additional styling hooks
    if (direction === 'rtl') {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
    
    // Store direction in localStorage for quick access
    localStorage.setItem('textDirection', direction);
  }, [i18n.language]);

  const handleLanguageChange = (langCode: string) => {
    // Change language in i18n (will trigger localStorage persistence)
    i18n.changeLanguage(langCode);
    
    // Update global store
    setPreferences({ 
      language: langCode as 'en' | 'ar' | 'fr' | 'es' | 'he' 
    });
  };

  const currentLanguage = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
          aria-label="Change language"
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuLabel>Language / اللغة</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="cursor-pointer flex items-center gap-2"
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="flex-1">{lang.nativeName}</span>
            {i18n.language === lang.code && (
              <span className="text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};