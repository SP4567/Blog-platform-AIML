"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Bot,
  Loader2,
  Wand2,
  FileText,
  Type,
  Check,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  X,
} from "lucide-react";
import type { AIEngineMode } from "@/lib/ai/types";

interface AIWritingAssistantProps {
  currentTitle: string;
  currentContent: string;
  onApplyTitle: (title: string) => void;
  onApplyExcerpt: (excerpt: string) => void;
  onInsertContent: (content: string, replace?: boolean) => void;
}

export function AIWritingAssistant({
  currentTitle,
  currentContent,
  onApplyTitle,
  onApplyExcerpt,
  onInsertContent,
}: AIWritingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"draft" | "excerpt" | "titles" | "polish">("draft");
  const [enginePreference, setEnginePreference] = useState<AIEngineMode>("auto");

  // Inputs
  const [topicInput, setTopicInput] = useState("");
  const [polishInput, setPolishInput] = useState("");

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [generatedResult, setGeneratedResult] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const resetOutput = () => {
    setGeneratedResult("");
    setErrorMessage("");
    setIsBlocked(false);
  };

  const handleGenerateDraft = async () => {
    if (!topicInput.trim()) return;
    setIsLoading(true);
    resetOutput();
    setProgressMsg("Synthesizing article draft with on-device intelligence…");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "generate_draft",
          topic: topicInput.trim(),
          enginePreference,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setIsBlocked(Boolean(data.blocked));
        setErrorMessage(data.error ?? "Failed to generate draft.");
        return;
      }

      setGeneratedResult(data.result);
    } catch {
      setErrorMessage("Network error while connecting to editorial AI.");
    } finally {
      setIsLoading(false);
      setProgressMsg("");
    }
  };

  const handleGenerateExcerpt = async () => {
    if (!currentContent.trim() && !currentTitle.trim()) {
      setErrorMessage("Please write some article content first to generate an excerpt.");
      return;
    }
    setIsLoading(true);
    resetOutput();
    setProgressMsg("Extracting core summary insights…");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "generate_excerpt",
          title: currentTitle,
          content: currentContent,
          enginePreference,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setIsBlocked(Boolean(data.blocked));
        setErrorMessage(data.error ?? "Failed to generate excerpt.");
        return;
      }

      setGeneratedResult(data.result);
    } catch {
      setErrorMessage("Network error while connecting to editorial AI.");
    } finally {
      setIsLoading(false);
      setProgressMsg("");
    }
  };

  const handleSuggestTitles = async () => {
    if (!currentContent.trim() && !currentTitle.trim() && !topicInput.trim()) {
      setErrorMessage("Provide a draft, title, or topic to suggest headline variations.");
      return;
    }
    setIsLoading(true);
    resetOutput();
    setProgressMsg("Brainstorming editorial headlines…");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "suggest_titles",
          topic: topicInput || currentTitle,
          content: currentContent,
          enginePreference,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setIsBlocked(Boolean(data.blocked));
        setErrorMessage(data.error ?? "Failed to suggest titles.");
        return;
      }

      setGeneratedResult(data.result);
    } catch {
      setErrorMessage("Network error while connecting to editorial AI.");
    } finally {
      setIsLoading(false);
      setProgressMsg("");
    }
  };

  const handlePolishText = async () => {
    const textToPolish = polishInput.trim() || currentContent.trim();
    if (!textToPolish) {
      setErrorMessage("Please provide text to polish.");
      return;
    }
    setIsLoading(true);
    resetOutput();
    setProgressMsg("Polishing prose for clarity and flow…");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "polish_text",
          content: textToPolish,
          enginePreference,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setIsBlocked(Boolean(data.blocked));
        setErrorMessage(data.error ?? "Failed to polish prose.");
        return;
      }

      setGeneratedResult(data.result);
    } catch {
      setErrorMessage("Network error while connecting to editorial AI.");
    } finally {
      setIsLoading(false);
      setProgressMsg("");
    }
  };

  const titleList = generatedResult
    .split("\n")
    .map((t) => t.replace(/^\d+[\.\)]\s*/, "").replace(/^["']|["']$/g, "").trim())
    .filter((t) => t.length > 5);

  return (
    <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/30 dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 p-5 shadow-sm transition-colors">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Perceptron AI Copilot</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:border dark:border-emerald-800">
                <ShieldCheck className="h-3 w-3" />
                AI Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Autonomous editorial intelligence with zero external cloud leakage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={isOpen ? "outline" : "default"}
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full gap-1.5 text-xs h-8 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>{isOpen ? "Hide Copilot" : "Open Copilot"}</span>
          </Button>
        </div>
      </div>

      {/* Expanded Copilot Panel */}
      {isOpen ? (
        <div className="mt-4 border-t border-indigo-100/80 dark:border-slate-800 pt-4 space-y-4">
          {/* Engine Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/80 rounded-2xl p-2.5 border border-indigo-50 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">Intelligence Mode:</span>
              <select
                value={enginePreference}
                onChange={(e) => setEnginePreference(e.target.value as AIEngineMode)}
                className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="auto">Adaptive Quality (Auto)</option>
                <option value="browser-wasm">Private On-Device Engine</option>
                <option value="local-ollama">High-Capacity Local Engine</option>
                <option value="extractive">Instant Deterministic Engine</option>
              </select>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Content Guardrails Enabled
            </span>
          </div>

          {/* Action Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-200/70 dark:border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => { setActiveTab("draft"); resetOutput(); }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "draft"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              }`}
            >
              <Wand2 className="h-3 w-3" />
              <span>Generate Draft</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("excerpt"); resetOutput(); }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "excerpt"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              }`}
            >
              <FileText className="h-3 w-3" />
              <span>SEO Excerpt</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("titles"); resetOutput(); }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "titles"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              }`}
            >
              <Type className="h-3 w-3" />
              <span>Catchy Titles</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("polish"); resetOutput(); }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "polish"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>Polish Prose</span>
            </button>
          </div>

          {/* Tab 1: Draft Generator */}
          {activeTab === "draft" ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Enter a topic or rough outline. The editorial AI will draft a complete Markdown article.
              </p>
              <div className="flex gap-2">
                <Input
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g. Architecting Distributed Event Driven Pipelines with Kafka"
                  className="rounded-2xl bg-white text-xs h-9 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={() => void handleGenerateDraft()}
                  disabled={isLoading || !topicInput.trim()}
                  className="rounded-2xl text-xs shrink-0 gap-1.5 h-9 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                >
                  {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                  <span>Generate</span>
                </Button>
              </div>
            </div>
          ) : null}

          {/* Tab 2: SEO Excerpt */}
          {activeTab === "excerpt" ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Auto-extracts a punchy 2-sentence summary from your current draft to maximize reader click-through.
              </p>
              <Button
                type="button"
                onClick={() => void handleGenerateExcerpt()}
                disabled={isLoading || (!currentContent && !currentTitle)}
                className="rounded-2xl text-xs gap-1.5 h-9 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                <span>Generate from current article</span>
              </Button>
            </div>
          ) : null}

          {/* Tab 3: Catchy Titles */}
          {activeTab === "titles" ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Generate 4 compelling headline variations for your topic or current draft.
              </p>
              <Button
                type="button"
                onClick={() => void handleSuggestTitles()}
                disabled={isLoading || (!currentContent && !currentTitle)}
                className="rounded-2xl text-xs gap-1.5 h-9 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Type className="h-3.5 w-3.5" />}
                <span>Suggest Headline Variations</span>
              </Button>
            </div>
          ) : null}

          {/* Tab 4: Polish Text */}
          {activeTab === "polish" ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Paste specific paragraphs to enhance tone, flow, and grammatical precision.
              </p>
              <textarea
                value={polishInput}
                onChange={(e) => setPolishInput(e.target.value)}
                placeholder="Paste text here to refine, or leave blank to polish entire article..."
                className="w-full h-20 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-900 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500"
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={() => void handlePolishText()}
                disabled={isLoading || (!polishInput && !currentContent)}
                className="rounded-2xl text-xs gap-1.5 h-9 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                <span>Polish Text</span>
              </Button>
            </div>
          ) : null}

          {/* Progress / Status indicator */}
          {isLoading && progressMsg ? (
            <div className="flex items-center gap-2 rounded-2xl bg-indigo-100/60 dark:bg-indigo-950/80 p-3 text-xs text-indigo-950 dark:text-indigo-200 border border-transparent dark:border-indigo-800">
              <Loader2 className="h-4 w-4 animate-spin shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span>{progressMsg}</span>
            </div>
          ) : null}

          {/* Safety Rejection Alert */}
          {isBlocked || errorMessage ? (
            <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300">
              <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Content Policy Notice</p>
                <p className="mt-0.5 text-rose-700 dark:text-rose-300 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          ) : null}

          {/* Results Display */}
          {generatedResult && !isLoading ? (
            <div className="rounded-2xl border border-indigo-200/80 bg-white dark:border-slate-700 dark:bg-slate-900 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  AI Output
                </span>
                <button
                  type="button"
                  onClick={resetOutput}
                  className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Title list rendering */}
              {activeTab === "titles" && titleList.length > 0 ? (
                <div className="space-y-2">
                  {titleList.map((title, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 p-2.5 text-xs text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700"
                    >
                      <span className="font-medium">{title}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onApplyTitle(title);
                          setCopiedIndex(idx);
                          setTimeout(() => setCopiedIndex(null), 2000);
                        }}
                        className="rounded-xl h-7 px-2.5 text-[11px] gap-1 shrink-0 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                      >
                        {copiedIndex === idx ? <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> : <ArrowRight className="h-3 w-3" />}
                        <span>{copiedIndex === idx ? "Applied!" : "Use Title"}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                /* Text Result rendering */
                <>
                  <div className="max-h-56 overflow-y-auto rounded-xl bg-slate-50 dark:bg-slate-800/80 p-3 text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed border border-slate-100 dark:border-slate-700">
                    {generatedResult}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {activeTab === "excerpt" ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onApplyExcerpt(generatedResult)}
                        className="rounded-xl text-xs gap-1.5 h-8 bg-indigo-600 text-white hover:bg-indigo-500"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Apply as Excerpt</span>
                      </Button>
                    ) : null}

                    {activeTab === "draft" || activeTab === "polish" ? (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => onInsertContent(generatedResult, false)}
                          className="rounded-xl text-xs gap-1.5 h-8 bg-indigo-600 text-white hover:bg-indigo-500"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                          <span>Append to Article</span>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => onInsertContent(generatedResult, true)}
                          className="rounded-xl text-xs gap-1.5 h-8 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          <span>Replace Article Body</span>
                        </Button>
                      </>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
