/**
 * Database Seed Script
 * Run with: node scripts/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Admin = require('../models/Admin');
const Client = require('../models/Client');
const Blog = require('../models/Blog');
const CaseStudy = require('../models/CaseStudy');
const Content = require('../models/Content');
const TeamMember = require('../models/TeamMember');
const Testimonial = require('../models/Testimonial');

// Sample data
const sampleClients = [
  {
    name: 'Growth Labs',
    logo: '/images/clients/growthlabs.svg',
    industry: 'SaaS',
    website: 'https://growthlabs.example.com',
    status: 'active',
    featured: true,
    order: 1,
  },
  {
    name: 'Data Driven Inc',
    logo: '/images/clients/datadriven.svg',
    industry: 'Technology',
    website: 'https://datadriven.example.com',
    status: 'active',
    featured: true,
    order: 2,
  },
  {
    name: 'Pro Solutions',
    logo: '/images/clients/pro.svg',
    industry: 'Finance',
    website: 'https://prosol.example.com',
    status: 'active',
    featured: false,
    order: 3,
  },
  {
    name: 'TechCorp',
    logo: '/images/clients/techcorp.svg',
    industry: 'Technology',
    status: 'active',
    featured: true,
    order: 4,
  },
  {
    name: 'InnovateLabs',
    logo: '/images/clients/innovatelabs.svg',
    industry: 'SaaS',
    status: 'active',
    featured: false,
    order: 5,
  },
];

const sampleTeam = [
  {
    name: 'Umesh Jain',
    role: 'CEO & Founder',
    bio: 'Passionate about helping B2B companies achieve predictable revenue growth through strategic consulting and process automation.',
    image: '/images/team/umesh.jpg',
    email: 'umesh@growthvalley.com',
    linkedin: 'https://linkedin.com/in/umeshjain',
    order: 1,
    status: 'active',
  },
  {
    name: 'Sagar Kulkarni',
    role: 'Lead Project Manager',
    bio: 'Expert in project delivery and client relationship management with 10+ years of experience.',
    image: '/images/team/sagar.jpg',
    email: 'sagar@growthvalley.com',
    linkedin: 'https://linkedin.com/in/sagarkulkarni',
    order: 2,
    status: 'active',
  },
];

const sampleTestimonials = [
  {
    quote: 'Growth Valley transformed our revenue operations. We saw 3x improvement in our pipeline within 6 months.',
    author: 'Rajesh Kumar',
    designation: 'CEO',
    company: 'TechCorp',
    rating: 5,
    status: 'active',
    order: 1,
  },
  {
    quote: 'Their systematic approach to sales automation saved us countless hours and increased conversion rates by 40%.',
    author: 'Priya Sharma',
    designation: 'VP Sales',
    company: 'Data Driven Inc',
    rating: 5,
    status: 'active',
    order: 2,
  },
  {
    quote: 'Professional team that delivers results. Our CRM implementation was flawless.',
    author: 'Amit Patel',
    designation: 'CTO',
    company: 'Growth Labs',
    rating: 5,
    status: 'active',
    order: 3,
  },
];

const sampleBlogs = [
  {
    title: 'Building Predictable Revenue Systems',
    slug: 'building-predictable-revenue-systems',
    excerpt: 'Learn how to create a revenue engine that delivers consistent results quarter after quarter.',
    content: `# Building Predictable Revenue Systems

In today's competitive B2B landscape, predictable revenue isn't just a goal—it's a necessity for sustainable growth.

## The Challenge

Most companies struggle with:
- Inconsistent pipeline
- Unpredictable closing rates
- Manual processes that don't scale

## Our Approach

We help companies build systems that:
1. Generate consistent leads
2. Nurture prospects effectively
3. Close deals predictably

## Getting Started

Contact us to learn how we can help transform your revenue operations.`,
    category: 'Strategy',
    tags: ['revenue', 'growth', 'B2B', 'sales'],
    status: 'published',
    featured: true,
    publishDate: new Date(),
  },
  {
    title: 'The Power of Sales Automation',
    slug: 'power-of-sales-automation',
    excerpt: 'Discover how automation can transform your sales process and boost productivity.',
    content: `# The Power of Sales Automation

Sales automation isn't about replacing your team—it's about empowering them to focus on what matters most.

## Benefits of Automation

- Reduced manual data entry
- Faster follow-ups
- Better lead scoring
- Improved win rates

## Implementation Guide

Start small, measure results, and scale what works.`,
    category: 'Automation',
    tags: ['automation', 'sales', 'productivity'],
    status: 'published',
    featured: false,
    publishDate: new Date(),
  },
];

const homeContent = {
  page: 'home',
  sections: {
    hero: {
      title: 'Predictable Revenue Systems for Scalable Businesses',
      subtitle: 'We transform fragmented revenue operations into unified, predictable growth engines.',
      label: 'Revenue Operations Experts',
      ctaText: 'Schedule a Call',
      ctaLink: '/contact',
      secondaryCtaText: 'View Case Studies',
      secondaryCtaLink: '/case-studies',
    },
    stats: [
      { value: '50+', label: 'Clients Served' },
      { value: '₹100Cr+', label: 'Revenue Generated' },
      { value: '3x', label: 'Avg Growth Rate' },
      { value: '95%', label: 'Client Retention' },
    ],
    problems: {
      title: 'The Challenge',
      subtitle: 'Most B2B companies struggle with revenue unpredictability',
      items: [
        { title: 'Inconsistent Pipeline', description: 'Feast or famine cycles make planning impossible.' },
        { title: 'Manual Processes', description: 'Your team spends more time on admin than selling.' },
        { title: 'Data Silos', description: 'Critical information scattered across tools.' },
        { title: 'No Visibility', description: 'Leadership can\'t forecast with confidence.' },
      ],
    },
    solutions: {
      title: 'Our Approach',
      subtitle: 'Building predictable revenue, systematically',
      items: [
        { title: 'Revenue Strategy', description: 'Clear roadmap to your growth goals.', icon: 'chart' },
        { title: 'Process Design', description: 'Streamlined workflows that scale.', icon: 'process' },
        { title: 'Team Enablement', description: 'Your people equipped to win.', icon: 'team' },
        { title: 'Technology Stack', description: 'Right tools, properly implemented.', icon: 'target' },
      ],
    },
    industries: {
      title: 'Industries',
      subtitle: 'Deep expertise across B2B sectors',
      items: [
        { name: 'SaaS', icon: '☁️', description: 'Software & Cloud Services' },
        { name: 'Manufacturing', icon: '🏭', description: 'Industrial & Production' },
        { name: 'Finance', icon: '💰', description: 'Financial Services' },
        { name: 'Healthcare', icon: '🏥', description: 'Health & Medical' },
      ],
    },
    process: {
      title: 'How We Work',
      subtitle: 'A systematic approach to transformation',
      steps: [
        { number: '01', title: 'Discovery', description: 'Deep dive into your current state.' },
        { number: '02', title: 'Strategy', description: 'Custom roadmap for your goals.' },
        { number: '03', title: 'Implementation', description: 'Execute with precision.' },
        { number: '04', title: 'Optimization', description: 'Continuous improvement.' },
      ],
    },
    cta: {
      title: 'Ready for predictable revenue?',
      description: 'Let\'s discuss how Growth Valley can transform your revenue operations.',
      buttonText: 'Schedule a Call',
      buttonLink: '/contact',
    },
  },
};

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/growth-valley');
    console.log('Connected!');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      Client.deleteMany({}),
      TeamMember.deleteMany({}),
      Testimonial.deleteMany({}),
      Blog.deleteMany({}),
      Content.deleteMany({ page: 'home' }),
    ]);

    // Insert sample data
    console.log('Inserting sample data...');
    
    const clients = await Client.insertMany(sampleClients);
    console.log(`✓ Inserted ${clients.length} clients`);

    const team = await TeamMember.insertMany(sampleTeam);
    console.log(`✓ Inserted ${team.length} team members`);

    const testimonials = await Testimonial.insertMany(sampleTestimonials);
    console.log(`✓ Inserted ${testimonials.length} testimonials`);

    // Get admin for blog author
    const admin = await Admin.findOne();
    if (admin) {
      const blogsWithAuthor = sampleBlogs.map(blog => ({
        ...blog,
        author: admin._id
      }));
      const blogs = await Blog.insertMany(blogsWithAuthor);
      console.log(`✓ Inserted ${blogs.length} blog posts`);
    } else {
      console.log('⚠ No admin found, skipping blog posts');
    }

    const content = await Content.create(homeContent);
    console.log(`✓ Inserted home page content`);

    console.log('\n✅ Seeding complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();