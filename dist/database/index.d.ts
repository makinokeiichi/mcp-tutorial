import { AIUseCase, ScrapingConfig, KeywordConfig, ScrapingResult } from '../types/index.js';
export declare class Database {
    private db;
    constructor(dbPath?: string);
    private initDatabase;
    insertUseCase(useCase: AIUseCase): Promise<void>;
    getUseCase(id: string): Promise<AIUseCase | null>;
    searchUseCases(query: string, filters?: {
        category?: string;
        industry?: string;
        technology?: string;
        limit?: number;
    }): Promise<AIUseCase[]>;
    getAllUseCases(limit?: number): Promise<AIUseCase[]>;
    insertScrapingConfig(config: ScrapingConfig): Promise<void>;
    getScrapingConfigs(): Promise<ScrapingConfig[]>;
    updateScrapingConfigLastScraped(id: string, timestamp: string): Promise<void>;
    insertKeywordConfig(config: KeywordConfig): Promise<void>;
    getKeywordConfigs(): Promise<KeywordConfig[]>;
    insertScrapingResult(result: ScrapingResult): Promise<void>;
    getScrapingResults(limit?: number): Promise<ScrapingResult[]>;
    getStatistics(): Promise<{
        totalUseCases: number;
        totalSources: number;
        categories: Record<string, number>;
        industries: Record<string, number>;
    }>;
    close(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map