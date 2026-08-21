import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { newsletterSchema } from "@/lib/validation";
import { sendNewsletterWelcomeEmail } from "@/lib/email";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = newsletterSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  try {
    const subscription = await prisma.newsletterSubscription.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: { email: parsed.data.email },
    });

    // Send professional confirmation & welcome email
    const emailResult = await sendNewsletterWelcomeEmail(subscription.email);

    return NextResponse.json(
      {
        ok: true,
        message: "Thank you for subscribing! A welcome email has been sent to your inbox.",
        email: subscription.email,
        emailDelivered: emailResult.success,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to save newsletter subscription" },
      { status: 500 },
    );
  }
}
