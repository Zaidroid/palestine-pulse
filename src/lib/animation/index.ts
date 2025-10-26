/**
 * Animation System
 * Centralized export for all animation utilities, tokens, variants, and hooks
 */

// Export animation tokens
export * from './tokens';

// Export animation variants
export * from './variants';

// Export animation hooks
export * from './hooks';

// Export interaction feedback utilities
export * from './interaction-feedback';

// Re-export commonly used Framer Motion utilities
export { motion, AnimatePresence, type Variants, type Transition } from 'framer-motion';
