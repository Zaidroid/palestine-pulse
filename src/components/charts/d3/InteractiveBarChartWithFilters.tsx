/**
 * Interactive Bar Chart with Category Filtering
 * 
 * Enhanced version of InteractiveBarChart with built-in filtering controls:
 * - Category selection controls
 * - Sorting options (value, alphabetical)
 * - Animated bar reordering
 * 
 * @see .kiro/specs/dashboard-d3-redesign/requirements.md (Requirements 8.4, 8.5)
 */

import { useState, useMemo } from 'react';
import { InteractiveBarChart, InteractiveBarChartProps } from './InteractiveBarChart';
import { CategoryData } from '@/types/dashboard-data.types';
import { useTranslation } from 'react-i18next';
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface InteractiveBarChartWithFiltersProps extends Omit<InteractiveBarChartProps, 'data' | 'sortBy' | 'sortOrder' | 'maxBars'> {
  /** Array of category data points */
  data: CategoryData[];
  /** Enable category filtering */
  enableCategoryFilter?: boolean;
  /** Enable sorting controls */
  enableSorting?: boolean;
  /** Default sort by */
  defaultSortBy?: 'value' | 'category' | 'none';
  /** Default sort order */
  defaultSortOrder?: 'asc' | 'desc';
  /** Maximum number of bars to display */
  maxBars?: number;
  /** Show filter summary */
  showFilterSummary?: boolean;
}

type SortBy = 'value' | 'category' | 'none';
type SortOrder = 'asc' | 'desc';

/**
 * InteractiveBarChartWithFilters Component
 * 
 * Wraps InteractiveBarChart with category filtering and sorting controls.
 * Provides a complete interactive experience with animated transitions.
 */
export const InteractiveBarChartWithFilters: React.FC<InteractiveBarChartWithFiltersProps> = ({
  data,
  enableCategoryFilter = true,
  enableSorting = true,
  defaultSortBy = 'none',
  defaultSortOrder = 'desc',
  maxBars,
  showFilterSummary = true,
  ...chartProps
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // State for filtering and sorting
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortBy>(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortOrder);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  // Get all unique categories
  const allCategories = useMemo(() => {
    return Array.from(new Set(data.map(d => d.category)));
  }, [data]);

  // Filter and process data
  const filteredData = useMemo(() => {
    if (selectedCategories.size === 0) {
      return data;
    }
    return data.filter(d => selectedCategories.has(d.category));
  }, [data, selectedCategories]);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Select all categories
  const selectAllCategories = () => {
    setSelectedCategories(new Set());
  };

  // Clear all selections
  const clearAllCategories = () => {
    setSelectedCategories(new Set(allCategories));
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Cycle through sort options
  const cycleSortBy = () => {
    if (sortBy === 'none') {
      setSortBy('value');
    } else if (sortBy === 'value') {
      setSortBy('category');
    } else {
      setSortBy('none');
    }
  };

  // Get sort icon
  const getSortIcon = () => {
    if (sortOrder === 'asc') {
      return <ArrowUp className="h-3.5 w-3.5" />;
    } else {
      return <ArrowDown className="h-3.5 w-3.5" />;
    }
  };

  // Get sort label
  const getSortLabel = () => {
    if (sortBy === 'none') {
      return t('charts.sort.none', 'Default');
    } else if (sortBy === 'value') {
      return t('charts.sort.value', 'By Value');
    } else {
      return t('charts.sort.category', 'Alphabetical');
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      {(enableCategoryFilter || enableSorting) && (
        <div className={`flex items-center gap-3 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Category Filter Toggle */}
          {enableCategoryFilter && allCategories.length > 1 && (
            <button
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium
                bg-background border border-border rounded-lg
                hover:bg-muted hover:border-primary/50 hover:text-primary
                transition-all duration-300
                ${showCategoryFilter ? 'bg-muted border-primary/50 text-primary' : ''}
              `}
            >
              <Filter className="h-3.5 w-3.5" />
              {t('charts.filter.categories', 'Filter Categories')}
              {selectedCategories.size > 0 && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                  {selectedCategories.size}
                </Badge>
              )}
            </button>
          )}

          {/* Sorting Controls */}
          {enableSorting && (
            <>
              <button
                onClick={cycleSortBy}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium
                         bg-background border border-border rounded-lg
                         hover:bg-muted hover:border-secondary/50 hover:text-secondary
                         transition-all duration-300"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                {getSortLabel()}
              </button>

              {sortBy !== 'none' && (
                <button
                  onClick={toggleSortOrder}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium
                           bg-background border border-border rounded-lg
                           hover:bg-muted hover:border-secondary/50 hover:text-secondary
                           transition-all duration-300"
                >
                  {getSortIcon()}
                  {sortOrder === 'asc' 
                    ? t('charts.sort.ascending', 'Ascending')
                    : t('charts.sort.descending', 'Descending')
                  }
                </button>
              )}
            </>
          )}

          {/* Clear Filters */}
          {selectedCategories.size > 0 && (
            <button
              onClick={selectAllCategories}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                       text-muted-foreground hover:text-foreground
                       transition-colors duration-300"
            >
              <X className="h-3.5 w-3.5" />
              {t('charts.filter.clear', 'Clear Filters')}
            </button>
          )}
        </div>
      )}

      {/* Category Filter Panel */}
      {showCategoryFilter && enableCategoryFilter && (
        <div className="p-4 bg-muted/30 border border-border rounded-lg animate-fade-in">
          <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h4 className="text-sm font-semibold text-foreground">
              {t('charts.filter.selectCategories', 'Select Categories')}
            </h4>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={selectAllCategories}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {t('charts.filter.selectAll', 'Select All')}
              </button>
              <span className="text-muted-foreground">|</span>
              <button
                onClick={clearAllCategories}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {t('charts.filter.selectNone', 'Select None')}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {allCategories.map(category => {
              const isSelected = selectedCategories.size === 0 || selectedCategories.has(category);
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300
                    ${isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                    }
                  `}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Summary */}
      {showFilterSummary && (selectedCategories.size > 0 || sortBy !== 'none') && (
        <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span>{t('charts.filter.showing', 'Showing')}:</span>
          <span className="font-medium text-foreground">
            {filteredData.length} {t('charts.filter.of', 'of')} {data.length} {t('charts.filter.items', 'items')}
          </span>
          {selectedCategories.size > 0 && (
            <>
              <span>•</span>
              <span>
                {selectedCategories.size} {t('charts.filter.categoriesSelected', 'categories selected')}
              </span>
            </>
          )}
          {sortBy !== 'none' && (
            <>
              <span>•</span>
              <span>
                {t('charts.filter.sortedBy', 'Sorted by')} {getSortLabel().toLowerCase()} ({sortOrder})
              </span>
            </>
          )}
        </div>
      )}

      {/* Chart */}
      <InteractiveBarChart
        {...chartProps}
        data={filteredData}
        sortBy={sortBy}
        sortOrder={sortOrder}
        maxBars={maxBars}
      />

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">
            {t('charts.filter.noResults', 'No data matches the selected filters')}
          </p>
          <button
            onClick={selectAllCategories}
            className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            {t('charts.filter.resetFilters', 'Reset Filters')}
          </button>
        </div>
      )}
    </div>
  );
};

// Default export for lazy loading
export default InteractiveBarChartWithFilters;
