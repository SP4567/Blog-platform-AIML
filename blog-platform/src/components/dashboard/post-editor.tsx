"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category, Post } from "@/lib/types";
import { ArrowLeft, Save, Eye, Edit3 } from "lucide-react";
import Link from "next/link";

import { AIWritingAssistant } from "@/components/blog/ai-writing-assistant";

interface PostEditorProps {
  initialPost?: Partial<Post>;
  categories?: Category[];
  isEditing?: boolean;
}

export function PostEditor({ initialPost, categories = [], isEditing = false }: PostEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [content, setContent] = useState(initialPost?.content ?? "");
  const [categoryId, setCategoryId] = useState(initialPost?.categoryId ?? initialPost?.category?.id ?? "");
  const [tagsInput, setTagsInput] = useState(
    initialPost?.tags?.map((t) => t.name).join(", ") ?? "Next.js, Architecture",
  );
  const [image, setImage] = useState(
    initialPost?.image ?? "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
  );
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">(
    initialPost?.status ?? "published",
  );
  const [featured, setFeatured] = useState(initialPost?.featured ?? false);

  const [tab, setTab] = useState<"write" | "preview">("write");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [allCategories, setAllCategories] = useState<Category[]>(categories);

  useEffect(() => {
    if (categories.length > 0) return;
    let isMounted = true;
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.ok && data.categories?.length > 0) {
          setAllCategories(data.categories);
          setCategoryId((prev) => prev || data.categories[0].id);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [categories.length]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (submitStatus?: "draft" | "published") => {
    setError("");
    const targetStatus = submitStatus ?? status;

    if (!title.trim() || !slug.trim() || !excerpt.trim() || !content.trim() || !categoryId) {
      setError("Please fill in the title, slug, category, excerpt, and content.");
      return;
    }

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      categoryId,
      tags: tagsArray,
      image: image.trim() || null,
      status: targetStatus,
      featured,
    };

    setIsSubmitting(true);

    try {
      const url = isEditing && initialPost?.id ? `/api/posts/${initialPost.id}` : "/api/posts";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to save post.");
        setIsSubmitting(false);
        return;
      }

      router.push("/dashboard/posts");
      router.refresh();
    } catch {
      setError("Network error while saving post.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link href="/dashboard/posts" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition">
          <ArrowLeft className="h-4 w-4" />
          Back to posts
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={() => handleSubmit("draft")}
            className="rounded-full gap-1.5"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={() => handleSubmit("published")}
            className="rounded-full gap-1.5"
          >
            {isSubmitting ? "Publishing…" : isEditing ? "Update & Publish" : "Publish Story"}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl bg-rose-50 p-4 text-sm font-medium text-rose-700 border border-rose-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="space-y-6">
          {/* AI Writing Assistant Copilot */}
          <AIWritingAssistant
            currentTitle={title}
            currentContent={content}
            onApplyTitle={(newTitle) => {
              setTitle(newTitle);
              if (!isEditing) {
                const generatedSlug = newTitle
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "");
                setSlug(generatedSlug);
              }
            }}
            onApplyExcerpt={(newExcerpt) => setExcerpt(newExcerpt)}
            onInsertContent={(newContent, replace) => {
              if (replace) {
                setContent(newContent);
              } else {
                setContent((prev) => (prev.trim() ? `${prev.trim()}\n\n${newContent}` : newContent));
              }
            }}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Title</label>
            <Input
              value={title}
              onChange={handleTitleChange}
              placeholder="Give your article a clear, descriptive title"
              className="text-lg font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of the story (appears on cards and search engine results)"
              rows={2}
              className="w-full rounded-2xl border border-slate-200 p-4 text-sm text-slate-800 outline-none focus:border-slate-400"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Content (Markdown supported)</label>
              <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setTab("write")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
                    tab === "write" ? "bg-white font-medium shadow-xs text-slate-900" : "text-slate-500"
                  }`}
                >
                  <Edit3 className="h-3 w-3" /> Write
                </button>
                <button
                  type="button"
                  onClick={() => setTab("preview")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
                    tab === "preview" ? "bg-white font-medium shadow-xs text-slate-900" : "text-slate-500"
                  }`}
                >
                  <Eye className="h-3 w-3" /> Preview
                </button>
              </div>
            </div>

            {tab === "write" ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article in Markdown. Use # headings, - lists, > blockquotes, `code`..."
                rows={16}
                className="w-full font-mono text-sm leading-6 rounded-2xl border border-slate-200 p-4 text-slate-800 outline-none focus:border-slate-400"
                required
              />
            ) : (
              <div className="min-h-[384px] rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 whitespace-pre-wrap leading-7">
                {content || <span className="text-slate-400 italic">No content written yet...</span>}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-950">Publication Settings</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">URL Slug</label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. building-reliable-ai-platforms"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
              >
                {allCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tags (comma separated)</label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Next.js, TypeScript, AI"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Cover Image URL</label>
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published" | "scheduled")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="featured-checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              />
              <label htmlFor="featured-checkbox" className="text-sm font-medium text-slate-700 cursor-pointer">
                Feature on homepage
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
