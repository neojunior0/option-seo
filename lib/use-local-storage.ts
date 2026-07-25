'use client';

import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // ignore
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update] as const;
}

type HistoryEntry = {
  query: string;
  timestamp: string;
};

export function useSearchHistory(storageKey: string, limit = 10) {
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    `optionseo_history_${storageKey}`,
    [],
  );

  const addEntry = useCallback(
    (query: string) => {
      if (!query.trim()) return;
      setHistory((prev) => {
        const filtered = prev.filter(
          (e) => e.query.toLowerCase() !== query.toLowerCase(),
        );
        return [
          { query, timestamp: new Date().toISOString() },
          ...filtered,
        ].slice(0, limit);
      });
    },
    [setHistory, limit],
  );

  const clearHistory = useCallback(() => setHistory([]), [setHistory]);

  return { history, addEntry, clearHistory };
}
