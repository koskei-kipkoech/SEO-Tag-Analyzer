import { type SeoAnalysisResult } from "@shared/schema";
import { Tags, Share2, CheckCircle, AlertCircle, XCircle, InfoIcon, ArrowRight, FileCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

interface DetailedAnalysisProps {
  analysis: SeoAnalysisResult;
}

export default function DetailedAnalysis({ analysis }: DetailedAnalysisProps) {
  // Safely ensure arrays are initialized
  const metaTags = analysis.metaTags || [];
  const ogTags = analysis.ogTags || [];
  const twitterTags = analysis.twitterTags || [];

  // Group meta tags by category
  const basicTags = metaTags.filter(tag => 
    ['Title', 'Description', 'Canonical URL', 'Robots'].includes(tag.name)
  );
  
  const technicalTags = metaTags.filter(tag => 
    ['Viewport', 'Charset', 'Language'].includes(tag.name)
  );
  
  const otherTags = metaTags.filter(tag => 
    !['Title', 'Description', 'Canonical URL', 'Robots', 'Viewport', 'Charset', 'Language'].includes(tag.name)
  );

  return (
    <div className="space-y-6">
      {/* Visual summary of categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CategorySummaryCard 
          title="Basic Meta Tags" 
          tags={basicTags} 
          icon={<Tags className="h-4 w-4" />}
        />
        <CategorySummaryCard 
          title="Social Media Tags" 
          count={{ 
            og: ogTags.length, 
            twitter: twitterTags.length 
          }}
          icon={<Share2 className="h-4 w-4" />}
        />
        <CategorySummaryCard 
          title="Technical Tags" 
          tags={technicalTags} 
          icon={<FileCode className="h-4 w-4" />}
        />
      </div>

      {/* Detailed analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meta Tags Analysis */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Tags className="h-5 w-5 text-primary mr-2" />
              Meta Tags Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={["basic-tags"]}>
              <AccordionItem value="basic-tags">
                <AccordionTrigger className="text-sm font-medium py-2">
                  Basic Meta Tags
                  <TagStatusBadges tags={basicTags} />
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {basicTags.map((tag, index) => (
                      <MetaTagItem 
                        key={index}
                        name={tag.name} 
                        content={tag.content}
                        status={tag.status}
                        score={tag.score}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="technical-tags">
                <AccordionTrigger className="text-sm font-medium py-2">
                  Technical Tags
                  <TagStatusBadges tags={technicalTags} />
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {technicalTags.map((tag, index) => (
                      <MetaTagItem 
                        key={index}
                        name={tag.name} 
                        content={tag.content}
                        status={tag.status}
                        score={tag.score}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {otherTags.length > 0 && (
                <AccordionItem value="other-tags">
                  <AccordionTrigger className="text-sm font-medium py-2">
                    Other Meta Tags
                    <Badge variant="outline" className="ml-2 font-normal">
                      {otherTags.length}
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {otherTags.map((tag, index) => (
                        <MetaTagItem 
                          key={index}
                          name={tag.name} 
                          content={tag.content}
                          status={tag.status}
                          score={tag.score}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>

        {/* Social Media Tags */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Share2 className="h-5 w-5 text-primary mr-2" />
              Social Media Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={["og-tags"]}>
              <AccordionItem value="og-tags">
                <AccordionTrigger className="text-sm font-medium py-2">
                  <div className="flex items-center">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600 mr-2">
                      <path
                        fill="currentColor"
                        d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"
                      />
                    </svg>
                    Open Graph Tags
                  </div>
                  <Badge 
                    variant={ogTags.length > 0 ? "outline" : "destructive"} 
                    className={`ml-2 font-normal ${ogTags.length > 0 ? "" : "bg-red-100"}`}
                  >
                    {ogTags.length > 0 ? ogTags.length : "Missing"}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent>
                  {ogTags.length > 0 ? (
                    <div className="space-y-2 pt-2">
                      {ogTags.map((tag, index) => (
                        <div key={index} className="flex text-sm border-b border-slate-100 pb-2">
                          <span className="w-24 flex-shrink-0 font-medium text-slate-600">
                            {tag.property.replace('og:', '')}
                          </span>
                          <span className="text-slate-700 break-words font-mono bg-slate-50 p-1 rounded text-xs flex-grow overflow-x-auto">
                            {tag.content}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 text-red-700 text-sm rounded-md mt-2 border border-red-100">
                      <div className="flex">
                        <XCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" />
                        <span>
                          No Open Graph tags found. These tags are important for proper display when shared on Facebook and other platforms.
                        </span>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="twitter-tags">
                <AccordionTrigger className="text-sm font-medium py-2">
                  <div className="flex items-center">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-400 mr-2">
                      <path
                        fill="currentColor"
                        d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23Z"
                      />
                    </svg>
                    Twitter Card Tags
                  </div>
                  <Badge 
                    variant={twitterTags.length > 0 ? "outline" : "destructive"} 
                    className={`ml-2 font-normal ${twitterTags.length > 0 ? "" : "bg-red-100"}`}
                  >
                    {twitterTags.length > 0 ? twitterTags.length : "Missing"}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent>
                  {twitterTags.length > 0 ? (
                    <div className="space-y-2 pt-2">
                      {twitterTags.map((tag, index) => (
                        <div key={index} className="flex text-sm border-b border-slate-100 pb-2">
                          <span className={`w-24 flex-shrink-0 font-medium text-slate-600 ${
                            tag.name === 'twitter:image:alt' ? 'text-amber-500 flex items-center' : ''
                          }`}>
                            {tag.name.replace('twitter:', '')}
                            {tag.name === 'twitter:image:alt' && (
                              <AlertCircle className="h-3 w-3 ml-1 text-amber-500" />
                            )}
                          </span>
                          <span className="text-slate-700 break-words font-mono bg-slate-50 p-1 rounded text-xs flex-grow overflow-x-auto">
                            {tag.content}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 text-red-700 text-sm rounded-md mt-2 border border-red-100">
                      <div className="flex">
                        <XCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" />
                        <span>
                          No Twitter Card tags found. These tags are important for proper display when shared on Twitter.
                        </span>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Badge component to show counts of good/warning/error tags
interface TagStatusBadgesProps {
  tags: Array<{ status: string }>;
}

function TagStatusBadges({ tags }: TagStatusBadgesProps) {
  const goodCount = tags.filter(tag => tag.status === 'good').length;
  const warningCount = tags.filter(tag => tag.status === 'warning').length;
  const errorCount = tags.filter(tag => tag.status === 'error').length;
  
  return (
    <div className="flex ml-2 gap-1">
      {goodCount > 0 && (
        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
          {goodCount} <CheckCircle className="h-3 w-3 ml-1" />
        </Badge>
      )}
      {warningCount > 0 && (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
          {warningCount} <AlertCircle className="h-3 w-3 ml-1" />
        </Badge>
      )}
      {errorCount > 0 && (
        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">
          {errorCount} <XCircle className="h-3 w-3 ml-1" />
        </Badge>
      )}
    </div>
  );
}

// Card component for category summaries
interface CategorySummaryCardProps {
  title: string;
  tags?: Array<{ status: string; score: number; name: string }>;
  count?: { og: number; twitter: number };
  icon: React.ReactNode;
}

function CategorySummaryCard({ title, tags, count, icon }: CategorySummaryCardProps) {
  // Calculate average score for tags
  const getAverageScore = () => {
    if (!tags || tags.length === 0) return 0;
    return Math.round(tags.reduce((sum, tag) => sum + tag.score, 0) / tags.length);
  };

  // Calculate social media score
  const getSocialScore = () => {
    if (!count) return 0;
    let score = 0;
    
    // Base scores for presence of tags
    if (count.og > 0) score += 50;
    if (count.twitter > 0) score += 50;
    
    // Bonus for having more comprehensive tag sets
    if (count.og >= 4) score += 10;
    if (count.twitter >= 4) score += 10;
    
    // Cap at 100
    return Math.min(score, 100);
  };
  
  // Get score based on props
  const score = tags ? getAverageScore() : getSocialScore();
  
  // Status counts for tags
  const getStatusCounts = () => {
    if (!tags) return { good: 0, warning: 0, error: 0 };
    
    return {
      good: tags.filter(tag => tag.status === 'good').length,
      warning: tags.filter(tag => tag.status === 'warning').length,
      error: tags.filter(tag => tag.status === 'error').length
    };
  };
  
  const statusCounts = getStatusCounts();
  
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              {icon}
            </div>
            <h3 className="font-medium text-sm">{title}</h3>
          </div>
          <div className={`text-lg font-bold ${
            score >= 80 ? 'text-green-600' : 
            score >= 60 ? 'text-amber-600' : 
            'text-red-600'
          }`}>
            {score}
          </div>
        </div>
        
        <Progress 
          value={score} 
          className="h-1.5 mb-3"
          indicatorClassName={
            score >= 80 ? 'bg-green-500' : 
            score >= 60 ? 'bg-amber-500' : 
            'bg-red-500'
          }
        />
        
        {tags ? (
          <div className="flex items-center justify-between text-xs mt-2">
            <div className="flex gap-2">
              {statusCounts.good > 0 && (
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 gap-1">
                  <CheckCircle className="h-3 w-3" /> {statusCounts.good}
                </Badge>
              )}
              {statusCounts.warning > 0 && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100 gap-1">
                  <AlertCircle className="h-3 w-3" /> {statusCounts.warning}
                </Badge>
              )}
              {statusCounts.error > 0 && (
                <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100 gap-1">
                  <XCircle className="h-3 w-3" /> {statusCounts.error}
                </Badge>
              )}
            </div>
            <span className="text-slate-500 flex items-center">
              {tags.length} tags <ArrowRight className="h-3 w-3 ml-1" />
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs mt-2">
            <div className="flex gap-2">
              <Badge variant="outline" className={(count && count.og) ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"}>
                OG: {(count && count.og) ? count.og : 'Missing'}
              </Badge>
              <Badge variant="outline" className={(count && count.twitter) ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"}>
                Twitter: {(count && count.twitter) ? count.twitter : 'Missing'}
              </Badge>
            </div>
            <span className="text-slate-500 flex items-center">
              {(count ? (count.og || 0) + (count.twitter || 0) : 0)} tags <ArrowRight className="h-3 w-3 ml-1" />
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MetaTagItemProps {
  name: string;
  content: string;
  status: 'good' | 'warning' | 'error' | 'info';
  score: number;
}

function MetaTagItem({ name, content, status, score }: MetaTagItemProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'good':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" /> {score} - Good
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
            <AlertCircle className="h-3 w-3 mr-1" /> {score} - Warning
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" /> Missing
          </Badge>
        );
      case 'info':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
            <InfoIcon className="h-3 w-3 mr-1" /> Info
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTagHtmlName = () => {
    switch (name) {
      case 'Title': return '&lt;title&gt;';
      case 'Description': return 'meta[name="description"]';
      case 'Canonical URL': return 'link[rel="canonical"]';
      case 'Robots': return 'meta[name="robots"]';
      case 'Viewport': return 'meta[name="viewport"]';
      case 'Language': return 'html[lang]';
      default: return `meta[name="${name.toLowerCase()}"]`;
    }
  };

  const getCharacterGuideline = () => {
    switch (name) {
      case 'Title':
        return `${content.length} characters (Recommended: 50-60)`;
      case 'Description':
        return `${content.length} characters (Recommended: 120-158)`;
      default:
        return null;
    }
  };

  return (
    <div className="border-b border-slate-100 pb-3">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-medium text-slate-700">{name}</h4>
        {getStatusBadge()}
      </div>
      <p className={`text-sm text-slate-600 mb-2 break-words ${content ? 'font-mono bg-slate-50 p-2 rounded' : 'italic text-slate-400'}`}>
        {content || `No ${name.toLowerCase()} tag found`}
      </p>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{getCharacterGuideline()}</span>
        <span className="flex items-center">
          <InfoIcon className="h-3 w-3 mr-1" />
          {status !== 'error' ? (
            <span>Found in <code className="bg-slate-100 px-1">{getTagHtmlName()}</code></span>
          ) : (
            <span>Expected in <code className="bg-slate-100 px-1">{getTagHtmlName()}</code></span>
          )}
        </span>
      </div>
    </div>
  );
}
