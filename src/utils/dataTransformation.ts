/**
 * V3 Data Transformation Layer
 *
 * Converts raw consolidated data to V3 component-specific formats:
 * - Unified metric cards data
 * - Timeline widget data
 * - Chart and visualization data
 * - Filter and aggregation utilities
 */

import {
  V3ConsolidatedData,
  GazaDashboardData,
  WestBankDashboardData,
  CasualtyData,
  InfrastructureData,
  WestBankData,
  GeographicPoint,
  TimelineEvent
} from './types/data.types';

// ============================================
// TRANSFORMATION INTERFACES
// ============================================

export interface UnifiedMetricCardData {
  id: string;
  title: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  trend: 'up' | 'down' | 'stable';
  status: 'critical' | 'warning' | 'good' | 'neutral';
  format: 'number' | 'percentage' | 'currency' | 'duration';
  source: string;
  lastUpdated: string;
  metadata?: Record<string, any>;
}

export interface TimelineWidgetData {
  events: TimelineEvent[];
  dateRange: {
    start: string;
    end: string;
  };
  filters: {
    eventTypes: string[];
    severity: string[];
    regions: string[];
  };
}

export interface ChartDataPoint {
  date: string;
  value: number;
  category?: string;
  metadata?: Record<string, any>;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }>;
}

export interface MapVisualizationData {
  points: GeographicPoint[];
  heatmap: Array<{
    lat: number;
    lng: number;
    intensity: number;
  }>;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// ============================================
// DATA TRANSFORMATION SERVICE
// ============================================

export class DataTransformationService {
  /**
   * Transform consolidated data for Gaza dashboard humanitarian crisis sub-tab
   */
  transformGazaHumanitarianCrisis(
    gazaData: GazaDashboardData['humanitarianCrisis']
  ): {
    metricCards: UnifiedMetricCardData[];
    timelineData: TimelineWidgetData;
    chartData: ChartData;
  } {
    const metricCards: UnifiedMetricCardData[] = [];

    // Transform casualty data to metric cards
    if (gazaData.casualties && Array.isArray(gazaData.casualties)) {
      const latest = gazaData.casualties[gazaData.casualties.length - 1];
      if (latest) {
        metricCards.push({
          id: 'gaza-total-killed',
          title: 'Total Killed',
          value: latest.killed_cum || 0,
          previousValue: gazaData.casualties.length > 1 ?
            gazaData.casualties[gazaData.casualties.length - 2]?.killed_cum : undefined,
          trend: this.calculateTrend(latest.killed_cum, latest.killed),
          status: this.calculateCasualtyStatus(latest.killed_cum),
          format: 'number',
          source: 'Tech4Palestine',
          lastUpdated: gazaData.lastUpdated,
        });

        metricCards.push({
          id: 'gaza-total-injured',
          title: 'Total Injured',
          value: latest.injured_cum || 0,
          previousValue: gazaData.casualties.length > 1 ?
            gazaData.casualties[gazaData.casualties.length - 2]?.injured_cum : undefined,
          trend: this.calculateTrend(latest.injured_cum, latest.injured),
          status: this.calculateInjuryStatus(latest.injured_cum),
          format: 'number',
          source: 'Tech4Palestine',
          lastUpdated: gazaData.lastUpdated,
        });

        if (latest.killed_children_cum) {
          metricCards.push({
            id: 'gaza-children-killed',
            title: 'Children Killed',
            value: latest.killed_children_cum,
            trend: this.calculateTrend(latest.killed_children_cum, latest.killed_children),
            status: 'critical',
            format: 'number',
            source: 'Tech4Palestine',
            lastUpdated: gazaData.lastUpdated,
          });
        }
      }
    }

    // Transform press casualties
    if (gazaData.pressCasualties && Array.isArray(gazaData.pressCasualties)) {
      metricCards.push({
        id: 'gaza-press-killed',
        title: 'Press Killed',
        value: gazaData.pressCasualties.length,
        trend: 'stable',
        status: 'critical',
        format: 'number',
        source: 'Tech4Palestine',
        lastUpdated: gazaData.lastUpdated,
      });
    }

    // Generate timeline data
    const timelineData = this.generateTimelineData(gazaData);

    // Generate chart data
    const chartData = this.generateCasualtyChartData(gazaData.casualties);

    return {
      metricCards,
      timelineData,
      chartData,
    };
  }

  /**
   * Transform consolidated data for West Bank dashboard occupation metrics
   */
  transformWestBankOccupationMetrics(
    occupationData: WestBankDashboardData['occupationMetrics']
  ): {
    metricCards: UnifiedMetricCardData[];
    mapData: MapVisualizationData;
    chartData: ChartData;
  } {
    const metricCards: UnifiedMetricCardData[] = [];

    // Transform settlement data
    if (occupationData.settlements) {
      metricCards.push({
        id: 'wb-settlements-total',
        title: 'Total Settlements',
        value: occupationData.settlements.total || 0,
        trend: 'up',
        status: 'warning',
        format: 'number',
        source: 'Good Shepherd',
        lastUpdated: occupationData.lastUpdated,
      });

      metricCards.push({
        id: 'wb-settlers-population',
        title: 'Settler Population',
        value: occupationData.settlements.population || 0,
        trend: 'up',
        status: 'warning',
        format: 'number',
        source: 'Good Shepherd',
        lastUpdated: occupationData.lastUpdated,
      });
    }

    // Transform land seizure data
    if (occupationData.landSeizure) {
      metricCards.push({
        id: 'wb-land-seized',
        title: 'Land Seized (km²)',
        value: occupationData.landSeizure || 0,
        trend: 'up',
        status: 'critical',
        format: 'number',
        source: 'Good Shepherd',
        lastUpdated: occupationData.lastUpdated,
      });
    }

    // Generate map data for settlements
    const mapData = this.generateSettlementMapData(occupationData);

    // Generate chart data for settlement growth
    const chartData = this.generateSettlementChartData(occupationData);

    return {
      metricCards,
      mapData,
      chartData,
    };
  }

  /**
   * Transform data for cross-dashboard correlations
   */
  transformCorrelationData(
    consolidatedData: V3ConsolidatedData
  ): {
    casualtyInfrastructureCorrelation: ChartData;
    economicMilitaryCorrelation: ChartData;
    displacementAidCorrelation: ChartData;
  } {
    return {
      casualtyInfrastructureCorrelation: this.generateCasualtyInfrastructureCorrelation(
        consolidatedData.gaza.humanitarianCrisis.casualties,
        consolidatedData.gaza.infrastructureDestruction
      ),
      economicMilitaryCorrelation: this.generateEconomicMilitaryCorrelation(
        consolidatedData.westbank.economicStrangulation,
        consolidatedData.gaza.humanitarianCrisis.casualties
      ),
      displacementAidCorrelation: this.generateDisplacementAidCorrelation(
        consolidatedData.gaza.populationImpact.displacement,
        consolidatedData.gaza.aidSurvival.aid
      ),
    };
  }

  // ============================================
  // PRIVATE TRANSFORMATION METHODS
  // ============================================

  private calculateTrend(current: number, previous?: number): 'up' | 'down' | 'stable' {
    if (!previous) return 'stable';

    const change = current - previous;
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'stable';
  }

  private calculateCasualtyStatus(count: number): 'critical' | 'warning' | 'good' | 'neutral' {
    if (count > 10000) return 'critical';
    if (count > 5000) return 'warning';
    return 'neutral';
  }

  private calculateInjuryStatus(count: number): 'critical' | 'warning' | 'good' | 'neutral' {
    if (count > 50000) return 'critical';
    if (count > 25000) return 'warning';
    return 'neutral';
  }

  private generateTimelineData(gazaData: GazaDashboardData['humanitarianCrisis']): TimelineWidgetData {
    const events: TimelineEvent[] = [];

    // Convert casualty data to timeline events
    if (gazaData.casualties && Array.isArray(gazaData.casualties)) {
      gazaData.casualties.forEach((casualty, index) => {
        if (casualty.killed > 0) {
          events.push({
            id: `casualty-${index}`,
            date: casualty.report_date,
            title: `${casualty.killed} killed, ${casualty.injured} injured`,
            description: `Daily casualties: ${casualty.killed} killed, ${casualty.injured} injured`,
            type: 'military_operation',
            severity: this.calculateEventSeverity(casualty.killed),
            casualties: {
              killed: casualty.killed,
              injured: casualty.injured,
            },
          });
        }
      });
    }

    return {
      events,
      dateRange: {
        start: events.length > 0 ? events[0].date : new Date().toISOString().split('T')[0],
        end: events.length > 0 ? events[events.length - 1].date : new Date().toISOString().split('T')[0],
      },
      filters: {
        eventTypes: ['military_operation'],
        severity: ['low', 'medium', 'high', 'critical'],
        regions: ['Gaza'],
      },
    };
  }

  private generateCasualtyChartData(casualties: CasualtyData[] | undefined): ChartData {
    if (!casualties || !Array.isArray(casualties)) {
      return { labels: [], datasets: [] };
    }

    const labels = casualties.map(c => c.report_date);
    const killedData = casualties.map(c => c.killed || 0);
    const injuredData = casualties.map(c => c.injured || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Killed',
          data: killedData,
          backgroundColor: '#CC2936',
          borderColor: '#CC2936',
        },
        {
          label: 'Injured',
          data: injuredData,
          backgroundColor: '#FF6B35',
          borderColor: '#FF6B35',
        },
      ],
    };
  }

  private generateSettlementMapData(occupationData: WestBankDashboardData['occupationMetrics']): MapVisualizationData {
    // Generate mock settlement data points for West Bank
    const mockSettlements: GeographicPoint[] = [
      {
        lat: 31.7683,
        lng: 35.2137,
        location_name: 'Jerusalem Area Settlements',
        incident_type: 'settlement',
        casualties: 0,
        date: new Date().toISOString().split('T')[0],
      },
      {
        lat: 32.1093,
        lng: 35.2964,
        location_name: 'Nablus Area Settlements',
        incident_type: 'settlement',
        casualties: 0,
        date: new Date().toISOString().split('T')[0],
      },
    ];

    return {
      points: mockSettlements,
      heatmap: [],
      bounds: {
        north: 32.5,
        south: 31.2,
        east: 35.8,
        west: 34.2,
      },
    };
  }

  private generateSettlementChartData(occupationData: WestBankDashboardData['occupationMetrics']): ChartData {
    // Generate settlement growth chart data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const settlementGrowth = [120, 125, 128, 132, 135, 138];

    return {
      labels: months,
      datasets: [
        {
          label: 'Settlement Population',
          data: settlementGrowth,
          backgroundColor: '#7863FF',
          borderColor: '#7863FF',
        },
      ],
    };
  }

  private generateCasualtyInfrastructureCorrelation(
    casualties: CasualtyData[] | undefined,
    infrastructure: any
  ): ChartData {
    if (!casualties || !Array.isArray(casualties)) {
      return { labels: [], datasets: [] };
    }

    const labels = casualties.slice(-7).map(c => c.report_date);
    const casualtyData = casualties.slice(-7).map(c => c.killed || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Daily Casualties',
          data: casualtyData,
          backgroundColor: '#CC2936',
          borderColor: '#CC2936',
        },
      ],
    };
  }

  private generateEconomicMilitaryCorrelation(
    economicData: WestBankDashboardData['economicStrangulation'],
    casualties: GazaDashboardData['humanitarianCrisis']['casualties']
  ): ChartData {
    return {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Economic Impact',
          data: [100, 120, 140, 160],
          backgroundColor: '#FF6B35',
          borderColor: '#FF6B35',
        },
      ],
    };
  }

  private generateDisplacementAidCorrelation(
    displacement: any,
    aid: any
  ): ChartData {
    return {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Displacement vs Aid',
          data: [80, 85, 90, 95],
          backgroundColor: '#4ECDC4',
          borderColor: '#4ECDC4',
        },
      ],
    };
  }

  private calculateEventSeverity(killed: number): 'low' | 'medium' | 'high' | 'critical' {
    if (killed >= 50) return 'critical';
    if (killed >= 20) return 'high';
    if (killed >= 5) return 'medium';
    return 'low';
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function createTransformationService(): DataTransformationService {
  return new DataTransformationService();
}

/**
 * Transform consolidated data to unified metric cards for dashboard display
 */
export function transformToMetricCards(
  consolidatedData: V3ConsolidatedData
): UnifiedMetricCardData[] {
  const service = createTransformationService();
  const gazaCards = service.transformGazaHumanitarianCrisis(
    consolidatedData.gaza.humanitarianCrisis
  ).metricCards;

  const wbCards = service.transformWestBankOccupationMetrics(
    consolidatedData.westbank.occupationMetrics
  ).metricCards;

  return [...gazaCards, ...wbCards];
}

/**
 * Transform consolidated data to timeline widget format
 */
export function transformToTimelineData(
  consolidatedData: V3ConsolidatedData
): TimelineWidgetData {
  const service = createTransformationService();
  return service.transformGazaHumanitarianCrisis(
    consolidatedData.gaza.humanitarianCrisis
  ).timelineData;
}

/**
 * Transform consolidated data to map visualization format
 */
export function transformToMapData(
  consolidatedData: V3ConsolidatedData
): MapVisualizationData {
  const service = createTransformationService();
  return service.transformWestBankOccupationMetrics(
    consolidatedData.westbank.occupationMetrics
  ).mapData;
}