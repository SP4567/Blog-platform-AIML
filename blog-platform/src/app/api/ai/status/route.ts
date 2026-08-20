import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    const res = await fetch("http://127.0.0.1:11434/api/tags", {
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({
        available: false,
        engine: "browser-wasm",
        models: [],
        message: "Private on-device engine active.",
      });
    }

    const data = await res.json();
    return NextResponse.json({
      available: true,
      engine: "local-ollama",
      models: (data.models ?? []).map((m: { name: string; size: number }) => ({
        name: m.name,
        size: m.size,
      })),
      message: "Advanced local intelligence engine connected.",
    });
  } catch {
    return NextResponse.json({
      available: false,
      engine: "browser-wasm",
      models: [],
      message: "Private on-device engine active.",
    });
  }
}
