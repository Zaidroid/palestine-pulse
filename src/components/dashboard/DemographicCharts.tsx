import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Skeleton } from "./components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Users, TrendingUp } from "lucide-react";

interface DemographicChartsProps {
  killedData: {
    children: number;
    women: number;
    medical: number;
    civil_defence: number;
    press: number;
    total: number;
  };
  injuredData: {
    total: number;
  };
  loading?: boolean;
}

const COLORS = {
  children: "hsl(var(--chart-1))",
  women: "hsl(var(--chart-2))",
  medical: "hsl(var(--chart-3))",
  civil_defence: "hsl(var(--chart-4))",
  press: "hsl(var(--chart-5))",
};

export const DemographicCharts = ({ killedData, injuredData, loading }: DemographicChartsProps) => {
  const pieData = [
    { name: "Children", value: killedData.children, color: COLORS.children },
    { name: "Women", value: killedData.women, color: COLORS.women },
    { name: "Medical", value: killedData.medical, color: COLORS.medical },
    { name: "Civil Defense", value: killedData.civil_defence, color: COLORS.civil_defence },
    { name: "Press", value: killedData.press, color: COLORS.press },
  ];

  const barData = [
    { category: "Children", killed: killedData.children, injured: Math.round(injuredData.total * 0.3) },
    { category: "Women", killed: killedData.women, injured: Math.round(injuredData.total * 0.25) },
    { category: "Medical", killed: killedData.medical, injured: Math.round(injuredData.total * 0.05) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Casualties Distribution
          </CardTitle>
          <CardDescription>Breakdown by demographic groups</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                  }}
                  formatter={(value: number) => value.toLocaleString()}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-destructive" />
            Killed vs Injured
          </CardTitle>
          <CardDescription>Comparison by demographics</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="category" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                  }}
                  formatter={(value: number) => value.toLocaleString()}
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                />
                <Legend />
                <Bar 
                  dataKey="killed" 
                  fill="hsl(var(--destructive))" 
                  name="Killed" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                />
                <Bar 
                  dataKey="injured" 
                  fill="hsl(var(--chart-4))" 
                  name="Injured (Est.)" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};