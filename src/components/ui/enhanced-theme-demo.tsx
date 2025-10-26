/**
 * Enhanced Theme Demo
 * 
 * Showcases all the new interactive theme features:
 * - Animated mesh gradient backgrounds
 * - Gradient cards with animated borders
 * - Smooth counter animations
 * - Interactive hover effects
 * - Text gradients and effects
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { useThemePreference } from '@/hooks/useThemePreference';
import { Moon, Sun, TrendingUp, Users, AlertCircle, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export const EnhancedThemeDemo = () => {
  const { theme, toggleTheme } = useThemePreference();
  const [counters, setCounters] = useState([0, 0, 0, 0]);

  useEffect(() => {
    // Animate counters on mount
    const targets = [12543, 8234, 456, 92];
    const duration = 1200;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCounters(targets.map(target => Math.floor(target * easeOut)));

      if (step >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Hero Section with Mesh Gradient */}
      <div className="gradient-bg-mesh rounded-2xl p-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 text-gradient-animated">
            Enhanced Theme System
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Interactive backgrounds, animated gradients, and smooth transitions
          </p>
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:scale-105 transition-transform"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            Toggle Theme
          </button>
        </div>
      </div>

      {/* Data-Rich Counter Cards - Like Real Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card animate-counter-delay-1">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Deaths</p>
                <p className="text-3xl font-bold text-gradient mb-1">
                  {counters[0].toLocaleString()}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="destructive" className="text-xs">Critical</Badge>
                  <span className="text-muted-foreground">Since Oct 2023</span>
                </div>
              </div>
              <AlertCircle className="h-10 w-10 text-destructive opacity-30" />
            </div>
            <div className="pt-2 border-t border-border/50">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Children:</span>
                <span className="font-semibold">{Math.floor(counters[0] * 0.4).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Women:</span>
                <span className="font-semibold">{Math.floor(counters[0] * 0.3).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card animate-counter-delay-2">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Injured</p>
                <p className="text-3xl font-bold text-gradient mb-1">
                  {counters[1].toLocaleString()}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="warning" className="text-xs">Urgent</Badge>
                  <span className="text-muted-foreground">Medical Crisis</span>
                </div>
              </div>
              <Heart className="h-10 w-10 text-warning opacity-30" />
            </div>
            <div className="pt-2 border-t border-border/50">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Critical:</span>
                <span className="font-semibold text-destructive">{Math.floor(counters[1] * 0.15).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Hospitals:</span>
                <span className="font-semibold">12 / 36</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card animate-counter-delay-3">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Displaced</p>
                <p className="text-3xl font-bold text-gradient mb-1">
                  {(counters[2] * 1000).toLocaleString()}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className="text-xs">Ongoing</Badge>
                  <span className="text-muted-foreground">85% of Gaza</span>
                </div>
              </div>
              <Users className="h-10 w-10 text-secondary opacity-30" />
            </div>
            <div className="pt-2 border-t border-border/50">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">In Shelters:</span>
                <span className="font-semibold">{Math.floor(counters[2] * 600).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Homeless:</span>
                <span className="font-semibold">{Math.floor(counters[2] * 400).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card animate-counter-delay-4">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Aid Access</p>
                <p className="text-3xl font-bold text-gradient mb-1">
                  {counters[3]}%
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="destructive" className="text-xs">Blocked</Badge>
                  <span className="text-muted-foreground">Severe Crisis</span>
                </div>
              </div>
              <TrendingUp className="h-10 w-10 text-primary opacity-30" />
            </div>
            <div className="pt-2 border-t border-border/50">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Trucks/Day:</span>
                <span className="font-semibold text-destructive">~50 / 500</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Famine Risk:</span>
                <span className="font-semibold text-destructive">Extreme</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data-Rich Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-gradient card-elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Animated Gradient Border</CardTitle>
                <CardDescription>
                  Watch the border colors flow around the card
                </CardDescription>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Border Animation</span>
                <span className="text-sm text-muted-foreground">8s cycle</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary w-3/4 animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Opacity</p>
                <p className="text-lg font-semibold">40-60%</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">On Hover</p>
                <p className="text-lg font-semibold">4s cycle</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient-bg card-elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gradient Background</CardTitle>
                <CardDescription>
                  Diagonal gradient from primary to secondary
                </CardDescription>
              </div>
              <Badge variant="secondary">Subtle</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Gradient Intensity</span>
                <span className="text-sm text-muted-foreground">8-12%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary/20 to-secondary/20 w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Direction</p>
                <p className="text-lg font-semibold">135°</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Colors</p>
                <p className="text-lg font-semibold">2-tone</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Hover Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-interactive">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Interactive Card</h3>
              <p className="text-sm text-muted-foreground">
                Hover to see the lift effect and radial glow
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 mb-3">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Smooth Transitions</h3>
              <p className="text-sm text-muted-foreground">
                All animations use smooth cubic-bezier curves
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-warning/10 mb-3">
                <Heart className="h-6 w-6 text-warning" />
              </div>
              <h3 className="font-semibold mb-2">Elegant Effects</h3>
              <p className="text-sm text-muted-foreground">
                Subtle but noticeable visual feedback
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Text Effects */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Text Effects & Gradients</CardTitle>
          <CardDescription>
            Various text styling options for emphasis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-gradient mb-2">
              Static Gradient Text
            </h3>
            <p className="text-sm text-muted-foreground">
              Beautiful gradient from primary to secondary color
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gradient-animated mb-2">
              Animated Gradient Text
            </h3>
            <p className="text-sm text-muted-foreground">
              The gradient flows smoothly across the text
            </p>
          </div>

          <div>
            <a href="#" className="text-lg font-semibold highlight-hover inline-block">
              Hover Highlight Effect
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              Underline animates in on hover
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Background Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-dots">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Dot Pattern</h3>
            <p className="text-sm text-muted-foreground">
              Subtle dot pattern background
            </p>
          </CardContent>
        </Card>

        <Card className="bg-grid">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Grid Pattern</h3>
            <p className="text-sm text-muted-foreground">
              Clean grid pattern background
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-bg-radial">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Radial Gradient</h3>
            <p className="text-sm text-muted-foreground">
              Soft radial gradient effect
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Glow Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glow-primary card-elevated">
          <CardHeader>
            <CardTitle>Primary Glow Effect</CardTitle>
            <CardDescription>
              Hover to intensify the glow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="animate-pulse-glow">
              Important
            </Badge>
            <p className="text-sm text-muted-foreground mt-4">
              This card has a subtle glow that becomes more prominent on hover
            </p>
          </CardContent>
        </Card>

        <Card className="glow-secondary card-elevated">
          <CardHeader>
            <CardTitle>Secondary Glow Effect</CardTitle>
            <CardDescription>
              Different color, same smooth effect
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="animate-pulse-glow">
              Featured
            </Badge>
            <p className="text-sm text-muted-foreground mt-4">
              Glows can be applied to any element for emphasis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Glass Effect - Enhanced Demo with Strong Background */}
      <div className="relative h-80 rounded-xl overflow-hidden">
        {/* Very colorful background to show blur effect clearly */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-warning/30">
          <div className="absolute inset-0 bg-grid opacity-40" />
          {/* Large colorful circles to show blur */}
          <div className="absolute top-8 left-8 w-40 h-40 rounded-full bg-primary/60 blur-3xl animate-pulse" />
          <div className="absolute bottom-8 right-8 w-48 h-48 rounded-full bg-secondary/60 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-warning/50 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          {/* Additional color spots */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-destructive/40 blur-2xl" />
          <div className="absolute bottom-1/4 left-1/4 w-36 h-36 rounded-full bg-chart-5/40 blur-2xl" />
        </div>
        
        {/* Glass card on top - Using div instead of Card to show glass effect */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="glass-effect max-w-md w-full rounded-lg p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">Glass Morphism</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Frosted glass effect with backdrop blur
                </p>
              </div>
              <Badge variant="outline" className="bg-background/30 backdrop-blur-sm border-foreground/20">
                Active
              </Badge>
            </div>
            
            {/* Content */}
            <div className="space-y-3">
              <p className="text-sm text-foreground/90">
                Notice how the background blurs through the card, creating a frosted glass effect.
                The colorful shapes behind are visible but blurred.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 rounded-lg bg-background/20 backdrop-blur-sm border border-foreground/10">
                  <p className="text-xs text-muted-foreground">Blur</p>
                  <p className="text-lg font-semibold">40-48px</p>
                </div>
                <div className="p-3 rounded-lg bg-background/20 backdrop-blur-sm border border-foreground/10">
                  <p className="text-xs text-muted-foreground">Opacity</p>
                  <p className="text-lg font-semibold">30-45%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
