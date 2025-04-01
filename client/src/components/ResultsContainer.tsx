import { type SeoAnalysisResult } from "@shared/schema";
import OverallScoreCard from "./OverallScoreCard";
import PreviewTabs from "./PreviewTabs";
import DetailedAnalysis from "./DetailedAnalysis";
import Recommendations from "./Recommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertCircle, XCircle, Share2, Tags, PieChart, BookOpen } from "lucide-react";

interface ResultsContainerProps {
  analysis: SeoAnalysisResult;
  onReanalyze: () => void;
}

export default function ResultsContainer({ analysis, onReanalyze }: ResultsContainerProps) {
  if (!analysis) return null;

  // Safely ensure the arrays are initialized
  const metaTags = analysis.metaTags || [];
  const ogTags = analysis.ogTags || [];
  const twitterTags = analysis.twitterTags || [];
  const recommendations = analysis.recommendations || [];

  // Calculate category scores
  const basicMetaScore = calculateCategoryScore(metaTags.filter(
    tag => ['Title', 'Description', 'Canonical URL', 'Robots'].includes(tag.name)
  ));
  
  const socialScore = calculateSocialScore(ogTags, twitterTags);
  
  const technicalScore = calculateCategoryScore(metaTags.filter(
    tag => ['Viewport', 'Charset', 'Language'].includes(tag.name)
  ));

  // Calculate priority counts for recommendations
  const highPriorityCount = recommendations.filter(rec => rec.priority === 'high').length;
  const mediumPriorityCount = recommendations.filter(rec => rec.priority === 'medium').length;
  const lowPriorityCount = recommendations.filter(rec => rec.priority === 'low').length;

  return (
    <div className="space-y-8 mb-12">
      <OverallScoreCard 
        analysis={analysis} 
        onReanalyze={onReanalyze}
      />
      
      {/* Category Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CategoryCard 
          title="Basic SEO" 
          score={basicMetaScore}
          icon={<Tags className="h-5 w-5" />}
          description="Essential meta tags like title, description"
          items={[
            { label: "Title", status: getMetaTagStatus(metaTags, "Title") },
            { label: "Description", status: getMetaTagStatus(metaTags, "Description") },
            { label: "Canonical URL", status: getMetaTagStatus(metaTags, "Canonical URL") }
          ]}
        />
        
        <CategoryCard 
          title="Social Media" 
          score={socialScore}
          icon={<Share2 className="h-5 w-5" />}
          description="Open Graph and Twitter Card tags"
          items={[
            { label: "Open Graph", status: ogTags.length > 0 ? "good" : "error" },
            { label: "Twitter Card", status: twitterTags.length > 0 ? "good" : "error" },
            { label: "Social Images", status: 
              (ogTags.some(tag => tag.property === "og:image") || 
               twitterTags.some(tag => tag.name === "twitter:image")) ? "good" : "warning" 
            }
          ]}
        />
        
        <CategoryCard 
          title="Technical SEO" 
          score={technicalScore}
          icon={<PieChart className="h-5 w-5" />}
          description="Technical aspects of your page"
          items={[
            { label: "Viewport", status: getMetaTagStatus(metaTags, "Viewport") },
            { label: "Language", status: getMetaTagStatus(metaTags, "Language") },
            { label: "Recommendations", status: highPriorityCount > 0 ? "error" : 
              mediumPriorityCount > 0 ? "warning" : "good", 
              detail: `${highPriorityCount} high, ${mediumPriorityCount} medium priority` 
            }
          ]}
        />
      </div>

      {/* Main content tabs */}
      <Tabs defaultValue="previews" className="bg-white rounded-lg shadow-md overflow-hidden">
        <TabsList className="flex w-full bg-slate-50 p-1 border-b">
          <TabsTrigger value="previews" className="flex-1 data-[state=active]:bg-white rounded-sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Preview & Appearance
          </TabsTrigger>
          <TabsTrigger value="details" className="flex-1 data-[state=active]:bg-white rounded-sm">
            <Tags className="h-4 w-4 mr-2" />
            Detailed Analysis
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex-1 data-[state=active]:bg-white rounded-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            Recommendations
            {highPriorityCount > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs rounded-full px-2 py-0.5">
                {highPriorityCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="previews" className="p-0 m-0">
          <PreviewTabs analysis={analysis} />
        </TabsContent>
        
        <TabsContent value="details" className="p-6 m-0">
          <DetailedAnalysis analysis={analysis} />
        </TabsContent>
        
        <TabsContent value="recommendations" className="p-6 m-0">
          <Recommendations recommendations={analysis.recommendations || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to calculate category score
function calculateCategoryScore(tags: Array<{ score: number; status: string }>) {
  if (!tags || tags.length === 0) return 0;
  
  const totalScore = tags.reduce((sum, tag) => sum + tag.score, 0);
  return Math.round(totalScore / tags.length);
}

// Helper function to calculate social media score
function calculateSocialScore(ogTags: any[], twitterTags: any[]) {
  let score = 0;
  
  // Check if essential OG tags exist
  const hasOgTitle = ogTags.some(tag => tag.property === "og:title");
  const hasOgDesc = ogTags.some(tag => tag.property === "og:description");
  const hasOgImage = ogTags.some(tag => tag.property === "og:image");
  
  // Check if essential Twitter tags exist
  const hasTwitterCard = twitterTags.some(tag => tag.name === "twitter:card");
  const hasTwitterTitle = twitterTags.some(tag => tag.name === "twitter:title");
  const hasTwitterDesc = twitterTags.some(tag => tag.name === "twitter:description");
  
  // Calculate score based on presence of tags
  if (hasOgTitle) score += 15;
  if (hasOgDesc) score += 15;
  if (hasOgImage) score += 20;
  
  if (hasTwitterCard) score += 15;
  if (hasTwitterTitle) score += 15;
  if (hasTwitterDesc) score += 20;
  
  return score;
}

// Helper function to get meta tag status
function getMetaTagStatus(metaTags: Array<{ name: string; status: string }>, name: string) {
  const tag = metaTags.find(tag => tag.name === name);
  return tag ? tag.status : "error";
}

// Category summary card component
interface CategoryCardProps {
  title: string;
  score: number;
  icon: React.ReactNode;
  description: string;
  items: Array<{
    label: string;
    status: string;
    detail?: string;
  }>;
}

function CategoryCard({ title, score, icon, description, items }: CategoryCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error':
      case 'info':
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              {icon}
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <div className={`text-xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5">
                {getStatusIcon(item.status)}
                <span>{item.label}</span>
              </span>
              {item.detail && (
                <span className="text-xs text-slate-500">{item.detail}</span>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
