/**
 * Localization Example Component
 * 
 * Demonstrates how to use the localization infrastructure:
 * - Translation keys
 * - Locale formatters
 * - RTL-aware styling
 */

import { useTranslation } from 'react-i18next';
import { useLocaleFormatters } from '@/hooks/useLocaleFormatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function LocalizationExample() {
  const { t } = useTranslation();
  const {
    locale,
    direction,
    isRTL,
    formatNumberWithCommas,
    formatPercentage,
    formatDateShort,
    formatRelativeTime,
    formatCompactNumber,
  } = useLocaleFormatters();

  const sampleData = {
    totalKilled: 45000,
    percentage: 0.75,
    date: new Date('2024-01-15'),
    lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    largeNumber: 1500000,
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('common.loading')}</span>
          <Badge variant="outline">
            {locale.toUpperCase()} - {direction.toUpperCase()}
          </Badge>
        </CardTitle>
        <CardDescription>
          {t('app.subtitle')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Locale Info */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">{t('common.status')}</h3>
          <div className="space-y-1 text-sm">
            <p>Locale: {locale}</p>
            <p>Direction: {direction}</p>
            <p>Is RTL: {isRTL ? t('common.yes') : t('common.no')}</p>
          </div>
        </div>

        {/* Number Formatting */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Number Formatting</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t('metrics.totalKilled')}:
              </span>
              <span className="font-mono number">
                {formatNumberWithCommas(sampleData.totalKilled)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t('common.percentage')}:
              </span>
              <span className="font-mono number">
                {formatPercentage(sampleData.percentage)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Compact:
              </span>
              <span className="font-mono number">
                {formatCompactNumber(sampleData.largeNumber)}
              </span>
            </div>
          </div>
        </div>

        {/* Date Formatting */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Date Formatting</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t('common.date')}:
              </span>
              <span className="font-mono number">
                {formatDateShort(sampleData.date)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t('charts.dataSource.lastUpdated')}:
              </span>
              <span className="text-sm">
                {formatRelativeTime(sampleData.lastUpdate)}
              </span>
            </div>
          </div>
        </div>

        {/* RTL-Aware Spacing */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">RTL-Aware Spacing</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Badge className="me-2">Start</Badge>
              <span className="text-sm">Uses margin-inline-end (me-2)</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm">Uses margin-inline-start (ms-2)</span>
              <Badge className="ms-2">End</Badge>
            </div>
            
            <div className="ps-4 pe-2 bg-background rounded p-2">
              <span className="text-sm">
                Padding: ps-4 (start) and pe-2 (end)
              </span>
            </div>
          </div>
        </div>

        {/* Translation Examples */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Translation Examples</h3>
          <div className="space-y-2 text-sm">
            <p><strong>{t('common.loading')}</strong></p>
            <p><strong>{t('common.error')}</strong></p>
            <p><strong>{t('common.noData')}</strong></p>
            <p><strong>{t('charts.actions.export')}</strong></p>
            <p><strong>{t('charts.actions.share')}</strong></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
