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
  Lock,
  Zap,
} from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { MarketingFooter } from '@/components/marketing-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  { icon: Search, title: 'Keyword Research', href: '/features/keyword-research', description: 'Discover keyword ideas with search volume, CPC, and difficulty metrics.' },
  { icon: Globe, title: 'Domain Overview', href: '/features/domain-overview', description: 'Analyze any domain organic traffic, ranked keywords, and top pages.' },
  { icon: Link2, title: 'Backlink Checker', href: '/features/backlink-checker', description: 'Explore backlink profiles, referring domains, and top linked pages.' },
  { icon: TrendingUp, title: 'Rank Tracking', href: '/features/rank-tracking', description: 'Track keyword positions over time and monitor your SERP performance.' },
  { icon: ClipboardCheck, title: 'Site Audit', href: '/features/site-audit', description: 'Run Lighthouse audits to find performance, SEO, and accessibility issues.' },
  { icon: Sparkles, title: 'AI Brand Visibility', href: '/features/ai-brand-visibility', description: 'See how AI search engines like ChatGPT mention your brand.' },
  { icon: MessageSquare, title: 'AI Search Prompts', href: '/features/ai-search-prompts', description: 'Compare answers from ChatGPT, Claude, Gemini, and Perplexity.' },
  { icon: Bookmark, title: 'Saved Keywords', href: '/features/saved-keywords', description: 'Organize and tag keywords you have saved from research sessions.' },
  { icon: Bot, title: 'AI Insight Agent', href: '/features/ai-insight-agent', description: 'Generate actionable SEO plans, content strategies, and technical fixes powered by AI.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            100% free · data stays in your browser
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            SEO tools that run
            <br />
            <span className="text-primary">entirely in your browser</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            OptionSEO is a free, client-side SEO toolkit. Bring your own
            DataForSEO and OpenRouter keys — your searches use your own quota,
            and your data never leaves your browser.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No email required · No credit card · No subscription
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="text-lg font-bold">1</span>
              </div>
              <h3 className="font-semibold">Create a local account</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Just pick a username and password. Everything is stored in your
                browser&apos;s local storage — no server, no email.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="text-lg font-bold">2</span>
              </div>
              <h3 className="font-semibold">Add your API keys</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Paste your DataForSEO and OpenRouter credentials in your profile.
                Keys are stored locally and sent only to the data providers.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="text-lg font-bold">3</span>
              </div>
              <h3 className="font-semibold">Start researching</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Every search uses your own API quota. Track keywords, audit
                sites, explore AI visibility — all free, all local.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Everything you need for SEO</h2>
          <p className="mt-3 text-muted-foreground">
            Nine powerful tools, all running client-side with your own data.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.href} href={f.href}>
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

      {/* Privacy emphasis */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Your data never leaves your browser</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            OptionSEO stores your account and API keys only in your browser&apos;s
            local storage. SEO data requests go through a keyless proxy that
            forwards your auth header straight to DataForSEO — no keys are ever
            stored on any server. There is no OptionSEO database.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <Button size="lg">
                <Zap className="mr-2 h-4 w-4" />
                Start for Free
              </Button>
            </Link>
            <Link href="/privacy">
              <Button variant="outline" size="lg">
                Read Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
