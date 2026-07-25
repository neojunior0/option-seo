'use client';

import { useState } from 'react';
import { TrendingUp, Plus, Trash2 } from 'lucide-react';
import { useDataforseoClient, getTaskResult } from '@/lib/dataforseo-client';
import { useLocalStorage } from '@/lib/use-local-storage';
import { PageHeader, LoadingState, ErrorCard, EmptyState } from '@/components/seo/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

type TrackedDomain = {
  domain: string;
  keywords: TrackedKeyword[];
  createdAt: string;
};

type TrackedKeyword = {
  keyword: string;
  position: number | null;
  url: string | null;
  checkedAt: string | null;
};

type SerpItem = {
  type: string;
  rank_group?: number;
  rank_absolute?: number;
  domain?: string;
  url?: string;
  title?: string;
};

export default function RankTrackingPage() {
  const callDfs = useDataforseoClient();
  const [domains, setDomains] = useLocalStorage<TrackedDomain[]>('optionseo_rank_tracking', []);
  const [newDomain, setNewDomain] = useState('');
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newDomain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!clean) return;
    if (domains.some((d) => d.domain === clean)) {
      toast.error('That domain is already tracked');
      return;
    }
    setDomains((prev) => [
      { domain: clean, keywords: [], createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setNewDomain('');
    toast.success(`Tracking ${clean}`);
  };

  const handleAddKeyword = (domainName: string) => {
    if (!newKeyword.trim()) return;
    setDomains((prev) =>
      prev.map((d) =>
        d.domain === domainName
          ? {
              ...d,
              keywords: d.keywords.some((k) => k.keyword === newKeyword.trim())
                ? d.keywords
                : [...d.keywords, { keyword: newKeyword.trim(), position: null, url: null, checkedAt: null }],
            }
          : d,
      ),
    );
    setNewKeyword('');
  };

  const handleCheckRank = async (domainName: string, keyword: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await callDfs<{ items?: SerpItem[] }>(
        '/v3/serp/google/organic/live/advanced',
        {
          keyword,
          location_code: 2840,
          language_code: 'en',
          device: 'desktop',
          depth: 100,
          stop_crawl_on_match: [
            { match_value: domainName, match_type: 'with_subdomains' },
          ],
          find_targets_in: ['organic'],
        },
      );
      const items = (getTaskResult<any>(res).items as SerpItem[]) ?? [];
      const target = domainName.toLowerCase();
      const found = items.find(
        (item) =>
          item.domain?.toLowerCase() === target ||
          item.domain?.toLowerCase().endsWith(`.${target}`),
      );
      setDomains((prev) =>
        prev.map((d) =>
          d.domain === domainName
            ? {
                ...d,
                keywords: d.keywords.map((k) =>
                  k.keyword === keyword
                    ? {
                        ...k,
                        position: found?.rank_absolute ?? null,
                        url: found?.url ?? null,
                        checkedAt: new Date().toISOString(),
                      }
                    : k,
                ),
              }
            : d,
        ),
      );
      toast.success(
        found
          ? `"${keyword}" is at position #${found.rank_absolute}`
          : `"${keyword}" not found in top 100`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check rank');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDomain = (domainName: string) => {
    setDomains((prev) => prev.filter((d) => d.domain !== domainName));
    if (activeDomain === domainName) setActiveDomain(null);
  };

  const handleRemoveKeyword = (domainName: string, keyword: string) => {
    setDomains((prev) =>
      prev.map((d) =>
        d.domain === domainName
          ? { ...d, keywords: d.keywords.filter((k) => k.keyword !== keyword) }
          : d,
      ),
    );
  };

  const active = domains.find((d) => d.domain === activeDomain);

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Rank Tracking"
        subtitle="Track keyword positions for your domain over time."
      />

      <div className="space-y-4 p-6">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleAddDomain} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="new-domain">Add a domain to track</Label>
                <Input
                  id="new-domain"
                  placeholder="example.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={!newDomain.trim()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Domain
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && <ErrorCard message={error} />}

        {loading && <LoadingState label="Checking SERP rankings…" />}

        {domains.length === 0 && !loading && (
          <EmptyState
            icon={<TrendingUp className="h-10 w-10" />}
            title="No tracked domains yet"
            description="Add a domain above to start tracking keyword positions."
          />
        )}

        {domains.length > 0 && (
          <div className="space-y-3">
            {domains.map((d) => (
              <Card key={d.domain}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base">{d.domain}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveDomain(activeDomain === d.domain ? null : d.domain)}
                    >
                      {activeDomain === d.domain ? 'Hide' : 'Manage'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleRemoveDomain(d.domain)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {activeDomain === d.domain ? (
                    <div className="space-y-4">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddKeyword(d.domain);
                        }}
                        className="flex gap-2"
                      >
                        <Input
                          placeholder="Add keyword to track"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                        />
                        <Button type="submit" size="sm" disabled={!newKeyword.trim()}>
                          <Plus className="mr-1 h-4 w-4" />
                          Add
                        </Button>
                      </form>

                      {d.keywords.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                          No keywords tracked yet. Add one above.
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Keyword</TableHead>
                              <TableHead className="text-right">Position</TableHead>
                              <TableHead>URL</TableHead>
                              <TableHead>Last Checked</TableHead>
                              <TableHead className="w-20" />
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {d.keywords.map((k) => (
                              <TableRow key={k.keyword}>
                                <TableCell className="font-medium">{k.keyword}</TableCell>
                                <TableCell className="text-right">
                                  {k.position ? (
                                    <Badge variant={k.position <= 10 ? 'default' : 'secondary'}>
                                      #{k.position}
                                    </Badge>
                                  ) : (
                                    '—'
                                  )}
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                                  {k.url ?? '—'}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                  {k.checkedAt
                                    ? new Date(k.checkedAt).toLocaleDateString()
                                    : 'Never'}
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleCheckRank(d.domain, k.keyword)}
                                      disabled={loading}
                                    >
                                      Check
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-destructive"
                                      onClick={() => handleRemoveKeyword(d.domain, k.keyword)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {d.keywords.length} keyword{d.keywords.length !== 1 ? 's' : ''} tracked
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
