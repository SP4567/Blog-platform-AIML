import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, isAdmin } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ ok: false, error: "Unauthorized. Administrator rights required." }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        bio: true,
        location: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json({ ok: true, users });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to load users." },
      { status: 500 },
    );
  }
}
