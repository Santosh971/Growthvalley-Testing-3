// Content fetching utilities for frontend pages
// Provides fallback content from defaults if API fails
import { getApiUrl } from './api-config';

// Default content structures (same as backend)
const defaultContent = {
  home: {
    hero: {
      label: 'Revenue Operations Consulting',
      title: 'Predictable Revenue Systems for Scalable Businesses',
      subtitle: 'We transform fragmented revenue operations into unified, predictable growth engines. No more guessing. No more missed targets.',
      ctaText: 'Schedule a Call',
      ctaLink: '/contact',
      secondaryCtaText: 'View Case Studies',
      secondaryCtaLink: '/case-studies'
    },
    stats: [
      { value: '40%+', label: 'Average Revenue Growth' },
      { value: '85%', label: 'Forecast Accuracy Achieved' },
      { value: '50+', label: 'Companies Transformed' },
      { value: '$2B+', label: 'Revenue Influenced' }
    ],
    problems: {
      title: 'The Challenge',
      subtitle: 'Most B2B companies struggle with revenue unpredictability',
      description: 'Sound familiar? You\'re not alone. These challenges are more common than you think.',
      items: [
        { title: 'Unpredictable Revenue', description: 'Forecasting feels like guesswork. Missed targets erode confidence and derail growth plans.' },
        { title: 'Fragmented Operations', description: 'Sales, marketing, and customer success operate in silos. Data lives in different systems. Handoffs break down.' },
        { title: 'Scaling Bottlenecks', description: 'Founder-led sales becomes unsustainable. Growth stalls when individuals, not systems, drive revenue.' },
        { title: 'Wasted Resources', description: 'High customer acquisition costs. Low retention. Revenue leaks across the funnel without visibility.' }
      ]
    },
    solutions: {
      title: 'Our Approach',
      subtitle: 'Building predictable revenue, systematically',
      description: 'We don\'t offer quick fixes. We build lasting revenue systems.',
      exploreButtonText: 'Explore All Solutions',
      items: [
        { icon: 'chart', title: 'Revenue Architecture', description: 'Design unified revenue systems with clear stages, metrics, and accountability.' },
        { icon: 'process', title: 'Sales Process Design', description: 'Build scalable processes that convert leads consistently and efficiently.' },
        { icon: 'team', title: 'RevOps Implementation', description: 'Unify operations across sales, marketing, and customer success.' },
        { icon: 'target', title: 'Go-to-Market Strategy', description: 'Define the optimal route to market for your products and segments.' }
      ]
    },
    industries: {
      title: 'Industries',
      subtitle: 'Deep expertise across B2B sectors',
      description: 'We\'ve helped companies in every major B2B industry transform their revenue operations.',
      items: [
        { icon: '💻', name: 'SaaS & Technology', description: 'Accelerating growth for software companies worldwide.' },
        { icon: '👔', name: 'Professional Services', description: 'Building scalable revenue for consulting and services firms.' },
        { icon: '🏭', name: 'Manufacturing', description: 'Modernizing go-to-market for industrial leaders.' },
        { icon: '🏦', name: 'Financial Services', description: 'Driving revenue excellence in regulated environments.' }
      ]
    },
    // caseStudyPreview: {
    //   title: 'Results',
    //   subtitle: 'Real transformations. Real numbers.',
    //   items: [
    //     { client: 'TechScale', industry: 'SaaS', result: '40% revenue growth', description: 'Transformed revenue operations for a fast-growing SaaS company.', link: '/case-studies/saas-revenue-transformation' },
    //     { client: 'GlobalTech', industry: 'Manufacturing', result: '60% new market revenue', description: 'Redesigned go-to-market strategy for a legacy manufacturer.', link: '/case-studies/manufacturing-demand-generation' }
    //   ]
    // },
    caseStudyPreview: {
      title: '',
      subtitle: '',
      items: []
    },

    process: {
      title: 'How We Work',
      subtitle: 'A systematic approach to transformation',
      steps: [
        { number: '01', title: 'Discovery', description: 'Deep dive into your current state. Identify gaps, opportunities, and constraints.' },
        { number: '02', title: 'Design', description: 'Architect the target state. Define processes, systems, and organizational structure.' },
        { number: '03', title: 'Implement', description: 'Execute with precision. Build, train, and optimize in rapid iterations.' },
        { number: '04', title: 'Optimize', description: 'Continuous improvement. Monitor, measure, and refine for sustainable performance.' }
      ]
    },
    cta: {
      title: 'Ready for predictable revenue?',
      description: 'Let\'s discuss how Growth Valley can transform your revenue operations. No commitment required.',
      buttonText: 'Schedule a Call',
      buttonLink: '/contact'
    }
  },

  company: {
    hero: {
      title: 'About Growth Valley',
      description: 'We help B2B companies transform fragmented revenue operations into unified, predictable growth engines.'
    },
    mission: {
      title: 'Our Mission',
      content: 'Growth Valley was founded on a simple observation: most B2B companies struggle with revenue unpredictability, not because they lack good products or talented people, but because their revenue operations are fragmented and misaligned.\n\nWe exist to change that. We build systems that enable predictable, scalable revenue growth—so leaders can focus on strategy instead of firefighting.'
    },
    origin: {
      title: 'The Origin',
      content: 'After years of leading revenue operations for high-growth B2B companies, our founding team saw the same patterns repeat: great teams hampered by broken systems. They set out to build the firm they wished existed—a partner that could diagnose the real problems and build lasting solutions.'
    },
    values: {
      title: 'What We Believe',
      subtitle: 'Our values shape how we work with clients and each other.',
      items: [
        { title: 'Outcomes Over Output', description: 'We measure success by business results, not deliverables. Every engagement is designed to create lasting impact.' },
        { title: 'Systems Thinking', description: 'Revenue problems are rarely isolated. We connect the dots across your organization to find root causes.' },
        { title: 'Practical Expertise', description: 'Our recommendations are grounded in real-world experience. No theoretical frameworks that don\'t work in practice.' },
        { title: 'Partnership Mindset', description: 'We\'re not consultants who disappear after the presentation. We roll up our sleeves and work alongside your team.' }
      ]
    },
    approach: {
      title: 'How We Work',
      subtitle: 'A partnership approach that creates lasting transformation.',
      steps: [
        { number: '01', title: 'Listen First', description: 'We start every engagement by understanding your unique context. No cookie-cutter solutions.' },
        { number: '02', title: 'Diagnose Deeply', description: 'Surface-level fixes don\'t last. We identify root causes and systemic patterns.' },
        { number: '03', title: 'Design Pragmatically', description: 'Theory without practice is useless. We design solutions that work in your reality.' },
        { number: '04', title: 'Implement Together', description: 'Great strategies fail without execution. We stay until the job is done.' }
      ]
    },
    cta: {
      title: 'Let\'s Build Something Together',
      description: 'Every transformation starts with a conversation. We\'d love to hear about your revenue challenges.',
      buttonText: 'Schedule a Call',
      buttonLink: '/contact'
    }
  },

  services: {
    hero: {
      title: 'Revenue Solutions That Scale',
      description: 'We offer four core solutions, each designed to address specific revenue challenges. Deploy individually or together for maximum impact.'
    },
    solutions: [
      {
        id: 'revenue-architecture',
        title: 'Revenue Architecture',
        description: 'Design and implement unified revenue systems that align your entire organization around predictable growth.',
        features: ['Revenue stage definition and mapping', 'Metrics and KPI framework', 'Process ownership and RACI design', 'Revenue team structure', 'Compensation alignment'],
        outcomes: ['Clear visibility into revenue', 'Aligned teams', 'Simplified forecasting']
      },
      {
        id: 'sales-process',
        title: 'Sales Process Design',
        description: 'Build scalable sales processes that convert leads consistently and efficiently throughout the customer journey.',
        features: ['Qualification framework implementation', 'Stage definition and exit criteria', 'Playbook development', 'Deal velocity optimization', 'Win rate improvement programs'],
        outcomes: ['Faster sales cycles', 'Higher win rates', 'Consistent execution']
      },
      {
        id: 'revops',
        title: 'RevOps Implementation',
        description: 'Unify operations across sales, marketing, and customer success for seamless revenue flow.',
        features: ['Operations team design', 'Tech stack integration', 'Data infrastructure build', 'Reporting and dashboard creation', 'RevOps process governance'],
        outcomes: ['Unified revenue view', 'Efficient operations', 'Data-driven decisions']
      },
      {
        id: 'gtm',
        title: 'Go-to-Market Strategy',
        description: 'Define the optimal route to market for your products, segments, and competitive landscape.',
        features: ['Market segmentation analysis', 'Competitive positioning', 'Channel strategy development', 'Pricing and packaging', 'Launch planning'],
        outcomes: ['Clear market focus', 'Effective channels', 'Competitive advantage']
      }
    ],
    cta: {
      title: 'Not sure which solution you need?',
      description: 'Our discovery process identifies the highest-impact opportunities for your specific situation.',
      buttonText: 'Schedule a Discovery Call',
      buttonLink: '/contact'
    }
  },

  industries: {
    hero: {
      title: 'Industry Expertise',
      description: 'We understand the unique challenges of each sector. Our playbook adapts to your industry while drawing on proven patterns from across B2B.'
    },
    industries: [
      {
        id: 'saas',
        name: 'SaaS & Technology',
        icon: '💻',
        description: 'We\'ve helped dozens of SaaS companies transform their revenue operations, from early-stage startups to established enterprises.',
        challenges: ['Scaling revenue beyond founder-led sales', 'Aligning PLG and sales-led motions', 'Improving net revenue retention', 'Managing multiple pricing tiers'],
        results: ['40%+ average revenue growth', '85%+ forecast accuracy', '125% average NRR', '25% faster sales cycles'],
        caseStudyCount: 15
      },
      {
        id: 'professional-services',
        name: 'Professional Services',
        icon: '👔',
        description: 'Consulting firms, agencies, and service providers face unique revenue challenges. We help build systems that scale expertise.',
        challenges: ['Founder dependency in sales', 'Project-based revenue unpredictability', 'Balancing utilization and growth', 'Transitioning to recurring revenue'],
        results: ['3x revenue scale in 24 months', 'Founder time freed by 70%', 'Predictable pipeline visibility', 'Scalable revenue engine'],
        caseStudyCount: 12
      },
      {
        id: 'manufacturing',
        name: 'Manufacturing',
        icon: '🏭',
        description: 'Traditional manufacturers are digitally transforming their go-to-market. We help navigate this transition without disrupting core business.',
        challenges: ['Digital-first competitors', 'Long, complex sales cycles', 'Evolved buyer expectations', 'Modernizing legacy processes'],
        results: ['60% new market revenue', '35% higher win rates', 'Digital channel development', 'Cross-functional alignment'],
        caseStudyCount: 10
      },
      {
        id: 'financial-services',
        name: 'Financial Services',
        icon: '🏦',
        description: 'Regulated industries require specialized approaches. We bring experience navigating compliance while driving revenue excellence.',
        challenges: ['Complex compliance requirements', 'Extended sales cycles', 'Cross-selling across products', 'Balancing risk and growth'],
        results: ['45% faster deal velocity', '90%+ compliance adherence', 'Unified revenue visibility', 'Streamlined operations'],
        caseStudyCount: 8
      }
    ],
    cta: {
      title: 'Don\'t see your industry?',
      description: 'Our methodology applies across B2B sectors. If you sell to businesses, we can help transform your revenue operations.',
      buttonText: 'Tell Us About Your Industry',
      buttonLink: '/contact'
    }
  },

  'casestudies': {
    header: {
      breadcrumbTitle: 'Case Studies',
      title: 'Case Studies',
      description: 'Real transformations. Real numbers. See how we\'ve helped B2B companies achieve predictable revenue growth.'
    },
    cta: {
      title: 'Want results like these?',
      description: 'Every transformation starts with a conversation. Let\'s discuss your revenue challenges.',
      buttonText: 'Schedule a Call',
      buttonLink: '/contact'
    }
  },

  contact: {
    hero: {
      title: 'Get in Touch',
      description: 'Ready to transform your revenue operations? Let\'s start the conversation.'
    },
    form: {
      interests: [
        { value: 'revenue-architecture', label: 'Revenue Architecture' },
        { value: 'sales-process', label: 'Sales Process Design' },
        { value: 'revops', label: 'RevOps Implementation' },
        { value: 'gtm', label: 'Go-to-Market Strategy' },
        { value: 'other', label: 'Other / Not Sure' }
      ]
    },
    info: {
      title: 'Direct Contact',
      email: 'hello@growthvalley.com',
      location: 'Nashik, Maharashtra, India'
    },
    contactInfo: {
      email: '',
      phone: '',
      alternatePhone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    expectations: {
      title: 'What to Expect',
      items: [
        'Response within one business day',
        'Initial discovery call to understand your situation',
        'Clear proposal with scope, timeline, and investment',
        'No commitment required for initial conversation'
      ]
    },
    successMessage: {
      title: 'Message Received',
      description: 'Thank you for reaching out. We\'ll get back to you within one business day.'
    }
  },

  privacy: {
    hero: {
      title: 'Privacy Policy',
      lastUpdated: '2026-02-18'
    },
    content: {
      intro: 'At Growth Valley, we take your privacy seriously. This policy describes what information we collect, how we use it, and your rights regarding your personal data.',
      sections: [
        {
          title: '1. Information We Collect',
          content: 'We collect information you provide directly to us, such as when you fill out a contact form, subscribe to our newsletter, or communicate with us. This may include your name, email address, phone number, company name, and any other information you choose to provide. We also automatically collect certain information when you visit our website, including your IP address, browser type, device information, pages visited, and referring URL.'
        },
        {
          title: '2. How We Use Your Information',
          content: 'We use the information we collect to respond to your inquiries, provide the services you request, send you marketing communications (if you\'ve opted in), improve our website and services, analyze usage patterns, and comply with legal obligations. We do not sell your personal information to third parties.'
        },
        {
          title: '3. Information Sharing',
          content: 'We may share your information with service providers who perform services on our behalf, such as email delivery, hosting, and analytics. We may also share information if required by law or to protect our rights and the rights of others. We do not sell, rent, or trade your personal information to third parties for marketing purposes.'
        },
        {
          title: '4. Cookies and Tracking',
          content: 'We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings and other tools. We use Google Analytics to understand how visitors interact with our website.'
        },
        {
          title: '5. Data Security',
          content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.'
        },
        {
          title: '6. Your Rights',
          content: 'Depending on your location, you may have rights regarding your personal information, including the right to access, correct, delete, or port your data, and to object to or restrict certain processing. Contact us to exercise these rights.'
        },
        {
          title: '7. Data Retention',
          content: 'We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.'
        },
        {
          title: '8. Third-Party Links',
          content: 'Our website may contain links to third-party websites. We are not responsible for the privacy practices of these sites. We encourage you to review the privacy policies of any third-party sites you visit.'
        },
        {
          title: '9. Children\'s Privacy',
          content: 'Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected such information, we will take steps to delete it.'
        },
        {
          title: '10. Changes to This Policy',
          content: 'We may update this privacy policy from time to time. The updated version will be indicated by the "Last Updated" date at the top of this page. We encourage you to review this policy periodically.'
        },
        {
          title: '11. Contact Us',
          content: 'If you have questions or concerns about this privacy policy or our data practices, please contact us at hello@growthvalley.com.'
        }
      ]
    },
    cta: {
      title: 'Questions About Your Privacy?',
      description: 'If you have any questions or concerns about your privacy, please don\'t hesitate to contact us.',
      buttonText: 'Contact Us',
      buttonLink: '/contact'
    }
  },

  terms: {
    hero: {
      title: 'Terms & Conditions',
      lastUpdated: '2026-02-18'
    },
    content: {
      intro: 'Welcome to Growth Valley. By accessing or using our website and services, you agree to be bound by these Terms & Conditions. Please read them carefully.',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: 'By accessing and using this website, you accept and agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our website or services.'
        },
        {
          title: '2. Services',
          content: 'Growth Valley provides revenue operations consulting services to B2B companies. Our services include but are not limited to revenue architecture, sales process design, RevOps implementation, and go-to-market strategy consulting. The specific scope of services will be defined in individual service agreements.'
        },
        {
          title: '3. Intellectual Property',
          content: 'All content on this website, including text, graphics, logos, images, and software, is the property of Growth Valley or its content suppliers and is protected by intellectual property laws. You may not reproduce, modify, distribute, or create derivative works without our prior written consent.'
        },
        {
          title: '4. User Obligations',
          content: 'You agree to use our website only for lawful purposes and in a way that does not infringe upon the rights of others or restrict their use of the website. You must not attempt to gain unauthorized access to any part of the website or any systems or networks connected to it.'
        },
        {
          title: '5. Limitation of Liability',
          content: 'To the maximum extent permitted by law, Growth Valley shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services. Our total liability shall not exceed the amount paid for the specific service giving rise to the claim.'
        },
        {
          title: '6. Indemnification',
          content: 'You agree to indemnify and hold harmless Growth Valley and its employees, consultants, and agents from any claims, damages, losses, or expenses arising from your use of our services or violation of these terms.'
        },
        {
          title: '7. Confidentiality',
          content: 'During the course of our engagement, both parties may have access to confidential information. Each party agrees to keep such information confidential and not disclose it to third parties without prior written consent, except as required by law.'
        },
        {
          title: '8. Service Agreements',
          content: 'Specific terms for consulting engagements will be outlined in individual service agreements. In case of conflict between these Terms & Conditions and a service agreement, the service agreement shall prevail for that specific engagement.'
        },
        {
          title: '9. Payment Terms',
          content: 'Payment terms will be specified in individual service agreements. Unless otherwise agreed, invoices are due within 30 days of receipt. Late payments may be subject to interest charges.'
        },
        {
          title: '10. Termination',
          content: 'We reserve the right to terminate or suspend access to our website and services at our discretion, without notice, for conduct that we believe violates these Terms & Conditions or is harmful to other users, us, or third parties, or for any other reason.'
        },
        {
          title: '11. Changes to Terms',
          content: 'We may modify these Terms & Conditions at any time. Changes will be effective when posted on this website. Your continued use of the website after changes are posted constitutes acceptance of the modified terms.'
        },
        {
          title: '12. Governing Law',
          content: 'These Terms & Conditions shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Nashik, Maharashtra, India.'
        },
        {
          title: '13. Contact',
          content: 'If you have questions about these Terms & Conditions, please contact us at hello@growthvalley.com.'
        }
      ]
    },
    cta: {
      title: 'Questions About Our Terms?',
      description: 'If you have any questions about these terms or our services, please get in touch.',
      buttonText: 'Contact Us',
      buttonLink: '/contact'
    }
  }
};

export type PageContent = {
  page: string;
  sections: Record<string, any>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;
  };
  isDefault?: boolean;
};

/**
 * Deep merge utility - merges source into target recursively
 * Preserves all existing data while overlaying new data
 */
function deepMergeSections<T extends Record<string, any>>(target: T, source: Partial<T> | undefined): T {
  if (!source) return target;

  const result = { ...target };

  for (const key of Object.keys(source) as (keyof T)[]) {
    const sourceValue = source[key];
    const targetValue = target[key];

    // If both are non-null objects (not arrays), merge recursively
    if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMergeSections(targetValue as Record<string, any>, sourceValue as Record<string, any>) as T[keyof T];
    } else {
      // For arrays, primitives, or null values, use source value (it takes priority)
      result[key] = sourceValue as T[keyof T];
    }
  }

  return result;
}

/**
 * Fetch page content from API with fallback to defaults
 */
export async function getPageContent(page: string): Promise<PageContent> {
  const pageKey = page.toLowerCase();
  const apiUrl = getApiUrl();

  if (!apiUrl) {
    console.warn('⚠️ API URL not configured - returning default content. Set NEXT_PUBLIC_API_URL environment variable.');
    return {
      page: pageKey,
      sections: getDefaultContent(pageKey),
      seo: {},
      isDefault: true
    };
  }

  try {
    const response = await fetch(`${apiUrl}/api/content/${pageKey}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        const apiSections = data.data.sections || {};
        const defaultSections = getDefaultContent(pageKey);

        // Deep merge: API data overlays defaults, preserving any missing nested fields
        // This ensures partial section updates don't lose default values
        const mergedSections = deepMergeSections(defaultSections, apiSections);

        return {
          ...data.data,
          sections: mergedSections,
        };
      }
    } else {
      console.error(`API returned status ${response.status} for ${page}`);
    }
  } catch (error) {
    console.error(`Failed to fetch content for ${page}:`, error);
  }

  // Return defaults if API fails
  return {
    page: pageKey,
    sections: getDefaultContent(pageKey),
    seo: {},
    isDefault: true
  };
}

/**
 * Get default content for a page
 */
export function getDefaultContent(page: string): Record<string, any> {
  const pageKey = page.toLowerCase();
  return defaultContent[pageKey as keyof typeof defaultContent] || {};
}

/**
 * Get a specific section from page content
 */
export function getSection<T = any>(content: PageContent, section: string): T | null {
  return content.sections?.[section] || null;
}


/**
 * Get SEO metadata for a page
 */
export function getPageSEO(content: PageContent, pageName: string) {
  const defaults: Record<string, { title: string; description: string }> = {
    home: {
      title: 'Growth Valley - Revenue Operations Consulting',
      description: 'Transform your revenue operations with predictable growth systems. We help B2B companies build scalable revenue engines.'
    },
    about: {
      title: 'About - Growth Valley',
      description: 'Learn about Growth Valley\'s mission to help B2B companies build predictable revenue systems.'
    },
    services: {
      title: 'Services - Growth Valley',
      description: 'Revenue Architecture, Sales Process Design, RevOps Implementation, and Go-to-Market Strategy services.'
    },
    industries: {
      title: 'Industries - Growth Valley',
      description: 'Deep expertise across SaaS, Professional Services, Manufacturing, and Financial Services.'
    },
    'casestudies': {
      title: 'Case Studies - Growth Valley',
      description: 'Real transformations. Real results. See how we\'ve helped B2B companies achieve predictable revenue growth.'
    },
    contact: {
      title: 'Contact - Growth Valley',
      description: 'Get in touch to discuss your revenue challenges. We respond within one business day.'
    },
    company: {
      title: 'Company - Growth Valley',
      description: 'Learn about Growth Valley\'s mission, values, and approach to revenue transformation.'
    },
    privacy: {
      title: 'Privacy Policy - Growth Valley',
      description: 'Learn how Growth Valley collects, uses, and protects your personal information.'
    },
    terms: {
      title: 'Terms & Conditions - Growth Valley',
      description: 'Read the terms and conditions for using Growth Valley\'s website and consulting services.'
    }
  };

  const pageKey = pageName.toLowerCase();
  const defaultMeta = defaults[pageKey] || { title: 'Growth Valley', description: '' };

  return {
    title: content.seo?.metaTitle || defaultMeta.title,
    description: content.seo?.metaDescription || defaultMeta.description,
    keywords: content.seo?.keywords || [],
    ogImage: content.seo?.ogImage,
    canonicalUrl: content.seo?.canonicalUrl
  };
}