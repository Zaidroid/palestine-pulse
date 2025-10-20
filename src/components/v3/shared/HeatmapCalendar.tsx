import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay } from "date-fns";

interface HeatmapData {
  date: Date;
  value: number;
  label?: string;
}

interface HeatmapCalendarProps {
  data: HeatmapData[];
  title?: string;
  month?: Date;
  colorScale?: 'red' | 'green' | 'blue';
  maxValue?: number;
  onDayClick?: (data: HeatmapData) => void;
  className?: string;
}

export const HeatmapCalendar = ({
  data,
  title = "Activity Calendar",
  month = new Date(),
  colorScale = 'red',
  maxValue,
  onDayClick,
  className
}: HeatmapCalendarProps) => {
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  // Calculate intensity scale
  const computedMaxValue = maxValue || Math.max(...data.map(d => d.value), 1);

  // Generate calendar grid
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Map data to days
  const dayDataMap = useMemo(() => {
    const map = new Map<string, HeatmapData>();
    data.forEach(item => {
      const key = format(item.date, 'yyyy-MM-dd');
      map.set(key, item);
    });
    return map;
  }, [data]);

  const getIntensity = (day: Date) => {
    const key = format(day, 'yyyy-MM-dd');
    const dayData = dayDataMap.get(key);
    if (!dayData) return 0;
    return (dayData.value / computedMaxValue) * 100;
  };

  const getDayData = (day: Date) => {
    const key = format(day, 'yyyy-MM-dd');
    return dayDataMap.get(key);
  };

  const getColorClass = (intensity: number) => {
    if (intensity === 0) return 'bg-muted';
    
    const colors = {
      red: [
        'bg-destructive/20',
        'bg-destructive/40',
        'bg-destructive/60',
        'bg-destructive/80',
        'bg-destructive'
      ],
      green: [
        'bg-secondary/20',
        'bg-secondary/40',
        'bg-secondary/60',
        'bg-secondary/80',
        'bg-secondary'
      ],
      blue: [
        'bg-primary/20',
        'bg-primary/40',
        'bg-primary/60',
        'bg-primary/80',
        'bg-primary'
      ]
    };

    const scale = colors[colorScale];
    if (intensity < 20) return scale[0];
    if (intensity < 40) return scale[1];
    if (intensity < 60) return scale[2];
    if (intensity < 80) return scale[3];
    return scale[4];
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeks: Date[][] = [];
  
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {format(month, 'MMMM yyyy')}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <TooltipProvider>
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="grid grid-cols-7 gap-1">
                  {week.map((day, dayIdx) => {
                    const intensity = getIntensity(day);
                    const dayData = getDayData(day);
                    const isCurrentMonth = isSameMonth(day, month);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <Tooltip key={dayIdx}>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: (weekIdx * 7 + dayIdx) * 0.01 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => dayData && onDayClick?.(dayData)}
                            className={cn(
                              "aspect-square rounded-sm transition-all cursor-pointer",
                              getColorClass(intensity),
                              !isCurrentMonth && "opacity-30",
                              isToday && "ring-2 ring-primary ring-offset-2",
                              dayData && "cursor-pointer hover:ring-2 hover:ring-offset-2",
                              hoveredDay && isSameDay(hoveredDay, day) && "ring-2 ring-offset-1"
                            )}
                            onMouseEnter={() => setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                          >
                            <div className="flex items-center justify-center h-full text-xs font-medium">
                              {format(day, 'd')}
                            </div>
                          </motion.div>
                        </TooltipTrigger>
                        {dayData && (
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="font-semibold">{format(day, 'PPP')}</p>
                              <p className="text-sm">{dayData.label || `Value: ${dayData.value}`}</p>
                              {dayData.value > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  Intensity: {Math.round(intensity)}%
                                </p>
                              )}
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </TooltipProvider>

            {/* Legend */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 25, 50, 75, 100].map((intensity) => (
                  <div
                    key={intensity}
                    className={cn(
                      "w-4 h-4 rounded-sm",
                      getColorClass(intensity)
                    )}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};