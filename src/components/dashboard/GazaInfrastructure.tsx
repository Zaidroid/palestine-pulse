import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { UnifiedBadge as DataQualityBadge } from "@/components/ui/unified-badge";
import { useHealthFacilityStats } from "@/hooks/useHealthFacilities";
import { Stethoscope, Building2, Activity } from "lucide-react";
import { EducationImpact } from "./EducationImpact";

export const GazaInfrastructure = () => {
  const healthStats = useHealthFacilityStats();

  return (
    <div className="space-y-8 animate-fade-in">
        <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Health Infrastructure Impact
                </CardTitle>
                <CardDescription>Medical facilities status in Gaza (HDX Health Facilities Database)</CardDescription>
              </div>
              <DataQualityBadge
                source="HDX"
                isRealData={!!healthStats.total && healthStats.total > 0}
                recordCount={healthStats.total}
                showDetails={false}
              />
            </div>
          </CardHeader>
          <CardContent>
            {healthStats.isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : healthStats.error ? (
              <div className="text-center py-8 text-muted-foreground">
                Unable to load health facilities data
              </div>
            ) : (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid gap-4 grid-cols-2">
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="text-sm text-muted-foreground">Total Facilities</div>
                    <div className="text-2xl font-bold mt-1">
                      {healthStats.total.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div className="text-sm text-muted-foreground">Operational</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                      {healthStats.operational.toLocaleString()}
                    </div>
                    <Progress
                      value={(healthStats.operational / healthStats.total) * 100}
                      className="mt-2 h-2"
                    />
                  </div>
                  <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                    <div className="text-sm text-muted-foreground">Partially Operational</div>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                      {healthStats.partiallyOperational.toLocaleString()}
                    </div>
                    <Progress
                      value={(healthStats.partiallyOperational / healthStats.total) * 100}
                      className="mt-2 h-2"
                    />
                  </div>
                  <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                    <div className="text-sm text-muted-foreground">Non-Operational</div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                      {healthStats.nonOperational.toLocaleString()}
                    </div>
                    <Progress
                      value={(healthStats.nonOperational / healthStats.total) * 100}
                      className="mt-2 h-2"
                    />
                  </div>
                </div>

                {/* Facility Types */}
                <div className="grid gap-4 grid-cols-3">
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Hospitals</span>
                    </div>
                    <div className="text-xl font-bold">{healthStats.hospitals.toLocaleString()}</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Clinics</span>
                    </div>
                    <div className="text-xl font-bold">{healthStats.clinics.toLocaleString()}</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Health Centers</span>
                    </div>
                    <div className="text-xl font-bold">{healthStats.healthCenters.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <EducationImpact />
    </div>
  );
};