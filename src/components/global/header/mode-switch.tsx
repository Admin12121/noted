"use client";

import React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import {
  type AnimationStart,
  type AnimationVariant,
  createAnimation,
} from "./theme-animation";

interface ThemeToggleAnimationProps {
  variant?: AnimationVariant;
  start?: AnimationStart;
  showLabel?: boolean;
  url?: string;
}

export function ModeSwitcher({
  variant = "circle-blur",
  start = "top-left",
  showLabel = false,
  url = "",
}: ThemeToggleAnimationProps) {
  const { theme, setTheme } = useTheme();

  const styleId = "theme-transition-styles";

  const updateStyles = React.useCallback((css: string) => {
    if (typeof window === "undefined") return;

    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
  }, []);

  const toggleTheme = React.useCallback(() => {
    const animation = createAnimation(variant, start, url);

    updateStyles(animation.css);

    if (typeof window === "undefined") return;

    const switchTheme = () => {
      setTheme(theme === "light" ? "dark" : "light");
    };

    if (!document.startViewTransition) {
      switchTheme();
      return;
    }

    document.startViewTransition(switchTheme);
  }, [theme, setTheme]);

  return (
    <Button
      onClick={toggleTheme}
      variant="secondary"
      size="icon"
      className="w-9 p-0 h-9 relative group dark:bg-neutral-950 rounded-none flex ring-0 shrink-0 md:w-[3.56rem] md:h-14 md:border-l md:text-muted-foreground max-md:-mr-1.5 max-md:hover:bg-transparent"
      name="Theme Toggle Button"
    >
      <SunIcon className="size-[1.4rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute size-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Theme Toggle </span>
      {showLabel && (
        <span className="hidden group-hover:block border rounded-full px-2 absolute -top-10">
          Toggle Theme
        </span>
      )}
    </Button>
  );
}