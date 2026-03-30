import { getPageContent, getSection } from "@/lib/content";
import dynamicComponent from "next/dynamic";
import { getApiUrl } from '@/lib/api-config';

// Route segment config - disable static generation for dynamic content
export const dynamic = 'force-dynamic';

// Above-fold component - loaded with SSR for initial paint SEO
const AnimatedHeroSection = dynamicComponent(
  () => import("@/components/AnimatedSections").then(m => m.AnimatedHeroSection),
  { ssr: true }
);

// Below-fold components - lazy loaded for performance
const AnimatedCredibilitySection = dynamicComponent(
  () => import("@/components/AnimatedSections").then(m => m.AnimatedCredibilitySection),
  { ssr: false }
);

const AnimatedClientLogosSection = dynamicComponent(
  () => import("@/components/AnimatedSections").then(m => m.AnimatedClientLogosSection),
  { ssr: false }
);

const AnimatedProblemSection = dynamicComponent(
  () => import("@/components/AnimatedSections").then(m => m.AnimatedProblemSection),
  { ssr: false }
);

const AnimatedSolutionSection = dynamicComponent(
  () => import("@/components/AnimatedSections").then(m => m.AnimatedSolutionSection),
  { ssr: false }
);

const AnimatedIndustriesSection = dynamicComponent(
  () => import("@/components/AnimatedSections").then(m => m.AnimatedIndustriesSection),
  { ssr: false }
);

const AnimatedTestimonialsSection = dynamicComponent(
  () => import("@/components/AnimatedSections").then(m => m.AnimatedTestimonialsSection),
  { ssr: false }
);

const AnimatedCaseStudyPreview = dynamicComponent(
  () => import("@/components/AnimatedSections").then(m => m.AnimatedCaseStudyPreview),
  { ssr: false }
);

const AnimatedOperatingModel = dynamicComponent(
  () => import("@/components/AnimatedSections").then(m => m.AnimatedOperatingModel),
  { ssr: false }
);

const AnimatedFinalCTA = dynamicComponent(
  () => import("@/components/AnimatedSections").then(m => m.AnimatedFinalCTA),
  { ssr: false }
);

// Fetch testimonials from API
async function getTestimonials() {
  const apiUrl = getApiUrl();
  if (!apiUrl) return [];
  try {
    const res = await fetch(`${apiUrl}/api/testimonials?status=active`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

// Fetch clients from API
async function getClients() {
  const apiUrl = getApiUrl();
  if (!apiUrl) return [];
  try {
    const res = await fetch(`${apiUrl}/api/clients?status=active`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

// Fetch featured case studies from API and transform for home page
async function getFeaturedCaseStudies() {
  const apiUrl = getApiUrl();
  if (!apiUrl) return [];
  try {
    // First try to get featured case studies
    const featuredRes = await fetch(`${apiUrl}/api/case-studies/featured?limit=6`, {
      cache: 'no-store'
    });
    const featuredData = await featuredRes.json();

    if (featuredData.success && featuredData.data && featuredData.data.length > 0) {
      // Transform featured case studies to match component format
      return featuredData.data.map((study: any) => ({
        client: study.clientName || study.title,
        industry: study.industry || 'Other',
        result: study.results?.[0]?.value || study.results?.[0]?.metric || '',
        description: study.challenge || study.solution || '',
        link: `/case-studies/${study.slug}`
      }));
    }

    // If no featured case studies, fetch all published case studies
    const allRes = await fetch(`${apiUrl}/api/case-studies?limit=6`, {
      cache: 'no-store'
    });
    const allData = await allRes.json();

    if (allData.success && allData.data) {
      // Transform all case studies to match component format
      return allData.data.map((study: any) => ({
        client: study.clientName || study.title,
        industry: study.industry || 'Other',
        result: study.results?.[0]?.value || study.results?.[0]?.metric || '',
        description: study.challenge || study.solution || '',
        link: `/case-studies/${study.slug}`
      }));
    }

    return [];
  } catch {
    return [];
  }
}

// Fetch industries data from dedicated industries page content
async function getIndustries() {
  const apiUrl = getApiUrl();
  if (!apiUrl) return null;
  try {
    const res = await fetch(`${apiUrl}/api/content/industries`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.success && data.data?.sections?.industries) {
      // Transform industries page data to match home page component format
      const industriesArray = data.data.sections.industries;
      return {
        title: 'Industries',
        subtitle: 'Deep expertise across B2B sectors',
        description: 'We\'ve helped companies across industries transform.',
        items: industriesArray.map((industry: any) => ({
          id: industry.id,
          icon: industry.icon,
          name: industry.name,
          description: industry.description
        }))
      };
    }
    return null;
  } catch {
    return null;
  }
}

export default async function Home() {
  // Fetch dynamic content
  const content = await getPageContent('home');

  // Fetch testimonials, clients, featured case studies, and industries in parallel
  const [testimonials, clients, featuredCaseStudies, industriesData] = await Promise.all([
    getTestimonials(),
    getClients(),
    getFeaturedCaseStudies(),
    getIndustries()
  ]);

  // Extract sections from content
  const hero = getSection(content, 'hero');
  const stats = getSection(content, 'stats');
  const problems = getSection(content, 'problems');
  const solutions = getSection(content, 'solutions');
  const caseStudyPreviewContent = getSection(content, 'caseStudyPreview');
  const process = getSection(content, 'process');
  const cta = getSection(content, 'cta');

  // Use industries from dedicated API, fall back to home page content
  const industries = industriesData || getSection(content, 'industries');

  // Merge CMS content with dynamic case studies
  // Only show case studies from backend/database - do NOT fall back to static CMS content
  // If no backend case studies exist, the section will be hidden (returns null in component)
  const caseStudyPreview = {
    title: caseStudyPreviewContent?.title || 'Results',
    subtitle: caseStudyPreviewContent?.subtitle || 'Real transformations. Real numbers.',
    items: featuredCaseStudies.length > 0 ? featuredCaseStudies : []
  };

  console.log("CaseStudy Preview : ", caseStudyPreview);
  return (
    <>
      <AnimatedHeroSection hero={hero} />
      <AnimatedCredibilitySection stats={stats} />
      <AnimatedClientLogosSection clients={clients} />
      <AnimatedProblemSection problems={problems} />
      <AnimatedSolutionSection solutions={solutions} />
      <AnimatedIndustriesSection industries={industries} />
      <AnimatedTestimonialsSection testimonials={testimonials} />
      <AnimatedCaseStudyPreview caseStudyPreview={caseStudyPreview} />
      <AnimatedOperatingModel process={process} />
      <AnimatedFinalCTA cta={cta} />
    </>
  );
}


