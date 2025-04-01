import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the SEO Analysis model
export const seoAnalyses = pgTable("seo_analyses", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title"),
  description: text("description"),
  canonical: text("canonical"),
  robots: text("robots"),
  viewport: text("viewport"),
  charset: text("charset"),
  language: text("language"),
  ogTags: jsonb("og_tags"),
  twitterTags: jsonb("twitter_tags"),
  otherMetaTags: jsonb("other_meta_tags"),
  score: integer("score"),
  analysisDate: text("analysis_date").notNull(),
});

// Define the schema for a user input - just a URL for now
export const seoUrlSchema = z.object({
  url: z.string().trim().min(1, "URL is required"),
});

// Define types for meta tags
export type MetaTagType = {
  name: string;
  content: string;
  score: number;
  status: 'good' | 'warning' | 'error' | 'info';
  recommendation?: string;
};

export type OgTagType = {
  property: string;
  content: string;
};

export type TwitterTagType = {
  name: string;
  content: string;
};

// Define the SEO Analysis response type
export type SeoAnalysisResult = {
  url: string;
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  viewport?: string;
  charset?: string;
  language?: string;
  ogTags: OgTagType[];
  twitterTags: TwitterTagType[];
  metaTags: MetaTagType[];
  score: number;
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    type: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    code?: string;
  }[];
  analysisDate: string;
};

// Create the insert schema
export const insertSeoAnalysisSchema = createInsertSchema(seoAnalyses);

export type InsertSeoAnalysis = z.infer<typeof insertSeoAnalysisSchema>;
export type SeoAnalysis = typeof seoAnalyses.$inferSelect;
export type SeoUrlInput = z.infer<typeof seoUrlSchema>;
