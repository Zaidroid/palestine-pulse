/**
 * Shareable State Hook
 * 
 * Manages encoding/decoding of application state in URL parameters
 * for sharing dashboard views with specific filters and settings
 */

import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ShareableState {
  [key: string]: any;
}

interface UseShareableStateOptions {
  defaultState?: ShareableState;
  onStateChange?: (state: ShareableState) => void;
}

export const useShareableState = (options: UseShareableStateOptions = {}) => {
  const { defaultState = {}, onStateChange } = options;
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState<ShareableState>(defaultState);

  // Parse state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const parsedState: ShareableState = {};

    params.forEach((value, key) => {
      try {
        // Try to parse as JSON first
        parsedState[key] = JSON.parse(value);
      } catch {
        // If not JSON, use as string
        parsedState[key] = value;
      }
    });

    if (Object.keys(parsedState).length > 0) {
      setState(parsedState);
      onStateChange?.(parsedState);
    }
  }, [location.search, onStateChange]);

  // Update state and URL
  const updateState = useCallback((newState: Partial<ShareableState>, replace = false) => {
    const updatedState = { ...state, ...newState };
    setState(updatedState);

    // Update URL
    const params = new URLSearchParams();
    Object.entries(updatedState).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    });

    const newUrl = `${location.pathname}?${params.toString()}`;
    
    if (replace) {
      navigate(newUrl, { replace: true });
    } else {
      navigate(newUrl);
    }

    onStateChange?.(updatedState);
  }, [state, location.pathname, navigate, onStateChange]);

  // Clear state
  const clearState = useCallback(() => {
    setState(defaultState);
    navigate(location.pathname, { replace: true });
    onStateChange?.(defaultState);
  }, [defaultState, location.pathname, navigate, onStateChange]);

  // Get shareable URL
  const getShareableUrl = useCallback((): string => {
    const params = new URLSearchParams();
    
    Object.entries(state).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    });

    const queryString = params.toString();
    const baseUrl = window.location.origin + location.pathname;
    
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }, [state, location.pathname]);

  return {
    state,
    updateState,
    clearState,
    getShareableUrl,
  };
};

/**
 * Hook to restore state from URL parameters
 */
export const useRestoreFromUrl = <T extends ShareableState>(
  defaultState: T,
  onRestore?: (state: T) => void
): T => {
  const [restoredState, setRestoredState] = useState<T>(defaultState);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (params.toString()) {
      const parsed: any = { ...defaultState };
      
      params.forEach((value, key) => {
        try {
          parsed[key] = JSON.parse(value);
        } catch {
          parsed[key] = value;
        }
      });

      setRestoredState(parsed);
      onRestore?.(parsed);
    }
  }, [location.search]);

  return restoredState;
};

/**
 * Generate shareable URL with custom state
 */
export const generateShareableUrl = (
  state: ShareableState,
  baseUrl?: string
): string => {
  const params = new URLSearchParams();
  
  Object.entries(state).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }
  });

  const url = baseUrl || window.location.href.split('?')[0];
  const queryString = params.toString();
  
  return queryString ? `${url}?${queryString}` : url;
};

/**
 * Parse state from URL string
 */
export const parseStateFromUrl = (url: string): ShareableState => {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const state: ShareableState = {};

    params.forEach((value, key) => {
      try {
        state[key] = JSON.parse(value);
      } catch {
        state[key] = value;
      }
    });

    return state;
  } catch (error) {
    console.error('Failed to parse state from URL:', error);
    return {};
  }
};
