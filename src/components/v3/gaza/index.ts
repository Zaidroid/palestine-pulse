import { lazy } from 'react';

// Lazy load Gaza dashboard components for better performance
export const HumanitarianCrisis = lazy(() => import('./HumanitarianCrisis').then(m => ({ default: m.HumanitarianCrisis })));
export const InfrastructureDestruction = lazy(() => import('./InfrastructureDestruction').then(m => ({ default: m.InfrastructureDestruction })));
export const PopulationImpact = lazy(() => import('./PopulationImpact').then(m => ({ default: m.PopulationImpact })));
export const AidSurvival = lazy(() => import('./AidSurvival').then(m => ({ default: m.AidSurvival })));