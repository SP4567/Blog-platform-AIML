import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none ring-0 transition focus:border-slate-400", className)} {...props} />;
}
