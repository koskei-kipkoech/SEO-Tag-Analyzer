export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-12 space-y-6 mb-12">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary absolute top-0 left-0"></div>
      </div>
      <p className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-700 font-bold text-xl">Analyzing SEO tags...</p>
      <div className="text-sm text-slate-600 max-w-md text-center px-4">
        <p>We're fetching and parsing the website's HTML to extract and evaluate all SEO-related meta tags, including title, description, Open Graph tags, Twitter cards, and more.</p>
      </div>
      <div className="flex items-center space-x-2 mt-4 text-primary text-sm">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300"></div>
      </div>
    </div>
  );
}
