import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata("Privacy Policy", "Review privacy practices for reader accounts, content publishing, and newsletter signups.");

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8">
      <div className="rounded-[40px] border border-slate-200/80 bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-semibold text-slate-950">Privacy policy</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">We use data only to provide account management, publishing workflows, analytics, and email communication. Readers can request access, correction, or deletion of personal data at any time.</p>
      </div>
    </div>
  );
}
