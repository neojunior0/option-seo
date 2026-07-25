'use client';

import { useState } from 'react';
import { ClipboardCheck, Play, Trash2 } from 'lucide-react';
import { useDataforseoClient, getTaskResult } from '@/lib/dataforseo-client';
import { useLocalStorage } from '@/lib/use-local-storage';
import { PageHeader, LoadingState, ErrorCard, EmptyState } from '@/components/seo/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

type AuditRecord = {
  id: string;
  url: string;
  timestamp: string;
  scores?: {
    performance?: number;
    seo?: number;
    accessibility?: number;
  };
  lighthouseData?: any;
};

export default function AuditPage() {
  const callDfs = useDataforseoClient();
  const [audits, setAudits] = useLocalStorage<AuditRecord[]>('optionseo_audits', []);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeAudit, setActiveAudit] = useState<string | null>(null);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await callDfs<any>('/v3/on_page/lighthouse/live/json', {
        url: url.trim(),
        for_mobile: false,
        categories: ['performance', 'seo', 'accessibility'],
      });
      const result = getTaskResult<any>(res);
      const lighthouse = result?.lighthouse_version
        ? result
        : result?.items?.[0] ?? result;

      const scores = {
        performance: lighthouse?.categories?.performance?.score ?? undefined,
        seo: lighthouse?.categories?.seo?.score ?? undefined,
        accessibility: lighthouse?.categories?.accessibility?.score ?? undefined,
      };

      const record: AuditRecord = {
        id: `audit_${Date.now()}`,
        url: url.trim(),
        timestamp: new Date().toISOString(),
        scores,
        lighthouseData: lighthouse,
      };
      setAudits((prev) => [record, ...prev].slice(0, 20));
      setActiveAudit(record.id);
      toast.success('Audit completed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run audit');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setAudits((prev) => prev.filter((a) => a.id !== id));
    if (activeAudit === id) setActiveAudit(null);
  };

  const current = audits.find((a) => a.id === activeAudit) ?? audits[0];

  const scoreColor = (score?: number) => {
    if (score === undefined) return 'secondary';
    if (score >= 0.9) return 'default';
    if (score >= 0.5) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Site Audit"
        subtitle="Run Lighthouse audits on any URL to find performance and SEO issues."
      />

      <div className="space-y-4 p-6">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleRun} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="audit-url">URL to audit</Label>
                <Input
                  id="audit-url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading || !url.trim()}>
                <Play className="mr-2 h-4 w-4" />
                {loading ? 'Running…' : 'Run Audit'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading && <LoadingState label="Running Lighthouse audit via DataForSEO…" />}

        {error && <ErrorCard message={error} />}

        {audits.length === 0 && !loading && (
          <EmptyState
            icon={<ClipboardCheck className="h-10 w-10" />}
            title="No audits yet"
            description="Enter a URL above to run a Lighthouse audit."
          />
        )}

        {audits.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {audits.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setActiveAudit(a.id)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    (current?.id ?? activeAudit) === a.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="font-medium">{a.url}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.timestamp).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>

            {current && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base">Audit Results — {current.url}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(current.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {(['performance', 'seo', 'accessibility'] as const).map((cat) => {
                      const score = current.scores?.[cat];
                      return (
                        <Card key={cat}>
                          <CardContent className="pt-6 text-center">
                            <p className="text-sm capitalize text-muted-foreground">{cat}</p>
                            <p className="mt-2 text-3xl font-bold">
                              {score !== undefined ? Math.round(score * 100) : '—'}
                            </p>
                            {score !== undefined && (
                              <Badge variant={scoreColor(score)} className="mt-2">
                                {score >= 0.9 ? 'Good' : score >= 0.5 ? 'Needs work' : 'Poor'}
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {current.lighthouseData?.audits && (
                    <Tabs defaultValue="metrics">
                      <TabsList>
                        <TabsTrigger value="metrics">Metrics</TabsTrigger>
                        <TabsTrigger value="audits">Audits</TabsTrigger>
                      </TabsList>
                      <TabsContent value="metrics">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Metric</TableHead>
                              <TableHead className="text-right">Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(current.lighthouseData.audits)
                              .filter(([key]) =>
                                ['first-contentful-paint', 'largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time', 'speed-index'].includes(key),
                              )
                              .map(([key, audit]: [string, any]) => (
                                <TableRow key={key}>
                                  <TableCell className="font-medium capitalize">
                                    {key.replace(/-/g, ' ')}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {audit?.displayValue ?? '—'}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                      <TabsContent value="audits">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Audit</TableHead>
                              <TableHead>Score</TableHead>
                              <TableHead>Description</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(current.lighthouseData.audits)
                              .filter(([, audit]: [string, any]) => audit?.score !== null && audit?.score < 1)
                              .slice(0, 20)
                              .map(([key, audit]: [string, any]) => (
                                <TableRow key={key}>
                                  <TableCell className="font-medium capitalize">
                                    {audit?.title ?? key}
                                  </TableCell>
                                  <TableCell>
                                    {audit?.score !== null ? (
                                      <Badge variant={scoreColor(audit.score)}>
                                        {Math.round(audit.score * 100)}
                                      </Badge>
                                    ) : (
                                      '—'
                                    )}
                                  </TableCell>
                                  <TableCell className="max-w-[400px] text-xs text-muted-foreground">
                                    {audit?.description ?? '—'}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
