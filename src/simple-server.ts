import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Simple in-memory storage
const useCases: Array<{
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  category: string;
  industry?: string;
  technologyKeywords: string[];
  createdAt: string;
}> = [];

const sources: Array<{
  id: string;
  name: string;
  url: string;
  selectors: Record<string, string>;
  enabled: boolean;
}> = [];

export class SimpleAIUseCasesMCPServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: 'ai-use-cases-server',
      version: '1.0.0'
    });

    this.setupTools();
    this.setupResources();
    this.setupPrompts();
  }

  private setupTools() {
    // Web scraping tool
    this.server.registerTool(
      'scrape-url',
      {
        title: 'Web Scraping Tool',
        description: 'Scrape AI use case data from a specified URL',
        inputSchema: {
          url: z.string().url(),
          selectors: z.record(z.string(), z.string()).optional(),
          extractKeywords: z.boolean().default(true)
        }
      },
      async ({ url, selectors, extractKeywords }) => {
        try {
          const defaultSelectors = {
            title: 'h1, h2, .title, .headline',
            summary: '.summary, .description, .excerpt, p',
            date: '.date, .published, time',
            author: '.author, .byline',
            category: '.category, .tag'
          };

          const response = await axios.get(url, {
            timeout: 10000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });

          const $ = cheerio.load(response.data);
          const extractedData: Record<string, string> = {};

          // Extract data using provided selectors
          for (const [key, selector] of Object.entries(selectors || defaultSelectors)) {
            const element = $(selector);
            if (element.length > 0) {
              extractedData[key] = element.text().trim();
            }
          }

          // Extract keywords if requested
          let keywords: string[] = [];
          if (extractKeywords) {
            const content = $('body').text();
            keywords = this.extractKeywords(content);
          }

          // Store the use case
          const useCase = {
            id: `case-${Date.now()}`,
            title: extractedData.title || 'Unknown Title',
            summary: extractedData.summary || 'No summary available',
            sourceUrl: url,
            category: extractedData.category || 'Other',
            industry: extractedData.author || undefined,
            technologyKeywords: keywords,
            createdAt: new Date().toISOString()
          };

          useCases.push(useCase);

          return {
            content: [{
              type: 'text',
              text: `Successfully scraped: ${useCase.title}\n\nExtracted Data:\n${JSON.stringify(extractedData, null, 2)}\n\nKeywords: ${keywords.join(', ')}`
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error scraping URL: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Add information source tool
    this.server.registerTool(
      'add-source',
      {
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
      },
      async ({ name, url, selectors }) => {
        try {
          const source = {
            id: `source-${Date.now()}`,
            name,
            url,
            selectors,
            enabled: true
          };

          sources.push(source);

          return {
            content: [{
              type: 'text',
              text: `Successfully added information source: ${name} (${url})`
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error adding source: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Search use cases tool
    this.server.registerTool(
      'search-use-cases',
      {
        title: 'Search AI Use Cases',
        description: 'Search for AI use cases with various filters',
        inputSchema: {
          query: z.string(),
          category: z.string().optional(),
          industry: z.string().optional(),
          technology: z.string().optional(),
          limit: z.number().min(1).max(100).default(20)
        }
      },
      async ({ query, category, industry, technology, limit }) => {
        try {
          let filteredCases = useCases.filter(uc => {
            const matchesQuery = uc.title.toLowerCase().includes(query.toLowerCase()) ||
                               uc.summary.toLowerCase().includes(query.toLowerCase()) ||
                               uc.technologyKeywords.some(kw => kw.toLowerCase().includes(query.toLowerCase()));
            
            const matchesCategory = !category || uc.category.toLowerCase().includes(category.toLowerCase());
            const matchesIndustry = !industry || (uc.industry && uc.industry.toLowerCase().includes(industry.toLowerCase()));
            const matchesTechnology = !technology || uc.technologyKeywords.some(kw => kw.toLowerCase().includes(technology.toLowerCase()));
            
            return matchesQuery && matchesCategory && matchesIndustry && matchesTechnology;
          });

          filteredCases = filteredCases.slice(0, limit);

          if (filteredCases.length === 0) {
            return {
              content: [{
                type: 'text',
                text: 'No use cases found matching your criteria.'
              }]
            };
          }

          const results = filteredCases.map(uc => 
            `**${uc.title}**\n${uc.summary}\nCategory: ${uc.category}\nIndustry: ${uc.industry || 'N/A'}\nTechnologies: ${uc.technologyKeywords.join(', ')}\nSource: ${uc.sourceUrl}\n\n`
          ).join('');

          return {
            content: [{
              type: 'text',
              text: `Found ${filteredCases.length} use cases:\n\n${results}`
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error searching use cases: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Extract keywords tool
    this.server.registerTool(
      'extract-keywords',
      {
        title: 'Extract Keywords',
        description: 'Extract relevant keywords from text content',
        inputSchema: {
          text: z.string(),
          maxKeywords: z.number().min(1).max(50).default(10)
        }
      },
      async ({ text, maxKeywords }) => {
        try {
          const keywords = this.extractKeywords(text).slice(0, maxKeywords);

          return {
            content: [{
              type: 'text',
              text: `Extracted keywords: ${keywords.join(', ')}`
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error extracting keywords: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );

    // Categorize use case tool
    this.server.registerTool(
      'categorize-use-case',
      {
        title: 'Categorize AI Use Case',
        description: 'Automatically categorize an AI use case based on its content',
        inputSchema: {
          title: z.string(),
          summary: z.string(),
          content: z.string().optional()
        }
      },
      async ({ title, summary, content }) => {
        try {
          const fullText = `${title} ${summary} ${content || ''}`.toLowerCase();
          const category = this.categorizeUseCase(fullText);
          const keywords = this.extractKeywords(fullText);
          const industry = this.suggestIndustry(category, keywords);

          return {
            content: [{
              type: 'text',
              text: `Category: ${category}\nIndustry: ${industry}\nKeywords: ${keywords.slice(0, 8).join(', ')}`
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error categorizing use case: ${error instanceof Error ? error.message : 'Unknown error'}`
            }],
            isError: true
          };
        }
      }
    );
  }

  private setupResources() {
    // AI use cases resource
    this.server.registerResource(
      'ai-use-cases',
      new ResourceTemplate('ai-use-cases://{category}/{limit}', { list: undefined }),
      {
        title: 'AI Use Cases Resource',
        description: 'Access AI use case data by category and limit'
      },
      async (uri, { category, limit }) => {
        try {
          let filteredCases = useCases;
          
          if (category && category !== 'all') {
            filteredCases = useCases.filter(uc => 
              uc.category.toLowerCase().includes((category as string).toLowerCase())
            );
          }

          const limitNum = parseInt(limit as string) || 20;
          const limitedCases = filteredCases.slice(0, limitNum);

          const formattedData = limitedCases.map(uc => ({
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
        } catch (error) {
          return {
            contents: [{
              uri: uri.href,
              text: `Error loading use cases: ${error instanceof Error ? error.message : 'Unknown error'}`,
              mimeType: 'text/plain'
            }]
          };
        }
      }
    );

    // Statistics resource
    this.server.registerResource(
      'statistics',
      'statistics://overview',
      {
        title: 'AI Use Cases Statistics',
        description: 'Overview statistics of collected AI use cases',
        mimeType: 'application/json'
      },
      async (uri) => {
        try {
          const categories = useCases.reduce((acc, uc) => {
            acc[uc.category] = (acc[uc.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const industries = useCases.reduce((acc, uc) => {
            if (uc.industry) {
              acc[uc.industry] = (acc[uc.industry] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>);

          const stats = {
            totalUseCases: useCases.length,
            totalSources: sources.filter(s => s.enabled).length,
            categories,
            industries
          };
          
          return {
            contents: [{
              uri: uri.href,
              text: JSON.stringify(stats, null, 2),
              mimeType: 'application/json'
            }]
          };
        } catch (error) {
          return {
            contents: [{
              uri: uri.href,
              text: `Error loading statistics: ${error instanceof Error ? error.message : 'Unknown error'}`,
              mimeType: 'text/plain'
            }]
          };
        }
      }
    );
  }

  private setupPrompts() {
    // Summarize use case prompt
    this.server.registerPrompt(
      'summarize-use-case',
      {
        title: 'Summarize AI Use Case',
        description: 'Create a concise summary of an AI use case',
        argsSchema: {
          title: z.string(),
          content: z.string(),
          maxLength: z.string().optional()
        }
      },
      ({ title, content, maxLength }) => ({
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: `Please provide a concise summary (maximum ${maxLength} characters) of this AI use case:\n\nTitle: ${title}\n\nContent: ${content}`
          }
        }]
      })
    );

    // Suggest sources prompt
    this.server.registerPrompt(
      'suggest-sources',
      {
        title: 'Suggest Information Sources',
        description: 'Suggest new information sources for AI use case collection',
        argsSchema: {
          industry: z.string().optional(),
          technology: z.string().optional(),
          category: z.string().optional()
        }
      },
      ({ industry, technology, category }) => ({
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: `Please suggest reliable information sources for collecting AI use cases with the following criteria:\n\nIndustry: ${industry || 'Any'}\nTechnology: ${technology || 'Any'}\nCategory: ${category || 'Any'}\n\nInclude websites, blogs, news sources, research papers, and case study repositories that would be valuable for this collection.`
          }
        }]
      })
    );

    // Analyze trends prompt
    this.server.registerPrompt(
      'analyze-trends',
      {
        title: 'Analyze AI Trends',
        description: 'Analyze trends in AI use cases over a specified timeframe',
        argsSchema: {
          timeframe: z.string(),
          category: z.string().optional(),
          industry: z.string().optional()
        }
      },
      ({ timeframe, category, industry }) => ({
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: `Please analyze trends in AI use cases for the following criteria:\n\nTimeframe: ${timeframe}\nCategory: ${category || 'All categories'}\nIndustry: ${industry || 'All industries'}\n\nProvide insights on:\n1. Emerging technologies and approaches\n2. Industry adoption patterns\n3. Common challenges and solutions\n4. Future trends and predictions\n5. Key success factors`
          }
        }]
      })
    );
  }

  // Helper methods
  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    ]);

    const aiKeywords = [
      'artificial intelligence', 'ai', 'machine learning', 'ml', 'deep learning', 'neural network',
      'natural language processing', 'nlp', 'computer vision', 'cv', 'robotics', 'automation',
      'predictive analytics', 'data science', 'big data', 'algorithm', 'model', 'training',
      'inference', 'optimization', 'classification', 'regression', 'clustering', 'recommendation',
      'chatbot', 'virtual assistant', 'voice recognition', 'speech synthesis', 'image recognition',
      'object detection', 'semantic analysis', 'sentiment analysis', 'text generation', 'translation',
      'reinforcement learning', 'supervised learning', 'unsupervised learning', 'transfer learning',
      'gpt', 'bert', 'transformer', 'cnn', 'rnn', 'lstm', 'gan', 'autoencoder', 'svm', 'random forest',
      'gradient boosting', 'xgboost', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas',
      'numpy', 'matplotlib', 'seaborn', 'jupyter', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
      'api', 'rest', 'graphql', 'microservices', 'serverless', 'lambda', 'sagemaker', 'vertex ai'
    ];

    const tokens = text.toLowerCase().split(/\s+/);
    const foundKeywords: string[] = [];

    // Check for multi-word AI keywords
    for (const keyword of aiKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        foundKeywords.push(keyword);
      }
    }

    // Also extract single-word technical terms
    const technicalTerms = tokens.filter(token => 
      token && 
      token.length > 3 && 
      !stopWords.has(token) &&
      /^[a-zA-Z]+$/.test(token)
    );

    // Combine and return unique keywords
    const allKeywords = [...foundKeywords, ...technicalTerms];
    const uniqueKeywords = [...new Set(allKeywords)];
    
    return uniqueKeywords;
  }

  private categorizeUseCase(text: string): string {
    const categories = {
      'Natural Language Processing': ['nlp', 'natural language', 'text', 'language', 'translation', 'sentiment', 'semantic', 'chatbot', 'conversation', 'dialogue', 'speech', 'voice', 'transcription', 'bert', 'gpt', 'transformer'],
      'Computer Vision': ['computer vision', 'cv', 'image', 'video', 'recognition', 'detection', 'segmentation', 'object detection', 'face recognition', 'optical character recognition', 'ocr', 'cnn', 'convolutional', 'image processing'],
      'Machine Learning': ['machine learning', 'ml', 'algorithm', 'model', 'training', 'prediction', 'classification', 'regression', 'clustering', 'recommendation', 'optimization', 'supervised', 'unsupervised', 'reinforcement learning', 'deep learning', 'neural network'],
      'Robotics & Automation': ['robotics', 'automation', 'robot', 'autonomous', 'control', 'sensor', 'actuator', 'industrial automation', 'manufacturing', 'warehouse', 'logistics', 'supply chain'],
      'Data Analytics': ['analytics', 'data analysis', 'business intelligence', 'bi', 'dashboard', 'reporting', 'visualization', 'kpi', 'metrics', 'forecasting', 'trend analysis', 'data mining'],
      'Healthcare & Medical': ['healthcare', 'medical', 'diagnosis', 'treatment', 'patient', 'clinical', 'drug', 'pharmaceutical', 'imaging', 'radiology', 'pathology', 'genomics', 'bioinformatics'],
      'Finance & Banking': ['finance', 'banking', 'financial', 'investment', 'trading', 'risk', 'fraud', 'credit', 'loan', 'insurance', 'compliance', 'regulatory', 'audit', 'portfolio'],
      'E-commerce & Retail': ['e-commerce', 'retail', 'shopping', 'product', 'inventory', 'pricing', 'recommendation', 'customer', 'sales', 'marketing', 'advertising', 'personalization'],
      'Transportation & Logistics': ['transportation', 'logistics', 'delivery', 'route', 'optimization', 'fleet', 'autonomous vehicle', 'self-driving', 'traffic', 'navigation', 'gps', 'tracking'],
      'Education & Training': ['education', 'learning', 'training', 'student', 'course', 'curriculum', 'assessment', 'personalized learning', 'adaptive', 'tutoring', 'skill development', 'certification']
    };

    let bestCategory = 'Other';
    let maxScore = 0;

    for (const [category, keywords] of Object.entries(categories)) {
      let score = 0;
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          score += 1;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestCategory = category;
      }
    }

    return bestCategory;
  }

  private suggestIndustry(category: string, keywords: string[]): string {
    const industryMap: Record<string, string[]> = {
      'Healthcare & Medical': ['Healthcare', 'Pharmaceuticals', 'Medical Devices', 'Biotechnology'],
      'Finance & Banking': ['Banking', 'Insurance', 'Investment', 'Fintech', 'Cryptocurrency'],
      'E-commerce & Retail': ['Retail', 'E-commerce', 'Fashion', 'Consumer Goods', 'Marketplace'],
      'Transportation & Logistics': ['Transportation', 'Logistics', 'Automotive', 'Delivery', 'Supply Chain'],
      'Education & Training': ['Education', 'EdTech', 'Corporate Training', 'Online Learning'],
      'Manufacturing': ['Manufacturing', 'Industrial', 'Automotive', 'Aerospace', 'Electronics'],
      'Technology': ['Software', 'SaaS', 'Cloud Computing', 'Cybersecurity', 'IoT'],
      'Media & Entertainment': ['Entertainment', 'Gaming', 'Media', 'Publishing', 'Streaming'],
      'Real Estate': ['Real Estate', 'Property Management', 'Construction', 'Architecture'],
      'Energy & Utilities': ['Energy', 'Utilities', 'Renewable Energy', 'Oil & Gas']
    };

    // Try to match category first
    for (const [cat, industries] of Object.entries(industryMap)) {
      if (category.includes(cat) || cat.includes(category)) {
        return industries[0];
      }
    }

    // Fallback based on keywords
    const keywordIndustryMap: Record<string, string> = {
      'healthcare': 'Healthcare',
      'medical': 'Healthcare',
      'banking': 'Banking',
      'finance': 'Finance',
      'retail': 'Retail',
      'e-commerce': 'E-commerce',
      'manufacturing': 'Manufacturing',
      'automotive': 'Automotive',
      'education': 'Education',
      'software': 'Technology',
      'saas': 'Technology',
      'media': 'Media & Entertainment',
      'entertainment': 'Media & Entertainment',
      'energy': 'Energy',
      'utilities': 'Energy & Utilities'
    };

    for (const keyword of keywords) {
      for (const [key, industry] of Object.entries(keywordIndustryMap)) {
        if (keyword.includes(key)) {
          return industry;
        }
      }
    }

    return 'Technology';
  }

  async start() {
    const stdioTransport = new StdioServerTransport();
    await this.server.connect(stdioTransport);
    console.log('AI Use Cases MCP Server started with stdio transport');
  }
} 