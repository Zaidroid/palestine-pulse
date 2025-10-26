import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

interface ExpandableMetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  loading?: boolean;
  subtitle?: string;
  gradient?: string;
  trendData?: any[];
  detailContent?: React.ReactNode;
  change?: number;
}

export const ExpandableMetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  loading,
  subtitle,
  gradient = "from-primary/10 to-transparent",
  trendData,
  detailContent,
  change
}: ExpandableMetricCardProps) => {
  const CardContent_Inner = (
    <Card className={`border-border bg-gradient-to-br ${gradient} hover:shadow-[var(--shadow-glow)] transition-all duration-300 cursor-pointer hover:scale-[1.02] group`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
              {change !== undefined && (
                <div className={`flex items-center text-sm ${change >= 0 ? 'text-destructive' : 'text-secondary'}`}>
                  {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="ml-1">{Math.abs(change)}%</span>
                </div>
              )}
            </div>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
            {trendData && trendData.length > 0 && (
              <div className="mt-3 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        fontSize: "12px"
                      }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  if (detailContent) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {CardContent_Inner}
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              {title} - Detailed View
            </DialogTitle>
            <DialogDescription>
              Comprehensive breakdown and analysis
            </DialogDescription>
          </DialogHeader>
          {detailContent}
        </DialogContent>
      </Dialog>
    );
  }

  return CardContent_Inner;
};
