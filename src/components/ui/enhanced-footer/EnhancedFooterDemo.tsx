/**
 * Enhanced Footer Demo
 * 
 * Demonstrates the EnhancedFooter component with various states
 */

import { useState } from 'react';
import { EnhancedFooter, DataSourceStatus } from '../enhanced-footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const EnhancedFooterDemo = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [dataSources, setDataSources] = useState<DataSourceStatus[]>([
    {
      name: 'OCHA',
      status: 'active',
      lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      quality: 'high',
      message: 'All systems operational'
    },
    {
      name: 'World Bank',
      status: 'active',
      lastSync: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      quality: 'high',
    },
    {
      name: 'HDX',
      status: 'syncing',
      lastSync: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      quality: 'medium',
      message: 'Syncing latest data...'
    },
    {
      name: 'WFP',
      status: 'active',
      lastSync: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      quality: 'high',
    },
    {
      name: 'B\'Tselem',
      status: 'error',
      lastSync: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      quality: 'low',
      message: 'Connection timeout - retrying...'
    },
  ]);

  const handleRefresh = async () => {
    toast.info('Refreshing data...');
    
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLastUpdated(new Date());
    setDataSources(prev => prev.map(source => ({
      ...source,
      lastSync: new Date(),
      status: source.status === 'error' ? 'active' : source.status,
    })));
    
    toast.success('Data refreshed successfully!');
  };

  const handleExport = () => {
    toast.success('Export started! Your file will download shortly.');
  };

  const handleShare = () => {
    toast.success('Link copied to clipboard!');
  };

  const handleDocs = () => {
    toast.info('Opening documentation...');
  };

  const simulateSyncingState = () => {
    setDataSources(prev => prev.map((source, idx) => 
      idx === 0 ? { ...source, status: 'syncing' as const } : source
    ));

    setTimeout(() => {
      setDataSources(prev => prev.map((source, idx) => 
        idx === 0 ? { ...source, status: 'active' as const, lastSync: new Date() } : source
      ));
    }, 3000);
  };

  const simulateErrorState = () => {
    setDataSources(prev => prev.map((source, idx) => 
      idx === 1 ? { 
        ...source, 
        status: 'error' as const,
        message: 'Connection failed - retrying...'
      } : source
    ));
  };

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Footer Component</CardTitle>
          <CardDescription>
            Modern footer with data source status, real-time sync indicators, countdown timer, and quick actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={simulateSyncingState} variant="outline">
              Simulate Syncing
            </Button>
            <Button onClick={simulateErrorState} variant="outline">
              Simulate Error
            </Button>
            <Button onClick={handleRefresh} variant="outline">
              Trigger Refresh
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Features:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Staggered fade-in animation for data source badges (50ms delay)</li>
              <li>Rotating animation for syncing indicators</li>
              <li>Number flip animation for countdown timer</li>
              <li>Interactive quick action buttons with press/hover animations</li>
              <li>Real-time status updates with color-coded indicators</li>
              <li>Hover cards with detailed source information</li>
              <li>Auto-refresh countdown with visual feedback</li>
              <li>Respects prefers-reduced-motion for accessibility</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Status Indicators:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>Active - Data source is operational</li>
              <li><span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>Syncing - Currently fetching data</li>
              <li><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>Error - Connection or data issue</li>
              <li><span className="inline-block w-2 h-2 rounded-full bg-gray-500 mr-2"></span>Disabled - Source is not active</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Demo Footer - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0">
        <EnhancedFooter
          dataSources={dataSources}
          lastUpdated={lastUpdated}
          autoRefreshInterval={60000} // 1 minute for demo
          onRefresh={handleRefresh}
          onExport={handleExport}
          onShare={handleShare}
          onDocs={handleDocs}
        />
      </div>
    </div>
  );
};
