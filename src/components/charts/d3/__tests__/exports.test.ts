/**
 * Export Tests
 * 
 * Verify all exports from the D3 chart library are accessible
 */

import { describe, it, expect } from 'vitest';

describe('D3 Chart Library Exports', () => {
  it('should export ChartCard component', async () => {
    const { ChartCard } = await import('../ChartCard');
    expect(ChartCard).toBeDefined();
    expect(typeof ChartCard).toBe('function');
  });

  it('should export all type definitions', async () => {
    const types = await import('../types');
    expect(types).toBeDefined();
  });

  it('should export color utilities', async () => {
    const {
      getD3Colors,
      getD3Color,
      getD3ColorWithOpacity,
      getD3TextColor,
      getD3GridColor,
      getD3AxisColor,
      getSemanticColor,
      d3ColorScales,
      chartColorPalette,
    } = await import('../colors');

    expect(getD3Colors).toBeDefined();
    expect(getD3Color).toBeDefined();
    expect(getD3ColorWithOpacity).toBeDefined();
    expect(getD3TextColor).toBeDefined();
    expect(getD3GridColor).toBeDefined();
    expect(getD3AxisColor).toBeDefined();
    expect(getSemanticColor).toBeDefined();
    expect(d3ColorScales).toBeDefined();
    expect(chartColorPalette).toBeDefined();
  });

  it('should export from index', async () => {
    const {
      ChartCard,
      getD3Colors,
      getD3Color,
      chartColorPalette,
    } = await import('../index');

    expect(ChartCard).toBeDefined();
    expect(getD3Colors).toBeDefined();
    expect(getD3Color).toBeDefined();
    expect(chartColorPalette).toBeDefined();
  });

  it('should export example components', async () => {
    const {
      BasicUsageExample,
      ColorSystemExample,
      FullFeaturesExample,
    } = await import('../examples');

    expect(BasicUsageExample).toBeDefined();
    expect(ColorSystemExample).toBeDefined();
    expect(FullFeaturesExample).toBeDefined();
  });
});

describe('Color System Functions', () => {
  it('getD3Colors should return array of colors', async () => {
    const { getD3Colors } = await import('../colors');
    const colors = getD3Colors();
    
    expect(Array.isArray(colors)).toBe(true);
    expect(colors.length).toBe(10);
    colors.forEach(color => {
      expect(typeof color).toBe('string');
      expect(color).toContain('hsl');
    });
  });

  it('getD3Colors should return specified number of colors', async () => {
    const { getD3Colors } = await import('../colors');
    const colors = getD3Colors(5);
    
    expect(colors.length).toBe(5);
  });

  it('getD3Color should return single color', async () => {
    const { getD3Color } = await import('../colors');
    const color = getD3Color(1);
    
    expect(typeof color).toBe('string');
    expect(color).toContain('hsl');
  });

  it('getD3TextColor should return theme-aware color', async () => {
    const { getD3TextColor } = await import('../colors');
    
    const lightColor = getD3TextColor('light');
    const darkColor = getD3TextColor('dark');
    
    expect(typeof lightColor).toBe('string');
    expect(typeof darkColor).toBe('string');
    expect(lightColor).toContain('hsl');
    expect(darkColor).toContain('hsl');
  });

  it('getSemanticColor should return semantic colors', async () => {
    const { getSemanticColor } = await import('../colors');
    
    const crisisColor = getSemanticColor('crisis');
    const hopeColor = getSemanticColor('hope');
    
    expect(typeof crisisColor).toBe('string');
    expect(typeof hopeColor).toBe('string');
  });

  it('d3ColorScales should have all scales', async () => {
    const { d3ColorScales } = await import('../colors');
    
    expect(d3ColorScales.sequential).toBeDefined();
    expect(d3ColorScales.diverging).toBeDefined();
    expect(d3ColorScales.categorical).toBeDefined();
    expect(d3ColorScales.crisis).toBeDefined();
    expect(d3ColorScales.hope).toBeDefined();
  });
});
