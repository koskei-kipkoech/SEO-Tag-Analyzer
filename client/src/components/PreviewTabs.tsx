import { useState } from "react";
import { type SeoAnalysisResult } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  Facebook,
  Twitter
} from "lucide-react";

interface PreviewTabsProps {
  analysis: SeoAnalysisResult;
}

export default function PreviewTabs({ analysis }: PreviewTabsProps) {
  // Add null check to ensure analysis exists and has all required properties
  if (!analysis || !analysis.url) {
    return null;
  }
  
  // Destructure safely
  const { 
    url, 
    title = '',
    description = '',
    ogTags = [],
    twitterTags = [],
    metaTags = []
  } = analysis;
  
  // Format URL for display
  const displayUrl = url.replace(/^https?:\/\//, '');
  
  // Get Open Graph values - with null safety
  const ogTitle = ogTags && Array.isArray(ogTags) ? 
    ogTags.find(tag => tag?.property === 'og:title')?.content || title || '' : '';
  const ogDescription = ogTags && Array.isArray(ogTags) ? 
    ogTags.find(tag => tag?.property === 'og:description')?.content || description || '' : '';
  const ogImage = ogTags && Array.isArray(ogTags) ? 
    ogTags.find(tag => tag?.property === 'og:image')?.content || '' : '';
  
  // Get Twitter Card values - with null safety
  const twitterTitle = twitterTags && Array.isArray(twitterTags) ? 
    twitterTags.find(tag => tag?.name === 'twitter:title')?.content || ogTitle : '';
  const twitterDescription = twitterTags && Array.isArray(twitterTags) ? 
    twitterTags.find(tag => tag?.name === 'twitter:description')?.content || ogDescription : '';
  const twitterImage = twitterTags && Array.isArray(twitterTags) ? 
    twitterTags.find(tag => tag?.name === 'twitter:image')?.content || ogImage : '';
  
  // Meta tag score calculation - with null safety
  const titleScore = metaTags && Array.isArray(metaTags) ? 
    metaTags.find(tag => tag?.name === 'Title')?.score || 0 : 0;
  const descriptionScore = metaTags && Array.isArray(metaTags) ? 
    metaTags.find(tag => tag?.name === 'Description')?.score || 0 : 0;
  const urlScore = 100; // We'll assume URLs are well-structured

  return (
    <Tabs defaultValue="google" className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-slate-200 overflow-x-auto">
        <TabsList className="h-auto bg-transparent border-b p-0 min-w-max">
          <TabsTrigger 
            value="google" 
            className="px-4 py-3 text-sm font-medium data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none data-[state=active]:font-semibold"
          >
            <Search className="h-4 w-4 mr-1.5 inline" />
            Google Preview
          </TabsTrigger>
          <TabsTrigger 
            value="facebook" 
            className="px-4 py-3 text-sm font-medium data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none data-[state=active]:font-semibold"
          >
            <Facebook className="h-4 w-4 mr-1.5 inline" />
            Facebook Preview
          </TabsTrigger>
          <TabsTrigger 
            value="twitter" 
            className="px-4 py-3 text-sm font-medium data-[state=active]:text-blue-400 data-[state=active]:border-blue-400 border-b-2 border-transparent data-[state=active]:border-blue-400 rounded-none data-[state=active]:font-semibold"
          >
            <Twitter className="h-4 w-4 mr-1.5 inline" />
            Twitter Preview
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="google" className="p-4 sm:p-6 mt-0">
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-700 mb-4 flex items-center">
          <Search className="h-5 w-5 text-primary mr-2" />
          Google Search Result Preview
        </h3>

        <div className="border border-slate-200 rounded-md p-4 max-w-2xl shadow-sm bg-white">
          <div className="text-xl text-blue-700 font-medium mb-1 truncate hover:underline cursor-pointer">
            {title || 'No title tag found'}
          </div>
          <div className="text-green-700 text-sm mb-1 flex items-center">
            <span className="overflow-hidden text-ellipsis">{displayUrl}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-slate-700 line-clamp-2">
            {description || 'No description meta tag found'}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-slate-700 mb-3 pb-2 border-b border-slate-100">Analysis</h4>
          <div className="space-y-4">
            <ScoreItem label="Title Tag" score={titleScore} />
            <ScoreItem label="Meta Description" score={descriptionScore} />
            <ScoreItem label="URL Structure" score={urlScore} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="facebook" className="p-4 sm:p-6 mt-0">
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-4 flex items-center">
          <Facebook className="h-5 w-5 text-blue-600 mr-2" />
          Facebook Preview
        </h3>

        <div className="border border-slate-200 rounded-md overflow-hidden max-w-md shadow-sm">
          {ogImage ? (
            <div className="h-52 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                {ogImage.startsWith('http') ? (
                  <img
                    src={ogImage}
                    alt="Open Graph preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5Ij5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                ) : (
                  <span>Image URL: {ogImage}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="h-52 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-400 text-sm">
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 mb-2 text-slate-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                No og:image tag found
              </div>
            </div>
          )}
          <div className="p-4 bg-white">
            <div className="text-sm text-slate-500">{displayUrl}</div>
            <h3 className="text-base font-semibold my-1 text-slate-800 hover:text-blue-600 cursor-pointer">
              {ogTitle || 'No og:title tag found'}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2">
              {ogDescription || 'No og:description tag found'}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-slate-700 mb-3 pb-2 border-b border-slate-100">Open Graph Tags Analysis</h4>
          {ogTags.length > 0 ? (
            <div className="overflow-x-auto">
              <ul className="text-sm space-y-2">
                {ogTags.map((tag, index) => (
                  <li key={index} className="flex text-sm">
                    <span className="w-24 flex-shrink-0 font-medium text-slate-600">
                      {tag.property.replace('og:', '')}
                    </span>
                    <span className="text-slate-700 break-words font-mono bg-slate-50 p-1 rounded text-xs flex-grow overflow-x-auto">
                      {tag.content}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">
              <div className="flex">
                <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                No Open Graph tags found. These tags are important for proper display when shared on Facebook and other platforms.
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="twitter" className="p-4 sm:p-6 mt-0">
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-4 flex items-center">
          <Twitter className="h-5 w-5 text-blue-400 mr-2" />
          Twitter Preview
        </h3>

        <div className="border border-slate-200 rounded-md overflow-hidden max-w-md shadow-sm">
          {twitterImage ? (
            <div className="h-52 bg-gradient-to-br from-blue-50 to-slate-100 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                {twitterImage.startsWith('http') ? (
                  <img
                    src={twitterImage}
                    alt="Twitter Card preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5Ij5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                ) : (
                  <span>Image URL: {twitterImage}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="h-52 bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center text-slate-400 text-sm">
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 mb-2 text-blue-200" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                No twitter:image tag found
              </div>
            </div>
          )}
          <div className="p-4 bg-white">
            <h3 className="text-base font-semibold my-1 text-slate-800 hover:text-blue-500 cursor-pointer">
              {twitterTitle || 'No twitter:title tag found'}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2">
              {twitterDescription || 'No twitter:description tag found'}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-slate-700 mb-3 pb-2 border-b border-slate-100">Twitter Card Tags Analysis</h4>
          {twitterTags.length > 0 ? (
            <div className="overflow-x-auto">
              <ul className="text-sm space-y-2">
                {twitterTags.map((tag, index) => (
                  <li key={index} className="flex text-sm">
                    <span className="w-24 flex-shrink-0 font-medium text-slate-600">
                      {tag.name.replace('twitter:', '')}
                    </span>
                    <span className="text-slate-700 break-words font-mono bg-slate-50 p-1 rounded text-xs flex-grow overflow-x-auto">
                      {tag.content}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">
              <div className="flex">
                <svg className="w-5 h-5 mr-2 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>No Twitter Card tags found. These tags are important for proper display when shared on Twitter.</span>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}

interface ScoreItemProps {
  label: string;
  score: number;
}

function ScoreItem({ label, score }: ScoreItemProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 50) return 'bg-warning';
    return 'bg-error';
  };

  const getTextColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center mb-3 bg-white p-3 rounded-lg shadow-sm border border-slate-100">
      <div className="w-full sm:w-32 flex-shrink-0 mb-2 sm:mb-0">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
      <div className="flex-grow sm:mx-4">
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full ${getScoreColor(score)} rounded-full transition-all duration-500 ease-out`} 
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
      <div className="w-14 text-right mt-1 sm:mt-0">
        <span className={`text-sm font-bold ${getTextColor(score)}`}>{score}%</span>
      </div>
    </div>
  );
}
