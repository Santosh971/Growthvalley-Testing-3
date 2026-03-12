"use client";

import Container from "@/components/Container";
import Button from "@/components/Button";
import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/utils";

/**
 * Safely converts a value to an array.
 * Handles: undefined, null, string (JSON), object, or actual arrays.
 */
function ensureArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Checks if a string is a URL (for icons)
 */
function isIconUrl(icon: string): boolean {
  return icon.startsWith('http') || icon.startsWith('/') || icon.startsWith('data:');
}

/**
 * Renders an icon - either as an image (if URL) or as text (if emoji)
 */
function renderIcon(icon: string, className: string = "") {
  if (!icon) return null;

  if (isIconUrl(icon)) {
    return (
      <img
        src={getImageUrl(icon)}
        alt="Industry icon"
        className={className}
        style={{ objectFit: 'contain' }}
      />
    );
  }

  return <span className={className}>{icon}</span>;
}

interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
  challenges: string[];
  results: string[];
  caseStudyCount: number;
}

interface IndustriesClientProps {
  hero: { title: string; description: string } | null;
  industries: Industry[] | null;
  cta: { title: string; description: string; buttonText: string; buttonLink: string } | null;
}

export default function IndustriesClient({ hero, industries, cta }: IndustriesClientProps) {
  return (
    <>
      {/* Industries Grid */}
      <section className="relative py-20 bg-white dark:bg-brand-grey-950 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern" />

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 right-10 w-4 h-4 bg-accent/20 rotate-45"
          animate={{ rotate: [45, 90, 45], y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-10 w-3 h-3 bg-accent/15 rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-accent/25 rounded-full"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />



        <Container className="relative z-10">
          <div className="space-y-24">
            {industries?.map((industry, index) => (
              <motion.div
                key={industry.id}
                id={industry.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid lg:grid-cols-5 gap-8 lg:gap-12"
              >
                {/* Left side - Industry header */}
                <div className="lg:col-span-2">
                  <motion.div
                    className="flex items-center gap-4 mb-4"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      className="text-5xl w-12 h-12 flex items-center justify-center"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {isIconUrl(industry.icon) ? (
                        <img
                          src={getImageUrl(industry.icon)}
                          alt={industry.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span>{industry.icon}</span>
                      )}
                    </motion.div>
                    <h2 className="text-heading-2 text-brand-black dark:text-white">
                      {industry.name}
                    </h2>
                  </motion.div>
                  <p className="text-body text-left text-brand-grey-500 dark:text-brand-grey-400 mb-6">
                    {industry.description}
                  </p>
                  <motion.div
                    className="flex items-center gap-2 text-label text-accent"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="font-semibold">{industry.caseStudyCount}</span>
                    <span>Case Studies</span>
                  </motion.div>
                </div>

                {/* Right side - Challenges and Results */}
                <div className="lg:col-span-3 grid md:grid-cols-2 gap-8">
                  {/* Challenges */}
                  <motion.div
                    className="bg-brand-grey-50 dark:bg-brand-grey-900 p-6 relative overflow-hidden"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  >
                    <h4 className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-4">
                      Common Challenges
                    </h4>
                    <ul className="space-y-3">
                      {ensureArray(industry.challenges).map((challenge, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-start gap-3 text-body-sm text-brand-grey-600 dark:text-brand-grey-300"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 + 0.4 }}
                        >
                          <span className="text-accent mt-1">•</span>
                          {challenge}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Results */}
                  <motion.div
                    className="bg-brand-black dark:bg-brand-grey-800 p-6 text-white relative overflow-hidden"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                  >

                    <h4 className="text-label text-brand-grey-400 uppercase mb-4 relative z-10">
                      Typical Results
                    </h4>
                    <ul className="space-y-3 relative z-10">
                      {ensureArray(industry.results).map((result, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-start gap-3 text-body-sm"
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 + 0.4 }}
                        >
                          <motion.span
                            className="text-accent mt-1"
                            whileHover={{ scale: 1.2 }}
                          >
                            ✓
                          </motion.span>
                          {result}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>


      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-brand-grey-50 dark:bg-brand-grey-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-animated-gradient" />

        {/* Floating Shapes */}
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
              {cta?.title || "Don't see your industry?"}
            </h2>
            <p className="text-body-lg text-center whitespace-nowrap text-brand-grey-500 dark:text-brand-grey-400 mb-10">
              {cta?.description || "Our methodology applies across B2B sectors. If you sell to businesses, we can help transform your revenue operations."}
            </p>
            {/* <p className="text-body-lg text-left text-brand-grey-500 dark:text-brand-grey-400 mb-10">
              {cta?.description || "Our methodology applies across B2B sectors. If you sell to businesses, we can help transform your revenue operations."}
            </p> */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button href={cta?.buttonLink || "/contact"}>
                {cta?.buttonText || "Tell Us About Your Industry"}
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}