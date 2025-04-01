import { AlertTriangle, Info, XCircle, Lightbulb, CheckCircle, Flame, ArrowUp, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface RecommendationsProps {
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    type: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    code?: string;
  }[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            All SEO Checks Passed
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="p-6 text-center bg-green-50 rounded-lg border border-green-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-4">
              <CheckCircle className="h-7 w-7" />
            </div>
            <p className="text-green-700 font-medium">
              Great job! We don't have any specific recommendations for improvement.
            </p>
            <p className="text-sm text-green-600 mt-2">
              Your website's SEO implementation meets current best practices.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Group recommendations by priority for filtering
  const highPriorityRecs = recommendations.filter(rec => rec.priority === 'high');
  const mediumPriorityRecs = recommendations.filter(rec => rec.priority === 'medium');
  const lowPriorityRecs = recommendations.filter(rec => rec.priority === 'low');
  
  // Get impact count for each priority
  const highPriorityCount = highPriorityRecs.length;
  const mediumPriorityCount = mediumPriorityRecs.length;
  const lowPriorityCount = lowPriorityRecs.length;
  
  // Calculate completion percentage
  const totalIssues = recommendations.length;
  const maxPossibleIssues = 10; // Assuming this is the worst case
  const completionPercentage = Math.max(0, Math.min(100, 100 - (totalIssues / maxPossibleIssues) * 100));
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600">
            <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
            Recommendations for Improvement
          </CardTitle>
          <Badge variant="outline" className={`${
            highPriorityCount > 0 ? 'bg-red-50 text-red-700' : 
            mediumPriorityCount > 0 ? 'bg-amber-50 text-amber-700' : 
            'bg-blue-50 text-blue-700'
          }`}>
            {recommendations.length} issues found
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        {/* Priority Summary */}
        <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Flame className="h-5 w-5 text-primary mr-2" />
              <h4 className="font-medium">Impact Level</h4>
            </div>
            <span className={`text-sm font-medium ${
              highPriorityCount > 0 ? 'text-red-700' : 
              mediumPriorityCount > 0 ? 'text-amber-700' : 
              'text-green-700'
            }`}>
              {highPriorityCount > 0 ? 'Critical Issues Present' : 
               mediumPriorityCount > 0 ? 'Moderate Issues Present' : 
               'Minor Issues Only'}
            </span>
          </div>
          
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none">High</Badge>
                <Progress value={highPriorityCount > 0 ? 100 : 0} className="w-24 h-2" indicatorClassName="bg-red-500" />
              </div>
              <span className="text-sm font-medium">{highPriorityCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">Medium</Badge>
                <Progress value={mediumPriorityCount > 0 ? 100 : 0} className="w-24 h-2" indicatorClassName="bg-amber-500" />
              </div>
              <span className="text-sm font-medium">{mediumPriorityCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">Low</Badge>
                <Progress value={lowPriorityCount > 0 ? 100 : 0} className="w-24 h-2" indicatorClassName="bg-blue-500" />
              </div>
              <span className="text-sm font-medium">{lowPriorityCount}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Overall SEO Health</span>
              <span className={`text-sm font-bold ${
                completionPercentage >= 80 ? 'text-green-600' : 
                completionPercentage >= 60 ? 'text-amber-600' : 
                'text-red-600'
              }`}>{Math.round(completionPercentage)}%</span>
            </div>
            <Progress 
              value={completionPercentage} 
              className="h-2 mt-2"
              indicatorClassName={
                completionPercentage >= 80 ? 'bg-green-500' : 
                completionPercentage >= 60 ? 'bg-amber-500' : 
                'bg-red-500'
              }
            />
          </div>
        </div>

        {/* Recommendations Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 grid grid-cols-4 bg-slate-100 p-1">
            <TabsTrigger value="all" className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              All <Badge className="ml-1">{recommendations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="high" className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              High <Badge variant="destructive" className="ml-1">{highPriorityCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="medium" className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Medium <Badge className="bg-amber-500 ml-1">{mediumPriorityCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="low" className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Low <Badge className="bg-blue-500 ml-1">{lowPriorityCount}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              {recommendations.map((rec, index) => (
                <RecommendationCard key={index} recommendation={rec} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="high" className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              {highPriorityRecs.length > 0 ? (
                highPriorityRecs.map((rec, index) => (
                  <RecommendationCard key={index} recommendation={rec} />
                ))
              ) : (
                <div className="text-center p-6 bg-slate-50 rounded-lg">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                  <p className="text-slate-600">No high priority issues found!</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="medium" className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              {mediumPriorityRecs.length > 0 ? (
                mediumPriorityRecs.map((rec, index) => (
                  <RecommendationCard key={index} recommendation={rec} />
                ))
              ) : (
                <div className="text-center p-6 bg-slate-50 rounded-lg">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                  <p className="text-slate-600">No medium priority issues found!</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="low" className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              {lowPriorityRecs.length > 0 ? (
                lowPriorityRecs.map((rec, index) => (
                  <RecommendationCard key={index} recommendation={rec} />
                ))
              ) : (
                <div className="text-center p-6 bg-slate-50 rounded-lg">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                  <p className="text-slate-600">No low priority issues found!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* SEO Help Section */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex">
            <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-700 mb-1">What are these recommendations?</h4>
              <p className="text-xs text-blue-600">
                These suggestions are tailored to improve your website's visibility in search engines. 
                Start with high-priority items for the biggest impact. Each recommendation includes
                a clear explanation and specific code suggestions when applicable.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Individual recommendation card component
interface RecommendationCardProps {
  recommendation: {
    priority: 'high' | 'medium' | 'low';
    type: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    code?: string;
  };
}

function RecommendationCard({ recommendation: rec }: RecommendationCardProps) {
  return (
    <div 
      className={`border rounded-lg p-4 shadow-sm ${
        rec.type === 'error' ? 'border-red-200 bg-red-50' : 
        rec.type === 'warning' ? 'border-amber-200 bg-amber-50' : 'border-blue-200 bg-blue-50'
      }`}
    >
      <div className="flex items-start">
        <div className={`rounded-full p-2 mr-3 flex-shrink-0 ${
          rec.type === 'error' ? 'bg-red-100' : 
          rec.type === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
        }`}>
          {rec.type === 'error' ? (
            <XCircle className={`h-5 w-5 text-red-600`} />
          ) : rec.type === 'warning' ? (
            <AlertTriangle className={`h-5 w-5 text-amber-600`} />
          ) : (
            <Info className={`h-5 w-5 text-blue-600`} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-semibold ${
              rec.type === 'error' ? 'text-red-800' : 
              rec.type === 'warning' ? 'text-amber-800' : 'text-blue-800'
            }`}>
              {rec.title}
            </h4>
            <Badge className={`${
              rec.priority === 'high' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
              rec.priority === 'medium' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' :
              'bg-blue-100 text-blue-800 hover:bg-blue-200'
            } border-none`}>
              {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
            </Badge>
          </div>
          <p className={`text-sm mb-3 ${
            rec.type === 'error' ? 'text-red-700' : 
            rec.type === 'warning' ? 'text-amber-700' : 'text-blue-700'
          }`}>
            {rec.description}
          </p>
          {rec.code && (
            <div className="bg-white p-3 rounded border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap overflow-x-auto">
              {rec.code}
            </div>
          )}
          <div className="mt-3 flex justify-end">
            <div className="flex items-center text-xs text-slate-500">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>Implementing this will improve your SEO score</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
