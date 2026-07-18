import Link from "next/link";
import { Search, PenSquare, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">NJ</span>
          <span>Northstar Journal</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link href="/about" className="transition hover:text-slate-950">About</Link>
          <Link href="/search" className="transition hover:text-slate-950">Discover</Link>
          <Link href="/dashboard" className="transition hover:text-slate-950">Dashboard</Link>
          <Link href="/admin" className="transition hover:text-slate-950">Admin</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/search" className="hidden rounded-full border border-slate-200 p-2.5 text-slate-700 md:flex">
            <Search className="h-4 w-4" />
          </Link>
          <Link href="/dashboard/posts" className="hidden rounded-full border border-slate-200 p-2.5 text-slate-700 md:flex">
            <PenSquare className="h-4 w-4" />
          </Link>
          <Link href="/notifications" className="hidden rounded-full border border-slate-200 p-2.5 text-slate-700 md:flex">
            <BellRing className="h-4 w-4" />
          </Link>
          <Button asChild className="rounded-full">
            <Link href="/login" className="text-white">Sign in</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
