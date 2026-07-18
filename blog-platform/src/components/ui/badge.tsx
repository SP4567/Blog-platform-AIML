import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700", className)} {...props} />;
}
