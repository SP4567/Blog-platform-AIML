import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-950/95 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-lg font-semibold text-white">Northstar Journal</p>
          <p className="mt-2 max-w-md text-sm text-slate-400">A polished publishing platform for ambitious teams building the next wave of editorial products.</p>
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
