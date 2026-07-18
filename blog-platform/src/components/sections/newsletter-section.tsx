"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubscribe() {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.email?.[0] ?? "Unable to subscribe.");
      }

      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to subscribe.");
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="rounded-[32px] border border-slate-200/80 bg-slate-950 px-8 py-12 text-white shadow-2xl shadow-slate-300/60">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Newsletter</p>
            <h2 className="mt-2 text-3xl font-semibold">Weekly insights for builders, authors, and product teams.</h2>
            <p className="mt-3 text-slate-400">Subscribe for editorial notes, product updates, and launch-ready ideas each Friday.</p>
          </div>
          <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Email address"
              className="bg-white text-slate-900"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button type="button" onClick={handleSubscribe} className="rounded-full bg-white text-slate-950 hover:bg-slate-100">
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </Button>
          </div>
        </div>
        {message ? <p className={`mt-4 text-sm ${status === "success" ? "text-emerald-300" : "text-rose-300"}`}>{message}</p> : null}
      </div>
    </section>
  );
}
