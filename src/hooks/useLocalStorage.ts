import React, { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

/**
 * Custom hook for managing state with localStorage persistence
 * Auto-saves on every change (debounced) and loads from storage on mount
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>, () => void] {
  // Initialize state with localStorage value if available
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`[v0] Error reading from localStorage for key "${key}":`, error);
      return initialValue;
    }
  });

  // Debounce timer for auto-save
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  // Auto-save to localStorage with debouncing
  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Debounce: save after 500ms of inactivity
        timeoutRef.current = setTimeout(() => {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          console.log(`[v0] Auto-saved to localStorage: ${key}`);
        }, 500);
      } catch (error) {
        console.error(`[v0] Error saving to localStorage for key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Clear function to reset both state and storage
  const clearValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
      console.log(`[v0] Cleared localStorage: ${key}`);
    } catch (error) {
      console.error(`[v0] Error clearing localStorage for key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [storedValue, setValue, clearValue];
}
