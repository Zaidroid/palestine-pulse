/**
 * Data Source Badge Component
 * Shows data source with verification status and hover details
 */

import { Badge } from './badge';
import { Database, ExternalLink, CheckCircle2, Info } from 'lucide-react';
import { useState } from 'react';

interface DataSourceBadgeProps {
  source: string;
  url?: string;
  verified?: boolean;
  lastUpdated?: string;
  methodology?: string;
  reliability?: 'high' | 'medium' | 'low';
}

export const DataSourceBadge = ({ 
  source, 
  url, 
  verified = true,
  lastUpdated,
  methodology,
  reliability = 'high'
}: DataSourceBadgeProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const reliabilityColors = {
    high: 'text-green-600 dark:text-green-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    low: 'text-red-600 dark:text-red-400'
  };

  return (
    <div className="relative inline-block">
      <div 
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-xs hover:bg-muted transition-all duration-300 cursor-pointer group"
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
      >
        <Database className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
        <span className="text-muted-foreground">Source:</span>
        {url ? (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            {source}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-foreground font-medium">{source}</span>
        )}
        {verified && (
          <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
        )}
        <Info className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      {/* Hover Details Panel */}
      {showDetails && (
        <div className="absolute top-full left-0 mt-2 w-80 z-50 animate-fade-in">
          <div className="glass-effect rounded-lg p-4 space-y-3 shadow-xl border border-border/50">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-sm text-foreground">{source}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Data Source Information</p>
              </div>
              {verified && (
                <Badge variant="success" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>

            <div className="space-y-2 text-xs">
              {lastUpdated && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium text-foreground">{lastUpdated}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reliability:</span>
                <span className={`font-medium capitalize ${reliabilityColors[reliability]}`}>
                  {reliability}
                </span>
              </div>

              {methodology && (
                <div className="pt-2 border-t border-border/50">
                  <p className="text-muted-foreground mb-1">Methodology:</p>
                  <p className="text-foreground/90 leading-relaxed">{methodology}</p>
                </div>
              )}

              {url && (
                <div className="pt-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    View Full Report
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
