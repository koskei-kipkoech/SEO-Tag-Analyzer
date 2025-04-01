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
  const { url, title, description, ogTags, twitterTags, metaTags } = analysis;
  
  // Format URL for display
  const displayUrl = url.replace(/^https?:\/\//, '');
  
  // Get Open Graph values
  const ogTitle = ogTags.find(tag => tag.property === 'og:title')?.content || title || '';
  const ogDescription = ogTags.find(tag => tag.property === 'og:description')?.content || description || '';
  const ogImage = ogTags.find(tag => tag.property === 'og:image')?.content || '';
  
  // Get Twitter Card values
  const twitterTitle = twitterTags.find(tag => tag.name === 'twitter:title')?.content || ogTitle;
  const twitterDescription = twitterTags.find(tag => tag.name === 'twitter:description')?.content || ogDescription;
  const twitterImage = twitterTags.find(tag => tag.name === 'twitter:image')?.content || ogImage;
  
  // Meta tag score calculation
  const titleScore = metaTags.find(tag => tag.name === 'Title')?.score || 0;
  const descriptionScore = metaTags.find(tag => tag.name === 'Description')?.score || 0;
  const urlScore = 100; // We'll assume URLs are well-structured

  return (
    <Tabs defaultValue="google" className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-slate-200">
        <TabsList className="h-auto bg-transparent border-b p-0">
          <TabsTrigger 
            value="google" 
            className="px-4 py-3 text-sm font-medium data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
          >
            Google Preview
          </TabsTrigger>
          <TabsTrigger 
            value="facebook" 
            className="px-4 py-3 text-sm font-medium data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
          >
            Facebook Preview
          </TabsTrigger>
          <TabsTrigger 
            value="twitter" 
            className="px-4 py-3 text-sm font-medium data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
          >
            Twitter Preview
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="google" className="p-6 mt-0">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <Search className="h-5 w-5 text-primary mr-2" />
          Google Search Result Preview
        </h3>

        <div className="border border-slate-200 rounded-md p-4 max-w-2xl">
          <div className="text-xl text-blue-700 font-medium mb-1 truncate">
            {title || 'No title tag found'}
          </div>
          <div className="text-green-700 text-sm mb-1">
            {displayUrl}
          </div>
          <div className="text-sm text-slate-700 line-clamp-2">
            {description || 'No description meta tag found'}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium text-slate-700 mb-2">Analysis</h4>
          <div className="space-y-4">
            <ScoreItem label="Title Tag" score={titleScore} />
            <ScoreItem label="Meta Description" score={descriptionScore} />
            <ScoreItem label="URL Structure" score={urlScore} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="facebook" className="p-6 mt-0">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <Facebook className="h-5 w-5 text-blue-600 mr-2" />
          Facebook Preview
        </h3>

        <div className="border border-slate-200 rounded-md overflow-hidden max-w-md shadow-sm">
          {ogImage ? (
            <div className="h-52 bg-slate-100 overflow-hidden">
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
            <div className="h-52 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
              No og:image tag found
            </div>
          )}
          <div className="p-3 bg-white">
            <div className="text-sm text-slate-500">{displayUrl}</div>
            <h3 className="text-base font-semibold my-1 text-slate-800">
              {ogTitle || 'No og:title tag found'}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2">
              {ogDescription || 'No og:description tag found'}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <h4 className="font-medium text-slate-700">Open Graph Tags Analysis</h4>
          {ogTags.length > 0 ? (
            <ul className="text-sm space-y-2">
              {ogTags.map((tag, index) => (
                <li key={index} className="flex text-sm">
                  <span className="w-24 flex-shrink-0 font-medium text-slate-600">
                    {tag.property.replace('og:', '')}
                  </span>
                  <span className="text-slate-700 break-words font-mono bg-slate-50 p-1 rounded text-xs flex-grow">
                    {tag.content}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
              No Open Graph tags found. These tags are important for proper display when shared on Facebook and other platforms.
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="twitter" className="p-6 mt-0">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <Twitter className="h-5 w-5 text-blue-400 mr-2" />
          Twitter Preview
        </h3>

        <div className="border border-slate-200 rounded-md overflow-hidden max-w-md shadow-sm">
          {twitterImage ? (
            <div className="h-52 bg-slate-100 overflow-hidden">
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
            <div className="h-52 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
              No twitter:image tag found
            </div>
          )}
          <div className="p-3 bg-white">
            <h3 className="text-base font-semibold my-1 text-slate-800">
              {twitterTitle || 'No twitter:title tag found'}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2">
              {twitterDescription || 'No twitter:description tag found'}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <h4 className="font-medium text-slate-700">Twitter Card Tags Analysis</h4>
          {twitterTags.length > 0 ? (
            <ul className="text-sm space-y-2">
              {twitterTags.map((tag, index) => (
                <li key={index} className="flex text-sm">
                  <span className="w-24 flex-shrink-0 font-medium text-slate-600">
                    {tag.name.replace('twitter:', '')}
                  </span>
                  <span className="text-slate-700 break-words font-mono bg-slate-50 p-1 rounded text-xs flex-grow">
                    {tag.content}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
              No Twitter Card tags found. These tags are important for proper display when shared on Twitter.
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

  return (
    <div className="flex items-center">
      <div className="w-32 flex-shrink-0">
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <div className="flex-grow mx-4">
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getScoreColor(score)} rounded-full`} 
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
      <div className="w-10 text-right">
        <span className="text-sm font-medium text-slate-700">{score}%</span>
      </div>
    </div>
  );
}
