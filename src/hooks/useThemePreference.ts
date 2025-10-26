/**
 * Theme Preference Hook
 * 
 * Manages theme preference with localStorage persistence and system preference detection.
 * Built on top of next-themes for consistent theme management.
 */

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemePreference {
  /** Current active theme (resolved from system if set to 'system') */
  theme: 'light' | 'dark';
  /** Theme mode including 'system' option */
  themeMode: ThemeMode;
  /** Set theme mode */
  setThemeMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark */
  toggleTheme: () => void;
  /** Whether the component is mounted (prevents hydration issues) */
  mounted: boolean;
  /** System preference (if available) */
  systemTheme: 'light' | 'dark' | undefined;
}

/**
 * Hook for managing theme preferences
 * 
 * Features:
 * - Persists theme preference to localStorage
 * - Respects system preference on first visit
 * - Smooth transitions between themes
 * - Prevents flash of unstyled content
 * 
 * @example
 * ```tsx
 * const { theme, themeMode, setThemeMode, toggleTheme } = useThemePreference();
 * 
 * // Toggle between light and dark
 * <button onClick={toggleTheme}>Toggle Theme</button>
 * 
 * // Set specific theme mode
 * <button onClick={() => setThemeMode('system')}>Use System Theme</button>
 * ```
 */
export const useThemePreference = (): ThemePreference => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setTheme(mode);
  };

  const toggleTheme = () => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Resolve actual theme (handle 'system' mode)
  const resolvedTheme = (theme === 'system' ? systemTheme : theme) as 'light' | 'dark';

  return {
    theme: resolvedTheme || 'dark',
    themeMode: theme as ThemeMode,
    setThemeMode,
    toggleTheme,
    mounted,
    systemTheme: systemTheme as 'light' | 'dark' | undefined,
  };
};

/**
 * Hook to detect system theme preference
 */
export const useSystemTheme = (): 'light' | 'dark' => {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check initial system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return systemTheme;
};

/**
 * Hook to check if user prefers reduced motion
 */
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

/**
 * Get theme-specific value
 * 
 * @example
 * ```tsx
 * const { getThemeValue } = useThemePreference();
 * const iconColor = getThemeValue('#000', '#fff');
 * ```
 */
export const useThemeValue = <T,>(lightValue: T, darkValue: T): T => {
  const { theme } = useThemePreference();
  return theme === 'dark' ? darkValue : lightValue;
};

/**
 * Theme storage key (used by next-themes)
 */
export const THEME_STORAGE_KEY = 'theme';

/**
 * Get stored theme preference
 */
export const getStoredTheme = (): ThemeMode | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored as ThemeMode;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  
  return null;
};

/**
 * Check if this is the user's first visit (no stored theme)
 */
export const isFirstVisit = (): boolean => {
  return getStoredTheme() === null;
};
