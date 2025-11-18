/**
 * Custom React hook for fetching dashboard data with auto-refresh
 * Polls the backend API every 5 seconds
 */

import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const REFRESH_INTERVAL = 5000; // 5 seconds

export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/live`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    // Initial load
    fetchData();

    // Set up auto-refresh interval
    const interval = setInterval(fetchData, REFRESH_INTERVAL);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}
