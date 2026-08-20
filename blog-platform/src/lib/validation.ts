import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(500),
  content: z.string().min(20, "Content must be at least 20 characters"),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional().default([]),
  image: z.string().url().optional().or(z.literal("")).nullable(),
  status: z.enum(["draft", "published", "scheduled"]).default("published"),
  featured: z.boolean().optional().default(false),
  readTime: z.string().optional().default("5 min read"),
});

export const commentSchema = z.object({
  body: z.string().min(2, "Comment must be at least 2 characters").max(2000),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  bio: z.string().max(300).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal("")).nullable(),
  image: z.string().url().optional().or(z.literal("")).nullable(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(60),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(5).max(300),
  color: z.string().optional().default("from-cyan-500 to-sky-600"),
});

export const tagSchema = z.object({
  name: z.string().min(2).max(40),
  slug: z.string().min(2).max(40).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const rolePermissions = {
  visitor: ["read"],
  registered_user: ["read", "comment", "bookmark", "like"],
  author: ["read", "comment", "bookmark", "like", "create_post", "edit_own_post", "delete_own_post"],
  editor: ["read", "comment", "bookmark", "like", "create_post", "edit_post", "review_comments", "manage_categories"],
  moderator: ["read", "comment", "bookmark", "like", "create_post", "edit_post", "review_comments", "moderate_content"],
  administrator: ["read", "comment", "bookmark", "like", "create_post", "edit_post", "delete_post", "review_comments", "moderate_content", "manage_users", "manage_categories", "view_analytics"],
  super_admin: ["read", "comment", "bookmark", "like", "create_post", "edit_post", "delete_post", "review_comments", "moderate_content", "manage_users", "manage_categories", "manage_settings", "view_analytics"],
} as const;
