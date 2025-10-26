import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/v3/shared/ErrorBoundary";
import { RootLayout } from "./components/v3/layout/RootLayout";
import { lazyWithRetry, lazyNamed } from "@/lib/performance/code-splitting";

// Lazy load pages for code splitting with retry logic
const GazaWarDashboard = lazyWithRetry(() => import("@/pages/v3/GazaWarDashboard"));
const WestBankDashboard = lazyWithRetry(() => import("@/pages/v3/WestBankDashboard"));
const EnhancedComponentsDemo = lazyNamed(
  () => import("@/components/ui/enhanced/EnhancedComponentsDemo"),
  'EnhancedComponentsDemo'
);
const EnhancedThemeDemo = lazyNamed(
  () => import("@/components/ui/humanitarian-theme-demo"),
  'HumanitarianThemeDemo'
);
const AdvancedThemeDemo = lazyNamed(
  () => import("@/components/ui/advanced-theme-demo"),
  'AdvancedThemeDemo'
);
const AdvancedInteractiveDemo = lazyNamed(
  () => import("@/components/charts/AdvancedInteractiveDemo"),
  'AdvancedInteractiveDemo'
);
const DataSourceTest = lazyWithRetry(() => import("@/pages/DataSourceTest"));
const Analytics = lazyWithRetry(() => import("@/pages/Analytics"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Navigate to="/gaza" replace />} />
              <Route path="/gaza" element={<GazaWarDashboard />} />
              <Route path="/west-bank" element={<WestBankDashboard />} />
              <Route path="/demo/enhanced-components" element={<EnhancedComponentsDemo />} />
              <Route path="/demo/theme" element={<EnhancedThemeDemo />} />
              <Route path="/demo/advanced-theme" element={<AdvancedThemeDemo />} />
              <Route path="/demo/interactive-charts" element={<AdvancedInteractiveDemo />} />
              <Route path="/test/data-sources" element={<DataSourceTest />} />
              <Route path="/analytics" element={<Analytics />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
