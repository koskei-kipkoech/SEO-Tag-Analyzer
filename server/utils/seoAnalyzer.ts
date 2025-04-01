import * as cheerio from 'cheerio';
import type { SeoAnalysisResult, MetaTagType, OgTagType, TwitterTagType } from '@shared/schema';

/**
 * Analyzes HTML content and extracts SEO-related metadata
 */
export async function analyzeSeo(url: string, html: string): Promise<SeoAnalysisResult> {
  const $ = cheerio.load(html);
  const normalizedUrl = normalizeUrl(url);
  
  // Extract basic meta information
  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content');
  const canonical = $('link[rel="canonical"]').attr('href');
  const robots = $('meta[name="robots"]').attr('content');
  const viewport = $('meta[name="viewport"]').attr('content');
  const charset = $('meta[charset]').attr('charset') || $('meta[http-equiv="Content-Type"]').attr('content');
  const language = $('html').attr('lang');
  
  // Extract Open Graph tags
  const ogTags: OgTagType[] = [];
  $('meta[property^="og:"]').each((_, el) => {
    const property = $(el).attr('property') || '';
    const content = $(el).attr('content') || '';
    if (property && content) {
      ogTags.push({ property, content });
    }
  });
  
  // Extract Twitter Card tags
  const twitterTags: TwitterTagType[] = [];
  $('meta[name^="twitter:"]').each((_, el) => {
    const name = $(el).attr('name') || '';
    const content = $(el).attr('content') || '';
    if (name && content) {
      twitterTags.push({ name, content });
    }
  });
  
  // Analyze meta tags and assign scores
  const metaTags: MetaTagType[] = [];
  
  // Title tag analysis
  if (title) {
    const titleLength = title.length;
    let titleScore = 100;
    let titleStatus: 'good' | 'warning' | 'error' | 'info' = 'good';
    let recommendation;
    
    if (titleLength < 30) {
      titleScore = 60;
      titleStatus = 'warning';
      recommendation = 'Title is too short. Aim for 50-60 characters for optimal display in search results.';
    } else if (titleLength > 60) {
      titleScore = 70;
      titleStatus = 'warning';
      recommendation = 'Title is too long and may be truncated in search results. Aim for 50-60 characters.';
    }
    
    metaTags.push({
      name: 'Title',
      content: title,
      score: titleScore,
      status: titleStatus,
      recommendation
    });
  } else {
    metaTags.push({
      name: 'Title',
      content: '',
      score: 0,
      status: 'error',
      recommendation: 'Missing title tag. The title is crucial for SEO and user experience.'
    });
  }
  
  // Description tag analysis
  if (description) {
    const descLength = description.length;
    let descScore = 100;
    let descStatus: 'good' | 'warning' | 'error' | 'info' = 'good';
    let recommendation;
    
    if (descLength < 70) {
      descScore = 60;
      descStatus = 'warning';
      recommendation = 'Description is too short. Aim for 120-158 characters for optimal display in search results.';
    } else if (descLength > 160) {
      descScore = 70;
      descStatus = 'warning';
      recommendation = 'Description is too long and may be truncated in search results. Aim for 120-158 characters.';
    }
    
    metaTags.push({
      name: 'Description',
      content: description,
      score: descScore,
      status: descStatus,
      recommendation
    });
  } else {
    metaTags.push({
      name: 'Description',
      content: '',
      score: 0,
      status: 'error',
      recommendation: 'Missing meta description. This is important for SEO and click-through rates from search results.'
    });
  }
  
  // Canonical URL analysis
  if (canonical) {
    metaTags.push({
      name: 'Canonical URL',
      content: canonical,
      score: 100,
      status: 'good'
    });
  } else {
    metaTags.push({
      name: 'Canonical URL',
      content: '',
      score: 0,
      status: 'error',
      recommendation: 'Missing canonical URL tag. This helps prevent duplicate content issues.'
    });
  }
  
  // Robots tag analysis
  if (robots) {
    const robotsLower = robots.toLowerCase();
    let robotsScore = 100;
    let robotsStatus: 'good' | 'warning' | 'error' | 'info' = 'good';
    let recommendation;
    
    if (robotsLower.includes('noindex') || robotsLower.includes('nofollow')) {
      robotsScore = 50;
      robotsStatus = 'warning';
      recommendation = 'Page is set to be not indexed or links not followed. This will limit search visibility.';
    }
    
    metaTags.push({
      name: 'Robots',
      content: robots,
      score: robotsScore,
      status: robotsStatus,
      recommendation
    });
  } else {
    // No robots tag is not necessarily bad, default is index, follow
    metaTags.push({
      name: 'Robots',
      content: 'Default (index, follow)',
      score: 80,
      status: 'info',
      recommendation: 'No robots meta tag found. Default behavior is index, follow.'
    });
  }
  
  // Viewport analysis
  if (viewport) {
    metaTags.push({
      name: 'Viewport',
      content: viewport,
      score: 100,
      status: 'good'
    });
  } else {
    metaTags.push({
      name: 'Viewport',
      content: '',
      score: 30,
      status: 'warning',
      recommendation: 'Missing viewport meta tag. This is important for mobile responsiveness and SEO.'
    });
  }
  
  // Language analysis
  if (language) {
    metaTags.push({
      name: 'Language',
      content: language,
      score: 100,
      status: 'good'
    });
  } else {
    metaTags.push({
      name: 'Language',
      content: '',
      score: 50,
      status: 'warning',
      recommendation: 'Missing language attribute on HTML tag. This helps search engines understand the target audience.'
    });
  }
  
  // Generate recommendations
  const recommendations = generateRecommendations(metaTags, ogTags, twitterTags);
  
  // Calculate overall score
  const score = calculateOverallScore(metaTags, ogTags, twitterTags);
  
  return {
    url: normalizedUrl,
    title,
    description,
    canonical,
    robots,
    viewport,
    charset,
    language,
    ogTags,
    twitterTags,
    metaTags,
    score,
    recommendations,
    analysisDate: new Date().toISOString()
  };
}

/**
 * Normalize the URL to ensure consistent storage/retrieval
 */
function normalizeUrl(url: string): string {
  // If URL doesn't start with http:// or https://, add https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  try {
    const urlObj = new URL(url);
    // Remove trailing slash if it exists
    return urlObj.origin + urlObj.pathname.replace(/\/$/, '') + urlObj.search;
  } catch (e) {
    // If URL parsing fails, return the original
    return url;
  }
}

/**
 * Generate recommendations based on the analysis
 */
function generateRecommendations(
  metaTags: MetaTagType[],
  ogTags: OgTagType[],
  twitterTags: TwitterTagType[]
) {
  const recommendations: {
    priority: 'high' | 'medium' | 'low';
    type: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    code?: string;
  }[] = [];
  
  // Add recommendations from meta tags
  metaTags.forEach(tag => {
    if (tag.recommendation) {
      recommendations.push({
        priority: tag.status === 'error' ? 'high' : tag.status === 'warning' ? 'medium' : 'low',
        type: tag.status,
        title: `Improve your ${tag.name}`,
        description: tag.recommendation,
        code: tag.name === 'Title' ? `<title>Your optimized title here</title>` :
              tag.name === 'Description' ? `<meta name="description" content="Your optimized description here">` :
              tag.name === 'Canonical URL' ? `<link rel="canonical" href="https://yourdomain.com/current-page">` :
              undefined
      });
    }
  });
  
  // Check for Open Graph tags
  if (ogTags.length === 0) {
    recommendations.push({
      priority: 'medium',
      type: 'warning',
      title: 'Add Open Graph tags',
      description: 'Open Graph tags improve how your content appears when shared on social media platforms like Facebook.',
      code: `<meta property="og:title" content="Your Title">\n<meta property="og:description" content="Your Description">\n<meta property="og:image" content="https://yourdomain.com/image.jpg">\n<meta property="og:url" content="https://yourdomain.com/page">\n<meta property="og:type" content="website">`
    });
  } else {
    const hasOgImage = ogTags.some(tag => tag.property === 'og:image');
    if (!hasOgImage) {
      recommendations.push({
        priority: 'medium',
        type: 'warning',
        title: 'Add Open Graph image',
        description: 'Adding an og:image tag will make your content more visually appealing when shared on social media.',
        code: `<meta property="og:image" content="https://yourdomain.com/image.jpg">`
      });
    }
  }
  
  // Check for Twitter Card tags
  if (twitterTags.length === 0) {
    recommendations.push({
      priority: 'medium',
      type: 'warning',
      title: 'Add Twitter Card tags',
      description: 'Twitter Card tags improve how your content appears when shared on Twitter.',
      code: `<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:site" content="@yourusername">\n<meta name="twitter:title" content="Your Title">\n<meta name="twitter:description" content="Your Description">\n<meta name="twitter:image" content="https://yourdomain.com/image.jpg">`
    });
  } else {
    const hasTwitterImage = twitterTags.some(tag => tag.name === 'twitter:image');
    if (!hasTwitterImage) {
      recommendations.push({
        priority: 'medium',
        type: 'warning',
        title: 'Add Twitter image',
        description: 'Adding a twitter:image tag will make your content more visually appealing when shared on Twitter.',
        code: `<meta name="twitter:image" content="https://yourdomain.com/image.jpg">`
      });
    }
    
    const hasTwitterImageAlt = twitterTags.some(tag => tag.name === 'twitter:image:alt');
    if (!hasTwitterImageAlt && hasTwitterImage) {
      recommendations.push({
        priority: 'low',
        type: 'info',
        title: 'Add Twitter image alt text',
        description: 'Adding alt text to your Twitter card image improves accessibility and may help with SEO.',
        code: `<meta name="twitter:image:alt" content="Description of the image">`
      });
    }
  }
  
  // Check for structured data
  const hasStructuredData = false; // This would require more complex parsing
  if (!hasStructuredData) {
    recommendations.push({
      priority: 'low',
      type: 'info',
      title: 'Consider adding structured data',
      description: 'Schema.org markup can enhance your search results with rich snippets.',
      code: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Page Title",\n  "description": "Page description"\n}\n</script>`
    });
  }
  
  return recommendations;
}

/**
 * Calculate an overall SEO score based on all factors
 */
function calculateOverallScore(
  metaTags: MetaTagType[],
  ogTags: OgTagType[],
  twitterTags: TwitterTagType[]
): number {
  // Weight factors
  const weights = {
    title: 0.20,
    description: 0.15,
    canonical: 0.10,
    robots: 0.05,
    viewport: 0.05,
    language: 0.05,
    ogTags: 0.20,
    twitterTags: 0.20
  };
  
  // Calculate meta tags score
  const metaTagScores: Record<string, number> = {};
  metaTags.forEach(tag => {
    metaTagScores[tag.name.toLowerCase()] = tag.score;
  });
  
  // Calculate social tags score
  const ogTagsScore = ogTags.length > 0 ? 
    Math.min(100, 20 * ogTags.length) : 0;
  
  const twitterTagsScore = twitterTags.length > 0 ? 
    Math.min(100, 20 * twitterTags.length) : 0;
  
  // Calculate weighted score
  let score = 0;
  score += (metaTagScores.title || 0) * weights.title;
  score += (metaTagScores.description || 0) * weights.description;
  score += (metaTagScores['canonical url'] || 0) * weights.canonical;
  score += (metaTagScores.robots || 0) * weights.robots;
  score += (metaTagScores.viewport || 0) * weights.viewport;
  score += (metaTagScores.language || 0) * weights.language;
  score += ogTagsScore * weights.ogTags;
  score += twitterTagsScore * weights.twitterTags;
  
  // Round to nearest integer
  return Math.round(score);
}
