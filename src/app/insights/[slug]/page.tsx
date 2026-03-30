import Container from "@/components/Container";
import Section from "@/components/Section";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";
import Link from "next/link";
import { getApiUrl } from "@/lib/api-config";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string) {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.error('API URL not configured');
    return null;
  }

  try {
    const res = await fetch(
      `${apiUrl}/api/blog/${slug}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return {
    title: post?.seo?.metaTitle || post?.title || "Insight",
    description: post?.seo?.metaDescription || post?.content?.replace(/<[^>]*>/g, '').substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return (
      <Section>
        <Container>
          <div className="text-center py-16">
            <h1 className="text-heading-1 text-brand-black mb-4">
              Article Not Found
            </h1>
            <p className="text-body text-brand-grey-500 mb-8">
              The article you're looking for doesn't exist.
            </p>
            <Button href="/insights">View All Insights</Button>
          </div>
        </Container>
      </Section>
    );
  }

  // Simple markdown-like rendering for content
  const renderContent = (content: string) => {
    if (!content) return null;
    return content.split("\n\n").map((paragraph, idx) => {
      if (paragraph.startsWith("## ")) {
        return (
          <h2
            key={idx}
            className="text-heading-3 text-brand-black mt-8 mb-4 first:mt-0"
          >
            {paragraph.replace("## ", "")}
          </h2>
        );
      }
      if (paragraph.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="text-heading-4 text-brand-black mt-6 mb-3 first:mt-0"
          >
            {paragraph.replace("### ", "")}
          </h3>
        );
      }
      if (paragraph.startsWith("1. ") || paragraph.startsWith("- ") || paragraph.startsWith("**")) {
        const items = paragraph.split("\n");
        const isOrdered = paragraph.startsWith("1. ");
        if (isOrdered || paragraph.startsWith("- ")) {
          const ListTag = isOrdered ? "ol" : "ul";
          return (
            <ListTag
              key={idx}
              className={`mb-6 ${isOrdered ? "list-decimal" : "list-disc"} pl-6`}
            >
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-body-lg text-brand-grey-600 mb-2">
                  {item.replace(/^[\d.\-]\s*/, "").replace(/\*\*/g, "")}
                </li>
              ))}
            </ListTag>
          );
        }
      }
      return (
        <p key={idx} className="text-body-lg text-brand-grey-600 mb-6">
          {paragraph.replace(/\*\*/g, "")}
        </p>
      );
    });
  };

  const authorName = post.author?.name || "Growth Valley";

  return (
    <>
      <PageHeader
        title={post.title}
        description={post.content?.replace(/<[^>]*>/g, '').substring(0, 200)}
        breadcrumb={[
          { label: "Insights", href: "/insights" },
          { label: post.title.substring(0, 30) + "...", href: `/insights/${post.slug}` },
        ]}
      />

      <Section>
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Meta info */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-brand-grey-100">
              <span className="text-label text-brand-yellow uppercase">
                {post.category}
              </span>
              <span className="text-body-sm text-brand-grey-400">
                {new Date(post.publishDate || post.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-body-sm text-brand-grey-400">
                {Math.ceil((post.content?.length || 500) / 200)} min read
              </span>
            </div>

            {/* Content */}
            <article className="prose prose-lg max-w-none">
              {renderContent(post.content)}
            </article>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-brand-grey-100">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-label text-brand-grey-500 bg-brand-grey-100 px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author */}
            <div className="mt-12 pt-8 border-t border-brand-grey-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-grey-200 rounded-full flex items-center justify-center">
                  <span className="text-heading-4 text-brand-grey-500">
                    {authorName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-body text-brand-black">
                    {authorName}
                  </div>
                  <div className="text-body-sm text-brand-grey-400">
                    Growth Valley
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 bg-brand-grey-50 p-8">
              <h3 className="text-heading-4 text-brand-black mb-3">
                Ready to transform your revenue operations?
              </h3>
              <p className="text-body text-brand-grey-500 mb-6">
                Let's discuss how these insights can be applied to your specific
                situation.
              </p>
              <Button href="/contact">Schedule a Call</Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}