import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredPosts } from "@/lib/data";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.16),_transparent_35%),linear-gradient(110deg,_#f8fafc_0%,_#eef2ff_100%)] px-6 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <Sparkles className="h-4 w-4 text-fuchsia-600" />
            Premium editorial platform for modern teams
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Publish, grow, and monetize with a truly premium blog experience.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Design-forward, fast, accessible, and secure — built with the architecture of leading media platforms and the flexibility of a headless CMS.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/dashboard/posts" className="text-white">Start writing</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/search" className="text-slate-900">Explore stories</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-[32px] border border-slate-200/80 bg-white/70 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Featured now</p>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-4 space-y-4">
            {featuredPosts.slice(0, 2).map((post) => (
              <Link key={post.id} href={`/post/${post.slug}`} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 transition hover:bg-white">
                <img src={post.image} alt={post.title} className="h-20 w-20 rounded-2xl object-cover" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{post.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{post.author.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
