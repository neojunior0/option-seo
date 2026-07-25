'use client';

import { useState } from 'react';
import { Link2 } from 'lucide-react';
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

type BacklinkRow = {
  url_from?: string;
  url_to?: string;
  anchor?: string;
  dofollow?: boolean;
  domain_from_rank?: number;
  first_seen?: string;
};

type ReferringDomain = {
  domain?: string;
  backlinks?: number;
  referring_pages?: number;
  domain_rank?: number;
};

type DomainPage = {
  url?: string;
  backlinks?: number;
  referring_domains?: number;
  page_rank?: number;
};

type Summary = {
  backlinks?: number;
  referring_domains?: number;
  backlinks_spam_score?: number;
};

export default function BacklinksPage() {
  const callDfs = useDataforseoClient();
  const { history, addEntry } = useSearchHistory('backlinks');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [rows, setRows] = useState<BacklinkRow[]>([]);
  const [domains, setDomains] = useState<ReferringDomain[]>([]);
  const [pages, setPages] = useState<DomainPage[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = target.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!clean) return;
    setLoading(true);
    setError('');
    setSummary(null);
    setRows([]);
    setDomains([]);
    setPages([]);
    try {
      const common = {
        target: clean,
        include_subdomains: true,
        include_indirect_links: true,
        exclude_internal_backlinks: true,
        backlinks_status_type: 'live',
        rank_scale: 'one_hundred',
      };
      const [sumRes, rowRes, domRes, pageRes] = await Promise.all([
        callDfs<Summary>('/v3/backlinks/summary/live', common),
        callDfs<BacklinkRow>('/v3/backlinks/backlinks/live', { ...common, limit: 25 }),
        callDfs<ReferringDomain>('/v3/backlinks/referring_domains/live', {
          ...common,
          limit: 25,
        }),
        callDfs<DomainPage>('/v3/backlinks/domain_pages_summary/live', {
          ...common,
          limit: 25,
        }),
      ]);

      setSummary(getTaskResult<Summary>(sumRes));
      setRows((getTaskResult<any>(rowRes).items as BacklinkRow[]) ?? []);
      setDomains((getTaskResult<any>(domRes).items as ReferringDomain[]) ?? []);
      setPages((getTaskResult<any>(pageRes).items as DomainPage[]) ?? []);
      addEntry(clean);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch backlinks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Backlinks"
        subtitle="Explore any domain’s backlink profile, referring domains, and top pages."
      />

      <div className="space-y-4 p-6">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="target">Target domain</Label>
                <Input
                  id="target"
                  placeholder="example.com"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading || !target.trim()}>
                <Link2 className="mr-2 h-4 w-4" />
                {loading ? 'Fetching…' : 'Analyze'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {history.length > 0 && !loading && !summary && !error && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recent searches
            </p>
            <div className="flex flex-wrap gap-2">
              {history.map((h) => (
                <button
                  key={h.timestamp}
                  onClick={() => setTarget(h.query)}
                  className="rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground hover:bg-muted"
                >
                  {h.query}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <LoadingState label="Fetching backlink data…" />}

        {error && <ErrorCard message={error} />}

        {!loading && !error && !summary && (
          <EmptyState
            icon={<Link2 className="h-10 w-10" />}
            title="No backlinks analyzed yet"
            description="Enter a domain above to see its backlink profile."
          />
        )}

        {summary && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Total Backlinks</p>
                  <p className="mt-1 text-3xl font-bold">
                    {summary.backlinks?.toLocaleString() ?? '—'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Referring Domains</p>
                  <p className="mt-1 text-3xl font-bold">
                    {summary.referring_domains?.toLocaleString() ?? '—'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Spam Score</p>
                  <p className="mt-1 text-3xl font-bold">
                    {summary.backlinks_spam_score?.toFixed(2) ?? '—'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="backlinks">
              <TabsList>
                <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
                <TabsTrigger value="domains">Referring Domains</TabsTrigger>
                <TabsTrigger value="pages">Top Pages</TabsTrigger>
              </TabsList>
              <TabsContent value="backlinks">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>Anchor</TableHead>
                          <TableHead className="text-right">Domain Rank</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.map((r, i) => (
                          <TableRow key={i}>
                            <TableCell className="max-w-[200px] truncate text-xs">
                              {r.url_from ?? '—'}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate text-xs">
                              {r.url_to ?? '—'}
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate">
                              {r.anchor ?? '—'}
                            </TableCell>
                            <TableCell className="text-right">
                              {r.domain_from_rank ?? '—'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="domains">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Domain</TableHead>
                          <TableHead className="text-right">Backlinks</TableHead>
                          <TableHead className="text-right">Pages</TableHead>
                          <TableHead className="text-right">Rank</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {domains.map((d, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{d.domain ?? '—'}</TableCell>
                            <TableCell className="text-right">
                              {d.backlinks?.toLocaleString() ?? '—'}
                            </TableCell>
                            <TableCell className="text-right">
                              {d.referring_pages?.toLocaleString() ?? '—'}
                            </TableCell>
                            <TableCell className="text-right">{d.domain_rank ?? '—'}</TableCell>
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
                          <TableHead className="text-right">Backlinks</TableHead>
                          <TableHead className="text-right">Ref. Domains</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pages.map((p, i) => (
                          <TableRow key={i}>
                            <TableCell className="max-w-[300px] truncate font-medium">
                              {p.url ?? '—'}
                            </TableCell>
                            <TableCell className="text-right">
                              {p.backlinks?.toLocaleString() ?? '—'}
                            </TableCell>
                            <TableCell className="text-right">
                              {p.referring_domains?.toLocaleString() ?? '—'}
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
