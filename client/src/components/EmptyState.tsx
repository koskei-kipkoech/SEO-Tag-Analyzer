import { Search, Tags, BarChart3, Share2, Lightbulb, Code } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center mb-12">
      <div className="bg-slate-100 rounded-full p-6 w-24 h-24 flex items-center justify-center">
        <Search className="h-12 w-12 text-slate-400" />
      </div>
      <h2 className="text-xl font-bold text-slate-800">
        Enter a URL to analyze SEO tags
      </h2>
      <p className="text-slate-600 max-w-md">
        Get a comprehensive analysis of meta tags, preview search and social results, and receive recommendations for improvement.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 max-w-xl">
        <FeatureCard icon={<Tags className="h-6 w-6 text-primary" />} title="Meta Tag Analysis" />
        <FeatureCard icon={<Search className="h-6 w-6 text-primary" />} title="Google Preview" />
        <FeatureCard icon={<Share2 className="h-6 w-6 text-primary" />} title="Social Media Cards" />
        <FeatureCard icon={<BarChart3 className="h-6 w-6 text-primary" />} title="SEO Score" />
        <FeatureCard icon={<Lightbulb className="h-6 w-6 text-primary" />} title="Recommendations" />
        <FeatureCard icon={<Code className="h-6 w-6 text-primary" />} title="HTML Analysis" />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
}

function FeatureCard({ icon, title }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 flex flex-col items-center text-center">
      {icon}
      <span className="text-sm font-medium text-slate-700 mt-2">{title}</span>
    </div>
  );
}
