import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideIcon } from "lucide-react";
import { animationTokens } from "@/lib/animation/tokens";
import { useReducedMotion } from "@/lib/animation/hooks";
import { Badge } from "@/components/ui/badge";

interface Tab {
  value: string;
  label: string;
  icon: LucideIcon;
  color?: string;
  badge?: number;
}

interface PillTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  isMobile?: boolean;
  variant?: 'main' | 'sub';
}

export const PillTabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  isMobile = false,
  variant = 'sub'
}: PillTabsProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Animation variants for hover and press states
  const tabVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: prefersReducedMotion ? 1 : 1.05,
      transition: {
        duration: animationTokens.duration.fast / 1000,
        ease: animationTokens.easing.easeOut,
      },
    },
    press: {
      scale: prefersReducedMotion ? 1 : 0.95,
      transition: {
        duration: animationTokens.duration.instant / 1000,
        ease: animationTokens.easing.easeIn,
      },
    },
  };

  // Icon scale animation on tab change (subtle)
  const iconVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: prefersReducedMotion ? 1 : [1, 1.1, 1],
      transition: {
        duration: animationTokens.duration.fast / 1000,
        ease: animationTokens.easing.easeOut,
      },
    },
  };

  // Badge pulse animation
  const badgePulseVariants = {
    pulse: {
      scale: prefersReducedMotion ? 1 : [1, 1.1, 1],
      transition: {
        duration: animationTokens.duration.pulse / 1000,
        repeat: Infinity,
        ease: animationTokens.easing.easeInOut,
      },
    },
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className={cn(
        "h-auto p-1 rounded-full",
        "bg-muted/80 dark:bg-muted/40",
        "gap-1",
        isMobile && variant === 'sub' ? "grid grid-cols-2 w-full" : "inline-flex"
      )}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              asChild
            >
              <motion.button
                variants={tabVariants}
                initial="rest"
                whileHover="hover"
                whileTap="press"
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium rounded-full",
                  "transition-all duration-300",
                  "hover:text-foreground",
                  // Override default TabsTrigger active state (which uses bg-primary)
                  "data-[state=active]:bg-transparent",
                  isMobile && variant === 'sub' ? "flex-col h-16 gap-1" : "flex-row",
                  "flex items-center justify-center gap-2"
                )}
              >
                <div className="relative z-10 flex items-center gap-2">
                  <motion.div
                    key={`icon-${tab.value}-${isActive}`}
                    variants={iconVariants}
                    initial="initial"
                    animate={isActive ? "animate" : "initial"}
                  >
                    <tab.icon className={cn(
                      "h-4 w-4",
                      tab.color || (isActive ? "text-foreground" : "text-muted-foreground/70")
                    )} />
                  </motion.div>
                  <span className={cn(
                    "transition-colors font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground/70"
                  )}>
                    {tab.label}
                  </span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <motion.div
                      variants={badgePulseVariants}
                      animate="pulse"
                    >
                      <Badge 
                        variant="destructive" 
                        className="h-5 min-w-5 px-1 text-xs"
                      >
                        {tab.badge}
                      </Badge>
                    </motion.div>
                  )}
                </div>

                {isActive && (
                  <motion.div
                    layoutId={`active-pill-${variant}-${isMobile}`}
                    className={cn(
                      "absolute inset-0 rounded-full",
                      "bg-card dark:bg-card",
                      "shadow-lg dark:shadow-xl",
                      "border border-border/60 dark:border-border/40"
                    )}
                    style={{ zIndex: 0 }}
                    transition={{ 
                      type: "spring", 
                      ...animationTokens.spring.navigation,
                    }}
                  />
                )}
              </motion.button>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};