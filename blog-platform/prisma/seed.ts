import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.comment.deleteMany().catch(() => {});
  await prisma.postLike.deleteMany().catch(() => {});
  await prisma.bookmark.deleteMany().catch(() => {});
  await prisma.session.deleteMany().catch(() => {});
  await prisma.post.deleteMany().catch(() => {});
  await prisma.tag.deleteMany().catch(() => {});
  await prisma.category.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

  // 1. Create Users
  const adminPasswordHash = await bcrypt.hash("AdminPass123!", 10);
  const authorPasswordHash = await bcrypt.hash("AuthorPass123!", 10);
  const readerPasswordHash = await bcrypt.hash("ReaderPass123!", 10);

  const admin = await prisma.user.create({
    data: {
      email: "suyashpandey9611@gmail.com",
      name: "Suyash Pandey",
      role: "administrator",
      bio: "Platform Admin, Software Engineer",
      location: "India",
      website: "https://theperceptron.dev",
      image: "/avatars/suyash.jpeg",
      passwordHash: adminPasswordHash,
      emailVerified: true,
    },
  });

  await prisma.user.create({
    data: {
      email: "suyashpandey668@gmail.com",
      name: "Suyash Pandey",
      role: "administrator",
      bio: "Platform Admin, Software Engineer",
      location: "India",
      website: "https://theperceptron.dev",
      image: "/avatars/suyash.jpeg",
      passwordHash: adminPasswordHash,
      emailVerified: true,
    },
  }).catch(() => {});

  const mina = await prisma.user.create({
    data: {
      email: "mina@northstar-journal.dev",
      name: "Mina Chen",
      role: "author",
      bio: "Principal engineer building AI-native products and resilient distributed systems.",
      location: "Seattle, USA",
      website: "https://minachen.dev",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      passwordHash: authorPasswordHash,
      emailVerified: true,
    },
  });

  const ravi = await prisma.user.create({
    data: {
      email: "ravi@northstar-journal.dev",
      name: "Ravi Patel",
      role: "editor",
      bio: "Editorial strategist focused on product design, developer tooling, and growth.",
      location: "London, UK",
      website: "https://ravipatel.design",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      passwordHash: authorPasswordHash,
      emailVerified: true,
    },
  });

  const reader = await prisma.user.create({
    data: {
      email: "reader@example.com",
      name: "Alex Morgan",
      role: "registered_user",
      bio: "Software developer and avid reader of technical deep-dives.",
      location: "Austin, USA",
      passwordHash: readerPasswordHash,
      emailVerified: true,
    },
  });

  // 2. Create Categories
  const catAI = await prisma.category.create({
    data: {
      name: "AI Engineering",
      slug: "ai-engineering",
      description: "Practical systems, infrastructure, and architectural blueprints for modern AI products.",
      color: "from-cyan-500 to-sky-600",
    },
  });

  const catDesign = await prisma.category.create({
    data: {
      name: "Product Design",
      slug: "product-design",
      description: "Design systems, human-centered UX strategy, and interaction patterns.",
      color: "from-violet-500 to-fuchsia-600",
    },
  });

  const catInfra = await prisma.category.create({
    data: {
      name: "Infrastructure",
      slug: "infrastructure",
      description: "Reliability, cloud operations, observability, and zero-downtime continuous delivery.",
      color: "from-emerald-500 to-lime-600",
    },
  });

  const catDevExp = await prisma.category.create({
    data: {
      name: "Developer Experience",
      slug: "developer-experience",
      description: "Build tools, documentation engines, and workflows that scale engineering velocity.",
      color: "from-amber-500 to-orange-600",
    },
  });

  // 3. Create Tags
  const tagNextjs = await prisma.tag.create({ data: { name: "Next.js", slug: "nextjs" } });
  const tagTypeScript = await prisma.tag.create({ data: { name: "TypeScript", slug: "typescript" } });
  const tagPerformance = await prisma.tag.create({ data: { name: "Performance", slug: "performance" } });
  const tagDesignSys = await prisma.tag.create({ data: { name: "Design Systems", slug: "design-systems" } });
  const tagArchitecture = await prisma.tag.create({ data: { name: "Architecture", slug: "architecture" } });

  // 4. Create Posts
  const post1 = await prisma.post.create({
    data: {
      slug: "building-reliable-ai-platforms",
      title: "Building reliable AI platforms for product teams",
      excerpt: "A pragmatic blueprint for shipping feature-rich AI products with operational confidence and strict observability.",
      content: `## The Anatomy of an AI-Native Platform

The foundation of a reliable AI platform is not just model quality, but observability, governance, and a clean delivery workflow. In this article, we break down the architecture, roles, and rollout checklist that keep AI experiences dependable from day one.

### 1. Unified Observability & Tracing
Every inference call, tool execution, and vector retrieval must be traced with structured logs. When models degrade or latency spikes, distributed tracing across services isolates bottlenecks immediately.

### 2. Guardrails and Schema Validation
Never trust unformatted LLM outputs. Enforce rigid Zod schema validations on every generation and fail gracefully when tokens fail to parse.

### 3. Progressive Rollout & Fallbacks
Always maintain fallback pathways (cached embeddings, deterministic heuristics, or lighter secondary models) to guarantee 99.99% uptime regardless of upstream cloud outages.`,
      status: "published",
      publishedAt: new Date("2026-07-17T10:00:00.000Z"),
      readTime: "8 min read",
      featured: true,
      featuredOrder: 1,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
      views: 2450,
      authorId: mina.id,
      categoryId: catAI.id,
      tags: { connect: [{ id: tagNextjs.id }, { id: tagTypeScript.id }, { id: tagArchitecture.id }] },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      slug: "designing-a-remarkable-editor-experience",
      title: "Designing a remarkable editor experience",
      excerpt: "How to build a writing workspace that feels calm, focused, and professional across every modern device.",
      content: `## Crafting the Calm Writing Workspace

An author-first editor experience comes from the right blend of performance, affordance, and clarity. The article highlights the patterns that reduce friction while preserving rich formatting and accessibility.

### Micro-Interactions that Matter
- **Zero-lag typing**: Eliminate unnecessary state re-renders during high-speed typing sessions.
- **Contextual floating toolbars**: Surface formatting options precisely when text is highlighted.
- **Autosave indicators**: Provide subtle, reassuring status feedback without disruptive alerts.

### Accessible Markdown Shortcuts
Power writers prefer markdown syntax (# headings, - lists, > blockquotes) directly in the flow without needing to reach for the mouse.`,
      status: "published",
      publishedAt: new Date("2026-07-12T14:30:00.000Z"),
      readTime: "6 min read",
      featured: true,
      featuredOrder: 2,
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
      views: 1890,
      authorId: ravi.id,
      categoryId: catDesign.id,
      tags: { connect: [{ id: tagDesignSys.id }, { id: tagPerformance.id }] },
    },
  });

  const post3 = await prisma.post.create({
    data: {
      slug: "scale-your-infra-with-confidence",
      title: "Scale your infrastructure with confidence",
      excerpt: "Operational discipline, cost tracking, and resilience design are no longer optional for modern web applications.",
      content: `## Modern Infrastructure Operations

From deployment pipelines to observability, great engineering teams need a clear playbook to scale. We outline the platform controls and rituals that support steady growth without reducing quality.

### Key Tenets
1. **Immutable Deployments**: Ship containerized artifacts with verified cryptographic hashes.
2. **Stateless App Nodes**: Offload sessions to Redis or distributed stores, keeping Next.js server instances ephemeral and easily scalable.
3. **Database Health Monitoring**: Implement active connection pooling and query performance analysis at every tier.`,
      status: "published",
      publishedAt: new Date("2026-07-08T09:15:00.000Z"),
      readTime: "7 min read",
      featured: true,
      featuredOrder: 3,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      views: 1420,
      authorId: mina.id,
      categoryId: catInfra.id,
      tags: { connect: [{ id: tagArchitecture.id }, { id: tagPerformance.id }] },
    },
  });

  const post4 = await prisma.post.create({
    data: {
      slug: "developer-velocity-at-scale",
      title: "Maximizing developer velocity in fast-growing engineering teams",
      excerpt: "Tools, modular component systems, and workflow automation that keep engineering teams shipping high quality code.",
      content: `## The High-Velocity Engineering Playbook

As engineering teams expand from 5 to 50+ engineers, coordination overhead can paralyze product delivery unless deliberate patterns are instituted.

### Standardized Toolchains
Adopt unified linting, typechecking, and automated PR preview environments to eliminate style debates and detect regressions before merge.`,
      status: "published",
      publishedAt: new Date("2026-07-01T11:00:00.000Z"),
      readTime: "5 min read",
      featured: false,
      featuredOrder: 4,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
      views: 980,
      authorId: admin.id,
      categoryId: catDevExp.id,
      tags: { connect: [{ id: tagTypeScript.id }, { id: tagNextjs.id }] },
    },
  });

  // 5. Create Comments & Engagement
  await prisma.comment.create({
    data: {
      body: "This is the exact operational framework our platform engineering team needed.",
      authorId: reader.id,
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      body: "The section on guardrails and schema validation saved us hours of debugging.",
      authorId: ravi.id,
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      body: "The focus on distraction-free writing ergonomics really makes a difference.",
      authorId: mina.id,
      postId: post2.id,
    },
  });

  await prisma.postLike.createMany({
    data: [
      { userId: reader.id, postId: post1.id },
      { userId: ravi.id, postId: post1.id },
      { userId: mina.id, postId: post2.id },
      { userId: reader.id, postId: post3.id },
      { userId: ravi.id, postId: post4.id },
    ],
  });

  await prisma.bookmark.createMany({
    data: [
      { userId: reader.id, postId: post1.id },
      { userId: reader.id, postId: post2.id },
      { userId: mina.id, postId: post3.id },
    ],
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
