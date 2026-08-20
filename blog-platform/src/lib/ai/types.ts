export type AIEngineMode = "auto" | "browser-wasm" | "local-ollama" | "extractive";

export type AITask =
  | "generate-draft"
  | "generate-excerpt"
  | "suggest-titles"
  | "improve-writing"
  | "summarize-article"
  | "ask-article";

export interface AIModelInfo {
  id: string;
  name: string;
  type: "browser-wasm" | "local-ollama" | "extractive";
  description: string;
  isAvailable: boolean;
}

export interface AIGenerateParams {
  task: AITask;
  prompt: string;
  context?: string;
  enginePreference?: AIEngineMode;
  ollamaModel?: string;
  maxTokens?: number;
  temperature?: number;
  onProgress?: (text: string) => void;
}

export interface AIResponse {
  ok: boolean;
  text: string;
  engineUsed: AIEngineMode;
  modelName: string;
  durationMs: number;
  error?: string;
  blockedByGuardrails?: boolean;
}

export interface OllamaModelTag {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
}
