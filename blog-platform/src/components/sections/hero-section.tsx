import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Post } from "@/lib/types";
import { featuredPosts as fallbackFeatured } from "@/lib/data";

export function HeroSection({ featured = [] }: { featured?: Post[] }) {
  const displayPosts = featured.length > 0 ? featured : (fallbackFeatured as unknown as Post[]);
  const fallbackImg = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80";

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
            Design-forward, fast, accessible, and secure — built with modern full-stack architecture, real-time engagement, and author workflows.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/dashboard/posts/new" className="text-white">Start writing</Link>
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
            {displayPosts.slice(0, 2).map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 transition hover:bg-white"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={post.image || fallbackImg}
                    alt={post.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 line-clamp-2">{post.title}</p>
                  <p className="mt-1 text-xs text-slate-600">{post.author?.name ?? "Author"}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
