'use client';

import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useOpenRouterClient, OpenRouterError } from '@/lib/openrouter-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type Insight = {
  summary: string;
  actionPlan: { step: string; detail: string; priority: string }[];
  contentStrategy: { tactic: string; rationale: string; expectedImpact: string }[];
  technicalFixes: { issue: string; fix: string; difficulty: string }[];
  comparisonTable: { metric: string; current: string; recommended: string }[];
};

function buildPrompt(featureTitle: string, featureDescription: string): string {
  return `You are an expert SEO consultant AI. Based on the following SEO feature and its data context, generate a comprehensive, actionable insight report.

Feature: ${featureTitle}
Context: ${featureDescription}

Generate your response as STRICT JSON with this exact structure (no markdown, no code fences, just raw JSON):
{
  "summary": "A 2-3 sentence executive summary of the key opportunity",
  "actionPlan": [
    { "step": "Short step name", "detail": "1-2 sentence how-to", "priority": "High|Medium|Low" }
  ],
  "contentStrategy": [
    { "tactic": "Tactic name", "rationale": "Why this works", "expectedImpact": "Expected outcome" }
  ],
  "technicalFixes": [
    { "issue": "Issue name", "fix": "How to fix it", "difficulty": "Easy|Medium|Hard" }
  ],
  "comparisonTable": [
    { "metric": "Metric name", "current": "Current state", "recommended": "Recommended state" }
  ]
}

Provide at least 3 items in each array. Be specific and actionable.`;
}

function parseInsight(content: string): Insight | null {
  const cleaned = content
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.summary || !Array.isArray(parsed.actionPlan)) return null;
    return parsed as Insight;
  } catch {
    return null;
  }
}

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

const difficultyColors: Record<string, string> = {
  Easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export function AiInsightAgent({
  featureTitle,
  featureDescription,
}: {
  featureTitle: string;
  featureDescription: string;
}) {
  const chat = useOpenRouterClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [insight, setInsight] = useState<Insight | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setInsight(null);
    try {
      const res = await chat(
        [
          {
            role: 'system',
            content:
              'You are an expert SEO consultant. You always respond with valid JSON only, no markdown formatting.',
          },
          {
            role: 'user',
            content: buildPrompt(featureTitle, featureDescription),
          },
        ],
        { model: 'openai/gpt-4o-mini' },
      );
      const content = res.choices?.[0]?.message?.content ?? '';
      const parsed = parseInsight(content);
      if (!parsed) {
        setError('The AI returned an unexpected format. Please try again.');
      } else {
        setInsight(parsed);
      }
    } catch (err) {
      if (err instanceof OpenRouterError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to generate insights');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-16">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">AI Insight Agent</h2>
          <p className="text-sm text-muted-foreground">
            Generate actionable plans, content strategies, and technical solutions powered by OpenRouter.
          </p>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Generate AI-Powered Insights</CardTitle>
          <CardDescription>
            The agent analyzes this feature&apos;s data context and produces a structured action plan, content strategy, technical fixes, and a comparison table.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating insights…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Insights
              </>
            )}
          </Button>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {insight && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="rounded-lg border bg-muted/20 p-4">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Executive Summary
                </h3>
                <p className="text-sm leading-relaxed">{insight.summary}</p>
              </div>

              {/* Action Plan */}
              {insight.actionPlan.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Action Plan
                  </h3>
                  <div className="space-y-2">
                    {insight.actionPlan.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium">{item.step}</p>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                priorityColors[item.priority] ?? ''
                              }`}
                            >
                              {item.priority}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Strategy */}
              {insight.contentStrategy.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Content Strategy
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {insight.contentStrategy.map((item, i) => (
                      <Card key={i}>
                        <CardContent className="pt-4">
                          <h4 className="font-medium">{item.tactic}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">{item.rationale}</p>
                          <p className="mt-2 text-xs font-medium text-primary">
                            {item.expectedImpact}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Fixes */}
              {insight.technicalFixes.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Technical Solutions
                  </h3>
                  <div className="space-y-2">
                    {insight.technicalFixes.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium">{item.issue}</p>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                difficultyColors[item.difficulty] ?? ''
                              }`}
                            >
                              {item.difficulty}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{item.fix}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comparison Table */}
              {insight.comparisonTable.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Comparison: Current vs. Recommended
                  </h3>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="px-4 py-2 text-left font-medium">Metric</th>
                          <th className="px-4 py-2 text-left font-medium">Current State</th>
                          <th className="px-4 py-2 text-left font-medium">Recommended</th>
                        </tr>
                      </thead>
                      <tbody>
                        {insight.comparisonTable.map((row, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="px-4 py-2 font-medium">{row.metric}</td>
                            <td className="px-4 py-2 text-muted-foreground">{row.current}</td>
                            <td className="px-4 py-2 text-primary">{row.recommended}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
