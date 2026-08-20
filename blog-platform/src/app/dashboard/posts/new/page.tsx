import { ProtectedRoute } from "@/components/auth/protected-route";
import { PostEditor } from "@/components/dashboard/post-editor";
import { getAllCategories } from "@/lib/content";

export default async function NewPostPage() {
  const categories = await getAllCategories();

  return (
    <ProtectedRoute>
      <PostEditor categories={categories} isEditing={false} />
    </ProtectedRoute>
  );
}
