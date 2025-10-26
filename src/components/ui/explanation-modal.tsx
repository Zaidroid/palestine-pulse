/**
 * ExplanationModal Component
 * Display detailed explanations for complex visualizations and metrics
 */

import * as React from "react";
import { Info, HelpCircle, BookOpen, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Badge } from "./badge";
import { ScrollArea } from "./scroll-area";

export interface ExplanationSection {
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export interface ExplanationLink {
  label: string;
  url: string;
}

export interface ExplanationModalProps {
  title: string;
  description?: string;
  sections: ExplanationSection[];
  relatedLinks?: ExplanationLink[];
  triggerVariant?: 'icon' | 'button' | 'badge';
  triggerLabel?: string;
  triggerClassName?: string;
  children?: React.ReactNode;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  title,
  description,
  sections,
  relatedLinks = [],
  triggerVariant = 'icon',
  triggerLabel = 'Learn more',
  triggerClassName,
  children,
}) => {
  const [open, setOpen] = React.useState(false);

  const renderTrigger = () => {
    if (children) {
      return children;
    }

    switch (triggerVariant) {
      case 'button':
        return (
          <Button
            variant="outline"
            size="sm"
            className={cn("gap-2", triggerClassName)}
          >
            <HelpCircle className="h-4 w-4" />
            {triggerLabel}
          </Button>
        );
      
      case 'badge':
        return (
          <Badge
            variant="outline"
            className={cn(
              "gap-1 cursor-pointer hover:bg-accent transition-colors",
              triggerClassName
            )}
          >
            <Info className="h-3 w-3" />
            {triggerLabel}
          </Badge>
        );
      
      case 'icon':
      default:
        return (
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center",
              "p-1 rounded-md",
              "text-muted-foreground hover:text-foreground hover:bg-accent",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              triggerClassName
            )}
            aria-label={`Explanation for ${title}`}
          >
            <Info className="h-4 w-4" />
          </button>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {renderTrigger()}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-base">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {sections.map((section, index) => (
              <div
                key={index}
                className={cn(
                  "space-y-3",
                  index > 0 && "pt-6 border-t"
                )}
              >
                <h3 className="flex items-center gap-2 text-base font-semibold">
                  {section.icon}
                  {section.title}
                </h3>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}

            {relatedLinks.length > 0 && (
              <div className="pt-6 border-t space-y-3">
                <h3 className="text-base font-semibold">Related Resources</h3>
                <div className="space-y-2">
                  {relatedLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-2 text-sm",
                        "text-primary hover:underline",
                        "transition-colors duration-200"
                      )}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => setOpen(false)}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ExplanationModal.displayName = "ExplanationModal";
