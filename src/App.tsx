import { Suspense, lazy } from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/v3/shared/ErrorBoundary";
import { RootLayout } from "./components/v3/layout/RootLayout";

// Lazy load pages for code splitting
const GazaWarDashboard = lazy(() => import("@/pages/v3/GazaWarDashboard"));
const WestBankDashboard = lazy(() => import("@/pages/v3/WestBankDashboard"));

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
