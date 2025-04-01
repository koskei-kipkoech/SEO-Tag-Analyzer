export default function Footer() {
  return (
    <footer className="mt-12 text-center text-sm text-slate-500">
      <p>© {new Date().getFullYear()} SEO Tag Analyzer. All rights reserved.</p>
      <div className="mt-2">
        <a href="#" className="text-primary hover:underline mx-2">Privacy Policy</a>
        <a href="#" className="text-primary hover:underline mx-2">Terms of Service</a>
        <a href="#" className="text-primary hover:underline mx-2">Contact</a>
      </div>
    </footer>
  );
}
