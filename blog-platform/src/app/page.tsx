import { HeroSection } from "@/components/sections/hero-section";
import { LatestPosts } from "@/components/sections/latest-posts";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { categories, posts } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="bg-slate-950 text-white">
            <CardHeader>
              <CardTitle className="text-white">Popular categories</CardTitle>
              <CardDescription className="text-slate-400">Curated lanes for builders who want depth, signal, and perspective.</CardDescription>
            </CardHeader>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category.id} className="bg-white/10 text-slate-100">{category.name}</Badge>
              ))}
            </div>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            {posts.slice(0, 4).map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.author.name}</CardDescription>
                </CardHeader>
                <p className="text-sm leading-7 text-slate-600">{post.excerpt}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <LatestPosts />
      <NewsletterSection />
    </div>
  );
}
