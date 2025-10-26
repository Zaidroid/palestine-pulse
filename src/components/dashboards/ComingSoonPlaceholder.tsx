/**
 * Coming Soon Placeholder Component
 * 
 * Shows a placeholder for dashboard components that don't have real data sources yet
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertCircle, Database, ExternalLink } from 'lucide-react';

interface DataSource {
  name: string;
  url?: string;
  status: 'pending' | 'in-progress' | 'planned';
  description: string;
}

interface ComingSoonPlaceholderProps {
  title: string;
  description: string;
  requiredDataSources: DataSource[];
  estimatedCompletion?: string;
}

export const ComingSoonPlaceholder = ({
  title,
  description,
  requiredDataSources,
  estimatedCompletion
}: ComingSoonPlaceholderProps) => {
  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          Coming Soon
        </Badge>
      </div>

      {/* Main Card */}
      <Card className="border-2 border-dashed border-muted-foreground/30 bg-muted/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <div>
              <CardTitle>Real Data Integration In Progress</CardTitle>
              <CardDescription>
                This dashboard will be available once we integrate with the required data sources
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Required Data Sources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Required Data Sources
            </h3>
            <div className="space-y-3">
              {requiredDataSources.map((source, index) => (
                <Card key={index} className="bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{source.name}</span>
                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{source.description}</p>
                      </div>
                      <Badge
                        variant={
                          source.status === 'in-progress'
                            ? 'default'
                            : source.status === 'pending'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {source.status === 'in-progress' && '🔄 In Progress'}
                        {source.status === 'pending' && '⏳ Pending'}
                        {source.status === 'planned' && '📋 Planned'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Estimated Completion */}
          {estimatedCompletion && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Estimated Completion:</strong> {estimatedCompletion}
              </p>
            </div>
          )}

          {/* Why We Don't Show Sample Data */}
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Why We Don't Show Sample Data</h4>
            <p className="text-sm text-muted-foreground">
              We believe in data integrity and transparency. Rather than showing placeholder or
              estimated data that could be misleading, we wait until we can integrate with
              verified, authoritative data sources. This ensures that all information presented
              is accurate and trustworthy.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* What You Can Do */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">How You Can Help</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                If you have access to these data sources or know someone who does, please reach out
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                Share this project with organizations that might be able to provide data partnerships
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                Check back regularly - we're actively working on integrating new data sources
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoonPlaceholder;
