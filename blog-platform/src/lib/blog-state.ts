import { useState } from "react";
import { authors, categories, posts as initialPosts, tags } from "@/lib/data";
import type { Post } from "@/lib/types";

const STORAGE_KEY = "the-perceptron-state-v1";

export interface BlogProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  avatar: string;
}

export interface BlogSettings {
  emailDigest: boolean;
  twoFactor: boolean;
  darkMode: boolean;
  defaultView: "magazine" | "compact";
}

export interface ModerationItem {
  id: string;
  type: "post" | "comment";
  title: string;
  summary: string;
  status: "pending" | "approved" | "rejected";
}

export interface NotificationItem {
  id: string;
  title: string;
  createdAt: string;
  unread: boolean;
}

export interface BlogState {
  posts: Post[];
  comments: Record<string, Array<{ id: string; author: string; body: string; createdAt: string }>>;
  bookmarks: string[];
  profile: BlogProfile;
  settings: BlogSettings;
  moderationQueue: ModerationItem[];
  notifications: NotificationItem[];
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildDefaultState(): BlogState {
  const posts = clone(initialPosts).map((post) => ({ ...post, status: "published" as const }));
  const comments: Record<string, Array<{ id: string; author: string; body: string; createdAt: string; }>> = {
    [posts[0].id]: [
      { id: generateId("comment"), author: "Mina Chen", body: "This is the kind of editorial framework I wish more teams had.", createdAt: "2026-07-17T10:00:00.000Z" },
    ],
  };

  return {
    posts,
    comments,
    bookmarks: [posts[0].id],
    profile: {
      name: "Perceptron Editor",
      email: "editor@theperceptron.dev",
      bio: "Designing polished publishing systems for ambitious teams.",
      location: "Seattle, USA",
      website: "https://theperceptron.dev",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    },
    settings: {
      emailDigest: true,
      twoFactor: false,
      darkMode: true,
      defaultView: "magazine",
    },
    moderationQueue: [
      {
        id: generateId("moderation"),
        type: "post",
        title: "AI governance sprint post",
        summary: "Awaiting a second editorial review before publication.",
        status: "pending",
      },
    ],
    notifications: [
      {
        id: generateId("notification"),
        title: "New comment on Building reliable AI platforms",
        createdAt: "2026-07-17T10:00:00.000Z",
        unread: true,
      },
    ],
  };
}

export function loadBlogState(): BlogState {
  if (typeof window === "undefined") {
    return buildDefaultState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return buildDefaultState();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<BlogState>;
    return {
      ...buildDefaultState(),
      ...parsed,
      profile: { ...buildDefaultState().profile, ...(parsed.profile ?? {}) },
      settings: { ...buildDefaultState().settings, ...(parsed.settings ?? {}) },
      posts: (parsed.posts ?? buildDefaultState().posts).map((post: Post) => ({ ...post, status: post.status ?? "published" })),
      comments: parsed.comments ?? buildDefaultState().comments,
      bookmarks: parsed.bookmarks ?? buildDefaultState().bookmarks,
      moderationQueue: parsed.moderationQueue ?? buildDefaultState().moderationQueue,
      notifications: parsed.notifications ?? buildDefaultState().notifications,
    };
  } catch {
    return buildDefaultState();
  }
}

export function persistBlogState(state: BlogState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createPost(state: BlogState, payload: Partial<Post> & { title: string; excerpt: string; content: string; slug: string; categorySlug?: string; status?: Post["status"]; }) {
  const category = categories.find((entry) => entry.slug === payload.categorySlug) ?? categories[0];
  const nextPost: Post = {
    id: payload.id ?? generateId("post"),
    slug: payload.slug,
    title: payload.title,
    excerpt: payload.excerpt,
    content: payload.content,
    publishedAt: payload.publishedAt ?? new Date().toISOString(),
    readTime: payload.readTime ?? "4 min read",
    author: payload.author ?? authors[0],
    category,
    tags: payload.tags ?? [tags[0]],
    featured: payload.featured ?? false,
    image: payload.image ?? "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    views: payload.views ?? 0,
    likes: payload.likes ?? 0,
    comments: payload.comments ?? 0,
    featuredOrder: payload.featuredOrder ?? 99,
    status: payload.status ?? "draft",
  };

  const posts = payload.id ? state.posts.map((post) => (post.id === payload.id ? nextPost : post)) : [nextPost, ...state.posts];
  const comments = payload.id ? state.comments : { ...state.comments, [nextPost.id]: [] };
  return { ...state, posts, comments };
}

export function deletePost(state: BlogState, postId: string) {
  return {
    ...state,
    posts: state.posts.filter((post) => post.id !== postId),
    comments: Object.fromEntries(Object.entries(state.comments).filter(([id]) => id !== postId)),
    bookmarks: state.bookmarks.filter((bookmarkId) => bookmarkId !== postId),
  };
}

export function toggleBookmark(state: BlogState, postId: string) {
  const bookmarks = state.bookmarks.includes(postId) ? state.bookmarks.filter((entry) => entry !== postId) : [...state.bookmarks, postId];
  return { ...state, bookmarks };
}

export function toggleLike(state: BlogState, postId: string) {
  const posts = state.posts.map((post) => (post.id === postId ? { ...post, likes: (post.likes ?? 0) + 1 } : post));
  return { ...state, posts };
}

export function addComment(state: BlogState, postId: string, author: string, body: string) {
  const entry = {
    id: generateId("comment"),
    author,
    body,
    createdAt: new Date().toISOString(),
  };

  return {
    ...state,
    comments: {
      ...state.comments,
      [postId]: [...(state.comments[postId] ?? []), entry],
    },
    posts: state.posts.map((post) => (post.id === postId ? { ...post, comments: (post.comments ?? 0) + 1 } : post)),
  };
}

export function updateProfile(state: BlogState, profile: Partial<BlogProfile>) {
  return { ...state, profile: { ...state.profile, ...profile } };
}

export function updateSettings(state: BlogState, settings: Partial<BlogSettings>) {
  return { ...state, settings: { ...state.settings, ...settings } };
}

export function moderateItem(state: BlogState, itemId: string, decision: "approved" | "rejected") {
  return {
    ...state,
    moderationQueue: state.moderationQueue.map((item) => (item.id === itemId ? { ...item, status: decision } : item)),
    notifications: [
      {
        id: generateId("notification"),
        title: decision === "approved" ? "Moderation approved" : "Moderation rejected",
        createdAt: new Date().toISOString(),
        unread: true,
      },
      ...state.notifications,
    ],
  };
}

export function useBlogState() {
  const [state, setState] = useState<BlogState>(() => loadBlogState());

  const updateState = (updater: BlogState | ((current: BlogState) => BlogState)) => {
    setState((current) => {
      const next = typeof updater === "function" ? (updater as (current: BlogState) => BlogState)(current) : updater;
      persistBlogState(next);
      return next;
    });
  };

  const savePost = (payload: Partial<Post> & { title: string; excerpt: string; content: string; slug: string; categorySlug?: string; status?: Post["status"]; }) => {
    updateState((current) => createPost(current, payload));
  };

  const removePost = (postId: string) => {
    updateState((current) => deletePost(current, postId));
  };

  const bookmarkPost = (postId: string) => {
    updateState((current) => toggleBookmark(current, postId));
  };

  const likePost = (postId: string) => {
    updateState((current) => toggleLike(current, postId));
  };

  const commentOnPost = (postId: string, author: string, body: string) => {
    updateState((current) => addComment(current, postId, author, body));
  };

  const updateProfileDetails = (profile: Partial<BlogProfile>) => {
    updateState((current) => updateProfile(current, profile));
  };

  const updateSettingsDetails = (settings: Partial<BlogSettings>) => {
    updateState((current) => updateSettings(current, settings));
  };

  const moderate = (itemId: string, decision: "approved" | "rejected") => {
    updateState((current) => moderateItem(current, itemId, decision));
  };

  return {
    state,
    savePost,
    removePost,
    bookmarkPost,
    likePost,
    commentOnPost,
    updateProfileDetails,
    updateSettingsDetails,
    moderate,
  };
}
