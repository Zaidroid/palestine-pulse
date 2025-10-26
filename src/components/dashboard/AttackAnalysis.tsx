import { useWestBankDaily } from "./hooks/useDataFetching";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "./components/ui/card";
import { Skeleton } from "./components/ui/skeleton";
import { UnifiedBadge as DataQualityBadge } from "./components/ui/unified-badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield } from "lucide-react";

export const AttackAnalysis = () => {
  const { data, isLoading, error } = useWestBankDaily();

  const attackData = data?.map(item => ({
    date: new Date(item.report_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    attacks: item.settler_attacks,
  })) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Settler Attack Analysis
              </CardTitle>
              <CardDescription>Settler attacks in the West Bank</CardDescription>
            </div>
            <DataQualityBadge
              source="Tech4Palestine"
              isRealData={!!data}
              recordCount={data?.length}
              showDetails={false}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              Unable to load attack data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={attackData} margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attacks" fill="hsl(var(--primary))" name="Settler Attacks (Cumulative)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};