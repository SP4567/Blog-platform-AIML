"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon, Loader2, X } from "lucide-react";
import { PostCard } from "@/components/blog/post-card";
import { Input } from "@/components/ui/input";
import type { Category, Post, Tag } from "@/lib/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [results, setResults] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load of categories and tags
  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/tags").then((r) => r.json()),
    ])
      .then(([catData, tagData]) => {
        if (catData.ok) setCategories(catData.categories ?? []);
        if (tagData.ok) setTags(tagData.tags ?? []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedTag) params.set("tag", selectedTag);

      fetch(`/api/search?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data.ok) {
            setResults(data.results ?? []);
          }
        })
        .catch(() => {
          if (isMounted) setResults([]);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      isMounted = false;
    };
  }, [query, selectedCategory, selectedTag]);

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory(null);
    setSelectedTag(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="rounded-[40px] border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Discover</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-950 dark:text-white">Search stories, authors & topics</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Find in-depth architectural guides, engineering perspectives, and design essays.</p>
        </div>

        {/* Search Input Bar */}
        <div className="mt-8 relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by keywords, topics, or authors…"
            className="pl-12 pr-10 py-6 text-base rounded-full border-slate-200 focus:border-slate-400 bg-slate-50/50 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:focus:border-slate-500"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {/* Category & Tag Filter Chips */}
        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-2">Categories:</span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.slug)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    isSelected
                      ? "bg-slate-950 text-white dark:bg-indigo-600 dark:text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-2">Tags:</span>
            {tags.map((tag) => {
              const isSelected = selectedTag === tag.slug;
              return (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(isSelected ? null : tag.slug)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    isSelected
                      ? "bg-slate-950 text-white dark:bg-indigo-600 dark:text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  #{tag.name}
                </button>
              );
            })}
            {(query || selectedCategory || selectedTag) ? (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 hover:underline font-medium ml-2 dark:text-rose-400"
              >
                Reset filters
              </button>
            ) : null}
          </div>
        </div>

        {/* Results Grid */}
        <div className="mt-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-slate-600 dark:text-slate-400" />
              <span>Searching stories…</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16 text-slate-500 dark:text-slate-400">
              <p className="text-lg font-medium text-slate-700 dark:text-slate-200">No matching stories found</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try adjusting your query or resetting filter tags.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {results.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
