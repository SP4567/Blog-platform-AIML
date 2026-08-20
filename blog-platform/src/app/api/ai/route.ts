import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildAIPrompt } from "@/lib/ai/prompts";
import { validateAndSanitizePrompt, sanitizeModelOutput } from "@/lib/ai/guardrails";
import type { AITask } from "@/lib/ai/types";

export const dynamic = "force-dynamic";

const aiRequestSchema = z.object({
  task: z.enum([
    "generate-draft",
    "generate-excerpt",
    "suggest-titles",
    "improve-writing",
    "summarize-article",
    "ask-article",
  ]),
  prompt: z.string().min(1).max(8000),
  context: z.string().max(30000).optional(),
  model: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const result = aiRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error.errors[0]?.message ?? "Invalid AI request payload." },
        { status: 400 },
      );
    }

    const { task, prompt, context, model } = result.data;

    // 1. Guardrail Validation
    const validation = validateAndSanitizePrompt(prompt);
    if (!validation.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: validation.rejectionReason ?? "Prompt violates content safety policies.",
          blockedByGuardrails: true,
        },
        { status: 400 },
      );
    }

    const cleanPrompt = validation.sanitized;
    const cleanContext = context ? validateAndSanitizePrompt(context, 25000).sanitized : undefined;

    const { system, user } = buildAIPrompt(task as AITask, cleanPrompt, cleanContext);
    const targetModel = model || "llama3.2";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    const ollamaResponse = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: targetModel,
        system,
        prompt: user,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        },
      }),
    });

    clearTimeout(timeout);

    if (!ollamaResponse.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Local AI server unavailable.",
          fallbackAvailable: true,
        },
        { status: 502 },
      );
    }

    const data = await ollamaResponse.json();
    const rawText = data.response ?? "";
    const sanitizedText = sanitizeModelOutput(rawText);

    return NextResponse.json({
      ok: true,
      text: sanitizedText,
      model: "Advanced Local Engine",
      engine: "local-ollama",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI connection timeout or unavailable.";
    return NextResponse.json(
      {
        ok: false,
        error: message,
        fallbackAvailable: true,
      },
      { status: 503 },
    );
  }
}
