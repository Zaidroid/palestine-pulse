/**
 * Theme System Demo
 * 
 * Demonstrates the enhanced theme system with:
 * - Smooth transitions between themes
 * - Dark mode optimized colors
 * - Theme-aware shadows
 * - Badge contrast validation
 * - Theme persistence
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { useThemePreference } from '@/hooks/useThemePreference';
import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { badgeContrastValidation, getContrastValidationSummary } from '@/lib/contrast-checker';
import { chartColorPalette, getAllChartColors } from '@/lib/chart-colors';

export const ThemeSystemDemo = () => {
  const { theme, themeMode, setThemeMode, toggleTheme, systemTheme } = useThemePreference();
  const contrastSummary = getContrastValidationSummary();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Enhanced Theme System</h1>
        <p className="text-muted-foreground">
          Demonstrating smooth transitions, optimized colors, and accessibility features
        </p>
      </div>

      {/* Theme Controls */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Theme Controls</CardTitle>
          <CardDescription>
            Current theme: <strong>{theme}</strong> | Mode: <strong>{themeMode}</strong>
            {systemTheme && ` | System: ${systemTheme}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={themeMode === 'light' ? 'default' : 'outline'}
              onClick={() => setThemeMode('light')}
              className="transition-all duration-400"
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button
              variant={themeMode === 'dark' ? 'default' : 'outline'}
              onClick={() => setThemeMode('dark')}
              className="transition-all duration-400"
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={themeMode === 'system' ? 'default' : 'outline'}
              onClick={() => setThemeMode('system')}
              className="transition-all duration-400"
            >
              <Monitor className="mr-2 h-4 w-4" />
              System
            </Button>
          </div>
          <Button onClick={toggleTheme} variant="secondary" className="w-full">
            Toggle Theme (Quick Switch)
          </Button>
        </CardContent>
      </Card>

      {/* Badge Variants */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Badge Contrast Validation</CardTitle>
          <CardDescription>
            All badges meet WCAG AA standards (4.5:1 minimum contrast ratio)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
            <Badge variant="success">Success Badge</Badge>
            <Badge variant="warning">Warning Badge</Badge>
            <Badge variant="destructive">Destructive Badge</Badge>
            <Badge variant="info">Info Badge</Badge>
            <Badge variant="outline">Outline Badge</Badge>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Contrast Test Results</h4>
            <p className="text-sm text-muted-foreground mb-2">
              {contrastSummary.passing}/{contrastSummary.total} tests passing
            </p>
            <div className="space-y-2">
              {Object.entries(badgeContrastValidation).map(([key, result]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{key}</span>
                  <div className="flex gap-4">
                    <span className={result.lightMode.meetsAA ? 'text-green-600' : 'text-red-600'}>
                      Light: {result.lightMode.ratio.toFixed(1)}:1
                      {result.lightMode.meetsAA && <Check className="inline ml-1 h-3 w-3" />}
                    </span>
                    <span className={result.darkMode.meetsAA ? 'text-green-600' : 'text-red-600'}>
                      Dark: {result.darkMode.ratio.toFixed(1)}:1
                      {result.darkMode.meetsAA && <Check className="inline ml-1 h-3 w-3" />}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Colors */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Chart Color Palette</CardTitle>
          <CardDescription>
            Optimized for both light and dark modes with sufficient contrast
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-5 gap-4">
            {getAllChartColors().map((color, index) => (
              <div key={index} className="space-y-2">
                <div
                  className="h-16 rounded-lg border transition-all duration-400"
                  style={{ backgroundColor: color }}
                />
                <p className="text-xs text-center text-muted-foreground">
                  Chart {index + 1}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Semantic Colors</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(chartColorPalette).map(([name, color]) => (
                <div key={name} className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded border transition-all duration-400"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm capitalize">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shadow System */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Theme-Aware Shadow System</CardTitle>
          <CardDescription>
            Shadows in light mode, subtle borders and glows in dark mode
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['sm', 'md', 'lg', 'xl', '2xl', 'glow-primary'].map((size) => (
              <div
                key={size}
                className={`p-4 rounded-lg bg-card border transition-all duration-400 shadow-theme-${size}`}
              >
                <p className="text-sm font-medium">shadow-{size}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {theme === 'dark' ? 'Border + Glow' : 'Shadow'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transition Demo */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Smooth Transitions</CardTitle>
          <CardDescription>
            All theme-dependent properties transition smoothly (400ms)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary text-primary-foreground rounded-lg transition-all duration-400">
              Primary colored element
            </div>
            <div className="p-4 bg-secondary text-secondary-foreground rounded-lg transition-all duration-400">
              Secondary colored element
            </div>
            <div className="p-4 bg-muted text-muted-foreground rounded-lg transition-all duration-400">
              Muted colored element
            </div>
            <div className="p-4 border-2 border-border rounded-lg transition-all duration-400">
              Border colored element
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Persistence Info */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Theme Persistence</CardTitle>
          <CardDescription>
            Your theme preference is saved to localStorage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>✅ Theme preference persisted across sessions</p>
            <p>✅ System preference respected on first visit</p>
            <p>✅ Smooth transitions on theme change</p>
            <p>✅ No flash of unstyled content</p>
            <p className="text-muted-foreground mt-4">
              Storage key: <code className="bg-muted px-1 py-0.5 rounded">theme</code>
            </p>
            <p className="text-muted-foreground">
              Current value: <code className="bg-muted px-1 py-0.5 rounded">{themeMode}</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
