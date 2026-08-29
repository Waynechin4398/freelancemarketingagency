import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    number: z.string(),
    group: z.enum(["Build", "Acquire", "Engage", "Automate"]),
    short: z.string(),
    intro: z.string(),
    painPoints: z.array(z.string()),
    solutions: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),
    idealFor: z.array(z.string()),
    outcomes: z.array(z.string()),
    deliverables: z.array(z.string()),
    process: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })),
    ctaTitle: z.string(),
    ctaCopy: z.string(),
    related: z.array(z.string()),
    order: z.number(),
    draft: z.boolean().default(false),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/case-studies" }),
  schema: z.object({
    client: z.string(),
    label: z.string(),
    industry: z.string(),
    objective: z.string(),
    services: z.array(z.string()),
    summary: z.string(),
    challenge: z.string(),
    strategy: z.string(),
    created: z.array(z.string()),
    insight: z.string(),
    palette: z.enum(["violet", "sunset", "lime"]),
    featured: z.boolean().default(false),
    order: z.number(),
    approvedMetrics: z.array(z.object({
      value: z.string(),
      label: z.string(),
      period: z.string(),
      evidence: z.string(),
    })).default([]),
    draft: z.boolean().default(false),
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/insights" }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    excerpt: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    authorName: z.string().default("Wayne"),
    authorRole: z.string().default("Strategist and builder, Wayne Omni"),
    draft: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { services, caseStudies, insights };
