import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { resetPasswordSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error.errors[0]?.message ?? "Invalid reset parameters." },
        { status: 400 },
      );
    }

    const { token, password } = result.data;

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Invalid or expired password reset link." },
        { status: 400 },
      );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    // Invalidate all prior sessions for security
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({
      ok: true,
      message: "Password has been successfully updated. You may now sign in with your new password.",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to reset password." },
      { status: 500 },
    );
  }
}
