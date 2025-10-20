import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, AlertTriangle, Info, CheckCircle2, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlertBannerProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  message: string | ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  animate?: boolean;
}

export const AlertBanner = ({
  type = 'info',
  title,
  message,
  dismissible = true,
  onDismiss,
  action,
  className,
  animate = true
}: AlertBannerProps) => {
  const config = {
    info: {
      icon: Info,
      variant: 'default' as const,
      className: 'border-primary/50 bg-primary/10 text-primary-foreground'
    },
    warning: {
      icon: AlertTriangle,
      variant: 'default' as const,
      className: 'border-warning/50 bg-warning/10 text-warning-foreground'
    },
    error: {
      icon: AlertCircle,
      variant: 'destructive' as const,
      className: 'border-destructive/50 bg-destructive/10'
    },
    success: {
      icon: CheckCircle2,
      variant: 'default' as const,
      className: 'border-secondary/50 bg-secondary/10 text-secondary-foreground'
    }
  };

  const { icon: Icon, variant, className: typeClassName } = config[type];

  const banner = (
    <Alert variant={variant} className={cn(typeClassName, className)}>
      <Icon className="h-4 w-4" />
      <div className="flex-1">
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription className="text-sm">
          {message}
        </AlertDescription>
      </div>
      <div className="flex items-center gap-2">
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="ml-auto"
          >
            {action.label}
          </Button>
        )}
        {dismissible && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );

  if (!animate) return banner;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        {banner}
      </motion.div>
    </AnimatePresence>
  );
};

// Specialized critical alert with pulse animation
export const CriticalAlert = ({ 
  message, 
  onDismiss 
}: { 
  message: string; 
  onDismiss?: () => void 
}) => {
  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(239, 68, 68, 0.4)",
          "0 0 0 10px rgba(239, 68, 68, 0)",
          "0 0 0 0 rgba(239, 68, 68, 0)"
        ]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <AlertBanner
        type="error"
        title="Critical Update"
        message={message}
        dismissible={!!onDismiss}
        onDismiss={onDismiss}
        animate={true}
      />
    </motion.div>
  );
};