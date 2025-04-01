export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 mb-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="text-slate-600 font-medium">Analyzing SEO tags...</p>
      <div className="text-sm text-slate-500 max-w-md text-center">
        <p>We're fetching and parsing the website's HTML to extract all SEO-related meta tags.</p>
      </div>
    </div>
  );
}
