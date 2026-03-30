import { getPublicPageContent } from '@/lib/utils';

export const dynamic = 'force-dynamic'; import PageHeader from "@/components/PageHeader";
import { getPageContent, getSection, getPageSEO } from "@/lib/content";
import { getApiUrl } from "@/lib/api-config";
import { Metadata } from "next";
import CompanyClient from "./CompanyClient";


export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('company');
  const seo = getPageSEO(content, 'company');
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

async function getTeamMembers() {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.error('API URL not configured');
    return [];
  }

  try {
    const res = await fetch(
      `${apiUrl}/api/team`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return [];
  }
}

export default async function CompanyPage() {
  const [content, teamMembers] = await Promise.all([
    getPageContent('company'),
    getTeamMembers()
  ]);

  const hero = getSection<{ title: string; description: string }>(content, 'hero');
  const mission = getSection<{ title: string; content: string }>(content, 'mission');
  const origin = getSection<{ title: string; content: string }>(content, 'origin');
  const values = getSection<{
    title: string;
    subtitle: string;
    items: Array<{ title: string; description: string }>;
  }>(content, 'values');
  const approach = getSection<{
    title: string;
    subtitle: string;
    steps: Array<{ number: string; title: string; description: string }>;
  }>(content, 'approach');
  const cta = getSection<{ title: string; description: string; buttonText: string; buttonLink: string }>(content, 'cta');

  return (
    <>
      <PageHeader
        title={hero?.title || "About Growth Valley"}
        description={hero?.description || "We help B2B companies transform fragmented revenue operations into unified, predictable growth engines."}
        breadcrumb={[{ label: "Company", href: "/company" }]}
      />
      <CompanyClient
        mission={mission}
        origin={origin}
        teamMembers={teamMembers}
        values={values}
        approach={approach}
        cta={cta}
      />
    </>
  );
}