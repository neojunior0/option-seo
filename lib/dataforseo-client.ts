'use client';

import { useAuth } from './auth-context';

const PROXY_BASE = '/api/seo-proxy';

export type DataforseoResponse<T> = {
  version: string;
  status_code: number;
  status_message: string;
  time: number;
  cost: number;
  tasks_count: number;
  tasks: Array<{
    id: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: Record<string, unknown>;
    result: T[] | null;
  }>;
};

export class DataforseoError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public taskStatusCode?: number,
  ) {
    super(message);
    this.name = 'DataforseoError';
  }
}

function toBase64(str: string): string {
  if (typeof window !== 'undefined' && typeof btoa === 'function') {
    return btoa(str);
  }
  return Buffer.from(str).toString('base64');
}

export function useDataforseoClient() {
  const { getApiKeys } = useAuth();

  const call = async <T = unknown>(
    apiPath: string,
    body?: Record<string, unknown>,
  ): Promise<DataforseoResponse<T>> => {
    const keys = getApiKeys();
    if (!keys.dataforseoLogin || !keys.dataforseoPassword) {
      throw new DataforseoError(
        'DataForSEO credentials are not set. Add them in your Profile.',
        401,
      );
    }

    const auth = toBase64(`${keys.dataforseoLogin}:${keys.dataforseoPassword}`);

    const payload = body
      ? JSON.stringify({ path: apiPath, ...body })
      : JSON.stringify({ path: apiPath });

    const res = await fetch(PROXY_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-DataForSEO-Auth': auth,
      },
      body: payload,
    });

    if (res.status === 401) {
      throw new DataforseoError(
        'DataForSEO authentication failed. Check your credentials in Profile.',
        401,
      );
    }
    if (res.status === 429) {
      throw new DataforseoError('DataForSEO rate limit reached. Try again shortly.', 429);
    }
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new DataforseoError(
        text || `DataForSEO proxy error (${res.status})`,
        res.status,
      );
    }

    const data = (await res.json()) as DataforseoResponse<T>;

    if (data.status_code !== 20000) {
      throw new DataforseoError(
        data.status_message || 'DataForSEO request failed',
        data.status_code,
      );
    }
    const task = data.tasks?.[0];
    if (task && task.status_code !== 20000) {
      throw new DataforseoError(
        task.status_message || 'DataForSEO task failed',
        data.status_code,
        task.status_code,
      );
    }

    return data;
  };

  return call;
}

export function getTaskResult<T>(response: DataforseoResponse<T>): T {
  const task = response.tasks?.[0];
  if (!task?.result || task.result.length === 0) {
    throw new DataforseoError('No results returned from DataForSEO', 200);
  }
  return task.result[0];
}

export function getTaskItems<T>(response: DataforseoResponse<unknown>): T[] {
  const result = getTaskResult<any>(response);
  return (result.items as T[]) ?? [];
}

export function getTaskTotalCount(response: DataforseoResponse<unknown>): number {
  const result = getTaskResult<any>(response);
  return result.total_count ?? 0;
}
