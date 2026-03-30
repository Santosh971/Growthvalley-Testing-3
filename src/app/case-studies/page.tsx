import PageHeader from "@/components/PageHeader";
import { getPageContent, getSection, getPageSEO } from "@/lib/content";
import { getApiUrl } from "@/lib/api-config";
import { Metadata } from "next";
import CaseStudiesClient from "./CaseStudiesClient";

export const dynamic = 'force-dynamic';

// Interface for case study from database
interface CaseStudy {
  _id?: string;
  slug: string;
  title: string;
  challenge?: string;
  solution?: string;
}

// Interface for header section
interface HeaderSection {
  breadcrumbTitle: string;
  title: string;
  description: string;
}

// Interface for CTA section
interface CTASection {
  title: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
}

async function getCaseStudies(): Promise<CaseStudy[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.error('API URL not configured');
    return [];
  }

  try {
    const res = await fetch(
      `${apiUrl}/api/case-studies`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch case studies:", error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('casestudies');
  const seo = getPageSEO(content, 'casestudies');
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default async function CaseStudiesPage() {
  // Fetch page content from CMS
  const content = await getPageContent('casestudies');
  const header = getSection<HeaderSection>(content, 'header');
  const cta = getSection<CTASection>(content, 'cta');

  // Fetch case study items from database
  const caseStudies = await getCaseStudies();
  const featuredCaseStudies = caseStudies.filter((cs) => cs.featured);
  const otherCaseStudies = caseStudies.filter((cs) => !cs.featured);

  return (
    <>
      <PageHeader
        title={header?.title || "Case Studies"}
        description={header?.description || "Real transformations. Real numbers. See how we've helped B2B companies achieve predictable revenue growth."}
        breadcrumb={[{ label: header?.breadcrumbTitle || "Case Studies", href: "/case-studies" }]}
      />
      <CaseStudiesClient
        featuredCaseStudies={featuredCaseStudies}
        otherCaseStudies={otherCaseStudies}
        caseStudies={caseStudies}
        cta={cta}
      />
    </>
  );
}