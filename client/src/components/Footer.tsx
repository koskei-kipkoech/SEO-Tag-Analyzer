export default function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-slate-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-primary mr-2" 
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
            <span className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-700">
              SEO Tag Analyzer
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4 text-center">
            Analyze any website's SEO meta tags, visualize previews, and get actionable recommendations.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
            <a href="#" className="text-primary hover:text-blue-700 text-sm font-medium hover:underline transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-primary hover:text-blue-700 text-sm font-medium hover:underline transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-primary hover:text-blue-700 text-sm font-medium hover:underline transition-colors">
              Contact
            </a>
          </div>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} SEO Tag Analyzer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
