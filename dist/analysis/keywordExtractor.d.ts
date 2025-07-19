export declare class KeywordExtractor {
    private tokenizer;
    private stopWords;
    constructor();
    extractKeywords(text: string, maxKeywords?: number, category?: string): string[];
    extractAIKeywords(text: string, maxKeywords?: number): string[];
    categorizeUseCase(title: string, summary: string, content?: string): string;
    suggestIndustry(category: string, keywords: string[]): string;
}
//# sourceMappingURL=keywordExtractor.d.ts.map