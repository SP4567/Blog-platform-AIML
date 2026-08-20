"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn(email, password);
    setIsLoading(false);

    if (!result.ok) {
      setError(result.error ?? "Invalid email or password.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-24 lg:px-8">
      <div className="w-full max-w-xl rounded-[36px] border border-slate-200/80 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Welcome back</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Sign in to Northstar Journal</h1>
        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
          <Button type="submit" disabled={isLoading} className="rounded-full">
            {isLoading ? "Signing in…" : "Continue"}
          </Button>
        </form>
        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <Link href="/forgot-password" className="hover:text-slate-900 font-medium">Forgot password?</Link>
          <Link href="/register" className="hover:text-slate-900 font-medium">Create account</Link>
        </div>
      </div>
    </div>
  );
}
