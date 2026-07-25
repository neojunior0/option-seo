'use client';

import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useDataforseoClient, getTaskResult } from '@/lib/dataforseo-client';
import { useSearchHistory } from '@/lib/use-local-storage';
import { PageHeader, LoadingState, ErrorCard, EmptyState } from '@/components/seo/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const MODELS = [
  { id: 'chat_gpt', label: 'ChatGPT', modelName: 'gpt-5' },
  { id: 'claude', label: 'Claude', modelName: 'claude-sonnet-4-5' },
  { id: 'gemini', label: 'Gemini', modelName: 'gemini-2.5-pro' },
  { id: 'perplexity', label: 'Perplexity', modelName: 'sonar-reasoning-pro' },
] as const;

type LlmSection = {
  text?: string;
  annotations?: Array<{ title?: string; url?: string }>;
};

type LlmResponseItem = {
  type?: string;
  sections?: LlmSection[];
  model_name?: string;
  output_tokens?: number;
};

export default function PromptExplorerPage() {
  const callDfs = useDataforseoClient();
  const { history, addEntry } = useSearchHistory('prompt-explorer');
  const [prompt, setPrompt] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>(['chat_gpt', 'claude']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<Record<string, LlmResponseItem[]>>({});

  const toggleModel = (id: string) => {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || selectedModels.length === 0) return;
    setLoading(true);
    setError('');
    setResults({});
    try {
      const entries = await Promise.allSettled(
        selectedModels.map(async (modelId) => {
          const model = MODELS.find((m) => m.id === modelId)!;
          const res = await callDfs<LlmResponseItem>(
            `/v3/ai_optimization/${modelId}/llm_responses/live`,
            {
              user_prompt: prompt.trim(),
              model_name: model.modelName,
              web_search: true,
              max_output_tokens: 4096,
            },
          );
          const items = (getTaskResult<any>(res).items as LlmResponseItem[]) ?? [];
          return { modelId, items };
        }),
      );

      const resultMap: Record<string, LlmResponseItem[]> = {};
      entries.forEach((entry, i) => {
        const modelId = selectedModels[i];
        if (entry.status === 'fulfilled') {
          resultMap[modelId] = entry.value.items;
        } else {
          resultMap[modelId] = [];
        }
      });
      setResults(resultMap);
      addEntry(prompt.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to explore prompt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Prompt Explorer"
        subtitle="Compare answers from ChatGPT, Claude, Gemini, and Perplexity side by side."
      />

      <div className="space-y-4 p-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Input
                  id="prompt"
                  placeholder="What are the best open source SEO tools?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Models</Label>
                <div className="flex flex-wrap gap-4">
                  {MODELS.map((m) => (
                    <label key={m.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={selectedModels.includes(m.id)}
                        onCheckedChange={() => toggleModel(m.id)}
                      />
                      {m.label}
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" disabled={loading || !prompt.trim() || selectedModels.length === 0}>
                <Send className="mr-2 h-4 w-4" />
                {loading ? 'Exploring…' : 'Explore'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {history.length > 0 && !loading && Object.keys(results).length === 0 && !error && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recent prompts
            </p>
            <div className="flex flex-wrap gap-2">
              {history.map((h) => (
                <button
                  key={h.timestamp}
                  onClick={() => setPrompt(h.query)}
                  className="rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground hover:bg-muted"
                >
                  {h.query}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <LoadingState label="Querying AI models via DataForSEO…" />}

        {error && <ErrorCard message={error} />}

        {!loading && !error && Object.keys(results).length === 0 && (
          <EmptyState
            icon={<MessageSquare className="h-10 w-10" />}
            title="No prompts explored yet"
            description="Enter a prompt above to compare AI model responses."
          />
        )}

        {Object.keys(results).length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {selectedModels.map((modelId) => {
              const model = MODELS.find((m) => m.id === modelId)!;
              const items = results[modelId] ?? [];
              return (
                <Card key={modelId}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base">{model.label}</CardTitle>
                    <Badge variant="outline">{items.length > 0 ? 'Responded' : 'No response'}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {items.map((item, i) => (
                      <div key={i} className="space-y-2">
                        {item.sections?.map((section, j) => (
                          <div key={j} className="space-y-1">
                            {section.text && (
                              <p className="text-sm whitespace-pre-wrap">{section.text}</p>
                            )}
                            {section.annotations && section.annotations.length > 0 && (
                              <ul className="space-y-1">
                                {section.annotations.map((ann, k) => (
                                  <li key={k}>
                                    <a
                                      href={ann.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary hover:underline"
                                    >
                                      {ann.title ?? ann.url}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
