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
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/seo/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const tools = [
  {
    href: '/app/keywords',
    title: 'Keyword Research',
    description: 'Find keyword ideas, search volumes, difficulty, and SERP analysis.',
    icon: Search,
  },
  {
    href: '/app/domain',
    title: 'Domain Overview',
    description: 'Analyze any domain’s organic traffic, keywords, and top pages.',
    icon: Globe,
  },
  {
    href: '/app/backlinks',
    title: 'Backlinks',
    description: 'Explore backlink profiles, referring domains, and top linked pages.',
    icon: Link2,
  },
  {
    href: '/app/rank-tracking',
    title: 'Rank Tracking',
    description: 'Track keyword positions over time for your domain.',
    icon: TrendingUp,
  },
  {
    href: '/app/audit',
    title: 'Site Audit',
    description: 'Crawl your site and run Lighthouse audits to find technical issues.',
    icon: ClipboardCheck,
  },
  {
    href: '/app/brand-lookup',
    title: 'Brand Lookup',
    description: 'See how AI search engines mention your brand.',
    icon: Sparkles,
  },
  {
    href: '/app/prompt-explorer',
    title: 'Prompt Explorer',
    description: 'Compare answers from ChatGPT, Claude, Gemini, and Perplexity.',
    icon: MessageSquare,
  },
  {
    href: '/app/saved',
    title: 'Saved Keywords',
    description: 'Organize and tag keywords you’ve saved from research.',
    icon: Bookmark,
  },
  {
    href: '/app/ai-insights',
    title: 'AI Insight Agent',
    description: 'Generate actionable SEO plans and content strategies with AI.',
    icon: Bot,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.username}. Pick a tool to get started.`}
      />

      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <Card className="group h-full transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{tool.title}</CardTitle>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </CardHeader>
                <CardContent>
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
