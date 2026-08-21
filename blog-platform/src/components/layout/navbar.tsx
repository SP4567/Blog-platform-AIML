"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, PenSquare, Menu, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/ui/logo";
import Image from "next/image";

export function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === "administrator" || user?.role === "super_admin";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 text-sm text-slate-600 dark:text-slate-300 md:flex">
          <Link href="/about" className="transition hover:text-slate-950 dark:hover:text-white font-medium">About</Link>
          <Link href="/search" className="transition hover:text-slate-950 dark:hover:text-white font-medium">Discover</Link>
          {isAuthenticated ? (
            <Link href="/dashboard" className="transition hover:text-slate-950 dark:hover:text-white font-medium">Dashboard</Link>
          ) : null}
          {isAdmin ? (
            <Link href="/admin" className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-semibold transition">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin</span>
            </Link>
          ) : null}
        </nav>

        {/* Action icons & Auth */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/search" className="rounded-full border border-slate-200 p-2.5 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition" title="Search articles">
            <Search className="h-4 w-4" />
          </Link>

          <ThemeToggle />

          {isAuthenticated ? (
            <Link href="/dashboard/posts/new" className="rounded-full border border-slate-200 p-2.5 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition" title="New story">
              <PenSquare className="h-4 w-4" />
            </Link>
          ) : null}

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard/settings" className="flex items-center gap-2 hover:opacity-80 transition">
                {user.image ? (
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                    <Image src={user.image} alt={user.name ?? "User"} fill className="object-cover" sizes="32px" />
                  </div>
                ) : null}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user.name ?? user.email}</span>
              </Link>
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => void signOut()}>
                Sign out
              </Button>
            </div>
          ) : (
            <Button asChild className="rounded-full">
              <Link href="/login" className="text-white">Sign in</Link>
            </Button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle variant="button" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-slate-200 p-2 text-slate-700 dark:border-slate-800 dark:text-slate-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen ? (
        <div className="border-b border-slate-200 bg-white p-6 md:hidden space-y-4 dark:border-slate-800 dark:bg-slate-950">
          <nav className="flex flex-col gap-3 text-base text-slate-700 dark:text-slate-200">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link href="/search" onClick={() => setMobileMenuOpen(false)}>Discover</Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <Link href="/dashboard/posts/new" onClick={() => setMobileMenuOpen(false)}>Write story</Link>
              </>
            ) : null}
            {isAdmin ? (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-cyan-600 dark:text-cyan-400 font-semibold">Admin Portal</Link>
            ) : null}
          </nav>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Theme</span>
            <ThemeToggle variant="segmented" />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                <Button variant="outline" className="rounded-full w-full" onClick={() => { void signOut(); setMobileMenuOpen(false); }}>
                  Sign out
                </Button>
              </>
            ) : (
              <Button asChild className="rounded-full w-full">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-white">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
