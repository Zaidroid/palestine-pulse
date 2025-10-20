import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Filter, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface TimelineEvent {
  date: Date;
  title: string;
  description?: string;
  type?: 'critical' | 'high' | 'medium' | 'low';
  category?: string;
  casualties?: number;
  metadata?: Record<string, any>;
}

interface TimelineWidgetProps {
  events: TimelineEvent[];
  title?: string;
  showFilters?: boolean;
  maxItems?: number;
  className?: string;
}

export const TimelineWidget = ({
  events,
  title = "Timeline",
  showFilters = true,
  maxItems = 10,
  className
}: TimelineWidgetProps) => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expanded, setExpanded] = useState<number[]>([]);

  // Get unique types and categories
  const types = Array.from(new Set(events.map(e => e.type).filter(Boolean)));
  const categories = Array.from(new Set(events.map(e => e.category).filter(Boolean)));

  // Filter events
  const filteredEvents = events
    .filter(e => selectedType === "all" || e.type === selectedType)
    .filter(e => selectedCategory === "all" || e.category === selectedCategory)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, maxItems);

  const toggleExpand = (index: number) => {
    setExpanded(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'critical':
        return 'border-destructive bg-destructive/10 text-destructive';
      case 'high':
        return 'border-warning bg-warning/10 text-warning';
      case 'medium':
        return 'border-primary bg-primary/10 text-primary';
      case 'low':
        return 'border-secondary bg-secondary/10 text-secondary';
      default:
        return 'border-muted bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {title}
            </CardTitle>
            {showFilters && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {types.length > 0 && (
                  <div className="flex gap-1">
                    <Badge
                      variant={selectedType === "all" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedType("all")}
                    >
                      All
                    </Badge>
                    {types.map(type => (
                      <Badge
                        key={type}
                        variant={selectedType === type ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedType(type as string)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, idx) => {
                const isExpanded = expanded.includes(idx);
                
                return (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative"
                  >
                    {idx > 0 && <Separator className="mb-4" />}
                    
                    <div className="flex gap-4">
                      {/* Timeline Dot */}
                      <div className="relative flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={cn(
                            "h-3 w-3 rounded-full border-2",
                            getTypeColor(event.type)
                          )}
                        />
                        {idx < filteredEvents.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-2" />
                        )}
                      </div>

                      {/* Event Content */}
                      <div className="flex-1 pb-4">
                        <div
                          className="cursor-pointer"
                          onClick={() => event.description && toggleExpand(idx)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <h4 className="font-semibold leading-none">
                                {event.title}
                              </h4>
                              <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                {format(event.date, "PPP")}
                                {event.category && (
                                  <Badge variant="outline" className="text-xs h-5">
                                    {event.category}
                                  </Badge>
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {event.casualties !== undefined && (
                                <Badge variant="destructive" className="text-xs">
                                  {event.casualties} casualties
                                </Badge>
                              )}
                              {event.description && (
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </motion.div>
                              )}
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && event.description && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <p className="text-sm text-muted-foreground mt-3">
                                  {event.description}
                                </p>
                                {event.metadata && Object.keys(event.metadata).length > 0 && (
                                  <div className="mt-3 p-3 bg-muted rounded-lg space-y-1">
                                    {Object.entries(event.metadata).map(([key, value]) => (
                                      <div key={key} className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">{key}:</span>
                                        <span className="font-medium">{String(value)}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No events found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};