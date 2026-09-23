'use client';

import { useState, useEffect } from 'react';

// For local development, this could be http://localhost:3000
// But in production, it will be the public URL.
// We'll use a relative path if it's hosted on the same domain,
// or configure it via environment variable.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

interface RouteData {
  id: string;
  name: string;
  origin: string;
  destination: string;
  status: string;
  departureTime: string;
  arrivalTime: string;
  fareMinor: number;
  currency: string;
}

interface Meta {
  total: number;
  limit: number;
  hasNextPage: boolean;
  nextCursor: string | null;
}

export default function ConsumerPage() {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [cursor, setCursor] = useState<string | null>(null);
  
  // History of cursors to go back (optional, but good for UX)
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);

  const fetchRoutes = async (currentCursor?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('limit', '12'); // Fetch 12 items per page
      if (searchOrigin) params.append('origin', searchOrigin);
      if (searchDestination) params.append('destination', searchDestination);
      if (currentCursor) params.append('cursor', currentCursor);

      const res = await fetch(`${API_BASE}/api/v1/routes?${params.toString()}`);
      
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error(`Rate limit exceeded. Please try again in ${res.headers.get('Retry-After') || 60} seconds.`);
        }
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error?.message || `Error: ${res.status}`);
      }

      const json = await res.json();
      setRoutes(json.data);
      setMeta(json.meta);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset to first page when search changes
    setCursor(null);
    setCursorHistory([]);
    fetchRoutes(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOrigin, searchDestination]);

  const handleNextPage = () => {
    if (meta?.hasNextPage && meta.nextCursor) {
      setCursorHistory([...cursorHistory, cursor || '']);
      setCursor(meta.nextCursor);
      fetchRoutes(meta.nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (cursorHistory.length > 0) {
      const prevCursor = cursorHistory[cursorHistory.length - 1];
      const newHistory = cursorHistory.slice(0, -1);
      setCursorHistory(newHistory);
      setCursor(prevCursor === '' ? null : prevCursor);
      fetchRoutes(prevCursor === '' ? null : prevCursor);
    }
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1>Transport Routes</h1>
        <p className="text-gray">Consumer app demonstrating the Consumable API</p>
      </header>

      <section style={{ marginBottom: '2rem' }}>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Filter by origin..."
            value={searchOrigin}
            onChange={(e) => setSearchOrigin(e.target.value)}
            style={{ width: '200px' }}
          />
          <input
            type="text"
            placeholder="Filter by destination..."
            value={searchDestination}
            onChange={(e) => setSearchDestination(e.target.value)}
            style={{ width: '200px' }}
          />
          {loading && <span className="text-gray">Loading...</span>}
        </div>
      </section>

      {error && (
        <div className="card" style={{ borderColor: 'var(--error)', backgroundColor: '#fef2f2', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--error)' }}>Error</h3>
          <p>{error}</p>
          <button onClick={() => fetchRoutes(cursor)} style={{ marginTop: '1rem' }}>Retry</button>
        </div>
      )}

      {!error && routes.length === 0 && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 className="text-gray">No routes found</h3>
          <p className="text-gray">Try adjusting your filters.</p>
        </div>
      )}

      <div className="grid">
        {routes.map((route) => (
          <div key={route.id} className="card flex flex-col justify-between">
            <div>
              <h3>{route.name}</h3>
              <p className="text-sm text-gray">{route.origin} → {route.destination}</p>
              <p className="text-sm text-gray" style={{ marginTop: '0.5rem' }}>
                Status: <span style={{ color: route.status === 'active' ? 'green' : 'red' }}>{route.status}</span>
              </p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <strong>${(route.fareMinor / 100).toFixed(2)} {route.currency}</strong>
              <div className="text-sm text-gray text-right">
                <div>Dep: {new Date(route.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div>Arr: {new Date(route.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!error && (
        <div className="flex items-center justify-between mt-8">
          <button 
            onClick={handlePrevPage} 
            disabled={cursorHistory.length === 0 || loading}
          >
            Previous Page
          </button>
          
          <span className="text-sm text-gray">
            {meta?.total !== undefined && `Total: ${meta.total} routes`}
          </span>

          <button 
            onClick={handleNextPage} 
            disabled={!meta?.hasNextPage || loading}
          >
            Next Page
          </button>
        </div>
      )}
    </div>
  );
}
