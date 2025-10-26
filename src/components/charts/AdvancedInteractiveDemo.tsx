/**
 * Advanced Interactive Demo Page
 * 
 * Comprehensive D3.js chart showcase with:
 * - High-quality animations and transitions
 * - Unified filter tabs per chart
 * - Export/Share functionality
 * - Data source badges with hover panels
 * - Smart, informative tooltips
 * - Dynamic, interactive elements
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataSourceBadge } from '@/components/ui/data-source-badge';
import { useThemePreference } from '@/hooks/useThemePreference';
import {
    Download, Share2, Filter, TrendingUp, Users,
    Building2, Activity, AlertTriangle, BarChart3,
    PieChart, Calendar, Map, Zap
} from 'lucide-react';

// Import individual chart components
import { AnimatedAreaChart } from '@/components/charts/demo/AnimatedAreaChart';
import { InteractiveBarChart } from '@/components/charts/demo/InteractiveBarChart';
import { AdvancedDonutChart } from '@/components/charts/demo/AdvancedDonutChart';
import { StreamGraphChart } from '@/components/charts/demo/StreamGraphChart';
import { RadarChart } from '@/components/charts/demo/RadarChart';
import { SankeyFlowChart } from '@/components/charts/demo/SankeyFlowChart';
import { ViolinPlotChart } from '@/components/charts/demo/ViolinPlotChart';
import { ChordDiagramChart } from '@/components/charts/demo/ChordDiagramChart';
import { CalendarHeatmapChart } from '@/components/charts/demo/CalendarHeatmapChart';
import { PopulationPyramidChart } from '@/components/charts/demo/PopulationPyramidChart';
import { IsotypeChart } from '@/components/charts/demo/IsotypeChart';
import { WaffleChart } from '@/components/charts/demo/WaffleChart';
import { TimelineEventsChart } from '@/components/charts/demo/TimelineEventsChart';
import { SmallMultiplesChart } from '@/components/charts/demo/SmallMultiplesChart';
import { HorizonChart } from '@/components/charts/demo/HorizonChart';

type TimeFilter = 'week' | 'month' | 'quarter' | 'year' | 'all';
type ChartType = 'area' | 'bar' | 'donut' | 'stream' | 'radar' | 'sankey' | 'violin' | 'chord' | 'calendar' | 'pyramid' | 'isotype' | 'waffle' | 'timeline' | 'smallmultiples' | 'horizon';

interface ChartCardProps {
    title: string;
    icon: React.ReactNode;
    badge: string;
    children: React.ReactNode;
    dataSource: {
        source: string;
        url?: string;
        lastUpdated: string;
        reliability: 'high' | 'medium' | 'low';
        methodology: string;
    };
    chartType: ChartType;
}

const ChartCard = ({ title, icon, badge, children, dataSource, chartType }: ChartCardProps) => {
    const [activeFilter, setActiveFilter] = useState<TimeFilter>('all');
    const [isExporting, setIsExporting] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    const filters: { id: TimeFilter; label: string }[] = [
        { id: 'week', label: '7D' },
        { id: 'month', label: '1M' },
        { id: 'quarter', label: '3M' },
        { id: 'year', label: '1Y' },
        { id: 'all', label: 'All' }
    ];

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            // Simulate export
            console.log(`Exporting ${title} as PNG/CSV`);
            setIsExporting(false);
        }, 1000);
    };

    const handleShare = () => {
        setIsSharing(true);
        setTimeout(() => {
            // Simulate share
            console.log(`Sharing ${title}`);
            setIsSharing(false);
        }, 800);
    };

    return (
        <Card className="card-elevated group hover:shadow-theme-lg transition-all duration-500">
            <CardHeader className="space-y-4">
                {/* Title Row */}
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        {icon}
                        {title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs font-medium">
                        {badge}
                    </Badge>
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border">
                        <Filter className="h-3.5 w-3.5 text-muted-foreground ml-1" />
                        {filters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`
                  px-3 py-1 rounded text-xs font-medium transition-all duration-300
                  ${activeFilter === filter.id
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                    }
                `}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                       bg-background border border-border rounded-lg
                       hover:bg-muted hover:border-primary/50 hover:text-primary
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                       group/btn"
                        >
                            <Download className={`h-3.5 w-3.5 ${isExporting ? 'animate-bounce' : 'group-hover/btn:translate-y-0.5'} transition-transform`} />
                            Export
                        </button>
                        <button
                            onClick={handleShare}
                            disabled={isSharing}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                       bg-background border border-border rounded-lg
                       hover:bg-muted hover:border-secondary/50 hover:text-secondary
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                       group/btn"
                        >
                            <Share2 className={`h-3.5 w-3.5 ${isSharing ? 'animate-pulse' : 'group-hover/btn:scale-110'} transition-transform`} />
                            Share
                        </button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Chart Content */}
                <div className="min-h-[400px]">
                    {children}
                </div>

                {/* Data Source Badge */}
                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                    <DataSourceBadge
                        source={dataSource.source}
                        url={dataSource.url}
                        lastUpdated={dataSource.lastUpdated}
                        reliability={dataSource.reliability}
                        methodology={dataSource.methodology}
                    />
                    <div className="text-xs text-muted-foreground">
                        Filtered by: <span className="font-medium text-foreground">{activeFilter === 'all' ? 'All Time' : filters.find(f => f.id === activeFilter)?.label}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const AdvancedInteractiveDemo = () => {
    const { theme, toggleTheme } = useThemePreference();

    return (
        <div className="min-h-screen p-6 space-y-8 bg-background">
            {/* Header */}
            <div className="border-b border-border pb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                            <Zap className="h-8 w-8 text-primary" />
                            Advanced Interactive Charts
                        </h1>
                        <p className="text-muted-foreground">
                            D3.js powered visualizations with high animations, filters, and smart interactions
                        </p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-card 
                     text-foreground rounded-lg hover:bg-muted transition-all duration-300 
                     shadow-theme-sm hover:shadow-theme-md"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                        <span className="text-sm font-medium">Toggle Theme</span>
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Charts', value: '15', icon: <BarChart3 className="h-5 w-5" />, color: 'text-primary' },
                    { label: 'Data Points', value: '5.6K', icon: <Activity className="h-5 w-5" />, color: 'text-secondary' },
                    { label: 'Interactions', value: '∞', icon: <Zap className="h-5 w-5" />, color: 'text-warning' },
                    { label: 'Animations', value: 'High', icon: <TrendingUp className="h-5 w-5" />, color: 'text-destructive' }
                ].map((stat, i) => (
                    <Card key={i} className="stat-card hover:scale-105 transition-transform duration-300">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                                        {stat.label}
                                    </p>
                                    <p className="text-3xl font-bold text-foreground">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="space-y-6">
                {/* Row 1: Area and Bar Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard
                        title="Casualties Timeline"
                        icon={<TrendingUp className="h-5 w-5 text-destructive" />}
                        badge="Area Chart"
                        chartType="area"
                        dataSource={{
                            source: "Gaza Ministry of Health",
                            url: "https://example.com",
                            lastUpdated: "2 hours ago",
                            reliability: "high",
                            methodology: "Direct hospital reports with daily aggregation and field verification"
                        }}
                    >
                        <AnimatedAreaChart />
                    </ChartCard>

                    <ChartCard
                        title="Infrastructure Damage"
                        icon={<Building2 className="h-5 w-5 text-warning" />}
                        badge="Bar Chart"
                        chartType="bar"
                        dataSource={{
                            source: "UN OCHA",
                            url: "https://example.com",
                            lastUpdated: "6 hours ago",
                            reliability: "high",
                            methodology: "Satellite imagery analysis combined with ground verification teams"
                        }}
                    >
                        <InteractiveBarChart />
                    </ChartCard>
                </div>

                {/* Row 2: Donut and Stream Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard
                        title="Casualty Demographics"
                        icon={<PieChart className="h-5 w-5 text-secondary" />}
                        badge="Donut Chart"
                        chartType="donut"
                        dataSource={{
                            source: "Palestinian Red Crescent",
                            url: "https://example.com",
                            lastUpdated: "4 hours ago",
                            reliability: "high",
                            methodology: "Demographic analysis of confirmed casualties with age and gender breakdown"
                        }}
                    >
                        <AdvancedDonutChart />
                    </ChartCard>

                    <ChartCard
                        title="Weekly Casualty Stream"
                        icon={<Activity className="h-5 w-5 text-primary" />}
                        badge="Stream Graph"
                        chartType="stream"
                        dataSource={{
                            source: "Gaza Ministry of Health",
                            url: "https://example.com",
                            lastUpdated: "Daily",
                            reliability: "high",
                            methodology: "Time-series analysis of daily casualty reports by category"
                        }}
                    >
                        <StreamGraphChart />
                    </ChartCard>
                </div>

                {/* Row 3: Radar and Sankey Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard
                        title="Regional Impact Analysis"
                        icon={<Map className="h-5 w-5 text-destructive" />}
                        badge="Radar Chart"
                        chartType="radar"
                        dataSource={{
                            source: "UNRWA",
                            url: "https://example.com",
                            lastUpdated: "12 hours ago",
                            reliability: "high",
                            methodology: "Multi-dimensional impact assessment across key humanitarian indicators"
                        }}
                    >
                        <RadarChart />
                    </ChartCard>

                    <ChartCard
                        title="Displacement Flow"
                        icon={<Users className="h-5 w-5 text-secondary" />}
                        badge="Sankey Diagram"
                        chartType="sankey"
                        dataSource={{
                            source: "UNRWA & UN OCHA",
                            url: "https://example.com",
                            lastUpdated: "Daily",
                            reliability: "high",
                            methodology: "Shelter registration data and population movement tracking"
                        }}
                    >
                        <SankeyFlowChart />
                    </ChartCard>
                </div>

                {/* Row 4: Violin Plot and Chord Diagram */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard
                        title="Casualty Distribution Analysis"
                        icon={<Activity className="h-5 w-5 text-primary" />}
                        badge="Violin Plot"
                        chartType="violin"
                        dataSource={{
                            source: "Gaza Ministry of Health",
                            url: "https://example.com",
                            lastUpdated: "6 hours ago",
                            reliability: "high",
                            methodology: "Statistical distribution analysis of casualty patterns by region with quartile calculations"
                        }}
                    >
                        <ViolinPlotChart />
                    </ChartCard>

                    <ChartCard
                        title="Inter-Regional Movement"
                        icon={<Users className="h-5 w-5 text-warning" />}
                        badge="Chord Diagram"
                        chartType="chord"
                        dataSource={{
                            source: "UNRWA",
                            url: "https://example.com",
                            lastUpdated: "8 hours ago",
                            reliability: "high",
                            methodology: "Population movement tracking between regions with flow matrix analysis"
                        }}
                    >
                        <ChordDiagramChart />
                    </ChartCard>
                </div>

                {/* Row 5: Calendar Heatmap and Population Pyramid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard
                        title="Daily Casualties Calendar"
                        icon={<Calendar className="h-5 w-5 text-destructive" />}
                        badge="Calendar Heatmap"
                        chartType="calendar"
                        dataSource={{
                            source: "Gaza Ministry of Health",
                            url: "https://example.com",
                            lastUpdated: "Daily",
                            reliability: "high",
                            methodology: "Daily casualty reports aggregated in calendar format showing every day of conflict"
                        }}
                    >
                        <CalendarHeatmapChart />
                    </ChartCard>

                    <ChartCard
                        title="Age & Gender Distribution"
                        icon={<Users className="h-5 w-5 text-primary" />}
                        badge="Population Pyramid"
                        chartType="pyramid"
                        dataSource={{
                            source: "Gaza Ministry of Health",
                            url: "https://example.com",
                            lastUpdated: "Weekly",
                            reliability: "high",
                            methodology: "Demographic analysis of casualties by age group and gender with verified records"
                        }}
                    >
                        <PopulationPyramidChart />
                    </ChartCard>
                </div>

                {/* Row 6: Isotype and Waffle Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard
                        title="Humanizing the Numbers"
                        icon={<Users className="h-5 w-5 text-destructive" />}
                        badge="Isotype Chart"
                        chartType="isotype"
                        dataSource={{
                            source: "Gaza Ministry of Health",
                            url: "https://example.com",
                            lastUpdated: "Daily",
                            reliability: "high",
                            methodology: "Each icon represents 100 lives lost - visualizing the human cost of conflict"
                        }}
                    >
                        <IsotypeChart />
                    </ChartCard>

                    <ChartCard
                        title="Casualty Proportion Grid"
                        icon={<BarChart3 className="h-5 w-5 text-warning" />}
                        badge="Waffle Chart"
                        chartType="waffle"
                        dataSource={{
                            source: "Gaza Ministry of Health",
                            url: "https://example.com",
                            lastUpdated: "Daily",
                            reliability: "high",
                            methodology: "100-square grid showing casualties as percentage of total population"
                        }}
                    >
                        <WaffleChart />
                    </ChartCard>
                </div>

                {/* Row 7: Timeline with Events and Small Multiples */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard
                        title="Timeline with Major Events"
                        icon={<Calendar className="h-5 w-5 text-primary" />}
                        badge="Timeline Chart"
                        chartType="timeline"
                        dataSource={{
                            source: "Gaza Ministry of Health & UN OCHA",
                            url: "https://example.com",
                            lastUpdated: "Daily",
                            reliability: "high",
                            methodology: "Casualty timeline with annotated major events, ceasefires, and humanitarian milestones"
                        }}
                    >
                        <TimelineEventsChart />
                    </ChartCard>

                    <ChartCard
                        title="Regional Comparison"
                        icon={<Map className="h-5 w-5 text-secondary" />}
                        badge="Small Multiples"
                        chartType="smallmultiples"
                        dataSource={{
                            source: "Gaza Ministry of Health",
                            url: "https://example.com",
                            lastUpdated: "Daily",
                            reliability: "high",
                            methodology: "Synchronized regional casualty trends with coordinated scales for pattern comparison"
                        }}
                    >
                        <SmallMultiplesChart />
                    </ChartCard>
                </div>

                {/* Row 8: Horizon Chart (Full Width) */}
                <div className="grid grid-cols-1 gap-6">
                    <ChartCard
                        title="Compact Multi-Metric Overview"
                        icon={<Activity className="h-5 w-5 text-primary" />}
                        badge="Horizon Chart"
                        chartType="horizon"
                        dataSource={{
                            source: "Multiple Sources (GMoH, UN OCHA, UNRWA)",
                            url: "https://example.com",
                            lastUpdated: "Daily",
                            reliability: "high",
                            methodology: "Space-efficient visualization of 5 key metrics using horizon bands for compact comparison"
                        }}
                    >
                        <HorizonChart />
                    </ChartCard>
                </div>
            </div>

            {/* Footer Info */}
            <Card className="bg-muted/30">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2">About This Demo</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                This advanced demo showcases 15 different D3.js chart types with highly animated, interactive visualizations.
                                Each chart features unified filter controls, export/share functionality, and detailed data
                                source information. Hover over elements for smart tooltips with comprehensive data insights.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
