/**
 * Grid Integration Example
 * Shows how to use the grid system with enhanced components
 * 
 * ⚠️ DEMO ONLY - NOT REAL DATA
 * This component is for demonstration purposes only and uses sample data.
 * Do not use in production dashboards.
 */

import React from 'react';
import { AnimatedGrid, ResponsiveGrid } from './index';
import { EnhancedMetricCard } from '../enhanced-metric-card';
import { EnhancedCard } from '../enhanced-card';
import { TrendingUp, TrendingDown, Users, Building2, Heart, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../alert';

/**
 * Example: Gaza Dashboard Metrics Grid
 */
export function GazaMetricsGridExample() {
  return (
    <>
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Demo Component - Not Real Data</AlertTitle>
        <AlertDescription>
          This is a demonstration component showing grid layout capabilities. 
          The data shown here is sample data for UI testing only.
        </AlertDescription>
      </Alert>
      <AnimatedGrid
      columns={{
        mobile: 1,
        tablet: 2,
        desktop: 3,
        wide: 4,
      }}
      gap={24}
      staggerDelay={100}
      threshold={0.1}
      triggerOnce={true}
    >
      <EnhancedMetricCard
        title="Total Casualties"
        value={45000}
        change={{
          value: 12.5,
          trend: 'up',
          period: 'vs last month',
        }}
        icon={Users}
        gradient={{
          from: 'from-red-500/10',
          to: 'to-red-600/5',
          direction: 'br',
        }}
        sparkline={{
          data: [
            { value: 38000, date: '2024-01' },
            { value: 40000, date: '2024-02' },
            { value: 42000, date: '2024-03' },
            { value: 45000, date: '2024-04' },
          ],
          color: 'hsl(var(--destructive))',
        }}
        dataSources={['who']}
        quality="high"
      />

      <EnhancedMetricCard
        title="Displaced Population"
        value={1900000}
        change={{
          value: 8.3,
          trend: 'up',
          period: 'vs last month',
        }}
        icon={AlertTriangle}
        gradient={{
          from: 'from-orange-500/10',
          to: 'to-orange-600/5',
          direction: 'br',
        }}
        dataSources={['unrwa']}
        quality="high"
        realTime
      />

      <EnhancedMetricCard
        title="Infrastructure Damage"
        value={75}
        change={{
          value: 5.2,
          trend: 'up',
          period: 'vs last month',
        }}
        icon={Building2}
        gradient={{
          from: 'from-yellow-500/10',
          to: 'to-yellow-600/5',
          direction: 'br',
        }}
        sparkline={{
          data: [
            { value: 60, date: '2024-01' },
            { value: 65, date: '2024-02' },
            { value: 70, date: '2024-03' },
            { value: 75, date: '2024-04' },
          ],
          color: 'hsl(var(--warning))',
        }}
        dataSources={['un_ocha']}
        quality="medium"
      />

      <EnhancedMetricCard
        title="Healthcare Facilities"
        value={12}
        change={{
          value: -15.2,
          trend: 'down',
          period: 'vs last month',
        }}
        icon={Heart}
        gradient={{
          from: 'from-blue-500/10',
          to: 'to-blue-600/5',
          direction: 'br',
        }}
        dataSources={['who']}
        quality="high"
      />
    </AnimatedGrid>
  );
}

/**
 * Example: West Bank Dashboard Metrics Grid
 */
export function WestBankMetricsGridExample() {
  return (
    <AnimatedGrid
      columns={{
        mobile: 1,
        tablet: 2,
        desktop: 3,
      }}
      gap={24}
      staggerDelay={100}
    >
      <EnhancedMetricCard
        title="Settler Attacks"
        value={450}
        change={{
          value: 23.5,
          trend: 'up',
          period: 'vs last month',
        }}
        icon={AlertTriangle}
        gradient={{
          from: 'from-red-500/10',
          to: 'to-red-600/5',
          direction: 'br',
        }}
        dataSources={['btselem']}
        quality="high"
      />

      <EnhancedMetricCard
        title="Prisoners Detained"
        value={8500}
        change={{
          value: 12.8,
          trend: 'up',
          period: 'vs last month',
        }}
        icon={Users}
        gradient={{
          from: 'from-orange-500/10',
          to: 'to-orange-600/5',
          direction: 'br',
        }}
        dataSources={['custom']}
        quality="high"
        realTime
      />

      <EnhancedMetricCard
        title="Demolitions"
        value={320}
        change={{
          value: 18.2,
          trend: 'up',
          period: 'vs last month',
        }}
        icon={Building2}
        gradient={{
          from: 'from-yellow-500/10',
          to: 'to-yellow-600/5',
          direction: 'br',
        }}
        sparkline={{
          data: [
            { value: 250, date: '2024-01' },
            { value: 280, date: '2024-02' },
            { value: 300, date: '2024-03' },
            { value: 320, date: '2024-04' },
          ],
          color: 'hsl(var(--warning))',
        }}
        dataSources={['un_ocha']}
        quality="high"
      />
    </AnimatedGrid>
  );
}

/**
 * Example: Simple Card Grid (No Animation)
 */
export function SimpleCardGridExample() {
  return (
    <ResponsiveGrid
      columns={{
        mobile: 1,
        tablet: 2,
        desktop: 4,
      }}
      gap={16}
    >
      <EnhancedCard
        gradient={{
          from: 'from-blue-500/10',
          to: 'to-blue-600/5',
        }}
        className="p-6"
      >
        <h3 className="text-lg font-semibold mb-2">Card 1</h3>
        <p className="text-sm text-muted-foreground">
          Simple card in responsive grid
        </p>
      </EnhancedCard>

      <EnhancedCard
        gradient={{
          from: 'from-green-500/10',
          to: 'to-green-600/5',
        }}
        className="p-6"
      >
        <h3 className="text-lg font-semibold mb-2">Card 2</h3>
        <p className="text-sm text-muted-foreground">
          Another card with gradient
        </p>
      </EnhancedCard>

      <EnhancedCard
        gradient={{
          from: 'from-purple-500/10',
          to: 'to-purple-600/5',
        }}
        className="p-6"
      >
        <h3 className="text-lg font-semibold mb-2">Card 3</h3>
        <p className="text-sm text-muted-foreground">
          Third card example
        </p>
      </EnhancedCard>

      <EnhancedCard
        gradient={{
          from: 'from-orange-500/10',
          to: 'to-orange-600/5',
        }}
        className="p-6"
      >
        <h3 className="text-lg font-semibold mb-2">Card 4</h3>
        <p className="text-sm text-muted-foreground">
          Fourth card example
        </p>
      </EnhancedCard>
    </ResponsiveGrid>
  );
}

/**
 * Example: Mixed Content Grid with Custom Spans
 */
export function MixedContentGridExample() {
  return (
    <AnimatedGrid
      columns={{
        mobile: 1,
        tablet: 2,
        desktop: 3,
      }}
      gap={24}
    >
      {/* Featured card spanning 2 columns on desktop */}
      <div className="col-span-1 md:col-span-2">
        <EnhancedCard
          gradient={{
            from: 'from-primary/10',
            to: 'to-primary/5',
          }}
          className="p-8 h-full"
        >
          <h2 className="text-2xl font-bold mb-4">Featured Content</h2>
          <p className="text-muted-foreground">
            This card spans 2 columns on desktop and tablet viewports,
            providing more space for important content.
          </p>
        </EnhancedCard>
      </div>

      {/* Regular cards */}
      <EnhancedCard className="p-6">
        <h3 className="text-lg font-semibold mb-2">Regular Card</h3>
        <p className="text-sm text-muted-foreground">Standard width card</p>
      </EnhancedCard>

      <EnhancedCard className="p-6">
        <h3 className="text-lg font-semibold mb-2">Another Card</h3>
        <p className="text-sm text-muted-foreground">Standard width card</p>
      </EnhancedCard>

      <EnhancedCard className="p-6">
        <h3 className="text-lg font-semibold mb-2">Third Card</h3>
        <p className="text-sm text-muted-foreground">Standard width card</p>
      </EnhancedCard>

      <EnhancedCard className="p-6">
        <h3 className="text-lg font-semibold mb-2">Fourth Card</h3>
        <p className="text-sm text-muted-foreground">Standard width card</p>
      </EnhancedCard>
    </AnimatedGrid>
  );
}
