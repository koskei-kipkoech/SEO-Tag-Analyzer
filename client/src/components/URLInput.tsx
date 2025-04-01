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
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Enter Website URL
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-4 w-4 text-slate-400" />
                        </div>
                        <Input
                          placeholder="https://example.com"
                          className="pl-10 w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
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
                className="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition duration-200 flex items-center"
                disabled={isLoading}
              >
                <span>Analyze</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            <p>
              Example URLs:{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setExampleUrl("twitter.com")}
              >
                twitter.com
              </button>
              ,{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setExampleUrl("airbnb.com")}
              >
                airbnb.com
              </button>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Helper to normalize URL input
function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return url;
  }
  return url;
}
