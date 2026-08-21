"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function CodeBlock({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "";
  const codeString = String(children).replace(/\n$/, "");
  const isMultiLine = codeString.includes("\n") || Boolean(match);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  if (!isMultiLine) {
    return (
      <code
        className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] font-medium text-indigo-700 border border-slate-200/70 dark:bg-slate-800 dark:border-slate-700 dark:text-indigo-300"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-md">
      <div className="flex items-center justify-between bg-slate-900/90 px-4 py-2 text-xs text-slate-400 border-b border-slate-800">
        <span className="font-mono uppercase font-semibold text-slate-300">
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 text-sm font-mono text-slate-100 leading-relaxed">
        <code className={className} {...props}>
          {children}
        </code>
      </div>
    </div>
  );
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content || !content.trim()) {
    return null;
  }

  return (
    <div className={`markdown-content leading-relaxed text-slate-800 dark:text-slate-200 space-y-4 transition-colors ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => (
            <h1
              className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-8 mb-4 tracking-tight leading-tight border-b border-slate-200/70 dark:border-slate-800 pb-2"
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white mt-7 mb-3 tracking-tight border-b border-slate-100 dark:border-slate-800 pb-1.5"
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mt-6 mb-2 tracking-tight" {...props} />
          ),
          h4: ({ ...props }) => (
            <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mt-4 mb-2" {...props} />
          ),
          p: ({ ...props }) => (
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg my-3" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className="list-disc list-outside pl-6 my-4 space-y-2 text-slate-700 dark:text-slate-300 text-base sm:text-lg" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="list-decimal list-outside pl-6 my-4 space-y-2 text-slate-700 dark:text-slate-300 text-base sm:text-lg" {...props} />
          ),
          li: ({ ...props }) => <li className="leading-relaxed text-slate-700 dark:text-slate-300" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 px-5 py-3.5 my-6 rounded-r-2xl italic text-slate-700 dark:text-slate-200"
              {...props}
            />
          ),
          hr: ({ ...props }) => <hr className="my-8 border-t border-slate-200 dark:border-slate-800" {...props} />,
          a: ({ ...props }) => (
            <a
              className="font-medium text-indigo-600 dark:text-indigo-400 underline underline-offset-4 decoration-indigo-300 dark:decoration-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          strong: ({ ...props }) => <strong className="font-bold text-slate-950 dark:text-white" {...props} />,
          em: ({ ...props }) => <em className="italic text-slate-800 dark:text-slate-200" {...props} />,
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm" {...props} />
            </div>
          ),
          thead: ({ ...props }) => <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-semibold border-b border-slate-200 dark:border-slate-700" {...props} />,
          tbody: ({ ...props }) => <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300" {...props} />,
          th: ({ ...props }) => <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100" {...props} />,
          td: ({ ...props }) => <td className="px-4 py-3 text-slate-700 dark:text-slate-300" {...props} />,
          code: CodeBlock,
          pre: ({ children }) => <>{children}</>,
          img: ({ alt, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="rounded-2xl max-w-full my-6 shadow-sm border border-slate-100 dark:border-slate-800 mx-auto"
              alt={alt || "Blog visual"}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
