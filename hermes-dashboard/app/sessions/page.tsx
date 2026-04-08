'use client';

import { useEffect, useState } from 'react';
import SessionRow from '@/components/ui/SessionRow';
import type { Session } from '@/lib/types';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/sessions?limit=100');
        const data = await res.json();
        setSessions(data.sessions);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = sessions.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.id.toLowerCase().includes(q) ||
      s.title?.toLowerCase().includes(q) ||
      s.source.toLowerCase().includes(q) ||
      s.model?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Sessions</h1>
        <span className="text-sm text-muted-foreground">
          {sessions.length} total
        </span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search sessions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-card border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading sessions...</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted-foreground">No sessions found</div>
      ) : (
        filtered.map((session) => (
          <SessionRow key={session.id} session={session} />
        ))
      )}
    </div>
  );
}