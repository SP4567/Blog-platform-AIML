import { NextResponse } from "next/server";
import { posts } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() ?? "";
  const filtered = posts.filter((post) => {
    const haystack = `${post.title} ${post.excerpt} ${post.author.name} ${post.category.name}`.toLowerCase();
    return haystack.includes(query);
  });
  return NextResponse.json({ results: filtered, query });
}
