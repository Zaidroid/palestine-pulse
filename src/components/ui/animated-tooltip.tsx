/**
 * Animated Tooltip Component
 * Tooltip with fade + slide animations from trigger direction
 * Includes configurable delay for hover tooltips
 */

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { cn } from '../../lib/utils';
import { animationTokens } from '../../lib/animation/tokens';
import { useReducedMotion } from '../../lib/animation/hooks';

/**
 * Tooltip animation variants based on side
 */
const createTooltipVariants = (side: 'top' | 'right' | 'bottom' | 'left'): Variants => {
  const offset = 10;
  const slideOffset = {
    top: { x: 0, y: offset },
    right: { x: -offset, y: 0 },
    bottom: { x: 0, y: -offset },
    left: { x: offset, y: 0 },
  };

  return {
    hidden: {
      opacity: 0,
      scale: 0.95,
      ...slideOffset[side],
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        duration: animationTokens.duration.fast / 1000,
        ease: animationTokens.easing.easeOut,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      ...slideOffset[side],
      transition: {
        duration: animationTokens.duration.instant / 1000,
        ease: animationTokens.easing.easeIn,
      },
    },
  };
};

/**
 * Animated Tooltip Provider
 */
const AnimatedTooltipProvider = TooltipPrimitive.Provider;

/**
 * Animated Tooltip Root
 */
export interface AnimatedTooltipProps extends TooltipPrimitive.TooltipProps {
  /**
   * Delay before showing tooltip on hover (in milliseconds)
   * @default 200
   */
  delayDuration?: number;
}

const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({
  delayDuration = 200,
  ...props
}) => {
  return <TooltipPrimitive.Root delayDuration={delayDuration} {...props} />;
};

/**
 * Animated Tooltip Trigger
 */
const AnimatedTooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Animated Tooltip Content
 */
export interface AnimatedTooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  /**
   * Whether to show arrow
   * @default true
   */
  showArrow?: boolean;
}

const AnimatedTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  AnimatedTooltipContentProps
>(
  (
    {
      className,
      sideOffset = 4,
      side = 'top',
      showArrow = true,
      children,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [isOpen, setIsOpen] = React.useState(false);

    // Get variants based on side
    const variants = React.useMemo(
      () => createTooltipVariants(side),
      [side]
    );

    // If reduced motion, use standard tooltip without animation
    if (prefersReducedMotion) {
      return (
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            ref={ref}
            side={side}
            sideOffset={sideOffset}
            className={cn(
              'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
              className
            )}
            {...props}
          >
            {children}
            {showArrow && (
              <TooltipPrimitive.Arrow className="fill-popover" />
            )}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      );
    }

    return (
      <AnimatePresence>
        <TooltipPrimitive.Portal forceMount>
          <TooltipPrimitive.Content
            ref={ref}
            side={side}
            sideOffset={sideOffset}
            asChild
            onPointerDownOutside={() => setIsOpen(false)}
            {...props}
          >
            <motion.div
              className={cn(
                'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
                className
              )}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {children}
              {showArrow && (
                <TooltipPrimitive.Arrow className="fill-popover" />
              )}
            </motion.div>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </AnimatePresence>
    );
  }
);

AnimatedTooltipContent.displayName = 'AnimatedTooltipContent';

/**
 * Simple Animated Tooltip
 * Convenience component for common use case
 */
export interface SimpleAnimatedTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
  showArrow?: boolean;
  className?: string;
}

export const SimpleAnimatedTooltip: React.FC<SimpleAnimatedTooltipProps> = ({
  content,
  children,
  side = 'top',
  delayDuration = 200,
  showArrow = true,
  className,
}) => {
  return (
    <AnimatedTooltipProvider>
      <AnimatedTooltip delayDuration={delayDuration}>
        <AnimatedTooltipTrigger asChild>{children}</AnimatedTooltipTrigger>
        <AnimatedTooltipContent
          side={side}
          showArrow={showArrow}
          className={className}
        >
          {content}
        </AnimatedTooltipContent>
      </AnimatedTooltip>
    </AnimatedTooltipProvider>
  );
};

/**
 * Info Tooltip
 * Tooltip with info icon trigger
 */
export interface InfoTooltipProps {
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
  iconClassName?: string;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  side = 'top',
  delayDuration = 200,
  iconClassName,
  className,
}) => {
  return (
    <SimpleAnimatedTooltip
      content={content}
      side={side}
      delayDuration={delayDuration}
      className={className}
    >
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center rounded-full',
          'text-muted-foreground hover:text-foreground',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          iconClassName
        )}
        aria-label="More information"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </button>
    </SimpleAnimatedTooltip>
  );
};

/**
 * Metric Tooltip
 * Specialized tooltip for metric cards with definition
 */
export interface MetricTooltipProps {
  title: string;
  definition: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
}

export const MetricTooltip: React.FC<MetricTooltipProps> = ({
  title,
  definition,
  children,
  side = 'top',
  delayDuration = 200,
}) => {
  return (
    <SimpleAnimatedTooltip
      content={
        <div className="max-w-xs space-y-1">
          <p className="font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{definition}</p>
        </div>
      }
      side={side}
      delayDuration={delayDuration}
    >
      {children}
    </SimpleAnimatedTooltip>
  );
};

/**
 * Hook for managing tooltip state
 */
export interface UseTooltipStateOptions {
  defaultOpen?: boolean;
  delayDuration?: number;
  onOpenChange?: (open: boolean) => void;
}

export function useTooltipState(options: UseTooltipStateOptions = {}) {
  const { defaultOpen = false, delayDuration = 200, onOpenChange } = options;

  const [open, setOpen] = React.useState(defaultOpen);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (newOpen) {
        timeoutRef.current = setTimeout(() => {
          setOpen(true);
          onOpenChange?.(true);
        }, delayDuration);
      } else {
        setOpen(false);
        onOpenChange?.(false);
      }
    },
    [delayDuration, onOpenChange]
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    open,
    onOpenChange: handleOpenChange,
  };
}

export {
  AnimatedTooltip,
  AnimatedTooltipTrigger,
  AnimatedTooltipContent,
  AnimatedTooltipProvider,
};
