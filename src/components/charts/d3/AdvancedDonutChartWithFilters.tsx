/**
 * Advanced Donut Chart with Filters Component
 * 
 * Wraps AdvancedDonutChart with category filtering and sorting controls.
 */

import { useState, useMemo } from 'react';
import { AdvancedDonutChart, AdvancedDonutChartProps } from './AdvancedDonutChart';
import { CategoryData } from '@/types/dashboard-data.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Share2, Filter, SortAsc, SortDesc } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Props for AdvancedDonutChartWithFilters
 */
export interface AdvancedDonutChartWithFiltersProps extends Omit<AdvancedDonutChartProps, 'data'> {
  /** Array of category data points */
  data: CategoryData[];
  /** Chart title */
  title: string;
  /** Chart description */
  description?: string;
  /** Chart icon */
  icon?: React.ReactNode;
  /** Data source badge text */
  dataSource?: string;
  /** Enable export functionality */
  enableExport?: boolean;
  /** Enable share functionality */
  enableShare?: boolean;
  /** Enable category filtering */
  enableFiltering?: boolean;
  /** Enable sorting */
  enableSorting?: boolean;
  /** Maximum number of categories to display */
  maxCategories?: number;
  /** Callback for export */
  onExport?: () => void;
  /** Callback for share */
  onShare?: () => void;
}

/**
 * Sort options
 */
type SortOption = 'value-desc' | 'value-asc' | 'category-asc' | 'category-desc' | 'none';

/**
 * AdvancedDonutChartWithFilters Component
 * 
 * A complete chart card with filtering, sorting, and export controls.
 */
export const AdvancedDonutChartWithFilters: React.FC<AdvancedDonutChartWithFiltersProps> = ({
  data,
  title,
  description,
  icon,
  dataSource,
  enableExport = true,
  enableShare = true,
  enableFiltering = true,
  enableSorting = true,
  maxCategories,
  onExport,
  onShare,
  ...chartProps
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [sortOption, setSortOption] = useState<SortOption>('value-desc');
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Get all unique categories
  const allCategories = useMemo(() => {
    return Array.from(new Set(data.map(d => d.category)));
  }, [data]);

  // Process and filter data
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Apply category filter
    if (enableFiltering && selectedCategories.size > 0) {
      filtered = filtered.filter(d => selectedCategories.has(d.category));
    }

    // Apply sorting
    if (enableSorting) {
      switch (sortOption) {
        case 'value-desc':
          filtered.sort((a, b) => b.value - a.value);
          break;
        case 'value-asc':
          filtered.sort((a, b) => a.value - b.value);
          break;
        case 'category-asc':
          filtered.sort((a, b) => a.category.localeCompare(b.category));
          break;
        case 'category-desc':
          filtered.sort((a, b) => b.category.localeCompare(a.category));
          break;
        default:
          break;
      }
    }

    // Apply max categories limit
    if (maxCategories && !showAllCategories && filtered.length > maxCategories) {
      const limited = filtered.slice(0, maxCategories);
      const othersValue = filtered.slice(maxCategories).reduce((sum, d) => sum + d.value, 0);
      
      if (othersValue > 0) {
        limited.push({
          category: t('charts.others', 'Others'),
          value: othersValue,
          color: '#94a3b8',
        });
      }
      
      return limited;
    }

    return filtered;
  }, [data, selectedCategories, sortOption, maxCategories, showAllCategories, enableFiltering, enableSorting, t]);

  // Toggle category filter
  const toggleCategory = (category: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories(new Set());
    setSortOption('value-desc');
    setShowAllCategories(false);
  };

  // Handle export
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      console.log('Export chart as PNG');
      // Default export implementation would go here
    }
  };

  // Handle share
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      console.log('Share chart');
      // Default share implementation would go here
    }
  };

  const hasActiveFilters = selectedCategories.size > 0 || sortOption !== 'value-desc';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1.5 flex-1">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {icon}
              <CardTitle>{title}</CardTitle>
              {dataSource && (
                <Badge variant="outline" className="text-xs">
                  {dataSource}
                </Badge>
              )}
            </div>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Sorting dropdown */}
            {enableSorting && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {sortOption === 'value-desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                  <DropdownMenuLabel>{t('charts.sortBy', 'Sort By')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortOption('value-desc')}>
                    {t('charts.valueHighToLow', 'Value: High to Low')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('value-asc')}>
                    {t('charts.valueLowToHigh', 'Value: Low to High')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('category-asc')}>
                    {t('charts.categoryAZ', 'Category: A-Z')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('category-desc')}>
                    {t('charts.categoryZA', 'Category: Z-A')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Category filter dropdown */}
            {enableFiltering && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                    {selectedCategories.size > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {selectedCategories.size}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-56">
                  <DropdownMenuLabel>{t('charts.filterCategories', 'Filter Categories')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allCategories.map(category => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className="cursor-pointer"
                    >
                      <div className={`flex items-center justify-between w-full ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span>{category}</span>
                        {selectedCategories.has(category) && (
                          <span className="text-primary">✓</span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {selectedCategories.size > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={clearFilters} className="text-destructive">
                        {t('charts.clearFilters', 'Clear Filters')}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {enableExport && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
            )}
            
            {enableShare && (
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Active filters indicator */}
        {hasActiveFilters && (
          <div className={`flex items-center gap-2 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-xs text-muted-foreground">
              {t('charts.activeFilters', 'Active filters')}:
            </span>
            {selectedCategories.size > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedCategories.size} {t('charts.categories', 'categories')}
              </Badge>
            )}
            {sortOption !== 'value-desc' && (
              <Badge variant="secondary" className="text-xs">
                {t('charts.sorted', 'Sorted')}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={clearFilters}
            >
              {t('charts.clearAll', 'Clear all')}
            </Button>
          </div>
        )}

        {/* Show more/less toggle */}
        {maxCategories && data.length > maxCategories && (
          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllCategories(!showAllCategories)}
            >
              {showAllCategories 
                ? t('charts.showLess', 'Show less') 
                : t('charts.showAll', `Show all (${data.length})`)}
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <AdvancedDonutChart
          data={processedData}
          {...chartProps}
        />
      </CardContent>
    </Card>
  );
};

export default AdvancedDonutChartWithFilters;
