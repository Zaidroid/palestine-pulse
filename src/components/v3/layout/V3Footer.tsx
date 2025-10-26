/**
 * V3 Footer Component - Compact Version
 * 
 * Minimal footer showing only essential information:
 * - Active data sources (Tech4Palestine, Good Shepherd, UN OCHA)
 * - GitHub Actions update schedule (every 6 hours)
 * - Last update time
 * - Essential links
 */

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Database, 
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Github,
  Heart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useV3Store, DataSourceState } from "@/store/v3Store";

interface V3FooterProps {
  onExport?: () => void;
  className?: string;
}

// GitHub Actions runs every 6 hours (0 */6 * * *)
const GITHUB_ACTIONS_INTERVAL = 6 * 60 * 60 * 1000;

// Data source descriptions
const DATA_SOURCE_INFO: Record<string, { description: string; updateMethod: string; updateFrequency: string }> = {
  'tech4palestine': {
    description: 'Comprehensive casualty data, infrastructure damage, and daily reports from Gaza and West Bank',
    updateMethod: 'GitHub Actions',
    updateFrequency: 'Every 6 hours'
  },
  'goodshepherd': {
    description: 'Good Shepherd Collective - Detailed incident reports, settler violence, and occupation metrics',
    updateMethod: 'GitHub Actions',
    updateFrequency: 'Every 6 hours'
  },
  'un_ocha': {
    description: 'UN OCHA Humanitarian Data Exchange - Displacement, food security, and humanitarian needs',
    updateMethod: 'GitHub Actions',
    updateFrequency: 'Every 6 hours'
  },
  'btselem': {
    description: 'B\'Tselem - Israeli human rights organization tracking violations, detentions, and settlements',
    updateMethod: 'Scheduled Web Scraping',
    updateFrequency: 'Daily'
  },
  'pcbs': {
    description: 'Palestinian Central Bureau of Statistics - Population data, demographics, and economic indicators',
    updateMethod: 'Scheduled Web Scraping',
    updateFrequency: 'Weekly'
  },
  'wfp': {
    description: 'World Food Programme - Food prices, market data, and food security assessments',
    updateMethod: 'GitHub Actions',
    updateFrequency: 'Daily'
  },
  'world_bank': {
    description: 'World Bank Open Data - Economic indicators, GDP, poverty rates, and development metrics',
    updateMethod: 'API Integration',
    updateFrequency: 'Monthly'
  }
};

// Helper functions
const getStatusColor = (status: DataSourceState['status']) => {
  switch (status) {
    case 'active': return "bg-green-500";
    case "syncing": return "bg-yellow-500";
    case "error": return "bg-red-500";
    case "disabled": return "bg-gray-400";
  }
};

const getStatusIcon = (status: DataSourceState['status']) => {
  switch (status) {
    case 'active': return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
    case "syncing": return <Loader2 className="h-3.5 w-3.5 text-yellow-500 animate-spin" />;
    case "error": return <XCircle className="h-3.5 w-3.5 text-red-500" />;
    case "disabled": return null;
  }
};

export const V3Footer = ({
  onExport,
  className
}: V3FooterProps) => {
  const { dataSourceStatus, lastUpdated, fetchConsolidatedData } = useV3Store(state => ({
    dataSourceStatus: state.dataSourceStatus,
    lastUpdated: state.lastUpdated,
    fetchConsolidatedData: state.fetchConsolidatedData,
  }));
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dataSources = Object.values(dataSourceStatus);
  const activeSources = dataSources.filter(s => s.status !== 'disabled');

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await fetchConsolidatedData(true);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, fetchConsolidatedData]);

  // Calculate next GitHub Actions run (every 6 hours)
  const getNextGitHubActionsRun = () => {
    const now = new Date();
    const lastRun = new Date(lastUpdated);
    const nextRun = new Date(lastRun.getTime() + GITHUB_ACTIONS_INTERVAL);
    const timeUntil = nextRun.getTime() - now.getTime();
    
    if (timeUntil <= 0) return 'Due now';
    
    const hours = Math.floor(timeUntil / (60 * 60 * 1000));
    const minutes = Math.floor((timeUntil % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("border-t bg-card/20 backdrop-blur-sm", className)}
    >
      <div className="container mx-auto px-4 py-4">
        {/* Two-line layout */}
        <div className="space-y-3">
          
          {/* Top Line: Data Sources */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <Database className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Data Sources</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                {activeSources.length}
              </Badge>
            </div>
            
            <Separator orientation="vertical" className="h-4" />
            
            {/* Source badges */}
            <div className="flex items-center gap-2 flex-wrap flex-1">
              {activeSources.map((source) => {
                const sourceInfo = DATA_SOURCE_INFO[source.name.toLowerCase()] || DATA_SOURCE_INFO[source.name];
                return (
                  <HoverCard key={source.name} openDelay={150} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <div className="relative">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "cursor-pointer transition-all hover:bg-accent hover:border-primary/50 hover:shadow-sm",
                            source.status === 'syncing' && "border-yellow-500/50 animate-pulse"
                          )}
                        >
                          <span className={cn(
                            "h-1.5 w-1.5 rounded-full mr-1.5",
                            getStatusColor(source.status)
                          )} />
                          <span className="text-xs">{source.name}</span>
                        </Badge>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent 
                      className="w-80 p-4 z-50" 
                      side="top" 
                      align="start"
                      sideOffset={5}
                      alignOffset={0}
                    >
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">
                            {getStatusIcon(source.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold leading-tight">{source.name}</h4>
                            <p className="text-xs text-muted-foreground capitalize mt-0.5">
                              {source.status}
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        {sourceInfo && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {sourceInfo.description}
                          </p>
                        )}

                        {/* Update Info */}
                        <div className="space-y-1.5 pt-2 border-t">
                          {sourceInfo && (
                            <>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Update Method:</span>
                                <span className="font-medium text-foreground">{sourceInfo.updateMethod}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Frequency:</span>
                                <span className="font-medium text-foreground">{sourceInfo.updateFrequency}</span>
                              </div>
                            </>
                          )}
                          {source.lastSync && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Last Sync:</span>
                              <span className="font-medium text-foreground">
                                {formatDistanceToNow(new Date(source.lastSync), { addSuffix: true })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Bottom Line: Update Info & Links */}
          <div className="flex items-center justify-between gap-4 text-xs">
            
            {/* Left: Update Info */}
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Updated <span className="font-medium text-foreground">{formatDistanceToNow(lastUpdated, { addSuffix: true })}</span></span>
              </div>
              <Separator orientation="vertical" className="h-3" />
              <div className="flex items-center gap-1.5">
                <span>Next update in <span className="font-medium text-foreground">{getNextGitHubActionsRun()}</span></span>
              </div>
              <Separator orientation="vertical" className="h-3" />
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors disabled:opacity-50 font-medium"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
                <span>Refresh Now</span>
              </button>
            </div>

            {/* Right: Footer Links */}
            <div className="flex items-center gap-3 text-muted-foreground">
              <a 
                href="https://github.com/Zaidroid/palestine-pulse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </a>
              <Separator orientation="vertical" className="h-3" />
              <span className="flex items-center gap-1">
                Made with <Heart className="h-3 w-3 text-red-500" /> by Zaid Salem
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
