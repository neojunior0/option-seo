'use client';

import { useState } from 'react';
import { Search, BookmarkPlus } from 'lucide-react';
import { useDataforseoClient, getTaskItems } from '@/lib/dataforseo-client';
import { useLocalStorage, useSearchHistory } from '@/lib/use-local-storage';
import { PageHeader, LoadingState, ErrorCard, EmptyState } from '@/components/seo/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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

type KeywordItem = {
  keyword: string;
  search_volume: number;
  cpc: number;
  competition: number;
  keyword_difficulty?: number;
  intent?: string;
};

type SavedKeyword = {
  keyword: string;
  search_volume: number;
  cpc: number;
  competition: number;
  keyword_difficulty?: number;
  intent?: string;
  savedAt: string;
};

export default function KeywordResearchPage() {
  const callDfs = useDataforseoClient();
  const { history, addEntry } = useSearchHistory('keywords');
  const [savedKeywords, setSavedKeywords] = useLocalStorage<SavedKeyword[]>(
    'optionseo_saved_keywords',
    [],
  );

  const [seed, setSeed] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<KeywordItem[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seed.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await callDfs<any>(
        '/v3/dataforseo_labs/google/keyword_suggestions/live',
        {
          keyword: seed.trim(),
          location_code: 2840,
          language_code: 'en',
          limit: 50,
          include_serp_info: false,
        },
      );
      const items = getTaskItems<KeywordItem>(res);
      setResults(items);
      addEntry(seed.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch keywords');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (kw: KeywordItem) => {
    setSavedKeywords((prev) => {
      if (prev.some((k) => k.keyword === kw.keyword)) return prev;
      return [
        { ...kw, savedAt: new Date().toISOString() },
        ...prev,
      ];
    });
    toast.success(`Saved "${kw.keyword}"`);
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Keyword Research"
        subtitle="Find keyword ideas with search volume, CPC, and difficulty."
      />

      <div className="space-y-4 p-6">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="seed">Seed keyword</Label>
                <Input
                  id="seed"
                  placeholder="e.g. open source seo"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading || !seed.trim()}>
                <Search className="mr-2 h-4 w-4" />
                {loading ? 'Searching…' : 'Research'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {history.length > 0 && !loading && results.length === 0 && !error && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recent searches
            </p>
            <div className="flex flex-wrap gap-2">
              {history.map((h) => (
                <button
                  key={h.timestamp}
                  onClick={() => setSeed(h.query)}
                  className="rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground hover:bg-muted"
                >
                  {h.query}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <LoadingState label="Fetching keyword ideas from DataForSEO…" />}

        {error && <ErrorCard message={error} />}

        {!loading && !error && results.length === 0 && (
          <EmptyState
            icon={<Search className="h-10 w-10" />}
            title="No results yet"
            description="Enter a seed keyword above to discover keyword ideas."
          />
        )}

        {results.length > 0 && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                    <TableHead className="text-right">CPC</TableHead>
                    <TableHead className="text-right">Competition</TableHead>
                    <TableHead className="text-right">Difficulty</TableHead>
                    <TableHead>Intent</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((kw) => (
                    <TableRow key={kw.keyword}>
                      <TableCell className="font-medium">{kw.keyword}</TableCell>
                      <TableCell className="text-right">
                        {kw.search_volume?.toLocaleString() ?? '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        {kw.cpc ? `$${kw.cpc.toFixed(2)}` : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        {kw.competition !== undefined
                          ? kw.competition.toFixed(2)
                          : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        {kw.keyword_difficulty !== undefined ? (
                          <Badge variant="secondary">
                            {kw.keyword_difficulty}
                          </Badge>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell>
                        {kw.intent ? (
                          <Badge variant="outline" className="capitalize">
                            {kw.intent}
                          </Badge>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleSave(kw)}
                          title="Save keyword"
                        >
                          <BookmarkPlus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
