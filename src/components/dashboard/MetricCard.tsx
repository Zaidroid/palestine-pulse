import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Skeleton } from "./components/ui/skeleton";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  loading?: boolean;
  subtitle?: string;
  gradient?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  loading,
  subtitle,
  gradient = "from-primary/10 to-transparent"
}: MetricCardProps) => (
  <Card className={`border-border bg-gradient-to-br ${gradient} hover:shadow-[var(--shadow-glow)] transition-all duration-300`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-primary" />
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <>
          <div className="text-3xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
        </>
      )}
    </CardContent>
  </Card>
);
