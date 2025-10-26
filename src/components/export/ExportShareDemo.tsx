/**
 * Export and Share Features Demo
 * 
 * Demonstrates all export and share functionality:
 * - Export Dialog with preview
 * - Chart Export Button
 * - Copy Data Button
 * - Share Button
 */

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExportDialog } from '@/components/export/ExportDialog';
import { ChartExportButton } from '@/components/ui/chart-export-button';
import { CopyDataButton } from '@/components/ui/copy-data-button';
import { ShareButton } from '@/components/ui/share-button';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Sample data
const sampleData = [
  { month: 'Jan', casualties: 120, infrastructure: 45 },
  { month: 'Feb', casualties: 150, infrastructure: 52 },
  { month: 'Mar', casualties: 180, infrastructure: 68 },
  { month: 'Apr', casualties: 210, infrastructure: 75 },
  { month: 'May', casualties: 190, infrastructure: 82 },
  { month: 'Jun', casualties: 220, infrastructure: 90 },
];

const tableData = [
  { id: 1, name: 'Gaza City', population: 590481, status: 'Critical' },
  { id: 2, name: 'Khan Yunis', population: 205000, status: 'Severe' },
  { id: 3, name: 'Rafah', population: 152950, status: 'Moderate' },
  { id: 4, name: 'Jabalia', population: 168568, status: 'Critical' },
];

export const ExportShareDemo = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [shareState, setShareState] = useState({
    view: 'gaza',
    dateRange: '30d',
    filters: ['casualties', 'infrastructure'],
  });

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Export & Share Features</h1>
        <p className="text-muted-foreground">
          Comprehensive export and sharing functionality for dashboard data
        </p>
      </div>

      <Separator />

      {/* Export Dialog Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Export Dialog</CardTitle>
          <CardDescription>
            Export data in multiple formats with preview support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <ExportDialog
              data={sampleData}
              dataType="casualties-trend"
              chartElement={chartRef.current}
            />
            <Badge variant="outline">Supports: PNG, PDF, CSV, JSON</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            <p>✓ Format selection with descriptions</p>
            <p>✓ Live preview for supported formats</p>
            <p>✓ High-resolution image export (2x)</p>
            <p>✓ Download functionality</p>
          </div>
        </CardContent>
      </Card>

      {/* Chart Export Demo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Chart Export</CardTitle>
              <CardDescription>
                Export charts as high-resolution images
              </CardDescription>
            </div>
            <ChartExportButton
              chartElement={chartRef.current}
              chartTitle="casualties-trend"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div ref={chartRef} className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="casualties" fill="#ef4444" />
                <Bar dataKey="infrastructure" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground space-y-1">
            <p>✓ Multiple formats: PNG, JPG, WebP, SVG</p>
            <p>✓ High-resolution export (2x pixel density)</p>
            <p>✓ Automatic filename generation</p>
            <p>✓ Success notifications with details</p>
          </div>
        </CardContent>
      </Card>

      {/* Copy Data Demo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Copy Data to Clipboard</CardTitle>
              <CardDescription>
                Copy data in various formats for easy pasting
              </CardDescription>
            </div>
            <CopyDataButton
              data={tableData}
              dataLabel="Gaza regions"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-right p-3">Population</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-3">{row.name}</td>
                    <td className="text-right p-3">{row.population.toLocaleString()}</td>
                    <td className="p-3">
                      <Badge variant={row.status === 'Critical' ? 'destructive' : 'secondary'}>
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground space-y-1">
            <p>✓ CSV format with headers</p>
            <p>✓ JSON (pretty and minified)</p>
            <p>✓ Plain text table</p>
            <p>✓ Markdown table format</p>
            <p>✓ Automatic data size calculation</p>
          </div>
        </CardContent>
      </Card>

      {/* Share Button Demo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Share Functionality</CardTitle>
              <CardDescription>
                Generate shareable URLs with current state
              </CardDescription>
            </div>
            <ShareButton
              title="Gaza Humanitarian Dashboard"
              description="View real-time humanitarian data"
              state={shareState}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm font-medium">Current State:</p>
            <div className="text-xs font-mono space-y-1">
              <div>view: {shareState.view}</div>
              <div>dateRange: {shareState.dateRange}</div>
              <div>filters: [{shareState.filters.join(', ')}]</div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            <p>✓ Shareable URLs with encoded state</p>
            <p>✓ Copy to clipboard</p>
            <p>✓ Native share API on mobile</p>
            <p>✓ Social media sharing (Twitter, Facebook, LinkedIn)</p>
            <p>✓ Email sharing</p>
          </div>
        </CardContent>
      </Card>

      {/* Integration Example */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Example</CardTitle>
          <CardDescription>
            How to use these components in your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
{`// Import components
import { ExportDialog } from '@/components/export/ExportDialog';
import { ChartExportButton } from '@/components/ui/chart-export-button';
import { CopyDataButton } from '@/components/ui/copy-data-button';
import { ShareButton } from '@/components/ui/share-button';

// In your component
const MyDashboard = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState([...]);

  return (
    <div>
      {/* Export all data */}
      <ExportDialog 
        data={data} 
        dataType="casualties"
        chartElement={chartRef.current}
      />

      {/* Export specific chart */}
      <ChartExportButton 
        chartElement={chartRef.current}
        chartTitle="casualties-trend"
      />

      {/* Copy table data */}
      <CopyDataButton 
        data={tableData}
        dataLabel="regions"
      />

      {/* Share with state */}
      <ShareButton 
        state={{ view: 'gaza', filters: [...] }}
      />
    </div>
  );
};`}
          </pre>
        </CardContent>
      </Card>

      {/* Features Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Features Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Export Formats</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• PNG (High-res 2x)</li>
                <li>• JPG (Compressed)</li>
                <li>• WebP (Modern)</li>
                <li>• SVG (Vector)</li>
                <li>• PDF (Document)</li>
                <li>• CSV (Spreadsheet)</li>
                <li>• JSON (Data)</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Share Options</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Copy link to clipboard</li>
                <li>• Native mobile share</li>
                <li>• Twitter integration</li>
                <li>• Facebook integration</li>
                <li>• LinkedIn integration</li>
                <li>• Email sharing</li>
                <li>• State preservation in URL</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Notifications</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Success with download link</li>
                <li>• Error with details</li>
                <li>• Progress indicators</li>
                <li>• File size information</li>
                <li>• Resolution details</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">User Experience</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Live preview support</li>
                <li>• Format descriptions</li>
                <li>• Loading states</li>
                <li>• Error handling</li>
                <li>• Responsive design</li>
                <li>• Keyboard accessible</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
