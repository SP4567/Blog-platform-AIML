import { buildAIPrompt } from "./prompts";
import {
  extractExcerpt,
  extractSummaryBullets,
  extractTitleSuggestions,
  answerArticleQuestion,
  generateTemplateDraft,
} from "./extractive";
import {
  validateAndSanitizePrompt,
  sanitizeModelOutput,
  checkClientRateLimit,
} from "./guardrails";
import type { AIGenerateParams, AIResponse, OllamaModelTag } from "./types";

// In-browser pipeline singleton
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let browserGenerator: any = null;
let isInitializing = false;

const BROWSER_MODEL_ID = "HuggingFaceTB/SmolLM2-135M-Instruct";

export async function getOllamaAvailableModels(): Promise<OllamaModelTag[]> {
  try {
    const res = await fetch("/api/ai/status", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.models ?? [];
  } catch {
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getBrowserGenerator(onProgress?: (msg: string) => void): Promise<any> {
  if (browserGenerator) return browserGenerator;
  if (isInitializing) {
    while (isInitializing) {
      await new Promise((r) => setTimeout(r, 100));
    }
    if (browserGenerator) return browserGenerator;
  }

  isInitializing = true;
  try {
    onProgress?.("Initializing private on-device intelligence engine...");
    const { pipeline, env } = await import("@huggingface/transformers");

    env.allowLocalModels = false;

    browserGenerator = await pipeline("text-generation", BROWSER_MODEL_ID, {
      progress_callback: (p: { status?: string; progress?: number; file?: string }) => {
        if (p.status === "progress" && typeof p.progress === "number") {
          onProgress?.(`Optimizing neural weights: ${Math.round(p.progress)}%`);
        } else if (p.status === "ready") {
          onProgress?.("Engine ready! Generating response...");
        }
      },
    });

    return browserGenerator;
  } finally {
    isInitializing = false;
  }
}

export async function runAIEngine(params: AIGenerateParams): Promise<AIResponse> {
  const startTime = Date.now();
  const { task, prompt, context, enginePreference = "auto", ollamaModel, onProgress } = params;

  // 1. Client-side Rate Limiting Guardrail
  if (typeof window !== "undefined" && !checkClientRateLimit()) {
    return {
      ok: false,
      text: "Request rate limit reached. Please wait a moment before sending another request.",
      engineUsed: "auto",
      modelName: "System Safety Guard",
      durationMs: 0,
      error: "Rate limit exceeded.",
      blockedByGuardrails: true,
    };
  }

  // 2. Input Validation & Prompt Injection Guardrails
  const validation = validateAndSanitizePrompt(prompt);
  if (!validation.allowed) {
    return {
      ok: false,
      text: `Safety Filter: ${validation.rejectionReason ?? "This prompt violates content safety policies."}`,
      engineUsed: "auto",
      modelName: "Content Guardrails",
      durationMs: 0,
      error: validation.rejectionReason,
      blockedByGuardrails: true,
    };
  }

  const cleanPrompt = validation.sanitized;
  const cleanContext = context ? validateAndSanitizePrompt(context, 25000).sanitized : undefined;

  // 3. Check if Local Server Engine is requested or auto-available
  if (enginePreference === "local-ollama" || enginePreference === "auto") {
    try {
      const serverRes = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          prompt: cleanPrompt,
          context: cleanContext,
          model: ollamaModel,
        }),
      });

      if (serverRes.ok) {
        const data = await serverRes.json();
        if (data.ok && data.text) {
          const sanitizedOutput = sanitizeModelOutput(data.text);
          return {
            ok: true,
            text: sanitizedOutput,
            engineUsed: "local-ollama",
            modelName: "Advanced Local Engine",
            durationMs: Date.now() - startTime,
          };
        }
      }
    } catch {
      // Gracefully fall through to browser/extractive
    }
  }

  // 4. Try In-Browser Private Engine if on client side
  if (typeof window !== "undefined" && (enginePreference === "browser-wasm" || enginePreference === "auto")) {
    try {
      const generator = await getBrowserGenerator(onProgress);
      const { system, user } = buildAIPrompt(task, cleanPrompt, cleanContext);

      const messages = [
        { role: "system", content: system },
        { role: "user", content: user },
      ];

      onProgress?.("Generating response securely on device...");
      const output = await generator(messages, {
        max_new_tokens: params.maxTokens ?? 384,
        temperature: params.temperature ?? 0.7,
        do_sample: true,
        top_k: 40,
      });

      const generated = output?.[0]?.generated_text;
      let textResult = "";

      if (Array.isArray(generated)) {
        const lastMsg = generated[generated.length - 1];
        textResult = lastMsg?.content ?? "";
      } else if (typeof generated === "string") {
        textResult = generated;
      }

      if (textResult.trim()) {
        const sanitizedOutput = sanitizeModelOutput(textResult);
        return {
          ok: true,
          text: sanitizedOutput,
          engineUsed: "browser-wasm",
          modelName: "Private On-Device Engine",
          durationMs: Date.now() - startTime,
        };
      }
    } catch {
      // Gracefully fall back to deterministic NLP
    }
  }

  // 5. Deterministic Extractive NLP Fallback (0ms instant execution)
  let fallbackText = "";
  switch (task) {
    case "generate-draft":
      fallbackText = generateTemplateDraft(cleanPrompt);
      break;
    case "generate-excerpt":
      fallbackText = extractExcerpt(cleanPrompt);
      break;
    case "suggest-titles":
      fallbackText = extractTitleSuggestions(cleanPrompt).join("\n");
      break;
    case "summarize-article":
      fallbackText = extractSummaryBullets(cleanPrompt).join("\n");
      break;
    case "ask-article":
      fallbackText = answerArticleQuestion(cleanPrompt, cleanContext || "");
      break;
    case "improve-writing":
      fallbackText = cleanPrompt
        .trim()
        .replace(/\s+/g, " ")
        .replace(/\b(i)\b/g, "I");
      break;
  }

  const finalOutput = sanitizeModelOutput(fallbackText);

  return {
    ok: true,
    text: finalOutput,
    engineUsed: "extractive",
    modelName: "Instant Smart Engine",
    durationMs: Date.now() - startTime,
  };
}
