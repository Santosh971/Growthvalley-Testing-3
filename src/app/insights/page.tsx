import Container from "@/components/Container";
import Section from "@/components/Section";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";
import Link from "next/link";
import { getApiUrl } from "@/lib/api-config";

export const metadata = {
  title: "Insights",
  description:
    "Expert perspectives on revenue operations, sales process design, and B2B growth strategies.",
};

export const dynamic = 'force-dynamic';

// Helper to strip HTML and truncate content
function getExcerpt(content: string, maxLength: number = 150): string {
  if (!content) return '';
  // Strip HTML tags
  const plainText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ');
  // Truncate to max length
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
}

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

export default async function InsightsPage() {
  const blogs = await getBlogs();
  const featuredPosts = blogs.filter((post: any) => post.featured);
  const recentPosts = blogs
    .filter((post: any) => !post.featured)
    .sort(
      (a: any, b: any) =>
        new Date(b.publishDate || b.createdAt).getTime() -
        new Date(a.publishDate || a.createdAt).getTime()
    );

  return (
    <>
      <PageHeader
        title="Insights"
        description="Expert perspectives on revenue operations, sales process design, and B2B growth strategies."
        breadcrumb={[{ label: "Insights", href: "/insights" }]}
      />

      <Section>
        <Container>
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-16">
              <span className="text-label text-accent uppercase mb-6 block">
                Featured
              </span>
              <div className="grid lg:grid-cols-2 gap-8">
                {featuredPosts.map((post: any) => (
                  <Link
                    key={post._id || post.slug}
                    href={`/insights/${post.slug}`}
                    className="block bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-8 hover:border-accent transition-colors"
                  >
                    <span className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-3 block">
                      {post.category}
                    </span>
                    <h3 className="text-heading-3 text-brand-black dark:text-white mb-3">
                      {post.title}
                    </h3>
                    <p className="text-body text-brand-grey-500 dark:text-brand-grey-400 mb-4">
                      {getExcerpt(post.content, 200)}
                    </p>
                    <div className="flex items-center gap-4 text-body-sm text-brand-grey-400 dark:text-brand-grey-500">
                      <span>{post.author?.name || "Growth Valley"}</span>
                      <span>•</span>
                      <span>
                        {Math.ceil((post.content?.length || 500) / 200)} min read
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Posts */}
          <div>
            <span className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-6 block">
              All Articles
            </span>
            {blogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400">
                  No articles yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((post: any) => (
                  <Link
                    key={post._id || post.slug}
                    href={`/insights/${post.slug}`}
                    className="block bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-6 hover:border-accent transition-colors"
                  >
                    <span className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-2 block">
                      {post.category}
                    </span>
                    <h3 className="text-heading-4 text-brand-black dark:text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-body-sm text-brand-grey-500 dark:text-brand-grey-400 mb-4 line-clamp-3">
                      {getExcerpt(post.content, 150)}
                    </p>
                    <div className="flex items-center justify-between text-body-sm text-brand-grey-400 dark:text-brand-grey-500">
                      <span>
                        {new Date(
                          post.publishDate || post.createdAt
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>
                        {Math.ceil((post.content?.length || 500) / 200)} min read
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>

      <Section background="grey">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-heading-2 text-brand-black dark:text-white mb-6">
              Want personalized insights for your business?
            </h2>
            <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400 mb-10">
              Our discovery process uncovers specific opportunities in your
              revenue operations.
            </p>
            <Button href="/contact">Schedule a Discovery Call</Button>
          </div>
        </Container>
      </Section>
    </>
  );
}