"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertCircle, Sparkles, Shield, Zap, Layers } from "lucide-react";

export default function AboutPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        const firstError = data.errors ? (Object.values(data.errors).flat()[0] as string) : undefined;
        setResponseMsg(firstError || data.message || data.error || "Failed to send message.");
        return;
      }

      setStatus("success");
      setResponseMsg("Thank you! Your message has been sent to our editorial desk.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setResponseMsg("Network error. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 space-y-12">
      <div className="rounded-[40px] border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
          <Sparkles className="h-3.5 w-3.5 text-fuchsia-600 dark:text-fuchsia-400" />
          Editorial Architecture
        </div>
        <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white leading-tight">
          An enterprise-grade publishing platform designed for speed, trust, and clarity.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
          Northstar Journal brings together a resilient full-stack architecture, rich Markdown editing workflows, deep role-based access control (RBAC), robust security, and seamless reader engagement for modern technical teams.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-800/60">
            <Zap className="h-6 w-6 text-amber-500 mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Zero-Latency ISR</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Incremental Static Regeneration delivers instantaneous page loads with background revalidation.</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-800/60">
            <Shield className="h-6 w-6 text-indigo-500 mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Hardened Security</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">bcrypt hashing, HTTP-only SameSite cookies, security headers, and Zod input validation schemas.</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-800/60">
            <Layers className="h-6 w-6 text-emerald-500 mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Relational Power</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Prisma ORM with PostgreSQL backend powers post taxonomy, likes, bookmarks, and thread discussions.</p>
          </div>
        </div>
      </div>

      {/* Contact & Editorial Desk Form */}
      <Card className="rounded-[36px]">
        <CardHeader>
          <CardTitle>Get in Touch with the Editorial Desk</CardTitle>
          <CardDescription>
            Have an article proposal, editorial feedback, or partnership request? We would love to hear from you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Your Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Message / Proposal</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your pitch, article ideas, or feedback…"
                rows={4}
                required
                className="w-full rounded-2xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-600"
              />
            </div>

            {responseMsg ? (
              <div className={`flex items-center gap-2 text-sm p-3.5 rounded-2xl ${
                status === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800"
              }`}>
                {status === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                <span>{responseMsg}</span>
              </div>
            ) : null}

            <Button type="submit" disabled={status === "loading"} className="rounded-full">
              {status === "loading" ? "Sending message…" : "Send message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
