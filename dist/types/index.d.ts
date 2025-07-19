import { z } from 'zod';
export declare const AIUseCaseSchema: any;
export type AIUseCase = z.infer<typeof AIUseCaseSchema>;
export declare const ScrapingConfigSchema: any;
export type ScrapingConfig = z.infer<typeof ScrapingConfigSchema>;
export declare const KeywordConfigSchema: any;
export type KeywordConfig = z.infer<typeof KeywordConfigSchema>;
export declare const ScrapingResultSchema: any;
export type ScrapingResult = z.infer<typeof ScrapingResultSchema>;
export interface DatabaseSchema {
    ai_use_cases: AIUseCase;
    scraping_configs: ScrapingConfig;
    keyword_configs: KeywordConfig;
    scraping_results: ScrapingResult;
}
export declare const ScrapeUrlSchema: any;
export declare const AddSourceSchema: any;
export declare const SearchUseCasesSchema: any;
export declare const ExtractKeywordsSchema: any;
export declare const CategorizeUseCaseSchema: any;
export declare const SummarizeUseCaseSchema: any;
export declare const SuggestSourcesSchema: any;
export declare const AnalyzeTrendsSchema: any;
//# sourceMappingURL=index.d.ts.map