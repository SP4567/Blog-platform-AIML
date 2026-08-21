"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Bot,
  Send,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react";

interface AIReaderCompanionProps {
  postTitle?: string;
  postContent?: string;
  articleTitle?: string;
  articleContent?: string;
}

export function AIReaderCompanion(props: AIReaderCompanionProps) {
  const postTitle = props.postTitle ?? props.articleTitle ?? "";
  const postContent = props.postContent ?? props.articleContent ?? "";
  // Takeaways state
  const [takeaways, setTakeaways] = useState<string[]>([]);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isTakeawaysOpen, setIsTakeawaysOpen] = useState(true);

  // Q&A State
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [qaError, setQaError] = useState("");

  const handleGenerateTakeaways = async () => {
    setIsSummarizing(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "generate_takeaways",
          title: postTitle,
          content: postContent,
        }),
      });
      const data = await res.json();
      if (data.ok && data.result) {
        const bullets = data.result
          .split("\n")
          .map((line: string) => line.replace(/^[-*•\d\.]+\s*/, "").trim())
          .filter((line: string) => line.length > 5);
        setTakeaways(bullets);
        setIsTakeawaysOpen(true);
      }
    } catch {
      // silently fail
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
    setProgressMsg("Scanning story context with editorial intelligence…");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "answer_question",
          title: postTitle,
          content: postContent,
          question: currentQ,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setQaError(data.error ?? "Could not find answer in this article.");
        return;
      }

      setQaHistory((prev) => [...prev, { q: currentQ, a: data.result }]);
    } catch {
      setQaError("Network error while connecting to editorial AI.");
    } finally {
      setIsAnswering(false);
      setProgressMsg("");
    }
  };

  return (
    <div className="space-y-6 my-10">
      {/* 1. Key Takeaways Section */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-sky-50/40 dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 p-6 shadow-sm transition-colors">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-950 dark:text-white text-base">Key Article Insights</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:border dark:border-emerald-800">
                  <ShieldCheck className="h-3 w-3" />
                  AI Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
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
                className="rounded-full text-xs gap-1.5 h-8 bg-indigo-600 text-white hover:bg-indigo-500"
              >
                {isSummarizing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                <span>{isSummarizing ? "Summarizing..." : "Generate TL;DR"}</span>
              </Button>
            ) : (
              <button
                type="button"
                onClick={() => setIsTakeawaysOpen(!isTakeawaysOpen)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
              >
                {isTakeawaysOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Takeaways Content */}
        {takeaways.length > 0 && isTakeawaysOpen ? (
          <div className="mt-5 border-t border-indigo-100/70 dark:border-slate-800 pt-4 space-y-3">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {takeaways.map((bullet, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 p-3 text-xs text-slate-800 dark:text-slate-200 border border-indigo-50 dark:border-slate-700 shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* 2. Ask Article AI (Q&A Assistant) */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-indigo-600">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-950 dark:text-white text-sm">Ask AI about this Story</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask any question grounded directly in the article text</p>
          </div>
        </div>

        {/* Conversation Stream */}
        {qaHistory.length > 0 ? (
          <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
            {qaHistory.map((item, idx) => (
              <div key={idx} className="space-y-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-4 border border-slate-100 dark:border-slate-700 text-xs">
                <div className="flex items-start gap-2 font-medium text-slate-900 dark:text-white">
                  <MessageSquare className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <span>{item.q}</span>
                </div>
                <div className="pl-5 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap border-l-2 border-indigo-200 dark:border-indigo-500 ml-1.5">
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Guardrail Violation Alert */}
        {qaError ? (
          <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 mb-3">
            <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <span>{qaError}</span>
          </div>
        ) : null}

        {/* Progress Msg */}
        {isAnswering && progressMsg ? (
          <div className="flex items-center gap-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 p-3 text-xs text-indigo-900 dark:text-indigo-200 border border-transparent dark:border-indigo-800 mb-3">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>{progressMsg}</span>
          </div>
        ) : null}

        {/* Input Form */}
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What are the 3 main scaling pillars described above?"
            className="rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs h-10 border-slate-200 dark:border-slate-700 dark:text-slate-100"
            disabled={isAnswering}
          />
          <Button
            type="submit"
            disabled={isAnswering || !question.trim()}
            className="rounded-2xl text-xs shrink-0 gap-1.5 h-10 px-4 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            {isAnswering ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            <span>Ask</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
