import PageHeader from "@/components/PageHeader";
import { getPageContent, getSection, getPageSEO } from "@/lib/content";
import { Metadata } from "next";
import IndustriesClient from "./IndustriesClient";

export const dynamic = 'force-dynamic';

// Mapping from industry page IDs to case study industry enum values
const INDUSTRY_ID_TO_CASE_STUDY_MAP: Record<string, string[]> = {
  'saas': ['SaaS'],
  'professional-services': ['Technology'],
  'manufacturing': ['Manufacturing'],
  'financial-services': ['Finance'],
  'healthcare': ['Healthcare'],
  'e-commerce': ['E-commerce'],
  'education': ['Education'],
  'real-estate': ['Real Estate'],
  'other': ['Other']
};

// Fetch case study counts from API
async function getCaseStudyCounts(): Promise<Record<string, number>> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const response = await fetch(`${API_URL}/api/case-studies/industries`, {
      cache: 'no-store'
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        // Convert array to a map: { 'SaaS': 5, 'Manufacturing': 3, ... }
        const counts: Record<string, number> = {};
        data.data.forEach((item: { name: string; count: number }) => {
          counts[item.name] = item.count;
        });
        return counts;
      }
    }
  } catch (error) {
    console.error('Failed to fetch case study counts:', error);
  }
  return {};
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('industries');
  const seo = getPageSEO(content, 'industries');
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default async function IndustriesPage() {
  const content = await getPageContent('industries');

  // Debug: Log what we receive from the API
  console.log('Industries page - content.sections:', JSON.stringify(content.sections, null, 2));
  console.log('Industries page - isDefault:', content.isDefault);

  const hero = getSection<{ title: string; description: string }>(content, 'hero');
  const industriesRaw = getSection<Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
    challenges: string[];
    results: string[];
    caseStudyCount: number;
  }>>(content, 'industries');
  const cta = getSection<{ title: string; description: string; buttonText: string; buttonLink: string }>(content, 'cta');

  // Debug: Log the industries array
  console.log('Industries page - industriesRaw:', industriesRaw);
  console.log('Industries page - industriesRaw is array:', Array.isArray(industriesRaw));

  // Ensure industries is always an array
  const industries = Array.isArray(industriesRaw) ? industriesRaw : [];

  // Fetch dynamic case study counts
  const caseStudyCounts = await getCaseStudyCounts();

  // Merge dynamic counts with industries data
  const industriesWithCounts = industries.map(industry => {
    const mappedIndustryNames = INDUSTRY_ID_TO_CASE_STUDY_MAP[industry.id] || [];
    const dynamicCount = mappedIndustryNames.reduce((sum, name) => sum + (caseStudyCounts[name] || 0), 0);
    return {
      ...industry,
      caseStudyCount: dynamicCount || industry.caseStudyCount // Use dynamic count, fallback to default
    };
  });

  return (
    <>
      <PageHeader
        title={hero?.title || "Industry Expertise"}
        description={hero?.description || "We understand the unique challenges of each sector. Our playbook adapts to your industry while drawing on proven patterns from across B2B."}
        breadcrumb={[{ label: "Industries", href: "/industries" }]}
      />
      <IndustriesClient hero={hero} industries={industriesWithCounts} cta={cta} />
    </>
  );
}