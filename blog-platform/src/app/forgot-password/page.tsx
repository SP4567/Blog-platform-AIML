import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = createMetadata("Forgot Password", "Recover access to your account with a secure password reset flow.");

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-24 lg:px-8">
      <div className="w-full max-w-xl rounded-[36px] border border-slate-200/80 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Reset access</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Forgot your password?</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">We will email you a secure link to regain access.</p>
        <div className="mt-8 grid gap-4">
          <Input placeholder="Email" type="email" />
          <Button className="rounded-full">Send reset link</Button>
        </div>
        <div className="mt-6 text-sm text-slate-600">
          <Link href="/login" className="hover:text-slate-900">Return to sign in</Link>
        </div>
      </div>
    </div>
  );
}
