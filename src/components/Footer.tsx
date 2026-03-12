"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLogo, useSettings } from "@/lib/settings-context";

const footerLinks = {
  solutions: [
    { name: "Revenue Architecture", href: "/solutions#revenue-architecture" },
    { name: "Sales Process Design", href: "/solutions#sales-process" },
    { name: "RevOps Implementation", href: "/solutions#revops" },
    { name: "Go-to-Market Strategy", href: "/solutions#gtm" },
  ],
  industries: [
    { name: "SaaS & Technology", href: "/industries#saas" },
    { name: "Professional Services", href: "/industries#professional-services" },
    { name: "Manufacturing", href: "/industries#manufacturing" },
    { name: "Financial Services", href: "/industries#financial-services" },
  ],
  company: [
    { name: "About Us", href: "/company" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  const { settings } = useSettings();
  const { logo: footerLogo, hasLogo, siteName } = useLogo();
  const currentYear = new Date().getFullYear();

  const socialLinks = settings?.socialLinks || {};
  const copyrightText = settings?.footer?.copyrightText || `© ${currentYear} ${siteName}. All rights reserved.`;

  return (


    <footer className="bg-brand-black dark:bg-brand-black text-white dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-block mb-6">
              {hasLogo && footerLogo ? (
                <Image
                  src={footerLogo}
                  alt={siteName}
                  width={256}   // bigger than before
                  height={64}   // bigger than before
                  className="h-16 w-auto" // increases the visible height
                />
              ) : (
                <span className="text-4xl font-semibold tracking-tight text-white dark:text-white">
                  {siteName.split(' ')[0]}
                  <span className="text-accent">{siteName.split(' ')[1] || ''}</span>
                </span>
              )}
            </Link>
            <p className="text-brand-grey-400 text-left dark:text-brand-grey-400 text-body mb-6 max-w-sm">
              {settings?.siteDescription || "Predictable Revenue Systems for Scalable Businesses. We help B2B companies transform their revenue operations."}
            </p>
            <div className="flex gap-4">
              {socialLinks.linkedin && (
                <motion.a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-grey-400 dark:text-brand-grey-400 hover:text-accent transition-colors"
                  aria-label="LinkedIn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </motion.a>
              )}
              {socialLinks.twitter && (
                <motion.a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-grey-400 dark:text-brand-grey-400 hover:text-accent transition-colors"
                  aria-label="Twitter"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </motion.a>
              )}
              {socialLinks.facebook && (
                <motion.a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-grey-400 dark:text-brand-grey-400 hover:text-accent transition-colors"
                  aria-label="Facebook"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </motion.a>
              )}
              {socialLinks.instagram && (
                <motion.a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-grey-400 dark:text-brand-grey-400 hover:text-accent transition-colors"
                  aria-label="Instagram"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </motion.a>
              )}
              {socialLinks.youtube && (
                <motion.a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-grey-400 dark:text-brand-grey-400 hover:text-accent transition-colors"
                  aria-label="YouTube"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* Links Columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h4 className="text-label text-brand-grey-400 dark:text-brand-grey-400 uppercase mb-4">
                  Solutions
                </h4>
                <ul className="space-y-3">
                  {footerLinks.solutions.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-body-sm text-brand-grey-300 dark:text-brand-grey-300 hover:text-accent transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h4 className="text-label text-brand-grey-400 dark:text-brand-grey-400 uppercase mb-4">
                  Industries
                </h4>
                <ul className="space-y-3">
                  {footerLinks.industries.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-body-sm text-brand-grey-300 dark:text-brand-grey-300 hover:text-accent transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h4 className="text-label text-brand-grey-400 dark:text-brand-grey-400 uppercase mb-4">
                  Company
                </h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-body-sm text-brand-grey-300 dark:text-brand-grey-300 hover:text-accent transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-12 pt-8 border-t border-brand-grey-800 dark:border-brand-grey-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-body-sm text-brand-grey-500 dark:text-brand-grey-500">
              {copyrightText}
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-body-sm text-brand-grey-500 dark:text-brand-grey-500 hover:text-brand-grey-300 dark:hover:text-brand-grey-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-body-sm text-brand-grey-500 dark:text-brand-grey-500 hover:text-brand-grey-300 dark:hover:text-brand-grey-300 transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}