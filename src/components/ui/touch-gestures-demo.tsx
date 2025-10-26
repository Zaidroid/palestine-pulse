/**
 * Touch Gestures Demo
 * Demonstrates swipe navigation and pull-to-refresh functionality
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SwipeableTabs, SwipeableContent } from './swipeable-tabs';
import { PullToRefresh, RefreshButton } from './pull-to-refresh';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Smartphone, Hand, RefreshCw } from 'lucide-react';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export function TouchGesturesDemo() {
  const [activeTab, setActiveTab] = useState('tab1');
  const [refreshCount, setRefreshCount] = useState(0);
  const { isMobile } = useBreakpoint();

  const tabs = ['tab1', 'tab2', 'tab3'];

  const handleRefresh = async () => {
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshCount(prev => prev + 1);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Touch Gestures Demo</h2>
        <p className="text-muted-foreground">
          Interactive examples of swipe navigation and pull-to-refresh
        </p>
      </div>

      {/* Swipe Navigation Demo */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Hand className="h-5 w-5 text-primary" />
            <CardTitle>Swipe Navigation</CardTitle>
          </div>
          <CardDescription>
            {isMobile
              ? 'Swipe left or right to navigate between tabs'
              : 'Use the tab buttons to switch (swipe gestures work on touch devices)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>

            <SwipeableTabs
              activeTab={activeTab}
              tabs={tabs}
              onTabChange={setActiveTab}
              className="mt-4"
            >
              <TabsContent value="tab1">
                <SwipeableContent isActive={activeTab === 'tab1'}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">First Tab</h3>
                        <p className="text-muted-foreground">
                          This is the content of the first tab. On mobile devices,
                          you can swipe left to go to the next tab.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </SwipeableContent>
              </TabsContent>

              <TabsContent value="tab2">
                <SwipeableContent isActive={activeTab === 'tab2'}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Second Tab</h3>
                        <p className="text-muted-foreground">
                          This is the content of the second tab. Swipe left or right
                          to navigate between tabs.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </SwipeableContent>
              </TabsContent>

              <TabsContent value="tab3">
                <SwipeableContent isActive={activeTab === 'tab3'}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Third Tab</h3>
                        <p className="text-muted-foreground">
                          This is the content of the third tab. Swipe right to go
                          back to previous tabs.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </SwipeableContent>
              </TabsContent>
            </SwipeableTabs>
          </Tabs>
        </CardContent>
      </Card>

      {/* Pull to Refresh Demo */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            <CardTitle>Pull to Refresh</CardTitle>
          </div>
          <CardDescription>
            {isMobile
              ? 'Pull down from the top to refresh the content'
              : 'Click the refresh button (pull-to-refresh works on touch devices)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Refreshed {refreshCount} times
              </span>
              {!isMobile && (
                <RefreshButton onRefresh={handleRefresh} />
              )}
            </div>

            <PullToRefresh
              onRefresh={handleRefresh}
              threshold={80}
              maxPullDistance={150}
              disabled={!isMobile}
            >
              <div className="min-h-[300px] space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Refreshable Content</h3>
                      <p className="text-muted-foreground">
                        This content can be refreshed by pulling down from the top
                        on mobile devices. The refresh count above will increment
                        each time you refresh.
                      </p>
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <p className="text-sm">
                          Last updated: {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">More Content</h3>
                      <p className="text-muted-foreground">
                        Additional content that will be refreshed along with the
                        rest of the page.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </PullToRefresh>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <CardTitle>Usage Instructions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Swipe Navigation</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Swipe left to go to the next tab</li>
                <li>Swipe right to go to the previous tab</li>
                <li>Works on any touch-enabled device</li>
                <li>Minimum swipe distance: 50px</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Pull to Refresh</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Pull down from the top of the content area</li>
                <li>Release when the indicator shows "Release to refresh"</li>
                <li>Only works when scrolled to the top</li>
                <li>Threshold distance: 80px</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
