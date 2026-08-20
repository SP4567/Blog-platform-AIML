import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/db";

export async function GET() {
  try {
    await pingDatabase();
    return NextResponse.json({
      ok: true,
      status: "healthy",
      service: "northstar-journal",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        status: "degraded",
        service: "northstar-journal",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
