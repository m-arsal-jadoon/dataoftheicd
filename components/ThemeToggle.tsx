"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by waiting until mounted
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder of the same size
  }

  return (
    <button
       aria-label="Toggle Dark Mode"
       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
       className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-transparent hover:bg-slate-800/10 dark:hover:bg-slate-100/10 hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-95"
    >
       {theme === "dark" ? (
          <Sun className="w-[18px] h-[18px] text-slate-300 pointer-events-none transition-transform" />
       ) : (
          <Moon className="w-[18px] h-[18px] text-slate-600 pointer-events-none transition-transform" />
       )}
    </button>
  );
}
