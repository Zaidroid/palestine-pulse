/**
 * Mobile Test Suite
 * 
 * Development tool to test mobile-specific features:
 * - Touch target sizes
 * - Responsive behavior
 * - Performance on mobile
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Activity,
  Zap,
} from 'lucide-react';
import {
  isMobileViewport,
  isTabletViewport,
  isDesktopViewport,
  getCurrentBreakpoint,
  auditTouchTargets,
  isSlowConnection,
  MobilePerformanceMonitor,
  createMobilePerformanceReport,
} from '@/lib/mobile-polish';

export function MobileTestSuite() {
  const [viewport, setViewport] = useState(getCurrentBreakpoint());
  const [touchAudit, setTouchAudit] = useState<ReturnType<typeof auditTouchTargets> | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<string>('');
  const [monitor] = useState(() => new MobilePerformanceMonitor());
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  useEffect(() => {
    const handleResize = () => {
      setViewport(getCurrentBreakpoint());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    monitor.start();
    
    return () => {
      monitor.stop();
    };
  }, [monitor]);
  
  const runTouchAudit = () => {
    const audit = auditTouchTargets();
    setTouchAudit(audit);
  };
  
  const runPerformanceTest = () => {
    const report = createMobilePerformanceReport(monitor);
    setPerformanceMetrics(report);
  };
  
  const getViewportIcon = () => {
    if (isMobileViewport()) return <Smartphone className="h-5 w-5" />;
    if (isTabletViewport()) return <Tablet className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
  };
  
  const getViewportColor = () => {
    if (isMobileViewport()) return 'default';
    if (isTabletViewport()) return 'secondary';
    return 'outline';
  };
  
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">Mobile Test Suite</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Test mobile-specific features and optimizations
        </p>
      </div>
      
      {/* Viewport Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getViewportIcon()}
            Current Viewport
          </CardTitle>
          <CardDescription>
            Resize the window to test responsive behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={getViewportColor() as any} className="gap-2">
              {getViewportIcon()}
              {viewport}
            </Badge>
            <Badge variant={isMobileViewport() ? 'default' : 'outline'}>
              Mobile: {isMobileViewport() ? 'Yes' : 'No'}
            </Badge>
            <Badge variant={isTabletViewport() ? 'default' : 'outline'}>
              Tablet: {isTabletViewport() ? 'Yes' : 'No'}
            </Badge>
            <Badge variant={isDesktopViewport() ? 'default' : 'outline'}>
              Desktop: {isDesktopViewport() ? 'Yes' : 'No'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Width:</span>{' '}
              <span className="font-mono">{window.innerWidth}px</span>
            </div>
            <div>
              <span className="font-medium">Height:</span>{' '}
              <span className="font-mono">{window.innerHeight}px</span>
            </div>
            <div>
              <span className="font-medium">Device Pixel Ratio:</span>{' '}
              <span className="font-mono">{window.devicePixelRatio}</span>
            </div>
            <div>
              <span className="font-medium">Orientation:</span>{' '}
              <span className="font-mono">
                {window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Touch Target Audit */}
      <Card>
        <CardHeader>
          <CardTitle>Touch Target Audit</CardTitle>
          <CardDescription>
            Verify all interactive elements meet 44x44px minimum size
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runTouchAudit} className="w-full md:w-auto">
            Run Touch Target Audit
          </Button>
          
          {touchAudit && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <div className="text-2xl font-bold">{touchAudit.total}</div>
                  <div className="text-sm text-muted-foreground">Total Targets</div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20">
                  <div className="text-2xl font-bold text-secondary flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    {touchAudit.valid}
                  </div>
                  <div className="text-sm text-muted-foreground">Valid Targets</div>
                </div>
                <div className="p-4 rounded-lg bg-destructive/10">
                  <div className="text-2xl font-bold text-destructive flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    {touchAudit.invalid}
                  </div>
                  <div className="text-sm text-muted-foreground">Invalid Targets</div>
                </div>
              </div>
              
              {touchAudit.invalid > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    Issues Found
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-auto">
                    {touchAudit.issues.map((issue, idx) => (
                      <div key={idx} className="p-3 rounded-md bg-muted text-sm">
                        <div className="font-medium mb-1">{issue.element}</div>
                        <ul className="list-disc list-inside text-xs text-muted-foreground">
                          {issue.problems.map((problem, pIdx) => (
                            <li key={pIdx}>{problem}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <Progress 
                value={(touchAudit.valid / touchAudit.total) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground text-center">
                {Math.round((touchAudit.valid / touchAudit.total) * 100)}% of touch targets are valid
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
          <CardDescription>
            Monitor frame rate and memory usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runPerformanceTest} className="w-full md:w-auto">
            Generate Performance Report
          </Button>
          
          {performanceMetrics && (
            <div className="p-4 rounded-lg bg-muted font-mono text-xs whitespace-pre-wrap">
              {performanceMetrics}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Network Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Network Information
          </CardTitle>
          <CardDescription>
            Check connection speed and optimize accordingly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant={isSlowConnection() ? 'destructive' : 'secondary'}>
              {isSlowConnection() ? 'Slow Connection' : 'Fast Connection'}
            </Badge>
            
            {isSlowConnection() && (
              <p className="text-sm text-muted-foreground">
                Animations and images should be optimized for slow connections
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Touch Target Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Touch Target Examples</CardTitle>
          <CardDescription>
            Test different touch target sizes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Valid Touch Targets (44x44px minimum)</p>
            <div className="flex flex-wrap gap-2">
              <Button size="default">Default Button</Button>
              <Button size="lg">Large Button</Button>
              <Button size="icon" className="h-11 w-11">
                <CheckCircle2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-destructive">
              Invalid Touch Targets (Below 44x44px)
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small Button</Button>
              <Button size="icon" className="h-8 w-8">
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              These should only be used on desktop or with adequate spacing
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Responsive Grid Test */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive Grid Test</CardTitle>
          <CardDescription>
            Verify grid adapts to different screen sizes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-4 rounded-lg bg-muted text-center">
                <div className="text-lg font-bold">Card {i}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isMobileViewport() && '1 column'}
                  {isTabletViewport() && '2 columns'}
                  {isDesktopViewport() && '3 columns'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
