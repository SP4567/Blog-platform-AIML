import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Please sign in to like this post." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const post = await prisma.post.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!post) {
      return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
    }

    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: post.id,
        },
      },
    });

    let isLiked = false;

    if (existingLike) {
      await prisma.postLike.delete({
        where: { id: existingLike.id },
      });
      isLiked = false;
    } else {
      await prisma.postLike.create({
        data: {
          userId: user.id,
          postId: post.id,
        },
      });
      isLiked = true;
    }

    const likesCount = await prisma.postLike.count({
      where: { postId: post.id },
    });

    return NextResponse.json({ ok: true, isLiked, likesCount });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to toggle like." },
      { status: 500 },
    );
  }
}
