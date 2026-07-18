import { MetadataRoute } from "next";
import { posts } from "@/lib/data";
import { siteConfig } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const postRoutes = posts.map((post) => ({
    url: `${siteConfig.url}/post/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }));

  return [
    { url: siteConfig.url, lastModified: new Date() },
    { url: `${siteConfig.url}/about`, lastModified: new Date() },
    { url: `${siteConfig.url}/contact`, lastModified: new Date() },
    ...postRoutes,
  ];
}
