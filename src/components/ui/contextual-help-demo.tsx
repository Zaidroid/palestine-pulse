/**
 * ContextualHelpDemo Component
 * Demonstrates all contextual help system features
 */

import * as React from "react";
import { TrendingUp, Users, DollarSign, Activity, BarChart3, PieChart } from "lucide-react";
import { EnhancedMetricCard } from "./enhanced-metric-card";
import { ExplanationModal } from "./explanation-modal";
import { OnboardingTour } from "./onboarding-tour";
import { HelpPanel } from "./help-panel";
import { DataQualityWarningList } from "./data-quality-warning";
import { Button } from "./button";
import { Card } from "./card";

export const ContextualHelpDemo: React.FC = () => {
  const tourSteps = [
    {
      target: '[data-tour="metrics"]',
      title: "Welcome to Your Dashboard",
      content: (
        <p>
          This dashboard provides real-time insights into your key metrics. Let's take a quick
          tour to help you get started.
        </p>
      ),
      placement: 'bottom' as const,
    },
    {
      target: '[data-tour="metric-card"]',
      title: "Metric Cards",
      content: (
        <p>
          Each metric card shows a key performance indicator. Hover over the info icon to see
          detailed definitions and formulas.
        </p>
      ),
      placement: 'bottom' as const,
    },
    {
      target: '[data-tour="quality-warning"]',
      title: "Data Quality Indicators",
      content: (
        <p>
          Warning icons indicate data quality issues. Hover to see specific problems and when
          the data was last updated.
        </p>
      ),
      placement: 'top' as const,
    },
    {
      target: '[data-tour="help-button"]',
      title: "Need Help?",
      content: (
        <p>
          Click the help button anytime to access documentation, guides, and answers to common
          questions.
        </p>
      ),
      placement: 'left' as const,
    },
  ];

  const helpCategories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      articles: [
        {
          id: 'dashboard-overview',
          category: 'Getting Started',
          title: 'Dashboard Overview',
          content: (
            <div className="space-y-4">
              <p>
                The dashboard provides a comprehensive view of your key performance metrics,
                updated in real-time.
              </p>
              <h4 className="font-semibold">Key Features:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Real-time metric updates</li>
                <li>Interactive charts and visualizations</li>
                <li>Data quality indicators</li>
                <li>Customizable filters and views</li>
              </ul>
            </div>
          ),
          tags: ['overview', 'basics'],
        },
        {
          id: 'understanding-metrics',
          category: 'Getting Started',
          title: 'Understanding Your Metrics',
          content: (
            <div className="space-y-4">
              <p>
                Each metric card displays a specific KPI with trend information and historical
                data.
              </p>
              <h4 className="font-semibold">Metric Components:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Current value with animated counter</li>
                <li>Trend indicator (up, down, or neutral)</li>
                <li>Sparkline showing recent history</li>
                <li>Data source and quality information</li>
              </ul>
            </div>
          ),
          tags: ['metrics', 'kpi'],
          relatedArticles: ['data-quality'],
        },
      ],
    },
    {
      id: 'data-quality',
      name: 'Data Quality',
      articles: [
        {
          id: 'data-quality',
          category: 'Data Quality',
          title: 'Understanding Data Quality',
          content: (
            <div className="space-y-4">
              <p>
                Data quality indicators help you understand the reliability and freshness of
                your metrics.
              </p>
              <h4 className="font-semibold">Quality Levels:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>High:</strong> Data is verified, complete, and up-to-date
                </li>
                <li>
                  <strong>Medium:</strong> Data may have minor issues or be slightly outdated
                </li>
                <li>
                  <strong>Low:</strong> Data has significant issues or is outdated
                </li>
              </ul>
            </div>
          ),
          tags: ['quality', 'data'],
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Contextual Help System Demo</h1>
          <p className="text-muted-foreground">
            Explore tooltips, modals, tours, and help panels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem('onboarding-tour-completed-dashboard');
              window.location.reload();
            }}
          >
            Restart Tour
          </Button>
          <div data-tour="help-button">
            <HelpPanel
              categories={helpCategories}
              externalDocsUrl="https://docs.example.com"
              triggerVariant="button"
            />
          </div>
        </div>
      </div>

      {/* Onboarding Tour */}
      <OnboardingTour
        steps={tourSteps}
        storageKey="dashboard"
        autoStart={true}
        onComplete={() => console.log('Tour completed')}
        onSkip={() => console.log('Tour skipped')}
      />

      {/* Metric Cards with Tooltips */}
      <div data-tour="metrics">
        <h2 className="text-xl font-semibold mb-4">Metrics with Tooltips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div data-tour="metric-card">
            <EnhancedMetricCard
              title="Total Revenue"
              value={125000}
              unit="$"
              icon={DollarSign}
              change={{ value: 12.5, trend: 'up', period: 'vs last month' }}
              gradient={{ from: 'from-green-500', to: 'to-emerald-600' }}
              metricDefinition={{
                definition:
                  'Total revenue represents the sum of all income generated from sales and services during the specified period.',
                formula: 'Revenue = Sum(Sales) + Sum(Services)',
                example: 'If you sold $100k in products and $25k in services, total revenue is $125k',
                source: 'Financial System',
              }}
              sparkline={{
                data: [
                  { value: 100000, date: '2024-01-01' },
                  { value: 110000, date: '2024-02-01' },
                  { value: 115000, date: '2024-03-01' },
                  { value: 125000, date: '2024-04-01' },
                ],
                color: '#10b981',
              }}
            />
          </div>

          <EnhancedMetricCard
            title="Active Users"
            value={1250}
            icon={Users}
            change={{ value: 8.3, trend: 'up', period: 'vs last week' }}
            gradient={{ from: 'from-blue-500', to: 'to-cyan-600' }}
            metricDefinition={{
              definition:
                'Active users are unique individuals who have logged in and performed at least one action in the last 30 days.',
              formula: 'Active Users = Count(Distinct Users with Activity)',
              example: 'A user who logged in yesterday and viewed 3 pages counts as 1 active user',
            }}
            quality="medium"
            qualityIssues={[
              {
                type: 'outdated',
                description: 'Data is 2 hours old due to sync delay',
              },
            ]}
          />

          <div data-tour="quality-warning">
            <EnhancedMetricCard
              title="Conversion Rate"
              value="3.2%"
              icon={TrendingUp}
              change={{ value: -0.5, trend: 'down', period: 'vs last month' }}
              gradient={{ from: 'from-purple-500', to: 'to-pink-600' }}
              metricDefinition={{
                definition:
                  'Conversion rate is the percentage of visitors who complete a desired action.',
                formula: 'Conversion Rate = (Conversions / Total Visitors) × 100',
                example: 'If 32 out of 1000 visitors make a purchase, the conversion rate is 3.2%',
              }}
              quality="low"
              qualityIssues={[
                {
                  type: 'incomplete',
                  description: 'Missing data from mobile app',
                },
                {
                  type: 'estimated',
                  description: 'Values are estimated based on partial data',
                },
              ]}
            />
          </div>

          <EnhancedMetricCard
            title="Avg Response Time"
            value={245}
            unit="ms"
            icon={Activity}
            change={{ value: 15.2, trend: 'down', period: 'vs yesterday' }}
            gradient={{ from: 'from-orange-500', to: 'to-red-600' }}
            metricDefinition={{
              definition:
                'Average response time measures how quickly the system responds to user requests.',
              formula: 'Avg Response Time = Sum(Response Times) / Count(Requests)',
              example: 'If 10 requests took 2450ms total, average response time is 245ms',
            }}
          />
        </div>
      </div>

      {/* Explanation Modals */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Explanation Modals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold mb-1">Revenue Distribution</h3>
                <p className="text-sm text-muted-foreground">
                  Breakdown by product category
                </p>
              </div>
              <ExplanationModal
                title="Understanding Revenue Distribution"
                description="Learn how revenue is categorized and calculated"
                sections={[
                  {
                    title: 'What is Revenue Distribution?',
                    content: (
                      <p>
                        Revenue distribution shows how your total revenue is split across
                        different product categories, helping you identify your most profitable
                        segments.
                      </p>
                    ),
                    icon: <PieChart className="h-4 w-4 text-primary" />,
                  },
                  {
                    title: 'How to Read This Chart',
                    content: (
                      <ul className="list-disc list-inside space-y-1">
                        <li>Each slice represents a product category</li>
                        <li>Larger slices indicate higher revenue contribution</li>
                        <li>Hover over slices to see exact values</li>
                        <li>Click slices to drill down into details</li>
                      </ul>
                    ),
                    icon: <BarChart3 className="h-4 w-4 text-primary" />,
                  },
                ]}
                relatedLinks={[
                  {
                    label: 'Revenue Analysis Guide',
                    url: 'https://docs.example.com/revenue',
                  },
                  {
                    label: 'Product Category Setup',
                    url: 'https://docs.example.com/categories',
                  },
                ]}
                triggerVariant="icon"
              />
            </div>
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Chart Placeholder</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold mb-1">User Growth Trend</h3>
                <p className="text-sm text-muted-foreground">Monthly active users over time</p>
              </div>
              <ExplanationModal
                title="User Growth Analysis"
                description="Understanding your user acquisition and retention"
                sections={[
                  {
                    title: 'Growth Metrics',
                    content: (
                      <p>
                        This chart tracks the number of monthly active users over time, showing
                        both new user acquisition and existing user retention patterns.
                      </p>
                    ),
                  },
                  {
                    title: 'Key Indicators',
                    content: (
                      <ul className="list-disc list-inside space-y-1">
                        <li>Upward trend indicates healthy growth</li>
                        <li>Plateaus may suggest market saturation</li>
                        <li>Dips could indicate churn issues</li>
                        <li>Seasonal patterns are normal for many businesses</li>
                      </ul>
                    ),
                  },
                ]}
                triggerVariant="badge"
                triggerLabel="Learn more"
              />
            </div>
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Chart Placeholder</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Data Quality Warnings */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Data Quality Warnings</h2>
        <Card className="p-6">
          <DataQualityWarningList
            items={[
              {
                label: 'Mobile App Analytics',
                quality: 'medium',
                issues: [
                  {
                    type: 'outdated',
                    description: 'Data is 3 hours old',
                  },
                ],
                lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000),
                source: 'Mobile Analytics API',
              },
              {
                label: 'Payment Processing Data',
                quality: 'low',
                issues: [
                  {
                    type: 'incomplete',
                    description: 'Missing transactions from EU region',
                  },
                  {
                    type: 'unverified',
                    description: 'Pending reconciliation with bank records',
                  },
                ],
                lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
                source: 'Payment Gateway',
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

ContextualHelpDemo.displayName = "ContextualHelpDemo";
