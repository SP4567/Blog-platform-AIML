import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildAIPrompt } from "@/lib/ai/prompts";
import { validateAndSanitizePrompt, sanitizeModelOutput } from "@/lib/ai/guardrails";
import {
  extractExcerpt,
  extractSummaryBullets,
  extractTitleSuggestions,
  answerArticleQuestion,
  generateTemplateDraft,
} from "@/lib/ai/extractive";
import type { AITask } from "@/lib/ai/types";

export const dynamic = "force-dynamic";

const taskAliases: Record<string, AITask> = {
  "generate-draft": "generate-draft",
  "generate_draft": "generate-draft",
  "draft": "generate-draft",

  "generate-excerpt": "generate-excerpt",
  "generate_excerpt": "generate-excerpt",
  "excerpt": "generate-excerpt",

  "suggest-titles": "suggest-titles",
  "suggest_titles": "suggest-titles",
  "titles": "suggest-titles",

  "improve-writing": "improve-writing",
  "improve_writing": "improve-writing",
  "polish_text": "improve-writing",
  "polish": "improve-writing",

  "summarize-article": "summarize-article",
  "summarize_article": "summarize-article",
  "generate_takeaways": "summarize-article",
  "takeaways": "summarize-article",

  "ask-article": "ask-article",
  "ask_article": "ask-article",
  "answer_question": "ask-article",
  "qa": "ask-article",
};

const rawRequestSchema = z.object({
  task: z.string(),
  prompt: z.string().optional(),
  topic: z.string().optional(),
  question: z.string().optional(),
  content: z.string().optional(),
  title: z.string().optional(),
  context: z.string().optional(),
  model: z.string().optional(),
  enginePreference: z.string().optional(),
});

function fallbackExecution(task: AITask, prompt: string, context?: string): string {
  switch (task) {
    case "generate-draft":
      return generateTemplateDraft(prompt);
    case "generate-excerpt":
      return extractExcerpt(prompt || context || "");
    case "suggest-titles":
      return extractTitleSuggestions(prompt || context || "").join("\n");
    case "summarize-article":
      return extractSummaryBullets(prompt || context || "").join("\n");
    case "ask-article":
      return answerArticleQuestion(prompt, context || "");
    case "improve-writing":
      return prompt.trim().replace(/\s+/g, " ");
    default:
      return prompt;
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => ({}));
    const parseResult = rawRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid AI request payload structure." },
        { status: 400 },
      );
    }

    const data = parseResult.data;
    const normalizedTask = taskAliases[data.task] || (data.task as AITask);

    if (!taskAliases[data.task]) {
      return NextResponse.json(
        {
          ok: false,
          error: `Unsupported AI task '${data.task}'. Valid tasks: generate-draft, generate-excerpt, suggest-titles, improve-writing, summarize-article, ask-article`,
        },
        { status: 400 },
      );
    }

    // Resolve input prompt & context across parameter names
    const resolvedPrompt = (
      data.prompt ||
      data.topic ||
      data.question ||
      data.content ||
      data.title ||
      ""
    ).trim();

    const resolvedContext = (
      data.context ||
      (data.content !== resolvedPrompt ? data.content : "") ||
      (data.title !== resolvedPrompt ? data.title : "") ||
      undefined
    );

    if (!resolvedPrompt && !resolvedContext) {
      return NextResponse.json(
        { ok: false, error: "Prompt or content context is required for AI generation." },
        { status: 400 },
      );
    }

    // 1. Guardrail Validation & Prompt Sanitization
    const validation = validateAndSanitizePrompt(resolvedPrompt || resolvedContext || "");
    if (!validation.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: validation.rejectionReason ?? "Prompt violates content safety policies.",
          blocked: true,
          blockedByGuardrails: true,
        },
        { status: 400 },
      );
    }

    const cleanPrompt = validation.sanitized;
    const cleanContext = resolvedContext
      ? validateAndSanitizePrompt(resolvedContext, 25000).sanitized
      : undefined;

    const { system, user } = buildAIPrompt(normalizedTask, cleanPrompt, cleanContext);
    const targetModel = data.model || "llama3.2";

    // 2. Attempt local Ollama inference if running
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500); // Quick check if local Ollama responds

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

      if (ollamaResponse.ok) {
        const ollamaData = await ollamaResponse.json();
        const rawText = ollamaData.response ?? "";
        if (rawText.trim()) {
          const sanitizedText = sanitizeModelOutput(rawText);
          return NextResponse.json({
            ok: true,
            result: sanitizedText,
            text: sanitizedText,
            model: targetModel,
            engine: "local-ollama",
          });
        }
      }
    } catch {
      // Server is running in cloud/Vercel or Ollama not active locally -> proceed to deterministic smart fallback
    }

    // 3. Cloud / Serverless Fallback (Extractive NLP Engine)
    const fallbackResult = fallbackExecution(normalizedTask, cleanPrompt, cleanContext);
    const sanitizedFallback = sanitizeModelOutput(fallbackResult);

    return NextResponse.json({
      ok: true,
      result: sanitizedFallback,
      text: sanitizedFallback,
      model: "The Perceptron Smart Engine",
      engine: "extractive",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation service error.";
    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
