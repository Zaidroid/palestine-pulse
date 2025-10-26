/**
 * Enhanced Filter Panel Demo
 * 
 * Demonstrates the enhanced filter panel with all features:
 * - Slide-in animation from right edge
 * - Backdrop fade animation
 * - Active filter count badge
 * - Date range picker with presets
 * - Debounced filter updates
 * - Animated filter chips
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedFilterButton } from './EnhancedFilterButton';
import { useGlobalStore } from '@/store/globalStore';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export const EnhancedFilterDemo = () => {
  const { filters } = useGlobalStore();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Enhanced Filter Panel Demo</h1>
        <p className="text-muted-foreground">
          Advanced filtering system with animations and debouncing
        </p>
      </div>

      {/* Demo Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Controls</CardTitle>
          <CardDescription>
            Click the button below to open the enhanced filter panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedFilterButton />
        </CardContent>
      </Card>

      {/* Current Filters Display */}
      <Card>
        <CardHeader>
          <CardTitle>Current Filters</CardTitle>
          <CardDescription>
            Active filters are displayed below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Range */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium mb-1">Date Range</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(filters.dateRange.start), 'MMM dd, yyyy')} -{' '}
                {format(new Date(filters.dateRange.end), 'MMM dd, yyyy')}
              </div>
            </div>
          </div>

          {/* Regions */}
          {filters.regions && filters.regions.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <MapPin className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium mb-2">Regions</div>
                <div className="flex flex-wrap gap-2">
                  {filters.regions.map((region) => (
                    <Badge key={region} variant="secondary">
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Demographics */}
          {filters.demographics && filters.demographics.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Users className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium mb-2">Demographics</div>
                <div className="flex flex-wrap gap-2">
                  {filters.demographics.map((demo) => (
                    <Badge key={demo} variant="secondary">
                      {demo}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Event Types */}
          {filters.eventTypes && filters.eventTypes.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium mb-2">Event Types</div>
                <div className="flex flex-wrap gap-2">
                  {filters.eventTypes.map((type) => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Casualty Thresholds */}
          {(filters.minCasualties !== undefined || filters.maxCasualties !== undefined) && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium mb-1">Casualty Thresholds</div>
                <div className="text-sm text-muted-foreground">
                  {filters.minCasualties !== undefined && `Min: ${filters.minCasualties}`}
                  {filters.minCasualties !== undefined && filters.maxCasualties !== undefined && ' | '}
                  {filters.maxCasualties !== undefined && `Max: ${filters.maxCasualties}`}
                </div>
              </div>
            </div>
          )}

          {/* No Filters */}
          {!filters.regions?.length &&
            !filters.demographics?.length &&
            !filters.eventTypes?.length &&
            filters.minCasualties === undefined &&
            filters.maxCasualties === undefined && (
              <div className="text-center py-8 text-muted-foreground">
                No additional filters applied. Click the filter button to add filters.
              </div>
            )}
        </CardContent>
      </Card>

      {/* Features List */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            Enhanced filter panel capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Slide-in animation from right edge (300ms)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Backdrop fade animation with blur effect</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Active filter count badge with spring animation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Date range picker with calendar and presets</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Debounced filter updates (500ms delay)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Animated filter chips with fade in/out</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Loading indicator during filter application</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Clear all filters with animation</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
