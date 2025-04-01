import { useState } from "react";
import URLInput from "@/components/URLInput";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import ResultsContainer from "@/components/ResultsContainer";
import Footer from "@/components/Footer";
import { SeoAnalysisResult } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<SeoAnalysisResult | null>(null);

  const handleAnalyze = async (inputUrl: string) => {
    setUrl(inputUrl);
    setIsAnalyzing(true);
    try {
      const response = await apiRequest("POST", "/api/analyze", { url: inputUrl });
      const result = await response.json();
      setAnalysisResult(result);
      return result;
    } catch (error) {
      console.error("Error analyzing URL:", error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReanalyze = async () => {
    if (url) {
      setIsAnalyzing(true);
      try {
        const response = await apiRequest("POST", "/api/analyze", { url });
        const result = await response.json();
        setAnalysisResult(result);
      } catch (error) {
        console.error("Error reanalyzing URL:", error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const showResults = !isAnalyzing && analysisResult;
  const showEmpty = !isAnalyzing && !analysisResult;
  const showLoading = isAnalyzing;

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 font-sans min-h-screen">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-6 sm:mb-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
            <div className="flex items-center mb-4 sm:mb-0">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-10 w-10 text-primary mr-3" 
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
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-700">SEO Tag Analyzer</h1>
            </div>
          </div>
          <p className="text-slate-600 max-w-3xl mx-auto sm:mx-0">
            Analyze any website's SEO meta tags, visualize Google & social media previews, 
            and get recommendations to improve your search engine ranking.
          </p>
        </header>

        {/* URL input form */}
        <URLInput onAnalyze={handleAnalyze} />

        {/* Display states */}
        {showLoading && <LoadingState />}
        {showEmpty && <EmptyState />}
        {showResults && analysisResult && (
          <ResultsContainer 
            analysis={analysisResult} 
            onReanalyze={handleReanalyze} 
          />
        )}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
