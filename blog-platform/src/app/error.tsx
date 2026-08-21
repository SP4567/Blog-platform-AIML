"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6 py-24 lg:px-8">
      <div className="rounded-[40px] border border-slate-200/80 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Unexpected error</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">We hit an unexpected issue while loading this view.</h1>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={() => reset()} className="rounded-full dark:bg-indigo-600 dark:hover:bg-indigo-500">Try again</Button>
          <Button variant="outline" className="rounded-full" onClick={() => window.location.assign("/")}>Go home</Button>
        </div>
      </div>
    </div>
  );
}
