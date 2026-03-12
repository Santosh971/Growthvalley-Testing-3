'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Container from "@/components/Container";
import Section, { SectionHeader } from "@/components/Section";
import Button, { CTAButton } from "@/components/Button";
import Card, { StatCard } from "@/components/Card";
import Link from "next/link";
import { getImageUrl } from '@/lib/utils';

// Simplified animation variants - only for section containers
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// Icons
const Icons = {
  Chart: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  Process: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.108 1.922c.227.394.134.905-.215 1.179l-.928.678a1.125 1.125 0 00-.398 1.026c.036.147.055.299.055.456v.227c0 .157-.02.31-.055.456a1.125 1.125 0 00.398 1.027l.928.677a1.125 1.125 0 01.215 1.179l-1.108 1.922a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.58.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.622 6.622 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.108-1.922a1.125 1.125 0 01.215-1.179l.928-.678a1.125 1.125 0 00.398-1.026 3.86 3.86 0 010-.456v-.227c0-.157.02-.31.055-.456a1.125 1.125 0 00-.398-1.027l-.928-.677a1.125 1.125 0 01.215-1.179l1.108-1.922a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.074-.044.147-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Team: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Target: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
};

// Static decorative shapes - NO animations (performance optimization)
function StaticDecorativeShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs - static CSS */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -left-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      {/* Geometric Shapes - static CSS */}
      <div className="absolute top-32 right-1/4 w-4 h-4 bg-accent/20 rotate-45" />
      <div className="absolute bottom-20 left-1/3 w-3 h-3 bg-accent/15 rounded-full" />
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-accent/20 rotate-45" />
    </div>
  );
}

// Hero Section - Optimized for LCP (no motion on critical content)
export function AnimatedHeroSection({ hero }: { hero: any }) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-20 lg:pb-32 bg-white dark:bg-brand-grey-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-gradient bg-dot-pattern" />
      <StaticDecorativeShapes />

      <Container className="relative z-10">
        {/* Static content for faster LCP - no motion wrapper on container */}
        <div className="max-w-4xl">
          {hero?.label && (
            <span className="text-label text-accent uppercase mb-6 block">
              {hero.label}
            </span>
          )}
          {/* Regular h1 - NO motion for LCP optimization */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-black dark:text-white mb-6 leading-tight">
            {hero?.title ? (
              <>
                {hero.title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-accent">{hero.title.split(' ').slice(-1)}</span>
              </>
            ) : (
              'Predictable Revenue Systems for Scalable Businesses'
            )}
          </h1>
          {/* Regular p - NO motion for LCP optimization */}
          <p className="text-base sm:text-lg md:text-xl text-left text-brand-grey-500 dark:text-brand-grey-400 font-normal mb-10 max-w-3xl">
            {hero?.subtitle || 'We transform fragmented revenue operations into unified, predictable growth engines.'}
          </p>
          <div className="flex flex-wrap gap-4">
            {hero?.ctaText && (
              <CTAButton href={hero?.ctaLink || '/contact'}>{hero.ctaText}</CTAButton>
            )}
            {hero?.secondaryCtaText && (
              <Button href={hero?.secondaryCtaLink || '/case-studies'} variant="secondary">
                {hero.secondaryCtaText}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

// Credibility Section - Simplified animations
export function AnimatedCredibilitySection({ stats }: { stats: any[] }) {
  return (
    <section className="relative py-16 bg-brand-grey-50 dark:bg-brand-grey-900 overflow-hidden">
      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-mesh" />

      <Container className="relative z-10">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {(stats || []).map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              <StatCard value={stat.value} label={stat.label} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

// Problem Section - Auto-playing Carousel
export function AnimatedProblemSection({ problems }: { problems: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get visible problems
  const visibleProblems = problems?.items || [];

  // Calculate cards per view based on screen size
  const getCardsPerView = useCallback(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }, []);

  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getCardsPerView]);

  // Calculate total slides for dots
  const totalSlides = Math.ceil(visibleProblems.length / cardsPerView);
  const currentSlide = Math.floor(currentIndex / cardsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || visibleProblems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleProblems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, visibleProblems.length]);

  // Navigation functions
  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + visibleProblems.length) % visibleProblems.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % visibleProblems.length);
  };

  const goToSlide = (slideIndex: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(slideIndex * cardsPerView);
  };

  if (visibleProblems.length === 0) return null;

  return (
    <section className="relative py-20 bg-white dark:bg-brand-grey-950 overflow-hidden">
      {/* Static diagonal pattern */}
      <div className="absolute inset-0 bg-diagonal-pattern opacity-50" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            label={problems?.title || 'The Challenge'}
            title={problems?.subtitle || 'Most B2B companies struggle with revenue unpredictability'}
            description={problems?.description || 'Sound familiar? You\'re not alone.'}
          />
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white dark:bg-brand-grey-800 border border-brand-grey-200 dark:border-brand-grey-700 rounded-full shadow-lg flex items-center justify-center text-brand-grey-600 dark:text-brand-grey-300 hover:text-accent hover:border-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            aria-label="Previous challenge"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white dark:bg-brand-grey-800 border border-brand-grey-200 dark:border-brand-grey-700 rounded-full shadow-lg flex items-center justify-center text-brand-grey-600 dark:text-brand-grey-300 hover:text-accent hover:border-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            aria-label="Next challenge"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden mx-8">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              }}
            >
              {visibleProblems.map((problem: any, index: number) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / cardsPerView}%` }}
                >
                  <div className="relative border-l-2 border-accent pl-6 py-4 bg-gradient-to-r from-accent/5 to-transparent transition-all duration-200 hover:bg-accent/5 h-full min-h-[140px]">
                    {/* Yellow dot bullet */}
                    <div className="absolute -left-1.5 top-4 w-3 h-3 bg-accent rounded-full" />
                    {/* Bold white title */}
                    <h3 className="text-heading-4 text-brand-black dark:text-white mb-2">
                      {problem.title}
                    </h3>
                    {/* Grey description text */}
                    <p className="text-body text-left text-brand-grey-500 dark:text-brand-grey-400">
                      {problem.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(totalSlides)].map((_, slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${slideIndex === currentSlide
                  ? 'bg-accent w-6'
                  : 'bg-brand-grey-300 dark:bg-brand-grey-600 hover:bg-brand-grey-400 dark:hover:bg-brand-grey-500'
                  }`}
                aria-label={`Go to slide ${slideIndex + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// Solution Section - Static background, simplified animations
export function AnimatedSolutionSection({ solutions }: { solutions: any }) {
  const iconMap: Record<string, JSX.Element> = {
    chart: <Icons.Chart />,
    process: <Icons.Process />,
    team: <Icons.Team />,
    target: <Icons.Target />,
  };

  return (
    <section className="relative py-20 bg-brand-grey-50 dark:bg-brand-grey-900 overflow-hidden">
      {/* Static grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            label={solutions?.title || 'Our Approach'}
            title={solutions?.subtitle || 'Building predictable revenue, systematically'}
            description={solutions?.description || 'We don\'t offer quick fixes. We build lasting revenue systems.'}
          />
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {(solutions?.items || []).map((solution: any, index: number) => {
            const solutionIds = ["revenue-architecture", "sales-process", "revops", "gtm"];
            const solutionId = solution.id || solutionIds[index];

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="h-full"
              >
                <Card
                  title={solution.title}
                  description={solution.description}
                  icon={iconMap[solution.icon] || <Icons.Chart />}
                  href={`/solutions#${solutionId}`}
                />
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Button href="/solutions" variant="secondary">
            {solutions?.exploreButtonText || "Explore All Solutions"}
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}

// Industries Section - Simplified
export function AnimatedIndustriesSection({ industries }: { industries: any }) {
  return (
    <section className="relative py-20 bg-white dark:bg-brand-grey-950 overflow-hidden">
      {/* Static dot pattern */}
      <div className="absolute inset-0 bg-dot-pattern" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            label={industries?.title || 'Industries'}
            title={industries?.subtitle || 'Deep expertise across B2B sectors'}
            description={industries?.description || 'We\'ve helped companies across industries transform.'}
          />
        </motion.div>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {(industries?.items || []).map((industry: any, index: number) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="h-full"
            >
              <Link
                href={`/industries#${industry.id || industry.name?.toLowerCase().replace(/\s+/g, '-')}`}
                className="block h-full bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-6 hover:border-accent hover:shadow-lg transition-all duration-300"
              >
                <span className="text-3xl mb-4 block w-12 h-12 flex items-center justify-center">
                  {industry.icon && (industry.icon.startsWith('http') || industry.icon.startsWith('/') || industry.icon.startsWith('data:')) ? (
                    <img
                      src={getImageUrl(industry.icon)}
                      alt={industry.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    industry.icon
                  )}
                </span>
                <h3 className="text-heading-4 text-brand-black dark:text-white mb-2">
                  {industry.name}
                </h3>
                <p className="text-body-sm text-left text-brand-grey-500 dark:text-brand-grey-400">
                  {industry.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

// Testimonials Section - Auto-playing Carousel
export function AnimatedTestimonialsSection({ testimonials }: { testimonials: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get visible testimonials (limit to 6 for carousel)
  const visibleTestimonials = testimonials?.slice(0, 6) || [];

  // Calculate cards per view based on screen size (using CSS classes, but track for dots)
  const getCardsPerView = useCallback(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }, []);

  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getCardsPerView]);

  // Calculate total slides for dots
  const totalSlides = Math.ceil(visibleTestimonials.length / cardsPerView);
  const currentSlide = Math.floor(currentIndex / cardsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || visibleTestimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleTestimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, visibleTestimonials.length]);

  // Navigation functions
  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + visibleTestimonials.length) % visibleTestimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % visibleTestimonials.length);
  };

  const goToSlide = (slideIndex: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(slideIndex * cardsPerView);
  };
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleReadMore = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  if (visibleTestimonials.length === 0) return null;

  return (
    <section className="relative py-20 bg-brand-grey-50 dark:bg-brand-grey-900 overflow-hidden">
      {/* Static gradient mesh */}
      <div className="absolute inset-0 bg-gradient-mesh" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            label="Testimonials"
            title="What Our Clients Say"
            description="Hear from the companies we've helped transform"
          />
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white dark:bg-brand-grey-800 border border-brand-grey-200 dark:border-brand-grey-700 rounded-full shadow-lg flex items-center justify-center text-brand-grey-600 dark:text-brand-grey-300 hover:text-accent hover:border-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white dark:bg-brand-grey-800 border border-brand-grey-200 dark:border-brand-grey-700 rounded-full shadow-lg flex items-center justify-center text-brand-grey-600 dark:text-brand-grey-300 hover:text-accent hover:border-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden mx-8">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              }}
            >
              {visibleTestimonials.map((testimonial: any, index: number) => (
                // <div
                //   key={testimonial._id || index}
                //   className="flex-shrink-0 px-4"
                //   style={{ width: `${100 / cardsPerView}%` }}
                // >
                //   <div className="bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-8 rounded-lg relative overflow-hidden transition-shadow duration-300 hover:shadow-lg h-full">
                //     {/* Quote Icon */}
                //     <div className="absolute top-4 right-4 text-accent/10">
                //       <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                //         <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                //       </svg>
                //     </div>

                //     {/* Rating Stars */}
                //     {testimonial.rating && (
                //       <div className="flex gap-1 mb-4">
                //         {[...Array(5)].map((_, i) => (
                //           <svg
                //             key={i}
                //             className={`w-5 h-5 ${i < testimonial.rating ? 'text-accent' : 'text-brand-grey-300'}`}
                //             fill="currentColor"
                //             viewBox="0 0 20 20"
                //           >
                //             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                //           </svg>
                //         ))}
                //       </div>
                //     )}

                //     {/* Quote */}
                //     <blockquote className="text-body text-brand-grey-600 dark:text-brand-grey-300 mb-6 italic relative z-10">
                //       "{testimonial.quote}"
                //     </blockquote>

                //     {/* Author */}
                //     <div className="flex items-center gap-4">
                //       {testimonial.avatar ? (
                //         <Image
                //           src={getImageUrl(testimonial.avatar)}
                //           alt={testimonial.author}
                //           width={48}
                //           height={48}
                //           className="w-12 h-12 rounded-full object-cover"
                //           loading="lazy"
                //         />
                //       ) : (
                //         <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                //           <span className="text-accent font-semibold text-lg">
                //             {testimonial.author.charAt(0)}
                //           </span>
                //         </div>
                //       )}
                //       <div>
                //         <p className="font-semibold text-brand-black dark:text-white">
                //           {testimonial.author}
                //         </p>
                //         {(testimonial.designation || testimonial.company) && (
                //           <p className="text-body-sm text-brand-grey-500 dark:text-brand-grey-400">
                //             {testimonial.designation}{testimonial.company && `, ${testimonial.company}`}
                //           </p>
                //         )}
                //       </div>
                //     </div>
                //   </div>
                // </div>

                <div
                  key={testimonial._id || index}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / cardsPerView}%` }}
                >
                  <div
                    className={`bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-8 rounded-lg relative overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col text-left min-h-[340px] ${expandedCard === index ? "h-auto" : ""
                      }`}
                  >
                    {/* Quote Icon */}
                    <div className="absolute top-4 right-4 text-accent/10">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    {/* Rating Stars */}
                    {testimonial.rating && (
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < testimonial.rating ? "text-accent" : "text-brand-grey-300"
                              }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    )}

                    {/* Quote */}
                    <blockquote
                      className={`text-body text-brand-grey-600 dark:text-brand-grey-300 mb-4 italic transition-all duration-300 ${expandedCard === index ? "" : "line-clamp-4"
                        }`}
                    >
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Read More */}
                    {testimonial.quote?.length > 120 && (
                      <button
                        onClick={() => toggleReadMore(index)}
                        className="text-accent text-sm font-medium hover:underline mb-4 self-start"
                      >
                        {expandedCard === index ? "Read Less" : "Read More"}
                      </button>
                    )}

                    {/* Author */}
                    <div className="flex items-center gap-4 mt-auto">
                      {testimonial.avatar ? (
                        <Image
                          src={getImageUrl(testimonial.avatar)}
                          alt={testimonial.author}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                          <span className="text-accent font-semibold text-lg">
                            {testimonial.author.charAt(0)}
                          </span>
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-brand-black dark:text-white">
                          {testimonial.author}
                        </p>

                        {(testimonial.designation || testimonial.company) && (
                          <p className="text-sm text-brand-grey-500 dark:text-brand-grey-400">
                            {testimonial.designation}
                            {testimonial.company && `, ${testimonial.company}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(totalSlides)].map((_, slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${slideIndex === currentSlide
                  ? 'bg-accent w-6'
                  : 'bg-brand-grey-300 dark:bg-brand-grey-600 hover:bg-brand-grey-400 dark:hover:bg-brand-grey-500'
                  }`}
                aria-label={`Go to slide ${slideIndex + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// Client Logos Section - Simplified
export function AnimatedClientLogosSection({ clients }: { clients: any[] }) {
  if (!clients || clients.length === 0) return null;

  return (
    <Section>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <p className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-4">
              Trusted By
            </p>
            <h2 className="text-heading-2 text-brand-black dark:text-white">
              Companies We've Worked With
            </h2>
          </div>
        </motion.div>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {clients.map((client: any, index: number) => (
            <motion.div
              key={client._id || index}
              variants={itemVariants}
              className="flex items-center justify-center p-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              {client.website ? (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={120}
                    height={48}
                    className="h-12 w-auto max-w-[120px] object-contain dark:hidden"
                    loading="lazy"
                  />
                  {client.logoDark && (
                    <Image
                      src={client.logoDark}
                      alt={client.name}
                      width={120}
                      height={48}
                      className="h-12 w-auto max-w-[120px] object-contain hidden dark:block"
                      loading="lazy"
                    />
                  )}
                </a>
              ) : (
                <>
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={120}
                    height={48}
                    className="h-12 w-auto max-w-[120px] object-contain dark:hidden"
                    loading="lazy"
                  />
                  {client.logoDark && (
                    <Image
                      src={client.logoDark}
                      alt={client.name}
                      width={120}
                      height={48}
                      className="h-12 w-auto max-w-[120px] object-contain hidden dark:block"
                      loading="lazy"
                    />
                  )}
                </>
              )}
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

// Case Study Preview Section - Auto-playing Carousel
export function AnimatedCaseStudyPreview({ caseStudyPreview }: { caseStudyPreview: any }) {
  const visibleCaseStudies = caseStudyPreview?.items || [];

  if (visibleCaseStudies.length === 0) {
    console.log("No case studies to display, skipping section.");
    return null;
  }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get visible case studies
  // const visibleCaseStudies = caseStudyPreview?.items || [];

  // Calculate cards per view based on screen size
  const getCardsPerView = useCallback(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }, []);

  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getCardsPerView]);

  // Calculate total slides for dots
  const totalSlides = Math.ceil(visibleCaseStudies.length / cardsPerView);
  const currentSlide = Math.floor(currentIndex / cardsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || visibleCaseStudies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleCaseStudies.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, visibleCaseStudies.length]);

  // Navigation functions
  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + visibleCaseStudies.length) % visibleCaseStudies.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % visibleCaseStudies.length);
  };
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleReadMore = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };
  const goToSlide = (slideIndex: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(slideIndex * cardsPerView);
  };

  if (visibleCaseStudies.length === 0) return null;

  return (
    <section className="relative py-20 bg-white dark:bg-brand-grey-950 overflow-hidden">
      {/* Static diagonal pattern */}
      <div className="absolute inset-0 bg-diagonal-pattern" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            label={caseStudyPreview?.title || 'Results'}
            title={caseStudyPreview?.subtitle || 'Real transformations. Real numbers.'}
          />
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white dark:bg-brand-grey-800 border border-brand-grey-200 dark:border-brand-grey-700 rounded-full shadow-lg flex items-center justify-center text-brand-grey-600 dark:text-brand-grey-300 hover:text-accent hover:border-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            aria-label="Previous case study"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white dark:bg-brand-grey-800 border border-brand-grey-200 dark:border-brand-grey-700 rounded-full shadow-lg flex items-center justify-center text-brand-grey-600 dark:text-brand-grey-300 hover:text-accent hover:border-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            aria-label="Next case study"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden mx-8">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              }}
            >
              {visibleCaseStudies.map((cs: any, index: number) => (

                <div
                  key={index}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / cardsPerView}%` }}
                >
                  <Link
                    href={cs.link || "/case-studies"}
                    className="block h-full bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-6 md:p-8 hover:border-accent hover:shadow-xl transition-all duration-300 rounded-lg min-h-[260px]"
                  >
                    <div className="flex flex-col h-full text-left">

                      {/* Top Section */}
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs sm:text-sm uppercase text-brand-grey-400 dark:text-brand-grey-500">
                          {cs.industry}
                        </span>

                        <span className="text-xl sm:text-2xl font-bold text-accent">
                          {cs.result}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl md:text-2xl font-semibold text-brand-black dark:text-white mb-2">
                        {cs.client}
                      </h3>

                      {/* Description */}
                      <p
                        className={`text-sm md:text-base text-brand-grey-500 dark:text-brand-grey-400 mb-3 transition-all duration-300 ${expandedCard === index ? "" : "line-clamp-3"
                          }`}
                      >
                        {cs.description}
                      </p>

                      {/* Read More Button */}
                      {cs.description?.length > 120 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleReadMore(index);
                          }}
                          className="text-accent text-sm font-medium hover:underline mt-auto self-start"
                        >
                          {expandedCard === index ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(totalSlides)].map((_, slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${slideIndex === currentSlide
                  ? 'bg-accent w-6'
                  : 'bg-brand-grey-300 dark:bg-brand-grey-600 hover:bg-brand-grey-400 dark:hover:bg-brand-grey-500'
                  }`}
                aria-label={`Go to slide ${slideIndex + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Button href="/case-studies" variant="secondary">
            View All Case Studies
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}

// Operating Model Section - Simplified
export function AnimatedOperatingModel({ process }: { process: any }) {
  return (
    <section className="relative py-20 bg-brand-grey-50 dark:bg-brand-grey-900 overflow-hidden">
      {/* Static grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern" />
      {/* Static decorative line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            label={process?.title || 'How We Work'}
            title={process?.subtitle || 'A systematic approach to transformation'}
          />
        </motion.div>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {(process?.steps || []).map((step: any, index: number) => (
            <motion.div
              key={index}
              className="relative"
              variants={itemVariants}
            >
              {/* Step Number Circle - static */}
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 transition-colors duration-200 hover:bg-accent/20">
                <span className="text-heading-2 text-accent font-bold">
                  {step.number || `0${index + 1}`}
                </span>
              </div>
              {/* Content */}
              <div className="pl-2">
                <h3 className="text-heading-4 text-brand-black dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-body text-left text-brand-grey-500 dark:text-brand-grey-400">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

// Final CTA Section - Static background, no infinite animations
export function AnimatedFinalCTA({ cta }: { cta: any }) {
  return (
    <section className="relative py-24 bg-brand-grey-50 dark:bg-brand-grey-900 overflow-hidden">
      {/* Static animated gradient background */}
      <div className="absolute inset-0 bg-animated-gradient" />

      {/* Static decorative elements - NO infinite animations */}
      <div className="absolute top-10 left-1/4 w-4 h-4 bg-accent/20 rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-accent/15 rotate-45" />
      <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-accent/20 rounded-full" />

      {/* Static gradient orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-accent/8 rounded-full blur-3xl -translate-y-1/2" />



      <Container className="relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-heading-1 text-brand-black dark:text-white mb-6">
            {cta?.title || "Ready for predictable revenue?"}
          </h2>

          <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400 mb-10 whitespace-nowrap text-center">
            {cta?.description || "Let's discuss how Growth Valley can transform your revenue operations."}
          </p>

          <CTAButton href={cta?.buttonLink || "/contact"}>
            {cta?.buttonText || "Schedule a Call"}
          </CTAButton>
        </motion.div>
      </Container>
    </section>
  );
}