import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, isAdmin } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateUserRoleSchema = z.object({
  role: z.enum(["visitor", "registered_user", "author", "editor", "moderator", "administrator", "super_admin"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser(request);
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ ok: false, error: "Unauthorized. Administrator rights required." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const result = updateUserRoleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error.errors[0]?.message ?? "Invalid role." },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: result.data.role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ ok: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to update user." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser(request);
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ ok: false, error: "Unauthorized. Administrator rights required." }, { status: 403 });
  }

  try {
    const { id } = await params;

    if (id === user.id) {
      return NextResponse.json({ ok: false, error: "You cannot delete your own admin account." }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ ok: true, message: "User account deleted." });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to delete user." },
      { status: 500 },
    );
  }
}
