"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (!response.ok) {
      setStatus("error");
      const firstError = data.errors ? (Object.values(data.errors).flat()[0] as string) : undefined;
      setMessage(firstError || data.message || "We were unable to deliver your message.");
      return;
    }

    setStatus("success");
    setMessage(data.message);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8">
      <div className="grid gap-8 rounded-[40px] border border-slate-200/80 bg-white p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[0.9fr_1.1fr] transition-colors">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Contact</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">Talk with the editorial team</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">We welcome partnership ideas, integration requests, and feedback from communities building modern publishing experiences.</p>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Input placeholder="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <Input placeholder="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <textarea
            className="min-h-32 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600"
            placeholder="How can we help?"
            value={form.message}
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
            required
          />
          <Button type="submit" className="rounded-full">{status === "loading" ? "Sending…" : "Send message"}</Button>
        </form>
      </div>
      {message ? <p className={`mt-4 text-sm ${status === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{message}</p> : null}
    </div>
  );
}
