/**
 * Page Transition System Demo
 * Demonstrates all page transition features
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PageTransition,
  TabTransition,
  SectionTransition,
  useRoutePreload,
  useScrollRestoration,
} from './index';
import { Button } from '../button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';
import { Badge } from '../badge';
import { ArrowRight, Zap, Eye, ScrollText } from 'lucide-react';

export function PageTransitionDemo() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentTab, setCurrentTab] = useState('overview');
  const [currentSection, setCurrentSection] = useState('intro');

  // Scroll restoration
  useScrollRestoration();

  // Route preloading for navigation links
  const gazaPreload = useRoutePreload({
    path: '/gaza',
    delay: 100,
  });

  const westBankPreload = useRoutePreload({
    path: '/west-bank',
    delay: 100,
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Page Transition System</h1>
        <p className="text-muted-foreground text-lg">
          Smooth transitions, intelligent preloading, and scroll restoration
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <Zap className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Smooth Transitions</CardTitle>
            <CardDescription>
              Fade, slide, and scale animations with loading states
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Eye className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Smart Preloading</CardTitle>
            <CardDescription>
              Hover-based route preloading for instant navigation
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <ScrollText className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Scroll Restoration</CardTitle>
            <CardDescription>
              Automatic scroll position saving and restoration
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Page Transition Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Page Transitions</CardTitle>
          <CardDescription>
            Switch between pages with different transition modes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={currentPage === 'home' ? 'default' : 'outline'}
              onClick={() => setCurrentPage('home')}
            >
              Home
            </Button>
            <Button
              variant={currentPage === 'about' ? 'default' : 'outline'}
              onClick={() => setCurrentPage('about')}
            >
              About
            </Button>
            <Button
              variant={currentPage === 'contact' ? 'default' : 'outline'}
              onClick={() => setCurrentPage('contact')}
            >
              Contact
            </Button>
          </div>

          <PageTransition mode="fade" pageKey={currentPage}>
            <div className="p-6 border rounded-lg bg-muted/50">
              {currentPage === 'home' && (
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Home Page</h3>
                  <p className="text-muted-foreground">
                    This content transitions with a fade animation.
                  </p>
                </div>
              )}
              {currentPage === 'about' && (
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">About Page</h3>
                  <p className="text-muted-foreground">
                    Learn more about our page transition system.
                  </p>
                </div>
              )}
              {currentPage === 'contact' && (
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Contact Page</h3>
                  <p className="text-muted-foreground">
                    Get in touch with us through various channels.
                  </p>
                </div>
              )}
            </div>
          </PageTransition>
        </CardContent>
      </Card>

      {/* Tab Transition Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Tab Transitions</CardTitle>
          <CardDescription>
            Optimized cross-fade transitions for tab content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>

            <TabTransition tabKey={currentTab}>
              <div className="mt-4 p-6 border rounded-lg bg-muted/50">
                {currentTab === 'overview' && (
                  <div className="space-y-2">
                    <h4 className="text-xl font-semibold">Overview</h4>
                    <p className="text-muted-foreground">
                      Tab transitions use a faster cross-fade animation optimized
                      for frequent switching.
                    </p>
                  </div>
                )}
                {currentTab === 'features' && (
                  <div className="space-y-2">
                    <h4 className="text-xl font-semibold">Features</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Fast 400ms cross-fade animation</li>
                      <li>Respects reduced motion preferences</li>
                      <li>Smooth content transitions</li>
                    </ul>
                  </div>
                )}
                {currentTab === 'usage' && (
                  <div className="space-y-2">
                    <h4 className="text-xl font-semibold">Usage</h4>
                    <pre className="p-4 bg-background rounded text-sm overflow-x-auto">
                      {`<TabTransition tabKey={activeTab}>
  <TabContent />
</TabTransition>`}
                    </pre>
                  </div>
                )}
              </div>
            </TabTransition>
          </Tabs>
        </CardContent>
      </Card>

      {/* Section Transition Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Section Transitions</CardTitle>
          <CardDescription>
            Minimal transitions for sections within a page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={currentSection === 'intro' ? 'default' : 'outline'}
              onClick={() => setCurrentSection('intro')}
            >
              Intro
            </Button>
            <Button
              size="sm"
              variant={currentSection === 'details' ? 'default' : 'outline'}
              onClick={() => setCurrentSection('details')}
            >
              Details
            </Button>
            <Button
              size="sm"
              variant={currentSection === 'conclusion' ? 'default' : 'outline'}
              onClick={() => setCurrentSection('conclusion')}
            >
              Conclusion
            </Button>
          </div>

          <SectionTransition sectionKey={currentSection}>
            <div className="p-6 border rounded-lg bg-muted/50">
              {currentSection === 'intro' && (
                <p className="text-muted-foreground">
                  Section transitions use subtle animations perfect for content
                  that changes within the same page context.
                </p>
              )}
              {currentSection === 'details' && (
                <p className="text-muted-foreground">
                  The animation is minimal (300ms fade + slight slide) to avoid
                  being distracting during frequent content updates.
                </p>
              )}
              {currentSection === 'conclusion' && (
                <p className="text-muted-foreground">
                  Use section transitions for accordion content, expandable
                  sections, or dynamic content areas.
                </p>
              )}
            </div>
          </SectionTransition>
        </CardContent>
      </Card>

      {/* Route Preloading Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Route Preloading</CardTitle>
          <CardDescription>
            Hover over links to preload routes for instant navigation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-4">
              Hover over these links to trigger route preloading. The route will
              be loaded in the background, making navigation instant.
            </p>
            <div className="flex gap-4">
              <Link
                to="/gaza"
                {...gazaPreload}
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Gaza Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/west-bank"
                {...westBankPreload}
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                West Bank Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">How it works:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Hover triggers preload after 100ms delay</li>
              <li>Route module is loaded in background</li>
              <li>Optional data prefetching supported</li>
              <li>Cached to avoid duplicate loads</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Scroll Restoration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Scroll Restoration</CardTitle>
          <CardDescription>
            Automatic scroll position management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Saves scroll position on navigation</li>
              <li>Restores position on back/forward navigation</li>
              <li>Scrolls to top on new page navigation</li>
              <li>Persists across page reloads (sessionStorage)</li>
              <li>Supports container scroll restoration</li>
            </ul>
          </div>

          <div className="p-4 border rounded-lg bg-muted/50">
            <Badge variant="secondary" className="mb-2">
              Automatic
            </Badge>
            <p className="text-sm text-muted-foreground">
              Scroll restoration is enabled automatically when you use the
              useScrollRestoration hook in your app root.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>
            How to use the page transition system in your app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Basic Page Transition:</h4>
            <pre className="p-4 bg-background rounded text-sm overflow-x-auto">
              {`import { PageTransition } from '@/components/ui/page-transition';

<PageTransition mode="fade" pageKey={currentRoute}>
  <YourPageContent />
</PageTransition>`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Route Preloading:</h4>
            <pre className="p-4 bg-background rounded text-sm overflow-x-auto">
              {`import { useRoutePreload } from '@/hooks/useRoutePreload';

const preloadProps = useRoutePreload({
  path: '/dashboard',
  prefetchData: async () => {
    await fetchDashboardData();
  },
});

<Link to="/dashboard" {...preloadProps}>
  Dashboard
</Link>`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Scroll Restoration:</h4>
            <pre className="p-4 bg-background rounded text-sm overflow-x-auto">
              {`import { useScrollRestoration } from '@/hooks/useScrollRestoration';

function App() {
  useScrollRestoration();
  return <Routes>...</Routes>;
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
