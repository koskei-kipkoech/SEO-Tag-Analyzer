import { seoAnalyses, type SeoAnalysis, type InsertSeoAnalysis, type SeoAnalysisResult } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  saveSeoAnalysis(analysis: InsertSeoAnalysis): Promise<SeoAnalysis>;
  getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined>;
  getRecentAnalyses(limit: number): Promise<SeoAnalysis[]>;
}

// In-memory implementation
export class MemStorage implements IStorage {
  private analyses: Map<number, SeoAnalysis>;
  private urlToIdMap: Map<string, number>;
  private currentId: number;

  constructor() {
    this.analyses = new Map();
    this.urlToIdMap = new Map();
    this.currentId = 1;
  }

  async saveSeoAnalysis(analysis: InsertSeoAnalysis): Promise<SeoAnalysis> {
    const id = this.currentId++;
    const savedAnalysis: SeoAnalysis = { ...analysis, id };
    
    this.analyses.set(id, savedAnalysis);
    if (analysis.url) {
      this.urlToIdMap.set(analysis.url, id);
    }
    
    return savedAnalysis;
  }

  async getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined> {
    const id = this.urlToIdMap.get(url);
    if (id === undefined) return undefined;
    return this.analyses.get(id);
  }

  async getRecentAnalyses(limit: number): Promise<SeoAnalysis[]> {
    return Array.from(this.analyses.values())
      .sort((a, b) => b.id - a.id)
      .slice(0, limit);
  }
}

// Export a singleton instance
export const storage = new MemStorage();
