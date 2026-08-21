"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, ChevronDown } from "lucide-react";

interface ThemeToggleProps {
  variant?: "dropdown" | "button" | "segmented";
  className?: string;
}

export function ThemeToggle({ variant = "dropdown", className = "" }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className={`h-9 w-9 rounded-full border border-slate-200 bg-transparent dark:border-slate-800 ${className}`} />
    );
  }

  if (variant === "segmented") {
    return (
      <div className={`inline-flex items-center rounded-2xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-900 ${className}`}>
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
            theme === "light"
              ? "bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-white"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          <span>Light</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
            theme === "dark"
              ? "bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-white"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <Moon className="h-3.5 w-3.5 text-indigo-400" />
          <span>Dark</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme("system")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
            theme === "system"
              ? "bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-white"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <Laptop className="h-3.5 w-3.5 text-slate-400" />
          <span>System</span>
        </button>
      </div>
    );
  }

  if (variant === "button") {
    const isDark = resolvedTheme === "dark";
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Toggle theme"
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition ${className}`}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400" />
        ) : (
          <Moon className="h-4 w-4 text-indigo-600" />
        )}
      </button>
    );
  }

  // Default: Dropdown Selector
  const isDark = resolvedTheme === "dark";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select theme"
        className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-slate-700 backdrop-blur hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 transition shadow-xs"
      >
        {theme === "system" ? (
          <Laptop className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
        ) : isDark ? (
          <Moon className="h-3.5 w-3.5 text-indigo-400" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500" />
        )}
        <span className="capitalize">{theme ?? "Theme"}</span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => {
              setTheme("light");
              setIsOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
              theme === "light"
                ? "bg-slate-100 text-slate-950 font-semibold dark:bg-slate-800 dark:text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
            }`}
          >
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Light</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTheme("dark");
              setIsOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
              theme === "dark"
                ? "bg-slate-100 text-slate-950 font-semibold dark:bg-slate-800 dark:text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
            }`}
          >
            <Moon className="h-4 w-4 text-indigo-400" />
            <span>Dark</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTheme("system");
              setIsOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
              theme === "system"
                ? "bg-slate-100 text-slate-950 font-semibold dark:bg-slate-800 dark:text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
            }`}
          >
            <Laptop className="h-4 w-4 text-slate-400" />
            <span>System</span>
          </button>
        </div>
      )}
    </div>
  );
}
