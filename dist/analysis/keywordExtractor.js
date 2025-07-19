import natural from 'natural';
export class KeywordExtractor {
    tokenizer;
    stopWords;
    constructor() {
        this.tokenizer = new natural.WordTokenizer();
        this.stopWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
            'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
            'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
            'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
            'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'his', 'hers', 'ours', 'theirs',
            'what', 'when', 'where', 'who', 'whom', 'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
            'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
            'too', 'very', 'just', 'now', 'then', 'here', 'there', 'when', 'where', 'why', 'how'
        ]);
    }
    extractKeywords(text, maxKeywords = 10, category) {
        // Tokenize and clean text
        const tokens = this.tokenizer.tokenize(text.toLowerCase()) || [];
        const cleanedTokens = tokens.filter(token => token &&
            token.length > 2 &&
            !this.stopWords.has(token) &&
            /^[a-zA-Z]+$/.test(token) // Only alphabetic tokens
        );
        // Count frequency
        const frequency = {};
        for (const token of cleanedTokens) {
            frequency[token] = (frequency[token] || 0) + 1;
        }
        // Sort by frequency and return top keywords
        const sortedKeywords = Object.entries(frequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, maxKeywords)
            .map(([keyword]) => keyword);
        return sortedKeywords;
    }
    extractAIKeywords(text, maxKeywords = 15) {
        // AI-specific keywords and their variations
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
            'api', 'rest', 'graphql', 'microservices', 'serverless', 'lambda', 'sagemaker', 'vertex ai',
            'databricks', 'snowflake', 'redshift', 'bigquery', 'elasticsearch', 'redis', 'mongodb',
            'postgresql', 'mysql', 'sql', 'nosql', 'data warehouse', 'data lake', 'etl', 'elt',
            'real-time', 'streaming', 'batch processing', 'online learning', 'offline learning'
        ];
        const tokens = this.tokenizer.tokenize(text.toLowerCase()) || [];
        const foundKeywords = [];
        // Check for multi-word AI keywords
        for (const keyword of aiKeywords) {
            if (text.toLowerCase().includes(keyword)) {
                foundKeywords.push(keyword);
            }
        }
        // Also extract single-word technical terms
        const technicalTerms = tokens.filter(token => token &&
            token.length > 3 &&
            !this.stopWords.has(token) &&
            /^[a-zA-Z]+$/.test(token));
        // Combine and return unique keywords
        const allKeywords = [...foundKeywords, ...technicalTerms];
        const uniqueKeywords = [...new Set(allKeywords)];
        return uniqueKeywords.slice(0, maxKeywords);
    }
    categorizeUseCase(title, summary, content) {
        const fullText = `${title} ${summary} ${content || ''}`.toLowerCase();
        const categories = {
            'Natural Language Processing': [
                'nlp', 'natural language', 'text', 'language', 'translation', 'sentiment', 'semantic',
                'chatbot', 'conversation', 'dialogue', 'speech', 'voice', 'transcription', 'bert', 'gpt',
                'transformer', 'text generation', 'text classification', 'named entity recognition'
            ],
            'Computer Vision': [
                'computer vision', 'cv', 'image', 'video', 'recognition', 'detection', 'segmentation',
                'object detection', 'face recognition', 'optical character recognition', 'ocr', 'cnn',
                'convolutional', 'image processing', 'video analysis', 'surveillance', 'medical imaging'
            ],
            'Machine Learning': [
                'machine learning', 'ml', 'algorithm', 'model', 'training', 'prediction', 'classification',
                'regression', 'clustering', 'recommendation', 'optimization', 'supervised', 'unsupervised',
                'reinforcement learning', 'deep learning', 'neural network', 'random forest', 'svm'
            ],
            'Robotics & Automation': [
                'robotics', 'automation', 'robot', 'autonomous', 'control', 'sensor', 'actuator',
                'industrial automation', 'manufacturing', 'warehouse', 'logistics', 'supply chain',
                'quality control', 'inspection', 'assembly', 'pick and place'
            ],
            'Data Analytics': [
                'analytics', 'data analysis', 'business intelligence', 'bi', 'dashboard', 'reporting',
                'visualization', 'kpi', 'metrics', 'forecasting', 'trend analysis', 'data mining',
                'statistical analysis', 'correlation', 'regression analysis'
            ],
            'Healthcare & Medical': [
                'healthcare', 'medical', 'diagnosis', 'treatment', 'patient', 'clinical', 'drug',
                'pharmaceutical', 'imaging', 'radiology', 'pathology', 'genomics', 'bioinformatics',
                'telemedicine', 'health monitoring', 'disease prediction'
            ],
            'Finance & Banking': [
                'finance', 'banking', 'financial', 'investment', 'trading', 'risk', 'fraud',
                'credit', 'loan', 'insurance', 'compliance', 'regulatory', 'audit', 'portfolio',
                'market analysis', 'algorithmic trading'
            ],
            'E-commerce & Retail': [
                'e-commerce', 'retail', 'shopping', 'product', 'inventory', 'pricing', 'recommendation',
                'customer', 'sales', 'marketing', 'advertising', 'personalization', 'supply chain',
                'logistics', 'fulfillment', 'customer service'
            ],
            'Transportation & Logistics': [
                'transportation', 'logistics', 'delivery', 'route', 'optimization', 'fleet',
                'autonomous vehicle', 'self-driving', 'traffic', 'navigation', 'gps', 'tracking',
                'supply chain', 'warehouse', 'inventory'
            ],
            'Education & Training': [
                'education', 'learning', 'training', 'student', 'course', 'curriculum', 'assessment',
                'personalized learning', 'adaptive', 'tutoring', 'skill development', 'certification',
                'online learning', 'edtech', 'educational technology'
            ]
        };
        let bestCategory = 'Other';
        let maxScore = 0;
        for (const [category, keywords] of Object.entries(categories)) {
            let score = 0;
            for (const keyword of keywords) {
                if (fullText.includes(keyword)) {
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
    suggestIndustry(category, keywords) {
        const industryMap = {
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
                return industries[0]; // Return first industry for the category
            }
        }
        // Fallback based on keywords
        const keywordIndustryMap = {
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
        return 'Technology'; // Default fallback
    }
}
//# sourceMappingURL=keywordExtractor.js.map