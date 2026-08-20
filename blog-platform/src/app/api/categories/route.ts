import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, isStaff } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { categorySchema } from "@/lib/validation";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json({ ok: true, categories });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to load categories." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ ok: false, error: "Unauthorized. Staff permissions required." }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => null);
    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error.errors[0]?.message ?? "Invalid category data." },
        { status: 400 },
      );
    }

    const { name, slug, description, color } = result.data;

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ ok: false, error: "A category with this slug already exists." }, { status: 409 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        color: color || "from-cyan-500 to-sky-600",
      },
    });

    return NextResponse.json({ ok: true, category }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to create category." },
      { status: 500 },
    );
  }
}
