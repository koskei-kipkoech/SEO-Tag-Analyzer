import { AlertTriangle, Info, XCircle, Lightbulb } from "lucide-react";

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
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600 mb-4 flex items-center">
          <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
          Recommendations for Improvement
        </h3>
        <div className="p-4 text-center bg-green-50 rounded-lg border border-green-100">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <p className="text-green-700 font-medium">
            Great job! We don't have any specific recommendations for improvement.
          </p>
          <p className="text-sm text-green-600 mt-2">
            Your website's SEO implementation meets current best practices.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600 mb-4 flex items-center">
        <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
        Recommendations for Improvement
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {recommendations.map((rec, index) => (
          <div 
            key={index} 
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
              <div>
                <h4 className={`font-semibold mb-2 ${
                  rec.type === 'error' ? 'text-red-800' : 
                  rec.type === 'warning' ? 'text-amber-800' : 'text-blue-800'
                }`}>
                  {rec.title}
                </h4>
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
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
