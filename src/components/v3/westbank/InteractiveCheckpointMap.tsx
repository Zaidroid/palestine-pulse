import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Filter, BarChart3, PieChart, Activity, AlertTriangle, TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";
import { BtselemService, DetailedCheckpoint } from "@/services/btselemService";
import { DataSourceBadge } from "@/components/v3/shared/DataSourceBadge";
import { cn } from "@/lib/utils";

interface InteractiveCheckpointMapProps {
  checkpointData: any;
  loading?: boolean;
  compact?: boolean;
}

type ViewMode = 'district' | 'type' | 'timeline' | 'heatmap';
type FilterType = 'all' | 'fixed' | 'flying' | 'barrier' | 'earth_mound' | 'road_gate' | 'agricultural_gate';

export const InteractiveCheckpointMap = ({ checkpointData, loading, compact = false }: InteractiveCheckpointMapProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('district');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [hoveredCheckpoint, setHoveredCheckpoint] = useState<DetailedCheckpoint | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const btselemService = BtselemService.getInstance();

  // Animation variants for consistent V3 animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Filter checkpoints based on current filters
  const filteredCheckpoints = useMemo(() => {
    if (!checkpointData?.checkpoints) return [];

    let filtered = checkpointData.checkpoints;

    if (filterType !== 'all') {
      filtered = filtered.filter((c: DetailedCheckpoint) => c.type === filterType);
    }

    if (selectedDistrict !== 'all') {
      filtered = filtered.filter((c: DetailedCheckpoint) => c.district === selectedDistrict);
    }

    return filtered;
  }, [checkpointData, filterType, selectedDistrict]);

  // District summary data for visualization
  const districtData = useMemo(() => {
    if (!checkpointData?.checkpoints) return [];

    const districtMap = new Map();

    checkpointData.checkpoints.forEach((checkpoint: DetailedCheckpoint) => {
      if (!districtMap.has(checkpoint.district)) {
        districtMap.set(checkpoint.district, {
          district: checkpoint.district,
          total: 0,
          fixed: 0,
          flying: 0,
          barrier: 0,
          earth_mound: 0,
          road_gate: 0,
          agricultural_gate: 0,
          staffed: 0,
          unstaffed: 0
        });
      }

      const data = districtMap.get(checkpoint.district);
      data.total++;
      data[checkpoint.type]++;
      if (checkpoint.staffing === 'staffed') data.staffed++;
      else if (checkpoint.staffing === 'unstaffed') data.unstaffed++;
    });

    return Array.from(districtMap.values()).map((data: any) => ({
      ...data,
      intensity: data.total / 20, // Normalize for visualization
      utilization: (data.staffed / data.total) * 100
    }));
  }, [checkpointData]);

  // Checkpoint type distribution
  const typeDistribution = useMemo(() => {
    if (!checkpointData?.checkpoints) return [];

    const typeMap = new Map();
    checkpointData.checkpoints.forEach((checkpoint: DetailedCheckpoint) => {
      typeMap.set(checkpoint.type, (typeMap.get(checkpoint.type) || 0) + 1);
    });

    return Array.from(typeMap.entries()).map(([type, count]) => ({
      type,
      count,
      percentage: (count / checkpointData.checkpoints.length) * 100,
      color: getCheckpointTypeColor(type)
    }));
  }, [checkpointData]);

  const renderDistrictView = () => {
    // Enhanced normalization for visual distinction
    const maxCheckpoints = Math.max(...districtData.map((d: any) => d.total));
    const normalizedIntensity = districtData.map((d: any) => ({
      ...d,
      normalizedIntensity: maxCheckpoints > 0 ? d.total / maxCheckpoints : 0
    }));

    return (
      <div className={cn("space-y-3", compact && "space-y-2")}>
        {/* Compact Legend for embedded view */}
        {!compact && (
          <Card className="bg-gradient-to-br from-muted/20 to-card/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Checkpoint Density by District</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Low</span>
                  <div className="flex gap-1">
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map(intensity => (
                      <motion.div
                        key={intensity}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: intensity * 0.1 }}
                        className="w-3 h-3 rounded-sm border border-border/20"
                        style={{
                          backgroundColor: `hsl(var(--destructive) / ${intensity * 0.6 + 0.1})`
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">High</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interactive District Grid - Perfect size for widget */}
        <div className={cn(
          "grid gap-2.5",
          compact ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        )}>
          {normalizedIntensity.map((district: any, index: number) => (
            <motion.div
              key={district.district}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card
                      className={cn(
                        "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:z-10 relative group overflow-hidden",
                        "bg-gradient-to-br from-card to-muted/10 border-border/50",
                        selectedDistrict === district.district && "ring-2 ring-primary bg-primary/5"
                      )}
                      onClick={() => setSelectedDistrict(district.district === selectedDistrict ? 'all' : district.district)}
                    >
                      <CardContent className="p-3.5">
                        <div className="space-y-2.5">
                          <div className="text-sm font-semibold text-center text-foreground leading-tight">
                            {district.district}
                          </div>

                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15 + index * 0.04, type: "spring", stiffness: 200 }}
                            className="text-center"
                          >
                            <div className="text-xl font-bold text-primary font-mono">
                              {district.total}
                            </div>
                          </motion.div>

                          {/* Visual intensity indicator */}
                          <div className="relative">
                            <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${district.normalizedIntensity * 100}%` }}
                                transition={{ delay: 0.25 + index * 0.04, duration: 0.5, ease: "easeOut" }}
                                className={cn(
                                  "h-full rounded-full relative",
                                  district.normalizedIntensity > 0.7 ? 'bg-gradient-to-r from-destructive to-destructive/80' :
                                  district.normalizedIntensity > 0.5 ? 'bg-gradient-to-r from-warning to-warning/80' :
                                  district.normalizedIntensity > 0.3 ? 'bg-gradient-to-r from-primary to-primary/80' :
                                  'bg-gradient-to-r from-muted-foreground/50 to-muted-foreground/30'
                                )}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Selection indicator */}
                          {selectedDistrict === district.district && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse"
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1.5">
                      <div className="font-semibold text-primary">{district.district} District</div>
                      <div className="grid grid-cols-2 gap-1.5 text-sm">
                        <div>Total: <span className="font-bold">{district.total}</span></div>
                        <div>Fixed: <span className="font-bold text-destructive">{district.fixed}</span></div>
                        <div>Flying: <span className="font-bold text-warning">{district.flying}</span></div>
                        <div>Barriers: <span className="font-bold text-primary">{district.barrier}</span></div>
                      </div>
                      <div className="text-sm">
                        Staffed: <span className="font-bold">{district.staffed}</span> ({district.utilization.toFixed(1)}%)
                      </div>
                      <div className="text-xs text-muted-foreground border-t pt-1">
                        Click to {selectedDistrict === district.district ? 'clear filter' : 'filter by district'}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          ))}
        </div>

        {/* District Statistics - Hidden in compact mode */}
        {!compact && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-card to-primary/5">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary">
                      {districtData.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Districts</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-secondary">
                      {Math.max(...districtData.map((d: any) => d.total))}
                    </div>
                    <div className="text-xs text-muted-foreground">Highest Count</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-muted-foreground">
                      {Math.round(districtData.reduce((sum: number, d: any) => sum + d.total, 0) / districtData.length)}
                    </div>
                    <div className="text-xs text-muted-foreground">Average</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-destructive">
                      {districtData.reduce((sum: number, d: any) => sum + d.staffed, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Staffed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    );
  };

  const renderTypeView = () => (
    <div className={cn("space-y-4", compact && "space-y-3")}>
      {/* Horizontal Bar Chart Style for Types */}
      <div className="space-y-3">
        {typeDistribution.map((type: any, index: number) => (
          <motion.div
            key={type.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "group relative overflow-hidden rounded-lg border border-border/50 transition-all duration-300",
                      "bg-gradient-to-br from-card to-muted/10 hover:shadow-lg",
                      filterType === type.type && "ring-2 ring-primary bg-primary/5"
                    )}
                  >
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer"
                      onClick={() => setFilterType(filterType === type.type ? 'all' : type.type)}
                    >
                      {/* Type Label */}
                      <div className="flex items-center gap-3 flex-1">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.08, type: "spring" }}
                          className="w-4 h-4 rounded-full border-2 border-background shadow-sm"
                          style={{ backgroundColor: type.color }}
                        />
                        <span className="text-sm font-semibold capitalize text-foreground">
                          {type.type.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Value and Badge */}
                      <div className="flex items-center gap-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.08, type: "spring" }}
                          className="text-right"
                        >
                          <div className="text-lg font-bold text-primary font-mono">
                            {type.count}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {type.percentage.toFixed(1)}%
                          </div>
                        </motion.div>
                        <Badge
                          variant="secondary"
                          className="font-mono text-xs"
                          style={{
                            backgroundColor: `${type.color}20`,
                            borderColor: `${type.color}40`,
                            color: type.color
                          }}
                        >
                          {type.count}
                        </Badge>
                      </div>
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="relative">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4 + index * 0.08, duration: 0.8, ease: "easeOut" }}
                        className="h-1 bg-muted/30 origin-left"
                        style={{
                          background: `linear-gradient(90deg, ${type.color} 0%, ${type.color}40 100%)`,
                          transform: `scaleX(${type.percentage / 100})`
                        }}
                      />
                      <motion.div
                        animate={{
                          x: ["0%", "100%", "0%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                          ease: "easeInOut"
                        }}
                        className="absolute top-0 h-1 w-8 opacity-60"
                        style={{
                          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                        }}
                      />
                    </div>

                    {/* Selection indicator */}
                    {filterType === type.type && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse"
                      />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-2">
                    <div className="font-semibold text-primary capitalize">
                      {type.type.replace('_', ' ')} Checkpoints
                    </div>
                    <div className="text-sm">
                      <span className="font-bold">{type.count}</span> checkpoints (
                      <span className="font-bold">{type.percentage.toFixed(1)}%</span> of total)
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {filterType === type.type ? 'Currently active filter' : 'Click to filter this type'}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        ))}
      </div>

      {/* Type Statistics Summary - Hidden in compact mode */}
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-card to-secondary/5">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="text-xl font-bold text-primary font-mono"
                  >
                    {typeDistribution.length}
                  </motion.div>
                  <div className="text-xs text-muted-foreground">Checkpoint Types</div>
                </div>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                    className="text-xl font-bold text-secondary font-mono"
                  >
                    {Math.max(...typeDistribution.map((t: any) => t.count))}
                  </motion.div>
                  <div className="text-xs text-muted-foreground">Most Common</div>
                </div>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="text-xl font-bold text-muted-foreground font-mono"
                  >
                    {Math.round(typeDistribution.reduce((sum: number, t: any) => sum + t.count, 0) / typeDistribution.length)}
                  </motion.div>
                  <div className="text-xs text-muted-foreground">Average per Type</div>
                </div>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: "spring" }}
                    className="text-xl font-bold text-destructive font-mono"
                  >
                    {Math.max(...typeDistribution.map((t: any) => t.percentage)).toFixed(1)}%
                  </motion.div>
                  <div className="text-xs text-muted-foreground">Largest Share</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );

  const renderTimelineView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Checkpoint Evolution Timeline
          </CardTitle>
          <CardDescription>
            Historical patterns and trends in checkpoint deployment over decades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
            >
              <Activity className="h-8 w-8 text-primary" />
            </motion.div>
            <div className="text-lg font-semibold text-muted-foreground mb-2">
              Timeline Analysis Coming Soon
            </div>
            <div className="text-sm text-muted-foreground">
              Historical checkpoint data patterns and deployment trends will be visualized here
            </div>
          </div>

          {/* Preview Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">1990s</div>
              <div className="text-xs text-muted-foreground">Initial Deployment</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-secondary">2000s</div>
              <div className="text-xs text-muted-foreground">Rapid Expansion</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-destructive">2010s+</div>
              <div className="text-xs text-muted-foreground">Current State</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderHeatmapView = () => {
    // Enhanced normalization for heatmap visualization
    const maxCheckpoints = Math.max(...districtData.map((d: any) => d.total));
    const minCheckpoints = Math.min(...districtData.map((d: any) => d.total));
    const range = maxCheckpoints - minCheckpoints;

    // Enhanced color distribution using HSL color space
    const getHeatmapColor = (value: number) => {
      const normalizedValue = range > 0 ? (value - minCheckpoints) / range : 0;
      const hue = 220 - (normalizedValue * 40);
      const saturation = 70 + (normalizedValue * 30);
      const lightness = 40 + (normalizedValue * 20);
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    return (
      <div className={cn("space-y-3", compact && "space-y-2")}>
        {/* Compact Legend for embedded view */}
        {!compact && (
          <Card className="bg-gradient-to-br from-muted/20 to-card/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Geographic Heatmap</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Low</span>
                  <div className="flex gap-1">
                    {[0, 0.25, 0.5, 0.75, 1.0].map((intensity, index) => (
                      <motion.div
                        key={intensity}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-4 h-4 rounded-sm border border-border/20"
                        style={{
                          backgroundColor: getHeatmapColor(minCheckpoints + (range * intensity))
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">High</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interactive Heatmap Grid - Properly utilizing space */}
        <div className={cn(
          "grid gap-3",
          compact ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        )}>
          {districtData.map((district: any, index: number) => (
            <motion.div
              key={district.district}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card
                      className={cn(
                        "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:z-10 group relative overflow-hidden",
                        "bg-gradient-to-br from-card to-muted/10 border-border/50",
                        selectedDistrict === district.district && "ring-2 ring-primary bg-primary/5"
                      )}
                      onClick={() => setSelectedDistrict(district.district === selectedDistrict ? 'all' : district.district)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="text-sm font-semibold text-center text-foreground">
                            {district.district}
                          </div>

                          {/* Heatmap visualization */}
                          <div className="relative">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${Math.max((district.total / maxCheckpoints) * 80 + 30, 40)}px` }}
                              transition={{ delay: 0.2 + index * 0.05, duration: 0.6, ease: "easeOut" }}
                              className="w-full rounded-lg border border-border/20 flex items-end justify-center relative overflow-hidden min-h-[50px]"
                              style={{
                                backgroundColor: getHeatmapColor(district.total),
                              }}
                            >
                              {/* Pattern overlay */}
                              <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                  backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                                  backgroundSize: '6px 6px'
                                }}
                              />

                              {/* Checkpoint count overlay */}
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.05 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <span className="text-sm font-bold text-white drop-shadow-lg font-mono">
                                  {district.total}
                                </span>
                              </motion.div>
                            </motion.div>
                          </div>

                          {/* Selection indicator */}
                          {selectedDistrict === district.district && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-2">
                      <div className="font-semibold text-primary">{district.district} District</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Total: <span className="font-bold">{district.total}</span></div>
                        <div>Fixed: <span className="font-bold text-destructive">{district.fixed}</span></div>
                        <div>Flying: <span className="font-bold text-warning">{district.flying}</span></div>
                        <div>Barriers: <span className="font-bold text-primary">{district.barrier}</span></div>
                      </div>
                      <div className="text-sm">
                        Utilization: <span className="font-bold">{district.utilization.toFixed(1)}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground border-t pt-1">
                        Click to {selectedDistrict === district.district ? 'clear filter' : 'filter by district'}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          ))}
        </div>

        {/* Heatmap Statistics - Hidden in compact mode */}
        {!compact && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-card to-destructive/5">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                      className="text-lg font-bold text-primary font-mono"
                    >
                      {maxCheckpoints}
                    </motion.div>
                    <div className="text-xs text-muted-foreground">Highest Density</div>
                  </div>
                  <div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: "spring" }}
                      className="text-lg font-bold text-secondary font-mono"
                    >
                      {Math.round(districtData.reduce((sum: number, d: any) => sum + d.total, 0) / districtData.length)}
                    </motion.div>
                    <div className="text-xs text-muted-foreground">Average Density</div>
                  </div>
                  <div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      className="text-lg font-bold text-muted-foreground font-mono"
                    >
                      {minCheckpoints}
                    </motion.div>
                    <div className="text-xs text-muted-foreground">Lowest Density</div>
                  </div>
                  <div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9, type: "spring" }}
                      className="text-lg font-bold text-destructive font-mono"
                    >
                      {Math.round((maxCheckpoints - minCheckpoints) / Math.max(...districtData.map((d: any) => d.total > 0 ? d.total : 1)))}
                    </motion.div>
                    <div className="text-xs text-muted-foreground">Density Range</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'district': return renderDistrictView();
      case 'type': return renderTypeView();
      case 'timeline': return renderTimelineView();
      case 'heatmap': return renderHeatmapView();
      default: return renderDistrictView();
    }
  };

  if (loading || !checkpointData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <Card className="bg-gradient-to-br from-card to-card/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-6 w-8 mb-2" />
                  <Skeleton className="h-2 w-full mb-2" />
                  <Skeleton className="h-2 w-3/4" />
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Clean compact view for embedding in AnimatedChart
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col"
      >
        {/* Compact Controls - Properly sized */}
        <div className="flex gap-3 justify-between items-center mb-4">
          <div className="flex gap-3">
            <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="district">District</SelectItem>
                <SelectItem value="type">Type</SelectItem>
                <SelectItem value="heatmap">Heatmap</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
              <SelectTrigger className="w-28 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="flying">Flying</SelectItem>
                <SelectItem value="barrier">Barrier</SelectItem>
                <SelectItem value="earth_mound">Earth Mound</SelectItem>
                <SelectItem value="road_gate">Road Gate</SelectItem>
                <SelectItem value="agricultural_gate">Agri Gate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Badge variant="outline" className="text-sm font-mono px-3 py-1">
            {filteredCheckpoints.length}/830
          </Badge>
        </div>

        {/* Main Visualization - Optimized for embedded space */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${filterType}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // Enhanced full detailed view with V3 styling
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Enhanced Header with Summary Stats */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="bg-gradient-to-br from-primary/5 via-card to-card/80 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <MapPin className="h-7 w-7 text-primary" />
                  </motion.div>
                  Interactive Checkpoint Analysis
                </CardTitle>
                <CardDescription className="text-base">
                  Comprehensive visualization of West Bank checkpoint data with real-time filtering and analysis
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="text-right"
                >
                  <div className="text-2xl font-bold text-primary font-mono">
                    {filteredCheckpoints.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Checkpoints</div>
                </motion.div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="gap-2"
                >
                  {isFullscreen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {isFullscreen ? 'Exit' : 'Fullscreen'}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Enhanced Controls Section */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-3 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">View Mode:</span>
                  <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="district">By District</SelectItem>
                      <SelectItem value="type">By Type</SelectItem>
                      <SelectItem value="timeline">Timeline</SelectItem>
                      <SelectItem value="heatmap">Heatmap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Filter:</span>
                  <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="flying">Flying</SelectItem>
                      <SelectItem value="barrier">Barrier</SelectItem>
                      <SelectItem value="earth_mound">Earth Mound</SelectItem>
                      <SelectItem value="road_gate">Road Gate</SelectItem>
                      <SelectItem value="agricultural_gate">Agricultural Gate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <AnimatePresence>
                  {selectedDistrict !== 'all' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge variant="secondary" className="px-3 py-1 gap-2">
                        {selectedDistrict} District
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => setSelectedDistrict('all')}
                        >
                          ×
                        </Button>
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Live Data
                </motion.div>
                <DataSourceBadge
                  sources={["Btselem", "Tech4Palestine"]}
                  quality="high"
                  lastUpdated={new Date().toLocaleString()}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Visualization with Enhanced Animations */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "transition-all duration-500",
          isFullscreen ? "fixed inset-4 z-50 bg-background/95 backdrop-blur-sm" : "min-h-[600px]"
        )}
      >
        {isFullscreen && (
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Checkpoint Analysis Dashboard</h2>
            <Button variant="outline" onClick={() => setIsFullscreen(false)}>
              Exit Fullscreen
            </Button>
          </div>
        )}

        <div className={cn("p-6", isFullscreen && "h-full overflow-auto")}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${filterType}-${selectedDistrict}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="space-y-6"
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Helper function to get colors for checkpoint types
function getCheckpointTypeColor(type: string): string {
  const colors: Record<string, string> = {
    fixed: 'hsl(var(--destructive))',
    flying: 'hsl(var(--warning))',
    barrier: 'hsl(var(--primary))',
    earth_mound: 'hsl(var(--secondary))',
    road_gate: 'hsl(200, 70%, 50%)',
    agricultural_gate: 'hsl(120, 50%, 50%)',
    partial: 'hsl(280, 50%, 60%)'
  };
  return colors[type] || 'hsl(var(--muted))';
}