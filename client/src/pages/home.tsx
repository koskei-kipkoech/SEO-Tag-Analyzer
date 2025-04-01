import { useState } from "react";
import URLInput from "@/components/URLInput";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import ResultsContainer from "@/components/ResultsContainer";
import Footer from "@/components/Footer";
import { SeoAnalysisResult } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const { 
    data: analysis, 
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<SeoAnalysisResult>({
    queryKey: ["/api/analyze", url],
    enabled: false,
  });

  const handleAnalyze = async (inputUrl: string) => {
    setUrl(inputUrl);
    setIsAnalyzing(true);
    await refetch();
    setIsAnalyzing(false);
  };

  const handleReanalyze = () => {
    if (url) {
      setIsAnalyzing(true);
      refetch();
      setIsAnalyzing(false);
    }
  };

  const showResults = !isLoading && !isAnalyzing && analysis && !isError;
  const showEmpty = !isLoading && !isAnalyzing && !analysis && !isError;
  const showLoading = isLoading || isAnalyzing;

  return (
    <div className="bg-slate-100 font-sans min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-primary mr-3" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <h1 className="text-2xl font-bold text-slate-800">SEO Tag Analyzer</h1>
            </div>
          </div>
          <p className="text-slate-600 max-w-3xl">
            Analyze any website's SEO meta tags, visualize Google & social media previews, 
            and get recommendations to improve your search engine ranking.
          </p>
        </header>

        {/* URL input form */}
        <URLInput onAnalyze={handleAnalyze} />

        {/* Display states */}
        {showLoading && <LoadingState />}
        {showEmpty && <EmptyState />}
        {showResults && analysis && (
          <ResultsContainer 
            analysis={analysis} 
            onReanalyze={handleReanalyze} 
          />
        )}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
