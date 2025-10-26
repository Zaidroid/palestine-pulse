import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "./components/ui/card";
import { Skeleton } from "./components/ui/skeleton";
import { UnifiedBadge as DataQualityBadge } from "./components/ui/unified-badge";
import { useEconomicSnapshot, useLatestValue, calculateYoYChange } from "./hooks/useWorldBankData";
import { DollarSign, TrendingUp } from "lucide-react";
import { PopulationDemographics } from "./PopulationDemographics";

export const WBEconomicSocial = () => {
  const { data: economicData, isLoading: economicLoading, error: economicError } = useEconomicSnapshot(2020, 2023);

  return (
    <div className="space-y-8 animate-fade-in">
        <Card className="border-border bg-card/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Economic Impact Overview
                </CardTitle>
                <CardDescription>Key economic indicators for Palestine (World Bank Open Data)</CardDescription>
              </div>
              <DataQualityBadge
                source="World Bank"
                isRealData={!!economicData && Object.keys(economicData).some(key => economicData[key] && economicData[key].length > 0)}
                showDetails={false}
              />
            </div>
          </CardHeader>
          <CardContent>
            {economicLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : economicError ? (
              <div className="text-center py-8 text-muted-foreground">
                Unable to load economic data
              </div>
            ) : economicData ? (
              <div className="space-y-6">
                {/* Key Economic Metrics */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="text-sm text-muted-foreground">GDP (Latest)</div>
                    <div className="text-2xl font-bold mt-1">
                      ${economicData['NY.GDP.MKTP.CD'] && (() => {
                        const val = useLatestValue(economicData['NY.GDP.MKTP.CD'])?.value;
                        if (val && val >= 1e9) return (val / 1e9).toFixed(1) + 'B';
                        if (val && val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
                        return val?.toLocaleString();
                      })() || 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {economicData['NY.GDP.MKTP.CD'] && calculateYoYChange(economicData['NY.GDP.MKTP.CD']) !== null ?
                        `${calculateYoYChange(economicData['NY.GDP.MKTP.CD']) > 0 ? '+' : ''}${calculateYoYChange(economicData['NY.GDP.MKTP.CD'])?.toFixed(1)}% YoY` :
                        'No change data'
                      }
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <div className="text-sm text-muted-foreground">GDP Per Capita</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                      ${economicData['NY.GDP.PCAP.CD'] && useLatestValue(economicData['NY.GDP.PCAP.CD'])?.value?.toLocaleString() || 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      USD per person
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                    <div className="text-sm text-muted-foreground">Unemployment Rate</div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                      {economicData['SL.UEM.TOTL.ZS'] && useLatestValue(economicData['SL.UEM.TOTL.ZS'])?.value?.toFixed(1) || 'N/A'}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {economicData['SL.UEM.TOTL.ZS'] && calculateYoYChange(economicData['SL.UEM.TOTL.ZS']) !== null ?
                        `${calculateYoYChange(economicData['SL.UEM.TOTL.ZS']) > 0 ? '+' : ''}${calculateYoYChange(economicData['SL.UEM.TOTL.ZS'])?.toFixed(1)}% YoY` :
                        'No change data'
                      }
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div className="text-sm text-muted-foreground">Inflation Rate</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                      {economicData['FP.CPI.TOTL.ZG'] && useLatestValue(economicData['FP.CPI.TOTL.ZG'])?.value?.toFixed(1) || 'N/A'}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Consumer prices
                    </div>
                  </div>
                </div>

                {/* Trade Data */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Exports</span>
                    </div>
                    <div className="text-xl font-bold">
                      ${economicData['NE.EXP.GNFS.CD'] && (() => {
                        const val = useLatestValue(economicData['NE.EXP.GNFS.CD'])?.value;
                        if (val && val >= 1e9) return (val / 1e9).toFixed(1) + 'B';
                        if (val && val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
                        return val?.toLocaleString();
                      })() || 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Goods and services
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Imports</span>
                    </div>
                    <div className="text-xl font-bold">
                      ${economicData['NE.IMP.GNFS.CD'] && (() => {
                        const val = useLatestValue(economicData['NE.IMP.GNFS.CD'])?.value;
                        if (val && val >= 1e9) return (val / 1e9).toFixed(1) + 'B';
                        if (val && val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
                        return val?.toLocaleString();
                      })() || 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Goods and services
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No economic data available
              </div>
            )}
          </CardContent>
        </Card>
        <PopulationDemographics />
    </div>
  );
};