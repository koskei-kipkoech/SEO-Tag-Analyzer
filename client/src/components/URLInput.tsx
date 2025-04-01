import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, ArrowRight } from "lucide-react";
import { seoUrlSchema, SeoUrlInput } from "@shared/schema";
import { useState } from "react";

interface URLInputProps {
  onAnalyze: (url: string) => void;
}

export default function URLInput({ onAnalyze }: URLInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<SeoUrlInput>({
    resolver: zodResolver(seoUrlSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (data: SeoUrlInput) => {
    setIsLoading(true);
    try {
      const normalizedUrl = normalizeUrl(data.url);
      await onAnalyze(normalizedUrl);
    } finally {
      setIsLoading(false);
    }
  };

  const setExampleUrl = (url: string) => {
    form.setValue("url", url, { shouldValidate: true });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8 border border-slate-100">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Analyze Your Website's SEO</h2>
        <p className="text-slate-500">Enter a URL to get detailed insights on SEO meta tags and optimization opportunities</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                      Website URL
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-4 w-4 text-slate-400" />
                        </div>
                        <Input
                          placeholder="https://example.com"
                          className="pl-10 w-full rounded-md border-slate-200 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center mt-4 pt-3 border-t border-slate-100">
            <span className="text-sm font-medium text-slate-500 mr-2 mb-2 sm:mb-0">
              Try examples:
            </span>
            <div className="flex flex-wrap gap-2">
              {["twitter.com", "airbnb.com", "google.com"].map((url) => (
                <button
                  key={url}
                  type="button"
                  className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
                  onClick={() => setExampleUrl(url)}
                >
                  {url}
                </button>
              ))}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Helper to normalize URL input
function normalizeUrl(url: string): string {
  // If URL doesn't start with http:// or https://, add https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}
