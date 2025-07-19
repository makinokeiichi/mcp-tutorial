import { z } from 'zod';
export declare const AIUseCaseSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    summary: z.ZodString;
    sourceUrl: z.ZodString;
    category: z.ZodString;
    industry: z.ZodOptional<z.ZodString>;
    technologyKeywords: z.ZodArray<z.ZodString, "many">;
    publicationDate: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodString>;
    implementationDetails: z.ZodOptional<z.ZodString>;
    results: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    summary: string;
    sourceUrl: string;
    category: string;
    technologyKeywords: string[];
    createdAt: string;
    updatedAt: string;
    industry?: string | undefined;
    publicationDate?: string | undefined;
    company?: string | undefined;
    implementationDetails?: string | undefined;
    results?: string | undefined;
}, {
    id: string;
    title: string;
    summary: string;
    sourceUrl: string;
    category: string;
    technologyKeywords: string[];
    createdAt: string;
    updatedAt: string;
    industry?: string | undefined;
    publicationDate?: string | undefined;
    company?: string | undefined;
    implementationDetails?: string | undefined;
    results?: string | undefined;
}>;
export type AIUseCase = z.infer<typeof AIUseCaseSchema>;
export declare const ScrapingConfigSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    url: z.ZodString;
    selectors: z.ZodObject<{
        title: z.ZodString;
        summary: z.ZodString;
        date: z.ZodOptional<z.ZodString>;
        author: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        summary: string;
        category?: string | undefined;
        date?: string | undefined;
        author?: string | undefined;
    }, {
        title: string;
        summary: string;
        category?: string | undefined;
        date?: string | undefined;
        author?: string | undefined;
    }>;
    enabled: z.ZodDefault<z.ZodBoolean>;
    lastScraped: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    url: string;
    selectors: {
        title: string;
        summary: string;
        category?: string | undefined;
        date?: string | undefined;
        author?: string | undefined;
    };
    enabled: boolean;
    lastScraped?: string | undefined;
}, {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    url: string;
    selectors: {
        title: string;
        summary: string;
        category?: string | undefined;
        date?: string | undefined;
        author?: string | undefined;
    };
    enabled?: boolean | undefined;
    lastScraped?: string | undefined;
}>;
export type ScrapingConfig = z.infer<typeof ScrapingConfigSchema>;
export declare const KeywordConfigSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    keywords: z.ZodArray<z.ZodString, "many">;
    category: z.ZodString;
    enabled: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    enabled: boolean;
    keywords: string[];
}, {
    id: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    keywords: string[];
    enabled?: boolean | undefined;
}>;
export type KeywordConfig = z.infer<typeof KeywordConfigSchema>;
export declare const ScrapingResultSchema: z.ZodObject<{
    url: z.ZodString;
    title: z.ZodString;
    content: z.ZodString;
    extractedData: z.ZodRecord<z.ZodString, z.ZodString>;
    success: z.ZodBoolean;
    error: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    url: string;
    content: string;
    extractedData: Record<string, string>;
    success: boolean;
    timestamp: string;
    error?: string | undefined;
}, {
    title: string;
    url: string;
    content: string;
    extractedData: Record<string, string>;
    success: boolean;
    timestamp: string;
    error?: string | undefined;
}>;
export type ScrapingResult = z.infer<typeof ScrapingResultSchema>;
export interface DatabaseSchema {
    ai_use_cases: AIUseCase;
    scraping_configs: ScrapingConfig;
    keyword_configs: KeywordConfig;
    scraping_results: ScrapingResult;
}
export declare const ScrapeUrlSchema: z.ZodObject<{
    url: z.ZodString;
    selectors: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    extractKeywords: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    url: string;
    extractKeywords: boolean;
    selectors?: Record<string, string> | undefined;
}, {
    url: string;
    selectors?: Record<string, string> | undefined;
    extractKeywords?: boolean | undefined;
}>;
export declare const AddSourceSchema: z.ZodObject<{
    name: z.ZodString;
    url: z.ZodString;
    selectors: z.ZodObject<{
        title: z.ZodString;
        summary: z.ZodString;
        date: z.ZodOptional<z.ZodString>;
        author: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        summary: string;
        category?: string | undefined;
        date?: string | undefined;
        author?: string | undefined;
    }, {
        title: string;
        summary: string;
        category?: string | undefined;
        date?: string | undefined;
        author?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    url: string;
    selectors: {
        title: string;
        summary: string;
        category?: string | undefined;
        date?: string | undefined;
        author?: string | undefined;
    };
}, {
    name: string;
    url: string;
    selectors: {
        title: string;
        summary: string;
        category?: string | undefined;
        date?: string | undefined;
        author?: string | undefined;
    };
}>;
export declare const SearchUseCasesSchema: z.ZodObject<{
    query: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    industry: z.ZodOptional<z.ZodString>;
    technology: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    query: string;
    limit: number;
    category?: string | undefined;
    industry?: string | undefined;
    technology?: string | undefined;
}, {
    query: string;
    category?: string | undefined;
    industry?: string | undefined;
    technology?: string | undefined;
    limit?: number | undefined;
}>;
export declare const ExtractKeywordsSchema: z.ZodObject<{
    text: z.ZodString;
    maxKeywords: z.ZodDefault<z.ZodNumber>;
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    text: string;
    maxKeywords: number;
    category?: string | undefined;
}, {
    text: string;
    category?: string | undefined;
    maxKeywords?: number | undefined;
}>;
export declare const CategorizeUseCaseSchema: z.ZodObject<{
    title: z.ZodString;
    summary: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    summary: string;
    content?: string | undefined;
}, {
    title: string;
    summary: string;
    content?: string | undefined;
}>;
export declare const SummarizeUseCaseSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    maxLength: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    maxLength: number;
}, {
    title: string;
    content: string;
    maxLength?: number | undefined;
}>;
export declare const SuggestSourcesSchema: z.ZodObject<{
    industry: z.ZodOptional<z.ZodString>;
    technology: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category?: string | undefined;
    industry?: string | undefined;
    technology?: string | undefined;
}, {
    category?: string | undefined;
    industry?: string | undefined;
    technology?: string | undefined;
}>;
export declare const AnalyzeTrendsSchema: z.ZodObject<{
    timeframe: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    industry: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    timeframe: string;
    category?: string | undefined;
    industry?: string | undefined;
}, {
    timeframe: string;
    category?: string | undefined;
    industry?: string | undefined;
}>;
//# sourceMappingURL=index.d.ts.map