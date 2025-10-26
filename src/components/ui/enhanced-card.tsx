/**
 * EnhancedCard Component
 * Modern card component with gradient backgrounds, hover animations, and loading states
 */

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "../../lib/utils";
import { useReducedMotion } from "../../lib/animation/hooks";
import { LoadingSkeleton as LoadingSkeletonComponent } from "./loading-skeleton";
import { animationTokens } from "../../lib/animation/tokens";

export interface GradientConfig {
  from: string;
  to: string;
  direction?: 'r' | 'br' | 'b' | 'bl' | 'l' | 'tl' | 't' | 'tr';
}

export interface EnhancedCardProps {
  gradient?: GradientConfig;
  loading?: boolean;
  hoverable?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  id?: string;
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

const gradientDirectionMap = {
  r: 'to right',
  br: 'to bottom right',
  b: 'to bottom',
  bl: 'to bottom left',
  l: 'to left',
  tl: 'to top left',
  t: 'to top',
  tr: 'to top right',
};

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ 
    className, 
    gradient, 
    loading = false, 
    hoverable = true, 
    children,
    style: customStyle,
    onClick,
    onMouseEnter,
    onMouseLeave,
    id,
    role,
    ...ariaProps
  }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    const cardVariants: Variants = {
      rest: {
        scale: 1,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      },
      hover: {
        scale: hoverable ? 1.03 : 1,
        boxShadow: hoverable
          ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
          : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        transition: {
          duration: animationTokens.duration.normal / 1000,
          ease: animationTokens.easing.easeOut,
        },
      },
    };

    const gradientStyle = gradient
      ? {
          ...customStyle,
          backgroundImage: `linear-gradient(${gradientDirectionMap[gradient.direction || 'br']}, ${gradient.from}, ${gradient.to})`,
        }
      : customStyle;

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-xl border bg-card text-card-foreground overflow-hidden",
            className
          )}
          style={gradientStyle}
          id={id}
          role={role}
          {...ariaProps}
        >
          <LoadingSkeletonComponent variant="card" />
        </div>
      );
    }

    if (prefersReducedMotion || !hoverable) {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-xl border bg-card text-card-foreground shadow-sm",
            hoverable && "cursor-pointer",
            className
          )}
          style={gradientStyle}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          id={id}
          role={role}
          {...ariaProps}
        >
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl border bg-card text-card-foreground",
          hoverable && "cursor-pointer",
          className
        )}
        style={gradientStyle}
        variants={cardVariants}
        initial="rest"
        whileHover="hover"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        id={id}
        role={role}
        {...ariaProps}
      >
        {children}
      </motion.div>
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";

/**
 * EnhancedCardHeader Component
 */
const EnhancedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
EnhancedCardHeader.displayName = "EnhancedCardHeader";

/**
 * EnhancedCardTitle Component
 */
const EnhancedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none tracking-tight text-muted-foreground",
      className
    )}
    {...props}
  />
));
EnhancedCardTitle.displayName = "EnhancedCardTitle";

/**
 * EnhancedCardDescription Component
 */
const EnhancedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
EnhancedCardDescription.displayName = "EnhancedCardDescription";

/**
 * EnhancedCardContent Component
 */
const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
EnhancedCardContent.displayName = "EnhancedCardContent";

/**
 * EnhancedCardFooter Component
 */
const EnhancedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
EnhancedCardFooter.displayName = "EnhancedCardFooter";

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  EnhancedCardFooter,
};
