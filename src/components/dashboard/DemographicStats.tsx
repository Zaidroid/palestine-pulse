import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Skeleton } from "./components/ui/skeleton";

interface DemographicItem {
  label: string;
  value: number;
  color: string;
  gradient: string;
}

interface DemographicStatsProps {
  title: string;
  description: string;
  items: DemographicItem[];
  loading?: boolean;
}

export const DemographicStats = ({ title, description, items, loading }: DemographicStatsProps) => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div 
              key={item.label}
              className={`flex items-center justify-between p-3 rounded-lg bg-gradient-to-r ${item.gradient} border border-${item.color}/30 hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full bg-${item.color}`}></div>
                <span className="font-medium">{item.label}</span>
              </div>
              <span className="text-xl font-bold">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);
