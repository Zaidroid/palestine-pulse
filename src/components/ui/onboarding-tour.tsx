/**
 * OnboardingTour Component
 * Step-by-step guided tour for first-time users
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card } from "./card";

export interface TourStep {
  target: string; // CSS selector for the element to highlight
  title: string;
  content: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  spotlightPadding?: number;
}

export interface OnboardingTourProps {
  steps: TourStep[];
  storageKey?: string;
  onComplete?: () => void;
  onSkip?: () => void;
  autoStart?: boolean;
}

const TOUR_STORAGE_PREFIX = 'onboarding-tour-completed-';

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  steps,
  storageKey = 'default',
  onComplete,
  onSkip,
  autoStart = false,
}) => {
  const [isActive, setIsActive] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [tooltipPosition, setTooltipPosition] = React.useState({ top: 0, left: 0 });
  const [spotlightRect, setSpotlightRect] = React.useState<DOMRect | null>(null);

  const fullStorageKey = `${TOUR_STORAGE_PREFIX}${storageKey}`;

  // Check if tour has been completed
  React.useEffect(() => {
    const completed = localStorage.getItem(fullStorageKey);
    if (!completed && autoStart) {
      // Small delay to ensure DOM is ready
      setTimeout(() => setIsActive(true), 500);
    }
  }, [fullStorageKey, autoStart]);

  // Update spotlight and tooltip position when step changes
  React.useEffect(() => {
    if (!isActive || !steps[currentStep]) return;

    const updatePosition = () => {
      const step = steps[currentStep];
      const targetElement = document.querySelector(step.target);
      
      if (!targetElement) {
        console.warn(`Tour target not found: ${step.target}`);
        return;
      }

      const rect = targetElement.getBoundingClientRect();
      setSpotlightRect(rect);

      // Calculate tooltip position based on placement
      const placement = step.placement || 'bottom';
      const padding = 16;
      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = rect.top - padding;
          left = rect.left + rect.width / 2;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + padding;
          break;
        case 'bottom':
          top = rect.bottom + padding;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - padding;
          break;
      }

      setTooltipPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isActive, currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(fullStorageKey, 'true');
    setIsActive(false);
    setCurrentStep(0);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem(fullStorageKey, 'true');
    setIsActive(false);
    setCurrentStep(0);
    onSkip?.();
  };

  const startTour = () => {
    setIsActive(true);
    setCurrentStep(0);
  };

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const placement = step?.placement || 'bottom';

  // Calculate transform origin based on placement
  const getTransformOrigin = () => {
    switch (placement) {
      case 'top':
        return 'bottom center';
      case 'right':
        return 'left center';
      case 'bottom':
        return 'top center';
      case 'left':
        return 'right center';
      default:
        return 'top center';
    }
  };

  return (
    <>
      <AnimatePresence>
        {isActive && (
          <>
            {/* Backdrop with spotlight */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100]"
              style={{
                background: spotlightRect
                  ? `radial-gradient(circle at ${spotlightRect.left + spotlightRect.width / 2}px ${
                      spotlightRect.top + spotlightRect.height / 2
                    }px, transparent ${Math.max(spotlightRect.width, spotlightRect.height) / 2 + (step?.spotlightPadding || 8)}px, rgba(0, 0, 0, 0.7) ${
                      Math.max(spotlightRect.width, spotlightRect.height) / 2 + (step?.spotlightPadding || 8) + 100
                    }px)`
                  : 'rgba(0, 0, 0, 0.7)',
              }}
              onClick={handleSkip}
            />

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="fixed z-[101]"
              style={{
                top: tooltipPosition.top,
                left: tooltipPosition.left,
                transformOrigin: getTransformOrigin(),
                transform:
                  placement === 'top'
                    ? 'translate(-50%, -100%)'
                    : placement === 'right'
                    ? 'translate(0, -50%)'
                    : placement === 'bottom'
                    ? 'translate(-50%, 0)'
                    : 'translate(-100%, -50%)',
              }}
            >
              <Card className="w-80 p-4 shadow-2xl border-2">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          Step {currentStep + 1} of {steps.length}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-base">{step.title}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 -mt-1 -mr-1"
                      onClick={handleSkip}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="text-sm text-muted-foreground">
                    {step.content}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex gap-1">
                      {steps.map((_, index) => (
                        <div
                          key={index}
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            index === currentStep
                              ? "w-6 bg-primary"
                              : "w-1.5 bg-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>

                    <Button
                      size="sm"
                      onClick={handleNext}
                      className="gap-1"
                    >
                      {isLastStep ? (
                        <>
                          <Check className="h-4 w-4" />
                          Finish
                        </>
                      ) : (
                        <>
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Expose method to start tour programmatically */}
      {React.useEffect(() => {
        (window as any).__startOnboardingTour = startTour;
        return () => {
          delete (window as any).__startOnboardingTour;
        };
      }, [])}
    </>
  );
};

OnboardingTour.displayName = "OnboardingTour";

// Hook to check if tour has been completed
export const useOnboardingTourCompleted = (storageKey: string = 'default'): boolean => {
  const [completed, setCompleted] = React.useState(false);

  React.useEffect(() => {
    const fullStorageKey = `${TOUR_STORAGE_PREFIX}${storageKey}`;
    const isCompleted = localStorage.getItem(fullStorageKey) === 'true';
    setCompleted(isCompleted);
  }, [storageKey]);

  return completed;
};

// Hook to reset tour completion
export const useResetOnboardingTour = () => {
  return React.useCallback((storageKey: string = 'default') => {
    const fullStorageKey = `${TOUR_STORAGE_PREFIX}${storageKey}`;
    localStorage.removeItem(fullStorageKey);
    
    // Trigger tour if available
    if ((window as any).__startOnboardingTour) {
      (window as any).__startOnboardingTour();
    }
  }, []);
};
