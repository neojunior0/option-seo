'use client';

import { useAuth } from './auth-context';

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1/chat/completions';

export class OpenRouterError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type OpenRouterResponse = {
  id: string;
  choices: Array<{
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost?: number;
  };
};

export function useOpenRouterClient() {
  const { getApiKeys } = useAuth();

  const chat = async (
    messages: ChatMessage[],
    options?: { model?: string },
  ): Promise<OpenRouterResponse> => {
    const keys = getApiKeys();
    if (!keys.openrouter) {
      throw new OpenRouterError(
        'OpenRouter API key is not set. Add it in your Profile.',
        401,
      );
    }

    const res = await fetch(OPENROUTER_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keys.openrouter}`,
        'HTTP-Referer':
          typeof window !== 'undefined' ? window.location.origin : 'https://optionseo.app',
        'X-Title': 'OptionSEO',
      },
      body: JSON.stringify({
        model: options?.model ?? 'openai/gpt-4o-mini',
        messages,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new OpenRouterError(
        text || `OpenRouter request failed (${res.status})`,
        res.status,
      );
    }

    return (await res.json()) as OpenRouterResponse;
  };

  return chat;
}
