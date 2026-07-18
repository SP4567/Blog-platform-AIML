import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = createMetadata("Register", "Create a new account and join the community.");

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-24 lg:px-8">
      <div className="w-full max-w-xl rounded-[36px] border border-slate-200/80 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Start exploring</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Create your account</h1>
        <div className="mt-8 grid gap-4">
          <Input placeholder="Full name" />
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Button className="rounded-full">Create account</Button>
        </div>
        <div className="mt-6 text-sm text-slate-600">
          <Link href="/login" className="hover:text-slate-900">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
}
