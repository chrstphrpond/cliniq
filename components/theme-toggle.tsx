"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import * as React from "react";

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
    >
      {theme === "light" ? (
        <Moon size={18} strokeWidth={1.5} />
      ) : (
        <Sun size={18} strokeWidth={1.5} />
      )}
    </Button>
  );
}
