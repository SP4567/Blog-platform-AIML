import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6 py-24 lg:px-8">
      <div className="rounded-[40px] border border-slate-200/80 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">404</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">The page you are looking for doesn’t exist.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">It may have moved, or the link could be outdated.</p>
        <div className="mt-8 flex justify-center">
          <Button asChild className="rounded-full dark:bg-indigo-600 dark:hover:bg-indigo-500">
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
