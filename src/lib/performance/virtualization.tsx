/**
 * Virtualization Utilities
 * 
 * Provides components and hooks for virtualizing long lists using react-window.
 * Implements requirement 11.4 for list virtualization.
 */

import React, { ComponentType, CSSProperties, ReactElement } from 'react';
import { FixedSizeList, VariableSizeList, FixedSizeGrid, ListChildComponentProps } from 'react-window';

/**
 * Props for VirtualList component
 */
export interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number | ((index: number) => number);
  width?: string | number;
  overscanCount?: number;
  renderItem: (item: T, index: number, style: CSSProperties) => ReactElement;
  className?: string;
}

/**
 * Virtual list component for fixed-size items
 */
export function VirtualList<T>({
  items,
  height,
  itemHeight,
  width = '100%',
  overscanCount = 3,
  renderItem,
  className,
}: VirtualListProps<T>) {
  const Row = ({ index, style }: ListChildComponentProps) => {
    return renderItem(items[index], index, style);
  };

  // Use FixedSizeList for consistent item heights
  if (typeof itemHeight === 'number') {
    return (
      <FixedSizeList
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        width={width}
        overscanCount={overscanCount}
        className={className}
      >
        {Row}
      </FixedSizeList>
    );
  }

  // Use VariableSizeList for dynamic item heights
  return (
    <VariableSizeList
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      width={width}
      overscanCount={overscanCount}
      className={className}
    >
      {Row}
    </VariableSizeList>
  );
}

/**
 * Props for VirtualGrid component
 */
export interface VirtualGridProps<T> {
  items: T[];
  height: number;
  width: number;
  columnCount: number;
  rowHeight: number;
  columnWidth: number;
  overscanRowCount?: number;
  overscanColumnCount?: number;
  renderItem: (item: T, rowIndex: number, columnIndex: number, style: CSSProperties) => ReactElement;
  className?: string;
}

/**
 * Virtual grid component for grid layouts
 */
export function VirtualGrid<T>({
  items,
  height,
  width,
  columnCount,
  rowHeight,
  columnWidth,
  overscanRowCount = 2,
  overscanColumnCount = 2,
  renderItem,
  className,
}: VirtualGridProps<T>) {
  const rowCount = Math.ceil(items.length / columnCount);

  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columnCount + columnIndex;
    
    if (index >= items.length) {
      return null;
    }

    return renderItem(items[index], rowIndex, columnIndex, style);
  };

  return (
    <FixedSizeGrid
      height={height}
      width={width}
      columnCount={columnCount}
      columnWidth={columnWidth}
      rowCount={rowCount}
      rowHeight={rowHeight}
      overscanRowCount={overscanRowCount}
      overscanColumnCount={overscanColumnCount}
      className={className}
    >
      {Cell}
    </FixedSizeGrid>
  );
}

/**
 * Hook to calculate optimal item height for virtualization
 */
export function useVirtualItemHeight(
  containerHeight: number,
  itemCount: number,
  minItemHeight: number = 50,
  maxItemHeight: number = 200
): number {
  const calculatedHeight = containerHeight / Math.min(itemCount, 10);
  return Math.max(minItemHeight, Math.min(maxItemHeight, calculatedHeight));
}

/**
 * Hook to determine if virtualization should be enabled
 */
export function useShouldVirtualize(
  itemCount: number,
  threshold: number = 50
): boolean {
  return itemCount > threshold;
}

/**
 * Virtualized metric card grid
 * Optimized for dashboard metric cards
 */
export interface VirtualMetricGridProps<T> {
  items: T[];
  renderCard: (item: T, index: number) => ReactElement;
  cardHeight?: number;
  cardWidth?: number;
  gap?: number;
  className?: string;
}

export function VirtualMetricGrid<T>({
  items,
  renderCard,
  cardHeight = 200,
  cardWidth = 300,
  gap = 16,
  className,
}: VirtualMetricGridProps<T>) {
  const [containerWidth, setContainerWidth] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const columnCount = Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));
  const shouldVirtualize = useShouldVirtualize(items.length);

  // Don't virtualize for small lists
  if (!shouldVirtualize) {
    return (
      <div 
        ref={containerRef}
        className={className}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(${cardWidth}px, 1fr))`,
          gap: `${gap}px`,
        }}
      >
        {items.map((item, index) => (
          <div key={index}>{renderCard(item, index)}</div>
        ))}
      </div>
    );
  }

  // Virtualize for large lists
  return (
    <div ref={containerRef} className={className}>
      <VirtualGrid
        items={items}
        height={600}
        width={containerWidth}
        columnCount={columnCount}
        rowHeight={cardHeight + gap}
        columnWidth={cardWidth + gap}
        renderItem={(item, rowIndex, columnIndex, style) => (
          <div style={{ ...style, padding: gap / 2 }}>
            {renderCard(item, rowIndex * columnCount + columnIndex)}
          </div>
        )}
      />
    </div>
  );
}

/**
 * Infinite scroll list with virtualization
 */
export interface InfiniteVirtualListProps<T> {
  items: T[];
  loadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number, style: CSSProperties) => ReactElement;
  loadingComponent?: ReactElement;
  className?: string;
}

export function InfiniteVirtualList<T>({
  items,
  loadMore,
  hasMore,
  isLoading,
  height,
  itemHeight,
  renderItem,
  loadingComponent,
  className,
}: InfiniteVirtualListProps<T>) {
  const listRef = React.useRef<FixedSizeList>(null);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const handleScroll = React.useCallback(
    async ({ scrollOffset, scrollUpdateWasRequested }: any) => {
      if (scrollUpdateWasRequested || isLoadingMore || !hasMore) return;

      const scrollHeight = items.length * itemHeight;
      const scrollBottom = scrollOffset + height;

      // Load more when scrolled to 80% of content
      if (scrollBottom > scrollHeight * 0.8) {
        setIsLoadingMore(true);
        await loadMore();
        setIsLoadingMore(false);
      }
    },
    [items.length, itemHeight, height, hasMore, isLoadingMore, loadMore]
  );

  const Row = ({ index, style }: ListChildComponentProps) => {
    // Show loading indicator at the end
    if (index === items.length) {
      return (
        <div style={style}>
          {loadingComponent || <div>Loading...</div>}
        </div>
      );
    }

    return renderItem(items[index], index, style);
  };

  const itemCount = hasMore ? items.length + 1 : items.length;

  return (
    <FixedSizeList
      ref={listRef}
      height={height}
      itemCount={itemCount}
      itemSize={itemHeight}
      width="100%"
      onScroll={handleScroll}
      className={className}
    >
      {Row}
    </FixedSizeList>
  );
}

/**
 * Example usage:
 * 
 * // Simple virtual list
 * <VirtualList
 *   items={data}
 *   height={600}
 *   itemHeight={80}
 *   renderItem={(item, index, style) => (
 *     <div style={style}>
 *       <MetricCard {...item} />
 *     </div>
 *   )}
 * />
 * 
 * // Virtual grid for metric cards
 * <VirtualMetricGrid
 *   items={metrics}
 *   renderCard={(metric) => <MetricCard {...metric} />}
 *   cardHeight={200}
 *   cardWidth={300}
 * />
 * 
 * // Infinite scroll list
 * <InfiniteVirtualList
 *   items={items}
 *   loadMore={fetchMoreItems}
 *   hasMore={hasMore}
 *   isLoading={isLoading}
 *   height={600}
 *   itemHeight={80}
 *   renderItem={(item, index, style) => (
 *     <div style={style}>{item.name}</div>
 *   )}
 * />
 */
