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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
          Recommendations for Improvement
        </h3>
        <div className="p-4 text-center">
          <p className="text-slate-600">
            Great job! We don't have any specific recommendations for improvement.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
        Recommendations for Improvement
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec, index) => (
          <div key={index} className="border border-slate-200 rounded-md p-4 bg-slate-50">
            <div className="flex items-start">
              <div className={`rounded-full p-2 mr-3 ${
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
                <h4 className="font-medium text-slate-800 mb-1">{rec.title}</h4>
                <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
                {rec.code && (
                  <div className="bg-white p-2 rounded border border-slate-200 text-xs font-mono text-slate-600 whitespace-pre-wrap">
                    {rec.code}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
