import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});

export const rolePermissions = {
  visitor: ["read"],
  registered_user: ["read", "comment", "bookmark"],
  author: ["read", "comment", "bookmark", "create_post", "edit_own_post"],
  editor: ["read", "comment", "bookmark", "create_post", "edit_post", "review_comments"],
  moderator: ["read", "comment", "bookmark", "create_post", "edit_post", "review_comments", "moderate_content"],
  administrator: ["read", "comment", "bookmark", "create_post", "edit_post", "review_comments", "moderate_content", "manage_users"],
  super_admin: ["read", "comment", "bookmark", "create_post", "edit_post", "review_comments", "moderate_content", "manage_users", "manage_settings"],
} as const;
