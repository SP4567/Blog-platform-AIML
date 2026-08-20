import { prisma } from "@/lib/db";
import { categories as fallbackCategories, posts as fallbackPosts, tags as fallbackTags } from "@/lib/data";
import type { Category, Post, Tag } from "@/lib/types";

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "published" },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            bio: true,
            location: true,
          },
        },
        category: true,
        tags: true,
        _count: {
          select: {
            likedBy: true,
            commentsList: true,
            bookmarkedBy: true,
          },
        },
      },
    });

    if (!posts || posts.length === 0) {
      return fallbackPosts as unknown as Post[];
    }

    return posts.map((post) => ({
      ...post,
      status: post.status as Post["status"],
      likes: post._count.likedBy,
      comments: post._count.commentsList,
      bookmarks: post._count.bookmarkedBy,
      author: {
        ...post.author,
        role: post.author.role as Post["author"]["role"],
        avatar: post.author.image,
        handle: post.author.name?.toLowerCase().replace(/\s+/g, "") ?? "author",
        followers: 1200,
      },
    })) as unknown as Post[];
  } catch {
    return fallbackPosts as unknown as Post[];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            bio: true,
            location: true,
            website: true,
          },
        },
        category: true,
        tags: true,
        commentsList: {
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: {
            likedBy: true,
            commentsList: true,
            bookmarkedBy: true,
          },
        },
      },
    });

    if (!post) {
      const fallback = fallbackPosts.find((p) => p.slug === slug);
      return fallback ? (fallback as unknown as Post) : null;
    }

    return {
      ...post,
      status: post.status as Post["status"],
      likes: post._count.likedBy,
      comments: post._count.commentsList,
      bookmarks: post._count.bookmarkedBy,
      author: {
        ...post.author,
        role: post.author.role as Post["author"]["role"],
        avatar: post.author.image,
        handle: post.author.name?.toLowerCase().replace(/\s+/g, "") ?? "author",
        followers: 1200,
      },
    } as unknown as Post;
  } catch {
    const fallback = fallbackPosts.find((p) => p.slug === slug);
    return fallback ? (fallback as unknown as Post) : null;
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!categories || categories.length === 0) {
      return fallbackCategories;
    }

    return categories;
  } catch {
    return fallbackCategories;
  }
}

export async function getAllTags(): Promise<Tag[]> {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!tags || tags.length === 0) {
      return fallbackTags;
    }

    return tags.map((t) => ({ ...t, posts: t._count.posts }));
  } catch {
    return fallbackTags;
  }
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "published",
        category: { slug: categorySlug },
      },
      orderBy: { publishedAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            bio: true,
            location: true,
          },
        },
        category: true,
        tags: true,
        _count: {
          select: {
            likedBy: true,
            commentsList: true,
            bookmarkedBy: true,
          },
        },
      },
    });

    if (!posts || posts.length === 0) {
      return fallbackPosts.filter((p) => p.category.slug === categorySlug) as unknown as Post[];
    }

    return posts.map((post) => ({
      ...post,
      status: post.status as Post["status"],
      likes: post._count.likedBy,
      comments: post._count.commentsList,
      bookmarks: post._count.bookmarkedBy,
      author: {
        ...post.author,
        role: post.author.role as Post["author"]["role"],
        avatar: post.author.image,
        handle: post.author.name?.toLowerCase().replace(/\s+/g, "") ?? "author",
        followers: 1200,
      },
    })) as unknown as Post[];
  } catch {
    return fallbackPosts.filter((p) => p.category.slug === categorySlug) as unknown as Post[];
  }
}

export async function getPostsByTag(tagSlug: string): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "published",
        tags: { some: { slug: tagSlug } },
      },
      orderBy: { publishedAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            bio: true,
            location: true,
          },
        },
        category: true,
        tags: true,
        _count: {
          select: {
            likedBy: true,
            commentsList: true,
            bookmarkedBy: true,
          },
        },
      },
    });

    if (!posts || posts.length === 0) {
      return fallbackPosts.filter((p) => p.tags.some((t) => t.slug === tagSlug)) as unknown as Post[];
    }

    return posts.map((post) => ({
      ...post,
      status: post.status as Post["status"],
      likes: post._count.likedBy,
      comments: post._count.commentsList,
      bookmarks: post._count.bookmarkedBy,
      author: {
        ...post.author,
        role: post.author.role as Post["author"]["role"],
        avatar: post.author.image,
        handle: post.author.name?.toLowerCase().replace(/\s+/g, "") ?? "author",
        followers: 1200,
      },
    })) as unknown as Post[];
  } catch {
    return fallbackPosts.filter((p) => p.tags.some((t) => t.slug === tagSlug)) as unknown as Post[];
  }
}
