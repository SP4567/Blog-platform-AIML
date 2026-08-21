import { cloneElement, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
}

export function Button({ className, variant = "default", size = "default", asChild = false, children, ...props }: ButtonProps) {
  const variants = {
    default: "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200",
    outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-12 px-6",
  };

  const buttonClassName = cn("inline-flex items-center justify-center rounded-full font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", variants[variant], sizes[size], className);

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; children?: ReactNode }>;
    return (
      <span className={buttonClassName}>
        {cloneElement(child, {
          ...props,
          className: cn("text-inherit", child.props.className),
        } as Record<string, unknown>)}
      </span>
    );
  }

  return <button className={buttonClassName} {...props}>{children}</button>;
}
