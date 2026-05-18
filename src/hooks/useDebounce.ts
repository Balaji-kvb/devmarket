import { useState, useEffect } from "react";

/**
 * Debounces a value by the specified delay.
 * Returns the debounced value — only updates after the caller
 * stops changing the input for `delay` milliseconds.
 *
 * SSR-safe: returns initial value immediately on server.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
