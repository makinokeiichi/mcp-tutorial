import { google } from 'googleapis';
export class GoogleSearchService {
    apiKey;
    cx; // Custom Search Engine ID
    constructor() {
        this.apiKey = process.env.GOOGLE_SEARCH_API_KEY;
        this.cx = process.env.GOOGLE_SEARCH_CX;
    }
    /**
     * Perform Google search using Custom Search API
     */
    async search(query, options = {}) {
        try {
            // Check if API credentials are configured
            if (!this.apiKey || !this.cx) {
                return {
                    query,
                    results: [],
                    totalResults: 0,
                    success: false,
                    error: 'Google Search APIキーまたはCustom Search Engine IDが設定されていません。環境変数GOOGLE_SEARCH_API_KEYとGOOGLE_SEARCH_CXを設定してください。',
                    timestamp: new Date().toISOString()
                };
            }
            const customsearch = google.customsearch('v1');
            const limit = Math.min(options.limit || 10, 10); // Google Custom Search API allows max 10 results per request
            // Build search parameters
            const searchParams = {
                key: this.apiKey,
                cx: this.cx,
                q: query,
                num: limit
            };
            // Add site restriction if provided
            if (options.site) {
                searchParams.q = `${query} site:${options.site}`;
            }
            const response = await customsearch.cse.list(searchParams);
            if (!response.data.items) {
                return {
                    query,
                    results: [],
                    totalResults: 0,
                    success: true,
                    timestamp: new Date().toISOString()
                };
            }
            const results = response.data.items.map(item => ({
                title: item.title || '',
                url: item.link || '',
                snippet: item.snippet || ''
            }));
            return {
                query,
                results,
                totalResults: parseInt(response.data.searchInformation?.totalResults || '0'),
                success: true,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            let errorMessage = 'Google検索でエラーが発生しました';
            if (error && typeof error === 'object' && 'message' in error) {
                const errorMsg = error.message;
                if (errorMsg.includes('quotaExceeded')) {
                    errorMessage = 'Google Custom Search APIの利用制限に達しました。しばらく時間をおいてから再試行してください。';
                }
                else if (errorMsg.includes('keyInvalid')) {
                    errorMessage = 'Google Search APIキーが無効です。正しいAPIキーを設定してください。';
                }
                else if (errorMsg.includes('customsearchNotFound')) {
                    errorMessage = 'Custom Search Engine IDが無効です。正しいCXを設定してください。';
                }
                else {
                    errorMessage = `Google検索エラー: ${errorMsg}`;
                }
            }
            return {
                query,
                results: [],
                totalResults: 0,
                success: false,
                error: errorMessage,
                timestamp: new Date().toISOString()
            };
        }
    }
    /**
     * Check if the Google Search service is properly configured
     */
    isConfigured() {
        return !!(this.apiKey && this.cx);
    }
    /**
     * Get configuration status for debugging
     */
    getConfigurationStatus() {
        return {
            hasApiKey: !!this.apiKey,
            hasCx: !!this.cx,
            configured: this.isConfigured()
        };
    }
}
//# sourceMappingURL=index.js.map