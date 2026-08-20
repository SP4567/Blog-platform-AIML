"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    setResetUrl(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Failed to request password reset.");
        return;
      }

      setStatus("success");
      setMessage(data.message);
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-24 lg:px-8">
      <div className="w-full max-w-xl rounded-[36px] border border-slate-200/80 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Reset access</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Forgot your password?</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">Enter your account email to receive secure recovery instructions.</p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <Input
            placeholder="name@company.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {message ? (
            <div className={`flex items-start gap-2 text-sm p-3.5 rounded-2xl ${
              status === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}>
              {status === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
              <div>
                <p>{message}</p>
                {resetUrl ? (
                  <p className="mt-2 text-xs">
                    Development link: <Link href={resetUrl} className="font-semibold underline text-emerald-900">Click here to reset password</Link>
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          <Button type="submit" disabled={status === "loading"} className="rounded-full">
            {status === "loading" ? "Sending link…" : "Send reset link"}
          </Button>
        </form>
        <div className="mt-6 text-sm text-slate-600">
          <Link href="/login" className="hover:text-slate-900 font-medium">Return to sign in</Link>
        </div>
      </div>
    </div>
  );
}
