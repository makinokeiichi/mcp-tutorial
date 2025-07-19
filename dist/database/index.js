import sqlite3 from 'sqlite3';
export class Database {
    db;
    constructor(dbPath = 'ai_use_cases.db') {
        this.db = new sqlite3.Database(dbPath);
        this.initDatabase();
    }
    async initDatabase() {
        const run = (sql, params) => {
            return new Promise((resolve, reject) => {
                this.db.run(sql, params, function (err) {
                    if (err)
                        reject(err);
                    else
                        resolve(this);
                });
            });
        };
        const all = (sql, params) => {
            return new Promise((resolve, reject) => {
                this.db.all(sql, params, (err, rows) => {
                    if (err)
                        reject(err);
                    else
                        resolve(rows);
                });
            });
        };
        // Create tables
        await run(`
      CREATE TABLE IF NOT EXISTS ai_use_cases (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        source_url TEXT NOT NULL,
        category TEXT NOT NULL,
        industry TEXT,
        technology_keywords TEXT NOT NULL,
        publication_date TEXT,
        company TEXT,
        implementation_details TEXT,
        results TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
        await run(`
      CREATE TABLE IF NOT EXISTS scraping_configs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        selectors TEXT NOT NULL,
        enabled INTEGER DEFAULT 1,
        last_scraped TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
        await run(`
      CREATE TABLE IF NOT EXISTS keyword_configs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        keywords TEXT NOT NULL,
        category TEXT NOT NULL,
        enabled INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
        await run(`
      CREATE TABLE IF NOT EXISTS scraping_results (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        extracted_data TEXT NOT NULL,
        success INTEGER NOT NULL,
        error TEXT,
        timestamp TEXT NOT NULL
      )
    `);
        // Create indexes
        await run('CREATE INDEX IF NOT EXISTS idx_use_cases_category ON ai_use_cases(category)');
        await run('CREATE INDEX IF NOT EXISTS idx_use_cases_industry ON ai_use_cases(industry)');
        await run('CREATE INDEX IF NOT EXISTS idx_use_cases_created_at ON ai_use_cases(created_at)');
        await run('CREATE INDEX IF NOT EXISTS idx_scraping_configs_enabled ON scraping_configs(enabled)');
    }
    // AI Use Cases
    async insertUseCase(useCase) {
        const run = (sql, params) => {
            return new Promise((resolve, reject) => {
                this.db.run(sql, params, function (err) {
                    if (err)
                        reject(err);
                    else
                        resolve(this);
                });
            });
        };
        await run(`INSERT OR REPLACE INTO ai_use_cases 
       (id, title, summary, source_url, category, industry, technology_keywords, 
        publication_date, company, implementation_details, results, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            useCase.id,
            useCase.title,
            useCase.summary,
            useCase.sourceUrl,
            useCase.category,
            useCase.industry,
            JSON.stringify(useCase.technologyKeywords),
            useCase.publicationDate,
            useCase.company,
            useCase.implementationDetails,
            useCase.results,
            useCase.createdAt,
            useCase.updatedAt
        ]);
    }
    async getUseCase(id) {
        const get = (sql, params) => {
            return new Promise((resolve, reject) => {
                this.db.get(sql, params, (err, row) => {
                    if (err)
                        reject(err);
                    else
                        resolve(row);
                });
            });
        };
        const row = await get('SELECT * FROM ai_use_cases WHERE id = ?', [id]);
        if (!row)
            return null;
        return {
            id: row.id,
            title: row.title,
            summary: row.summary,
            sourceUrl: row.source_url,
            category: row.category,
            industry: row.industry,
            technologyKeywords: JSON.parse(row.technology_keywords),
            publicationDate: row.publication_date,
            company: row.company,
            implementationDetails: row.implementation_details,
            results: row.results,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }
    async searchUseCases(query, filters = {}) {
        const all = (sql, params) => {
            return new Promise((resolve, reject) => {
                this.db.all(sql, params, (err, rows) => {
                    if (err)
                        reject(err);
                    else
                        resolve(rows);
                });
            });
        };
        let sql = `
      SELECT * FROM ai_use_cases 
      WHERE (title LIKE ? OR summary LIKE ? OR technology_keywords LIKE ?)
    `;
        const params = [`%${query}%`, `%${query}%`, `%${query}%`];
        if (filters.category) {
            sql += ' AND category = ?';
            params.push(filters.category);
        }
        if (filters.industry) {
            sql += ' AND industry = ?';
            params.push(filters.industry);
        }
        if (filters.technology) {
            sql += ' AND technology_keywords LIKE ?';
            params.push(`%${filters.technology}%`);
        }
        sql += ' ORDER BY created_at DESC LIMIT ?';
        params.push(filters.limit || 20);
        const rows = await all(sql, params);
        return rows.map(row => ({
            id: row.id,
            title: row.title,
            summary: row.summary,
            sourceUrl: row.source_url,
            category: row.category,
            industry: row.industry,
            technologyKeywords: JSON.parse(row.technology_keywords),
            publicationDate: row.publication_date,
            company: row.company,
            implementationDetails: row.implementation_details,
            results: row.results,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
    }
    async getAllUseCases(limit = 100) {
        const all = (sql, params) => {
            return new Promise((resolve, reject) => {
                this.db.all(sql, params, (err, rows) => {
                    if (err)
                        reject(err);
                    else
                        resolve(rows);
                });
            });
        };
        const rows = await all('SELECT * FROM ai_use_cases ORDER BY created_at DESC LIMIT ?', [limit]);
        return rows.map(row => ({
            id: row.id,
            title: row.title,
            summary: row.summary,
            sourceUrl: row.source_url,
            category: row.category,
            industry: row.industry,
            technologyKeywords: JSON.parse(row.technology_keywords),
            publicationDate: row.publication_date,
            company: row.company,
            implementationDetails: row.implementation_details,
            results: row.results,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
    }
    // Scraping Configs
    async insertScrapingConfig(config) {
        const run = (sql, params) => {
            return new Promise((resolve, reject) => {
                this.db.run(sql, params, function (err) {
                    if (err)
                        reject(err);
                    else
                        resolve(this);
                });
            });
        };
        await run(`INSERT OR REPLACE INTO scraping_configs 
       (id, name, url, selectors, enabled, last_scraped, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            config.id,
            config.name,
            config.url,
            JSON.stringify(config.selectors),
            config.enabled ? 1 : 0,
            config.lastScraped,
            config.createdAt,
            config.updatedAt
        ]);
    }
    async getScrapingConfigs() {
        const all = (sql, params) => {
            return new Promise((resolve, reject) => {
                this.db.all(sql, params, (err, rows) => {
                    if (err)
                        reject(err);
                    else
                        resolve(rows);
                });
            });
        };
        const rows = await all('SELECT * FROM scraping_configs WHERE enabled = 1');
        return rows.map(row => ({
            id: row.id,
            name: row.name,
            url: row.url,
            selectors: JSON.parse(row.selectors),
            enabled: Boolean(row.enabled),
            lastScraped: row.last_scraped,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
    }
    async updateScrapingConfigLastScraped(id, timestamp) {
        const run = (sql, params) => {
            return new Promise((resolve, reject) => {
                this.db.run(sql, params, function (err) {
                    if (err)
                        reject(err);
                    else
                        resolve(this);
                });
            });
        };
        await run('UPDATE scraping_configs SET last_scraped = ? WHERE id = ?', [timestamp, id]);
    }
    // Keyword Configs
    async insertKeywordConfig(config) {
        const run = (sql, params) => {
            return new Promise((resolve, reject) => {
                this.db.run(sql, params, function (err) {
                    if (err)
                        reject(err);
                    else
                        resolve(this);
                });
            });
        };
        await run(`INSERT OR REPLACE INTO keyword_configs 
       (id, name, keywords, category, enabled, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            config.id,
            config.name,
            JSON.stringify(config.keywords),
            config.category,
            config.enabled ? 1 : 0,
            config.createdAt,
            config.updatedAt
        ]);
    }
    async getKeywordConfigs() {
        const all = (sql, params) => {
            return new Promise((resolve, reject) => {
                this.db.all(sql, params, (err, rows) => {
                    if (err)
                        reject(err);
                    else
                        resolve(rows);
                });
            });
        };
        const rows = await all('SELECT * FROM keyword_configs WHERE enabled = 1');
        return rows.map(row => ({
            id: row.id,
            name: row.name,
            keywords: JSON.parse(row.keywords),
            category: row.category,
            enabled: Boolean(row.enabled),
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
    }
    // Scraping Results
    async insertScrapingResult(result) {
        const run = (sql, params) => {
            return new Promise((resolve, reject) => {
                this.db.run(sql, params, function (err) {
                    if (err)
                        reject(err);
                    else
                        resolve(this);
                });
            });
        };
        await run(`INSERT OR REPLACE INTO scraping_results 
       (id, url, title, content, extracted_data, success, error, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            result.url, // Using URL as ID for simplicity
            result.url,
            result.title,
            result.content,
            JSON.stringify(result.extractedData),
            result.success ? 1 : 0,
            result.error,
            result.timestamp
        ]);
    }
    async getScrapingResults(limit = 50) {
        const all = (sql, params) => {
            return new Promise((resolve, reject) => {
                this.db.all(sql, params, (err, rows) => {
                    if (err)
                        reject(err);
                    else
                        resolve(rows);
                });
            });
        };
        const rows = await all('SELECT * FROM scraping_results ORDER BY timestamp DESC LIMIT ?', [limit]);
        return rows.map(row => ({
            url: row.url,
            title: row.title,
            content: row.content,
            extractedData: JSON.parse(row.extracted_data),
            success: Boolean(row.success),
            error: row.error,
            timestamp: row.timestamp
        }));
    }
    // Statistics
    async getStatistics() {
        const get = (sql, params) => {
            return new Promise((resolve, reject) => {
                this.db.get(sql, params, (err, row) => {
                    if (err)
                        reject(err);
                    else
                        resolve(row);
                });
            });
        };
        const all = (sql, params) => {
            return new Promise((resolve, reject) => {
                this.db.all(sql, params, (err, rows) => {
                    if (err)
                        reject(err);
                    else
                        resolve(rows);
                });
            });
        };
        // Get total counts
        const useCaseCount = await get('SELECT COUNT(*) as count FROM ai_use_cases');
        const sourceCount = await get('SELECT COUNT(*) as count FROM scraping_configs WHERE enabled = 1');
        // Get category distribution
        const categoryRows = await all('SELECT category, COUNT(*) as count FROM ai_use_cases GROUP BY category');
        const categories = {};
        categoryRows.forEach(row => {
            categories[row.category] = row.count;
        });
        // Get industry distribution
        const industryRows = await all('SELECT industry, COUNT(*) as count FROM ai_use_cases WHERE industry IS NOT NULL GROUP BY industry');
        const industries = {};
        industryRows.forEach(row => {
            industries[row.industry] = row.count;
        });
        return {
            totalUseCases: useCaseCount?.count || 0,
            totalSources: sourceCount?.count || 0,
            categories,
            industries
        };
    }
    async close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
}
//# sourceMappingURL=index.js.map