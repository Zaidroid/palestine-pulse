/**
 * Calendar Heatmap Chart Demo Component
 * 
 * Demonstrates the CalendarHeatmapChart with sample data and interactive features.
 */

import { useState, useMemo } from 'react';
import { CalendarHeatmapChart } from './CalendarHeatmapChart';
import { CalendarData } from '@/types/dashboard-data.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Share2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as d3 from 'd3';

/**
 * Generate sample calendar data for demonstration
 */
const generateSampleData = (year: number, dataType: 'casualties' | 'attacks' | 'demolitions'): CalendarData[] => {
  const data: CalendarData[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    let value = 0;
    let intensity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    // Generate realistic patterns based on data type
    if (dataType === 'casualties') {
      // Higher values with occasional spikes
      value = Math.floor(Math.random() * 150) + 10;
      if (Math.random() > 0.9) value += Math.floor(Math.random() * 200); // Spike days
      
      if (value < 50) intensity = 'low';
      else if (value < 100) intensity = 'medium';
      else if (value < 200) intensity = 'high';
      else intensity = 'critical';
    } else if (dataType === 'attacks') {
      // Moderate values with clusters
      value = Math.floor(Math.random() * 30);
      if (Math.random() > 0.85) value += Math.floor(Math.random() * 40);
      
      if (value < 10) intensity = 'low';
      else if (value < 20) intensity = 'medium';
      else if (value < 40) intensity = 'high';
      else intensity = 'critical';
    } else {
      // Lower values, more sporadic
      value = Math.random() > 0.7 ? Math.floor(Math.random() * 15) : 0;
      
      if (value < 3) intensity = 'low';
      else if (value < 7) intensity = 'medium';
      else if (value < 12) intensity = 'high';
      else intensity = 'critical';
    }
    
    if (value > 0) {
      data.push({
        date: d3.timeFormat('%Y-%m-%d')(currentDate),
        value,
        intensity,
        metadata: {
          dayOfWeek: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
          month: currentDate.toLocaleDateString('en-US', { month: 'long' }),
        }
      });
    }
    
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
};

/**
 * CalendarHeatmapChartDemo Component
 */
export const CalendarHeatmapChartDemo: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  const [selectedDataset, setSelectedDataset] = useState<'casualties' | 'attacks' | 'demolitions'>('casualties');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedCell, setSelectedCell] = useState<CalendarData | null>(null);

  // Generate sample data
  const sampleData = useMemo(() => {
    return generateSampleData(selectedYear, selectedDataset);
  }, [selectedYear, selectedDataset]);

  // Available years
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];

  // Month names
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getCurrentTitle = () => {
    switch (selectedDataset) {
      case 'casualties':
        return 'Daily Casualties Calendar';
      case 'attacks':
        return 'Healthcare Attacks Calendar';
      case 'demolitions':
        return 'Home Demolitions Calendar';
      default:
        return 'Calendar Heatmap';
    }
  };

  const getCurrentDescription = () => {
    switch (selectedDataset) {
      case 'casualties':
        return 'Daily casualty counts with intensity color coding';
      case 'attacks':
        return 'Healthcare facility attacks by day';
      case 'demolitions':
        return 'Home demolition events by day';
      default:
        return 'Daily data visualization';
    }
  };

  const handleCellClick = (data: CalendarData) => {
    setSelectedCell(data);
    console.log('Cell clicked:', data);
  };

  const handleCellHover = (data: CalendarData | null) => {
    if (data) {
      console.log('Cell hovered:', data.date);
    }
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setSelectedMonth(null); // Reset month when year changes
  };

  const handleMonthToggle = (month: number) => {
    setSelectedMonth(selectedMonth === month ? null : month);
  };

  const handlePreviousYear = () => {
    if (selectedYear > availableYears[availableYears.length - 1]) {
      setSelectedYear(selectedYear - 1);
      setSelectedMonth(null);
    }
  };

  const handleNextYear = () => {
    if (selectedYear < availableYears[0]) {
      setSelectedYear(selectedYear + 1);
      setSelectedMonth(null);
    }
  };

  const handleExport = () => {
    console.log('Export calendar as PNG');
    // Implementation would go here
  };

  const handleShare = () => {
    console.log('Share calendar');
    // Implementation would go here
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const values = sampleData.map(d => d.value);
    return {
      total: values.reduce((sum, v) => sum + v, 0),
      average: values.length > 0 ? Math.round(values.reduce((sum, v) => sum + v, 0) / values.length) : 0,
      max: values.length > 0 ? Math.max(...values) : 0,
      daysWithData: values.length,
    };
  }, [sampleData]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>{getCurrentTitle()}</CardTitle>
              </div>
              <CardDescription>
                {getCurrentDescription()}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          {/* Dataset selector */}
          <div className="flex items-center gap-2 pt-4">
            <Badge
              variant={selectedDataset === 'casualties' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedDataset('casualties')}
            >
              Casualties
            </Badge>
            <Badge
              variant={selectedDataset === 'attacks' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedDataset('attacks')}
            >
              Healthcare Attacks
            </Badge>
            <Badge
              variant={selectedDataset === 'demolitions' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedDataset('demolitions')}
            >
              Demolitions
            </Badge>
          </div>

          {/* Year navigation */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousYear}
                disabled={selectedYear <= availableYears[availableYears.length - 1]}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                {availableYears.map(year => (
                  <Badge
                    key={year}
                    variant={selectedYear === year ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleYearChange(year)}
                  >
                    {year}
                  </Badge>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextYear}
                disabled={selectedYear >= availableYears[0]}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {selectedMonth !== null && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMonth(null)}
              >
                Show Full Year
              </Button>
            )}
          </div>

          {/* Month selector */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {monthNames.map((month, index) => (
              <Badge
                key={month}
                variant={selectedMonth === index ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => handleMonthToggle(index)}
              >
                {month}
              </Badge>
            ))}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4 pt-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Average/Day</p>
              <p className="text-2xl font-bold">{stats.average}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Peak Day</p>
              <p className="text-2xl font-bold">{stats.max}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Days with Data</p>
              <p className="text-2xl font-bold">{stats.daysWithData}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <CalendarHeatmapChart
            data={sampleData}
            animated={true}
            interactive={true}
            showMonthLabels={true}
            showDayLabels={true}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth ?? undefined}
            onCellClick={handleCellClick}
            onCellHover={handleCellHover}
            onYearChange={handleYearChange}
            onMonthChange={(month) => setSelectedMonth(month)}
          />
          
          {selectedCell && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-semibold mb-2">Selected Date Details</p>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Date:</span> {selectedCell.date}</p>
                <p><span className="text-muted-foreground">Value:</span> {selectedCell.value}</p>
                <p><span className="text-muted-foreground">Intensity:</span> <span className="capitalize">{selectedCell.intensity}</span></p>
                {selectedCell.metadata && (
                  <>
                    <p><span className="text-muted-foreground">Day:</span> {selectedCell.metadata.dayOfWeek}</p>
                    <p><span className="text-muted-foreground">Month:</span> {selectedCell.metadata.month}</p>
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setSelectedCell(null)}
              >
                Clear Selection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Features Demonstrated</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Calendar grid with month/week structure</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Color scale for intensity values (low to critical)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Smart tooltips with daily details on hover</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Month labels and day-of-week labels</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Year navigation with previous/next controls</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Month filtering to zoom into specific months</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Animated cell transitions with staggered delays</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Click handlers for drill-down functionality</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>RTL layout support for Arabic language</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Theme-aware colors (light/dark mode)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Statistics summary (total, average, peak, days with data)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarHeatmapChartDemo;
