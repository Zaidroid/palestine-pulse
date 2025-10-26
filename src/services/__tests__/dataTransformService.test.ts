/**
 * DataTransformService Tests
 * 
 * Tests for core data transformation methods used in D3 chart visualizations
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DataTransformService } from '../dataTransformService';

describe('DataTransformService', () => {
  let service: DataTransformService;

  beforeEach(() => {
    service = new DataTransformService();
  });

  describe('aggregateByTimeRange', () => {
    const mockTimeSeriesData = [
      { date: '2024-01-01', value: 100 },
      { date: '2024-01-02', value: 150 },
      { date: '2024-01-03', value: 200 },
      { date: '2024-01-15', value: 120 },
      { date: '2024-02-01', value: 180 },
      { date: '2024-03-01', value: 160 },
      { date: '2024-06-01', value: 140 },
    ];

    it('should return empty array for empty data', () => {
      const result = service.aggregateByTimeRange([], '7d', 'date');
      expect(result).toEqual([]);
    });

    it('should filter data by 7 days', () => {
      const result = service.aggregateByTimeRange(mockTimeSeriesData, '7d', 'date');
      expect(Array.isArray(result)).toBe(true);
      // Result should only include recent data
      result.forEach(item => {
        expect(item).toHaveProperty('date');
        expect(item).toHaveProperty('value');
      });
    });

    it('should return all data for "all" range', () => {
      const result = service.aggregateByTimeRange(mockTimeSeriesData, 'all', 'date');
      expect(result.length).toBe(mockTimeSeriesData.length);
    });

    it('should handle custom date field names', () => {
      const customData = [
        { timestamp: '2024-01-01', count: 50 },
        { timestamp: '2024-01-02', count: 75 },
      ];
      const result = service.aggregateByTimeRange(customData, 'all', 'timestamp');
      expect(result.length).toBe(2);
    });

    it('should aggregate by monthly period', () => {
      const result = service.aggregateByTimeRange(
        mockTimeSeriesData,
        'all',
        'date',
        'monthly'
      );
      expect(Array.isArray(result)).toBe(true);
      // Should have fewer items than original due to aggregation
      expect(result.length).toBeLessThanOrEqual(mockTimeSeriesData.length);
    });

    it('should handle data with category field', () => {
      const dataWithCategory = [
        { date: '2024-01-01', value: 100, category: 'A' },
        { date: '2024-01-02', value: 150, category: 'B' },
      ];
      const result = service.aggregateByTimeRange(dataWithCategory, 'all', 'date');
      expect(result[0]).toHaveProperty('category');
    });
  });

  describe('groupByCategory', () => {
    const mockCategoryData = [
      { type: 'hospital', count: 50 },
      { type: 'clinic', count: 30 },
      { type: 'hospital', count: 20 },
      { type: 'ambulance', count: 15 },
      { type: 'clinic', count: 25 },
    ];

    it('should return empty array for empty data', () => {
      const result = service.groupByCategory([], 'type', 'count');
      expect(result).toEqual([]);
    });

    it('should group data by category', () => {
      const result = service.groupByCategory(mockCategoryData, 'type', 'count');
      
      expect(result.length).toBe(3); // hospital, clinic, ambulance
      
      const hospital = result.find(item => item.category === 'hospital');
      expect(hospital?.value).toBe(70); // 50 + 20
      
      const clinic = result.find(item => item.category === 'clinic');
      expect(clinic?.value).toBe(55); // 30 + 25
    });

    it('should calculate percentages correctly', () => {
      const result = service.groupByCategory(mockCategoryData, 'type', 'count');
      
      const total = result.reduce((sum, item) => sum + item.value, 0);
      
      result.forEach(item => {
        expect(item).toHaveProperty('percentage');
        expect(item.percentage).toBeCloseTo((item.value / total) * 100, 1);
      });
    });

    it('should sort by value descending', () => {
      const result = service.groupByCategory(mockCategoryData, 'type', 'count', {
        sortBy: 'value',
        sortOrder: 'desc',
      });
      
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].value).toBeGreaterThanOrEqual(result[i + 1].value);
      }
    });

    it('should sort by category ascending', () => {
      const result = service.groupByCategory(mockCategoryData, 'type', 'count', {
        sortBy: 'category',
        sortOrder: 'asc',
      });
      
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].category.localeCompare(result[i + 1].category)).toBeLessThanOrEqual(0);
      }
    });

    it('should limit results', () => {
      const result = service.groupByCategory(mockCategoryData, 'type', 'count', {
        limit: 2,
      });
      
      expect(result.length).toBe(2);
    });

    it('should handle missing values', () => {
      const dataWithMissing = [
        { type: 'hospital', count: 50 },
        { type: null, count: 30 },
        { count: 20 },
      ];
      const result = service.groupByCategory(dataWithMissing, 'type', 'count');
      
      expect(result.length).toBeGreaterThan(0);
      const unknown = result.find(item => item.category === 'Unknown');
      expect(unknown).toBeDefined();
    });
  });

  describe('transformToPyramid', () => {
    const mockDemographicData = [
      { age: 5, gender: 'male' },
      { age: 8, gender: 'female' },
      { age: 12, gender: 'male' },
      { age: 25, gender: 'female' },
      { age: 30, gender: 'male' },
      { age: 28, gender: 'female' },
      { age: 45, gender: 'male' },
      { age: 50, gender: 'female' },
    ];

    it('should return empty array for empty data', () => {
      const result = service.transformToPyramid([], 'age', 'gender');
      expect(result).toEqual([]);
    });

    it('should create age groups with male/female counts', () => {
      const result = service.transformToPyramid(mockDemographicData, 'age', 'gender');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      result.forEach(item => {
        expect(item).toHaveProperty('ageGroup');
        expect(item).toHaveProperty('male');
        expect(item).toHaveProperty('female');
        expect(item).toHaveProperty('total');
        expect(item.total).toBe(item.male + item.female);
      });
    });

    it('should use custom age group size', () => {
      const result = service.transformToPyramid(mockDemographicData, 'age', 'gender', {
        ageGroupSize: 10,
      });
      
      expect(result.length).toBeGreaterThan(0);
      result.forEach(item => {
        // Age groups should be in format "0-9", "10-19", etc.
        expect(item.ageGroup).toMatch(/^\d+-\d+$/);
      });
    });

    it('should handle predefined age categories', () => {
      const dataWithCategories = [
        { ageCategory: 'child', gender: 'male' },
        { ageCategory: 'adult', gender: 'female' },
        { ageCategory: 'child', gender: 'female' },
        { ageCategory: 'senior', gender: 'male' },
      ];
      
      const result = service.transformToPyramid(
        dataWithCategories,
        'ageCategory',
        'gender',
        {
          ageCategories: ['child', 'adult', 'senior'],
        }
      );
      
      expect(result.length).toBe(3);
      expect(result.map(r => r.ageGroup)).toContain('child');
      expect(result.map(r => r.ageGroup)).toContain('adult');
      expect(result.map(r => r.ageGroup)).toContain('senior');
    });

    it('should handle various gender formats', () => {
      const dataWithVariousGenders = [
        { age: 25, gender: 'male' },
        { age: 26, gender: 'M' },
        { age: 27, gender: 'female' },
        { age: 28, gender: 'F' },
      ];
      
      const result = service.transformToPyramid(dataWithVariousGenders, 'age', 'gender');
      
      const group = result.find(r => r.ageGroup === '25-29');
      expect(group).toBeDefined();
      expect(group!.male).toBe(2);
      expect(group!.female).toBe(2);
    });

    it('should filter out empty age groups', () => {
      const result = service.transformToPyramid(mockDemographicData, 'age', 'gender');
      
      result.forEach(item => {
        expect(item.total).toBeGreaterThan(0);
      });
    });
  });

  describe('transformToFlow', () => {
    const mockFlowData = [
      { from: 'Gaza City', to: 'Rafah', people: 1000 },
      { from: 'Gaza City', to: 'Khan Younis', people: 500 },
      { from: 'Gaza City', to: 'Rafah', people: 300 },
      { from: 'Khan Younis', to: 'Rafah', people: 200 },
    ];

    it('should return empty array for empty data', () => {
      const result = service.transformToFlow([], 'from', 'to');
      expect(result).toEqual([]);
    });

    it('should create flow data with source, target, and value', () => {
      const result = service.transformToFlow(mockFlowData, 'from', 'to', 'people');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      result.forEach(item => {
        expect(item).toHaveProperty('source');
        expect(item).toHaveProperty('target');
        expect(item).toHaveProperty('value');
        expect(typeof item.value).toBe('number');
      });
    });

    it('should aggregate duplicate flows', () => {
      const result = service.transformToFlow(mockFlowData, 'from', 'to', 'people');
      
      const gazaToRafah = result.find(
        item => item.source === 'Gaza City' && item.target === 'Rafah'
      );
      
      expect(gazaToRafah).toBeDefined();
      expect(gazaToRafah!.value).toBe(1300); // 1000 + 300
    });

    it('should default to count of 1 when no value field specified', () => {
      const simpleData = [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
      ];
      
      const result = service.transformToFlow(simpleData, 'from', 'to');
      
      const aToB = result.find(item => item.source === 'A' && item.target === 'B');
      expect(aToB?.value).toBe(2);
    });

    it('should filter by minimum value', () => {
      const result = service.transformToFlow(mockFlowData, 'from', 'to', 'people', {
        minValue: 500,
      });
      
      result.forEach(item => {
        expect(item.value).toBeGreaterThanOrEqual(500);
      });
    });

    it('should sort by value descending', () => {
      const result = service.transformToFlow(mockFlowData, 'from', 'to', 'people');
      
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].value).toBeGreaterThanOrEqual(result[i + 1].value);
      }
    });

    it('should preserve metadata', () => {
      const result = service.transformToFlow(mockFlowData, 'from', 'to', 'people');
      
      result.forEach(item => {
        expect(item).toHaveProperty('metadata');
      });
    });
  });

  describe('transformToCalendar', () => {
    const mockCalendarData = [
      { date: '2024-01-01', casualties: 50 },
      { date: '2024-01-02', casualties: 100 },
      { date: '2024-01-03', casualties: 75 },
      { date: '2024-01-05', casualties: 200 },
      { date: '2024-01-06', casualties: 30 },
    ];

    it('should return empty array for empty data', () => {
      const result = service.transformToCalendar([], 'date', 'casualties');
      expect(result).toEqual([]);
    });

    it('should create calendar data with date, value, and intensity', () => {
      const result = service.transformToCalendar(mockCalendarData, 'date', 'casualties');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      result.forEach(item => {
        expect(item).toHaveProperty('date');
        expect(item).toHaveProperty('value');
        expect(item).toHaveProperty('intensity');
        expect(['low', 'medium', 'high', 'critical']).toContain(item.intensity);
      });
    });

    it('should sort by date', () => {
      const result = service.transformToCalendar(mockCalendarData, 'date', 'casualties');
      
      for (let i = 0; i < result.length - 1; i++) {
        const date1 = new Date(result[i].date);
        const date2 = new Date(result[i + 1].date);
        expect(date1.getTime()).toBeLessThanOrEqual(date2.getTime());
      }
    });

    it('should aggregate duplicate dates', () => {
      const dataWithDuplicates = [
        { date: '2024-01-01', casualties: 50 },
        { date: '2024-01-01', casualties: 30 },
        { date: '2024-01-02', casualties: 100 },
      ];
      
      const result = service.transformToCalendar(dataWithDuplicates, 'date', 'casualties');
      
      const jan1 = result.find(item => item.date === '2024-01-01');
      expect(jan1?.value).toBe(80); // 50 + 30
    });

    it('should use custom intensity thresholds', () => {
      const result = service.transformToCalendar(mockCalendarData, 'date', 'casualties', {
        intensityThresholds: {
          low: 40,
          medium: 80,
          high: 150,
        },
      });
      
      const lowItem = result.find(item => item.value === 30);
      expect(lowItem?.intensity).toBe('low');
      
      const highItem = result.find(item => item.value === 200);
      expect(highItem?.intensity).toBe('critical');
    });

    it('should fill missing dates when requested', () => {
      const result = service.transformToCalendar(mockCalendarData, 'date', 'casualties', {
        fillMissingDates: true,
      });
      
      // Should have more items due to filled dates
      expect(result.length).toBeGreaterThanOrEqual(mockCalendarData.length);
      
      // Check that Jan 4 is filled (missing in original data)
      const jan4 = result.find(item => item.date === '2024-01-04');
      expect(jan4).toBeDefined();
      expect(jan4?.value).toBe(0);
    });

    it('should handle various date formats', () => {
      const dataWithDifferentFormats = [
        { date: '2024-01-01', casualties: 50 },
        { date: new Date('2024-01-02'), casualties: 100 },
      ];
      
      const result = service.transformToCalendar(dataWithDifferentFormats, 'date', 'casualties');
      
      expect(result.length).toBe(2);
      result.forEach(item => {
        expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });
});
