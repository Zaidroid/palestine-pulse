/**
 * Advanced Theme Demo
 * 
 * Comprehensive demonstration of the humanitarian theme with:
 * - Expandable stat cards with modals
 * - Data source badges with hover details
 * - Interactive charts with stunning visuals
 * - Animated tab system
 * - Enhanced dark/light theme implementation
 */

import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { ExpandableStatCard } from './expandable-stat-card';
import { DataSourceBadge } from './data-source-badge';
import { CasualtiesTimelineChart } from '@/components/charts/CasualtiesTimelineChart';
import { InfrastructureDamageChart } from '@/components/charts/InfrastructureDamageChart';
import { DisplacementFlowChart } from '@/components/charts/DisplacementFlowChart';
import { CasualtyBreakdownChart } from '@/components/charts/CasualtyBreakdownChart';
import { WeeklyTrendHeatmap } from '@/components/charts/WeeklyTrendHeatmap';
import { useThemePreference } from '@/hooks/useThemePreference';
import { 
  Moon, Sun, AlertTriangle, Users, FileText, Activity,
  TrendingUp, Heart, Home, Building2, Droplet, Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

type TabId = 'overview' | 'statistics' | 'charts' | 'components';

export const AdvancedThemeDemo = () => {
  const { theme, toggleTheme } = useThemePreference();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [counters, setCounters] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const targets = [45000, 102000, 1900000, 36];
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounters(targets.map(target => Math.floor(target * easeOut)));

      if (step >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'overview' as TabId, label: 'Overview', icon: <Home className="h-4 w-4" /> },
    { id: 'statistics' as TabId, label: 'Statistics', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'charts' as TabId, label: 'Charts', icon: <Activity className="h-4 w-4" /> },
    { id: 'components' as TabId, label: 'Components', icon: <Building2 className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen p-6 space-y-8 bg-background">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Advanced Theme Demo
            </h1>
            <p className="text-muted-foreground">
              Comprehensive showcase of the humanitarian crisis dashboard theme
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-card text-foreground rounded-lg hover:bg-muted transition-all duration-300 shadow-theme-sm hover:shadow-theme-md"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="text-sm font-medium">Toggle Theme</span>
          </button>
        </div>
      </div>

      {/* Animated Tab System */}
      <div className="space-y-6">
        <div className="flex gap-2 p-1 bg-muted/50 rounded-lg border border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md
                font-medium text-sm transition-all duration-300
                ${activeTab === tab.id
                  ? 'bg-background text-foreground shadow-theme-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && <OverviewTab counters={counters} />}
          {activeTab === 'statistics' && <StatisticsTab />}
          {activeTab === 'charts' && <ChartsTab />}
          {activeTab === 'components' && <ComponentsTab />}
        </div>
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab = ({ counters }: { counters: number[] }) => (
  <div className="space-y-6">
    {/* Key Metrics Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="stat-card border-l-4 border-l-destructive">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Total Deaths
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {counters[0].toLocaleString()}
              </p>
            </div>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">40% children</p>
          </div>
        </CardContent>
      </Card>

      <Card className="stat-card border-l-4 border-l-warning">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Injured
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {counters[1].toLocaleString()}
              </p>
            </div>
            <Activity className="h-5 w-5 text-warning" />
          </div>
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">12% critical</p>
          </div>
        </CardContent>
      </Card>

      <Card className="stat-card border-l-4 border-l-secondary">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Displaced
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {counters[2].toLocaleString()}
              </p>
            </div>
            <Users className="h-5 w-5 text-secondary" />
          </div>
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">85% of population</p>
          </div>
        </CardContent>
      </Card>

      <Card className="stat-card border-l-4 border-l-muted-foreground">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Hospitals Destroyed
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {counters[3]}
              </p>
            </div>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">100% of total</p>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Design Principles */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { title: 'Respectful', desc: 'Somber colors appropriate for tragedy', icon: <Heart className="h-5 w-5" />, color: 'destructive' },
        { title: 'Functional', desc: 'Clear data without distraction', icon: <Activity className="h-5 w-5" />, color: 'primary' },
        { title: 'Accessible', desc: 'High contrast for all users', icon: <Users className="h-5 w-5" />, color: 'secondary' },
        { title: 'Dignified', desc: 'Professional and honorable', icon: <FileText className="h-5 w-5" />, color: 'warning' }
      ].map((principle, i) => (
        <Card key={i} className="card-elevated hover:scale-[1.02] transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className={`p-3 rounded-lg bg-${principle.color}/10 text-${principle.color}`}>
                {principle.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">{principle.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{principle.desc}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Quick Charts Preview */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-base">Casualty Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            Interactive donut chart - See Charts tab
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-base">Weekly Intensity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            Interactive heatmap - See Charts tab
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Statistics Tab with Expandable Cards
const StatisticsTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <ExpandableStatCard
      title="Confirmed Deaths"
      value={45000}
      icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
      accentColor="destructive"
      breakdown={[
        { label: "Children", value: 18000, description: "40% of total casualties" },
        { label: "Women", value: 13500, description: "30% of total casualties" },
        { label: "Men", value: 11250, description: "25% of total casualties" },
        { label: "Elderly", value: 2250, description: "5% of total casualties" },
        { label: "Medical Staff", value: 520, description: "Healthcare workers killed" },
        { label: "Journalists", value: 140, description: "Media personnel killed" }
      ]}
      source="Gaza Ministry of Health"
      sourceUrl="https://example.com"
      lastUpdated="Updated 2 hours ago"
      methodology="Direct hospital reports and field documentation verified by international observers"
      additionalInfo={
        <p>
          These figures represent confirmed deaths only. Thousands more are 
          missing under rubble or unaccounted for. The actual death toll is 
          estimated to be significantly higher.
        </p>
      }
      trend={{ value: 12, label: "from last week", direction: "up" }}
    />

    <ExpandableStatCard
      title="Injured"
      value={102000}
      icon={<Activity className="h-5 w-5 text-warning" />}
      accentColor="warning"
      breakdown={[
        { label: "Critical Condition", value: 12240, description: "Requiring immediate care" },
        { label: "Serious Injuries", value: 30600, description: "Long-term treatment needed" },
        { label: "Moderate Injuries", value: 40800, description: "Stable condition" },
        { label: "Minor Injuries", value: 18360, description: "Outpatient care" },
        { label: "Amputations", value: 3400, description: "Limb loss cases" },
        { label: "Burns", value: 2600, description: "Severe burn victims" }
      ]}
      source="Palestinian Red Crescent"
      sourceUrl="https://example.com"
      lastUpdated="Updated 4 hours ago"
      methodology="Hospital admissions and field medical reports"
      additionalInfo={
        <p>
          Medical facilities are overwhelmed. Many injured cannot receive adequate
          treatment due to lack of supplies and destroyed infrastructure.
        </p>
      }
      trend={{ value: 8, label: "from last week", direction: "up" }}
    />

    <ExpandableStatCard
      title="Displaced"
      value={1900000}
      icon={<Users className="h-5 w-5 text-secondary" />}
      accentColor="secondary"
      breakdown={[
        { label: "In Shelters", value: 1140000, description: "UNRWA facilities" },
        { label: "With Relatives", value: 570000, description: "Staying with family" },
        { label: "Makeshift Camps", value: 190000, description: "Informal settlements" },
        { label: "Children", value: 950000, description: "50% of displaced" },
        { label: "Women", value: 665000, description: "35% of displaced" },
        { label: "Elderly", value: 95000, description: "5% of displaced" }
      ]}
      source="UNRWA"
      sourceUrl="https://example.com"
      lastUpdated="Updated 6 hours ago"
      methodology="Shelter registration and field surveys"
      additionalInfo={
        <p>
          85% of Gaza's population has been displaced at least once. Many families
          have been displaced multiple times as conflict zones shift.
        </p>
      }
    />

    <ExpandableStatCard
      title="Infrastructure Destroyed"
      value={36}
      icon={<Building2 className="h-5 w-5 text-muted-foreground" />}
      accentColor="muted-foreground"
      breakdown={[
        { label: "Hospitals", value: 36, description: "Out of 36 total" },
        { label: "Schools", value: 352, description: "Educational facilities" },
        { label: "Mosques", value: 227, description: "Places of worship" },
        { label: "Residential Buildings", value: 12500, description: "Homes destroyed" },
        { label: "Water Facilities", value: 89, description: "Water infrastructure" },
        { label: "Power Stations", value: 12, description: "Electricity grid" }
      ]}
      source="UN OCHA"
      sourceUrl="https://example.com"
      lastUpdated="Updated 12 hours ago"
      methodology="Satellite imagery and ground verification"
      additionalInfo={
        <p>
          Critical infrastructure damage has created a humanitarian catastrophe.
          Basic services like healthcare, water, and electricity are severely compromised.
        </p>
      }
    />
  </div>
);

// Charts Tab with D3.js Visualizations
const ChartsTab = () => (
  <div className="space-y-6">
    {/* First Row - 2 Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Casualties Timeline */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5" />
              Casualties Timeline
            </CardTitle>
            <Badge variant="destructive" className="text-xs">Area Chart</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CasualtiesTimelineChart />
          <div className="mt-4 pt-4 border-t border-border/50">
            <DataSourceBadge 
              source="Gaza Ministry of Health"
              lastUpdated="Daily updates"
              reliability="high"
              methodology="Direct hospital reports and field documentation"
            />
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure Damage */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-5 w-5" />
              Infrastructure Destruction
            </CardTitle>
            <Badge variant="warning" className="text-xs">Bar Chart</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <InfrastructureDamageChart />
          <div className="mt-4 pt-4 border-t border-border/50">
            <DataSourceBadge 
              source="UN OCHA"
              lastUpdated="Weekly assessment"
              reliability="high"
              methodology="Satellite imagery and ground verification"
            />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Second Row - 2 Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Casualty Breakdown */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5" />
              Casualty Demographics
            </CardTitle>
            <Badge variant="destructive" className="text-xs">Donut Chart</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CasualtyBreakdownChart />
          <div className="mt-4 pt-4 border-t border-border/50">
            <DataSourceBadge 
              source="Gaza Ministry of Health"
              lastUpdated="Daily updates"
              reliability="high"
              methodology="Demographic analysis of confirmed casualties"
            />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trend Heatmap */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-5 w-5" />
              Weekly Intensity Heatmap
            </CardTitle>
            <Badge variant="secondary" className="text-xs">Heatmap</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <WeeklyTrendHeatmap />
          <div className="mt-4 pt-4 border-t border-border/50">
            <DataSourceBadge 
              source="Gaza Ministry of Health"
              lastUpdated="Daily updates"
              reliability="high"
              methodology="Daily casualty reports aggregated by week"
            />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Full Width Chart */}
    <Card className="card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Population Displacement Flow
          </CardTitle>
          <Badge variant="secondary">Flow Diagram</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <DisplacementFlowChart />
        <div className="mt-4 pt-4 border-t border-border/50">
          <DataSourceBadge 
            source="UNRWA"
            lastUpdated="Bi-weekly updates"
            reliability="high"
            methodology="Shelter registration and field surveys"
          />
        </div>
      </CardContent>
    </Card>
  </div>
);

// Components Tab
const ComponentsTab = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Theme Components Showcase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Badges */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Badges</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        {/* Card Variants */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Card Variants</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="card-elevated">
              <CardContent className="pt-6">
                <p className="text-sm font-medium">Elevated Card</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Subtle lift with shadow
                </p>
              </CardContent>
            </Card>
            <Card className="card-gradient-bg">
              <CardContent className="pt-6">
                <p className="text-sm font-medium">Gradient Card</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Subtle background gradient
                </p>
              </CardContent>
            </Card>
            <Card className="card-interactive">
              <CardContent className="pt-6">
                <p className="text-sm font-medium">Interactive Card</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Hover for glow effect
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Source Badge Demo */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Data Source Badges</h3>
          <div className="flex flex-wrap gap-4">
            <DataSourceBadge 
              source="Gaza Ministry of Health"
              url="https://example.com"
              lastUpdated="2 hours ago"
              reliability="high"
            />
            <DataSourceBadge 
              source="UN OCHA"
              url="https://example.com"
              lastUpdated="Daily"
              reliability="high"
              methodology="Satellite imagery and field verification"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
