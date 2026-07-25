'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useDataforseoClient, getTaskResult } from '@/lib/dataforseo-client';
import { useSearchHistory } from '@/lib/use-local-storage';
import { PageHeader, LoadingState, ErrorCard, EmptyState } from '@/components/seo/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type AggregatedMetrics = {
  total_mentions?: number;
  total_responses?: number;
  visibility?: number;
};

type Mention = {
  query?: string;
  prompt?: string;
  mention_count?: number;
  url?: string;
};

type TopPage = {
  url?: string;
  mentions?: number;
};

type BrandResult = {
  metrics: AggregatedMetrics;
  mentions: Mention[];
  topPages: TopPage[];
};

export default function BrandLookupPage() {
  const callDfs = useDataforseoClient();
  const { history, addEntry } = useSearchHistory('brand-lookup');
  const [brand, setBrand] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<BrandResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const target = brand.trim();
      const common = {
        target: { domain: target },
        platform: 'chat_gpt',
        location_code: 2840,
        language_code: 'en',
      };

      const [metricsRes, mentionsRes, pagesRes] = await Promise.all([
        callDfs<AggregatedMetrics>(
          '/v3/ai_optimization/llm_mentions/aggregated_metrics/live',
          { ...common, internal_list_limit: 20 },
        ),
        callDfs<Mention>('/v3/ai_optimization/llm_mentions/search/live', {
          ...common,
          limit: 50,
        }),
        callDfs<TopPage>('/v3/ai_optimization/llm_mentions/top_pages/live', {
          ...common,
          links_scope: 'sources',
          items_list_limit: 10,
          internal_list_limit: 5,
        }),
      ]);

      setResult({
        metrics: getTaskResult<AggregatedMetrics>(metricsRes),
        mentions: (getTaskResult<any>(mentionsRes).items as Mention[]) ?? [],
        topPages: (getTaskResult<any>(pagesRes).items as TopPage[]) ?? [],
      });
      addEntry(target);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch brand lookup data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Brand Lookup"
        subtitle="See how AI search engines like ChatGPT mention your brand."
      />

      <div className="space-y-4 p-6">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="brand">Brand or domain</Label>
                <Input
                  id="brand"
                  placeholder="example.com"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading || !brand.trim()}>
                <Sparkles className="mr-2 h-4 w-4" />
                {loading ? 'Searching…' : 'Look Up'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {history.length > 0 && !loading && !result && !error && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recent searches
            </p>
            <div className="flex flex-wrap gap-2">
              {history.map((h) => (
                <button
                  key={h.timestamp}
                  onClick={() => setBrand(h.query)}
                  className="rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground hover:bg-muted"
                >
                  {h.query}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <LoadingState label="Analyzing AI search visibility…" />}

        {error && <ErrorCard message={error} />}

        {!loading && !error && !result && (
          <EmptyState
            icon={<Sparkles className="h-10 w-10" />}
            title="No brand analyzed yet"
            description="Enter a brand or domain above to see how AI search engines mention it."
          />
        )}

        {result && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Total Mentions</p>
                  <p className="mt-1 text-3xl font-bold">
                    {result.metrics.total_mentions?.toLocaleString() ?? '—'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Total Responses</p>
                  <p className="mt-1 text-3xl font-bold">
                    {result.metrics.total_responses?.toLocaleString() ?? '—'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Visibility</p>
                  <p className="mt-1 text-3xl font-bold">
                    {result.metrics.visibility !== undefined
                      ? `${(result.metrics.visibility * 100).toFixed(1)}%`
                      : '—'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {result.topPages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cited Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.topPages.map((p, i) => (
                      <li key={i} className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                        <span className="max-w-[400px] truncate text-sm">{p.url ?? '—'}</span>
                        <Badge variant="secondary">{p.mentions ?? 0}</Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {result.mentions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Sample Mentions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.mentions.slice(0, 10).map((m, i) => (
                    <div key={i} className="rounded-md border p-3">
                      {m.prompt && (
                        <p className="text-xs font-medium text-muted-foreground">
                          Prompt: {m.prompt}
                        </p>
                      )}
                      {m.url && (
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block truncate text-sm text-primary hover:underline"
                        >
                          {m.url}
                        </a>
                      )}
                      {m.mention_count !== undefined && (
                        <Badge variant="outline" className="mt-2">
                          {m.mention_count} mentions
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
