"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hook SSR-safe để đọc/ghi localStorage.
 * Fallback về initialValue khi chạy server-side hoặc khi localStorage bị block.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Lazy init: đọc từ localStorage khi mount (client-only)
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      // localStorage có thể bị block (private mode iOS cũ)
    }
    setHydrated(true);
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const next = typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
          window.localStorage.setItem(key, JSON.stringify(next));
          return next;
        });
      } catch {
        // ignore write errors
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch {
      // ignore
    }
  }, [key, initialValue]);

  return { value: storedValue, setValue, removeValue, hydrated } as const;
}
