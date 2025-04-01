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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <BarChart2 className="mr-2 h-5 w-5 text-primary" />
            SEO Analysis Results
            <span className="ml-2 text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded">
              {displayUrl}
            </span>
          </h2>
          <p className="text-slate-600">
            Last analyzed: {formatDate(analysisDate)}
          </p>
        </div>
        <Button
          variant="outline"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700"
          onClick={onReanalyze}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Re-analyze
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg">
          <div className="relative mb-4">
            <svg className="w-36 h-36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="2"></circle>
              <circle 
                cx="18" 
                cy="18" 
                r="16" 
                fill="none" 
                stroke={getScoreColor(score)} 
                strokeWidth="2" 
                strokeDasharray={`${score} 100`} 
                strokeDashoffset="0" 
                transform="rotate(-90 18 18)"
              ></circle>
              <text 
                x="18" 
                y="18" 
                fontSize="0.6rem" 
                textAnchor="middle" 
                alignmentBaseline="middle" 
                fill="#64748b"
              >
                SCORE
              </text>
              <text 
                x="18" 
                y="22" 
                fontSize="0.7rem" 
                fontWeight="bold" 
                textAnchor="middle" 
                alignmentBaseline="middle" 
                fill="#334155"
              >
                {score}/100
              </text>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Overall SEO Score
          </h3>
          <p className="text-sm text-slate-600 text-center mt-1">
            {getScoreDescription(score)}
          </p>
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-slate-800 mb-3">Quick Summary</h3>
          <ul className="space-y-2">
            {summaryItems.map((item, index) => (
              <li key={index} className="flex items-center">
                <span className={`w-6 h-6 rounded-full bg-${getStatusColor(item.status)} text-white flex items-center justify-center text-xs mr-2`}>
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
