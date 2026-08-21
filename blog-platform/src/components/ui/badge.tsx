import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "secondary";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles =
    variant === "outline"
      ? "border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
      : variant === "secondary"
      ? "bg-slate-800 text-white dark:bg-slate-700 dark:text-slate-100"
      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs sm:text-sm font-medium transition",
        variantStyles,
        className,
      )}
      {...props}
    />
  );
}
