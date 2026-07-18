import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata("About", "Learn about the platform architecture, editorial principles, and the team behind Northstar Journal.");

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8">
      <div className="rounded-[40px] border border-slate-200/80 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">About the platform</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">An enterprise-grade publishing platform designed for speed, trust, and clarity.</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">Northstar Journal brings together clean architecture, feature-rich editorial tools, strong moderation workflows, analytics, and accessibility standards for ambitious teams.</p>
      </div>
    </div>
  );
}
