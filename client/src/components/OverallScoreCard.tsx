import { type SeoAnalysisResult } from "@shared/schema";
import { BarChart2, RefreshCw, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/seoAnalysis";

interface OverallScoreCardProps {
  analysis: SeoAnalysisResult;
  onReanalyze: () => void;
}

export default function OverallScoreCard({ analysis, onReanalyze }: OverallScoreCardProps) {
  const { url, score, analysisDate } = analysis;
  
  // Format the URL for display
  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  // Generate score description
  const getScoreDescription = (score: number) => {
    if (score >= 90) return "Excellent implementation with minor improvements possible";
    if (score >= 80) return "Good implementation with some room for improvement";
    if (score >= 60) return "Adequate implementation but needs improvement";
    if (score >= 40) return "Poor implementation requiring significant improvements";
    return "Critical issues found that need immediate attention";
  };
  
  // Get quick summary items based on meta tags and recommendations
  const getSummaryItems = () => {
    const items = [];
    
    // Check for title and description
    const hasTitle = analysis.metaTags.some(tag => 
      tag.name === 'Title' && tag.status === 'good');
    const hasDescription = analysis.metaTags.some(tag => 
      tag.name === 'Description' && tag.status === 'good');
    
    if (hasTitle && hasDescription) {
      items.push({
        status: 'success',
        text: 'Title and description tags properly implemented'
      });
    }
    
    // Check for Open Graph tags
    if (analysis.ogTags.length > 0) {
      items.push({
        status: 'success',
        text: 'Open Graph tags present for social sharing'
      });
    } else {
      items.push({
        status: 'error',
        text: 'Missing Open Graph tags for social sharing'
      });
    }
    
    // Check for Twitter Card tags
    if (analysis.twitterTags.length > 0) {
      const hasImageAlt = analysis.twitterTags.some(tag => 
        tag.name === 'twitter:image:alt');
      
      if (!hasImageAlt) {
        items.push({
          status: 'warning',
          text: 'Twitter card meta tags missing image dimensions or alt text'
        });
      } else {
        items.push({
          status: 'success',
          text: 'Twitter card meta tags properly implemented'
        });
      }
    } else {
      items.push({
        status: 'error',
        text: 'Missing Twitter Card meta tags'
      });
    }
    
    // Check for canonical URL
    const hasCanonical = analysis.metaTags.some(tag => 
      tag.name === 'Canonical URL' && tag.status === 'good');
    
    if (!hasCanonical) {
      items.push({
        status: 'error',
        text: 'Missing canonical URL tag for duplicate content prevention'
      });
    }
    
    return items.slice(0, 4); // Limit to 4 items
  };
  
  const summaryItems = getSummaryItems();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex flex-wrap items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            SEO Analysis Results
            <span className="text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded">
              {displayUrl}
            </span>
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Last analyzed: {formatDate(analysisDate)}
          </p>
        </div>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-slate-50 to-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-sm"
          onClick={onReanalyze}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Re-analyze
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col p-6 bg-gradient-to-r from-slate-50 to-white rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-700">
              SEO Score
            </h3>
            <div 
              className={`text-2xl font-bold rounded-lg px-4 py-2 ${
                score >= 80 ? 'bg-green-100 text-green-700' : 
                score >= 60 ? 'bg-amber-100 text-amber-700' : 
                'bg-red-100 text-red-700'
              }`}
            >
              {score}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  score >= 80 ? 'bg-green-500' : 
                  score >= 60 ? 'bg-amber-500' : 
                  'bg-red-500'
                }`} 
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
          
          <p className="text-sm text-slate-700 mb-2">
            {getScoreDescription(score)}
          </p>
          
          <div className="mt-2 pt-3 border-t border-slate-100">
            <h4 className="text-sm font-medium text-slate-700 mb-2">SEO Summary:</h4>
            <ul className="space-y-1.5 text-sm">
              {analysis.metaTags.some(tag => tag.name === 'Title' && tag.status === 'good') ? (
                <li className="flex items-center text-green-700">
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />Title tag is well-optimized
                </li>
              ) : (
                <li className="flex items-center text-red-700">
                  <XCircle className="h-3.5 w-3.5 mr-1.5" />Title tag needs improvement
                </li>
              )}
              
              {analysis.metaTags.some(tag => tag.name === 'Description' && tag.status === 'good') ? (
                <li className="flex items-center text-green-700">
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />Description is well-written
                </li>
              ) : (
                <li className="flex items-center text-red-700">
                  <XCircle className="h-3.5 w-3.5 mr-1.5" />Description needs improvement
                </li>
              )}
              
              {analysis.ogTags.length > 0 ? (
                <li className="flex items-center text-green-700">
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />Open Graph tags are present
                </li>
              ) : (
                <li className="flex items-center text-red-700">
                  <XCircle className="h-3.5 w-3.5 mr-1.5" />Missing Open Graph tags
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col p-6 bg-gradient-to-r from-slate-50 to-white rounded-lg shadow-sm border border-slate-100">
          <h3 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-100">Quick Summary</h3>
          <ul className="space-y-3">
            {summaryItems.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full bg-${getStatusColor(item.status)} text-white flex items-center justify-center text-xs mr-2 mt-0.5 shadow-sm`}>
                  {item.status === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : item.status === 'warning' ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                </span>
                <span className="text-sm">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Helper function to get color based on score
function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e'; // success
  if (score >= 60) return '#f59e0b'; // warning
  return '#ef4444'; // error
}

// Helper function to get color based on status
function getStatusColor(status: string): string {
  switch (status) {
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'error': return 'error';
    default: return 'slate-500';
  }
}
