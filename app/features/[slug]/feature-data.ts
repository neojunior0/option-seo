export type FeatureData = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  workflows: { title: string; description: string }[];
  useCases: string[];
  faqs: { question: string; answer: string }[];
};

export const featureDetails: Record<string, FeatureData> = {
  'keyword-research': {
    slug: 'keyword-research',
    eyebrow: 'Keyword Research',
    title: 'Find keyword ideas with real search data',
    description:
      'Discover keyword ideas powered by DataForSEO Labs. Get search volume, CPC, competition, keyword difficulty, and intent for every suggestion — all fetched live from your own DataForSEO quota.',
    workflows: [
      { title: 'Enter a seed keyword', description: 'Type any keyword and OptionSEO fetches dozens of related ideas with full metrics.' },
      { title: 'Review the data', description: 'See volume, CPC, difficulty, and intent for each suggestion in a sortable table.' },
      { title: 'Save what matters', description: 'Bookmark keywords to your saved list — stored locally in your browser for later.' },
    ],
    useCases: [
      'Build a content calendar from high-volume, low-difficulty keywords',
      'Validate product or landing page ideas with real search demand',
      'Identify long-tail opportunities competitors are missing',
    ],
    faqs: [
      { question: 'Is keyword research really free?', answer: 'Yes. OptionSEO charges nothing. Each search uses your own DataForSEO API quota, so you pay only for the data you request — typically fractions of a cent per call.' },
      { question: 'Where is my data stored?', answer: 'Saved keywords are stored in your browser local storage. Nothing is sent to an OptionSEO server.' },
    ],
  },
  'domain-overview': {
    slug: 'domain-overview',
    eyebrow: 'Domain Overview',
    title: 'Analyze any domain organic presence',
    description:
      'Get a snapshot of any domain estimated organic traffic, ranked keywords, and top pages. Compare competitors and identify content gaps — all from DataForSEO Labs data.',
    workflows: [
      { title: 'Enter a domain', description: 'Type any domain name to get its organic traffic estimate and keyword count.' },
      { title: 'Browse top keywords', description: 'See which keywords the domain ranks for, with position, volume, and difficulty.' },
      { title: 'Explore top pages', description: 'Find the domain best-performing pages by traffic and keyword count.' },
    ],
    useCases: [
      'Benchmark your domain against competitors',
      'Find pages that drive the most organic traffic to a competitor',
      'Identify keywords a competitor ranks for that you do not',
    ],
    faqs: [
      { question: 'Can I analyze any domain?', answer: 'Yes — enter any domain and OptionSEO fetches its organic visibility data from DataForSEO.' },
    ],
  },
  'backlink-checker': {
    slug: 'backlink-checker',
    eyebrow: 'Backlinks',
    title: 'Explore any domain backlink profile',
    description:
      'Get backlink counts, referring domains, top linked pages, and individual backlink rows with anchor text and domain rank. Filter and sort to find the links that matter.',
    workflows: [
      { title: 'Enter a target domain', description: 'Get a summary of total backlinks, referring domains, and spam score.' },
      { title: 'Browse backlinks', description: 'See individual backlinks with source URL, target URL, anchor text, and domain rank.' },
      { title: 'Explore referring domains', description: 'Find which domains link most to your target, sorted by backlink count and rank.' },
    ],
    useCases: [
      'Audit your own backlink profile for toxic links',
      'Find link-building opportunities by analyzing competitors',
      'Track referring domain growth over time',
    ],
    faqs: [
      { question: 'How fresh is the backlink data?', answer: 'DataForSEO provides live backlink data. Each query fetches the latest available index data.' },
    ],
  },
  'rank-tracking': {
    slug: 'rank-tracking',
    eyebrow: 'Rank Tracking',
    title: 'Track keyword positions over time',
    description:
      'Add domains and keywords, then check their Google rankings whenever you want. Position history is stored locally in your browser — no server, no database.',
    workflows: [
      { title: 'Add a domain', description: 'Create a tracking entry for any domain you want to monitor.' },
      { title: 'Add keywords', description: 'Add the keywords you want to track positions for.' },
      { title: 'Check ranks', description: 'Run a live SERP check to see current positions. Results are saved locally.' },
    ],
    useCases: [
      'Monitor your most important keywords weekly',
      'Track ranking changes after publishing new content',
      'Keep an eye on competitor positions for shared keywords',
    ],
    faqs: [
      { question: 'How often can I check rankings?', answer: 'As often as you like — each check uses your DataForSEO quota. There are no OptionSEO-imposed limits.' },
      { question: 'Where is tracking data stored?', answer: 'In your browser local storage. Clearing your browser data will remove tracked domains and history.' },
    ],
  },
  'site-audit': {
    slug: 'site-audit',
    eyebrow: 'Site Audit',
    title: 'Run Lighthouse audits on any URL',
    description:
      'Enter any URL and get a full Lighthouse audit with performance, SEO, and accessibility scores. Drill into individual metrics and failing audits to find what to fix.',
    workflows: [
      { title: 'Enter a URL', description: 'Type any page URL and OptionSEO runs a Lighthouse audit via DataForSEO.' },
      { title: 'Review scores', description: 'See performance, SEO, and accessibility scores with good/needs-work/poor indicators.' },
      { title: 'Drill into audits', description: 'Browse individual failing audits with descriptions and recommended fixes.' },
    ],
    useCases: [
      'Audit your homepage before a launch',
      'Find performance bottlenecks on key landing pages',
      'Check accessibility compliance on any page',
    ],
    faqs: [
      { question: 'What does the audit cover?', answer: 'Lighthouse performance, SEO, and accessibility categories. You get scores, core web vitals, and a list of failing audits.' },
    ],
  },
  'ai-brand-visibility': {
    slug: 'ai-brand-visibility',
    eyebrow: 'AI Visibility',
    title: 'See how AI search mentions your brand',
    description:
      'Brand Lookup shows how AI search engines like ChatGPT mention your brand. Get mention counts, visibility scores, cited pages, and sample prompts.',
    workflows: [
      { title: 'Enter your brand', description: 'Type your domain or brand name to analyze AI search visibility.' },
      { title: 'Review metrics', description: 'See total mentions, response counts, and a visibility score.' },
      { title: 'Explore citations', description: 'Find which pages AI engines cite when mentioning your brand.' },
    ],
    useCases: [
      'Measure your brand presence in AI-generated answers',
      'Find which content AI engines cite most about you',
      'Track AI visibility trends over time',
    ],
    faqs: [
      { question: 'Which AI platforms are covered?', answer: 'ChatGPT and Google AI Overview data are available via DataForSEO AI optimization endpoints.' },
    ],
  },
  'ai-search-prompts': {
    slug: 'ai-search-prompts',
    eyebrow: 'Prompt Explorer',
    title: 'Compare AI model answers side by side',
    description:
      'Enter any prompt and compare responses from ChatGPT, Claude, Gemini, and Perplexity in a single view. See citations, source links, and answer quality differences.',
    workflows: [
      { title: 'Enter a prompt', description: 'Type any question or prompt you want to compare across AI models.' },
      { title: 'Select models', description: 'Choose which of ChatGPT, Claude, Gemini, and Perplexity to query.' },
      { title: 'Compare answers', description: 'See each model response with cited sources side by side.' },
    ],
    useCases: [
      'Check if your brand appears in AI answers to key questions',
      'Compare how different AI models describe your product',
      'Research content opportunities from AI-generated answers',
    ],
    faqs: [
      { question: 'Which models are supported?', answer: 'ChatGPT (GPT-5), Claude (Sonnet 4.5), Gemini (2.5 Pro), and Perplexity (Sonar Reasoning Pro) via DataForSEO.' },
    ],
  },
  'saved-keywords': {
    slug: 'saved-keywords',
    eyebrow: 'Saved Keywords',
    title: 'Organize keywords into an actionable plan',
    description:
      'Save keywords from your research sessions, filter and search them, and export to CSV. All saved keywords are stored locally in your browser — no account on any server.',
    workflows: [
      { title: 'Save from research', description: 'Click the bookmark icon on any keyword in Keyword Research to save it.' },
      { title: 'Filter and search', description: 'Use the filter bar to find saved keywords by name.' },
      { title: 'Export to CSV', description: 'Download your saved keywords as a CSV file for use in spreadsheets or other tools.' },
    ],
    useCases: [
      'Build a keyword list for a content sprint',
      'Export keywords for your team to review',
      'Keep a running list of opportunities across research sessions',
    ],
    faqs: [
      { question: 'Where are saved keywords stored?', answer: 'In your browser local storage. They persist across sessions but are tied to this browser — clearing browser data removes them.' },
    ],
  },
  'ai-insight-agent': {
    slug: 'ai-insight-agent',
    eyebrow: 'AI Insight Agent',
    title: 'Generate AI-powered SEO action plans',
    description:
      'The AI Insight Agent analyzes your SEO data context and produces a structured action plan, content strategy, technical fixes, and a current-vs-recommended comparison table — powered by OpenRouter.',
    workflows: [
      { title: 'Describe your context', description: 'The agent uses the current feature context to understand what SEO data you are working with.' },
      { title: 'Generate insights', description: 'Click "Generate Insights" and the AI produces a structured report with action plan, content strategy, and technical fixes.' },
      { title: 'Act on recommendations', description: 'Follow the prioritized action plan and technical fixes to improve your SEO performance.' },
    ],
    useCases: [
      'Get a prioritized action plan for improving search rankings',
      'Generate content strategy recommendations tailored to your keyword data',
      'Identify technical SEO issues with AI-recommended fixes',
    ],
    faqs: [
      { question: 'Which AI model powers the Insight Agent?', answer: 'The agent uses OpenRouter with GPT-4o-mini by default. You can use any model available on OpenRouter by configuring your API key in Profile.' },
      { question: 'Do I need an OpenRouter API key?', answer: 'Yes. Add your OpenRouter API key in Profile > API Keys. The agent calls OpenRouter directly from your browser using your quota.' },
    ],
  },
};

export const featureSlugs = Object.keys(featureDetails);
