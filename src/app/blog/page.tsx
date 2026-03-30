import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { Metadata } from "next";
import BlogClient from "./BlogClient";
import { getApiUrl } from "@/lib/api-config";

export const metadata: Metadata = {
  title: "Blog | Growth Valley",
  description: "Insights, strategies, and best practices for B2B revenue growth from the Growth Valley team.",
};

export const dynamic = 'force-dynamic';

async function getBlogs() {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.error('API URL not configured');
    return [];
  }

  try {
    const res = await fetch(
      `${apiUrl}/api/blog`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  // Filter only published posts
  const publishedBlogs = blogs.filter((post: any) => post.status === "published");

  const featuredPosts = publishedBlogs.filter((post: any) => post.featured);
  const recentPosts = publishedBlogs
    .filter((post: any) => !post.featured)
    .sort(
      (a: any, b: any) =>
        new Date(b.publishDate || b.createdAt).getTime() -
        new Date(a.publishDate || a.createdAt).getTime()
    );

  return (
    <>
      <PageHeader
        title="Blog"
        subtitle="Insights, strategies, and best practices for B2B revenue growth from our team."
      />
      <BlogClient
        featuredPosts={featuredPosts}
        recentPosts={recentPosts}
        publishedBlogs={publishedBlogs}
      />
    </>
  );
}