import Link from "next/link";
import { HeroSection } from "@/components/sections/hero-section";
import { LatestPosts } from "@/components/sections/latest-posts";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllCategories, getPublishedPosts } from "@/lib/content";

export const revalidate = 60; // ISR revalidation every 60 seconds

export default async function Home() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getAllCategories(),
  ]);

  const featuredPosts = posts.filter((p) => p.featured);

  return (
    <div>
      <HeroSection featured={featuredPosts.length > 0 ? featuredPosts : posts.slice(0, 2)} />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="bg-slate-950 text-white border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Popular categories</CardTitle>
              <CardDescription className="text-slate-400">Curated lanes for builders who want depth, signal, and perspective.</CardDescription>
            </CardHeader>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <Badge className="bg-white/10 text-slate-100 hover:bg-white/20 transition cursor-pointer">
                    {category.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            {posts.slice(0, 4).map((post) => (
              <Link key={post.id} href={`/post/${post.slug}`} className="block">
                <Card className="h-full hover:border-slate-300 transition">
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-base">{post.title}</CardTitle>
                    <CardDescription>{post.author?.name ?? "Author"}</CardDescription>
                  </CardHeader>
                  <p className="text-sm leading-6 text-slate-600 line-clamp-2 px-6 pb-6">{post.excerpt}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <LatestPosts posts={posts} categories={categories} />
      <NewsletterSection />
    </div>
  );
}
