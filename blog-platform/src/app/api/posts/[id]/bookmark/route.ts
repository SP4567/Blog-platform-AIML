import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Please sign in to bookmark this post." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const post = await prisma.post.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!post) {
      return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
    }

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: post.id,
        },
      },
    });

    let isBookmarked = false;

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      isBookmarked = false;
    } else {
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          postId: post.id,
        },
      });
      isBookmarked = true;
    }

    const bookmarksCount = await prisma.bookmark.count({
      where: { postId: post.id },
    });

    return NextResponse.json({ ok: true, isBookmarked, bookmarksCount });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to toggle bookmark." },
      { status: 500 },
    );
  }
}
