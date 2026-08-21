import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-950 text-slate-300 dark:border-slate-800 dark:bg-black/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Logo size="md" className="[&_span]:text-white dark:[&_span]:text-white" />
          <p className="mt-3 max-w-md text-sm text-slate-400">A polished publishing platform for ambitious teams building the next wave of editorial products.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/about" className="transition hover:text-white">About</Link>
          <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
          <Link href="/terms" className="transition hover:text-white">Terms</Link>
          <Link href="/contact" className="transition hover:text-white">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
