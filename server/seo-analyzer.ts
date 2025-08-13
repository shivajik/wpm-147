import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

export interface SeoAnalysisResult {
  url: string;
  domain: string;
  title: string;
  metaDescription: string;
  h1Tags: string[];
  h2Tags: string[];
  h3Tags: string[];
  pageContent: {
    wordCount: number;
    readabilityScore: number;
    keywordDensity: { [key: string]: number };
  };
  technicalSeo: {
    hasRobotsTxt: boolean;
    hasSitemap: boolean;
    hasSSL: boolean;
    responseTime: number;
    statusCode: number;
    isResponsive: boolean;
    hasValidStructuredData: boolean;
  };
  images: {
    total: number;
    withAlt: number;
    missingAlt: number;
    oversized: number;
  };
  links: {
    internal: number;
    external: number;
    broken: number;
  };
  performance: {
    loadTime: number;
    pageSize: number;
    requests: number;
  };
  socialMeta: {
    hasOpenGraph: boolean;
    hasTwitterCards: boolean;
    hasFacebookMeta: boolean;
  };
  accessibility: {
    score: number;
    issues: string[];
  };
}

export class SeoAnalyzer {
  private userAgent = 'Mozilla/5.0 (compatible; SEO-Analyzer/1.0)';
  
  async analyzeSite(url: string): Promise<SeoAnalysisResult> {
    console.log(`[SEO-ANALYZER] Starting comprehensive analysis for: ${url}`);
    
    const startTime = Date.now();
    let html: string;
    let statusCode: number;
    let responseTime: number;
    
    try {
      // Fetch the page
      const response = await axios.get(url, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 30000, // 30 seconds
        maxRedirects: 5,
        validateStatus: (status) => status < 500 // Accept all non-server errors
      });
      
      html = response.data;
      statusCode = response.status;
      responseTime = Date.now() - startTime;
    } catch (error) {
      console.error(`[SEO-ANALYZER] Error fetching ${url}:`, error);
      throw new Error(`Failed to fetch website: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const $ = cheerio.load(html);
    const parsedUrl = new URL(url);
    
    // Analyze page structure and content
    const result: SeoAnalysisResult = {
      url,
      domain: parsedUrl.hostname,
      title: $('title').first().text().trim() || '',
      metaDescription: $('meta[name="description"]').attr('content') || '',
      h1Tags: this.extractHeadings($, 'h1'),
      h2Tags: this.extractHeadings($, 'h2'),
      h3Tags: this.extractHeadings($, 'h3'),
      
      pageContent: await this.analyzeContent($, html),
      technicalSeo: await this.analyzeTechnicalSeo($, url, statusCode, responseTime),
      images: this.analyzeImages($),
      links: await this.analyzeLinks($, url),
      performance: this.analyzePerformance(html, responseTime),
      socialMeta: this.analyzeSocialMeta($),
      accessibility: this.analyzeAccessibility($)
    };

    console.log(`[SEO-ANALYZER] Analysis completed in ${Date.now() - startTime}ms`);
    return result;
  }

  private extractHeadings($: cheerio.CheerioAPI, tag: string): string[] {
    const headings: string[] = [];
    $(tag).each((_, el) => {
      const text = $(el).text().trim();
      if (text) headings.push(text);
    });
    return headings;
  }

  private async analyzeContent($: cheerio.CheerioAPI, html: string) {
    // Remove script and style content
    $('script, style, nav, footer, aside').remove();
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();
    
    const words = textContent.split(/\s+/).filter(word => word.length > 2);
    const wordCount = words.length;
    
    // Simple readability score (Flesch Reading Ease approximation)
    const sentences = textContent.split(/[.!?]+/).length;
    const avgWordsPerSentence = sentences > 0 ? wordCount / sentences : 0;
    const avgSyllablesPerWord = this.estimateAverageSyllables(words);
    const readabilityScore = Math.max(0, Math.min(100, 
      206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    ));

    // Keyword density analysis
    const keywordDensity = this.calculateKeywordDensity(words);

    return {
      wordCount,
      readabilityScore: Math.round(readabilityScore),
      keywordDensity
    };
  }

  private estimateAverageSyllables(words: string[]): number {
    if (words.length === 0) return 0;
    
    const totalSyllables = words.reduce((total, word) => {
      return total + this.countSyllables(word.toLowerCase());
    }, 0);
    
    return totalSyllables / words.length;
  }

  private countSyllables(word: string): number {
    // Simple syllable counting algorithm
    word = word.toLowerCase();
    let syllables = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const isVowel = 'aeiouy'.includes(char);
      
      if (isVowel && !previousWasVowel) {
        syllables++;
      }
      previousWasVowel = isVowel;
    }
    
    // Adjust for silent e
    if (word.endsWith('e')) syllables--;
    
    return Math.max(1, syllables);
  }

  private calculateKeywordDensity(words: string[]): { [key: string]: number } {
    const wordFreq: { [key: string]: number } = {};
    const totalWords = words.length;
    
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 3) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });

    // Get top keywords and their density
    const sortedKeywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const density: { [key: string]: number } = {};
    sortedKeywords.forEach(([word, freq]) => {
      density[word] = Math.round((freq / totalWords) * 1000) / 10; // Percentage with 1 decimal
    });

    return density;
  }

  private async analyzeTechnicalSeo($: cheerio.CheerioAPI, url: string, statusCode: number, responseTime: number) {
    const parsedUrl = new URL(url);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    
    // Check robots.txt
    let hasRobotsTxt = false;
    try {
      const robotsResponse = await axios.head(`${baseUrl}/robots.txt`, { timeout: 5000 });
      hasRobotsTxt = robotsResponse.status === 200;
    } catch (error) {
      // Robots.txt not found or inaccessible
    }

    // Check sitemap
    let hasSitemap = false;
    const sitemapUrls = [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap_index.xml`,
      `${baseUrl}/wp-sitemap.xml`
    ];

    for (const sitemapUrl of sitemapUrls) {
      try {
        const sitemapResponse = await axios.head(sitemapUrl, { timeout: 5000 });
        if (sitemapResponse.status === 200) {
          hasSitemap = true;
          break;
        }
      } catch (error) {
        // Continue checking other sitemap locations
      }
    }

    // Check for structured data
    const hasValidStructuredData = $('script[type="application/ld+json"]').length > 0 ||
                                  $('[itemscope]').length > 0 ||
                                  $('meta[property^="og:"]').length > 0;

    return {
      hasRobotsTxt,
      hasSitemap,
      hasSSL: parsedUrl.protocol === 'https:',
      responseTime,
      statusCode,
      isResponsive: $('meta[name="viewport"]').length > 0,
      hasValidStructuredData
    };
  }

  private analyzeImages($: cheerio.CheerioAPI) {
    const images = $('img');
    let withAlt = 0;
    let oversized = 0;

    images.each((_, img) => {
      const $img = $(img);
      if ($img.attr('alt')?.trim()) {
        withAlt++;
      }

      // Check for potentially oversized images (basic heuristic)
      const src = $img.attr('src');
      if (src && (src.includes('2048') || src.includes('1920') || src.includes('4k'))) {
        oversized++;
      }
    });

    return {
      total: images.length,
      withAlt,
      missingAlt: images.length - withAlt,
      oversized
    };
  }

  private async analyzeLinks($: cheerio.CheerioAPI, baseUrl: string) {
    const links = $('a[href]');
    let internal = 0;
    let external = 0;
    let broken = 0;

    const parsedBaseUrl = new URL(baseUrl);
    const checkedUrls = new Set<string>();

    links.each((_, link) => {
      const href = $(link).attr('href');
      if (!href) return;

      try {
        // Skip anchor links, mailto, tel, etc.
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
          return;
        }

        let linkUrl: URL;
        if (href.startsWith('http')) {
          linkUrl = new URL(href);
        } else {
          linkUrl = new URL(href, baseUrl);
        }

        if (linkUrl.hostname === parsedBaseUrl.hostname) {
          internal++;
        } else {
          external++;
        }
      } catch (error) {
        // Invalid URL
        broken++;
      }
    });

    return { internal, external, broken };
  }

  private analyzePerformance(html: string, responseTime: number) {
    const pageSize = Buffer.byteLength(html, 'utf8');
    
    // Estimate resource requests (basic heuristic)
    const scriptMatches = html.match(/<script[^>]*src=/g) || [];
    const styleMatches = html.match(/<link[^>]*stylesheet/g) || [];
    const imageMatches = html.match(/<img[^>]*src=/g) || [];
    
    const requests = 1 + scriptMatches.length + styleMatches.length + imageMatches.length;

    return {
      loadTime: responseTime,
      pageSize: Math.round(pageSize / 1024), // KB
      requests
    };
  }

  private analyzeSocialMeta($: cheerio.CheerioAPI) {
    const hasOpenGraph = $('meta[property^="og:"]').length > 0;
    const hasTwitterCards = $('meta[name^="twitter:"]').length > 0;
    const hasFacebookMeta = $('meta[property^="fb:"]').length > 0;

    return {
      hasOpenGraph,
      hasTwitterCards,
      hasFacebookMeta
    };
  }

  private analyzeAccessibility($: cheerio.CheerioAPI) {
    const issues: string[] = [];
    let score = 100;

    // Check for missing alt attributes
    const imagesWithoutAlt = $('img:not([alt])').length;
    if (imagesWithoutAlt > 0) {
      issues.push(`${imagesWithoutAlt} images missing alt attributes`);
      score -= Math.min(30, imagesWithoutAlt * 3);
    }

    // Check for missing form labels
    const inputsWithoutLabels = $('input:not([type="hidden"]):not([aria-label]):not([aria-labelledby])').length;
    if (inputsWithoutLabels > 0) {
      issues.push(`${inputsWithoutLabels} form inputs without proper labels`);
      score -= Math.min(20, inputsWithoutLabels * 5);
    }

    // Check for missing page language
    if (!$('html[lang]').length) {
      issues.push('Missing language declaration in HTML tag');
      score -= 10;
    }

    // Check for low contrast (basic check for common patterns)
    const lowContrastElements = $('*[style*="color:#ccc"], *[style*="color:lightgray"]').length;
    if (lowContrastElements > 0) {
      issues.push('Potential low contrast text detected');
      score -= 15;
    }

    return {
      score: Math.max(0, score),
      issues
    };
  }

  generateSeoScores(analysis: SeoAnalysisResult): {
    overall: number;
    technical: number;
    content: number;
    performance: number;
    accessibility: number;
    social: number;
  } {
    // Technical SEO score
    let technical = 0;
    technical += analysis.technicalSeo.hasSSL ? 20 : 0;
    technical += analysis.technicalSeo.hasRobotsTxt ? 15 : 0;
    technical += analysis.technicalSeo.hasSitemap ? 15 : 0;
    technical += analysis.technicalSeo.isResponsive ? 15 : 0;
    technical += analysis.technicalSeo.hasValidStructuredData ? 15 : 0;
    technical += analysis.technicalSeo.statusCode === 200 ? 20 : 0;

    // Content score
    let content = 0;
    content += analysis.title ? 20 : 0;
    content += analysis.metaDescription ? 20 : 0;
    content += analysis.h1Tags.length > 0 ? 15 : 0;
    content += analysis.pageContent.wordCount > 300 ? 20 : Math.max(0, analysis.pageContent.wordCount / 15);
    content += analysis.pageContent.readabilityScore > 60 ? 15 : Math.max(0, analysis.pageContent.readabilityScore / 4);
    content += analysis.images.missingAlt === 0 ? 10 : Math.max(0, 10 - analysis.images.missingAlt);

    // Performance score
    let performance = 0;
    performance += analysis.technicalSeo.responseTime < 1000 ? 30 : Math.max(0, 30 - (analysis.technicalSeo.responseTime - 1000) / 100);
    performance += analysis.performance.pageSize < 1000 ? 25 : Math.max(0, 25 - (analysis.performance.pageSize - 1000) / 100);
    performance += analysis.performance.requests < 50 ? 20 : Math.max(0, 20 - (analysis.performance.requests - 50));
    performance += analysis.images.oversized === 0 ? 25 : Math.max(0, 25 - analysis.images.oversized * 5);

    // Social media score
    let social = 0;
    social += analysis.socialMeta.hasOpenGraph ? 40 : 0;
    social += analysis.socialMeta.hasTwitterCards ? 30 : 0;
    social += analysis.socialMeta.hasFacebookMeta ? 30 : 0;

    const overall = Math.round((technical + content + performance + analysis.accessibility.score + social) / 5);

    return {
      overall: Math.min(100, overall),
      technical: Math.min(100, Math.round(technical)),
      content: Math.min(100, Math.round(content)),
      performance: Math.min(100, Math.round(performance)),
      accessibility: Math.round(analysis.accessibility.score),
      social: Math.min(100, Math.round(social))
    };
  }

  generateRecommendations(analysis: SeoAnalysisResult): string[] {
    const recommendations: string[] = [];
    const scores = this.generateSeoScores(analysis);

    // Technical recommendations
    if (!analysis.technicalSeo.hasSSL) {
      recommendations.push('🔒 Install SSL certificate to secure your website and improve search rankings');
    }
    if (!analysis.technicalSeo.hasRobotsTxt) {
      recommendations.push('🤖 Create a robots.txt file to guide search engine crawlers');
    }
    if (!analysis.technicalSeo.hasSitemap) {
      recommendations.push('🗺️ Generate and submit an XML sitemap to search engines');
    }
    if (!analysis.technicalSeo.isResponsive) {
      recommendations.push('📱 Add mobile viewport meta tag for responsive design');
    }

    // Content recommendations
    if (!analysis.title) {
      recommendations.push('📝 Add a descriptive title tag to your page');
    } else if (analysis.title.length < 30 || analysis.title.length > 60) {
      recommendations.push('📝 Optimize title tag length (30-60 characters recommended)');
    }
    if (!analysis.metaDescription) {
      recommendations.push('📄 Add a compelling meta description (150-160 characters)');
    }
    if (analysis.h1Tags.length === 0) {
      recommendations.push('🏷️ Add H1 heading tag for better content structure');
    }
    if (analysis.h1Tags.length > 1) {
      recommendations.push('🏷️ Use only one H1 tag per page for optimal SEO');
    }

    // Content quality recommendations
    if (analysis.pageContent.wordCount < 300) {
      recommendations.push('✍️ Increase content length - aim for at least 300 words');
    }
    if (analysis.pageContent.readabilityScore < 60) {
      recommendations.push('📖 Improve content readability with shorter sentences and simpler words');
    }

    // Image recommendations
    if (analysis.images.missingAlt > 0) {
      recommendations.push(`🖼️ Add alt text to ${analysis.images.missingAlt} images for accessibility and SEO`);
    }
    if (analysis.images.oversized > 0) {
      recommendations.push(`⚡ Optimize ${analysis.images.oversized} oversized images for better performance`);
    }

    // Performance recommendations
    if (analysis.technicalSeo.responseTime > 3000) {
      recommendations.push('🚀 Improve server response time - currently over 3 seconds');
    }
    if (analysis.performance.pageSize > 2000) {
      recommendations.push('📦 Reduce page size - consider compressing resources');
    }
    if (analysis.performance.requests > 100) {
      recommendations.push('🔗 Reduce HTTP requests by combining CSS/JS files');
    }

    // Social media recommendations
    if (!analysis.socialMeta.hasOpenGraph) {
      recommendations.push('👥 Add Open Graph meta tags for better social media sharing');
    }
    if (!analysis.socialMeta.hasTwitterCards) {
      recommendations.push('🐦 Add Twitter Card meta tags for enhanced Twitter sharing');
    }

    // Accessibility recommendations
    analysis.accessibility.issues.forEach(issue => {
      recommendations.push(`♿ ${issue}`);
    });

    // Structure recommendations
    if (!analysis.technicalSeo.hasValidStructuredData) {
      recommendations.push('🏗️ Add structured data markup (Schema.org) for rich snippets');
    }

    return recommendations.slice(0, 12); // Return top 12 recommendations
  }
}