import { type SeoAnalysisResult } from "@shared/schema";
import OverallScoreCard from "./OverallScoreCard";
import PreviewTabs from "./PreviewTabs";
import DetailedAnalysis from "./DetailedAnalysis";
import Recommendations from "./Recommendations";

interface ResultsContainerProps {
  analysis: SeoAnalysisResult;
  onReanalyze: () => void;
}

export default function ResultsContainer({ analysis, onReanalyze }: ResultsContainerProps) {
  if (!analysis) return null;
  
  // Make sure recommendations is an array before passing it
  const recommendations = analysis.recommendations && Array.isArray(analysis.recommendations) ? 
    analysis.recommendations : [];

  return (
    <div className="space-y-8 mb-12">
      <OverallScoreCard 
        analysis={analysis} 
        onReanalyze={onReanalyze}
      />
      <PreviewTabs analysis={analysis} />
      <DetailedAnalysis analysis={analysis} />
      <Recommendations recommendations={recommendations} />
    </div>
  );
}
