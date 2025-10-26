import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle, Building2, Newspaper, TrendingUp, Map, BarChart3, Brain, Menu } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppLayout } from "./components/layout/AppLayout";
import { ExportDialog } from "./components/export/ExportDialog";
import {
  useKilledInGaza,
  usePressKilled,
  useSummary,
  useCasualtiesDaily,
  useWestBankDaily,
  useInfrastructure
} from "@/hooks/useDataFetching";
import { GazaOverview } from "./components/dashboard/GazaOverview";
import { WestBankOverview } from "./components/dashboard/WestBankOverview";
import { GazaHumanitarian } from "./components/dashboard/GazaHumanitarian";
import { GazaInfrastructure } from "./components/dashboard/GazaInfrastructure";
import { WBSettlerViolence } from "./components/dashboard/WBSettlerViolence";
import { WBEconomicSocial } from "./components/dashboard/WBEconomicSocial";
import { CasualtiesTrend } from "./components/dashboard/CasualtiesTrend";
import { InfrastructureDamage } from "./components/dashboard/InfrastructureDamage";
import { PressKilledList } from "./components/dashboard/PressKilledList";
import { ComparativeCharts } from "./components/dashboard/ComparativeCharts";

const Index = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("gaza");
  const [gazaSubTab, setGazaSubTab] = useState("overview");
  const [westBankSubTab, setWestBankSubTab] = useState("overview");
  const [dateRange, setDateRange] = useState("60");

  // Fetch all data
  const { data: killedData, isLoading: killedLoading } = useKilledInGaza();
  const { data: pressData, isLoading: pressLoading } = usePressKilled();
  const { data: summaryData, isLoading: summaryLoading } = useSummary();
  const { data: casualtiesData, isLoading: casualtiesLoading } = useCasualtiesDaily();
  const { data: westBankData, isLoading: westBankLoading } = useWestBankDaily();
  const { data: infrastructureData, isLoading: infrastructureLoading } = useInfrastructure();

  const gazaMetrics = summaryData?.gaza || {};
  const westBankMetrics = summaryData?.west_bank || {};

  return (
    <AppLayout
      showFilters={true}
      showExport={true}
      exportComponent={
        <ExportDialog
          data={{
            casualties: casualtiesData,
            westBank: westBankData,
            infrastructure: infrastructureData,
            press: pressData,
            summary: summaryData
          }}
          dataType="dashboard_data"
        />
      }
    >
      <div className="container mx-auto px-4 py-6">
        {/* Date Range Presets */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-2">{t('timeRange.label')}:</span>
          <Button
            variant={dateRange === "7" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("7")}
          >
            {t('timeRange.last7Days')}
          </Button>
          <Button
            variant={dateRange === "30" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("30")}
          >
            {t('timeRange.lastMonth')}
          </Button>
          <Button
            variant={dateRange === "60" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("60")}
          >
            {t('timeRange.last60Days')}
          </Button>
          <Button
            variant={dateRange === "90" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("90")}
          >
            {t('timeRange.last90Days')}
          </Button>
          <Button
            variant={dateRange === "365" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("365")}
          >
            {t('timeRange.allTime')}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Main Tabs */}
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-muted">
            <TabsTrigger
              value="gaza"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              {t('tabs.gaza')}
            </TabsTrigger>
            <TabsTrigger
              value="westbank"
              className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            >
              <Building2 className="mr-2 h-4 w-4" />
              {t('tabs.westBank')}
            </TabsTrigger>
          </TabsList>

          {/* Gaza Tab with Subtabs */}
          <TabsContent value="gaza" className="space-y-6">
            <Tabs value={gazaSubTab} onValueChange={setGazaSubTab}>
              <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
                <TabsTrigger value="humanitarian">Humanitarian Crisis</TabsTrigger>
                <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <GazaOverview
                  gazaMetrics={gazaMetrics}
                  pressCount={pressData?.length || 0}
                  loading={summaryLoading || pressLoading}
                  casualtiesData={casualtiesData}
                  dateRange={dateRange}
                />
              </TabsContent>

              <TabsContent value="humanitarian" className="mt-6">
                <GazaHumanitarian
                  loading={casualtiesLoading}
                  casualtiesData={casualtiesData}
                  dateRange={dateRange}
                />
              </TabsContent>

              <TabsContent value="infrastructure" className="mt-6">
                <GazaInfrastructure />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* West Bank Tab with Subtabs */}
          <TabsContent value="westbank" className="space-y-6">
            <Tabs value={westBankSubTab} onValueChange={setWestBankSubTab}>
              <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
                <TabsTrigger value="settler-violence">Settler Violence</TabsTrigger>
                <TabsTrigger value="economic-social">Economic & Social</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <WestBankOverview
                  westBankMetrics={westBankMetrics}
                  loading={summaryLoading}
                  westBankData={westBankData}
                  dateRange={dateRange}
                />
              </TabsContent>

              <TabsContent value="settler-violence" className="mt-6">
                <WBSettlerViolence
                  loading={westBankLoading}
                  westBankData={westBankData}
                  dateRange={dateRange}
                />
              </TabsContent>

              <TabsContent value="economic-social" className="mt-6">
                <WBEconomicSocial />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Index;
