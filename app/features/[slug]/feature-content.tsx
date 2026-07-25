'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { MarketingFooter } from '@/components/marketing-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { featureDetails } from './feature-data';

export default function FeatureDetailContent({
  slug,
}: {
  slug: string;
}) {
  const feature = featureDetails[slug];
  if (!feature) notFound();

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      <article className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          {feature.eyebrow}
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{feature.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{feature.description}</p>

        <div className="mt-8">
          <Link href="/signup">
            <Button size="lg">
              Try it free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold">What you can do</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {feature.workflows.map((w, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-semibold">{w.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{w.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold">Use cases</h2>
          <ul className="mt-6 space-y-3">
            {feature.useCases.map((uc, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">{uc}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-6 space-y-6">
            {feature.faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="font-medium">{faq.question}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-16 rounded-xl border bg-muted/20 p-8 text-center">
          <h2 className="text-2xl font-semibold">Ready to try {feature.title}?</h2>
          <p className="mt-2 text-muted-foreground">
            Free forever — just add your DataForSEO keys and start.
          </p>
          <Link href="/signup" className="mt-4 inline-block">
            <Button size="lg">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </article>

      <MarketingFooter />
    </div>
  );
}