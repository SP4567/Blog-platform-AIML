import type { Author, Category, Post, Tag } from "@/lib/types";

export const categories: Category[] = [
  { id: "cat-1", name: "AI Engineering", slug: "ai-engineering", description: "Practical systems and architecture for modern AI products.", color: "from-cyan-500 to-sky-600" },
  { id: "cat-2", name: "Product Design", slug: "product-design", description: "Design systems, UX strategy, and human-centered product thinking.", color: "from-violet-500 to-fuchsia-600" },
  { id: "cat-3", name: "Infrastructure", slug: "infrastructure", description: "Reliability, cloud operations, and zero-downtime delivery.", color: "from-emerald-500 to-lime-600" },
  { id: "cat-4", name: "Developer Experience", slug: "developer-experience", description: "Build tools, docs, and operating models that scale teams.", color: "from-amber-500 to-orange-600" },
];

export const tags: Tag[] = [
  { id: "tag-1", name: "Next.js", slug: "nextjs", posts: 18 },
  { id: "tag-2", name: "TypeScript", slug: "typescript", posts: 24 },
  { id: "tag-3", name: "Performance", slug: "performance", posts: 14 },
  { id: "tag-4", name: "Design Systems", slug: "design-systems", posts: 11 },
];

export const authors: Author[] = [
  {
    id: "auth-1",
    name: "Mina Chen",
    handle: "mina",
    role: "author",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    bio: "Principal engineer building AI-native products at scale.",
    followers: 18420,
    location: "Seattle, USA",
  },
  {
    id: "auth-2",
    name: "Ravi Patel",
    handle: "ravi",
    role: "editor",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    bio: "Responsible for editorial strategy, growth, and platform reliability.",
    followers: 12800,
    location: "London, UK",
  },
];

export const posts: Post[] = [
  {
    id: "post-1",
    slug: "building-reliable-ai-platforms",
    title: "Building reliable AI platforms for product teams",
    excerpt: "A pragmatic blueprint for shipping feature-rich AI products with operational confidence.",
    content: "The foundation of a reliable AI platform is not just model quality, but observability, governance, and a clean delivery workflow. In this article, we break down the architecture, roles, and rollout checklist that keep AI experiences dependable from day one.",
    publishedAt: "2026-07-17",
    readTime: "8 min read",
    author: authors[0],
    category: categories[0],
    tags: [tags[0], tags[1]],
    featured: true,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    views: 22140,
    likes: 982,
    comments: 74,
    featuredOrder: 1,
  },
  {
    id: "post-2",
    slug: "designing-a-remarkable-editor-experience",
    title: "Designing a remarkable editor experience",
    excerpt: "How to build a writing workspace that feels calm, focused, and professional on every device.",
    content: "An author-first editor experience comes from the right blend of performance, affordance, and clarity. The article highlights the patterns that reduce friction while preserving rich formatting and accessibility.",
    publishedAt: "2026-07-12",
    readTime: "6 min read",
    author: authors[1],
    category: categories[1],
    tags: [tags[3]],
    featured: true,
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    views: 17892,
    likes: 654,
    comments: 38,
    featuredOrder: 2,
  },
  {
    id: "post-3",
    slug: "scale-your-infra-with-confidence",
    title: "Scale your infrastructure with confidence",
    excerpt: "Operational discipline, cost tracking, and resilience design are no longer optional for modern platforms.",
    content: "From deployment pipelines to observability, great engineering teams need a clear playbook to scale. We outline the platform controls and rituals that support steady growth without reducing quality.",
    publishedAt: "2026-07-08",
    readTime: "7 min read",
    author: authors[0],
    category: categories[2],
    tags: [tags[2], tags[1]],
    featured: false,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    views: 13600,
    likes: 487,
    comments: 21,
    featuredOrder: 3,
  },
];

export const featuredPosts = posts.filter((post) => post.featured).sort((a, b) => a.featuredOrder - b.featuredOrder);
export const latestPosts = posts.slice().sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
export const popularCategories = categories.slice(0, 3);
