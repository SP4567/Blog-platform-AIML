import { notFound } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { PostEditor } from "@/components/dashboard/post-editor";
import { getAllCategories, getPostBySlug } from "@/lib/content";
import { prisma } from "@/lib/db";
import type { Post } from "@/lib/types";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categories = await getAllCategories();

  let post: Post | null = null;

  try {
    const rawPost = await prisma.post.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        category: true,
        tags: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (rawPost) {
      post = {
        ...rawPost,
        status: rawPost.status as Post["status"],
        author: {
          ...rawPost.author,
          role: rawPost.author.role as Post["author"]["role"],
          handle: rawPost.author.name?.toLowerCase().replace(/\s+/g, "") ?? "author",
          followers: 0,
        },
      } as unknown as Post;
    }
  } catch {
    post = await getPostBySlug(id);
  }

  if (!post) notFound();

  return (
    <ProtectedRoute>
      <PostEditor initialPost={post} categories={categories} isEditing={true} />
    </ProtectedRoute>
  );
}
