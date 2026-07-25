'use client';

import { useState } from 'react';
import { Bot } from 'lucide-react';
import { AiInsightAgent } from '@/components/seo/ai-insight-agent';
import { PageHeader } from '@/components/seo/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AiInsightsPage() {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setDescription(
      `Topic: ${topic.trim()}. The user wants a comprehensive SEO analysis and action plan for this topic, including keyword opportunities, content recommendations, and technical SEO guidance.`,
    );
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="AI Insight Agent"
        subtitle="Generate actionable SEO plans, content strategies, and technical fixes powered by AI."
      />

      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Describe your SEO goal
            </CardTitle>
            <CardDescription>
              Enter a topic, keyword, or question. The AI Insight Agent will
              generate a structured report with an action plan, content
              strategy, technical fixes, and a comparison table.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or keyword</Label>
                <Input
                  id="topic"
                  placeholder="e.g. improve rankings for 'best running shoes'"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  autoFocus
                />
              </div>
              <Button type="submit" disabled={!topic.trim()}>
                <Bot className="mr-2 h-4 w-4" />
                Analyze
              </Button>
            </form>
          </CardContent>
        </Card>

        {submitted && description && (
          <AiInsightAgent
            featureTitle={`SEO Analysis: ${topic}`}
            featureDescription={description}
          />
        )}

        {!submitted && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-3 text-muted-foreground/50">
              <Bot className="h-10 w-10" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No insights generated yet
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Enter a topic above and click Analyze to generate AI-powered SEO
              insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
