import { usePopulationStatistics } from "./hooks/usePopulation";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "./components/ui/card";
import { Skeleton } from "./components/ui/skeleton";
import { UnifiedBadge as DataQualityBadge } from "./components/ui/unified-badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users } from "lucide-react";

export const PopulationDemographics = () => {
  const { 
    total, 
    gaza, 
    westBank, 
    male, 
    female, 
    children, 
    adults, 
    elderly, 
    refugees, 
    byGovernorate, 
    isLoading, 
    error 
  } = usePopulationStatistics();

  const governorateData = Object.entries(byGovernorate)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Population & Demographics
              </CardTitle>
              <CardDescription>Population statistics for Palestine</CardDescription>
            </div>
            <DataQualityBadge
              source="PCBS"
              isRealData={total > 0}
              recordCount={total}
              showDetails={false}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              Unable to load population data
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Total Population</div>
                  <div className="text-2xl font-bold mt-1">{total.toLocaleString()}</div>
                </div>
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="text-sm text-muted-foreground">West Bank</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{westBank.toLocaleString()}</div>
                </div>
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                  <div className="text-sm text-muted-foreground">Gaza Strip</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{gaza.toLocaleString()}</div>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Refugees</div>
                  <div className="text-2xl font-bold mt-1">{refugees.toLocaleString()}</div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Male</div>
                  <div className="text-xl font-bold">{male.toLocaleString()}</div>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Female</div>
                  <div className="text-xl font-bold">{female.toLocaleString()}</div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">{"Children (<18)"}</div>
                  <div className="text-xl font-bold">{children.toLocaleString()}</div>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Adults (18-64)</div>
                  <div className="text-xl font-bold">{adults.toLocaleString()}</div>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Elderly (65+)</div>
                  <div className="text-xl font-bold">{elderly.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <CardTitle>Population by Governorate</CardTitle>
          <CardDescription>Distribution of population across all governorates</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              Unable to load governorate data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={governorateData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="hsl(var(--primary))" name="Population" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};