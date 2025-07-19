export declare class AIUseCasesMCPServer {
    private server;
    private database;
    private scraper;
    private keywordExtractor;
    private googleSearch;
    constructor();
    private setupTools;
    private setupResources;
    private setupPrompts;
    start(transport?: 'stdio' | 'http', port?: number): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=server.d.ts.map