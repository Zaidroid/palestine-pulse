/**
 * Expandable Stat Card Component
 * Interactive card that expands to show detailed breakdown and sources
 */

import { useState } from 'react';
import { Card, CardContent } from './card';
import { X } from 'lucide-react';
import { DataSourceBadge } from './data-source-badge';

interface BreakdownItem {
    label: string;
    value: string | number;
    color?: string;
    description?: string;
}

interface ExpandableStatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    accentColor: 'destructive' | 'warning' | 'secondary' | 'muted-foreground' | 'primary';
    breakdown: BreakdownItem[];
    source: string;
    sourceUrl?: string;
    lastUpdated?: string;
    methodology?: string;
    additionalInfo?: React.ReactNode;
    trend?: {
        value: number;
        label: string;
        direction: 'up' | 'down';
    };
}

export const ExpandableStatCard = ({
    title,
    value,
    icon,
    accentColor,
    breakdown,
    source,
    sourceUrl,
    lastUpdated,
    methodology,
    additionalInfo,
    trend
}: ExpandableStatCardProps) => {
    const [showModal, setShowModal] = useState(false);

    const handleCardClick = () => {
        setShowModal(true);
    };

    const accentColorClasses = {
        destructive: 'border-l-destructive',
        warning: 'border-l-warning',
        secondary: 'border-l-secondary',
        'muted-foreground': 'border-l-muted-foreground',
        primary: 'border-l-primary'
    };

    return (
        <>
            <Card
                className={`stat-card border-l-4 ${accentColorClasses[accentColor]} cursor-pointer transition-all duration-400 hover:scale-[1.02]`}
                onClick={handleCardClick}
            >
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        {/* Main stat */}
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                    {title}
                                </p>
                                <p className="text-3xl font-bold text-foreground mt-2 animate-counter">
                                    {typeof value === 'number' ? value.toLocaleString() : value}
                                </p>
                                {trend && (
                                    <div className={`flex items-center gap-1 mt-2 text-xs ${trend.direction === 'up' ? 'text-destructive' : 'text-secondary'
                                        }`}>
                                        <span className="font-medium">
                                            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
                                        </span>
                                        <span className="text-muted-foreground">{trend.label}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {icon}
                            </div>
                        </div>

                        {/* Quick breakdown - always visible */}
                        <div className="pt-3 border-t border-border/50 space-y-1.5">
                            {breakdown.slice(0, 2).map((item, i) => (
                                <div key={i} className="flex justify-between text-xs items-center">
                                    <span className="text-muted-foreground">{item.label}:</span>
                                    <span className="font-medium">
                                        {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Data Source Badge */}
                        <div className="pt-2">
                            <DataSourceBadge
                                source={source}
                                url={sourceUrl}
                                lastUpdated={lastUpdated}
                                methodology={methodology}
                            />
                        </div>

                        {/* Click hint */}
                        <div className="pt-2 text-center">
                            <span className="text-xs text-muted-foreground">Click for full details</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Full Details Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="glass-effect max-w-2xl w-full rounded-xl p-6 space-y-6 animate-scale-in shadow-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-start justify-between border-b border-border/50 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                                <p className="text-3xl font-bold text-foreground mt-2">
                                    {typeof value === 'number' ? value.toLocaleString() : value}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">Detailed Breakdown</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {breakdown.map((item, i) => (
                                    <div
                                        key={i}
                                        className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm text-muted-foreground">{item.label}</span>
                                            <span className="text-lg font-bold">
                                                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                                            </span>
                                        </div>
                                        {item.description && (
                                            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Information */}
                        {additionalInfo && (
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-foreground">Additional Context</h3>
                                <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-sm text-foreground/90">
                                    {additionalInfo}
                                </div>
                            </div>
                        )}

                        {/* Data Source Section */}
                        <div className="space-y-3 pt-4 border-t border-border/50">
                            <h3 className="text-lg font-semibold text-foreground">Data Source</h3>
                            <DataSourceBadge
                                source={source}
                                url={sourceUrl}
                                lastUpdated={lastUpdated}
                                methodology={methodology}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
