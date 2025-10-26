/**
 * App Layout Component
 * 
 * Consistent header and navigation across all pages
 */

import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  Map, 
  BarChart3, 
  Brain,
  Home
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { AdvancedFilters } from '@/components/filters/AdvancedFilters';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  showFilters?: boolean;
  showExport?: boolean;
  exportComponent?: ReactNode;
}

export const AppLayout = ({ 
  children, 
  showFilters = false,
  showExport = false,
  exportComponent 
}: AppLayoutProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: t('nav.dashboard') },
    { path: '/analytics', icon: BarChart3, label: t('nav.analytics') },
    { path: '/maps', icon: Map, label: t('nav.maps') },
    { path: '/advanced', icon: Brain, label: t('nav.ai') },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Unified Modern Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Top Row - Branding & Utilities */}
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            {/* Logo & Title */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary blur-lg opacity-50 rounded-lg" />
                <div className="relative w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">
                  {t('app.title')}
                </h1>
              </div>
            </Link>

            {/* Utilities - Right Side */}
            <div className="flex items-center gap-1">
              {showFilters && <AdvancedFilters />}
              {showExport && exportComponent}
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>

          {/* Bottom Row - Navigation Tabs with Enhanced Effects */}
          <div className="flex items-center gap-1 py-2 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-2 relative px-4 py-2 transition-all duration-300 group",
                      active && [
                        "bg-primary text-primary-foreground font-semibold shadow-md",
                        "hover:bg-primary hover:shadow-lg"
                      ],
                      !active && [
                        "hover:bg-primary/10 hover:text-primary",
                        "hover:shadow-sm hover:scale-105"
                      ]
                    )}
                  >
                    <Icon className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      !active && "group-hover:scale-110"
                    )} />
                    <span className="hidden sm:inline">{item.label}</span>
                    {!active && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-full" />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Data source: <a href="https://data.techforpalestine.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Tech for Palestine</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};