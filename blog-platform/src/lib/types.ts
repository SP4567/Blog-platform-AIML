export type Role = "visitor" | "registered_user" | "author" | "editor" | "moderator" | "administrator" | "super_admin";

export interface Author {
  id: string;
  name: string;
  handle: string;
  role: Role;
  avatar: string;
  bio: string;
  followers: number;
  location: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  posts: number;
}

export type PostStatus = "draft" | "published" | "scheduled";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readTime: string;
  author: Author;
  category: Category;
  tags: Tag[];
  featured: boolean;
  image: string;
  views: number;
  likes: number;
  comments: number;
  featuredOrder: number;
  status?: PostStatus;
}

export interface NewsletterSignup {
  email: string;
}
