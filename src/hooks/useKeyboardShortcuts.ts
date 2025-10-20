import { useEffect } from 'react';

export type ShortcutHandler = (event: KeyboardEvent) => void;

export interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: ShortcutHandler;
  description?: string;
}

export const useKeyboardShortcuts = (shortcuts: Shortcut[], enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatches = shortcut.alt ? event.altKey : !event.altKey;
        const metaMatches = shortcut.meta ? event.metaKey : !event.metaKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          event.preventDefault();
          shortcut.handler(event);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
};

// Global shortcuts hook for V3
export const useV3Shortcuts = (callbacks: {
  onOpenFilters?: () => void;
  onCloseFilters?: () => void;
  onToggleTheme?: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
}) => {
  const shortcuts: Shortcut[] = [
    {
      key: 'f',
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        callbacks.onOpenFilters?.();
      },
      description: 'Open filters'
    },
    {
      key: 'Escape',
      handler: () => {
        callbacks.onCloseFilters?.();
      },
      description: 'Close filters/dialogs'
    },
    {
      key: 'd',
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        callbacks.onToggleTheme?.();
      },
      description: 'Toggle dark mode'
    },
    {
      key: 'e',
      ctrl: true,
      shift: true,
      handler: (e) => {
        e.preventDefault();
        callbacks.onExport?.();
      },
      description: 'Export data'
    },
    {
      key: 'r',
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        callbacks.onRefresh?.();
      },
      description: 'Refresh data'
    }
  ];

  useKeyboardShortcuts(shortcuts);
};