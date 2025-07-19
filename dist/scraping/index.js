import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
export class WebScraper {
    browser = null;
    async initBrowser() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
    }
    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
    async scrapeUrl(url, selectors) {
        try {
            // Try with axios first (faster for simple pages)
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const $ = cheerio.load(response.data);
            const extractedData = {};
            // Extract data using provided selectors
            for (const [key, selector] of Object.entries(selectors)) {
                const element = $(selector);
                if (element.length > 0) {
                    extractedData[key] = element.text().trim();
                }
            }
            return {
                url,
                title: extractedData.title || 'Unknown Title',
                content: $('body').text().substring(0, 5000), // Limit content length
                extractedData,
                success: true,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            // Fallback to Puppeteer for JavaScript-heavy pages
            try {
                await this.initBrowser();
                const page = await this.browser.newPage();
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
                await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
                const extractedData = {};
                // Extract data using provided selectors
                for (const [key, selector] of Object.entries(selectors)) {
                    try {
                        const element = await page.$(selector);
                        if (element) {
                            const text = await page.evaluate((el) => el.textContent?.trim() || '', element);
                            extractedData[key] = text;
                        }
                    }
                    catch (e) {
                        console.warn(`Failed to extract ${key} with selector ${selector}:`, e);
                    }
                }
                const content = await page.evaluate(() => document.body.textContent || '');
                await page.close();
                return {
                    url,
                    title: extractedData.title || 'Unknown Title',
                    content: content.substring(0, 5000),
                    extractedData,
                    success: true,
                    timestamp: new Date().toISOString()
                };
            }
            catch (puppeteerError) {
                return {
                    url,
                    title: 'Error',
                    content: '',
                    extractedData: {},
                    success: false,
                    error: `Failed to scrape: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    timestamp: new Date().toISOString()
                };
            }
        }
    }
    async scrapeMultipleUrls(configs) {
        const results = [];
        for (const config of configs) {
            if (!config.enabled)
                continue;
            try {
                const result = await this.scrapeUrl(config.url, config.selectors);
                results.push(result);
                // Add delay to be respectful to servers
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            catch (error) {
                results.push({
                    url: config.url,
                    title: 'Error',
                    content: '',
                    extractedData: {},
                    success: false,
                    error: `Failed to scrape ${config.url}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    timestamp: new Date().toISOString()
                });
            }
        }
        return results;
    }
    async scrapeWithRetry(url, selectors, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.scrapeUrl(url, selectors);
            }
            catch (error) {
                if (attempt === maxRetries) {
                    return {
                        url,
                        title: 'Error',
                        content: '',
                        extractedData: {},
                        success: false,
                        error: `Failed after ${maxRetries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        timestamp: new Date().toISOString()
                    };
                }
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
            }
        }
        throw new Error('Unexpected error in scrapeWithRetry');
    }
}
//# sourceMappingURL=index.js.map