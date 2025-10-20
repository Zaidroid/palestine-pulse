import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideIcon } from "lucide-react";

interface Tab {
  value: string;
  label: string;
  icon: LucideIcon;
  color?: string;
}

interface PillTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  isMobile?: boolean;
}

export const PillTabs = ({ tabs, activeTab, onTabChange, isMobile }: PillTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className={cn(
        "h-auto p-1 rounded-full",
        "bg-muted/60 dark:bg-muted/30",
        "gap-1",
        isMobile ? "grid grid-cols-2 w-full" : "inline-flex"
      )}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "relative px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
              "data-[state=active]:text-foreground",
              "hover:text-foreground",
              isMobile ? "flex-col h-16" : "flex-row",
            )}
          >
            <div className="relative z-10 flex items-center gap-2">
                <tab.icon className={cn("h-4 w-4", tab.color)} />
                <span>{tab.label}</span>
            </div>

            {activeTab === tab.value && (
              <motion.div
                layoutId={`active-pill-${isMobile}`}
                className={cn(
                    "absolute inset-0 rounded-full -z-0",
                    "bg-background shadow-md",
                    "dark:bg-muted",
                    "border border-border"
                )}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};