import { ReactNode, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { V3Header } from "./V3Header";
import { V3Footer } from "./V3Footer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AdvancedFilterPanel } from "@/components/v3/shared/AdvancedFilterPanel";
import { motion, AnimatePresence } from "framer-motion";
import { useV3Store } from "@/store/v3Store";
import { useV3Shortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import IntroductionModal from "@/components/v3/shared/IntroductionModal";

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
    </div>
);

export const RootLayout = () => {
  const { filtersOpen, setFiltersOpen } = useV3Store();
  const { setTheme, theme } = useTheme();

  useV3Shortcuts({
    onOpenFilters: () => setFiltersOpen(true),
    onCloseFilters: () => setFiltersOpen(false),
    onToggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    onRefresh: () => window.location.reload(),
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <V3Header
        onFilterClick={() => setFiltersOpen(true)}
        showFilters={true}
      />

      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="container mx-auto px-4 py-6"
            >
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </motion.div>
        </AnimatePresence>
      </main>

      <V3Footer />

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <AdvancedFilterPanel onClose={() => setFiltersOpen(false)} />
        </SheetContent>
      </Sheet>
      <IntroductionModal />
    </div>
  );
};