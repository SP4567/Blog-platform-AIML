import { NextRequest, NextResponse } from "next/server";
import { createSessionForUser, hashPassword, setSessionCookie } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error.errors[0]?.message ?? "Invalid registration details." },
        { status: 400 },
      );
    }

    const { name, email, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return NextResponse.json({ ok: false, error: "An account with that email already exists." }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name.trim(),
        role: "author",
        passwordHash: hashedPassword,
        emailVerified: true,
      },
    });

    const { token, expires } = await createSessionForUser(user.id);
    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });

    setSessionCookie(response, token, expires);
    return response;
  } catch (error) {
    if (error instanceof Error && /DATABASE_URL|ECONNREFUSED|P1001|P1002/i.test(error.message)) {
      return NextResponse.json({ ok: false, error: "Database is not available right now." }, { status: 503 });
    }

    return NextResponse.json({ ok: false, error: "An unexpected error occurred during registration." }, { status: 500 });
  }
}
