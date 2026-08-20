import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, hashPassword, verifyPassword } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { profileUpdateSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      location: true,
      website: true,
      image: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          bookmarks: true,
          likes: true,
          comments: true,
        },
      },
    },
  });

  return NextResponse.json({ ok: true, profile });
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    const result = profileUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error.errors[0]?.message ?? "Invalid profile parameters." },
        { status: 400 },
      );
    }

    const { name, bio, location, website, image, currentPassword, newPassword } = result.data;

    let updatedPasswordHash: string | undefined;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { ok: false, error: "Current password is required to set a new password." },
          { status: 400 },
        );
      }

      const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (!fullUser?.passwordHash) {
        return NextResponse.json({ ok: false, error: "Unable to verify current password." }, { status: 400 });
      }

      const isCurrentValid = await verifyPassword(currentPassword, fullUser.passwordHash);
      if (!isCurrentValid) {
        return NextResponse.json({ ok: false, error: "Incorrect current password." }, { status: 400 });
      }

      updatedPasswordHash = await hashPassword(newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(location !== undefined ? { location } : {}),
        ...(website !== undefined ? { website } : {}),
        ...(image !== undefined ? { image } : {}),
        ...(updatedPasswordHash ? { passwordHash: updatedPasswordHash } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        location: true,
        website: true,
        image: true,
      },
    });

    return NextResponse.json({ ok: true, profile: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to update profile." },
      { status: 500 },
    );
  }
}
