
import { useState, useEffect } from 'react';

export const useFetchData = (url, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  // Re-sync if initialData changes or url changes but we want to reset
  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
      setError(null);
    }
  }, [initialData]);

  useEffect(() => {
    const fetchData = async () => {
      // Skip if we already have initialData for this initial run
      // unless we want to forcefully refetch
      if (initialData) return;
      
      try {
        setLoading(true);
        // Add a timestamp to prevent caching issues during development
        const response = await fetch(`${url}?t=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        console.error("Data fetching error:", err);
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (url && !initialData) {
      fetchData();
    }
  }, [url, initialData]);

  return { data, loading, error };
};
