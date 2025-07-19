import { ScrapingResult, ScrapingConfig } from '../types/index.js';
export declare class WebScraper {
    private browser;
    initBrowser(): Promise<void>;
    closeBrowser(): Promise<void>;
    scrapeUrl(url: string, selectors: Record<string, string>): Promise<ScrapingResult>;
    scrapeMultipleUrls(configs: ScrapingConfig[]): Promise<ScrapingResult[]>;
    scrapeWithRetry(url: string, selectors: Record<string, string>, maxRetries?: number): Promise<ScrapingResult>;
}
//# sourceMappingURL=index.d.ts.map