import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  href?: string;
  className?: string;
  iconOnly?: boolean;
}

export function LogoIcon({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizeMap = {
    sm: "h-7 w-7 rounded-xl",
    md: "h-9 w-9 rounded-2xl",
    lg: "h-11 w-11 rounded-2xl",
    xl: "h-14 w-14 rounded-3xl",
  };

  const svgSizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  };

  const currentSvgSize = svgSizeMap[size];

  return (
    <div
      className={cn(
        "relative grid place-items-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-950 text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20 transition duration-200 group-hover:scale-105 group-hover:shadow-indigo-500/35",
        sizeMap[size],
        className,
      )}
    >
      <svg
        width={currentSvgSize}
        height={currentSvgSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform duration-300 group-hover:rotate-12"
      >
        <defs>
          <linearGradient id="northstarGradient" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#c7d2fe" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <linearGradient id="facetGradient" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e0e7ff" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Diagonal Subtle Flares */}
        <path
          d="M16 9L18.5 13.5L23 16L18.5 18.5L16 23L13.5 18.5L9 16L13.5 13.5L16 9Z"
          fill="url(#facetGradient)"
          opacity="0.65"
        />

        {/* Primary 4-Point North Star */}
        <path
          d="M16 2C16 10 10 16 2 16C10 16 16 22 16 30C16 22 22 16 30 16C22 16 16 10 16 2Z"
          fill="url(#northstarGradient)"
          filter="url(#glow)"
        />

        {/* Facet Shading */}
        <path
          d="M16 2C16 10 10 16 2 16L16 16L16 2Z"
          fill="#ffffff"
          opacity="0.3"
        />
        <path
          d="M16 30C16 22 22 16 30 16L16 16L16 30Z"
          fill="#312e81"
          opacity="0.3"
        />

        {/* Center Diamond Core */}
        <circle cx="16" cy="16" r="2.2" fill="#ffffff" />
      </svg>
    </div>
  );
}

export function Logo({
  size = "md",
  showText = true,
  href = "/",
  className,
  iconOnly = false,
}: LogoProps) {
  const textSizeMap = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const content = (
    <div className={cn("group inline-flex items-center gap-3 select-none", className)}>
      <LogoIcon size={size} />
      {showText && !iconOnly ? (
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              "font-bold tracking-tight text-slate-950 dark:text-white transition group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
              textSizeMap[size],
            )}
          >
            Northstar
          </span>
          <span
            className={cn(
              "font-semibold tracking-tight text-slate-600 dark:text-slate-400 font-serif italic text-[0.95em]",
            )}
          >
            Journal
          </span>
        </div>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
