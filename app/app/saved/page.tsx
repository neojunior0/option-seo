'use client';

import { useState } from 'react';
import { Bookmark, Trash2, Download } from 'lucide-react';
import { useLocalStorage } from '@/lib/use-local-storage';
import { PageHeader, EmptyState } from '@/components/seo/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

type SavedKeyword = {
  keyword: string;
  search_volume: number;
  cpc: number;
  competition: number;
  keyword_difficulty?: number;
  intent?: string;
  savedAt: string;
  tags?: string[];
};

export default function SavedKeywordsPage() {
  const [keywords, setKeywords] = useLocalStorage<SavedKeyword[]>('optionseo_saved_keywords', []);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = keywords.filter((k) =>
    k.keyword.toLowerCase().includes(filter.toLowerCase()),
  );

  const handleDelete = (kw: string) => {
    setKeywords((prev) => prev.filter((k) => k.keyword !== kw));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(kw);
      return next;
    });
    toast.success(`Removed "${kw}"`);
  };

  const handleBulkDelete = () => {
    setKeywords((prev) => prev.filter((k) => !selected.has(k.keyword)));
    setSelected(new Set());
    toast.success(`Removed ${selected.size} keywords`);
  };

  const handleExport = () => {
    const headers = ['Keyword', 'Volume', 'CPC', 'Competition', 'Difficulty', 'Intent', 'Saved At'];
    const rows = filtered.map((k) => [
      k.keyword,
      k.search_volume,
      k.cpc,
      k.competition,
      k.keyword_difficulty ?? '',
      k.intent ?? '',
      k.savedAt,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optionseo-saved-keywords.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelect = (kw: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(kw)) next.delete(kw);
      else next.add(kw);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((k) => k.keyword)));
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Saved Keywords"
        subtitle="Organize keywords you’ve saved from research."
      >
        <Button variant="outline" size="sm" onClick={handleExport} disabled={filtered.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </PageHeader>

      <div className="space-y-4 p-6">
        <div className="flex gap-3">
          <Input
            placeholder="Filter keywords…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-xs"
          />
          {selected.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete {selected.size} selected
            </Button>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="h-10 w-10" />}
            title={filter ? 'No matching keywords' : 'No saved keywords yet'}
            description={
              filter
                ? 'Try a different search term.'
                : 'Save keywords from Keyword Research to see them here.'
            }
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selected.size === filtered.length && filtered.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-border"
                      />
                    </TableHead>
                    <TableHead>Keyword</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                    <TableHead className="text-right">CPC</TableHead>
                    <TableHead className="text-right">Difficulty</TableHead>
                    <TableHead>Intent</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((kw) => (
                    <TableRow key={kw.keyword}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selected.has(kw.keyword)}
                          onChange={() => toggleSelect(kw.keyword)}
                          className="h-4 w-4 rounded border-border"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{kw.keyword}</TableCell>
                      <TableCell className="text-right">
                        {kw.search_volume?.toLocaleString() ?? '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        {kw.cpc ? `$${kw.cpc.toFixed(2)}` : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        {kw.keyword_difficulty !== undefined ? (
                          <Badge variant="secondary">{kw.keyword_difficulty}</Badge>
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
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(kw.keyword)}
                        >
                          <Trash2 className="h-4 w-4" />
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
