# AI Use Cases MCP Server - Usage Examples

This document provides practical examples of how to use the AI Use Cases MCP Server with various MCP clients.

## Example 1: Web Scraping an AI Use Case

### Scenario
You want to extract AI use case data from a blog post about a company implementing machine learning for fraud detection.

### Tool Usage
```json
{
  "name": "scrape-url",
  "arguments": {
    "url": "https://example-blog.com/ai-fraud-detection-case-study",
    "selectors": {
      "title": "h1.article-title",
      "summary": ".article-excerpt",
      "category": ".article-category",
      "date": ".publish-date",
      "author": ".author-name"
    },
    "extractKeywords": true
  }
}
```

### Expected Response
```
Successfully scraped: AI-Powered Fraud Detection Reduces False Positives by 85%

Extracted Data:
{
  "title": "AI-Powered Fraud Detection Reduces False Positives by 85%",
  "summary": "A financial services company implemented machine learning algorithms to detect fraudulent transactions...",
  "category": "Machine Learning",
  "date": "2024-03-15",
  "author": "Sarah Johnson",
  "keywords": "machine learning, fraud detection, financial services, neural networks, real-time processing"
}
```

## Example 2: Adding a New Information Source

### Scenario
You want to add a new AI news website to your automated data collection.

### Tool Usage
```json
{
  "name": "add-source",
  "arguments": {
    "name": "AI News Daily",
    "url": "https://ai-news-daily.com",
    "selectors": {
      "title": "h2.article-title",
      "summary": ".article-summary",
      "category": ".article-tags",
      "date": ".publish-time"
    }
  }
}
```

### Expected Response
```
Successfully added information source: AI News Daily (https://ai-news-daily.com)
```

## Example 3: Searching for Specific Use Cases

### Scenario
You want to find AI use cases related to healthcare and natural language processing.

### Tool Usage
```json
{
  "name": "search-use-cases",
  "arguments": {
    "query": "healthcare NLP",
    "category": "Natural Language Processing",
    "industry": "Healthcare",
    "limit": 10
  }
}
```

### Expected Response
```
Found 5 use cases:

**AI-Powered Medical Transcription System**
A healthcare provider implemented an NLP system to automatically transcribe medical consultations...
Category: Natural Language Processing
Industry: Healthcare
Technologies: natural language processing, speech recognition, medical transcription, healthcare AI
Source: https://example.com/medical-transcription

**Chatbot for Patient Triage**
A hospital deployed an intelligent chatbot to help patients self-triage their symptoms...
Category: Natural Language Processing
Industry: Healthcare
Technologies: chatbot, natural language processing, patient care, triage system
Source: https://example.com/patient-triage
```

## Example 4: Extracting Keywords from Content

### Scenario
You want to extract relevant AI keywords from a technical article.

### Tool Usage
```json
{
  "name": "extract-keywords",
  "arguments": {
    "text": "The company implemented a deep learning model using TensorFlow and PyTorch for computer vision applications. The neural network architecture included convolutional layers and achieved 95% accuracy in object detection tasks.",
    "maxKeywords": 8
  }
}
```

### Expected Response
```
Extracted keywords: deep learning, tensorflow, pytorch, computer vision, neural network, convolutional, object detection, accuracy
```

## Example 5: Categorizing a Use Case

### Scenario
You want to automatically categorize a new AI use case based on its description.

### Tool Usage
```json
{
  "name": "categorize-use-case",
  "arguments": {
    "title": "Autonomous Vehicle Navigation System",
    "summary": "A transportation company developed an AI system for autonomous vehicle navigation using computer vision and machine learning algorithms to detect road signs and obstacles in real-time.",
    "content": "The system uses multiple cameras and sensors to create a 360-degree view of the vehicle's surroundings. Deep learning models process the visual data to identify traffic signs, pedestrians, and other vehicles. The navigation system makes real-time decisions about speed, direction, and braking based on the AI analysis."
  }
}
```

### Expected Response
```
Category: Computer Vision
Industry: Transportation
Keywords: autonomous vehicle, computer vision, machine learning, navigation, deep learning, real-time, sensors, traffic signs
```

## Example 6: Using Resources

### Scenario
You want to access AI use case data for the "Machine Learning" category.

### Resource Access
```
ai-use-cases://Machine Learning/15
```

### Expected Response (JSON)
```json
[
  {
    "id": "case-001",
    "title": "Predictive Maintenance System",
    "summary": "Manufacturing company implements ML for equipment maintenance prediction",
    "category": "Machine Learning",
    "industry": "Manufacturing",
    "technologies": ["machine learning", "predictive analytics", "iot", "sensors"],
    "source": "https://example.com/predictive-maintenance",
    "created": "2024-03-15T10:30:00Z"
  },
  {
    "id": "case-002",
    "title": "Customer Churn Prediction",
    "summary": "SaaS company uses ML to predict customer churn and improve retention",
    "category": "Machine Learning",
    "industry": "Technology",
    "technologies": ["machine learning", "predictive analytics", "customer analytics", "retention"],
    "source": "https://example.com/churn-prediction",
    "created": "2024-03-14T15:45:00Z"
  }
]
```

## Example 7: Using Prompts

### Scenario
You want to create a summary of an AI use case.

### Prompt Usage
```json
{
  "name": "summarize-use-case",
  "arguments": {
    "title": "AI-Powered Supply Chain Optimization",
    "content": "A logistics company implemented an AI system that uses machine learning algorithms to optimize their supply chain operations. The system analyzes historical data, current demand patterns, and external factors like weather and traffic to predict optimal routes, inventory levels, and delivery schedules. The implementation resulted in a 30% reduction in delivery times and a 25% decrease in operational costs.",
    "maxLength": 150
  }
}
```

### Expected Response
```
The logistics company's AI system optimizes supply chain operations using machine learning to analyze historical data and predict optimal routes, inventory levels, and delivery schedules, achieving 30% faster deliveries and 25% cost reduction.
```

## Example 8: Getting Source Recommendations

### Scenario
You want to find new information sources for healthcare AI use cases.

### Prompt Usage
```json
{
  "name": "suggest-sources",
  "arguments": {
    "industry": "Healthcare",
    "technology": "Machine Learning",
    "category": "Computer Vision"
  }
}
```

### Expected Response
```
Here are some reliable information sources for healthcare AI use cases:

**Academic Sources:**
- PubMed Central (https://www.ncbi.nlm.nih.gov/pmc/) - Medical AI research papers
- IEEE Xplore (https://ieeexplore.ieee.org/) - Technical papers on medical AI
- arXiv (https://arxiv.org/) - Preprints on healthcare machine learning

**Industry Sources:**
- Healthcare IT News (https://www.healthcareitnews.com/) - Healthcare technology news
- MedCity News (https://medcitynews.com/) - Healthcare innovation and AI
- Healthcare AI Today (https://healthcareaitoday.com/) - AI in healthcare blog

**Research Organizations:**
- MIT Technology Review (https://www.technologyreview.com/) - AI and healthcare coverage
- Stanford Medicine (https://med.stanford.edu/) - Medical AI research
- Johns Hopkins AI in Medicine (https://ai.jhu.edu/) - Healthcare AI research

**Case Study Repositories:**
- Harvard Business Review (https://hbr.org/) - Healthcare AI case studies
- McKinsey Digital (https://www.mckinsey.com/digital) - Healthcare AI insights
- Deloitte Insights (https://www2.deloitte.com/insights/) - Healthcare AI reports
```

## Example 9: Analyzing Trends

### Scenario
You want to analyze AI trends in the finance industry over the past year.

### Prompt Usage
```json
{
  "name": "analyze-trends",
  "arguments": {
    "timeframe": "Past 12 months",
    "category": "Machine Learning",
    "industry": "Finance"
  }
}
```

### Expected Response
```
AI Trends in Finance (Past 12 months):

**Emerging Technologies:**
- Federated learning for privacy-preserving AI
- Explainable AI (XAI) for regulatory compliance
- Real-time fraud detection systems
- Automated trading algorithms
- Credit risk assessment models

**Industry Adoption Patterns:**
- 85% of major banks have implemented AI solutions
- Focus on customer experience and operational efficiency
- Increased investment in AI infrastructure
- Growing demand for AI talent in finance

**Common Challenges:**
- Regulatory compliance and explainability requirements
- Data privacy and security concerns
- Integration with legacy systems
- Bias detection and mitigation
- Model interpretability for stakeholders

**Future Trends:**
- Increased use of synthetic data for training
- AI-powered regulatory reporting
- Personalized financial services
- Blockchain-AI integration
- Quantum computing for financial modeling

**Key Success Factors:**
- Strong data governance frameworks
- Cross-functional AI teams
- Continuous model monitoring
- Stakeholder education and buy-in
- Robust testing and validation processes
```

## Example 10: Complete Workflow

### Scenario
You want to collect, analyze, and categorize a new AI use case from a website.

### Step-by-Step Process

1. **Scrape the URL:**
```json
{
  "name": "scrape-url",
  "arguments": {
    "url": "https://tech-blog.com/ai-customer-service-automation",
    "extractKeywords": true
  }
}
```

2. **Categorize the Use Case:**
```json
{
  "name": "categorize-use-case",
  "arguments": {
    "title": "AI-Powered Customer Service Automation",
    "summary": "Company implements chatbot and NLP system for customer support"
  }
}
```

3. **Add to Information Sources:**
```json
{
  "name": "add-source",
  "arguments": {
    "name": "Tech Blog AI",
    "url": "https://tech-blog.com",
    "selectors": {
      "title": "h1.post-title",
      "summary": ".post-excerpt",
      "category": ".post-category"
    }
  }
}
```

4. **Search for Similar Cases:**
```json
{
  "name": "search-use-cases",
  "arguments": {
    "query": "customer service automation",
    "category": "Natural Language Processing"
  }
}
```

This workflow demonstrates how the different tools can be combined to create a comprehensive AI use case collection and analysis system.

## Example 11: Google Search for AI Content

### Scenario
You want to discover the latest AI use cases in the financial industry using Google search.

### Tool Usage
```json
{
  "name": "google-search",
  "arguments": {
    "query": "最新のAIユースケース 金融",
    "limit": 5
  }
}
```

### Expected Response
```
「最新のAIユースケース 金融」を検索した結果 (5件/約245,000件):

**1. AIが変える金融業界の未来 - 最新の活用事例**
URL: https://example.com/ai-finance-future
概要: 金融業界でのAI活用が急速に進んでいます。不正検知、リスク管理、顧客サービス向上など...

**2. メガバンクのAI戦略 - 2024年の取り組み**
URL: https://example.com/megabank-ai-strategy
概要: 三大メガバンクがAI技術を活用した新サービスを相次いで発表。個人向け投資アドバイス...

**3. FinTech企業のAI導入事例集**
URL: https://example.com/fintech-ai-cases
概要: 新興FinTech企業がAIを活用して従来の金融サービスを革新。審査の自動化や...

💡 ヒント: これらのURLを scrape-url ツールに渡すことで、詳細な記事コンテンツを取得できます。
```

## Example 12: Site-Specific Google Search

### Scenario
You want to search for AI news specifically on a trusted news website.

### Tool Usage
```json
{
  "name": "google-search",
  "arguments": {
    "query": "人工知能 導入事例",
    "limit": 3,
    "site": "news.google.com"
  }
}
```

### Expected Response
```
「人工知能 導入事例」をnews.google.com内で検索した結果 (3件/約1,250件):

**1. トヨタ、人工知能を活用した生産システムを導入**
URL: https://news.google.com/toyota-ai-production
概要: トヨタ自動車は人工知能技術を活用した新しい生産管理システムを導入すると発表...

**2. 病院での人工知能診断システム導入事例**
URL: https://news.google.com/hospital-ai-diagnosis
概要: 都内の総合病院が画像診断にAIを導入し、診断精度の向上と医師の負担軽減を実現...

**3. 小売業界のAI活用事例 - 在庫管理の革新**
URL: https://news.google.com/retail-ai-inventory
概要: 大手小売チェーンがAI技術を導入し、需要予測と在庫管理の最適化を実現...

💡 ヒント: これらのURLを scrape-url ツールに渡すことで、詳細な記事コンテンツを取得できます。
```

## Example 13: Google Search + Scraping Integration

### Scenario
You want to discover and collect detailed information about AI healthcare applications.

### Step-by-Step Process

1. **Discover relevant content with Google Search:**
```json
{
  "name": "google-search",
  "arguments": {
    "query": "AI healthcare applications 2024",
    "limit": 3
  }
}
```

2. **Extract detailed content from found URLs:**
```json
{
  "name": "scrape-url",
  "arguments": {
    "url": "https://example.com/ai-healthcare-2024",
    "selectors": {
      "title": "h1, .article-title",
      "summary": ".summary, .abstract, .excerpt",
      "content": ".article-content, .main-content",
      "date": ".publish-date, .date",
      "author": ".author, .byline"
    },
    "extractKeywords": true
  }
}
```

3. **Categorize the discovered use case:**
```json
{
  "name": "categorize-use-case",
  "arguments": {
    "title": "AI-Powered Medical Imaging Analysis",
    "summary": "Hospital implements deep learning system for radiology diagnosis",
    "content": "The healthcare facility deployed convolutional neural networks for automated detection of abnormalities in medical scans..."
  }
}
```

### Workflow Benefits
- **Discovery**: Google search finds relevant, up-to-date content
- **Collection**: Web scraping extracts detailed information
- **Organization**: Automatic categorization structures the data
- **Analysis**: Keyword extraction identifies key technologies

## Example 14: Automated Content Collection Workflow

### Scenario
You want to build a workflow that regularly discovers and collects AI use cases.

### Complete Integration Example
```json
// Step 1: Search for latest AI content
{
  "name": "google-search",
  "arguments": {
    "query": "machine learning implementation case study 2024",
    "limit": 5
  }
}

// Step 2: For each URL in results, scrape content
{
  "name": "scrape-url", 
  "arguments": {
    "url": "{search_result_url}",
    "extractKeywords": true
  }
}

// Step 3: Categorize and analyze
{
  "name": "categorize-use-case",
  "arguments": {
    "title": "{scraped_title}",
    "summary": "{scraped_summary}"
  }
}

// Step 4: Search for similar cases
{
  "name": "search-use-cases",
  "arguments": {
    "query": "{extracted_keywords}",
    "limit": 10
  }
}
```

### Expected Benefits
- **Comprehensive Coverage**: Automatically discovers new content
- **Structured Data**: Consistent categorization and keyword extraction
- **Quality Control**: Validates findings against existing database
- **Scalability**: Can handle large volumes of content efficiently 