import Container from "@/components/Container";
import Section from "@/components/Section";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";
import { getApiUrl } from "@/lib/api-config";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCaseStudy(slug: string) {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.error('API URL not configured');
    return null;
  }
  try {
    const url = `${apiUrl}/api/case-studies/${slug}`;
    console.log("Fetching case study from:", url);
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.log("Case study fetch failed with status:", res.status);
      return null;
    }
    const data = await res.json();
    console.log("Case study fetch success:", data.success);
    return data.data;
  } catch (error) {
    console.error("Failed to fetch case study:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);
  return {
    title: caseStudy?.title || "Case Study",
    description: caseStudy?.challenge?.substring(0, 160),
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    return (
      <Section>
        <Container>
          <div className="text-center py-16">
            <h1 className="text-heading-1 text-brand-black dark:text-white mb-4">
              Case Study Not Found
            </h1>
            <p className="text-body text-brand-grey-500 mb-8">
              The case study you're looking for doesn't exist.
            </p>
            <Button href="/case-studies">View All Case Studies</Button>
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
            className="text-heading-3 text-brand-black dark:text-white mt-8 mb-4 first:mt-0"
          >
            {paragraph.replace("## ", "")}
          </h2>
        );
      }
      if (paragraph.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="text-heading-4 text-brand-black dark:text-white mt-6 mb-3 first:mt-0"
          >
            {paragraph.replace("### ", "")}
          </h3>
        );
      }
      if (paragraph.startsWith("**")) {
        return (
          <p key={idx} className="text-body-lg text-brand-grey-600 dark:text-brand-grey-300 mb-4 font-semibold">
            {paragraph.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (paragraph.startsWith("1. ") || paragraph.startsWith("- ")) {
        const items = paragraph.split("\n");
        const isOrdered = paragraph.startsWith("1. ");
        const ListTag = isOrdered ? "ol" : "ul";
        return (
          <ListTag
            key={idx}
            className={`mb-6 ${isOrdered ? "list-decimal" : "list-disc"} pl-6`}
          >
            {items.map((item, itemIdx) => (
              <li key={itemIdx} className="text-body-lg text-brand-grey-600 dark:text-brand-grey-300 mb-2">
                {item.replace(/^[\d.\-]\s*/, "").replace(/\*\*/g, "")}
              </li>
            ))}
          </ListTag>
        );
      }
      return (
        <p key={idx} className="text-body-lg text-brand-grey-600 dark:text-brand-grey-300 mb-6">
          {paragraph.replace(/\*\*/g, "")}
        </p>
      );
    });
  };

  return (
    <>
      <PageHeader
        title={caseStudy.title}
        description={caseStudy.challenge?.substring(0, 150) + "..."}
        breadcrumb={[
          { label: "Case Studies", href: "/case-studies" },
          { label: caseStudy.title, href: `/case-studies/${caseStudy.slug}` },
        ]}
      />

      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Challenge */}
            <div className="mb-12">
              <h2 className="text-heading-3 text-brand-black dark:text-white mb-4">
                The Challenge
              </h2>
              {renderContent(caseStudy.challenge)}
            </div>

            {/* Solution */}
            {caseStudy.solution && (
              <div className="mb-12">
                <h2 className="text-heading-3 text-brand-black dark:text-white mb-4">
                  Our Solution
                </h2>
                {renderContent(caseStudy.solution)}
              </div>
            )}

            {/* CTA */}
            <div className="bg-brand-grey-50 dark:bg-brand-grey-900 p-8 border border-brand-grey-200 dark:border-brand-grey-800 rounded-lg">
              <h3 className="text-heading-4 text-brand-black dark:text-white mb-3">
                Want similar results for your business?
              </h3>
              <p className="text-body text-brand-grey-500 dark:text-brand-grey-400 mb-6">
                Let's discuss how we can help transform your revenue operations.
              </p>
              <Button href="/contact">Schedule a Call</Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}