import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, isStaff } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { postSchema } from "@/lib/validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser(request);

    // Support both ID and Slug fetching
    const post = await prisma.post.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
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
            bookmarkedBy: true,
            commentsList: true,
          },
        },
        likedBy: user ? { where: { userId: user.id } } : false,
        bookmarkedBy: user ? { where: { userId: user.id } } : false,
      },
    });

    if (!post) {
      return NextResponse.json({ ok: false, error: "Post not found" }, { status: 404 });
    }

    // Increment views asynchronously
    prisma.post
      .update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      })
      .catch(() => {});

    const formattedPost = {
      ...post,
      likes: post._count.likedBy,
      comments: post._count.commentsList,
      bookmarks: post._count.bookmarkedBy,
      isLiked: user ? (post.likedBy?.length ?? 0) > 0 : false,
      isBookmarked: user ? (post.bookmarkedBy?.length ?? 0) > 0 : false,
    };

    return NextResponse.json({ ok: true, post: formattedPost });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to fetch post" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existingPost = await prisma.post.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingPost) {
      return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
    }

    // Check permissions
    if (existingPost.authorId !== user.id && !isStaff(user.role)) {
      return NextResponse.json({ ok: false, error: "Forbidden. You cannot edit this post." }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const result = postSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error.errors[0]?.message ?? "Invalid update payload." },
        { status: 400 },
      );
    }

    const { title, slug, excerpt, content, categoryId, tags, image, status, featured, readTime } = result.data;

    // Verify slug uniqueness if slug changed
    if (slug && slug !== existingPost.slug) {
      const slugConflict = await prisma.post.findUnique({ where: { slug } });
      if (slugConflict && slugConflict.id !== existingPost.id) {
        return NextResponse.json({ ok: false, error: "Slug is already taken by another post." }, { status: 409 });
      }
    }

    const tagConnectOrCreate = tags
      ? tags.map((tagName: string) => {
          const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          return {
            where: { slug: tagSlug },
            create: { name: tagName.trim(), slug: tagSlug },
          };
        })
      : undefined;

    const updatedPost = await prisma.post.update({
      where: { id: existingPost.id },
      data: {
        ...(title ? { title } : {}),
        ...(slug ? { slug } : {}),
        ...(excerpt ? { excerpt } : {}),
        ...(content ? { content } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(image !== undefined ? { image } : {}),
        ...(status ? { status } : {}),
        ...(featured !== undefined ? { featured } : {}),
        ...(readTime ? { readTime } : {}),
        ...(tagConnectOrCreate ? { tags: { set: [], connectOrCreate: tagConnectOrCreate } } : {}),
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    return NextResponse.json({ ok: true, post: updatedPost });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to update post." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existingPost = await prisma.post.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingPost) {
      return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
    }

    // Check permissions
    if (existingPost.authorId !== user.id && user.role !== "administrator" && user.role !== "super_admin") {
      return NextResponse.json({ ok: false, error: "Forbidden. You cannot delete this post." }, { status: 403 });
    }

    await prisma.post.delete({ where: { id: existingPost.id } });

    return NextResponse.json({ ok: true, message: "Post deleted successfully." });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to delete post." },
      { status: 500 },
    );
  }
}
