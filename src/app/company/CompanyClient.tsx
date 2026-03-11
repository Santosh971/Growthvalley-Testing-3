"use client";

import Container from "@/components/Container";
import { SectionHeader } from "@/components/Section";
import Button from "@/components/Button";
import { motion, useRef } from "framer-motion";
import { getImageUrl } from "@/lib/utils";
import { useState, useRef as reactRef } from "react";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
}

interface Value {
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
}

interface CompanyClientProps {
  mission: { title: string; content: string } | null;
  origin: { title: string; content: string } | null;
  teamMembers: TeamMember[];
  values: { title: string; subtitle: string; items: Value[] } | null;
  approach: { title: string; subtitle: string; steps: Step[] } | null;
  cta: { title: string; description: string; buttonText: string; buttonLink: string } | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// Team Slider Component
function TeamSlider({ members }: { members: TeamMember[] }) {
  const sliderRef = reactRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const cardWidth = 320; // Approximate card width + gap
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const handleScroll = () => {
    checkScrollButtons();
  };

  return (
    <div className="relative">
      {/* Navigation Arrows - Desktop */}
      <div className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10">
        <motion.button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className="w-12 h-12 rounded-full bg-white dark:bg-brand-grey-800 border border-brand-grey-200 dark:border-brand-grey-700 shadow-lg flex items-center justify-center text-brand-black dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-grey-50 dark:hover:bg-brand-grey-700 transition-colors"
          whileHover={canScrollLeft ? { scale: 1.1 } : {}}
          whileTap={canScrollLeft ? { scale: 0.95 } : {}}
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      </div>
      <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
        <motion.button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="w-12 h-12 rounded-full bg-white dark:bg-brand-grey-800 border border-brand-grey-200 dark:border-brand-grey-700 shadow-lg flex items-center justify-center text-brand-black dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-grey-50 dark:hover:bg-brand-grey-700 transition-colors"
          whileHover={canScrollRight ? { scale: 1.1 } : {}}
          whileTap={canScrollRight ? { scale: 0.95 } : {}}
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Slider Container */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:px-0 md:mx-0 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {members.map((member, index) => (
          <motion.div
            key={member._id || `member-${index}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-[280px] md:w-[300px] bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 overflow-hidden group"
            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            {/* Image */}
            <div className="aspect-square bg-brand-grey-100 dark:bg-brand-grey-800 relative overflow-hidden">
              {member.image ? (
                <motion.img
                  src={getImageUrl(member.image)}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-grey-100 to-brand-grey-200 dark:from-brand-grey-800 dark:to-brand-grey-700">
                  <svg className="w-16 h-16 text-brand-grey-300 dark:text-brand-grey-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6">
              <h3 className="text-heading-4 text-brand-black dark:text-white mb-1">
                {member.name}
              </h3>
              <p className="text-body-sm text-accent mb-3">{member.role}</p>
              {member.bio && (
                <p className="text-body-sm text-brand-grey-500 dark:text-brand-grey-400 line-clamp-3 mb-4">
                  {member.bio}
                </p>
              )}

              {/* Social Links */}
              {(member.linkedin || member.twitter) && (
                <div className="flex gap-3 pt-4 border-t border-brand-grey-200 dark:border-brand-grey-700">
                  {member.linkedin && (
                    <motion.a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-grey-400 hover:text-accent transition-colors"
                      whileHover={{ scale: 1.1 }}
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </motion.a>
                  )}
                  {member.twitter && (
                    <motion.a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-grey-400 hover:text-accent transition-colors"
                      whileHover={{ scale: 1.1 }}
                      aria-label={`${member.name}'s Twitter`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </motion.a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scroll indicator for mobile */}
      <div className="flex md:hidden justify-center mt-4 gap-2">
        <div className="w-8 h-1 bg-accent rounded-full" />
        <div className="w-8 h-1 bg-brand-grey-200 dark:bg-brand-grey-700 rounded-full" />
        <div className="w-8 h-1 bg-brand-grey-200 dark:bg-brand-grey-700 rounded-full" />
      </div>
    </div>
  );
}

export default function CompanyClient({ mission, origin, teamMembers, values, approach, cta }: CompanyClientProps) {
  return (
    <>
      {/* Mission & Origin Section */}
      <section className="relative py-20 bg-white dark:bg-brand-grey-950 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-heading-2 text-brand-black dark:text-white mb-6">
                {mission?.title || "Our Mission"}
              </h2>

              {(
                Array.isArray(mission?.content)
                  ? mission?.content
                  : typeof mission?.content === "string"
                    ? mission.content.split('\n\n')
                    : []
              ).map((paragraph, idx) => (
                <motion.p
                  key={`mission-paragraph-${idx}`}
                  className="text-body-lg text-left text-brand-grey-600 dark:text-brand-grey-300 leading-relaxed mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>

            {/* Origin */}
            <motion.div
              className="bg-brand-grey-50 dark:bg-brand-grey-900 p-8 border border-brand-grey-200 dark:border-brand-grey-800 relative overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              {/* Accent corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-accent/5" />

              <h3 className="text-heading-3 text-brand-black dark:text-white mb-4 relative z-10">
                {origin?.title || "The Origin"}
              </h3>
              <p className="text-body text-brand-grey-600 text-left dark:text-brand-grey-300 leading-relaxed relative z-10">
                {origin?.content || "After years of leading revenue operations for high-growth B2B companies, our founding team saw the same patterns repeat: great teams hampered by broken systems. They set out to build the firm they wished existed—a partner that could diagnose the real problems and build lasting solutions."}
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="relative py-20 bg-white dark:bg-brand-grey-950 overflow-hidden">
        {/* Diagonal Pattern */}
        <div className="absolute inset-0 bg-diagonal-pattern" />

        <Container className="relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-heading-2 text-brand-black dark:text-white mb-4">
              {values?.title || "What We Believe"}
            </h2>
            <p className="text-body-lg text-center text-brand-grey-500 dark:text-brand-grey-400 max-w-2xl mx-auto">
              {values?.subtitle || "Our values shape how we work with clients and each other."}
            </p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {values?.items?.map((value, index) => (
              // <motion.div
              //   key={value.title || `value-${index}`}
              //   className="bg-white dark:bg-brand-grey-900 p-6 border border-brand-grey-200 dark:border-brand-grey-800 relative overflow-hidden"
              //   variants={itemVariants}
              //   whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              // >
              //   {/* Number indicator */}
              //   {/* <motion.span
              //     className="text-display text-accent/10 absolute -top-2 right-2"
              //     initial={{ opacity: 0, scale: 0.5 }}
              //     whileInView={{ opacity: 1, scale: 1 }}
              //     viewport={{ once: true }}
              //     transition={{ delay: index * 0.1 }}
              //   >
              //     {String(index + 1).padStart(2, '0')}
              //   </motion.span> */}
              //   <h3 className="text-heading-4 text-brand-black dark:text-white mb-3 relative z-10">
              //     {value.title}
              //   </h3>
              //   <p className="text-body text-brand-grey-500 dark:text-brand-grey-400 relative z-10 text-justify">
              //     {value.description}
              //   </p>              </motion.div>

              <motion.div
                key={value.title || `value-${index}`}
                className="p-2"
                variants={itemVariants}
                whileHover={{ y: -3 }}
              >
                <h3 className="text-heading-4 text-brand-black dark:text-white mb-3">
                  {value.title}
                </h3>

                <p className="text-body text-brand-grey-500 dark:text-brand-grey-400 text-left">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Approach Section - "How We Work" */}
      <section className="relative py-20 bg-brand-grey-50 dark:bg-brand-grey-900 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern" />
        <Container className="relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-heading-2 text-brand-black dark:text-white mb-4">
              {approach?.title || "How We Work"}
            </h2>
            <p className="text-body-lg text-center text-brand-grey-500 dark:text-brand-grey-400 max-w-2xl mx-auto">
              {approach?.subtitle || "A partnership approach that creates lasting transformation."}
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {approach?.steps && approach.steps.length > 0 &&
              (() => {
                const rows: (typeof approach.steps)[] = [];
                for (let i = 0; i < approach.steps.length; i += 4) {
                  rows.push(approach.steps.slice(i, i + 4));
                }
                return rows.map((rowSteps, rowIndex) => {
                  const isReversed = rowIndex % 2 === 1;
                  const displaySteps = isReversed ? [...rowSteps].reverse() : rowSteps;
                  const emptySlots = 4 - rowSteps.length;

                  return (
                    <div key={`row-${rowIndex}`} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                      {/* Empty slots on LEFT for reversed incomplete rows */}
                      {isReversed && emptySlots > 0 &&
                        Array.from({ length: emptySlots }).map((_, i) => (
                          <div key={`empty-left-${rowIndex}-${i}`} className="hidden lg:block" />
                        ))
                      }

                      {displaySteps.map((step, index) => {
                        const globalIndex = rowIndex * 4 + (isReversed ? rowSteps.length - 1 - index : index);
                        const isLastInRow = index === displaySteps.length - 1;
                        const isFirstInRow = index === 0;
                        const isLastRow = rowIndex === rows.length - 1;

                        return (
                          <motion.div
                            key={`step-${rowIndex}-${globalIndex}`}
                            className="relative"
                            variants={itemVariants}
                          >
                            {/* Step Number Circle */}
                            <motion.div
                              className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6"
                              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 193, 7, 0.2)' }}
                            >
                              <span className="text-heading-2 text-accent font-bold">
                                {step.number}
                              </span>
                            </motion.div>

                            <div className="pl-2">
                              <h3 className="text-heading-4 text-brand-black dark:text-white mb-2">
                                {step.title}
                              </h3>
                              <p className="text-body text-left text-brand-grey-500 dark:text-brand-grey-400">
                                {step.description}
                              </p>
                            </div>

                            {/* Horizontal Connector Line */}
                            {!isLastInRow && (
                              <motion.div
                                className={`hidden lg:block absolute top-8 left-20 w-full h-0.5 ${isReversed
                                  ? 'bg-gradient-to-l from-accent/30 to-transparent'
                                  : 'bg-gradient-to-r from-accent/30 to-transparent'
                                  }`}
                                initial={{ scaleX: 0, originX: isReversed ? 1 : 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                              />
                            )}

                            {/* Down Connector — right side on normal rows */}
                            {isLastInRow && !isReversed && !isLastRow && (
                              <motion.div
                                className="hidden lg:block absolute top-8 -right-4 w-0.5 h-32 bg-gradient-to-b from-accent/30 to-transparent"
                                initial={{ scaleY: 0, originY: 0 }}
                                whileInView={{ scaleY: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                              />
                            )}

                            {/* Down Connector — left side on reversed rows */}
                            {isFirstInRow && isReversed && !isLastRow && (
                              <motion.div
                                className="hidden lg:block absolute top-8 -left-4 w-0.5 h-32 bg-gradient-to-b from-accent/30 to-transparent"
                                initial={{ scaleY: 0, originY: 0 }}
                                whileInView={{ scaleY: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                              />
                            )}
                          </motion.div>
                        );
                      })}

                      {/* Empty slots on RIGHT for normal incomplete rows */}
                      {!isReversed && emptySlots > 0 &&
                        Array.from({ length: emptySlots }).map((_, i) => (
                          <div key={`empty-right-${rowIndex}-${i}`} className="hidden lg:block" />
                        ))
                      }
                    </div>
                  );
                });
              })()
            }
          </motion.div>
        </Container>

      </section>

      {/* Team Section - Horizontal Slider */}
      {teamMembers.length > 0 && (
        <section className="relative py-20 bg-white dark:bg-brand-grey-950 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-mesh" />
          <motion.div
            className="absolute top-1/4 right-0 w-56 h-56 bg-accent/8 rounded-full blur-3xl"
            animate={{ x: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />

          <Container className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SectionHeader
                label="Our Team"
                title="Expert guidance for your revenue transformation"
                description="Meet the people behind Growth Valley's success."
              />
            </motion.div>

            <TeamSlider members={teamMembers} />
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-24 bg-white dark:bg-brand-grey-950 overflow-hidden">
        {/* Animated Gradient */}
        <div className="absolute inset-0 bg-animated-gradient" />

        {/* Floating Elements */}
        <motion.div
          className="absolute top-10 left-1/4 w-4 h-4 bg-accent/30 rounded-full"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-1/3 w-3 h-3 bg-accent/25 rotate-45"
          animate={{ rotate: [45, 90, 45] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <Container className="relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-heading-2 text-brand-black dark:text-white mb-6">
              {cta?.title || "Let's Build Something Together"}
            </h2>
            {/* <p className="text-body-lg text-left text-brand-grey-500 dark:text-brand-grey-400 mb-10">
              {cta?.description || "Every transformation starts with a conversation. We'd love to hear about your revenue challenges."}
            </p> */}

            <p className="text-body-lg text-center whitespace-nowrap text-brand-grey-500 dark:text-brand-grey-400 mb-10">
              {cta?.description || "Every transformation starts with a conversation. We'd love to hear about your revenue challenges."}
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button href={cta?.buttonLink || "/contact"}>
                {cta?.buttonText || "Schedule a Call"}
              </Button>
            </motion.div>
          </motion.div>
        </Container>

      </section>
    </>
  );
}