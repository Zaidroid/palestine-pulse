import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Database, 
  RefreshCw, 
  Download, 
  Share2, 
  FileText, 
  Settings,
  Clock,
  CheckCircle2,
 Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
 HoverCard,
 HoverCardContent,
 HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useV3Store, DataSourceState } from "@/store/v3Store";

interface V3FooterProps {
  autoRefreshInterval?: number;
  onRefresh?: () => void;
  onExport?: () => void;
  className?: string;
}

export const V3Footer = ({
  autoRefreshInterval = 300000, // 5 minutes
  onRefresh,
  onExport,
  className
}: V3FooterProps) => {
  const { dataSourceStatus, lastUpdated } = useV3Store(state => ({
    dataSourceStatus: state.dataSourceStatus,
    lastUpdated: state.lastUpdated,
  }));
  
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(autoRefreshInterval / 1000);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dataSources = Object.values(dataSourceStatus);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilRefresh((prev) => {
        if (prev <= 1) {
          if (onRefresh) {
            setIsRefreshing(true);
            onRefresh();
            setTimeout(() => setIsRefreshing(false), 1000);
          }
          return autoRefreshInterval / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefreshInterval, onRefresh]);

  const getStatusColor = (status: DataSourceState['status']) => {
    switch (status) {
      case 'active':
        return "bg-green-500";
      case "syncing":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      case "disabled":
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: DataSourceState['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin" />;
      case "error":
        return <Clock className="h-4 w-4 text-red-400" />;
      case "disabled":
        return <Info className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatRefreshTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "border-t bg-gradient-to-t from-background/80 to-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Data Sources & Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-md font-semibold text-foreground">Data Sources</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {dataSources.map((source, idx) => (
                <HoverCard key={source.name} openDelay={100} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Badge
                        variant="outline"
                        className={cn(
                          "group/badge relative flex items-center gap-2.5 pl-3 pr-4 py-1.5 cursor-pointer",
                          "border-border/50 hover:border-primary/80 transition-all duration-300",
                          "bg-background/50 hover:bg-muted/50",
                          source.status === 'syncing' && "animate-pulse"
                        )}
                      >
                        <span className={cn("h-2 w-2 rounded-full", getStatusColor(source.status))} />
                        <span className="font-semibold text-sm text-foreground/90">{source.name}</span>
                      </Badge>
                    </motion.div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-auto max-w-xs" side="top">
                    <div className="flex items-start gap-4">
                      {getStatusIcon(source.status)}
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{source.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Status: <span className="capitalize font-medium">{source.status}</span>
                        </p>
                        {source.lastSync && (
                          <p className="text-xs text-muted-foreground">
                            Last sync: {formatDistanceToNow(source.lastSync, { addSuffix: true })}
                          </p>
                        )}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                <span>
                  Updated: <span className="font-semibold text-foreground">{formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Next in:
                  <motion.span
                    key={timeUntilRefresh}
                    initial={{ opacity: 0.5, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono font-semibold text-foreground ml-1"
                  >
                    {formatRefreshTime(timeUntilRefresh)}
                  </motion.span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Actions & Copyright */}
          <div className="space-y-4 lg:text-right">
            <div className="flex items-center gap-3 justify-end">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-md font-semibold text-foreground">Quick Actions</h3>
            </div>
            <div className="flex items-center justify-end gap-2 flex-wrap">
              {onExport && (
                <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              )}
              <Button variant="outline" size="sm" className="gap-2" onClick={() => console.log('Share clicked')}>
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => console.log('Docs clicked')}>
                <FileText className="h-4 w-4" />
                Docs
              </Button>
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsRefreshing(true);
                    onRefresh();
                    setTimeUntilRefresh(autoRefreshInterval / 1000);
                    setTimeout(() => setIsRefreshing(false), 1000);
                  }}
                  disabled={isRefreshing}
                  className="gap-2"
                >
                  <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                  Refresh
                </Button>
              )}
            </div>
            <div className="pt-2 text-xs text-muted-foreground">
              <p>
                © {new Date().getFullYear()} Palestine Pulse | Made by Zaid Salem
              </p>
              <div className="mt-1 flex items-center justify-end gap-x-3">
                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                <span>•</span>
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                <span>•</span>
                <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};