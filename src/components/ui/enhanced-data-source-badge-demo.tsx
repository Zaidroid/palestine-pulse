/**
 * Enhanced Data Source Badge Demo
 * 
 * Demonstrates all features of the EnhancedDataSourceBadge component:
 * - Different quality levels (high/medium/low)
 * - Freshness indicators (fresh/recent/stale/outdated)
 * - Hover popovers with detailed information
 * - Click modals for full attribution
 * - Animations (fade-in, slide-up, hover scale, pulse for stale data)
 * - Refresh functionality
 */

import { useState } from 'react';
import { EnhancedDataSourceBadge, DataSourceInfo } from './enhanced-data-source-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

// Sample data sources
const sampleSources: Record<string, DataSourceInfo[]> = {
  high: [
    {
      name: 'UN OCHA',
      url: 'https://www.ochaopt.org/',
      description: 'United Nations Office for the Coordination of Humanitarian Affairs',
      methodology: 'Direct field reports and verified humanitarian data collection',
      reliability: 'Very High',
      updateFrequency: 'Daily',
      verificationUrl: 'https://www.ochaopt.org/data',
    },
    {
      name: 'WHO',
      url: 'https://www.who.int/',
      description: 'World Health Organization',
      methodology: 'Health facility reports and epidemiological surveillance',
      reliability: 'Very High',
      updateFrequency: 'Weekly',
    },
  ],
  medium: [
    {
      name: 'World Bank',
      url: 'https://www.worldbank.org/',
      description: 'World Bank Open Data',
      methodology: 'Economic indicators and statistical modeling',
      reliability: 'High',
      updateFrequency: 'Monthly',
      verificationUrl: 'https://data.worldbank.org/country/PS',
    },
  ],
  low: [
    {
      name: 'Estimated Data',
      url: '#',
      description: 'Modeled estimates based on historical trends',
      methodology: 'Statistical extrapolation from previous periods',
      reliability: 'Medium',
      updateFrequency: 'Quarterly',
    },
  ],
};

export const EnhancedDataSourceBadgeDemo = () => {
  const [refreshCount, setRefreshCount] = useState(0);

  // Different freshness levels for demonstration
  const now = new Date();
  const freshDate = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes ago
  const recentDate = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12 hours ago
  const staleDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
  const outdatedDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago

  const handleRefresh = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setRefreshCount((prev) => prev + 1);
        resolve();
      }, 1500);
    });
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Enhanced Data Source Badge System</h1>
        <p className="text-muted-foreground">
          Modern, animated badges for displaying data source information with quality indicators,
          freshness status, and detailed attribution.
        </p>
      </div>

      {/* Quality Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Indicators</CardTitle>
          <CardDescription>
            Different quality levels with appropriate icons and colors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">High Quality</h3>
            <EnhancedDataSourceBadge
              sources={sampleSources.high}
              quality="high"
              lastRefresh={freshDate}
              onRefresh={handleRefresh}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Medium Quality</h3>
            <EnhancedDataSourceBadge
              sources={sampleSources.medium}
              quality="medium"
              lastRefresh={recentDate}
              onRefresh={handleRefresh}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Low Quality</h3>
            <EnhancedDataSourceBadge
              sources={sampleSources.low}
              quality="low"
              lastRefresh={staleDate}
              onRefresh={handleRefresh}
            />
          </div>
        </CardContent>
      </Card>

      {/* Freshness Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Freshness Indicators</CardTitle>
          <CardDescription>
            Color-coded indicators showing data age with pulsing animation for stale data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Fresh ({"<"} 1 hour)</h3>
            <EnhancedDataSourceBadge
              sources={sampleSources.high}
              quality="high"
              lastRefresh={freshDate}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Recent (1-24 hours)</h3>
            <EnhancedDataSourceBadge
              sources={sampleSources.high}
              quality="high"
              lastRefresh={recentDate}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Stale (1-7 days) - Notice the pulsing animation</h3>
            <EnhancedDataSourceBadge
              sources={sampleSources.medium}
              quality="medium"
              lastRefresh={staleDate}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Outdated ({">"}7 days) - Pulsing animation</h3>
            <EnhancedDataSourceBadge
              sources={sampleSources.low}
              quality="low"
              lastRefresh={outdatedDate}
            />
          </div>
        </CardContent>
      </Card>

      {/* Compact Mode */}
      <Card>
        <CardHeader>
          <CardTitle>Compact Mode</CardTitle>
          <CardDescription>
            Minimal display for space-constrained layouts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EnhancedDataSourceBadge
            sources={sampleSources.high}
            quality="high"
            lastRefresh={freshDate}
            compact
          />
        </CardContent>
      </Card>

      {/* Interactive Features */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Features</CardTitle>
          <CardDescription>
            Hover for quick info, click for full details modal (Refreshed {refreshCount} times)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">With Refresh Button</h3>
            <EnhancedDataSourceBadge
              sources={sampleSources.high}
              quality="high"
              lastRefresh={freshDate}
              onRefresh={handleRefresh}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Without Refresh Button</h3>
            <EnhancedDataSourceBadge
              sources={sampleSources.medium}
              quality="medium"
              lastRefresh={recentDate}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Non-Interactive</h3>
            <EnhancedDataSourceBadge
              sources={sampleSources.low}
              quality="low"
              lastRefresh={staleDate}
              interactive={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* Multiple Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Multiple Data Sources</CardTitle>
          <CardDescription>
            Displaying primary source with additional sources indicator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EnhancedDataSourceBadge
            sources={sampleSources.high}
            quality="high"
            lastRefresh={freshDate}
            onRefresh={handleRefresh}
          />
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Features:</h3>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Hover over badges to see quick information in a popover</li>
              <li>Click badges to open detailed modal with full attribution</li>
              <li>Stale data ({">"} 24 hours) shows pulsing animation</li>
              <li>Quality indicators with appropriate icons and colors</li>
              <li>Freshness status with color-coded dots</li>
              <li>Optional refresh button with loading state</li>
              <li>Clickable source links open in new tabs</li>
              <li>Smooth animations: fade-in, slide-up, hover scale</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Animations:</h3>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Entry: Fade-in + slide-up (300ms)</li>
              <li>Hover: Scale to 1.05 (200ms)</li>
              <li>Stale data: Pulsing opacity and scale (2s loop)</li>
              <li>Modal: Staggered content reveal</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
