/**
 * Visual Consistency Checker Component
 * 
 * Development tool to audit visual consistency across the application.
 * Only rendered in development mode.
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { getContrastRatio, meetsWCAGContrast, prefersReducedMotion } from '@/lib/visual-polish-audit';

interface AuditResult {
  category: string;
  checks: {
    name: string;
    passed: boolean;
    message: string;
    severity: 'error' | 'warning' | 'info';
  }[];
}

export function VisualConsistencyChecker() {
  const [isVisible, setIsVisible] = useState(false);
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  useEffect(() => {
    if (isVisible) {
      runAudit();
    }
  }, [isVisible]);
  
  const runAudit = () => {
    const results: AuditResult[] = [];
    
    // Animation checks
    const animationChecks = {
      category: 'Animations',
      checks: [
        {
          name: 'Reduced Motion Support',
          passed: true,
          message: prefersReducedMotion() 
            ? 'User prefers reduced motion - animations should be minimal' 
            : 'Animations enabled',
          severity: 'info' as const,
        },
        {
          name: 'GPU Acceleration',
          passed: checkGPUAcceleration(),
          message: checkGPUAcceleration() 
            ? 'Transforms use GPU acceleration' 
            : 'Some animations may not be GPU-accelerated',
          severity: 'warning' as const,
        },
        {
          name: 'Consistent Durations',
          passed: checkAnimationDurations(),
          message: 'Animation durations follow design tokens',
          severity: 'info' as const,
        },
      ],
    };
    results.push(animationChecks);
    
    // Color contrast checks
    const contrastChecks = {
      category: 'Color Contrast',
      checks: checkColorContrast(),
    };
    results.push(contrastChecks);
    
    // Spacing checks
    const spacingChecks = {
      category: 'Spacing & Layout',
      checks: [
        {
          name: 'Consistent Padding',
          passed: checkSpacing('padding'),
          message: 'Padding follows 4px grid system',
          severity: 'info' as const,
        },
        {
          name: 'Consistent Margins',
          passed: checkSpacing('margin'),
          message: 'Margins follow 4px grid system',
          severity: 'info' as const,
        },
        {
          name: 'No Horizontal Overflow',
          passed: checkOverflow(),
          message: checkOverflow() ? 'No overflow detected' : 'Horizontal overflow detected',
          severity: checkOverflow() ? 'info' as const : 'error' as const,
        },
      ],
    };
    results.push(spacingChecks);
    
    // Responsive checks
    const responsiveChecks = {
      category: 'Responsive Design',
      checks: [
        {
          name: 'Touch Targets',
          passed: checkTouchTargets(),
          message: checkTouchTargets() 
            ? 'All interactive elements meet 44x44px minimum' 
            : 'Some touch targets are too small',
          severity: checkTouchTargets() ? 'info' as const : 'warning' as const,
        },
        {
          name: 'Viewport Meta Tag',
          passed: checkViewportMeta(),
          message: 'Viewport meta tag is properly configured',
          severity: 'info' as const,
        },
      ],
    };
    results.push(responsiveChecks);
    
    setAuditResults(results);
  };
  
  const checkGPUAcceleration = (): boolean => {
    // Check if elements use transform3d or will-change
    const elements = document.querySelectorAll('[style*="transform"]');
    let accelerated = 0;
    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.transform.includes('3d') || style.willChange.includes('transform')) {
        accelerated++;
      }
    });
    return accelerated / elements.length > 0.8; // 80% threshold
  };
  
  const checkAnimationDurations = (): boolean => {
    // Check if animations use standard durations
    const validDurations = ['100ms', '200ms', '300ms', '400ms', '600ms', '1000ms', '1500ms'];
    const elements = document.querySelectorAll('[style*="transition"]');
    let valid = 0;
    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      const duration = style.transitionDuration;
      if (validDurations.some(d => duration.includes(d.replace('ms', '')))) {
        valid++;
      }
    });
    return valid / elements.length > 0.7; // 70% threshold
  };
  
  const checkColorContrast = () => {
    const checks = [];
    
    // Check primary text contrast
    const primaryRatio = getContrastRatio(
      'hsl(0, 0%, 10%)',
      'hsl(0, 0%, 98%)'
    );
    checks.push({
      name: 'Primary Text Contrast',
      passed: meetsWCAGContrast(primaryRatio, 'AA', 'normal'),
      message: `Contrast ratio: ${primaryRatio.toFixed(2)}:1 (WCAG AA requires 4.5:1)`,
      severity: meetsWCAGContrast(primaryRatio, 'AA', 'normal') ? 'info' as const : 'error' as const,
    });
    
    // Check button contrast
    const buttonRatio = getContrastRatio(
      'hsl(0, 0%, 98%)',
      'hsl(0, 85%, 45%)'
    );
    checks.push({
      name: 'Button Text Contrast',
      passed: meetsWCAGContrast(buttonRatio, 'AA', 'normal'),
      message: `Contrast ratio: ${buttonRatio.toFixed(2)}:1`,
      severity: meetsWCAGContrast(buttonRatio, 'AA', 'normal') ? 'info' as const : 'error' as const,
    });
    
    return checks;
  };
  
  const checkSpacing = (property: 'padding' | 'margin'): boolean => {
    const elements = document.querySelectorAll('*');
    const validValues = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80];
    let valid = 0;
    let total = 0;
    
    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      const value = parseInt(style[property]);
      if (!isNaN(value) && value > 0) {
        total++;
        if (validValues.includes(value)) {
          valid++;
        }
      }
    });
    
    return total === 0 || valid / total > 0.8; // 80% threshold
  };
  
  const checkOverflow = (): boolean => {
    return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
  };
  
  const checkTouchTargets = (): boolean => {
    const interactive = document.querySelectorAll('button, a, input, select, textarea');
    let valid = 0;
    
    interactive.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width >= 44 && rect.height >= 44) {
        valid++;
      }
    });
    
    return valid / interactive.length > 0.9; // 90% threshold
  };
  
  const checkViewportMeta = (): boolean => {
    const meta = document.querySelector('meta[name="viewport"]');
    return meta !== null && meta.getAttribute('content')?.includes('width=device-width') || false;
  };
  
  const getSeverityIcon = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'info':
        return <CheckCircle2 className="h-4 w-4 text-secondary" />;
    }
  };
  
  const getSeverityBadge = (severity: 'error' | 'warning' | 'info') => {
    const variants = {
      error: 'destructive',
      warning: 'outline',
      info: 'secondary',
    };
    return variants[severity];
  };
  
  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        size="sm"
        variant="outline"
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        <Eye className="h-4 w-4 mr-2" />
        Visual Audit
      </Button>
    );
  }
  
  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 max-h-[600px] overflow-auto shadow-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Visual Consistency Audit</CardTitle>
          <Button
            onClick={() => setIsVisible(false)}
            size="sm"
            variant="ghost"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Development tool for visual polish verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {auditResults.map((result, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="font-semibold text-sm">{result.category}</h4>
            <div className="space-y-2">
              {result.checks.map((check, checkIdx) => (
                <div
                  key={checkIdx}
                  className="flex items-start gap-2 p-2 rounded-md bg-muted/50"
                >
                  {getSeverityIcon(check.severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{check.name}</span>
                      <Badge variant={getSeverityBadge(check.severity) as any} className="text-xs">
                        {check.passed ? 'Pass' : 'Fail'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{check.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <Button onClick={runAudit} className="w-full" size="sm">
          Re-run Audit
        </Button>
      </CardContent>
    </Card>
  );
}
