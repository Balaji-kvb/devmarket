"use client";

import { useCallback, useEffect, useState } from "react";
import type { PlaygroundHistory } from "@/types";

const STORAGE_KEY = "devmarket-playground-history";
const MAX_HISTORY = 20;

function loadHistory(): PlaygroundHistory[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PlaygroundHistory[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

function persistHistory(history: PlaygroundHistory[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch {
    // ignore localStorage errors
  }
}

export function useRequestHistory() {
  const [history, setHistory] = useState<PlaygroundHistory[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const saveHistoryItem = useCallback((entry: PlaygroundHistory) => {
    setHistory((prev) => {
      const next = [entry, ...prev.filter((item) => item.id !== entry.id)].slice(0, MAX_HISTORY);
      persistHistory(next);
      return next;
    });
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((item) => item.id !== id);
      persistHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  const getHistoryItem = useCallback(
    (id: string) => history.find((item) => item.id === id) ?? null,
    [history]
  );

  return {
    history,
    saveHistoryItem,
    deleteHistoryItem,
    clearHistory,
    getHistoryItem,
  };
}
