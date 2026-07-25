'use client';

import Link from 'next/link';
import {
  Search,
  Globe,
  Link2,
  TrendingUp,
  ClipboardCheck,
  Sparkles,
  MessageSquare,
  Bookmark,
  Bot,
  ArrowRight,
} from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { MarketingFooter } from '@/components/marketing-footer';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  { icon: Search, slug: 'keyword-research', title: 'Keyword Research', description: 'Discover keyword ideas with search volume, CPC, and difficulty metrics. Uses DataForSEO Labs data.' },
  { icon: Globe, slug: 'domain-overview', title: 'Domain Overview', description: 'Analyze any domain’s organic traffic, ranked keywords, and top pages from a single search.' },
  { icon: Link2, slug: 'backlink-checker', title: 'Backlink Checker', description: 'Explore backlink profiles, referring domains, and top linked pages for any domain.' },
  { icon: TrendingUp, slug: 'rank-tracking', title: 'Rank Tracking', description: 'Track keyword positions for your domain over time. Positions are stored locally in your browser.' },
  { icon: ClipboardCheck, slug: 'site-audit', title: 'Site Audit', description: 'Run Lighthouse audits on any URL to find performance, SEO, and accessibility issues.' },
  { icon: Sparkles, slug: 'ai-brand-visibility', title: 'AI Brand Visibility', description: 'See how AI search engines like ChatGPT and Google AI mention your brand across prompts.' },
  { icon: MessageSquare, slug: 'ai-search-prompts', title: 'AI Search Prompts', description: 'Compare answers from ChatGPT, Claude, Gemini, and Perplexity side by side for any prompt.' },
  { icon: Bookmark, slug: 'saved-keywords', title: 'Saved Keywords', description: 'Organize and export keywords you’ve saved from research sessions. All stored locally.' },
  { icon: Bot, slug: 'ai-insight-agent', title: 'AI Insight Agent', description: 'Generate actionable SEO plans, content strategies, and technical fixes powered by OpenRouter AI.' },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Features</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Eight SEO tools, all running in your browser with your own
            DataForSEO and OpenRouter keys. Free, local-first, and private.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.slug} href={`/features/${f.slug}`}>
              <Card className="group h-full transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
