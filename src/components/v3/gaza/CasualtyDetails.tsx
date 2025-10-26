import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { EnhancedDataSourceAttribution } from '@/components/v3/shared/EnhancedDataSourceAttribution';
import { QuickHelpIcon, InlineFeedbackLink } from '@/components/v3/shared';
import { DataSource } from '@/types/data.types';

interface CasualtyDetailsProps {
  total: number;
  breakdown: { name: string; value: number; color: string }[];
  description: string;
  dataSources?: DataSource[];
  lastUpdated?: Date;
}

export const CasualtyDetails = ({ 
  total, 
  breakdown, 
  description,
  dataSources = ['tech4palestine', 'goodshepherd'],
  lastUpdated = new Date(),
}: CasualtyDetailsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <p className="text-sm text-muted-foreground">{description}</p>
      <div style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={breakdown} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Data Sources:</span>
          <EnhancedDataSourceAttribution
            sources={dataSources}
            lastUpdated={lastUpdated}
            showQuality={true}
            showFreshness={true}
          />
          <QuickHelpIcon topic="dataSources" size="sm" />
        </div>
        <InlineFeedbackLink 
          metricName="Casualty Breakdown"
          source={dataSources[0]}
          value={total}
        />
      </div>
    </motion.div>
  );
};