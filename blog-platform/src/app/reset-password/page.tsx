import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = createMetadata("Reset Password", "Choose a fresh password to recover your account.");

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-24 lg:px-8">
      <div className="w-full max-w-xl rounded-[36px] border border-slate-200/80 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Secure recovery</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Choose a new password</h1>
        <div className="mt-8 grid gap-4">
          <Input placeholder="New password" type="password" />
          <Input placeholder="Confirm password" type="password" />
          <Button className="rounded-full">Save password</Button>
        </div>
      </div>
    </div>
  );
}
