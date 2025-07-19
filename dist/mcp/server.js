import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Database } from '../database/index.js';
import { WebScraper } from '../scraping/index.js';
import { KeywordExtractor } from '../analysis/keywordExtractor.js';
import { GoogleSearchService } from '../search/index.js';
export class AIUseCasesMCPServer {
    server;
    database;
    scraper;
    keywordExtractor;
    googleSearch;
    constructor() {
        this.database = new Database();
        this.scraper = new WebScraper();
        this.keywordExtractor = new KeywordExtractor();
        this.googleSearch = new GoogleSearchService();
        this.server = new McpServer({
            name: 'ai-use-cases-server',
            version: '1.0.0'
        });
        this.setupTools();
        this.setupResources();
        this.setupPrompts();
    }
    setupTools() {
        // Web scraping tool
        this.server.registerTool('scrape-url', {
            title: 'Web Scraping Tool',
            description: 'Scrape AI use case data from a specified URL',
            inputSchema: {
                url: z.string().url(),
                selectors: z.record(z.string(), z.string()).optional(),
                extractKeywords: z.boolean().default(true)
            }
        }, async ({ url, selectors, extractKeywords }) => {
            try {
                const defaultSelectors = {
                    title: 'h1, h2, .title, .headline',
                    summary: '.summary, .description, .excerpt, p',
                    date: '.date, .published, time',
                    author: '.author, .byline',
                    category: '.category, .tag'
                };
                const result = await this.scraper.scrapeUrl(url, selectors || defaultSelectors);
                if (result.success && extractKeywords) {
                    const keywords = this.keywordExtractor.extractAIKeywords(result.content);
                    result.extractedData.keywords = keywords.join(', ');
                }
                // Store scraping result
                await this.database.insertScrapingResult(result);
                return {
                    content: [{
                            type: 'text',
                            text: `Successfully scraped: ${result.title}\n\nExtracted Data:\n${JSON.stringify(result.extractedData, null, 2)}`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error scraping URL: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Add information source tool
        this.server.registerTool('add-source', {
            title: 'Add Information Source',
            description: 'Add a new information source for AI use case data collection',
            inputSchema: {
                name: z.string(),
                url: z.string().url(),
                selectors: z.object({
                    title: z.string(),
                    summary: z.string(),
                    date: z.string().optional(),
                    author: z.string().optional(),
                    category: z.string().optional()
                })
            }
        }, async ({ name, url, selectors }) => {
            try {
                const config = {
                    id: randomUUID(),
                    name,
                    url,
                    selectors,
                    enabled: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                await this.database.insertScrapingConfig(config);
                return {
                    content: [{
                            type: 'text',
                            text: `Successfully added information source: ${name} (${url})`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error adding source: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Search use cases tool
        this.server.registerTool('search-use-cases', {
            title: 'Search AI Use Cases',
            description: 'Search for AI use cases with various filters',
            inputSchema: {
                query: z.string(),
                category: z.string().optional(),
                industry: z.string().optional(),
                technology: z.string().optional(),
                limit: z.number().min(1).max(100).default(20)
            }
        }, async ({ query, category, industry, technology, limit }) => {
            try {
                const useCases = await this.database.searchUseCases(query, {
                    category,
                    industry,
                    technology,
                    limit
                });
                if (useCases.length === 0) {
                    return {
                        content: [{
                                type: 'text',
                                text: 'No use cases found matching your criteria.'
                            }]
                    };
                }
                const results = useCases.map(uc => `**${uc.title}**\n${uc.summary}\nCategory: ${uc.category}\nIndustry: ${uc.industry || 'N/A'}\nTechnologies: ${uc.technologyKeywords.join(', ')}\nSource: ${uc.sourceUrl}\n\n`).join('');
                return {
                    content: [{
                            type: 'text',
                            text: `Found ${useCases.length} use cases:\n\n${results}`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error searching use cases: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Extract keywords tool
        this.server.registerTool('extract-keywords', {
            title: 'Extract Keywords',
            description: 'Extract relevant keywords from text content',
            inputSchema: {
                text: z.string(),
                maxKeywords: z.number().min(1).max(50).default(10),
                category: z.string().optional()
            }
        }, async ({ text, maxKeywords, category }) => {
            try {
                const keywords = category
                    ? this.keywordExtractor.extractKeywords(text, maxKeywords, category)
                    : this.keywordExtractor.extractAIKeywords(text, maxKeywords);
                return {
                    content: [{
                            type: 'text',
                            text: `Extracted keywords: ${keywords.join(', ')}`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error extracting keywords: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Categorize use case tool
        this.server.registerTool('categorize-use-case', {
            title: 'Categorize AI Use Case',
            description: 'Automatically categorize an AI use case based on its content',
            inputSchema: {
                title: z.string(),
                summary: z.string(),
                content: z.string().optional()
            }
        }, async ({ title, summary, content }) => {
            try {
                const category = this.keywordExtractor.categorizeUseCase(title, summary, content);
                const keywords = this.keywordExtractor.extractAIKeywords(`${title} ${summary} ${content || ''}`);
                const industry = this.keywordExtractor.suggestIndustry(category, keywords);
                return {
                    content: [{
                            type: 'text',
                            text: `Category: ${category}\nIndustry: ${industry}\nKeywords: ${keywords.join(', ')}`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Error categorizing use case: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Google search tool
        this.server.registerTool('google-search', {
            title: 'Google Search',
            description: 'Google検索を実行し、検索結果から関連する記事のURLやタイトル、概要を取得する',
            inputSchema: {
                query: z.string().describe('検索したいキーワード'),
                limit: z.number().min(1).max(10).default(10).describe('取得する検索結果の最大数（デフォルト: 10件）'),
                site: z.string().optional().describe('特定のドメイン内のみを検索対象とする（例: example.com）')
            }
        }, async ({ query, limit, site }) => {
            try {
                // Check if Google Search is configured
                if (!this.googleSearch.isConfigured()) {
                    const status = this.googleSearch.getConfigurationStatus();
                    return {
                        content: [{
                                type: 'text',
                                text: `Google Search が設定されていません。\n\n設定状況:\n- APIキー: ${status.hasApiKey ? '✓' : '✗'}\n- Custom Search Engine ID: ${status.hasCx ? '✓' : '✗'}\n\n環境変数 GOOGLE_SEARCH_API_KEY と GOOGLE_SEARCH_CX を設定してください。`
                            }],
                        isError: true
                    };
                }
                const searchResult = await this.googleSearch.search(query, { limit, site });
                if (!searchResult.success) {
                    return {
                        content: [{
                                type: 'text',
                                text: `Google検索でエラーが発生しました: ${searchResult.error}`
                            }],
                        isError: true
                    };
                }
                if (searchResult.results.length === 0) {
                    return {
                        content: [{
                                type: 'text',
                                text: `検索クエリ「${query}」に対する結果が見つかりませんでした。`
                            }]
                    };
                }
                // Format results
                const formattedResults = searchResult.results.map((item, index) => `**${index + 1}. ${item.title}**\nURL: ${item.url}\n概要: ${item.snippet}\n`).join('\n');
                const summary = site
                    ? `「${query}」を${site}内で検索した結果 (${searchResult.results.length}件/${searchResult.totalResults}件):`
                    : `「${query}」を検索した結果 (${searchResult.results.length}件/${searchResult.totalResults}件):`;
                return {
                    content: [{
                            type: 'text',
                            text: `${summary}\n\n${formattedResults}\n\n💡 ヒント: これらのURLを scrape-url ツールに渡すことで、詳細な記事コンテンツを取得できます。`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: `Google検索でエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
    }
    setupResources() {
        // AI use cases resource
        this.server.registerResource('ai-use-cases', new ResourceTemplate('ai-use-cases://{category}/{limit}', { list: undefined }), {
            title: 'AI Use Cases Resource',
            description: 'Access AI use case data by category and limit'
        }, async (uri, { category, limit }) => {
            try {
                const useCases = await this.database.searchUseCases('', {
                    category: typeof category === 'string' ? category : undefined,
                    limit: parseInt(limit) || 20
                });
                const formattedData = useCases.map(uc => ({
                    id: uc.id,
                    title: uc.title,
                    summary: uc.summary,
                    category: uc.category,
                    industry: uc.industry,
                    technologies: uc.technologyKeywords,
                    source: uc.sourceUrl,
                    created: uc.createdAt
                }));
                return {
                    contents: [{
                            uri: uri.href,
                            text: JSON.stringify(formattedData, null, 2),
                            mimeType: 'application/json'
                        }]
                };
            }
            catch (error) {
                return {
                    contents: [{
                            uri: uri.href,
                            text: `Error loading use cases: ${error instanceof Error ? error.message : 'Unknown error'}`,
                            mimeType: 'text/plain'
                        }]
                };
            }
        });
        // Statistics resource
        this.server.registerResource('statistics', 'statistics://overview', {
            title: 'AI Use Cases Statistics',
            description: 'Overview statistics of collected AI use cases',
            mimeType: 'application/json'
        }, async (uri) => {
            try {
                const stats = await this.database.getStatistics();
                return {
                    contents: [{
                            uri: uri.href,
                            text: JSON.stringify(stats, null, 2),
                            mimeType: 'application/json'
                        }]
                };
            }
            catch (error) {
                return {
                    contents: [{
                            uri: uri.href,
                            text: `Error loading statistics: ${error instanceof Error ? error.message : 'Unknown error'}`,
                            mimeType: 'text/plain'
                        }]
                };
            }
        });
    }
    setupPrompts() {
        // Summarize use case prompt
        this.server.registerPrompt('summarize-use-case', {
            title: 'Summarize AI Use Case',
            description: 'Create a concise summary of an AI use case',
            argsSchema: {
                title: z.string(),
                content: z.string(),
                maxLength: z.string().optional()
            }
        }, ({ title, content, maxLength }) => ({
            messages: [{
                    role: 'user',
                    content: {
                        type: 'text',
                        text: `Please provide a concise summary (maximum ${maxLength} characters) of this AI use case:\n\nTitle: ${title}\n\nContent: ${content}`
                    }
                }]
        }));
        // Suggest sources prompt
        this.server.registerPrompt('suggest-sources', {
            title: 'Suggest Information Sources',
            description: 'Suggest new information sources for AI use case collection',
            argsSchema: {
                industry: z.string().optional(),
                technology: z.string().optional(),
                category: z.string().optional()
            }
        }, ({ industry, technology, category }) => ({
            messages: [{
                    role: 'user',
                    content: {
                        type: 'text',
                        text: `Please suggest reliable information sources for collecting AI use cases with the following criteria:\n\nIndustry: ${industry || 'Any'}\nTechnology: ${technology || 'Any'}\nCategory: ${category || 'Any'}\n\nInclude websites, blogs, news sources, research papers, and case study repositories that would be valuable for this collection.`
                    }
                }]
        }));
        // Analyze trends prompt
        this.server.registerPrompt('analyze-trends', {
            title: 'Analyze AI Trends',
            description: 'Analyze trends in AI use cases over a specified timeframe',
            argsSchema: {
                timeframe: z.string(),
                category: z.string().optional(),
                industry: z.string().optional()
            }
        }, ({ timeframe, category, industry }) => ({
            messages: [{
                    role: 'user',
                    content: {
                        type: 'text',
                        text: `Please analyze trends in AI use cases for the following criteria:\n\nTimeframe: ${timeframe}\nCategory: ${category || 'All categories'}\nIndustry: ${industry || 'All industries'}\n\nProvide insights on:\n1. Emerging technologies and approaches\n2. Industry adoption patterns\n3. Common challenges and solutions\n4. Future trends and predictions\n5. Key success factors`
                    }
                }]
        }));
    }
    async start(transport = 'stdio', port) {
        if (transport === 'stdio') {
            const stdioTransport = new StdioServerTransport();
            await this.server.connect(stdioTransport);
            console.log('AI Use Cases MCP Server started with stdio transport');
        }
        else if (transport === 'http') {
            const httpTransport = new StreamableHTTPServerTransport({
                sessionIdGenerator: () => randomUUID(),
                enableDnsRebindingProtection: true,
                allowedHosts: ['127.0.0.1', 'localhost']
            });
            await this.server.connect(httpTransport);
            console.log(`AI Use Cases MCP Server started with HTTP transport on port ${port || 3000}`);
        }
    }
    async close() {
        await this.scraper.closeBrowser();
        await this.database.close();
    }
}
//# sourceMappingURL=server.js.map