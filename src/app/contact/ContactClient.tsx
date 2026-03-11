"use client";

import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import { motion } from "framer-motion";

interface ContactClientProps {
  form: {
    interests: Array<{ value: string; label: string }>;
  } | null;
  info: {
    title: string;
    email: string;
    location: string;
  } | null;
  contactInfo: {
    email: string;
    phone: string;
    alternatePhone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  } | null;
  expectations: {
    title: string;
    items: string[];
  } | null;
  successMessage: {
    title: string;
    description: string;
  } | null;
}


export default function ContactClient({ form, info, contactInfo, expectations, successMessage }: ContactClientProps) {
  // Safely get contact info value, ensuring it's a string
  const getContactValue = (value: any, fallback: string = ""): string => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') return fallback;
    return String(value);
  };

  const location = [
    getContactValue(contactInfo?.address),
    getContactValue(contactInfo?.city, "Nashik"),
    getContactValue(contactInfo?.state, "Maharashtra"),
    getContactValue(contactInfo?.country, "India"),
  ]
    .filter(Boolean)
    .join(", ") || info?.location || "Nashik, Maharashtra, India";

  const contactCards = [
    {
      icon: "📧",
      label: "Email Us",
      value: getContactValue(contactInfo?.email, info?.email || "hello@growthvalley.com"),
    },
    {
      icon: "📞",
      label: "Phone",
      value: getContactValue(contactInfo?.phone || "+91 00000 00000"), // 👈 add default here
    },
    {
      icon: "📍",
      label: "Location",
      value:
        getContactValue(contactInfo?.city) && getContactValue(contactInfo?.country)
          ? `${getContactValue(contactInfo.city)}, ${getContactValue(contactInfo.country)}`
          : info?.location || "Nashik, Maharashtra, India",
    },
    {
      icon: "⏰",
      label: "Response Time",
      value: "Within 24 hours",
    },
  ];
  return (
    <section className="relative py-20 bg-white dark:bg-brand-grey-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Floating Elements */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 -left-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Geometric Shapes */}
      <motion.div
        className="absolute top-32 right-1/4 w-4 h-4 bg-accent/30 rotate-45"
        animate={{ rotate: [45, 90, 45], y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-1/3 w-3 h-3 bg-accent/20 rounded-full"
        animate={{ scale: [1, 1.5, 1], y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-2 h-2 bg-accent/25 rotate-45"
        animate={{ rotate: [45, 135, 45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative z-10">
        {/* Animated Info Cards Above Form */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {contactCards.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-6 text-center relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            >
              <motion.span
                className="text-3xl block mb-3"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                {item.icon}
              </motion.span>
              <span className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase block mb-1">
                {item.label}
              </span>
              <span className="text-body text-brand-black dark:text-white font-medium">
                {item.value}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ContactForm
            interests={form?.interests || [
              { value: "revenue-architecture", label: "Revenue Architecture" },
              { value: "sales-process", label: "Sales Process Design" },
              { value: "revops", label: "RevOps Implementation" },
              { value: "gtm", label: "Go-to-Market Strategy" },
              { value: "other", label: "Other / Not Sure" },
            ]}
            contactInfo={{
              title: info?.title || "Direct Contact",

              email:
                contactInfo?.email ||
                info?.email ||
                "hello@growthvalley.com",

              location: location,
            }}
            expectations={{
              title: typeof expectations?.title === 'string' ? expectations.title : "What to Expect",
              items: Array.isArray(expectations?.items)
                ? expectations.items
                  .filter(item => item !== null && item !== undefined)
                  .map(item => {
                    if (typeof item === 'string') return item;
                    if (typeof item === 'number') return String(item);
                    // Handle objects that might have been accidentally stored
                    if (typeof item === 'object' && item !== null) {
                      if (item.value) return String(item.value);
                      if (item.text) return String(item.text);
                      return '';
                    }
                    return '';
                  })
                  .filter(item => item !== '') // Remove empty strings from conversion
                : [
                  "Response within one business day",
                  "Initial discovery call to understand your situation",
                  "Clear proposal with scope, timeline, and investment",
                  "No commitment required for initial conversation",
                ],
            }}
            successMessage={{
              title: successMessage?.title || "Message Received",
              description: successMessage?.description || "Thank you for reaching out. We'll get back to you within one business day.",
            }}
          />
        </motion.div>
      </Container>
    </section>
  );
}