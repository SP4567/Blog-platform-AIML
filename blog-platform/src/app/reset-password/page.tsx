"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!token) {
      setStatus("error");
      setMessage("Reset token is missing from the link. Please request a fresh reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Failed to reset password.");
        return;
      }

      setStatus("success");
      setMessage(data.message);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-24 lg:px-8">
      <div className="w-full max-w-xl rounded-[36px] border border-slate-200/80 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Secure recovery</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Choose a new password</h1>
        <p className="mt-2 text-sm text-slate-600">Ensure your new password contains at least 6 characters.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <Input
            placeholder="New password (min 6 characters)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            placeholder="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {message ? (
            <div className={`flex items-center gap-2 text-sm p-3.5 rounded-2xl ${
              status === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}>
              {status === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
              <span>{message}</span>
            </div>
          ) : null}

          <Button type="submit" disabled={status === "loading" || status === "success"} className="rounded-full">
            {status === "loading" ? "Updating password…" : "Save new password"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-slate-600">
          <Link href="/login" className="hover:text-slate-900 font-medium">Return to sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32 text-slate-400 gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
        <span>Loading recovery flow…</span>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
