import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { postSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const tagSlug = searchParams.get("tag");
    const authorId = searchParams.get("authorId");
    const status = searchParams.get("status") ?? "published";
    const search = searchParams.get("q")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10)));
    const skip = (page - 1) * limit;

    // Optional user context for likes/bookmarks
    const user = await getAuthenticatedUser(request);

    const where: Record<string, unknown> = {};

    if (status !== "all") {
      where.status = status;
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (tagSlug) {
      where.tags = { some: { slug: tagSlug } };
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        skip,
        take: limit,
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
              commentsList: true,
              likedBy: true,
              bookmarkedBy: true,
            },
          },
          likedBy: user ? { where: { userId: user.id } } : false,
          bookmarkedBy: user ? { where: { userId: user.id } } : false,
        },
      }),
      prisma.post.count({ where }),
    ]);

    const formattedPosts = posts.map((post) => ({
      ...post,
      likes: post._count.likedBy,
      comments: post._count.commentsList,
      bookmarks: post._count.bookmarkedBy,
      isLiked: user ? (post.likedBy?.length ?? 0) > 0 : false,
      isBookmarked: user ? (post.bookmarkedBy?.length ?? 0) > 0 : false,
    }));

    return NextResponse.json({
      ok: true,
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to load posts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized. Please sign in to create a post." }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    const result = postSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error.errors[0]?.message ?? "Invalid post data." },
        { status: 400 },
      );
    }

    const { title, slug, excerpt, content, categoryId, tags, image, status, featured, readTime } = result.data;

    // Check slug uniqueness
    const existingPost = await prisma.post.findUnique({ where: { slug } });
    if (existingPost) {
      return NextResponse.json(
        { ok: false, error: "A post with this URL slug already exists. Please choose a different title or slug." },
        { status: 409 },
      );
    }

    // Connect or create tags
    const tagConnectOrCreate = (tags ?? []).map((tagName: string) => {
      const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return {
        where: { slug: tagSlug },
        create: { name: tagName.trim(), slug: tagSlug },
      };
    });

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        categoryId,
        authorId: user.id,
        image: image || null,
        status: status ?? "published",
        featured: featured ?? false,
        readTime: readTime ?? "5 min read",
        publishedAt: status === "published" ? new Date() : new Date(),
        tags: {
          connectOrCreate: tagConnectOrCreate,
        },
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    return NextResponse.json({ ok: true, post: newPost }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to create post." },
      { status: 500 },
    );
  }
}
