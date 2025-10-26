import { useSchoolStatistics } from "./hooks/useSchools";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "./components/ui/card";
import { Skeleton } from "./components/ui/skeleton";
import { UnifiedBadge as DataQualityBadge } from "./components/ui/unified-badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GraduationCap } from "lucide-react";

export const EducationImpact = () => {
  const { 
    total, 
    gaza, 
    westBank, 
    primary, 
    secondary, 
    government, 
    unrwa, 
    private: priv, 
    totalStudents, 
    byDistrict, 
    isLoading, 
    error 
  } = useSchoolStatistics();

  const districtData = Object.entries(byDistrict)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Education Sector Overview
              </CardTitle>
              <CardDescription>Schools and student population in Palestine</CardDescription>
            </div>
            <DataQualityBadge
              source="HDX"
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
              Unable to load education data
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Total Schools</div>
                  <div className="text-2xl font-bold mt-1">{total.toLocaleString()}</div>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Total Students</div>
                  <div className="text-2xl font-bold mt-1">{totalStudents.toLocaleString()}</div>
                </div>
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="text-sm text-muted-foreground">West Bank Schools</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{westBank.toLocaleString()}</div>
                </div>
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                  <div className="text-sm text-muted-foreground">Gaza Schools</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{gaza.toLocaleString()}</div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Government</div>
                  <div className="text-xl font-bold">{government.toLocaleString()}</div>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">UNRWA</div>
                  <div className="text-xl font-bold">{unrwa.toLocaleString()}</div>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <div className="text-sm text-muted-foreground">Private</div>
                  <div className="text-xl font-bold">{priv.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <CardTitle>Schools by District</CardTitle>
          <CardDescription>Distribution of schools across all districts</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              Unable to load district data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={districtData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value} />
                <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
                <Legend />
                <Bar dataKey="count" fill="hsl(var(--primary))" name="Number of Schools" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};