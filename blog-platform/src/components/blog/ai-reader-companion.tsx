"use client";

import { useState } from "react";
import { Sparkles, MessageSquare, Bot, Loader2, Send, ChevronDown, ChevronUp, CheckCircle2, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { runAIEngine } from "@/lib/ai/engine";

interface AIReaderCompanionProps {
  articleTitle: string;
  articleContent: string;
}

export function AIReaderCompanion({ articleTitle, articleContent }: AIReaderCompanionProps) {
  const [takeaways, setTakeaways] = useState<string[]>([]);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isTakeawaysOpen, setIsTakeawaysOpen] = useState(true);

  // Q&A state
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [qaError, setQaError] = useState("");

  const handleGenerateTakeaways = async () => {
    setIsSummarizing(true);
    try {
      const res = await runAIEngine({
        task: "summarize-article",
        prompt: articleContent || articleTitle,
      });

      if (res.ok) {
        const bullets = res.text
          .split("\n")
          .map((b) => b.replace(/^[•\-\*]\s*/, "").trim())
          .filter((b) => b.length > 5);
        setTakeaways(bullets);
      }
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAnswering) return;

    const currentQ = question.trim();
    setQuestion("");
    setIsAnswering(true);
    setQaError("");
    setProgressMsg("Analyzing article context securely...");

    try {
      const res = await runAIEngine({
        task: "ask-article",
        prompt: currentQ,
        context: articleContent,
        onProgress: setProgressMsg,
      });

      if (res.ok) {
        setQaHistory((prev) => [
          ...prev,
          { q: currentQ, a: res.text },
        ]);
      } else {
        setQaError(res.text || res.error || "Unable to answer question under safety guidelines.");
      }
    } finally {
      setIsAnswering(false);
      setProgressMsg("");
    }
  };

  return (
    <div className="space-y-6 my-10">
      {/* 1. Key Takeaways Section */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-sky-50/40 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-950 text-base">Key Article Insights</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                  <ShieldCheck className="h-3 w-3" />
                  100% Private AI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Extracted with Northstar Editorial AI • Zero Data Tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {takeaways.length === 0 ? (
              <Button
                type="button"
                size="sm"
                onClick={() => void handleGenerateTakeaways()}
                disabled={isSummarizing}
                className="rounded-full text-xs gap-1.5 h-8 bg-indigo-600"
              >
                {isSummarizing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                <span>{isSummarizing ? "Summarizing..." : "Generate TL;DR"}</span>
              </Button>
            ) : (
              <button
                type="button"
                onClick={() => setIsTakeawaysOpen(!isTakeawaysOpen)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 transition"
              >
                {isTakeawaysOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Takeaways Content */}
        {takeaways.length > 0 && isTakeawaysOpen ? (
          <div className="mt-5 border-t border-indigo-100/70 pt-4 space-y-3">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {takeaways.map((bullet, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-2xl bg-white/90 p-3 text-xs text-slate-800 border border-indigo-50 shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* 2. Ask Article AI (Q&A Assistant) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-white">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-950 text-sm">Ask AI about this Story</h3>
            <p className="text-xs text-slate-500">Ask any question grounded directly in the article text</p>
          </div>
        </div>

        {/* Conversation Stream */}
        {qaHistory.length > 0 ? (
          <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
            {qaHistory.map((item, idx) => (
              <div key={idx} className="space-y-2 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs">
                <div className="flex items-start gap-2 font-medium text-slate-900">
                  <MessageSquare className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{item.q}</span>
                </div>
                <div className="pl-5 text-slate-700 leading-relaxed whitespace-pre-wrap border-l-2 border-indigo-200 ml-1.5">
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Guardrail Violation Alert */}
        {qaError ? (
          <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 mb-3">
            <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{qaError}</span>
          </div>
        ) : null}

        {/* Progress Msg */}
        {isAnswering && progressMsg ? (
          <div className="flex items-center gap-2 rounded-2xl bg-indigo-50 p-3 text-xs text-indigo-900 mb-3">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600 shrink-0" />
            <span>{progressMsg}</span>
          </div>
        ) : null}

        {/* Input Form */}
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What are the 3 main scaling pillars described above?"
            className="rounded-2xl bg-slate-50 text-xs h-10 border-slate-200"
            disabled={isAnswering}
          />
          <Button
            type="submit"
            disabled={isAnswering || !question.trim()}
            className="rounded-2xl text-xs shrink-0 gap-1.5 h-10 px-4"
          >
            {isAnswering ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            <span>Ask</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
