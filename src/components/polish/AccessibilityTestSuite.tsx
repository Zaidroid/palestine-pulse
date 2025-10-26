/**
 * Accessibility Test Suite
 * 
 * Development tool to test accessibility features:
 * - ARIA attributes
 * - Keyboard navigation
 * - Screen reader compatibility
 * - Focus management
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  Keyboard, 
  Volume2, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Accessibility,
} from 'lucide-react';
import {
  auditAccessibility,
  verifyHeadingHierarchy,
  verifyLandmarks,
  verifySkipLink,
  getKeyboardNavigationOrder,
  createAccessibilityReport,
  prefersReducedMotion,
  prefersHighContrast,
  prefersDarkMode,
  announceToScreenReader,
} from '@/lib/accessibility-polish';

export function AccessibilityTestSuite() {
  const [report, setReport] = useState<string>('');
  const [focusOrder, setFocusOrder] = useState<string[]>([]);
  const [showFocusOrder, setShowFocusOrder] = useState(false);
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  const runFullAudit = () => {
    const fullReport = createAccessibilityReport();
    setReport(fullReport);
  };
  
  const testFocusOrder = () => {
    const order = getKeyboardNavigationOrder();
    const selectors = order.map((el, idx) => {
      const id = el.id ? `#${el.id}` : '';
      const classes = el.className ? `.${el.className.split(' ')[0]}` : '';
      return `${idx + 1}. ${el.tagName.toLowerCase()}${id}${classes}`;
    });
    setFocusOrder(selectors);
    setShowFocusOrder(true);
  };
  
  const testScreenReader = () => {
    announceToScreenReader('This is a test announcement for screen readers', 'polite');
  };
  
  const audit = auditAccessibility();
  const headings = verifyHeadingHierarchy();
  const landmarks = verifyLandmarks();
  const skipLink = verifySkipLink();
  
  const score = Math.round((audit.valid / audit.total) * 100);
  
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Accessibility className="h-8 w-8" />
          Accessibility Test Suite
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Test accessibility features and WCAG compliance
        </p>
      </div>
      
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Score</CardTitle>
          <CardDescription>
            Overall accessibility compliance score
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">
              {score}%
            </div>
            <Badge variant={score >= 90 ? 'default' : score >= 70 ? 'secondary' : 'destructive'}>
              {score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Work'}
            </Badge>
          </div>
          
          <Progress value={score} className="h-2" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold">{audit.total}</div>
              <div className="text-muted-foreground">Total Elements</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">{audit.valid}</div>
              <div className="text-muted-foreground">Valid</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-destructive">{audit.issues.length}</div>
              <div className="text-muted-foreground">Issues</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">{audit.summary.missingLabels}</div>
              <div className="text-muted-foreground">Missing Labels</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* User Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            User Preferences
          </CardTitle>
          <CardDescription>
            Detected accessibility preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant={prefersReducedMotion() ? 'default' : 'outline'}>
              Reduced Motion: {prefersReducedMotion() ? 'Yes' : 'No'}
            </Badge>
            <Badge variant={prefersHighContrast() ? 'default' : 'outline'}>
              High Contrast: {prefersHighContrast() ? 'Yes' : 'No'}
            </Badge>
            <Badge variant={prefersDarkMode() ? 'default' : 'outline'}>
              Dark Mode: {prefersDarkMode() ? 'Yes' : 'No'}
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Heading Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle>Heading Hierarchy</CardTitle>
          <CardDescription>
            Verify proper heading structure (h1-h6)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            {headings.valid ? (
              <CheckCircle2 className="h-5 w-5 text-secondary" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <span className="font-medium">
              {headings.valid ? 'Valid heading hierarchy' : 'Invalid heading hierarchy'}
            </span>
          </div>
          
          {headings.issues.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Issues:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {headings.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Landmark Regions */}
      <Card>
        <CardHeader>
          <CardTitle>Landmark Regions</CardTitle>
          <CardDescription>
            Verify semantic HTML5 landmarks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            {landmarks.valid ? (
              <CheckCircle2 className="h-5 w-5 text-secondary" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <span className="font-medium">
              {landmarks.valid ? 'All required landmarks present' : 'Missing required landmarks'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Found:</h4>
              <div className="flex flex-wrap gap-2">
                {landmarks.found.map((landmark) => (
                  <Badge key={landmark} variant="secondary">
                    {landmark}
                  </Badge>
                ))}
              </div>
            </div>
            
            {landmarks.missing.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Missing:</h4>
                <div className="flex flex-wrap gap-2">
                  {landmarks.missing.map((landmark) => (
                    <Badge key={landmark} variant="destructive">
                      {landmark}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Skip Link */}
      <Card>
        <CardHeader>
          <CardTitle>Skip Link</CardTitle>
          <CardDescription>
            Verify skip-to-content link for keyboard users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {skipLink.exists && skipLink.works ? (
              <CheckCircle2 className="h-5 w-5 text-secondary" />
            ) : skipLink.exists ? (
              <AlertCircle className="h-5 w-5 text-warning" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <span className="font-medium">
              {skipLink.exists && skipLink.works
                ? 'Skip link present and working'
                : skipLink.exists
                ? 'Skip link present but broken'
                : 'Skip link missing'}
            </span>
          </div>
          {skipLink.target && (
            <p className="text-sm text-muted-foreground mt-2">
              Target: {skipLink.target}
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Keyboard Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Navigation
          </CardTitle>
          <CardDescription>
            Test keyboard navigation order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testFocusOrder} className="w-full md:w-auto">
            Show Focus Order
          </Button>
          
          {showFocusOrder && focusOrder.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Tab Order ({focusOrder.length} elements):</h4>
              <div className="max-h-60 overflow-auto p-4 rounded-lg bg-muted">
                <ol className="space-y-1 text-sm font-mono">
                  {focusOrder.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Screen Reader Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Screen Reader Test
          </CardTitle>
          <CardDescription>
            Test screen reader announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={testScreenReader} className="w-full md:w-auto">
            Test Announcement
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            This will create a live region announcement for screen readers
          </p>
        </CardContent>
      </Card>
      
      {/* Full Report */}
      <Card>
        <CardHeader>
          <CardTitle>Full Accessibility Report</CardTitle>
          <CardDescription>
            Generate comprehensive accessibility audit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runFullAudit} className="w-full md:w-auto">
            Generate Full Report
          </Button>
          
          {report && (
            <div className="p-4 rounded-lg bg-muted font-mono text-xs whitespace-pre-wrap overflow-auto max-h-96">
              {report}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Common Issues */}
      {audit.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Common Issues
            </CardTitle>
            <CardDescription>
              Top accessibility issues found on this page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {audit.issues.slice(0, 10).map((issue, idx) => (
                <div key={idx} className="p-3 rounded-md bg-muted">
                  <div className="font-medium text-sm mb-1">{issue.element}</div>
                  {issue.problems.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-destructive mb-1">
                      {issue.problems.map((problem, pIdx) => (
                        <li key={pIdx}>{problem}</li>
                      ))}
                    </ul>
                  )}
                  {issue.warnings.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-warning">
                      {issue.warnings.map((warning, wIdx) => (
                        <li key={wIdx}>{warning}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
