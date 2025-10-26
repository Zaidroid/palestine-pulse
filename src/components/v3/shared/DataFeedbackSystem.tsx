/**
 * Data Feedback System
 * 
 * Allows users to report data quality issues including:
 * - Inaccurate data
 * - Outdated information
 * - Missing data
 * - Source verification concerns
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Send,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataSource } from '@/types/data.types';

interface DataFeedbackSystemProps {
  metricName?: string;
  source?: DataSource;
  value?: string | number;
  trigger?: React.ReactNode;
  className?: string;
}

type IssueType =
  | 'inaccurate'
  | 'outdated'
  | 'missing'
  | 'source_concern'
  | 'methodology'
  | 'other';

interface FeedbackFormData {
  issueType: IssueType;
  description: string;
  metricName?: string;
  source?: DataSource;
  value?: string | number;
}

export const DataFeedbackSystem = ({
  metricName,
  source,
  value,
  trigger,
  className,
}: DataFeedbackSystemProps) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FeedbackFormData>({
    issueType: 'inaccurate',
    description: '',
    metricName,
    source,
    value,
  });

  const issueTypes = [
    {
      value: 'inaccurate' as IssueType,
      label: 'Inaccurate Data',
      description: 'The displayed data appears to be incorrect',
    },
    {
      value: 'outdated' as IssueType,
      label: 'Outdated Information',
      description: 'The data is not current or needs updating',
    },
    {
      value: 'missing' as IssueType,
      label: 'Missing Data',
      description: 'Expected data is not displayed',
    },
    {
      value: 'source_concern' as IssueType,
      label: 'Source Verification Concern',
      description: 'Questions about the data source reliability',
    },
    {
      value: 'methodology' as IssueType,
      label: 'Methodology Question',
      description: 'Questions about how data was collected or calculated',
    },
    {
      value: 'other' as IssueType,
      label: 'Other Issue',
      description: 'Other data quality concerns',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      toast({
        title: 'Description Required',
        description: 'Please provide details about the issue',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      // In production, this would send to a backend API
      // For now, we'll simulate the submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Feedback submitted:', formData);

      setSubmitted(true);
      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for helping us improve data quality',
      });

      // Reset form after delay
      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
        setFormData({
          issueType: 'inaccurate',
          description: '',
          metricName,
          source,
          value,
        });
      }, 2000);
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className={className}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Report Issue
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DialogHeader>
                <DialogTitle>Report Data Quality Issue</DialogTitle>
                <DialogDescription>
                  Help us improve data accuracy by reporting issues you notice
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Context Information */}
                {(metricName || source || value) && (
                  <div className="p-3 rounded-lg bg-muted space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Context
                    </p>
                    {metricName && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Metric:</span>
                        <span className="font-medium">{metricName}</span>
                      </div>
                    )}
                    {source && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Source:</span>
                        <Badge variant="outline">{source}</Badge>
                      </div>
                    )}
                    {value !== undefined && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Value:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Issue Type */}
                <div className="space-y-2">
                  <Label htmlFor="issueType">Issue Type</Label>
                  <Select
                    value={formData.issueType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, issueType: value as IssueType })
                    }
                  >
                    <SelectTrigger id="issueType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{type.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {type.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide details about the issue..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Include any relevant details, sources, or corrections
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="mr-2"
                        >
                          <Send className="h-4 w-4" />
                        </motion.div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-8"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <div className="rounded-full bg-green-100 dark:bg-green-950 p-3">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold">Feedback Submitted</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Thank you for helping us improve data quality
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

// ============================================
// QUICK FEEDBACK BUTTON
// ============================================

interface QuickFeedbackButtonProps {
  metricName?: string;
  source?: DataSource;
  value?: string | number;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export const QuickFeedbackButton = ({
  metricName,
  source,
  value,
  size = 'sm',
  variant = 'ghost',
  className,
}: QuickFeedbackButtonProps) => {
  return (
    <DataFeedbackSystem
      metricName={metricName}
      source={source}
      value={value}
      trigger={
        <Button variant={variant} size={size} className={className}>
          <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
          Report Issue
        </Button>
      }
    />
  );
};

// ============================================
// INLINE FEEDBACK LINK
// ============================================

interface InlineFeedbackLinkProps {
  metricName?: string;
  source?: DataSource;
  value?: string | number;
  text?: string;
  className?: string;
}

export const InlineFeedbackLink = ({
  metricName,
  source,
  value,
  text = 'Report an issue',
  className,
}: InlineFeedbackLinkProps) => {
  return (
    <DataFeedbackSystem
      metricName={metricName}
      source={source}
      value={value}
      trigger={
        <button
          className={cn(
            'inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline',
            className
          )}
        >
          <AlertCircle className="h-3 w-3" />
          {text}
        </button>
      }
    />
  );
};
