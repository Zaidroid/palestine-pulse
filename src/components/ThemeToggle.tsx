import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useThemePreference } from "@/hooks/useThemePreference";
import { useEffect } from "react";

export const ThemeToggle = () => {
  const { theme, toggleTheme, mounted } = useThemePreference();

  useEffect(() => {
    if (mounted) {
      // Remove no-transitions class after initial load
      document.documentElement.classList.remove('no-transitions');
    }
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden group transition-all duration-300 hover:scale-105"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-400 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-400 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme (currently {theme} mode)</span>
    </Button>
  );
};
