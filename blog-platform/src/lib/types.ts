export type Role = "visitor" | "registered_user" | "author" | "editor" | "moderator" | "administrator" | "super_admin";

export interface Author {
  id: string;
  name: string | null;
  email?: string;
  handle?: string;
  role: Role;
  avatar?: string | null;
  image?: string | null;
  bio?: string | null;
  followers?: number;
  location?: string | null;
  website?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  _count?: {
    posts: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  posts?: number;
  _count?: {
    posts: number;
  };
}

export type PostStatus = "draft" | "published" | "scheduled";

export interface CommentItem {
  id: string;
  body: string;
  createdAt: string | Date;
  authorId: string;
  postId: string;
  author: {
    id: string;
    name: string | null;
    image?: string | null;
    role: string;
  };
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  publishedAt: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  readTime: string;
  featured: boolean;
  featuredOrder: number;
  image: string | null;
  views: number;
  likes?: number;
  bookmarks?: number;
  comments?: number;
  authorId?: string;
  categoryId?: string;
  author: Author;
  category: Category;
  tags: Tag[];
  commentsList?: CommentItem[];
  _count?: {
    commentsList: number;
    likedBy: number;
    bookmarkedBy: number;
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface NewsletterSignup {
  email: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string | Date;
}
