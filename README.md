# SEO Tag Tracker

A powerful SEO analysis tool that helps you optimize your website's meta tags, social media sharing appearance, and overall search engine visibility. This tool provides comprehensive analysis and recommendations for improving your website's SEO performance.

## Features

- **Meta Tag Analysis**: Analyzes essential meta tags including title, description, canonical URLs, robots directives, and viewport settings
- **Social Media Optimization**: Checks Open Graph and Twitter Card tags for optimal social media sharing
- **SEO Scoring System**: Provides detailed scoring for each SEO element and an overall SEO health score
- **Smart Recommendations**: Generates actionable recommendations based on analysis results
- **Language Detection**: Identifies and validates HTML language attributes
- **Mobile Responsiveness**: Checks viewport meta tags for mobile optimization

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS for styling
- **Backend**: Node.js with Express and TypeScript
- **HTML Parsing**: Cheerio for efficient HTML parsing and analysis
- **Build Tool**: Vite for fast development and optimized production builds

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/seo-tag-tracker.git
   cd seo-tag-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create necessary environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration.

## Development

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter the URL of the website you want to analyze
2. The tool will analyze various SEO elements including:
   - Title tag optimization
   - Meta description effectiveness
   - Canonical URL implementation
   - Robots meta directives
   - Social media sharing optimization
   - Mobile responsiveness settings
3. Review the detailed analysis report with scores and recommendations
4. Implement suggested improvements to enhance your SEO

## API Reference

### Analyze SEO

```typescript
POST /api/analyze
Body: {
  url: string
}
Response: {
  url: string
  title: string
  description: string
  metaTags: MetaTagType[]
  ogTags: OgTagType[]
  twitterTags: TwitterTagType[]
  score: number
  recommendations: Recommendation[]
}
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Cheerio](https://github.com/cheeriojs/cheerio) for HTML parsing
- [React](https://reactjs.org/) for the frontend framework
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Tailwind CSS](https://tailwindcss.com/) for styling
