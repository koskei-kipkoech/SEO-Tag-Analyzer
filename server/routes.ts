import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { seoUrlSchema } from "@shared/schema";
import fetch from "node-fetch";
import { analyzeSeo } from "./utils/seoAnalyzer";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to analyze a URL
  app.post("/api/analyze", async (req, res) => {
    try {
      // Validate the request
      const validationResult = seoUrlSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid URL", 
          errors: validationResult.error.errors 
        });
      }
      
      const { url } = validationResult.data;
      
      // Check if we already have an analysis for this URL
      const existingAnalysis = await storage.getSeoAnalysisByUrl(url);
      
      // If we have recent analysis, return it
      if (existingAnalysis) {
        return res.json(existingAnalysis);
      }
      
      // Normalize URL format for fetch
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Fetch the HTML content
      const response = await fetch(normalizedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEOAnalyzerBot/1.0; +https://seoanalyzer.com)'
        }
      });
      
      if (!response.ok) {
        return res.status(400).json({ 
          message: `Failed to fetch URL: ${response.status} ${response.statusText}` 
        });
      }
      
      const html = await response.text();
      
      // Analyze the SEO tags
      const analysis = await analyzeSeo(url, html);
      
      // Save the analysis
      const savedAnalysis = await storage.saveSeoAnalysis({
        url,
        title: analysis.title,
        description: analysis.description,
        canonical: analysis.canonical,
        robots: analysis.robots,
        viewport: analysis.viewport,
        charset: analysis.charset,
        language: analysis.language,
        ogTags: analysis.ogTags,
        twitterTags: analysis.twitterTags,
        otherMetaTags: analysis.metaTags,
        score: analysis.score,
        analysisDate: analysis.analysisDate
      });
      
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing URL:", error);
      res.status(500).json({ 
        message: "Failed to analyze URL", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // API endpoint to get recent analyses
  app.get("/api/recent", async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 5;
      const analyses = await storage.getRecentAnalyses(limit);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching recent analyses:", error);
      res.status(500).json({ 
        message: "Failed to fetch recent analyses"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
