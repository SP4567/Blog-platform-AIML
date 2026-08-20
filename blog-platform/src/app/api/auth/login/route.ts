import { NextRequest, NextResponse } from "next/server";
import { createSessionForUser, setSessionCookie, verifyPassword } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error.errors[0]?.message ?? "Invalid login credentials." },
        { status: 400 },
      );
    }

    const { email, password } = result.data;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    }

    const { token, expires } = await createSessionForUser(user.id);
    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        bio: user.bio,
        location: user.location,
        website: user.website,
      },
    });

    setSessionCookie(response, token, expires);
    return response;
  } catch (error) {
    if (error instanceof Error && /DATABASE_URL|ECONNREFUSED|P1001|P1002/i.test(error.message)) {
      return NextResponse.json({ ok: false, error: "Database is not available right now." }, { status: 503 });
    }

    return NextResponse.json({ ok: false, error: "An unexpected error occurred during login." }, { status: 500 });
  }
}
