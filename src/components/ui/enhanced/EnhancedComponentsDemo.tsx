/**
 * Enhanced Components Demo
 * Example usage of EnhancedCard, AnimatedCounter, and MiniSparkline
 */

import React from 'react';
import {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardContent,
  AnimatedCounter,
  MiniSparkline,
  EnhancedMetricCard,
} from './index';
import { Users, TrendingUp, Package, Activity } from 'lucide-react';

export const EnhancedComponentsDemo: React.FC = () => {
  // Sample sparkline data
  const sparklineData = [
    { value: 100, date: '2024-01-01' },
    { value: 120, date: '2024-01-02' },
    { value: 115, date: '2024-01-03' },
    { value: 140, date: '2024-01-04' },
    { value: 135, date: '2024-01-05' },
    { value: 160, date: '2024-01-06' },
    { value: 155, date: '2024-01-07' },
  ];

  return (
    <div className="p-8 space-y-8 bg-background">
      <div>
        <h2 className="text-2xl font-bold mb-4">Enhanced Components Demo</h2>
        <p className="text-muted-foreground mb-8">
          Examples of the new enhanced base components with animations
        </p>
      </div>

      {/* Basic Card */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Enhanced Card</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EnhancedCard>
            <EnhancedCardHeader>
              <EnhancedCardTitle>Simple Card</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <p className="text-sm text-muted-foreground">
                A basic card with hover animation
              </p>
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard hoverable={false}>
            <EnhancedCardHeader>
              <EnhancedCardTitle>Non-hoverable</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <p className="text-sm text-muted-foreground">
                This card doesn't animate on hover
              </p>
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard loading>
            <EnhancedCardHeader>
              <EnhancedCardTitle>Loading State</EnhancedCardTitle>
            </EnhancedCardHeader>
          </EnhancedCard>
        </div>
      </div>

      {/* Gradient Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Gradient Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EnhancedCard
            gradient={{
              from: 'hsl(var(--primary))',
              to: 'hsl(var(--primary) / 0.1)',
              direction: 'br',
            }}
          >
            <EnhancedCardHeader>
              <EnhancedCardTitle>Red Gradient</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <p className="text-sm">Primary color gradient</p>
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard
            gradient={{
              from: 'hsl(var(--secondary))',
              to: 'hsl(var(--secondary) / 0.1)',
              direction: 'br',
            }}
          >
            <EnhancedCardHeader>
              <EnhancedCardTitle>Green Gradient</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <p className="text-sm">Secondary color gradient</p>
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard
            gradient={{
              from: 'hsl(var(--warning))',
              to: 'hsl(var(--warning) / 0.1)',
              direction: 'br',
            }}
          >
            <EnhancedCardHeader>
              <EnhancedCardTitle>Orange Gradient</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <p className="text-sm">Warning color gradient</p>
            </EnhancedCardContent>
          </EnhancedCard>
        </div>
      </div>

      {/* Animated Counter */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Animated Counter</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EnhancedCard>
            <EnhancedCardHeader>
              <EnhancedCardTitle>Total Count</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <AnimatedCounter
                value={12345}
                className="text-4xl font-bold"
              />
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard>
            <EnhancedCardHeader>
              <EnhancedCardTitle>With Decimals</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <AnimatedCounter
                value={98.76}
                decimals={2}
                suffix="%"
                className="text-4xl font-bold"
              />
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard>
            <EnhancedCardHeader>
              <EnhancedCardTitle>Currency</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <AnimatedCounter
                value={1234567}
                prefix="$"
                className="text-4xl font-bold"
              />
            </EnhancedCardContent>
          </EnhancedCard>
        </div>
      </div>

      {/* Mini Sparkline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mini Sparkline</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EnhancedCard>
            <EnhancedCardHeader>
              <EnhancedCardTitle>Trend Line</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <AnimatedCounter
                value={160}
                className="text-3xl font-bold mb-2"
              />
              <MiniSparkline
                data={sparklineData}
                color="hsl(var(--primary))"
                height={50}
              />
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard>
            <EnhancedCardHeader>
              <EnhancedCardTitle>Without Gradient</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <AnimatedCounter
                value={160}
                className="text-3xl font-bold mb-2"
              />
              <MiniSparkline
                data={sparklineData}
                color="hsl(var(--secondary))"
                height={50}
                showGradient={false}
              />
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard>
            <EnhancedCardHeader>
              <EnhancedCardTitle>No Animation</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <AnimatedCounter
                value={160}
                className="text-3xl font-bold mb-2"
              />
              <MiniSparkline
                data={sparklineData}
                color="hsl(var(--warning))"
                height={50}
                animate={false}
              />
            </EnhancedCardContent>
          </EnhancedCard>
        </div>
      </div>

      {/* Combined Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Combined Example (Metric Card)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EnhancedCard
            gradient={{
              from: 'hsl(var(--primary) / 0.1)',
              to: 'hsl(var(--primary) / 0.02)',
              direction: 'br',
            }}
          >
            <EnhancedCardHeader>
              <EnhancedCardTitle>Total Casualties</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent className="space-y-4">
              <div>
                <AnimatedCounter
                  value={45123}
                  className="text-4xl font-bold"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  +234 from last week
                </p>
              </div>
              <MiniSparkline
                data={sparklineData}
                color="hsl(var(--primary))"
                height={60}
              />
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard
            gradient={{
              from: 'hsl(var(--secondary) / 0.1)',
              to: 'hsl(var(--secondary) / 0.02)',
              direction: 'br',
            }}
          >
            <EnhancedCardHeader>
              <EnhancedCardTitle>Aid Delivered</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent className="space-y-4">
              <div>
                <AnimatedCounter
                  value={8765}
                  suffix=" tons"
                  className="text-4xl font-bold"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  +12% from last month
                </p>
              </div>
              <MiniSparkline
                data={sparklineData.map(d => ({ ...d, value: d.value * 0.8 }))}
                color="hsl(var(--secondary))"
                height={60}
              />
            </EnhancedCardContent>
          </EnhancedCard>
        </div>
      </div>

      {/* Enhanced Metric Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Enhanced Metric Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <EnhancedMetricCard
            title="Total Population"
            value={2345678}
            icon={Users}
            gradient={{
              from: 'hsl(var(--primary) / 0.1)',
              to: 'hsl(var(--primary) / 0.02)',
              direction: 'br',
            }}
            change={{
              value: 2.5,
              trend: 'up',
              period: 'vs last month',
            }}
            sparkline={{
              data: sparklineData,
              color: 'hsl(var(--primary))',
            }}
            dataSources={['tech4palestine', 'un_ocha']}
            lastUpdated={new Date()}
          />

          <EnhancedMetricCard
            title="Aid Packages"
            value={8765}
            unit=" tons"
            icon={Package}
            gradient={{
              from: 'hsl(var(--secondary) / 0.1)',
              to: 'hsl(var(--secondary) / 0.02)',
              direction: 'br',
            }}
            change={{
              value: -5.2,
              trend: 'down',
              period: 'vs last week',
            }}
            sparkline={{
              data: sparklineData.map(d => ({ ...d, value: d.value * 0.7 })),
              color: 'hsl(var(--secondary))',
            }}
            dataSources={['wfp', 'unrwa']}
            lastUpdated={new Date()}
          />

          <EnhancedMetricCard
            title="Active Cases"
            value={1234}
            icon={Activity}
            realTime={true}
            change={{
              value: 0,
              trend: 'neutral',
              period: 'stable',
            }}
            dataSources={['who']}
            lastUpdated={new Date()}
          />

          <EnhancedMetricCard
            title="Growth Rate"
            value={12.5}
            unit="%"
            icon={TrendingUp}
            gradient={{
              from: 'hsl(var(--warning) / 0.1)',
              to: 'hsl(var(--warning) / 0.02)',
              direction: 'br',
            }}
            change={{
              value: 3.2,
              trend: 'up',
              period: 'vs last quarter',
            }}
            sparkline={{
              data: sparklineData.map(d => ({ ...d, value: d.value * 0.5 })),
              color: 'hsl(var(--warning))',
            }}
            dataSources={['world_bank']}
            lastUpdated={new Date()}
            expandable={true}
            expandedContent={
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Detailed breakdown of growth rate across different sectors and regions.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Q1 2024</div>
                    <div className="text-2xl font-bold">9.3%</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Q2 2024</div>
                    <div className="text-2xl font-bold">12.5%</div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};
