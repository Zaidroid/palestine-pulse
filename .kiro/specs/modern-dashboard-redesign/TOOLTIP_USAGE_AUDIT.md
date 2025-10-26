# Tooltip Usage Audit Report

## Task: Find all Tooltip usages
**Date:** 2025-01-24  
**Status:** ✅ Complete

## Summary

Found **10 files** that import and use the Tooltip component from `@/components/ui/tooltip`.

## Files Using Tooltip Component

### 1. **src/components/v3/shared/DataRefreshIndicator.tsx**
- **Imports:** `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`
- **Usage Count:** 5 instances
- **Locations:**
  - Line 82-100: Button-only variant refresh button with tooltip
  - Line 127-137: Last update timestamp with tooltip
  - Line 142-152: Error indicator with retry tooltip
  - All wrapped in `<TooltipProvider>` → `<Tooltip>` → `<TooltipTrigger>` → `<TooltipContent>`

### 2. **src/components/v3/shared/DataQualityIndicator.tsx**
- **Imports:** `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`
- **Usage Count:** 2 instances
- **Locations:**
  - Line 85-95: Quality badge with tooltip showing description, source, and last updated
  - Line 110-122: Freshness indicator with tooltip showing freshness status

### 3. **src/components/v3/shared/EnhancedDataQualityBadge.tsx**
- **Imports:** `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`
- **Usage Count:** 4 instances (in sub-components)
- **Locations:**
  - Line 165-195: QualityBadge component with detailed tooltip
  - Line 235-255: FreshnessBadge component with timestamp tooltip
  - Line 295-315: WarningBadge component with verification tooltip
  - Line 365-385: UnavailableBadge component with unavailability reason tooltip

### 4. **src/components/v3/layout/V3Header.tsx**
- **Imports:** `Tooltip`, `TooltipContent`, `TooltipTrigger`
- **Usage Count:** 4 instances
- **Locations:**
  - Line 119-127: Filter button tooltip
  - Line 133-141: Export button tooltip
  - Line 147-155: Theme toggle tooltip
  - All tooltips show simple text labels for action buttons

### 5. **src/components/v3/shared/HeatmapCalendar.tsx**
- **Imports:** `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`
- **Usage Count:** 1 instance (in loop)
- **Locations:**
  - Line 107-125: Calendar day cells with tooltip showing date, value, and intensity
  - Wrapped in `<TooltipProvider>` at line 100

### 6. **src/components/v3/shared/DataEducationTooltip.tsx**
- **Imports:** `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`
- **Usage Count:** Multiple (custom wrapper component)
- **Locations:**
  - This file creates a custom `DataEducationTooltip` component that wraps the base Tooltip
  - Used throughout for educational content about data quality, sources, methodology, etc.
  - Not a direct usage but a wrapper that other components use

### 7. **src/components/v3/westbank/InteractiveCheckpointMap.tsx**
- **Imports:** `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`
- **Usage Count:** Multiple instances (in loops)
- **Locations:**
  - Line 175-210: District view cards with detailed checkpoint statistics
  - Line 295-325: Type view bars with checkpoint type information
  - Line 520-550: Heatmap view cells with geographic data
  - All wrapped in `<TooltipProvider>` with detailed content

### 8. **src/components/ui/sidebar.tsx**
- **Imports:** `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`
- **Usage Count:** 2 instances
- **Locations:**
  - Line 13: Import statement
  - Line 77: TooltipProvider wraps entire sidebar
  - Line 445-450: SidebarMenuButton component conditionally shows tooltip for collapsed state

### 9. **src/components/ui/data-quality-warning.tsx**
- **Imports:** `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`
- **Usage Count:** 3 instances (variants)
- **Locations:**
  - Line 115-125: Badge variant with quality information
  - Line 145-155: Inline variant with quality details
  - Line 175-185: Icon variant (default) with quality tooltip
  - All show detailed quality information, issues, last updated, and source

### 10. **src/components/ui/metric-tooltip.tsx**
- **Imports:** `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`
- **Usage Count:** 1 instance (wrapper component)
- **Locations:**
  - Line 13-17: Import statement
  - Line 35-75: MetricTooltip component that wraps Tooltip for metric definitions
  - Shows title, definition, formula, example, and source

## Tooltip Usage Patterns

### Pattern 1: Simple Text Tooltip
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Action</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Simple text</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```
**Used in:** V3Header (action buttons)

### Pattern 2: Rich Content Tooltip
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Component />
    </TooltipTrigger>
    <TooltipContent>
      <div className="space-y-2">
        <p className="font-semibold">Title</p>
        <p className="text-xs">Description</p>
        {/* More content */}
      </div>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```
**Used in:** DataQualityIndicator, EnhancedDataQualityBadge, InteractiveCheckpointMap

### Pattern 3: Wrapper Component
```tsx
export const CustomTooltip = ({ children, content }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
```
**Used in:** MetricTooltip, DataEducationTooltip

## Replacement Strategy for AnimatedTooltip

### Phase 1: Direct Replacements (Simple Tooltips)
These can be directly replaced with AnimatedTooltip:
- ✅ V3Header action buttons (4 instances)
- ✅ DataRefreshIndicator simple tooltips (3 instances)

### Phase 2: Rich Content Replacements
These need careful migration to preserve content structure:
- ⚠️ DataQualityIndicator (2 instances)
- ⚠️ EnhancedDataQualityBadge (4 instances)
- ⚠️ InteractiveCheckpointMap (multiple instances in loops)
- ⚠️ HeatmapCalendar (1 instance in loop)
- ⚠️ data-quality-warning (3 variants)

### Phase 3: Wrapper Components
These need to be updated to use AnimatedTooltip internally:
- 🔄 MetricTooltip component
- 🔄 DataEducationTooltip component

### Phase 4: Special Cases
- 🔄 Sidebar component (conditional tooltip based on collapsed state)

## Total Count

- **Files with Tooltip imports:** 10
- **Direct Tooltip usages:** ~30+ instances (many in loops)
- **Wrapper components:** 2 (MetricTooltip, DataEducationTooltip)
- **Unique patterns:** 3 (simple, rich content, wrapper)

## Next Steps

1. ✅ **Audit Complete** - All Tooltip usages have been identified
2. ⏭️ **Next Task:** Replace Tooltip with AnimatedTooltip (Task 6.1)
3. 📋 **Priority Order:**
   - Start with simple tooltips (V3Header, DataRefreshIndicator)
   - Update wrapper components (MetricTooltip, DataEducationTooltip)
   - Migrate rich content tooltips
   - Handle special cases (Sidebar)

## Notes

- All tooltips use the same base component from `@/components/ui/tooltip`
- Most tooltips are already wrapped in `TooltipProvider`
- AnimatedTooltip should maintain the same API for easy replacement
- Need to ensure AnimatedTooltip supports rich content (JSX children)
- Consider animation preferences (prefers-reduced-motion)

---

**Audit completed by:** Kiro AI  
**Task Reference:** Phase 6: Micro-interactions, Task 6.1
