/**
 * Animation System Demo Component
 * Demonstrates the usage of animation system utilities
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  fadeInVariants,
  slideUpVariants,
  pressScaleVariants,
  staggerContainerVariants,
  staggerItemVariants,
  useIntersectionAnimation,
  useCountUp,
  useReducedMotion,
  animationTokens,
} from '../index';

/**
 * Example 1: Fade In Animation
 */
export function FadeInExample() {
  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      className="p-4 bg-blue-100 rounded"
    >
      This element fades in smoothly
    </motion.div>
  );
}

/**
 * Example 2: Slide Up Animation
 */
export function SlideUpExample() {
  return (
    <motion.div
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
      className="p-4 bg-green-100 rounded"
    >
      This element slides up while fading in
    </motion.div>
  );
}

/**
 * Example 3: Interactive Button
 */
export function InteractiveButtonExample() {
  return (
    <motion.button
      variants={pressScaleVariants}
      initial="rest"
      whileHover="hover"
      whileTap="press"
      className="px-6 py-3 bg-blue-500 text-white rounded-lg"
    >
      Click Me
    </motion.button>
  );
}

/**
 * Example 4: Staggered List
 */
export function StaggeredListExample() {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={staggerItemVariants}
          className="p-4 bg-purple-100 rounded"
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * Example 5: Intersection Animation
 */
export function IntersectionExample() {
  const { ref, controls } = useIntersectionAnimation({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      variants={slideUpVariants}
      initial={controls.initial}
      animate={controls.animate}
      className="p-4 bg-yellow-100 rounded"
    >
      This animates when scrolled into view
    </motion.div>
  );
}

/**
 * Example 6: Animated Counter
 */
export function CounterExample() {
  const { formattedCount } = useCountUp({
    start: 0,
    end: 1000,
    duration: animationTokens.duration.counter,
    decimals: 0,
  });

  return (
    <div className="p-4 bg-red-100 rounded">
      <div className="text-4xl font-bold font-mono">{formattedCount}</div>
      <div className="text-sm text-gray-600">Animated Counter</div>
    </div>
  );
}

/**
 * Example 7: Reduced Motion Aware
 */
export function ReducedMotionExample() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="p-4 bg-gray-100 rounded">
      <p>
        Reduced Motion: <strong>{prefersReducedMotion ? 'Yes' : 'No'}</strong>
      </p>
      <motion.div
        animate={{
          scale: prefersReducedMotion ? 1 : [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="mt-2 w-16 h-16 bg-blue-500 rounded"
      />
    </div>
  );
}

/**
 * Complete Demo Component
 */
export function AnimationSystemDemo() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Animation System Demo</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">1. Fade In</h2>
        <FadeInExample />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">2. Slide Up</h2>
        <SlideUpExample />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">3. Interactive Button</h2>
        <InteractiveButtonExample />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">4. Staggered List</h2>
        <StaggeredListExample />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">5. Intersection Animation</h2>
        <IntersectionExample />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">6. Animated Counter</h2>
        <CounterExample />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">7. Reduced Motion Aware</h2>
        <ReducedMotionExample />
      </section>
    </div>
  );
}
