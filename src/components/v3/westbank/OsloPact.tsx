import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const osloData = [
  { name: "Area A", value: 18, color: "hsl(var(--primary))", description: "Full Palestinian Authority civil and security control.", population: "60%" },
  { name: "Area B", value: 22, color: "hsl(var(--secondary))", description: "PA civil control, joint Israeli-PA security control.", population: "20%" },
  { name: "Area C", value: 60, color: "hsl(var(--destructive))", description: "Full Israeli civil and security control.", population: "10%" },
];

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="text-3xl font-bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-sm">
        {`${payload.value}% of West Bank`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={5}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
        cornerRadius={5}
      />
    </g>
  );
};

export const OsloPact = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const activeSegment = osloData[activeIndex];

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle>Oslo II Accord: Area Distribution</CardTitle>
        <CardDescription>Illustrative map of West Bank control areas based on the Oslo II Accord.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="w-full h-80 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted/30 to-transparent rounded-full" />
          <ResponsiveContainer>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={osloData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                dataKey="value"
                onMouseEnter={onPieEnter}
                paddingAngle={5}
              >
                {osloData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} className="outline-none transition-opacity" opacity={index === activeIndex ? 1 : 0.6} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <h3 className="font-bold text-2xl" style={{ color: activeSegment.color }}>
                {activeSegment.name}
              </h3>
              <p className="text-base text-muted-foreground">{activeSegment.description}</p>
              <div className="flex items-baseline p-3 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold" style={{ color: activeSegment.color }}>{activeSegment.population}</p>
                <p className="text-sm text-muted-foreground ml-2">of Palestinian population</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};