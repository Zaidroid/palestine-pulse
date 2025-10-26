/**
 * Animation Design Tokens
 * Centralized configuration for all animation durations, easing functions, and spring physics
 */

export const animationTokens = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 400,
    slower: 600,
    slowest: 1000,
    counter: 1500,
    draw: 1200,
    pulse: 1500,
    shimmer: 1500,
  },
  
  easing: {
    linear: [0, 0, 1, 1],
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: [0.34, 1.56, 0.64, 1],
  },
  
  spring: {
    gentle: { 
      stiffness: 200, 
      damping: 20,
      mass: 1,
    },
    default: { 
      stiffness: 300, 
      damping: 25,
      mass: 1,
    },
    snappy: { 
      stiffness: 400, 
      damping: 30,
      mass: 1,
    },
    bouncy: { 
      stiffness: 500, 
      damping: 20,
      mass: 1,
    },
    navigation: {
      stiffness: 350,
      damping: 35,
      mass: 1,
    },
  },
  
  stagger: {
    fast: 50,
    normal: 100,
    slow: 150,
  },
} as const;

export type AnimationDuration = keyof typeof animationTokens.duration;
export type AnimationEasing = keyof typeof animationTokens.easing;
export type SpringPreset = keyof typeof animationTokens.spring;
export type StaggerDelay = keyof typeof animationTokens.stagger;
