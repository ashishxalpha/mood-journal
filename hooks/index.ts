/**
 * Custom Hooks
 * Reusable React hooks for common functionality
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook for handling modal state
 * @param initialState - Initial visibility state
 * @returns Modal state and control functions
 */
export const useModal = (initialState = false) => {
  const [isVisible, setIsVisible] = useState(initialState);

  const open = () => setIsVisible(true);
  const close = () => setIsVisible(false);
  const toggle = () => setIsVisible((prev) => !prev);

  return { isVisible, open, close, toggle };
};

/**
 * Custom hook for debouncing a value
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for handling async operations
 * @returns Async operation state and handler
 */
export const useAsync = <T, E = Error>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<E | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (asyncFunction: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err as E);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return { loading, error, data, execute, reset };
};
