import { type SeoAnalysisResult } from "@shared/schema";
import { Tags, Share2, CheckCircle, AlertCircle, XCircle, InfoIcon } from "lucide-react";

interface DetailedAnalysisProps {
  analysis: SeoAnalysisResult;
}

export default function DetailedAnalysis({ analysis }: DetailedAnalysisProps) {
  const { metaTags, ogTags, twitterTags } = analysis;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Meta Tags Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <Tags className="h-5 w-5 text-primary mr-2" />
          Meta Tags Analysis
        </h3>

        <div className="space-y-4">
          {metaTags.map((tag, index) => (
            <MetaTagItem 
              key={index}
              name={tag.name} 
              content={tag.content}
              status={tag.status}
              score={tag.score}
            />
          ))}
        </div>
      </div>

      {/* Social Media Tags */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <Share2 className="h-5 w-5 text-primary mr-2" />
          Social Media Tags
        </h3>

        <div className="space-y-4">
          {/* Open Graph Tags */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center mb-3">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600 mr-2">
                <path
                  fill="currentColor"
                  d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"
                />
              </svg>
              <h4 className="font-medium text-slate-700">Open Graph Tags</h4>
            </div>
            <div className="space-y-2">
              {ogTags.length > 0 ? (
                ogTags.map((tag, index) => (
                  <div key={index} className="flex text-sm">
                    <span className="w-24 flex-shrink-0 font-medium text-slate-600">
                      {tag.property.replace('og:', '')}
                    </span>
                    <span className="text-slate-700 break-words font-mono bg-slate-50 p-1 rounded text-xs flex-grow">
                      {tag.content}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-600 italic">
                  No Open Graph tags found
                </div>
              )}
            </div>
          </div>

          {/* Twitter Card Tags */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center mb-3">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-400 mr-2">
                <path
                  fill="currentColor"
                  d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23Z"
                />
              </svg>
              <h4 className="font-medium text-slate-700">Twitter Card Tags</h4>
            </div>
            <div className="space-y-2">
              {twitterTags.length > 0 ? (
                twitterTags.map((tag, index) => (
                  <div key={index} className="flex text-sm">
                    <span className={`w-24 flex-shrink-0 font-medium text-slate-600 ${
                      tag.name === 'twitter:image:alt' ? 'text-amber-500 flex items-center' : ''
                    }`}>
                      {tag.name.replace('twitter:', '')}
                      {tag.name === 'twitter:image:alt' && (
                        <AlertCircle className="h-3 w-3 ml-1 text-amber-500" />
                      )}
                    </span>
                    <span className="text-slate-700 break-words font-mono bg-slate-50 p-1 rounded text-xs flex-grow">
                      {tag.content}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-600 italic">
                  No Twitter Card tags found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
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
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            <CheckCircle className="inline mr-1 h-3 w-3" /> Good
          </span>
        );
      case 'warning':
        return (
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
            <AlertCircle className="inline mr-1 h-3 w-3" /> Warning
          </span>
        );
      case 'error':
        return (
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            <XCircle className="inline mr-1 h-3 w-3" /> Missing
          </span>
        );
      case 'info':
        return (
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            <InfoIcon className="inline mr-1 h-3 w-3" /> Info
          </span>
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
