/**
 * Enhanced Filter Button Component
 * 
 * Trigger button for the enhanced filter panel with active count badge
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';
import { EnhancedFilterPanel } from './EnhancedFilterPanel';
import { useGlobalStore } from '@/store/globalStore';
import { buttonInteraction, badgeInteraction } from '@/lib/interaction-polish';

interface EnhancedFilterButtonProps {
  className?: string;
}

export const EnhancedFilterButton = ({ className }: EnhancedFilterButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { filters } = useGlobalStore();

  // Calculate active filter count
  const activeFilterCount = 
    (filters.regions?.length || 0) +
    (filters.demographics?.length || 0) +
    (filters.eventTypes?.length || 0) +
    (filters.minCasualties !== undefined ? 1 : 0) +
    (filters.maxCasualties !== undefined ? 1 : 0);

  return (
    <>
      <motion.div {...buttonInteraction}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className={`gap-2 relative ${className}`}
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <motion.div
              {...badgeInteraction}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Badge
                variant="destructive"
                className="ml-1 px-1.5 py-0 h-5 min-w-5 text-xs"
              >
                {activeFilterCount}
              </Badge>
            </motion.div>
          )}
        </Button>
      </motion.div>

      <EnhancedFilterPanel isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};
