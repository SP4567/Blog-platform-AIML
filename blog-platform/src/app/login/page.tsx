import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = createMetadata("Login", "Sign in to your account and continue your publishing workflow.");

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-24 lg:px-8">
      <div className="w-full max-w-xl rounded-[36px] border border-slate-200/80 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Welcome back</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Sign in to Northstar Journal</h1>
        <div className="mt-8 grid gap-4">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Button className="rounded-full">Continue</Button>
        </div>
        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <Link href="/forgot-password" className="hover:text-slate-900">Forgot password?</Link>
          <Link href="/register" className="hover:text-slate-900">Create account</Link>
        </div>
      </div>
    </div>
  );
}
