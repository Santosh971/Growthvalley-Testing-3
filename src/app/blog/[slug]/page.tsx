import Container from "@/components/Container";
import Section from "@/components/Section";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
import { getApiUrl } from "@/lib/api-config";

// Content block types
interface ContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'bulletList';
  level?: 1 | 2 | 3;
  text?: string;
  items?: string[];
}

// Component to render content blocks
function ContentBlocksRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading':
            const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
            const headingClasses = {
              1: 'text-heading-1',
              2: 'text-heading-2 mt-12 mb-6',
              3: 'text-heading-3 mt-8 mb-4',
            };
            return (
              <HeadingTag
                key={block.id}
                className={`text-brand-black dark:text-white ${headingClasses[block.level || 2]}`}
              >
                {block.text}
              </HeadingTag>
            );

          case 'paragraph':
            return (
              <p
                key={block.id}
                className="text-body text-brand-grey-600 dark:text-brand-grey-300 mb-6"
              >
                {block.text}
              </p>
            );

          case 'bulletList':
            return (
              <ul
                key={block.id}
                className="list-disc pl-6 my-6 space-y-2"
              >
                {(block.items || []).map((item, index) => (
                  <li
                    key={index}
                    className="text-body text-brand-grey-600 dark:text-brand-grey-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            );

          default:
            return null;
        }
      })}
    </>
  );
}

// Helper function to get excerpt from contentBlocks or content
function getPostExcerpt(post: any, maxLength: number = 120): string {
  if (post.contentBlocks && post.contentBlocks.length > 0) {
    const text = post.contentBlocks
      .map((block: ContentBlock) => {
        if (block.type === 'heading' || block.type === 'paragraph') {
          return block.text || '';
        } else if (block.type === 'bulletList') {
          return (block.items || []).join(' ');
        }
        return '';
      })
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Fallback to old content field
  const plainText = (post.content || '').replace(/<[^>]*>/g, '');
  return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText;
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string) {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.error('API URL not configured');
    return null;
  }
  try {
    const url = `${apiUrl}/api/blog/${slug}`;
    console.log("Fetching blog from:", url);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.log("Blog fetch failed with status:", res.status);
      return null;
    }
    const data = await res.json();
    console.log("Blog fetch success:", data.success);
    return data.data || null;
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return null;
  }
}

async function getRelatedBlogs(currentSlug: string, category: string) {
  const apiUrl = getApiUrl();
  if (!apiUrl) return [];
  try {
    const res = await fetch(
      `${apiUrl}/api/blog`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const blogs = data.data || [];
    return blogs
      .filter((post: any) => post.status === "published" && post.slug !== currentSlug)
      .slice(0, 3);
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return { title: "Blog Post Not Found" };
  }

  // Get description from contentBlocks or content
  let description = blog.seo?.metaDescription;
  if (!description) {
    if (blog.contentBlocks && blog.contentBlocks.length > 0) {
      description = blog.contentBlocks
        .map((block: any) => {
          if (block.type === 'heading' || block.type === 'paragraph') {
            return block.text || '';
          } else if (block.type === 'bulletList') {
            return (block.items || []).join(' ');
          }
          return '';
        })
        .join(' ')
        .replace(/\s+/g, ' ')
        .substring(0, 160);
    } else {
      description = (blog.content || '').replace(/<[^>]*>/g, '').substring(0, 160);
    }
  }

  return {
    title: blog.seo?.metaTitle || `${blog.title} | Growth Valley Blog`,
    description,
    keywords: blog.seo?.keywords || blog.tags,
  };
}

export async function generateStaticParams() {
  const apiUrl = getApiUrl();
  if (!apiUrl) return [];
  try {
    const res = await fetch(`${apiUrl}/api/blog`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).map((post: any) => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  
  if (!blog || blog.status !== "published") {
    notFound();
  }

  const relatedPosts = await getRelatedBlogs(slug, blog.category);

  return (
    <>
      {/* Hero */}
      <Section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-brand-grey-50 dark:bg-brand-grey-900">
        <Container>
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-body-sm">
              <li>
                <Link href="/" className="text-brand-grey-500 dark:text-brand-grey-400 hover:text-brand-black dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-grey-300 dark:text-brand-grey-600">/</span>
                <Link href="/blog" className="text-brand-grey-500 dark:text-brand-grey-400 hover:text-brand-black dark:hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-grey-300 dark:text-brand-grey-600">/</span>
                <span className="text-brand-black dark:text-white truncate max-w-[200px]">{blog.title}</span>
              </li>
            </ol>
          </nav>
          
          <span className="text-label text-accent uppercase mb-4 block">{blog.category}</span>
          <h1 className="text-heading-1 text-brand-black dark:text-white max-w-4xl mb-6">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-body text-brand-grey-500 dark:text-brand-grey-400">
            {blog.author?.name && (
              <>
                <span>By {blog.author.name}</span>
                <span>•</span>
              </>
            )}
            <span>{new Date(blog.publishDate || blog.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}</span>
            <span>•</span>
            <span>{blog.readTime || 5} min read</span>
          </div>
        </Container>
      </Section>

      {/* Featured Image */}
      {blog.featuredImage && (
        <Section className="py-0">
          <Container>
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={getImageUrl(blog.featuredImage)}
                alt={blog.featuredImageAlt || blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          </Container>
        </Section>
      )}

      {/* Content */}
      <Section className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Article Content */}
            <article className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:text-brand-black dark:prose-headings:text-white
              prose-h2:text-heading-2 prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-heading-3 prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-body prose-p:text-brand-grey-600 dark:prose-p:text-brand-grey-300
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-strong:text-brand-black dark:prose-strong:text-white
              prose-ul:my-6 prose-ol:my-6
              prose-li:text-body prose-li:text-brand-grey-600 dark:prose-li:text-brand-grey-300
              prose-blockquote:border-l-accent prose-blockquote:bg-brand-grey-50 dark:prose-blockquote:bg-brand-grey-900 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:italic
            ">
              {/* Render contentBlocks if available, fallback to old content field */}
              {blog.contentBlocks && blog.contentBlocks.length > 0 ? (
                <ContentBlocksRenderer blocks={blog.contentBlocks} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: blog.content?.replace(/\n/g, '<br />') || '' }} />
              )}
            </article>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-brand-grey-200 dark:border-brand-grey-800">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-brand-grey-100 dark:bg-brand-grey-800 text-brand-grey-600 dark:text-brand-grey-400 text-body-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Author Box */}
      {blog.author && (
        <Section className="py-12 bg-brand-grey-50 dark:bg-brand-grey-900">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start gap-6 p-6 bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 rounded-lg">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-brand-black text-xl font-bold flex-shrink-0">
                  {blog.author.name?.charAt(0) || "G"}
                </div>
                <div>
                  <p className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-1">Written by</p>
                  <h4 className="text-heading-4 text-brand-black dark:text-white mb-2">
                    {blog.author.name}
                  </h4>
                  <p className="text-body text-brand-grey-500 dark:text-brand-grey-400">
                    Growth Valley team member specializing in B2B revenue growth strategies.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Section className="py-20 md:py-28 bg-white dark:bg-brand-grey-950">
          <Container>
            <h2 className="text-heading-2 text-brand-black dark:text-white mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((post: any) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="block bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 overflow-hidden hover:border-accent transition-colors group"
                >
                  {post.featuredImage && (
                    <div className="overflow-hidden">
                      <img
                        src={getImageUrl(post.featuredImage)}
                        alt={post.featuredImageAlt || post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-2 block">
                      {post.category}
                    </span>
                    <h3 className="text-heading-4 text-brand-black dark:text-white mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-body-sm text-brand-grey-500 dark:text-brand-grey-400 mb-4 line-clamp-2">
                      {getPostExcerpt(post, 120)}
                    </p>
                    <span className="text-body-sm text-accent">Read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* CTA */}
      <Section className="py-20 md:py-28 bg-brand-black dark:bg-brand-grey-950">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-heading-2 text-white dark:text-white mb-6">
              Ready to accelerate your growth?
            </h2>
            <p className="text-body-lg text-brand-grey-300 dark:text-brand-grey-400 mb-10">
              Let's discuss your revenue challenges and opportunities.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center font-semibold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-brand-grey-950 disabled:opacity-50 disabled:cursor-not-allowed bg-accent text-brand-black hover:bg-accent-light focus:ring-accent px-6 py-3 text-sm"
            >
              Schedule a Call
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}