/**
 * Pinchable Chart Component
 * Wraps charts with pinch-to-zoom functionality for mobile
 */

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePinchGesture } from '@/hooks/useTouchGestures';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from './button';

export interface PinchableChartProps {
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
  className?: string;
  showControls?: boolean;
}

/**
 * Chart wrapper with pinch-to-zoom support
 */
export function PinchableChart({
  children,
  minScale = 1,
  maxScale = 3,
  className,
  showControls = true,
}: PinchableChartProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobileOrTablet } = useBreakpoint();

  const { setScale: updateScale } = usePinchGesture(containerRef, {
    onPinch: (newScale) => {
      setScale(newScale);
    },
    minScale,
    maxScale,
  });

  const handleZoomIn = () => {
    const newScale = Math.min(scale + 0.5, maxScale);
    setScale(newScale);
    updateScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.5, minScale);
    setScale(newScale);
    updateScale(newScale);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    updateScale(1);
  };

  // Only enable pinch on mobile/tablet
  if (!isMobileOrTablet) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Zoom controls */}
      {showControls && scale > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-2 right-2 z-10 flex gap-1 bg-background/80 backdrop-blur-sm rounded-lg p-1 shadow-lg"
        >
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleZoomOut}
            disabled={scale <= minScale}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleReset}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleZoomIn}
            disabled={scale >= maxScale}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {/* Scale indicator */}
      {scale > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 left-2 z-10 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium shadow-lg"
        >
          {Math.round(scale * 100)}%
        </motion.div>
      )}

      {/* Chart container */}
      <motion.div
        ref={containerRef}
        className="touch-none"
        style={{
          scale,
          x: position.x,
          y: position.y,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>

      {/* Hint text */}
      {scale === 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full">
          Pinch to zoom
        </div>
      )}
    </div>
  );
}
