'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useDataforseoClient, getTaskResult } from '@/lib/dataforseo-client';
import { useSearchHistory } from '@/lib/use-local-storage';
import { PageHeader, LoadingState, ErrorCard, EmptyState } from '@/components/seo/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type OverviewResult = {
  metrics?: {
    organic?: {
      etv?: number;
      count?: number;
    };
  };
};

type RankedKeywordItem = {
  keyword_data?: { keyword?: string };
  keyword_info?: {
    search_volume?: number;
    cpc?: number;
    keyword_difficulty?: number;
  };
  ranked_serp_element?: {
    serp_item?: { rank_absolute?: number; url?: string; etv?: number };
  };
};

type RelevantPageItem = {
  page?: string;
  url?: string;
  metrics?: { organic?: { etv?: number; count?: number } };
};

export default function DomainOverviewPage() {
  const callDfs = useDataforseoClient();
  const { history, addEntry } = useSearchHistory('domain');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState<{ traffic: number; keywords: number } | null>(null);
  const [keywords, setKeywords] = useState<RankedKeywordItem[]>([]);
  const [pages, setPages] = useState<RelevantPageItem[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!clean) return;
    setLoading(true);
    setError('');
    setOverview(null);
    setKeywords([]);
    setPages([]);
    try {
      const [overviewRes, kwRes, pageRes] = await Promise.all([
        callDfs<OverviewResult>(
          '/v3/dataforseo_labs/google/domain_rank_overview/live',
          { target: clean, location_code: 2840, language_code: 'en', limit: 1 },
        ),
        callDfs<RankedKeywordItem>(
          '/v3/dataforseo_labs/google/ranked_keywords/live',
          { target: clean, location_code: 2840, language_code: 'en', limit: 20 },
        ),
        callDfs<RelevantPageItem>(
          '/v3/dataforseo_labs/google/relevant_pages/live',
          { target: clean, location_code: 2840, language_code: 'en', limit: 20 },
        ),
      ]);

      const ov = getTaskResult<OverviewResult>(overviewRes);
      setOverview({
        traffic: Math.round(ov.metrics?.organic?.etv ?? 0),
        keywords: ov.metrics?.organic?.count ?? 0,
      });
      setKeywords((getTaskResult<any>(kwRes).items as RankedKeywordItem[]) ?? []);
      setPages((getTaskResult<any>(pageRes).items as RelevantPageItem[]) ?? []);
      addEntry(clean);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch domain data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Domain Overview"
        subtitle="Analyze any domain’s organic traffic, keywords, and top pages."
      />

      <div className="space-y-4 p-6">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading || !domain.trim()}>
                <Globe className="mr-2 h-4 w-4" />
                {loading ? 'Analyzing…' : 'Analyze'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {history.length > 0 && !loading && !overview && !error && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recent searches
            </p>
            <div className="flex flex-wrap gap-2">
              {history.map((h) => (
                <button
                  key={h.timestamp}
                  onClick={() => setDomain(h.query)}
                  className="rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground hover:bg-muted"
                >
                  {h.query}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <LoadingState label="Analyzing domain…" />}

        {error && <ErrorCard message={error} />}

        {!loading && !error && !overview && (
          <EmptyState
            icon={<Globe className="h-10 w-10" />}
            title="No domain analyzed yet"
            description="Enter a domain above to see its organic traffic, keywords, and top pages."
          />
        )}

        {overview && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Estimated Organic Traffic</p>
                  <p className="mt-1 text-3xl font-bold">
                    {overview.traffic.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Organic Keywords</p>
                  <p className="mt-1 text-3xl font-bold">
                    {overview.keywords.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="keywords">
              <TabsList>
                <TabsTrigger value="keywords">Top Keywords</TabsTrigger>
                <TabsTrigger value="pages">Top Pages</TabsTrigger>
              </TabsList>
              <TabsContent value="keywords">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Keyword</TableHead>
                          <TableHead className="text-right">Position</TableHead>
                          <TableHead className="text-right">Volume</TableHead>
                          <TableHead className="text-right">Difficulty</TableHead>
                          <TableHead>URL</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {keywords.map((kw, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">
                              {kw.keyword_data?.keyword ?? '—'}
                            </TableCell>
                            <TableCell className="text-right">
                              {kw.ranked_serp_element?.serp_item?.rank_absolute ?? '—'}
                            </TableCell>
                            <TableCell className="text-right">
                              {kw.keyword_info?.search_volume?.toLocaleString() ?? '—'}
                            </TableCell>
                            <TableCell className="text-right">
                              {kw.keyword_info?.keyword_difficulty ?? '—'}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                              {kw.ranked_serp_element?.serp_item?.url ?? '—'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="pages">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Page</TableHead>
                          <TableHead className="text-right">Traffic</TableHead>
                          <TableHead className="text-right">Keywords</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pages.map((pg, i) => (
                          <TableRow key={i}>
                            <TableCell className="max-w-[300px] truncate font-medium">
                              {pg.page ?? pg.url ?? '—'}
                            </TableCell>
                            <TableCell className="text-right">
                              {Math.round(pg.metrics?.organic?.etv ?? 0).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {pg.metrics?.organic?.count ?? '—'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
