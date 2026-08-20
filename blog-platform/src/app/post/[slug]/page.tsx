import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { getPostBySlug } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { PostEngagement } from "@/components/blog/post-engagement";
import { CommentsSection } from "@/components/blog/comments-section";
import { AIReaderCompanion } from "@/components/blog/ai-reader-companion";
import { Calendar, Clock, User as UserIcon } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return createMetadata("Post Not Found");
  return createMetadata(post.title, post.excerpt);
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const fallbackImage = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <article className="overflow-hidden rounded-[40px] border border-slate-200/80 bg-white shadow-sm">
        <div className="relative h-80 sm:h-96 w-full bg-slate-100">
          <Image
            src={post.image || fallbackImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
        <div className="p-8 sm:p-12">
          <div className="flex flex-wrap items-center gap-2">
            {post.category ? (
              <Link href={`/category/${post.category.slug}`}>
                <Badge className="cursor-pointer hover:bg-slate-200 transition">{post.category.name}</Badge>
              </Link>
            ) : null}
            {post.tags?.map((tag) => (
              <Link key={tag.id} href={`/tag/${tag.slug}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-slate-100 transition">#{tag.name}</Badge>
              </Link>
            ))}
          </div>

          <h1 className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 leading-tight">
            {post.title}
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600 font-normal">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-500 pb-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-800">
              <UserIcon className="h-4 w-4 text-slate-400" />
              {post.author?.name ?? "Author"}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-400" />
              {post.readTime}
            </span>
          </div>

          <PostEngagement
            postId={post.id}
            postSlug={post.slug}
            initialLikes={post.likes ?? 0}
            initialBookmarks={post.bookmarks ?? 0}
            initialIsLiked={post.isLiked ?? false}
            initialIsBookmarked={post.isBookmarked ?? false}
          />

          <div className="prose prose-slate max-w-none text-lg leading-8 text-slate-800 space-y-6 pt-4 whitespace-pre-wrap">
            {post.content}
          </div>

          {/* AI Reader Companion (Key Takeaways & Grounded Q&A) */}
          <AIReaderCompanion
            articleTitle={post.title}
            articleContent={post.content}
          />

          {/* Author Card */}
          {post.author ? (
            <div className="mt-12 rounded-3xl bg-slate-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-slate-200">
                <Image
                  src={post.author.avatar || post.author.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"}
                  alt={post.author.name ?? "Author"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Written by</p>
                <h3 className="text-lg font-bold text-slate-950 mt-1">{post.author.name}</h3>
                <p className="text-sm text-slate-600 mt-2">{post.author.bio ?? "Contributing technical writer and systems builder at Northstar Journal."}</p>
                {post.author.location ? (
                  <p className="text-xs text-slate-400 mt-1">Based in {post.author.location}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Discussion & Comments */}
          <CommentsSection
            postId={post.id}
            postSlug={post.slug}
            initialComments={post.commentsList ?? []}
          />
        </div>
      </article>
    </div>
  );
}
