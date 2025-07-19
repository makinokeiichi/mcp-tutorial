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