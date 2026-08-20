import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() ?? "";
    const categorySlug = searchParams.get("category");
    const tagSlug = searchParams.get("tag");

    const where: Record<string, unknown> = {
      status: "published",
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (tagSlug) {
      where.tags = { some: { slug: tagSlug } };
    }

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { excerpt: { contains: query } },
        { content: { contains: query } },
        { author: { name: { contains: query } } },
      ];
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: 30,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
        category: true,
        tags: true,
        _count: {
          select: {
            likedBy: true,
            commentsList: true,
          },
        },
      },
    });

    const results = posts.map((post) => ({
      ...post,
      likes: post._count.likedBy,
      comments: post._count.commentsList,
    }));

    return NextResponse.json({ ok: true, results, query, total: results.length });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to execute search." },
      { status: 500 },
    );
  }
}
