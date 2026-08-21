import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata("Terms of Service", "Read the service terms applied to readers, authors, and administrators.");

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8">
      <div className="rounded-[40px] border border-slate-200/80 bg-white p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <h1 className="text-4xl font-semibold text-slate-950 dark:text-white">Terms of service</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">The service is available for lawful publishing, reading, commenting, and moderation. Users should not upload harmful content, bypass security controls, or abuse the platform.</p>
      </div>
    </div>
  );
}
