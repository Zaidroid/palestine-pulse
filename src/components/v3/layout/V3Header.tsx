import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Filter,
  Download,
  Moon,
  Sun,
  Menu,
  AlertCircle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemePreference } from "@/hooks/useThemePreference";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ExportDialog } from "@/components/export/ExportDialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatedSwitch } from "@/components/ui/animated-switch";
import { PillTabs } from "@/components/v3/shared/PillTabs";
import { Logo } from "./Logo";
import { animationTokens } from "@/lib/animation/tokens";
import { useReducedMotion } from "@/lib/animation/hooks";
import { buttonInteraction } from "@/lib/interaction-polish";

interface V3HeaderProps {
  onFilterClick?: () => void;
  showFilters?: boolean;
  exportData?: any;
}

export const V3Header = ({
  onFilterClick,
  showFilters = true,
  exportData,
}: V3HeaderProps) => {
  const { theme, toggleTheme, setThemeMode } = useThemePreference();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const navLinks = [
    {
      path: "/gaza",
      value: "gaza",
      label: "Gaza",
      icon: AlertCircle,
    },
    {
      path: "/west-bank",
      value: "west-bank",
      label: "West Bank",
      icon: Building2,
    },
  ];

  const activeTab = location.pathname.includes("/west-bank")
    ? "west-bank"
    : "gaza";

  const handleTabChange = (value: string) => {
    const path = navLinks.find((l) => l.value === value)?.path || "/";
    navigate(path);
  };

  const NavTabs = ({ isMobile = false }) => (
    <PillTabs
      tabs={navLinks}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      isMobile={isMobile}
      variant="main"
    />
  );

  // Animation variants for header (Requirement 1.1)
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: animationTokens.duration.slow / 1000, // 500ms
        ease: animationTokens.easing.easeOut,
      },
    },
  };

  return (
    <motion.header
      variants={prefersReducedMotion ? undefined : headerVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4">
        <div className="relative flex h-16 items-center justify-center">
          {/* Logo */}
          <div className="absolute left-0 flex items-center">
            <Link to="/gaza" className="flex items-center gap-2 group">
              <Logo />
              <h1 className="hidden sm:block text-xl font-bold text-foreground tracking-tight">
                Palestine Pulse
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-center">
            <NavTabs />
          </div>

          {/* Actions */}
          <div className="absolute right-0 flex items-center gap-1">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-1">
              {showFilters && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div {...buttonInteraction}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onFilterClick}
                        className="rounded-full"
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filters</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {exportData && (
                <ExportDialog
                  data={exportData}
                  dataType="dashboard_data"
                  trigger={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div {...buttonInteraction}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Export Data</p>
                      </TooltipContent>
                    </Tooltip>
                  }
                />
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 px-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <AnimatedSwitch
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setThemeMode(checked ? "dark" : "light")}
                      size="sm"
                      aria-label="Toggle theme"
                    />
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Theme</p>
                </TooltipContent>
              </Tooltip>
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <motion.div {...buttonInteraction}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 mt-6">
                    {showFilters && (
                      <motion.div {...buttonInteraction}>
                        <Button
                          variant="outline"
                          onClick={() => {
                            onFilterClick?.();
                            setIsSheetOpen(false);
                          }}
                          className="w-full justify-start gap-2"
                        >
                          <Filter className="h-4 w-4" />
                          Filters
                        </Button>
                      </motion.div>
                    )}
                    {exportData && (
                      <ExportDialog
                        data={exportData}
                        dataType="dashboard_data"
                        trigger={
                          <motion.div {...buttonInteraction}>
                            <Button
                              variant="outline"
                              className="w-full justify-start gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Export Data
                            </Button>
                          </motion.div>
                        }
                      />
                    )}
                    <motion.div {...buttonInteraction}>
                      <Button
                        variant="outline"
                        onClick={toggleTheme}
                        className="w-full justify-start gap-2"
                      >
                        {theme === "dark" ? (
                          <>
                            <Sun className="h-4 w-4" /> Light Mode
                          </>
                        ) : (
                          <>
                            <Moon className="h-4 w-4" /> Dark Mode
                          </>
                        )}
                      </Button>
                    </motion.div>
                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-2">Language</h3>
                      <LanguageSwitcher />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-center pb-2 pt-1 border-t">
          <NavTabs isMobile />
        </div>
      </div>
    </motion.header>
  );
};