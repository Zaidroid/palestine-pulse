/**
 * Humanitarian Theme Demo
 * 
 * Respectful theme demonstration for crisis documentation
 * - Somber, dignified design
 * - Functional animations
 * - No frivolous elements
 * - Appropriate for documenting tragedy
 */

import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { useThemePreference } from '@/hooks/useThemePreference';
import { Moon, Sun, AlertTriangle, Users, FileText, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

export const HumanitarianThemeDemo = () => {
    const { theme, toggleTheme } = useThemePreference();
    const [counters, setCounters] = useState([0, 0, 0, 0]);

    useEffect(() => {
        const targets = [45000, 102000, 1900000, 36];
        const duration = 1500;
        const steps = 60;
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setCounters(targets.map(target => Math.floor(target * easeOut)));

            if (step >= steps) {
                clearInterval(timer);
                setCounters(targets);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen p-6 space-y-8 bg-background">
            {/* Header - Simple and Dignified */}
            <div className="border-b border-border pb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Humanitarian Crisis Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Documenting human rights violations and humanitarian impact
                        </p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-card text-foreground rounded-lg hover:bg-muted transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        <span className="text-sm">Toggle Theme</span>
                    </button>
                </div>
            </div>

            {/* Crisis Statistics - Somber Presentation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="stat-card animate-counter-delay-1 border-l-4 border-l-destructive">
                    <CardContent className="pt-6">
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                        Confirmed Deaths
                                    </p>
                                    <p className="text-3xl font-bold text-foreground mt-2">
                                        {counters[0].toLocaleString()}
                                    </p>
                                </div>
                                <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                            </div>
                            <div className="pt-3 border-t border-border/50 space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Children:</span>
                                    <span className="font-medium">{Math.floor(counters[0] * 0.4).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Women:</span>
                                    <span className="font-medium">{Math.floor(counters[0] * 0.3).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="stat-card animate-counter-delay-2 border-l-4 border-l-warning">
                    <CardContent className="pt-6">
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                        Injured
                                    </p>
                                    <p className="text-3xl font-bold text-foreground mt-2">
                                        {counters[1].toLocaleString()}
                                    </p>
                                </div>
                                <Activity className="h-5 w-5 text-warning mt-1" />
                            </div>
                            <div className="pt-3 border-t border-border/50 space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Critical condition:</span>
                                    <span className="font-medium text-destructive">{Math.floor(counters[1] * 0.12).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Hospitals functional:</span>
                                    <span className="font-medium">12 / 36</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="stat-card animate-counter-delay-3 border-l-4 border-l-secondary">
                    <CardContent className="pt-6">
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                        Displaced
                                    </p>
                                    <p className="text-3xl font-bold text-foreground mt-2">
                                        {counters[2].toLocaleString()}
                                    </p>
                                </div>
                                <Users className="h-5 w-5 text-secondary mt-1" />
                            </div>
                            <div className="pt-3 border-t border-border/50 space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">In shelters:</span>
                                    <span className="font-medium">{Math.floor(counters[2] * 0.6).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Population affected:</span>
                                    <span className="font-medium">85%</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="stat-card animate-counter-delay-4 border-l-4 border-l-muted-foreground">
                    <CardContent className="pt-6">
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                        Hospitals Destroyed
                                    </p>
                                    <p className="text-3xl font-bold text-foreground mt-2">
                                        {counters[3]}
                                    </p>
                                </div>
                                <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                            </div>
                            <div className="pt-3 border-t border-border/50 space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Schools destroyed:</span>
                                    <span className="font-medium">352</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Mosques destroyed:</span>
                                    <span className="font-medium">227</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Theme Features - Functional Presentation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="card-gradient-bg">
                    <CardHeader>
                        <CardTitle className="text-lg">Subtle Gradient Background</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Cards feature subtle gradients that provide depth without distraction.
                            Appropriate for serious content.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-muted/50 border border-border">
                                <p className="text-xs text-muted-foreground">Opacity</p>
                                <p className="text-sm font-medium">8-12%</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50 border border-border">
                                <p className="text-xs text-muted-foreground">Direction</p>
                                <p className="text-sm font-medium">135°</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-elevated">
                    <CardHeader>
                        <CardTitle className="text-lg">Elevation & Depth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Cards lift on hover to indicate interactivity while maintaining
                            a professional, respectful appearance.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-muted/50 border border-border">
                                <p className="text-xs text-muted-foreground">Lift</p>
                                <p className="text-sm font-medium">4px</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50 border border-border">
                                <p className="text-xs text-muted-foreground">Duration</p>
                                <p className="text-sm font-medium">400ms</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Glass Effect - Functional Demo with Colorful Background */}
            <div className="relative h-80 rounded-xl overflow-hidden border border-border bg-gradient-to-br from-destructive/20 via-muted to-secondary/20">
                <div className="absolute inset-0 bg-grid opacity-30" />
                {/* Large colorful blobs to show blur clearly */}
                <div className="absolute top-8 left-8 w-48 h-48 rounded-full bg-destructive/40 blur-3xl animate-pulse" />
                <div className="absolute bottom-8 right-8 w-56 h-56 rounded-full bg-secondary/40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full bg-warning/35 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/4 right-1/3 w-40 h-40 rounded-full bg-chart-5/30 blur-2xl" />
                <div className="absolute bottom-1/3 left-1/4 w-44 h-44 rounded-full bg-chart-6/25 blur-2xl" />

                <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="glass-effect max-w-md w-full rounded-lg p-6 space-y-4">
                        <div>
                            <h3 className="text-xl font-semibold tracking-tight">Glass Morphism</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Frosted glass effect for overlays and modals
                            </p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-foreground/90">
                                The background blurs through creating a professional frosted glass appearance
                                suitable for important information overlays.
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-lg bg-background/20 backdrop-blur-sm border border-foreground/10">
                                    <p className="text-xs text-muted-foreground">Blur</p>
                                    <p className="text-sm font-semibold">120px</p>
                                </div>
                                <div className="p-3 rounded-lg bg-background/20 backdrop-blur-sm border border-foreground/10">
                                    <p className="text-xs text-muted-foreground">Saturation</p>
                                    <p className="text-sm font-semibold">400%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Design Principles */}
            <Card>
                <CardHeader>
                    <CardTitle>Design Principles</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Respectful</h4>
                            <p className="text-sm text-muted-foreground">
                                Somber colors and restrained animations appropriate for documenting tragedy
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Functional</h4>
                            <p className="text-sm text-muted-foreground">
                                Clear data presentation without unnecessary decoration
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Accessible</h4>
                            <p className="text-sm text-muted-foreground">
                                High contrast ratios and clear typography for all users
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Dignified</h4>
                            <p className="text-sm text-muted-foreground">
                                Professional appearance that honors the gravity of the content
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
