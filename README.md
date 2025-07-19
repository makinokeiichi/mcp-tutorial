# AI Use Cases MCP Server

A Model Context Protocol (MCP) server for collecting, analyzing, and managing AI use case data from various information sources.

## Features

### 🔍 **Web Scraping Tools**
- **URL Scraping**: Extract AI use case data from specified URLs with customizable selectors
- **Information Source Management**: Add, edit, and manage scraping configurations for different websites
- **Automatic Data Extraction**: Extract titles, summaries, categories, and publication dates

### 📊 **Data Analysis Tools**
- **Keyword Extraction**: Automatically extract relevant AI and technology keywords from content
- **Use Case Categorization**: Automatically categorize AI use cases by technology and industry
- **Search & Filter**: Search through collected use cases with various filters

### 📈 **Resources**
- **AI Use Cases Data**: Access structured AI use case data by category and limit
- **Statistics**: Get overview statistics of collected data including categories and industries

### 🤖 **Prompts**
- **Summarize Use Cases**: Create concise summaries of AI use cases
- **Suggest Sources**: Get recommendations for new information sources
- **Analyze Trends**: Analyze trends in AI use cases over time

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-use-cases-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## Usage

### As an MCP Server

The server can be used with any MCP-compatible client (Claude Desktop, Cursor, etc.) by adding it to your MCP configuration:

```json
{
  "mcpServers": {
    "ai-use-cases": {
      "command": "node",
      "args": ["dist/index.js"]
    }
  }
}
```

### Available Tools

#### 1. Web Scraping Tool (`scrape-url`)
Scrape AI use case data from a specified URL.

**Parameters:**
- `url` (string): The URL to scrape
- `selectors` (object, optional): CSS selectors for data extraction
- `extractKeywords` (boolean, default: true): Whether to extract keywords

**Example:**
```json
{
  "url": "https://example.com/ai-use-case",
  "selectors": {
    "title": "h1.title",
    "summary": ".content p",
    "category": ".category"
  }
}
```

#### 2. Add Information Source (`add-source`)
Add a new information source for automated data collection.

**Parameters:**
- `name` (string): Source name
- `url` (string): Source URL
- `selectors` (object): CSS selectors for data extraction

#### 3. Search Use Cases (`search-use-cases`)
Search through collected AI use cases with filters.

**Parameters:**
- `query` (string): Search query
- `category` (string, optional): Filter by category
- `industry` (string, optional): Filter by industry
- `technology` (string, optional): Filter by technology
- `limit` (number, default: 20): Maximum results

#### 4. Extract Keywords (`extract-keywords`)
Extract relevant keywords from text content.

**Parameters:**
- `text` (string): Text to analyze
- `maxKeywords` (number, default: 10): Maximum keywords to extract
- `category` (string, optional): Category for context-specific extraction

#### 5. Categorize Use Case (`categorize-use-case`)
Automatically categorize an AI use case based on its content.

**Parameters:**
- `title` (string): Use case title
- `summary` (string): Use case summary
- `content` (string, optional): Additional content

### Available Resources

#### 1. AI Use Cases (`ai-use-cases://{category}/{limit}`)
Access AI use case data by category and limit.

**Parameters:**
- `category` (string): Category filter (optional)
- `limit` (number): Maximum number of results

#### 2. Statistics (`statistics://overview`)
Get overview statistics of collected data.

### Available Prompts

#### 1. Summarize Use Case (`summarize-use-case`)
Create a concise summary of an AI use case.

**Parameters:**
- `title` (string): Use case title
- `content` (string): Use case content
- `maxLength` (number, default: 200): Maximum summary length

#### 2. Suggest Sources (`suggest-sources`)
Get recommendations for new information sources.

**Parameters:**
- `industry` (string, optional): Target industry
- `technology` (string, optional): Target technology
- `category` (string, optional): Target category

#### 3. Analyze Trends (`analyze-trends`)
Analyze trends in AI use cases over time.

**Parameters:**
- `timeframe` (string): Analysis timeframe
- `category` (string, optional): Category filter
- `industry` (string, optional): Industry filter

## Data Structure

### AI Use Case
```typescript
interface AIUseCase {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  category: string;
  industry?: string;
  technologyKeywords: string[];
  publicationDate?: string;
  company?: string;
  implementationDetails?: string;
  results?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Scraping Configuration
```typescript
interface ScrapingConfig {
  id: string;
  name: string;
  url: string;
  selectors: {
    title: string;
    summary: string;
    date?: string;
    author?: string;
    category?: string;
  };
  enabled: boolean;
  lastScraped?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Supported Categories

The system automatically categorizes AI use cases into the following categories:

- **Natural Language Processing**: NLP, text analysis, chatbots, translation
- **Computer Vision**: Image recognition, video analysis, object detection
- **Machine Learning**: Algorithms, predictive analytics, classification
- **Robotics & Automation**: Industrial automation, autonomous systems
- **Data Analytics**: Business intelligence, reporting, visualization
- **Healthcare & Medical**: Medical diagnosis, drug discovery, telemedicine
- **Finance & Banking**: Fraud detection, risk assessment, trading
- **E-commerce & Retail**: Recommendation systems, personalization
- **Transportation & Logistics**: Route optimization, autonomous vehicles
- **Education & Training**: Personalized learning, adaptive systems

## Development

### Project Structure
```
src/
├── types/           # TypeScript type definitions
├── database/        # Database layer (SQLite)
├── scraping/        # Web scraping functionality
├── analysis/        # Text analysis and keyword extraction
├── mcp/            # MCP server implementation
└── index.ts        # Main entry point
```

### Building
```bash
# Development
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Adding New Features

1. **New Tools**: Add to `src/mcp/server.ts` in the `setupTools()` method
2. **New Resources**: Add to `src/mcp/server.ts` in the `setupResources()` method
3. **New Prompts**: Add to `src/mcp/server.ts` in the `setupPrompts()` method
4. **New Types**: Add to `src/types/index.ts`

## Configuration

### Database
The server uses SQLite for data storage. The database file (`ai_use_cases.db`) is created automatically in the project root.

### Scraping Settings
- Default timeout: 10 seconds
- Retry attempts: 3
- Delay between requests: 1 second
- User agent: Standard browser user agent

## External Dependencies

- **@modelcontextprotocol/sdk**: MCP protocol implementation
- **axios**: HTTP client for web scraping
- **cheerio**: HTML parsing
- **puppeteer**: Headless browser for JavaScript-heavy pages
- **sqlite3**: Database storage
- **natural**: Natural language processing for keyword extraction
- **zod**: Schema validation

## Security Considerations

- The server includes DNS rebinding protection for HTTP transport
- All user inputs are validated using Zod schemas
- Web scraping respects robots.txt and includes delays between requests
- No sensitive data is stored or transmitted

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Note**: This server is designed for educational and research purposes. Please respect website terms of service and robots.txt when scraping data.
