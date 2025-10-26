/**
 * Help Content for Palestine Pulse Dashboard
 * Comprehensive help articles organized by category
 */

import * as React from "react";
import { HelpCategory } from "../components/ui/help-panel";
import {
  BarChart3,
  Database,
  MousePointer,
  HelpCircle,
} from "lucide-react";

/**
 * Understanding the Data
 * Articles explaining data interpretation and context
 */
const understandingTheDataArticles = [
  {
    id: "casualty-data",
    title: "Understanding Casualty Data",
    category: "Understanding the Data",
    tags: ["casualties", "deaths", "statistics"],
    content: (
      <div className="space-y-4">
        <p>
          The casualty data presented in this dashboard comes from multiple verified sources
          including the Palestinian Ministry of Health, UN agencies, and human rights organizations.
        </p>
        
        <h4 className="font-semibold mt-4">What the Numbers Mean</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Total Killed:</strong> Confirmed deaths documented by health authorities
            and verified by multiple sources where possible.
          </li>
          <li>
            <strong>Children & Women:</strong> Demographic breakdowns based on age and gender
            data from health records and family registrations.
          </li>
          <li>
            <strong>Missing:</strong> Individuals reported missing, often trapped under rubble
            or unaccounted for after attacks.
          </li>
        </ul>

        <h4 className="font-semibold mt-4">Data Limitations</h4>
        <p>
          During active conflict, data collection faces significant challenges:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Healthcare infrastructure damage may delay reporting</li>
          <li>Some casualties may be counted multiple times across sources</li>
          <li>Bodies trapped under rubble may not be immediately counted</li>
          <li>Identification of victims can take time</li>
        </ul>

        <h4 className="font-semibold mt-4">How to Interpret Trends</h4>
        <p>
          When viewing casualty trends over time, consider:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Spikes often correspond to major military operations</li>
          <li>Plateaus may indicate reporting delays rather than cessation</li>
          <li>Demographic patterns reveal targeting and impact on civilians</li>
        </ul>
      </div>
    ),
    relatedArticles: ["infrastructure-damage", "data-quality"],
  },
  {
    id: "infrastructure-damage",
    title: "Infrastructure Damage Metrics",
    category: "Understanding the Data",
    tags: ["infrastructure", "buildings", "hospitals", "schools"],
    content: (
      <div className="space-y-4">
        <p>
          Infrastructure damage data tracks the destruction of critical civilian facilities
          including homes, hospitals, schools, and essential services.
        </p>

        <h4 className="font-semibold mt-4">Damage Categories</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Total Destruction:</strong> Buildings completely demolished or structurally
            unsound, requiring full reconstruction.
          </li>
          <li>
            <strong>Severe Damage:</strong> Major structural damage requiring extensive repairs
            before use.
          </li>
          <li>
            <strong>Partial Damage:</strong> Repairable damage that still allows limited use
            or occupation.
          </li>
        </ul>

        <h4 className="font-semibold mt-4">Healthcare Facilities</h4>
        <p>
          Hospital and clinic status is tracked by operational capacity:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Fully Operational:</strong> Normal capacity and services</li>
          <li><strong>Partially Operational:</strong> Limited services due to damage or supply shortages</li>
          <li><strong>Non-Operational:</strong> Closed due to damage, lack of supplies, or evacuation orders</li>
        </ul>

        <h4 className="font-semibold mt-4">Educational Facilities</h4>
        <p>
          School damage affects education access for hundreds of thousands of children.
          Many damaged schools also serve as shelters for displaced families.
        </p>
      </div>
    ),
    relatedArticles: ["casualty-data", "displacement-data"],
  },
  {
    id: "displacement-data",
    title: "Displacement and Population Data",
    category: "Understanding the Data",
    tags: ["displacement", "refugees", "IDPs", "population"],
    content: (
      <div className="space-y-4">
        <p>
          Displacement data tracks the movement of populations forced to flee their homes
          due to conflict, destruction, or evacuation orders.
        </p>

        <h4 className="font-semibold mt-4">Types of Displacement</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Internally Displaced Persons (IDPs):</strong> People forced to move within
            Gaza or the West Bank but remaining in Palestinian territories.
          </li>
          <li>
            <strong>Multiple Displacement:</strong> Many families have been displaced multiple
            times as conflict zones shift.
          </li>
          <li>
            <strong>Shelter Status:</strong> Displaced persons may be in UNRWA shelters, with
            host families, or in makeshift accommodations.
          </li>
        </ul>

        <h4 className="font-semibold mt-4">Population Impact</h4>
        <p>
          Understanding the scale of displacement requires context:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Gaza's pre-conflict population was approximately 2.3 million</li>
          <li>Displacement rates show what percentage of the population has been forced to move</li>
          <li>Homelessness rates indicate those who have lost their homes permanently</li>
        </ul>

        <h4 className="font-semibold mt-4">Humanitarian Implications</h4>
        <p>
          Mass displacement creates cascading humanitarian needs including shelter, food,
          water, sanitation, and healthcare access. Overcrowding in shelters increases
          disease risk and strains limited resources.
        </p>
      </div>
    ),
    relatedArticles: ["humanitarian-crisis", "infrastructure-damage"],
  },
  {
    id: "humanitarian-crisis",
    title: "Humanitarian Crisis Indicators",
    category: "Understanding the Data",
    tags: ["humanitarian", "food security", "aid", "IPC"],
    content: (
      <div className="space-y-4">
        <p>
          Humanitarian indicators measure the severity of the crisis and population needs
          across multiple dimensions including food security, water access, and healthcare.
        </p>

        <h4 className="font-semibold mt-4">Food Security (IPC Phases)</h4>
        <p>
          The Integrated Food Security Phase Classification (IPC) uses a 5-phase scale:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Phase 1 - Minimal:</strong> Food secure</li>
          <li><strong>Phase 2 - Stressed:</strong> Mild food insecurity</li>
          <li><strong>Phase 3 - Crisis:</strong> Acute food insecurity</li>
          <li><strong>Phase 4 - Emergency:</strong> Severe food insecurity</li>
          <li><strong>Phase 5 - Catastrophe/Famine:</strong> Extreme food insecurity with starvation and death</li>
        </ul>

        <h4 className="font-semibold mt-4">Aid Access</h4>
        <p>
          Aid delivery metrics track:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Number of aid trucks entering per day</li>
          <li>Percentage of population reached by aid</li>
          <li>Types of aid delivered (food, medical, shelter)</li>
          <li>Access restrictions and delays</li>
        </ul>

        <h4 className="font-semibold mt-4">Critical Thresholds</h4>
        <p>
          Pre-conflict, Gaza received approximately 500 trucks of goods daily. Current
          aid levels represent a fraction of normal needs, let alone crisis needs.
        </p>
      </div>
    ),
    relatedArticles: ["displacement-data", "data-sources"],
  },
];

/**
 * Data Sources & Methodology
 * Articles about data collection, verification, and quality
 */
const dataSourcesArticles = [
  {
    id: "data-sources",
    title: "Primary Data Sources",
    category: "Data Sources & Methodology",
    tags: ["sources", "verification", "methodology"],
    content: (
      <div className="space-y-4">
        <p>
          This dashboard aggregates data from multiple verified and authoritative sources
          to provide comprehensive coverage of the humanitarian situation.
        </p>

        <h4 className="font-semibold mt-4">Key Data Sources</h4>
        
        <div className="space-y-3">
          <div className="p-3 border rounded-lg">
            <h5 className="font-semibold">Palestinian Ministry of Health</h5>
            <p className="text-sm text-muted-foreground mt-1">
              Primary source for casualty data, hospital status, and healthcare infrastructure.
              Data is collected from hospitals, morgues, and field reports.
            </p>
          </div>

          <div className="p-3 border rounded-lg">
            <h5 className="font-semibold">United Nations OCHA</h5>
            <p className="text-sm text-muted-foreground mt-1">
              UN Office for the Coordination of Humanitarian Affairs provides displacement
              data, humanitarian needs assessments, and infrastructure damage reports.
            </p>
          </div>

          <div className="p-3 border rounded-lg">
            <h5 className="font-semibold">World Food Programme (WFP)</h5>
            <p className="text-sm text-muted-foreground mt-1">
              Food security assessments, IPC classifications, and aid delivery tracking.
            </p>
          </div>

          <div className="p-3 border rounded-lg">
            <h5 className="font-semibold">B'Tselem</h5>
            <p className="text-sm text-muted-foreground mt-1">
              Israeli human rights organization documenting violations, settlements,
              and checkpoints in the West Bank.
            </p>
          </div>

          <div className="p-3 border rounded-lg">
            <h5 className="font-semibold">World Bank</h5>
            <p className="text-sm text-muted-foreground mt-1">
              Economic indicators, poverty rates, and development metrics for Palestinian
              territories.
            </p>
          </div>
        </div>

        <h4 className="font-semibold mt-4">Data Verification</h4>
        <p>
          Where possible, data points are cross-referenced across multiple sources to
          ensure accuracy. Discrepancies are noted in data quality indicators.
        </p>
      </div>
    ),
    relatedArticles: ["data-quality", "data-updates"],
  },
  {
    id: "data-quality",
    title: "Data Quality Indicators",
    category: "Data Sources & Methodology",
    tags: ["quality", "reliability", "verification"],
    content: (
      <div className="space-y-4">
        <p>
          Data quality indicators help you understand the reliability and completeness
          of the information presented.
        </p>

        <h4 className="font-semibold mt-4">Quality Levels</h4>
        
        <div className="space-y-3">
          <div className="p-3 border border-green-500/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <h5 className="font-semibold">High Quality</h5>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Data verified by multiple authoritative sources, recently updated, and
              collected through established methodologies.
            </p>
          </div>

          <div className="p-3 border border-yellow-500/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <h5 className="font-semibold">Medium Quality</h5>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Data from reliable sources but may have delays, limited verification,
              or known gaps in coverage.
            </p>
          </div>

          <div className="p-3 border border-orange-500/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
              <h5 className="font-semibold">Low Quality</h5>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Estimated data, significant delays, single source, or known data collection
              challenges. Use with caution and context.
            </p>
          </div>
        </div>

        <h4 className="font-semibold mt-4">Freshness Indicators</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Green:</strong> Updated within the last hour</li>
          <li><strong>Yellow:</strong> Updated within the last 24 hours</li>
          <li><strong>Red (pulsing):</strong> Data is stale (over 24 hours old)</li>
        </ul>

        <h4 className="font-semibold mt-4">When to Exercise Caution</h4>
        <p>
          Be especially careful interpreting data marked as low quality or with stale
          freshness indicators. During active conflict, data collection systems may
          be disrupted, leading to delays or gaps.
        </p>
      </div>
    ),
    relatedArticles: ["data-sources", "casualty-data"],
  },
  {
    id: "data-updates",
    title: "How Data is Updated",
    category: "Data Sources & Methodology",
    tags: ["updates", "refresh", "real-time"],
    content: (
      <div className="space-y-4">
        <p>
          Understanding how and when data is updated helps you interpret the information
          and know when to check back for new information.
        </p>

        <h4 className="font-semibold mt-4">Update Frequencies</h4>
        <p>
          Different data types update at different intervals:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Casualty Data:</strong> Updated multiple times daily as reports are
            verified by health authorities.
          </li>
          <li>
            <strong>Infrastructure Damage:</strong> Updated daily or when new assessments
            are completed.
          </li>
          <li>
            <strong>Displacement Figures:</strong> Updated every 1-3 days based on UNRWA
            and OCHA reports.
          </li>
          <li>
            <strong>Food Security:</strong> Updated weekly or when new IPC assessments
            are released.
          </li>
          <li>
            <strong>Economic Indicators:</strong> Updated monthly or quarterly based on
            World Bank and Palestinian Authority reports.
          </li>
        </ul>

        <h4 className="font-semibold mt-4">Auto-Refresh</h4>
        <p>
          The dashboard automatically checks for new data every 30 minutes. You can see
          the countdown to the next refresh in the footer. Click the refresh button to
          manually update data at any time.
        </p>

        <h4 className="font-semibold mt-4">Real-Time Indicators</h4>
        <p>
          Metrics marked with a pulsing indicator are considered "real-time" and may
          update more frequently. These typically include casualty counts and aid
          delivery tracking.
        </p>

        <h4 className="font-semibold mt-4">Data Lag</h4>
        <p>
          There is always some lag between events and data reporting. During intense
          periods of conflict, this lag may increase due to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Communication infrastructure damage</li>
          <li>Healthcare system overload</li>
          <li>Verification processes</li>
          <li>Safety concerns for data collectors</li>
        </ul>
      </div>
    ),
    relatedArticles: ["data-quality", "data-sources"],
  },
  {
    id: "methodology",
    title: "Data Collection Methodology",
    category: "Data Sources & Methodology",
    tags: ["methodology", "collection", "verification"],
    content: (
      <div className="space-y-4">
        <p>
          Understanding how data is collected helps interpret its meaning and limitations.
        </p>

        <h4 className="font-semibold mt-4">Casualty Data Collection</h4>
        <p>
          Casualty figures are compiled through:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Hospital admissions and morgue records</li>
          <li>Civil registry death certificates</li>
          <li>Family reports to authorities</li>
          <li>Field documentation by humanitarian organizations</li>
          <li>Cross-verification between multiple sources</li>
        </ul>

        <h4 className="font-semibold mt-4">Infrastructure Assessment</h4>
        <p>
          Damage assessments use:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Satellite imagery analysis</li>
          <li>On-ground surveys by UN and humanitarian teams</li>
          <li>Reports from facility operators (hospitals, schools)</li>
          <li>Engineering assessments of structural integrity</li>
        </ul>

        <h4 className="font-semibold mt-4">Humanitarian Needs Assessment</h4>
        <p>
          Food security and humanitarian needs are assessed through:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Household surveys and interviews</li>
          <li>Market monitoring and price tracking</li>
          <li>Aid distribution records</li>
          <li>Healthcare facility reports</li>
          <li>IPC technical working group analysis</li>
        </ul>

        <h4 className="font-semibold mt-4">Limitations and Challenges</h4>
        <p>
          All data collection in conflict zones faces challenges:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Access restrictions limit survey coverage</li>
          <li>Security concerns affect data collector safety</li>
          <li>Infrastructure damage disrupts communication</li>
          <li>Population movement makes tracking difficult</li>
          <li>Resource constraints limit assessment frequency</li>
        </ul>
      </div>
    ),
    relatedArticles: ["data-sources", "data-quality"],
  },
];

/**
 * How to Use the Dashboard
 * Articles about dashboard features and interactions
 */
const howToUseArticles = [
  {
    id: "navigation",
    title: "Navigating the Dashboard",
    category: "How to Use the Dashboard",
    tags: ["navigation", "tabs", "sections"],
    content: (
      <div className="space-y-4">
        <p>
          The dashboard is organized into two main regions (Gaza and West Bank) with
          multiple thematic sections in each.
        </p>

        <h4 className="font-semibold mt-4">Main Navigation</h4>
        <p>
          Use the main tabs at the top to switch between:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Gaza War Dashboard:</strong> Data on the conflict in Gaza</li>
          <li><strong>West Bank Dashboard:</strong> Data on occupation and violence in the West Bank</li>
        </ul>

        <h4 className="font-semibold mt-4">Section Tabs</h4>
        <p>
          Within each dashboard, use the section tabs to view different aspects:
        </p>
        
        <div className="space-y-2 mt-2">
          <div className="p-2 border rounded">
            <strong>Gaza Sections:</strong>
            <ul className="text-sm text-muted-foreground mt-1 space-y-1">
              <li>• Humanitarian Crisis - Casualties and human impact</li>
              <li>• Infrastructure - Damage to buildings and facilities</li>
              <li>• Population Impact - Displacement and demographics</li>
              <li>• Aid & Survival - Food security and humanitarian aid</li>
            </ul>
          </div>

          <div className="p-2 border rounded">
            <strong>West Bank Sections:</strong>
            <ul className="text-sm text-muted-foreground mt-1 space-y-1">
              <li>• Occupation Metrics - Settlements and checkpoints</li>
              <li>• Prisoners & Detention - Arrests and detentions</li>
              <li>• Economic Strangulation - Economic impact</li>
            </ul>
          </div>
        </div>

        <h4 className="font-semibold mt-4">Mobile Navigation</h4>
        <p>
          On mobile devices:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Swipe left/right to switch between section tabs</li>
          <li>Use the menu icon to access additional options</li>
          <li>Pull down to refresh data</li>
        </ul>

        <h4 className="font-semibold mt-4">Breadcrumbs</h4>
        <p>
          The breadcrumb trail at the top shows your current location and allows quick
          navigation back to previous sections.
        </p>
      </div>
    ),
    relatedArticles: ["interacting-charts", "filtering-data"],
  },
  {
    id: "interacting-charts",
    title: "Interacting with Charts",
    category: "How to Use the Dashboard",
    tags: ["charts", "graphs", "visualization", "interaction"],
    content: (
      <div className="space-y-4">
        <p>
          Charts and visualizations are interactive, allowing you to explore data in detail.
        </p>

        <h4 className="font-semibold mt-4">Hover for Details</h4>
        <p>
          Hover your mouse over any chart element to see detailed information:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Exact values for data points</li>
          <li>Dates and time periods</li>
          <li>Percentage changes and trends</li>
          <li>Comparative information</li>
        </ul>

        <h4 className="font-semibold mt-4">Chart Types</h4>
        
        <div className="space-y-2">
          <div className="p-2 border rounded">
            <strong>Line Charts:</strong>
            <p className="text-sm text-muted-foreground mt-1">
              Show trends over time. Hover to see values at specific dates.
            </p>
          </div>

          <div className="p-2 border rounded">
            <strong>Bar Charts:</strong>
            <p className="text-sm text-muted-foreground mt-1">
              Compare values across categories. Click bars for more details.
            </p>
          </div>

          <div className="p-2 border rounded">
            <strong>Area Charts:</strong>
            <p className="text-sm text-muted-foreground mt-1">
              Show cumulative totals or proportions over time.
            </p>
          </div>

          <div className="p-2 border rounded">
            <strong>Heatmaps:</strong>
            <p className="text-sm text-muted-foreground mt-1">
              Display intensity of values across two dimensions using color.
            </p>
          </div>
        </div>

        <h4 className="font-semibold mt-4">Mobile Interactions</h4>
        <p>
          On touch devices:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Tap chart elements to see details</li>
          <li>Pinch to zoom in/out on charts</li>
          <li>Drag to pan across large charts</li>
          <li>Long-press for additional options</li>
        </ul>

        <h4 className="font-semibold mt-4">Legend Interaction</h4>
        <p>
          Click legend items to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Show/hide specific data series</li>
          <li>Focus on particular metrics</li>
          <li>Compare subsets of data</li>
        </ul>
      </div>
    ),
    relatedArticles: ["exporting-data", "navigation"],
  },
  {
    id: "metric-cards",
    title: "Understanding Metric Cards",
    category: "How to Use the Dashboard",
    tags: ["metrics", "cards", "statistics"],
    content: (
      <div className="space-y-4">
        <p>
          Metric cards display key statistics with visual indicators and trends.
        </p>

        <h4 className="font-semibold mt-4">Card Components</h4>
        
        <div className="space-y-2">
          <div className="p-2 border rounded">
            <strong>Main Value:</strong>
            <p className="text-sm text-muted-foreground mt-1">
              The large number shows the current or total value for the metric.
              Numbers animate when the page loads or data updates.
            </p>
          </div>

          <div className="p-2 border rounded">
            <strong>Trend Indicator:</strong>
            <p className="text-sm text-muted-foreground mt-1">
              Arrows and percentages show how the value has changed over time.
              ↑ indicates increase, ↓ indicates decrease.
            </p>
          </div>

          <div className="p-2 border rounded">
            <strong>Sparkline:</strong>
            <p className="text-sm text-muted-foreground mt-1">
              Small line chart shows the trend over recent time periods at a glance.
            </p>
          </div>

          <div className="p-2 border rounded">
            <strong>Data Source Badge:</strong>
            <p className="text-sm text-muted-foreground mt-1">
              Shows where the data comes from and its quality level. Hover for details.
            </p>
          </div>
        </div>

        <h4 className="font-semibold mt-4">Real-Time Indicators</h4>
        <p>
          Cards with a pulsing dot indicator contain data that updates frequently.
          The timestamp shows when the data was last updated.
        </p>

        <h4 className="font-semibold mt-4">Expandable Cards</h4>
        <p>
          Some metric cards can be clicked to expand and show:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Detailed breakdowns and subcategories</li>
          <li>Historical trends and patterns</li>
          <li>Methodology and calculation details</li>
          <li>Related metrics and context</li>
        </ul>

        <h4 className="font-semibold mt-4">Contextual Help</h4>
        <p>
          Hover over the info icon (ⓘ) on any metric card to see:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>What the metric measures</li>
          <li>How it's calculated</li>
          <li>Why it matters</li>
          <li>Important context for interpretation</li>
        </ul>
      </div>
    ),
    relatedArticles: ["interacting-charts", "data-quality"],
  },
  {
    id: "filtering-data",
    title: "Filtering and Customizing Views",
    category: "How to Use the Dashboard",
    tags: ["filters", "date range", "customization"],
    content: (
      <div className="space-y-4">
        <p>
          Use filters to focus on specific time periods, regions, or data subsets.
        </p>

        <h4 className="font-semibold mt-4">Opening the Filter Panel</h4>
        <p>
          Click the filter icon in the top navigation bar to open the filter panel.
          On mobile, this opens as a full-screen overlay.
        </p>

        <h4 className="font-semibold mt-4">Date Range Filters</h4>
        <p>
          Select custom date ranges to view data for specific periods:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Use the calendar picker for custom ranges</li>
          <li>Choose from presets (Last 7 days, Last 30 days, etc.)</li>
          <li>Compare different time periods</li>
        </ul>

        <h4 className="font-semibold mt-4">Category Filters</h4>
        <p>
          Filter by specific categories such as:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Age groups (children, adults, elderly)</li>
          <li>Gender demographics</li>
          <li>Geographic regions</li>
          <li>Incident types</li>
        </ul>

        <h4 className="font-semibold mt-4">Active Filters</h4>
        <p>
          Active filters are shown as chips below the navigation. Click the X on any
          chip to remove that filter. Use "Clear All" to reset all filters.
        </p>

        <h4 className="font-semibold mt-4">Saving Filter Presets</h4>
        <p>
          Your filter selections are saved in your browser, so they persist when you
          return to the dashboard.
        </p>
      </div>
    ),
    relatedArticles: ["navigation", "exporting-data"],
  },
  {
    id: "exporting-data",
    title: "Exporting and Sharing Data",
    category: "How to Use the Dashboard",
    tags: ["export", "share", "download", "CSV", "PNG"],
    content: (
      <div className="space-y-4">
        <p>
          Export charts and data for use in reports, presentations, or further analysis.
        </p>

        <h4 className="font-semibold mt-4">Exporting Charts</h4>
        <p>
          Click the export icon on any chart to download it:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>PNG:</strong> High-resolution image for presentations and documents</li>
          <li><strong>SVG:</strong> Vector format for editing in design software</li>
          <li><strong>PDF:</strong> Print-ready format with metadata</li>
        </ul>

        <h4 className="font-semibold mt-4">Exporting Data</h4>
        <p>
          Export the underlying data in various formats:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>CSV:</strong> Spreadsheet format for Excel or Google Sheets</li>
          <li><strong>JSON:</strong> Structured data for developers and analysis tools</li>
          <li><strong>Copy to Clipboard:</strong> Quick copy for pasting into documents</li>
        </ul>

        <h4 className="font-semibold mt-4">Sharing Views</h4>
        <p>
          Share specific dashboard views with others:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Click the share button to generate a shareable URL</li>
          <li>The URL includes your current filters and view settings</li>
          <li>Use native share on mobile to share via apps</li>
        </ul>

        <h4 className="font-semibold mt-4">Export Quality Settings</h4>
        <p>
          When exporting images:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Choose resolution (1x, 2x, or 4x for high-DPI displays)</li>
          <li>Select light or dark theme</li>
          <li>Include or exclude data source attribution</li>
          <li>Customize filename</li>
        </ul>

        <h4 className="font-semibold mt-4">Attribution</h4>
        <p>
          When using exported data or charts, please include attribution to the
          original data sources. Export files include source information in metadata.
        </p>
      </div>
    ),
    relatedArticles: ["data-sources", "interacting-charts"],
  },
  {
    id: "accessibility",
    title: "Accessibility Features",
    category: "How to Use the Dashboard",
    tags: ["accessibility", "keyboard", "screen reader", "a11y"],
    content: (
      <div className="space-y-4">
        <p>
          The dashboard is designed to be accessible to all users, including those
          using assistive technologies.
        </p>

        <h4 className="font-semibold mt-4">Keyboard Navigation</h4>
        <p>
          Navigate the entire dashboard using only your keyboard:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Tab:</strong> Move forward through interactive elements</li>
          <li><strong>Shift + Tab:</strong> Move backward</li>
          <li><strong>Enter/Space:</strong> Activate buttons and links</li>
          <li><strong>Escape:</strong> Close modals and panels</li>
          <li><strong>Arrow keys:</strong> Navigate within menus and charts</li>
        </ul>

        <h4 className="font-semibold mt-4">Screen Reader Support</h4>
        <p>
          The dashboard works with popular screen readers:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>All interactive elements have descriptive labels</li>
          <li>Charts include text descriptions of trends</li>
          <li>Data tables are properly structured</li>
          <li>Dynamic updates are announced</li>
        </ul>

        <h4 className="font-semibold mt-4">Visual Accessibility</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>High Contrast:</strong> All text meets WCAG AA standards</li>
          <li><strong>Color Independence:</strong> Information isn't conveyed by color alone</li>
          <li><strong>Resizable Text:</strong> Zoom up to 200% without loss of functionality</li>
          <li><strong>Dark Mode:</strong> Reduces eye strain in low-light conditions</li>
        </ul>

        <h4 className="font-semibold mt-4">Reduced Motion</h4>
        <p>
          If you have motion sensitivity:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Enable "Reduce Motion" in your system settings</li>
          <li>The dashboard will automatically disable decorative animations</li>
          <li>Essential animations (loading, progress) remain for functionality</li>
        </ul>

        <h4 className="font-semibold mt-4">Focus Indicators</h4>
        <p>
          Clear visual indicators show which element has keyboard focus, making
          navigation easier for keyboard users.
        </p>
      </div>
    ),
    relatedArticles: ["navigation", "interacting-charts"],
  },
];

/**
 * Frequently Asked Questions
 * Common questions and answers
 */
const faqArticles = [
  {
    id: "data-accuracy",
    title: "How accurate is the data?",
    category: "Frequently Asked Questions",
    tags: ["accuracy", "reliability", "verification"],
    content: (
      <div className="space-y-4">
        <p>
          Data accuracy varies by source and type, which is why we provide quality
          indicators for each metric.
        </p>

        <h4 className="font-semibold mt-4">High-Confidence Data</h4>
        <p>
          Data marked as "high quality" comes from established sources with robust
          verification processes:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Palestinian Ministry of Health casualty data is verified through hospital records</li>
          <li>UN OCHA displacement figures are based on shelter registrations</li>
          <li>Infrastructure damage is confirmed through satellite imagery and ground surveys</li>
        </ul>

        <h4 className="font-semibold mt-4">Known Limitations</h4>
        <p>
          During active conflict, several factors affect data accuracy:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Reporting delays due to infrastructure damage</li>
          <li>Access restrictions limiting survey coverage</li>
          <li>Ongoing verification processes for recent events</li>
          <li>Potential for duplicate counting across sources</li>
        </ul>

        <h4 className="font-semibold mt-4">Cross-Verification</h4>
        <p>
          Where possible, we cross-reference data across multiple sources. When sources
          disagree significantly, we note this in the data quality indicators and provide
          ranges rather than single figures.
        </p>

        <h4 className="font-semibold mt-4">Conservative Estimates</h4>
        <p>
          Official figures often represent confirmed cases only. Actual numbers may be
          higher, particularly for:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Casualties trapped under rubble</li>
          <li>Indirect deaths from lack of healthcare</li>
          <li>Unreported displacement</li>
          <li>Hidden infrastructure damage</li>
        </ul>
      </div>
    ),
    relatedArticles: ["data-quality", "data-sources"],
  },
  {
    id: "update-frequency",
    title: "How often is data updated?",
    category: "Frequently Asked Questions",
    tags: ["updates", "frequency", "refresh"],
    content: (
      <div className="space-y-4">
        <p>
          Update frequency varies by data type and source availability.
        </p>

        <h4 className="font-semibold mt-4">Real-Time Data</h4>
        <p>
          Some metrics update multiple times per day:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Casualty counts (as reports are verified)</li>
          <li>Aid delivery tracking</li>
          <li>Hospital operational status</li>
        </ul>

        <h4 className="font-semibold mt-4">Daily Updates</h4>
        <p>
          Most humanitarian indicators update daily:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Displacement figures</li>
          <li>Infrastructure damage assessments</li>
          <li>Shelter occupancy</li>
        </ul>

        <h4 className="font-semibold mt-4">Weekly/Monthly Updates</h4>
        <p>
          Some data updates less frequently:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Food security assessments (weekly)</li>
          <li>Economic indicators (monthly)</li>
          <li>Comprehensive needs assessments (as available)</li>
        </ul>

        <h4 className="font-semibold mt-4">Auto-Refresh</h4>
        <p>
          The dashboard automatically checks for new data every 30 minutes. You can
          also manually refresh at any time using the refresh button in the footer.
        </p>

        <h4 className="font-semibold mt-4">Last Updated</h4>
        <p>
          Each metric card shows when that specific data was last updated. Hover over
          the data source badge for detailed timestamp information.
        </p>
      </div>
    ),
    relatedArticles: ["data-updates", "data-sources"],
  },
  {
    id: "missing-data",
    title: "Why is some data missing or incomplete?",
    category: "Frequently Asked Questions",
    tags: ["missing data", "gaps", "incomplete"],
    content: (
      <div className="space-y-4">
        <p>
          Data gaps occur for various reasons, particularly during active conflict.
        </p>

        <h4 className="font-semibold mt-4">Access Restrictions</h4>
        <p>
          Conflict zones often have limited access for data collectors:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Security concerns prevent field surveys</li>
          <li>Checkpoints and closures limit movement</li>
          <li>Some areas are completely inaccessible</li>
          <li>Evacuation orders displace data collection teams</li>
        </ul>

        <h4 className="font-semibold mt-4">Infrastructure Damage</h4>
        <p>
          Damaged infrastructure affects data collection:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Communication networks may be down</li>
          <li>Healthcare facilities unable to report</li>
          <li>Administrative systems disrupted</li>
          <li>Power outages prevent digital reporting</li>
        </ul>

        <h4 className="font-semibold mt-4">Verification Delays</h4>
        <p>
          Responsible reporting requires verification:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Cross-checking reports takes time</li>
          <li>Identifying victims requires investigation</li>
          <li>Damage assessments need expert evaluation</li>
          <li>Sources may provide conflicting information</li>
        </ul>

        <h4 className="font-semibold mt-4">Resource Constraints</h4>
        <p>
          Limited resources affect data collection:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Humanitarian organizations are overwhelmed</li>
          <li>Staff shortages limit survey capacity</li>
          <li>Funding gaps reduce monitoring programs</li>
          <li>Priorities focus on immediate humanitarian response</li>
        </ul>

        <h4 className="font-semibold mt-4">What We Do</h4>
        <p>
          When data is missing or incomplete:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>We clearly mark data quality as "low" or "medium"</li>
          <li>We provide context about known gaps</li>
          <li>We use estimates only when clearly labeled</li>
          <li>We update as soon as better data becomes available</li>
        </ul>
      </div>
    ),
    relatedArticles: ["data-quality", "methodology"],
  },
  {
    id: "compare-sources",
    title: "Why do different sources show different numbers?",
    category: "Frequently Asked Questions",
    tags: ["discrepancies", "sources", "differences"],
    content: (
      <div className="space-y-4">
        <p>
          Discrepancies between sources are common and don't necessarily indicate
          inaccuracy. Understanding why helps interpret the data correctly.
        </p>

        <h4 className="font-semibold mt-4">Different Methodologies</h4>
        <p>
          Sources may use different counting methods:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Some count only confirmed deaths, others include missing</li>
          <li>Different criteria for "displaced" or "damaged"</li>
          <li>Varying geographic boundaries or time periods</li>
          <li>Different levels of verification required</li>
        </ul>

        <h4 className="font-semibold mt-4">Timing Differences</h4>
        <p>
          Updates happen at different times:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Sources publish updates on different schedules</li>
          <li>Verification processes take varying amounts of time</li>
          <li>Some sources are more conservative, waiting for full confirmation</li>
          <li>Others provide preliminary figures that are later revised</li>
        </ul>

        <h4 className="font-semibold mt-4">Scope Differences</h4>
        <p>
          Sources may measure different things:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Direct vs. indirect casualties</li>
          <li>Immediate vs. cumulative damage</li>
          <li>Different geographic coverage</li>
          <li>Inclusion or exclusion of specific categories</li>
        </ul>

        <h4 className="font-semibold mt-4">Our Approach</h4>
        <p>
          When sources disagree:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>We prioritize the most authoritative source for each metric</li>
          <li>We note significant discrepancies in data quality indicators</li>
          <li>We provide ranges when appropriate</li>
          <li>We explain methodology differences in tooltips</li>
        </ul>

        <h4 className="font-semibold mt-4">What This Means</h4>
        <p>
          Small discrepancies (5-10%) are normal and expected. Large discrepancies
          warrant caution and additional context. Always check the data source badge
          and quality indicators for more information.
        </p>
      </div>
    ),
    relatedArticles: ["data-sources", "data-accuracy"],
  },
  {
    id: "mobile-usage",
    title: "Can I use this dashboard on mobile?",
    category: "Frequently Asked Questions",
    tags: ["mobile", "responsive", "touch"],
    content: (
      <div className="space-y-4">
        <p>
          Yes! The dashboard is fully optimized for mobile devices with touch-friendly
          interactions.
        </p>

        <h4 className="font-semibold mt-4">Mobile Features</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Responsive Layout:</strong> Automatically adapts to your screen size</li>
          <li><strong>Touch Gestures:</strong> Swipe, pinch, and tap to interact</li>
          <li><strong>Pull to Refresh:</strong> Pull down to update data</li>
          <li><strong>Optimized Charts:</strong> Charts sized appropriately for mobile screens</li>
        </ul>

        <h4 className="font-semibold mt-4">Touch Gestures</h4>
        <p>
          Mobile-specific interactions:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Swipe:</strong> Swipe left/right to switch between tabs</li>
          <li><strong>Pinch:</strong> Pinch to zoom in/out on charts</li>
          <li><strong>Tap:</strong> Tap chart elements for details</li>
          <li><strong>Long Press:</strong> Long press for additional options</li>
          <li><strong>Pull Down:</strong> Pull down to refresh data</li>
        </ul>

        <h4 className="font-semibold mt-4">Mobile Navigation</h4>
        <p>
          Navigation is simplified on mobile:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Hamburger menu for main navigation</li>
          <li>Swipeable tabs for sections</li>
          <li>Full-screen filter panel</li>
          <li>Bottom navigation for quick access</li>
        </ul>

        <h4 className="font-semibold mt-4">Performance</h4>
        <p>
          The mobile experience is optimized for performance:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Lazy loading of images and charts</li>
          <li>Reduced animations on slower devices</li>
          <li>Efficient data loading</li>
          <li>Offline capability for cached data</li>
        </ul>

        <h4 className="font-semibold mt-4">Best Experience</h4>
        <p>
          For the best mobile experience:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Use landscape mode for charts</li>
          <li>Enable JavaScript</li>
          <li>Use a modern browser (Chrome, Safari, Firefox)</li>
          <li>Ensure stable internet connection for real-time updates</li>
        </ul>
      </div>
    ),
    relatedArticles: ["navigation", "interacting-charts", "accessibility"],
  },
  {
    id: "data-usage",
    title: "Can I use this data in my research or reporting?",
    category: "Frequently Asked Questions",
    tags: ["usage", "attribution", "citation", "research"],
    content: (
      <div className="space-y-4">
        <p>
          Yes, the data is available for research, reporting, and educational purposes
          with proper attribution.
        </p>

        <h4 className="font-semibold mt-4">Usage Rights</h4>
        <p>
          You may use the data and visualizations for:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Academic research and publications</li>
          <li>Journalism and news reporting</li>
          <li>Educational materials and presentations</li>
          <li>Advocacy and awareness campaigns</li>
          <li>Non-commercial analysis and visualization</li>
        </ul>

        <h4 className="font-semibold mt-4">Attribution Requirements</h4>
        <p>
          When using data or charts, please provide attribution:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Credit the original data sources (shown in data source badges)</li>
          <li>Include the date of data access</li>
          <li>Link back to the dashboard when possible</li>
          <li>Note any modifications or analysis you've performed</li>
        </ul>

        <h4 className="font-semibold mt-4">Example Citation</h4>
        <div className="p-3 bg-muted rounded-lg font-mono text-sm">
          Palestine Pulse Dashboard, [Metric Name], accessed [Date]. Data source:
          [Original Source Name]. Available at: [Dashboard URL]
        </div>

        <h4 className="font-semibold mt-4">Exporting Data</h4>
        <p>
          Use the export features to download:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Charts as high-resolution images (PNG, SVG, PDF)</li>
          <li>Data tables as CSV or JSON</li>
          <li>Metadata including source information</li>
        </ul>

        <h4 className="font-semibold mt-4">Data Integrity</h4>
        <p>
          When using the data:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Preserve the context and limitations noted in quality indicators</li>
          <li>Don't misrepresent data quality or certainty</li>
          <li>Include relevant caveats about data collection challenges</li>
          <li>Check for updates if using data over time</li>
        </ul>

        <h4 className="font-semibold mt-4">Commercial Use</h4>
        <p>
          For commercial use or redistribution, please contact the original data
          sources for licensing information. The dashboard itself is for informational
          purposes.
        </p>
      </div>
    ),
    relatedArticles: ["exporting-data", "data-sources", "data-accuracy"],
  },
  {
    id: "contribute",
    title: "How can I contribute or report issues?",
    category: "Frequently Asked Questions",
    tags: ["contribute", "feedback", "issues", "contact"],
    content: (
      <div className="space-y-4">
        <p>
          We welcome contributions, feedback, and issue reports to improve the dashboard.
        </p>

        <h4 className="font-semibold mt-4">Report Data Issues</h4>
        <p>
          If you notice data that seems incorrect:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Check the data source badge for the original source</li>
          <li>Verify the timestamp to ensure you're looking at current data</li>
          <li>Contact us with specific details about the discrepancy</li>
          <li>Provide alternative sources if available</li>
        </ul>

        <h4 className="font-semibold mt-4">Report Technical Issues</h4>
        <p>
          For bugs or technical problems:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Describe what you were trying to do</li>
          <li>Note what happened vs. what you expected</li>
          <li>Include your browser and device information</li>
          <li>Provide screenshots if helpful</li>
        </ul>

        <h4 className="font-semibold mt-4">Suggest Features</h4>
        <p>
          We're always looking to improve:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Suggest new data sources or metrics</li>
          <li>Propose new visualizations or analyses</li>
          <li>Request accessibility improvements</li>
          <li>Share ideas for better user experience</li>
        </ul>

        <h4 className="font-semibold mt-4">Contribute Data</h4>
        <p>
          If you have access to relevant data:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Ensure data comes from credible, verifiable sources</li>
          <li>Provide methodology and collection details</li>
          <li>Include proper documentation and metadata</li>
          <li>Respect privacy and ethical considerations</li>
        </ul>

        <h4 className="font-semibold mt-4">Provide Feedback</h4>
        <p>
          Your feedback helps us improve:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>What features do you find most useful?</li>
          <li>What's confusing or hard to use?</li>
          <li>What additional information would help?</li>
          <li>How can we better serve your needs?</li>
        </ul>
      </div>
    ),
    relatedArticles: ["data-sources", "data-accuracy"],
  },
];

/**
 * Export help categories with all articles
 */
export const helpCategories: HelpCategory[] = [
  {
    id: "understanding-data",
    name: "Understanding the Data",
    icon: <Database className="h-4 w-4" />,
    articles: understandingTheDataArticles,
  },
  {
    id: "data-sources",
    name: "Data Sources & Methodology",
    icon: <BarChart3 className="h-4 w-4" />,
    articles: dataSourcesArticles,
  },
  {
    id: "how-to-use",
    name: "How to Use the Dashboard",
    icon: <MousePointer className="h-4 w-4" />,
    articles: howToUseArticles,
  },
  {
    id: "faq",
    name: "Frequently Asked Questions",
    icon: <HelpCircle className="h-4 w-4" />,
    articles: faqArticles,
  },
];

/**
 * Get all articles as a flat array
 */
export const getAllArticles = () => {
  return helpCategories.flatMap(category => category.articles);
};

/**
 * Get article by ID
 */
export const getArticleById = (id: string) => {
  return getAllArticles().find(article => article.id === id);
};

/**
 * Search articles by query
 */
export const searchArticles = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return getAllArticles().filter(
    article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      article.category.toLowerCase().includes(lowerQuery)
  );
};
