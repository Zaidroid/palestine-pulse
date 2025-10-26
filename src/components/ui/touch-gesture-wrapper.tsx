/**
 * Touch Gesture Wrapper Components
 * Provides easy-to-use wrappers for touch gestures
 */

import React, { useRef, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useSwipeGesture, usePinchGesture, usePullToRefresh, usePressGesture } from '@/hooks/useTouchGestures';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface SwipeableProps extends React.HTMLAttributes<HTMLDivElement> {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  velocityThreshold?: number;
  children: React.ReactNode;
}

/**
 * Swipeable wrapper component
 */
export const Swipeable = forwardRef<HTMLDivElement, SwipeableProps>(
  (
    {
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      threshold,
      velocityThreshold,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const elementRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;

    useSwipeGesture(elementRef, {
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      threshold,
      velocityThreshold,
    });

    return (
      <div ref={elementRef} className={cn('touch-pan-y', className)} {...props}>
        {children}
      </div>
    );
  }
);

Swipeable.displayName = 'Swipeable';

export interface PinchableProps extends React.HTMLAttributes<HTMLDivElement> {
  onPinchStart?: (scale: number) => void;
  onPinch?: (scale: number) => void;
  onPinchEnd?: (scale: number) => void;
  minScale?: number;
  maxScale?: number;
  children: React.ReactNode;
}

/**
 * Pinchable wrapper component for zoom gestures
 */
export const Pinchable = forwardRef<HTMLDivElement, PinchableProps>(
  (
    {
      onPinchStart,
      onPinch,
      onPinchEnd,
      minScale,
      maxScale,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const elementRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;
    const [scale, setScale] = React.useState(1);

    usePinchGesture(elementRef, {
      onPinchStart: (s) => {
        onPinchStart?.(s);
      },
      onPinch: (s) => {
        setScale(s);
        onPinch?.(s);
      },
      onPinchEnd: (s) => {
        onPinchEnd?.(s);
      },
      minScale,
      maxScale,
    });

    return (
      <div
        ref={elementRef}
        className={cn('touch-none', className)}
        style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Pinchable.displayName = 'Pinchable';

export interface PullToRefreshProps extends React.HTMLAttributes<HTMLDivElement> {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPullDistance?: number;
  disabled?: boolean;
  children: React.ReactNode;
}

/**
 * Pull-to-refresh wrapper component
 */
export const PullToRefreshWrapper = forwardRef<HTMLDivElement, PullToRefreshProps>(
  (
    {
      onRefresh,
      threshold,
      maxPullDistance,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const elementRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;

    const { isRefreshing, pullDistance, progress } = usePullToRefresh(elementRef, {
      onRefresh,
      threshold,
      maxPullDistance,
      disabled,
    });

    return (
      <div ref={elementRef} className={cn('relative overflow-auto', className)} {...props}>
        {/* Pull indicator */}
        <motion.div
          className="absolute top-0 left-0 right-0 flex items-center justify-center"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isRefreshing ? 60 : pullDistance,
            opacity: pullDistance > 0 ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            {isRefreshing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Refreshing...</span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ rotate: progress * 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Loader2 className="h-5 w-5" />
                </motion.div>
                <span className="text-sm">
                  {progress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
                </span>
              </>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          animate={{
            marginTop: isRefreshing ? 60 : pullDistance,
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    );
  }
);

PullToRefreshWrapper.displayName = 'PullToRefreshWrapper';

export interface TouchableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pressScale?: number;
}

/**
 * Touchable wrapper with press feedback
 */
export const Touchable = forwardRef<HTMLDivElement, TouchableProps>(
  ({ children, pressScale = 0.95, className, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const elementRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;

    const { isPressed } = usePressGesture(elementRef);

    return (
      <motion.div
        ref={elementRef}
        className={cn('cursor-pointer select-none', className)}
        animate={{
          scale: isPressed ? pressScale : 1,
        }}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Touchable.displayName = 'Touchable';
