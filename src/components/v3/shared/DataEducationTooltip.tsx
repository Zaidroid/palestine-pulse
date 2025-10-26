/**
 * Data Education Tooltip Component
 * 
 * Provides educational tooltips and help text for:
 * - Data source explanations
 * - Quality indicator meanings
 * - Methodology information
 * - Verification guidance
 */

import { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Info,
  HelpCircle,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// EDUCATION TOPICS
// ============================================

export const EDUCATION_TOPICS = {
  dataQuality: {
    title: 'Understanding Data Quality',
    icon: Shield,
    content: `Data quality indicators help you assess the reliability and accuracy of the information displayed. We use multiple factors to determine quality:

• **Verified**: Data from authoritative sources with recent updates and cross-verification
• **Reliable**: Data from trusted sources with established methodologies
• **Estimated**: Aggregated or modeled data that may have moderate delays
• **Unverified**: Data pending confirmation from primary sources

Higher quality data means more confidence in the accuracy of the information.`,
    links: [
      {
        label: 'Data Quality Standards',
        url: 'https://data.techforpalestine.org/docs/methodology',
      },
    ],
  },
  dataFreshness: {
    title: 'Data Freshness Indicators',
    icon: CheckCircle2,
    content: `Freshness indicators show how recently the data was updated:

• **Fresh**: Updated within the expected timeframe for this data type
• **Recent**: Updated recently but approaching the refresh threshold
• **Stale**: Data may be outdated and should be verified
• **Outdated**: Data needs immediate refresh

Different data types have different update frequencies. Real-time data updates every few minutes, while economic indicators may update monthly.`,
    links: [
      {
        label: 'Update Frequencies',
        url: 'https://data.techforpalestine.org/docs/update-schedule',
      },
    ],
  },
  dataSources: {
    title: 'About Our Data Sources',
    icon: BookOpen,
    content: `We aggregate data from multiple verified sources to provide comprehensive coverage:

• **Tech4Palestine**: Casualty and infrastructure data
• **UN OCHA**: Humanitarian situation and displacement
• **World Bank**: Economic indicators
• **WFP**: Food security assessments
• **B'Tselem**: Human rights documentation
• **Good Shepherd Collective**: Violence and demolition tracking

Each source is vetted for credibility and methodology. Click on any source badge to learn more about their data collection methods.`,
    links: [
      {
        label: 'Source Verification Process',
        url: 'https://data.techforpalestine.org/docs/sources',
      },
    ],
  },
  methodology: {
    title: 'Data Collection Methodology',
    icon: Info,
    content: `Our data comes from organizations using rigorous methodologies:

• **Field Documentation**: On-the-ground verification by trained personnel
• **Cross-Referencing**: Multiple source verification for accuracy
• **Official Records**: Government and UN agency reports
• **Media Verification**: Confirmed reports from credible news sources
• **Statistical Analysis**: Professional analysis of collected data

We prioritize primary sources and cross-verify information whenever possible.`,
    links: [
      {
        label: 'Detailed Methodology',
        url: 'https://data.techforpalestine.org/docs/methodology',
      },
    ],
  },
  verification: {
    title: 'How to Verify Data',
    icon: CheckCircle2,
    content: `You can verify the data displayed in this dashboard:

1. **Click Source Badges**: Access original data sources directly
2. **Check Timestamps**: Verify when data was last updated
3. **Review Methodology**: Understand how data was collected
4. **Cross-Reference**: Compare with other reliable sources
5. **Report Issues**: Use the feedback system to report discrepancies

We encourage critical evaluation of all data and welcome feedback.`,
    links: [
      {
        label: 'Verification Guide',
        url: 'https://data.techforpalestine.org/docs/verification',
      },
      {
        label: 'Report Data Issue',
        url: 'https://github.com/TechForPalestine/data-issues',
      },
    ],
  },
};

// ============================================
// DATA EDUCATION TOOLTIP
// ============================================

interface DataEducationTooltipProps {
  topic: keyof typeof EDUCATION_TOPICS;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const DataEducationTooltip = ({
  topic,
  children,
  side = 'top',
  className,
}: DataEducationTooltipProps) => {
  const content = EDUCATION_TOPICS[topic];
  const Icon = content.icon;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className={cn('inline-flex items-center cursor-help', className)}>
          {children}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-96" side={side}>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{content.title}</h4>
            </div>
          </div>

          <div className="text-sm text-muted-foreground whitespace-pre-line">
            {content.content}
          </div>

          {content.links && content.links.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Learn More
              </p>
              <div className="flex flex-col gap-1">
                {content.links.map((link, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-xs h-auto py-1.5"
                    onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    {link.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

// ============================================
// QUICK HELP ICON
// ============================================

interface QuickHelpIconProps {
  topic: keyof typeof EDUCATION_TOPICS;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const QuickHelpIcon = ({
  topic,
  size = 'md',
  className,
}: QuickHelpIconProps) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <DataEducationTooltip topic={topic}>
      <HelpCircle
        className={cn(
          'text-muted-foreground hover:text-primary transition-colors',
          sizeClasses[size],
          className
        )}
      />
    </DataEducationTooltip>
  );
};

// ============================================
// INLINE HELP TEXT
// ============================================

interface InlineHelpTextProps {
  topic: keyof typeof EDUCATION_TOPICS;
  text?: string;
  className?: string;
}

export const InlineHelpText = ({
  topic,
  text,
  className,
}: InlineHelpTextProps) => {
  const content = EDUCATION_TOPICS[topic];

  return (
    <DataEducationTooltip topic={topic}>
      <div
        className={cn(
          'inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors',
          className
        )}
      >
        <Info className="h-3 w-3" />
        <span>{text || content.title}</span>
      </div>
    </DataEducationTooltip>
  );
};

// ============================================
// HELP BADGE
// ============================================

interface HelpBadgeProps {
  topic: keyof typeof EDUCATION_TOPICS;
  label?: string;
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
}

export const HelpBadge = ({
  topic,
  label,
  variant = 'outline',
  className,
}: HelpBadgeProps) => {
  const content = EDUCATION_TOPICS[topic];

  return (
    <DataEducationTooltip topic={topic}>
      <Badge variant={variant} className={cn('gap-1 cursor-help', className)}>
        <HelpCircle className="h-3 w-3" />
        {label || 'Learn More'}
      </Badge>
    </DataEducationTooltip>
  );
};

// ============================================
// EDUCATION PANEL
// ============================================

interface EducationPanelProps {
  topics?: (keyof typeof EDUCATION_TOPICS)[];
  className?: string;
}

export const EducationPanel = ({
  topics = ['dataQuality', 'dataFreshness', 'dataSources', 'methodology', 'verification'],
  className,
}: EducationPanelProps) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-lg font-semibold mb-2">Understanding the Data</h3>
        <p className="text-sm text-muted-foreground">
          Learn about our data sources, quality indicators, and verification processes
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {topics.map((topic) => {
          const content = EDUCATION_TOPICS[topic];
          const Icon = content.icon;

          return (
            <HoverCard key={topic}>
              <HoverCardTrigger asChild>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left"
                >
                  <div className="flex gap-3 w-full">
                    <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1">{content.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {content.content.split('\n\n')[0]}
                      </p>
                    </div>
                  </div>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-96" side="top">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <h4 className="font-semibold text-sm">{content.title}</h4>
                  </div>

                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {content.content}
                  </div>

                  {content.links && content.links.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Learn More
                      </p>
                      <div className="flex flex-col gap-1">
                        {content.links.map((link, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="justify-start text-xs h-auto py-1.5"
                            onClick={() =>
                              window.open(link.url, '_blank', 'noopener,noreferrer')
                            }
                          >
                            <ExternalLink className="h-3 w-3 mr-2" />
                            {link.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>
    </div>
  );
};
