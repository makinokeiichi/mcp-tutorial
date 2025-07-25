import { z } from 'zod';

// AI Use Case Data Structure
export const AIUseCaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  sourceUrl: z.string().url(),
  category: z.string(),
  industry: z.string().optional(),
  technologyKeywords: z.array(z.string()),
  publicationDate: z.string().optional(),
  company: z.string().optional(),
  implementationDetails: z.string().optional(),
  results: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type AIUseCase = z.infer<typeof AIUseCaseSchema>;

// Web Scraping Configuration
export const ScrapingConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
  selectors: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.string().optional(),
    author: z.string().optional(),
    category: z.string().optional()
  }),
  enabled: z.boolean().default(true),
  lastScraped: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type ScrapingConfig = z.infer<typeof ScrapingConfigSchema>;

// Keyword Extraction Configuration
export const KeywordConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  keywords: z.array(z.string()),
  category: z.string(),
  enabled: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type KeywordConfig = z.infer<typeof KeywordConfigSchema>;

// Scraping Result
export const ScrapingResultSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  content: z.string(),
  extractedData: z.record(z.string(), z.string()),
  success: z.boolean(),
  error: z.string().optional(),
  timestamp: z.string()
});

export type ScrapingResult = z.infer<typeof ScrapingResultSchema>;

// Database Schema
export interface DatabaseSchema {
  ai_use_cases: AIUseCase;
  scraping_configs: ScrapingConfig;
  keyword_configs: KeywordConfig;
  scraping_results: ScrapingResult;
}

// MCP Tool Schemas
export const ScrapeUrlSchema = z.object({
  url: z.string().url(),
  selectors: z.record(z.string(), z.string()).optional(),
  extractKeywords: z.boolean().default(true)
});

export const AddSourceSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  selectors: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.string().optional(),
    author: z.string().optional(),
    category: z.string().optional()
  })
});

export const SearchUseCasesSchema = z.object({
  query: z.string(),
  category: z.string().optional(),
  industry: z.string().optional(),
  technology: z.string().optional(),
  limit: z.number().min(1).max(100).default(20)
});

export const ExtractKeywordsSchema = z.object({
  text: z.string(),
  maxKeywords: z.number().min(1).max(50).default(10),
  category: z.string().optional()
});

export const CategorizeUseCaseSchema = z.object({
  title: z.string(),
  summary: z.string(),
  content: z.string().optional()
});

// Prompt Schemas
export const SummarizeUseCaseSchema = z.object({
  title: z.string(),
  content: z.string(),
  maxLength: z.number().min(50).max(1000).default(200)
});

export const SuggestSourcesSchema = z.object({
  industry: z.string().optional(),
  technology: z.string().optional(),
  category: z.string().optional()
});

export const AnalyzeTrendsSchema = z.object({
  timeframe: z.string(),
  category: z.string().optional(),
  industry: z.string().optional()
}); 