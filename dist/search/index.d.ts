import { GoogleSearchResult } from '../types/index.js';
export declare class GoogleSearchService {
    private apiKey;
    private cx;
    constructor();
    /**
     * Perform Google search using Custom Search API
     */
    search(query: string, options?: {
        limit?: number;
        site?: string;
    }): Promise<GoogleSearchResult>;
    /**
     * Check if the Google Search service is properly configured
     */
    isConfigured(): boolean;
    /**
     * Get configuration status for debugging
     */
    getConfigurationStatus(): {
        hasApiKey: boolean;
        hasCx: boolean;
        configured: boolean;
    };
}
//# sourceMappingURL=index.d.ts.map