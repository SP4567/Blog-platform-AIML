import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = contactFormSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  return NextResponse.json({ ok: true, message: "Message received", payload: parsed.data }, { status: 201 });
}
