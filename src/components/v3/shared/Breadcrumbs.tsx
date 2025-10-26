import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { animationTokens } from "@/lib/animation/tokens";
import { useReducedMotion } from "@/lib/animation/hooks";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  const prefersReducedMotion = useReducedMotion();

  // Fade-in animation for breadcrumbs
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : animationTokens.stagger.fast / 1000,
        delayChildren: 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: animationTokens.duration.normal / 1000,
        ease: animationTokens.easing.easeOut,
      },
    },
  };

  const hoverVariants = {
    rest: { scale: 1 },
    hover: {
      scale: prefersReducedMotion ? 1 : 1.05,
      transition: {
        duration: animationTokens.duration.fast / 1000,
        ease: animationTokens.easing.easeOut,
      },
    },
  };

  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm", className)}
    >
      <motion.ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const Icon = item.icon;

          return (
            <motion.li
              key={`${item.label}-${index}`}
              variants={itemVariants}
              className="flex items-center space-x-1"
            >
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              
              {item.href && !isLast ? (
                <motion.div
                  variants={hoverVariants}
                  initial="rest"
                  whileHover="hover"
                >
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-md",
                      "text-muted-foreground hover:text-foreground",
                      "transition-colors duration-200",
                      "hover:bg-muted/50"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ) : (
                <span
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1",
                    isLast
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </span>
              )}
            </motion.li>
          );
        })}
      </motion.ol>
    </motion.nav>
  );
};
