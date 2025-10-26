/**
 * Grid System Demo
 * Demonstrates ResponsiveGrid and AnimatedGrid components
 */

import React from 'react';
import { ResponsiveGrid, AnimatedGrid, SimpleAnimatedGrid } from './index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export function GridDemo() {
  const { breakpoint, isMobile, isTablet, isDesktop, isWide } = useBreakpoint();

  // Sample data for grid items
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: 'Sample grid item content',
  }));

  return (
    <div className="space-y-12 p-8">
      {/* Breakpoint Info */}
      <Card>
        <CardHeader>
          <CardTitle>Current Breakpoint</CardTitle>
          <CardDescription>
            Resize the window to see responsive behavior
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className={`px-4 py-2 rounded-lg ${isMobile ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              Mobile ({isMobile ? '✓' : '✗'})
            </div>
            <div className={`px-4 py-2 rounded-lg ${isTablet ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              Tablet ({isTablet ? '✓' : '✗'})
            </div>
            <div className={`px-4 py-2 rounded-lg ${isDesktop ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              Desktop ({isDesktop ? '✓' : '✗'})
            </div>
            <div className={`px-4 py-2 rounded-lg ${isWide ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              Wide ({isWide ? '✓' : '✗'})
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Current: <span className="font-mono font-bold">{breakpoint}</span>
          </p>
        </CardContent>
      </Card>

      {/* ResponsiveGrid Demo */}
      <div>
        <h2 className="text-2xl font-bold mb-4">ResponsiveGrid</h2>
        <p className="text-muted-foreground mb-6">
          Basic responsive grid without animations
        </p>
        <ResponsiveGrid
          columns={{
            mobile: 1,
            tablet: 2,
            desktop: 3,
            wide: 4,
          }}
          gap={16}
        >
          {items.slice(0, 8).map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </ResponsiveGrid>
      </div>

      {/* AnimatedGrid Demo */}
      <div>
        <h2 className="text-2xl font-bold mb-4">AnimatedGrid</h2>
        <p className="text-muted-foreground mb-6">
          Grid with staggered fade-in animations triggered by intersection observer
        </p>
        <AnimatedGrid
          columns={{
            mobile: 1,
            tablet: 2,
            desktop: 3,
            wide: 4,
          }}
          gap={16}
          staggerDelay={100}
          threshold={0.1}
          triggerOnce={true}
        >
          {items.map((item) => (
            <Card key={item.id} className="h-32">
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </AnimatedGrid>
      </div>

      {/* SimpleAnimatedGrid Demo */}
      <div>
        <h2 className="text-2xl font-bold mb-4">SimpleAnimatedGrid</h2>
        <p className="text-muted-foreground mb-6">
          Grid with immediate staggered animations (no intersection observer)
        </p>
        <SimpleAnimatedGrid
          columns={{
            mobile: 1,
            tablet: 2,
            desktop: 4,
            wide: 6,
          }}
          gap={12}
          staggerDelay={50}
        >
          {items.slice(0, 6).map((item) => (
            <Card key={item.id} className="h-24">
              <CardHeader>
                <CardTitle className="text-sm">{item.title}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </SimpleAnimatedGrid>
      </div>

      {/* Custom Gap Demo */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Custom Gap Spacing</h2>
        <p className="text-muted-foreground mb-6">
          Grid with custom gap values
        </p>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Gap: 8px</h3>
            <ResponsiveGrid gap={8}>
              {items.slice(0, 3).map((item) => (
                <Card key={item.id} className="h-20" />
              ))}
            </ResponsiveGrid>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Gap: 24px</h3>
            <ResponsiveGrid gap={24}>
              {items.slice(0, 3).map((item) => (
                <Card key={item.id} className="h-20" />
              ))}
            </ResponsiveGrid>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Gap: 48px</h3>
            <ResponsiveGrid gap={48}>
              {items.slice(0, 3).map((item) => (
                <Card key={item.id} className="h-20" />
              ))}
            </ResponsiveGrid>
          </div>
        </div>
      </div>
    </div>
  );
}
