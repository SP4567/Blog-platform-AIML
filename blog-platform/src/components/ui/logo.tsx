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
        "relative grid place-items-center bg-gradient-to-br from-indigo-600 via-violet-600 to-slate-950 text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20 transition duration-200 group-hover:scale-105 group-hover:shadow-indigo-500/35",
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
        className="transform transition-transform duration-300 group-hover:scale-110"
      >
        <defs>
          <linearGradient id="synapseGradient" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="coreGlow" x1="16" y1="10" x2="26" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
          <filter id="perceptronGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Neural Synaptic Connections */}
        <path
          d="M7 8L20 16M7 16L20 16M7 24L20 16M20 16L28 16"
          stroke="url(#synapseGradient)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Input Nodes */}
        <circle cx="7" cy="8" r="2.2" fill="#38bdf8" />
        <circle cx="7" cy="16" r="2.2" fill="#818cf8" />
        <circle cx="7" cy="24" r="2.2" fill="#c084fc" />

        {/* Activation Ring */}
        <circle
          cx="20"
          cy="16"
          r="5.5"
          stroke="url(#synapseGradient)"
          strokeWidth="1.5"
          strokeDasharray="2 1.5"
          opacity="0.6"
        />

        {/* Central Perceptron Activation Nucleus */}
        <circle
          cx="20"
          cy="16"
          r="3.8"
          fill="url(#coreGlow)"
          filter="url(#perceptronGlow)"
        />

        {/* Output Node */}
        <circle cx="28" cy="16" r="1.8" fill="#ffffff" />
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
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-500 dark:text-indigo-400">
            The
          </span>
          <span
            className={cn(
              "font-extrabold tracking-tight text-slate-950 dark:text-white transition group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
              textSizeMap[size],
            )}
          >
            Perceptron
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
