import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, isStaff } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ ok: false, error: "Unauthorized. Staff credentials required." }, { status: 403 });
  }

  try {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalUsers,
      totalComments,
      totalSubscribers,
      totalMessages,
      viewsAggregate,
      recentUsers,
      recentPosts,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "published" } }),
      prisma.post.count({ where: { status: "draft" } }),
      prisma.user.count(),
      prisma.comment.count(),
      prisma.newsletterSubscription.count(),
      prisma.contactMessage.count(),
      prisma.post.aggregate({
        _sum: { views: true },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          views: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalUsers,
        totalComments,
        totalSubscribers,
        totalMessages,
        totalViews: viewsAggregate._sum.views ?? 0,
      },
      recentUsers,
      recentPosts,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to load analytics." },
      { status: 500 },
    );
  }
}
