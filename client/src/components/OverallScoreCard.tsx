import { type SeoAnalysisResult } from "@shared/schema";
import { BarChart2, RefreshCw, CheckCircle, AlertCircle, XCircle, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/seoAnalysis";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface OverallScoreCardProps {
  analysis: SeoAnalysisResult;
  onReanalyze: () => void;
}

export default function OverallScoreCard({ analysis, onReanalyze }: OverallScoreCardProps) {
  const { url, score, analysisDate } = analysis;
  
  // Safely ensure the arrays are initialized
  const metaTags = analysis.metaTags || [];
  const ogTags = analysis.ogTags || [];
  const twitterTags = analysis.twitterTags || [];
  const recommendations = analysis.recommendations || [];
  
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
    const hasTitle = metaTags.some(tag => 
      tag.name === 'Title' && tag.status === 'good');
    const hasDescription = metaTags.some(tag => 
      tag.name === 'Description' && tag.status === 'good');
    
    if (hasTitle && hasDescription) {
      items.push({
        status: 'success',
        text: 'Title and description tags properly implemented'
      });
    }
    
    // Check for Open Graph tags
    if (ogTags.length > 0) {
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
    if (twitterTags.length > 0) {
      const hasImageAlt = twitterTags.some(tag => 
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
    const hasCanonical = metaTags.some(tag => 
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

  // Calculate counts for each status type
  const goodCount = metaTags.filter(tag => tag.status === 'good').length;
  const warningCount = metaTags.filter(tag => tag.status === 'warning').length;
  const errorCount = metaTags.filter(tag => tag.status === 'error').length;
  const totalTags = goodCount + warningCount + errorCount;

  // Calculate percentages for the status breakdown
  const goodPercentage = totalTags > 0 ? Math.round((goodCount / totalTags) * 100) : 0;
  const warningPercentage = totalTags > 0 ? Math.round((warningCount / totalTags) * 100) : 0;
  const errorPercentage = totalTags > 0 ? Math.round((errorCount / totalTags) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex flex-wrap items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            SEO Analysis Results
            <Badge variant="outline" className="font-normal">
              {displayUrl}
            </Badge>
          </h2>
          <p className="text-slate-600 text-sm mt-1 flex items-center">
            <span className="mr-3">Last analyzed: {formatDate(analysisDate)}</span>
            {recommendations.length > 0 && (
              <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                {recommendations.length} recommendations
              </Badge>
            )}
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
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-700 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
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
            <Progress 
              value={score} 
              className="h-2.5"
              indicatorClassName={
                score >= 80 ? 'bg-green-500' : 
                score >= 60 ? 'bg-amber-500' : 
                'bg-red-500'
              }
            />
          </div>
          
          <p className="text-sm text-slate-700 mb-4 bg-slate-50 p-3 rounded-md border border-slate-100">
            {getScoreDescription(score)}
          </p>
          
          <div className="mt-2">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Status Breakdown:</h4>

            <div className="space-y-3">
              <StatusBar 
                label="Good" 
                count={goodCount}
                percentage={goodPercentage}
                color="bg-green-500" 
                icon={<CheckCircle className="h-3.5 w-3.5" />}
              />
              
              <StatusBar 
                label="Warning" 
                count={warningCount}
                percentage={warningPercentage}
                color="bg-amber-500" 
                icon={<AlertCircle className="h-3.5 w-3.5" />}
              />
              
              <StatusBar 
                label="Error" 
                count={errorCount}
                percentage={errorPercentage}
                color="bg-red-500" 
                icon={<XCircle className="h-3.5 w-3.5" />}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col p-6 bg-gradient-to-r from-slate-50 to-white rounded-lg shadow-sm border border-slate-100">
          <h3 className="font-medium text-slate-800 mb-3 pb-2 border-b border-slate-100 flex items-center">
            <HelpCircle className="h-4 w-4 mr-2 text-primary" />
            Key Findings
          </h3>
          <ul className="space-y-3">
            {summaryItems.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full ${getStatusBackgroundColor(item.status)} text-white flex items-center justify-center text-xs mr-2 mt-0.5 shadow-sm`}>
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

// Status Bar component
interface StatusBarProps {
  label: string;
  count: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
}

function StatusBar({ label, count, percentage, color, icon }: StatusBarProps) {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center">
          <span className={`w-4 h-4 ${color} rounded-full flex items-center justify-center text-white mr-1.5`}>
            {icon}
          </span>
          <span className="font-medium text-slate-700">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-slate-500">{count}</span>
          <span className="text-slate-400">·</span>
          <span className="font-medium">{percentage}%</span>
        </div>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-1.5 ${color} rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

// Helper function to get background color based on status
function getStatusBackgroundColor(status: string): string {
  switch (status) {
    case 'success': return 'bg-green-500';
    case 'warning': return 'bg-amber-500';
    case 'error': return 'bg-red-500';
    default: return 'bg-slate-500';
  }
}
