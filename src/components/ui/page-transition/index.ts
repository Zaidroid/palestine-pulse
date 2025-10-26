/**
 * Page Transition System
 * Export all page transition components and utilities
 */

export {
  PageTransition,
  TabTransition,
  SectionTransition,
  type PageTransitionProps,
  type TabTransitionProps,
  type SectionTransitionProps,
  type TransitionMode,
} from '../page-transition';

export {
  useRoutePreload,
  useRoutePreloadMultiple,
  useIntelligentPreload,
  manualPreloadRoute,
  clearPreloadCache,
  getPreloadCacheStatus,
  type RoutePreloadConfig,
} from '@/hooks/useRoutePreload';

export {
  useScrollRestoration,
  useContainerScrollRestoration,
  getCurrentScrollPosition,
  scrollToTop,
  scrollToElement,
  clearScrollPositions,
} from '@/hooks/useScrollRestoration';
