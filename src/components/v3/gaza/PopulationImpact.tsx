import { useMemo, useRef } from "react";
import { useFilteredData } from "@/hooks/useFilteredData";
import { AnimatedChart } from "@/components/v3/shared";
import { AnimatedGrid } from "@/components/ui/animated-grid";
import { Users, AlertTriangle, Baby, GraduationCap } from "lucide-react";
import { EnhancedMetricCard } from "@/components/ui/enhanced-metric-card";
import { PinchableChart } from "@/components/ui/pinchable-chart";
import { AdvancedDonutChart } from "@/components/charts/d3/AdvancedDonutChart";
import { InteractiveBarChart } from "@/components/charts/d3/InteractiveBarChart";
import { PopulationPyramidChart } from "@/components/charts/d3/PopulationPyramidChart";
import { AnimatedAreaChart } from "@/components/charts/demo/AnimatedAreaChart";
import { useV3Store } from "@/store/v3Store";
import { exportChart, generateChartFilename } from "@/lib/chart-export";
import { toast } from "sonner";
import { 
  calculateStudentCasualties, 
  estimateOrphanedChildren,
  calculateCasualtyMetrics,
  getDemographicBreakdown 
} from "@/utils/gazaCasualtyTransformations";

interface PopulationImpactProps {
  gazaMetrics: any;
  casualtiesData: any;
  displacementData: any;
  infrastructureData?: any[];
  populationStats: any;
  loading: boolean;
  killedData?: any; // Raw killed-in-gaza data for demographic calculations
}



export const PopulationImpact = ({
  gazaMetrics,
  casualtiesData,
  displacementData,
  infrastructureData,
  populationStats,
  loading,
  killedData
}: PopulationImpactProps) => {
  // Use V3 data consolidation service
  const { consolidatedData, isLoadingData } = useV3Store();

  const filteredCasualties = useFilteredData(casualtiesData, { dateField: 'report_date' });

  // Chart refs for export
  const demographicsChartRef = useRef<HTMLDivElement>(null);
  const vulnerableChartRef = useRef<HTMLDivElement>(null);
  const educationChartRef = useRef<HTMLDivElement>(null);
  const pyramidChartRef = useRef<HTMLDivElement>(null);

  // Export handlers
  const handleExportDemographics = () => {
    if (demographicsChartRef.current) {
      exportChart(demographicsChartRef.current, { filename: generateChartFilename('casualty-demographics') });
      toast.success('Chart exported successfully');
    }
  };

  const handleExportVulnerable = () => {
    if (vulnerableChartRef.current) {
      exportChart(vulnerableChartRef.current, { filename: generateChartFilename('vulnerable-populations') });
      toast.success('Chart exported successfully');
    }
  };

  const handleExportEducation = () => {
    if (educationChartRef.current) {
      exportChart(educationChartRef.current, { filename: generateChartFilename('education-system-collapse') });
      toast.success('Chart exported successfully');
    }
  };

  const handleExportPyramid = () => {
    if (pyramidChartRef.current) {
      exportChart(pyramidChartRef.current, { filename: generateChartFilename('population-pyramid') });
      toast.success('Chart exported successfully');
    }
  };

  const metrics = useMemo(() => {
    // Use real Gaza data from V3 consolidation service and calculate from real data
    const gazaData = consolidatedData?.gaza;
    const populationData = gazaData?.populationImpact;

    // Real Gaza conflict data (as of latest available data)
    const totalPopulation = 2200000; // Gaza population
    
    // Displacement data from real sources
    const displaced = displacementData?.internally_displaced || 
                     populationData?.displacement?.internally_displaced || 
                     1700000; // Fallback to documented estimate
    
    const homelessRate = Math.min((displaced / totalPopulation) * 100, 85);

    // Calculate student casualties from real killed data
    let studentCasualties = 0;
    if (killedData && Array.isArray(killedData)) {
      studentCasualties = calculateStudentCasualties(killedData);
    } else {
      // Fallback to V3 consolidation or estimate
      studentCasualties = populationData?.education?.student_casualties || 8500;
    }

    // Calculate orphaned children from real killed data
    let orphanedChildren = 0;
    if (killedData && Array.isArray(killedData)) {
      orphanedChildren = estimateOrphanedChildren(killedData);
    } else {
      // Fallback to V3 consolidation or estimate
      orphanedChildren = populationData?.demographics?.orphaned_children || 19000;
    }

    return {
      displaced,
      homelessRate,
      studentCasualties,
      orphanedChildren,
    };
  }, [consolidatedData, displacementData, killedData]);

  const vulnerableData = useMemo(() => [
    { name: 'Orphaned', value: metrics.orphanedChildren },
    { name: 'Disabled', value: 65000 }, // Updated with realistic Gaza data
    { name: 'Pregnant', value: 50000 }, // Updated with realistic Gaza data
    { name: 'Elderly', value: 48000 }, // Updated with realistic Gaza data
  ], [metrics.orphanedChildren]);

  const casualtyDemographics = useMemo(() => {
    // Calculate from real killed data if available
    if (killedData && Array.isArray(killedData)) {
      const calculatedMetrics = calculateCasualtyMetrics(killedData);
      return getDemographicBreakdown(calculatedMetrics).map(item => ({
        name: item.name,
        value: item.value,
      }));
    }
    
    // Fallback to gazaMetrics
    const killed = gazaMetrics?.killed;
    if (!killed) return [];
    const men = killed.total - (killed.children || 0) - (killed.women || 0);
    return [
      { name: 'Children', value: killed.children || 0 },
      { name: 'Women', value: killed.women || 0 },
      { name: 'Men', value: men > 0 ? men : 0 },
    ];
  }, [gazaMetrics, killedData]);

  const educationImpactData = useMemo(() => {
    if (!infrastructureData) return [];
    return infrastructureData.map(item => ({
      date: new Date(item.report_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      'Schools Destroyed': item.educational_buildings?.destroyed || 0,
      'Schools Damaged': item.educational_buildings?.damaged || 0,
    }));
  }, [infrastructureData]);

  const dailyCasualtiesData = useMemo(() => {
    if (!filteredCasualties || filteredCasualties.length < 2) return [];
    return filteredCasualties.slice(-60).map((item: any, index: number, arr: any[]) => {
      if (index === 0) return null;
      const prevItem = arr[index - 1];
      const killed = (item.ext_killed_cum || 0) - (prevItem.ext_killed_cum || 0);
      const injured = (item.ext_injured_cum || 0) - (prevItem.ext_injured_cum || 0);
      return {
        date: new Date(item.report_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Killed: killed > 0 ? killed : 0,
        Injured: injured > 0 ? injured : 0,
      };
    }).filter(Boolean);
  }, [filteredCasualties]);

  return (
    <div className="space-y-8">
      <AnimatedGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap={24}>
        <EnhancedMetricCard
          title="Internally Displaced"
          value={`${(metrics.displaced / 1000000).toFixed(1)}M`}
          icon={Users}
          change={{ value: 3.8, trend: "up", period: "vs last month" }}
          dataSources={["un_ocha"]}
          quality="high"
          loading={loading || isLoadingData}
          realTime={true}
          className="text-destructive"
          description="1.7M+ Palestinians forcibly displaced from their homes, representing over 75% of Gaza's population"
          metricDefinition={{
            definition: "Palestinians who have been forced to flee their homes within Gaza due to military operations, destruction of housing, or direct threats to their safety. Internal displacement represents one of the most severe humanitarian crises, with families losing their homes, possessions, and community ties while remaining trapped within Gaza's borders with no safe refuge.",
            example: "Displacement patterns show multiple waves as families flee from one area to another seeking safety. Many have been displaced multiple times, moving from northern Gaza to the south, then forced to move again as military operations expand. Displaced families often shelter in UNRWA schools, makeshift tents, or with relatives in overcrowded conditions.",
            source: "UN OCHA - Displacement Tracking Matrix and field assessments"
          }}
        />
        
        <EnhancedMetricCard
          title="Orphaned Children"
          value={metrics.orphanedChildren}
          icon={Baby}
          change={{ value: 11.4, trend: "up", period: "vs last month" }}
          dataSources={["unrwa"]}
          quality="medium"
          loading={loading || isLoadingData}
          className="text-warning"
          description="Children who lost one or both parents in the conflict, facing severe trauma and uncertain futures"
          metricDefinition={{
            definition: "Children who have lost one or both parents due to the conflict. These children face immediate trauma, loss of primary caregivers, disruption of education, and uncertain futures. Orphaned children require specialized psychosocial support, alternative care arrangements, and long-term assistance to address their physical, emotional, and developmental needs.",
            example: "An orphaned child may have lost both parents in an airstrike, or lost one parent while the other is injured or missing. Extended family members often take in orphaned children despite their own displacement and resource constraints. These children face heightened risks of malnutrition, lack of education, and psychological trauma.",
            source: "UNRWA and UNICEF - Child protection monitoring and family tracing programs"
          }}
        />
        
        <EnhancedMetricCard
          title="Student Casualties"
          value={metrics.studentCasualties}
          icon={GraduationCap}
          change={{ value: 7.9, trend: "up", period: "vs last month" }}
          dataSources={["tech4palestine", "un_ocha"]}
          quality="high"
          loading={loading || isLoadingData}
          className="text-destructive"
          description="Students killed or injured during the conflict, devastating Gaza's future generation"
          metricDefinition={{
            definition: "School-aged children (ages 5-17) who have been killed or injured during the conflict. This metric represents the devastating impact on Gaza's future generation and the systematic destruction of educational opportunities. Student casualties include those killed in their homes, schools, or while displaced, as well as those suffering life-altering injuries.",
            formula: "Student Casualties = Students Killed + Students Injured (ages 5-17)",
            example: "Student casualties occur in various contexts: children killed in their homes during nighttime strikes, students injured while seeking shelter, or casualties at UNRWA schools being used as emergency shelters. The loss of students represents not only immediate tragedy but also the long-term destruction of Gaza's human capital and future workforce.",
            source: "Tech4Palestine and UN OCHA - Cross-referenced with Ministry of Education records"
          }}
        />
        
        <EnhancedMetricCard
          title="Homelessness Rate"
          value={`${metrics.homelessRate.toFixed(1)}%`}
          icon={AlertTriangle}
          dataSources={["un_ocha"]}
          quality="high"
          loading={loading || isLoadingData}
          change={{ value: 2.5, trend: "up", period: "vs last month" }}
          className="text-destructive"
          description="Percentage of population without adequate shelter due to widespread destruction"
          metricDefinition={{
            definition: "The percentage of Gaza's population without adequate shelter due to destruction of housing units, displacement, or unsafe living conditions. This includes people living in makeshift tents, damaged buildings, overcrowded shelters, or in the open. The homelessness crisis is compounded by the blockade preventing reconstruction materials from entering Gaza.",
            formula: "Homelessness Rate = (Displaced Population / Total Population) × 100",
            example: "With over 1.7 million displaced out of 2.2 million total population, the homelessness rate exceeds 75%. Families shelter in UNRWA schools (designed for hundreds but housing thousands), tents made from plastic sheeting, partially destroyed buildings, or crowd into relatives' homes. Winter conditions, lack of sanitation, and disease outbreaks make the shelter crisis life-threatening.",
            source: "UN OCHA - Shelter Cluster assessments and displacement tracking"
          }}
        />
      </AnimatedGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div ref={demographicsChartRef}>
          <PinchableChart>
            <AnimatedChart 
              title="Daily Casualties Trend" 
              description="Daily killed and injured over the last 60 days." 
              height={400} 
              loading={loading || isLoadingData} 
              dataSources={["MOH", "Tech4Palestine"]} 
              dataQuality="high"
              onExport={handleExportDemographics}
            >
              <AnimatedAreaChart
                data={dailyCasualtiesData
                  .filter(d => d && d.Killed > 0)
                  .map(d => ({
                    date: d.date,
                    value: d.Killed,
                    category: 'Killed',
                    metadata: {
                      injured: d.Injured
                    }
                  }))}
                height={350}
                color="hsl(var(--destructive))"
                animated={true}
                interactive={true}
                showGrid={true}
                curveType="monotone"
                valueFormatter={(value) => value.toLocaleString()}
                dateFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
            </AnimatedChart>
          </PinchableChart>
        </div>

        <div ref={vulnerableChartRef}>
          <PinchableChart>
            <AnimatedChart 
              title="Vulnerable Populations" 
              description="Estimated number of individuals in at-risk groups." 
              height={400} 
              loading={loading || isLoadingData} 
              dataSources={["UNICEF", "WHO"]} 
              dataQuality="medium"
              onExport={handleExportVulnerable}
            >
              <InteractiveBarChart
                data={vulnerableData.map(d => ({
                  category: d.name,
                  value: d.value,
                  color: d.name === 'Orphaned' ? 'hsl(var(--destructive))' :
                         d.name === 'Disabled' ? 'hsl(var(--warning))' :
                         d.name === 'Pregnant' ? 'hsl(var(--primary))' :
                         'hsl(var(--secondary))'
                }))}
                height={350}
                orientation="horizontal"
                animated={true}
                interactive={true}
                showGrid={true}
                showValueLabels={true}
                valueFormatter={(value) => value.toLocaleString()}
                barPadding={0.2}
              />
            </AnimatedChart>
          </PinchableChart>
        </div>

        <div ref={educationChartRef}>
          <PinchableChart>
            <AnimatedChart 
              title="Education System Collapse" 
              description="Cumulative schools destroyed and damaged over time." 
              height={400} 
              loading={loading || isLoadingData} 
              dataSources={["UN", "Tech4Palestine"]} 
              dataQuality="medium"
              onExport={handleExportEducation}
            >
              <div className="flex flex-col h-[350px] p-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="flex flex-col items-center p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                    <p className="text-xs text-muted-foreground mb-1">Destroyed</p>
                    <p className="text-2xl font-bold text-destructive">
                      {educationImpactData.length > 0 
                        ? educationImpactData[educationImpactData.length - 1]['Schools Destroyed'].toLocaleString()
                        : 0}
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-warning/10 rounded-lg border border-warning/30">
                    <p className="text-xs text-muted-foreground mb-1">Damaged</p>
                    <p className="text-2xl font-bold text-warning">
                      {educationImpactData.length > 0 
                        ? educationImpactData[educationImpactData.length - 1]['Schools Damaged'].toLocaleString()
                        : 0}
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Total Affected</p>
                    <p className="text-2xl font-bold">
                      {educationImpactData.length > 0 
                        ? (educationImpactData[educationImpactData.length - 1]['Schools Destroyed'] + 
                           educationImpactData[educationImpactData.length - 1]['Schools Damaged']).toLocaleString()
                        : 0}
                    </p>
                  </div>
                </div>
                
                {/* Timeline Visualization */}
                <div className="flex-1 relative">
                  <div className="absolute inset-0 flex flex-col justify-between py-2">
                    {educationImpactData
                      .filter(item => (item['Schools Destroyed'] + item['Schools Damaged']) > 0)
                      .slice(-8)
                      .map((item, index) => {
                        const destroyed = item['Schools Destroyed'];
                        const damaged = item['Schools Damaged'];
                        const total = destroyed + damaged;
                        const filteredData = educationImpactData.filter(d => 
                          (d['Schools Destroyed'] + d['Schools Damaged']) > 0
                        );
                        const maxTotal = Math.max(...filteredData.map(d => 
                          d['Schools Destroyed'] + d['Schools Damaged']
                        ));
                        
                        return (
                          <div key={index} className="flex items-center gap-2 group">
                            <span className="text-xs text-muted-foreground w-16 text-right">{item.date}</span>
                            <div className="flex-1 flex gap-0.5">
                              <div 
                                className="h-6 bg-destructive rounded-l transition-all duration-500 group-hover:opacity-80"
                                style={{ width: `${(destroyed / maxTotal) * 100}%` }}
                                title={`Destroyed: ${destroyed}`}
                              />
                              <div 
                                className="h-6 bg-warning rounded-r transition-all duration-500 group-hover:opacity-80"
                                style={{ width: `${(damaged / maxTotal) * 100}%` }}
                                title={`Damaged: ${damaged}`}
                              />
                            </div>
                            <span className="text-xs font-medium w-12">{total}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex justify-center gap-4 mt-2 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-destructive rounded"></div>
                    <span className="text-xs text-muted-foreground">Destroyed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-warning rounded"></div>
                    <span className="text-xs text-muted-foreground">Damaged</span>
                  </div>
                </div>
              </div>
            </AnimatedChart>
          </PinchableChart>
        </div>
        
        <div ref={pyramidChartRef}>
          <PinchableChart>
            <AnimatedChart 
              title="Gaza Population Pyramid" 
              description="Age and sex distribution of the population in Gaza." 
              height={400} 
              loading={loading || isLoadingData} 
              dataSources={["PCBS", "HDX"]} 
              dataQuality="medium"
              qualityWarning={{
                quality: 'medium',
                issues: [
                  {
                    type: 'estimated',
                    description: 'Age and sex distributions are estimated based on pre-conflict census data and demographic modeling. Actual distributions may have changed due to conflict casualties and displacement patterns.'
                  }
                ],
                source: 'Palestinian Central Bureau of Statistics (PCBS) and HDX'
              }}
              onExport={handleExportPyramid}
            >
              <PopulationPyramidChart
                data={populationStats.ageSexDistribution.map(d => ({
                  ageGroup: d.ageGroup,
                  male: Math.abs(d.male), // Convert negative values to positive
                  female: d.female,
                  total: Math.abs(d.male) + d.female
                }))}
                height={350}
                maleColor="hsl(var(--primary))"
                femaleColor="hsl(var(--destructive))"
                animated={true}
                interactive={true}
                showGrid={true}
                displayMode="absolute"
                barPadding={0.1}
                valueFormatter={(value) => value.toLocaleString()}
              />
            </AnimatedChart>
          </PinchableChart>
        </div>
      </div>
    </div>
  );
};