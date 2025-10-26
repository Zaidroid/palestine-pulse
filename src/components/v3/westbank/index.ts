import { lazy } from 'react';

// Lazy load West Bank dashboard components for better performance
export const OccupationMetrics = lazy(() => import('./OccupationMetrics').then(m => ({ default: m.OccupationMetrics })));
export const SettlerViolence = lazy(() => import('./SettlerViolence').then(m => ({ default: m.SettlerViolence })));
export const EconomicStrangulation = lazy(() => import('./EconomicStrangulation').then(m => ({ default: m.EconomicStrangulation })));
export const PrisonersDetention = lazy(() => import('./PrisonersDetention').then(m => ({ default: m.PrisonersDetention })));