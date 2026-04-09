'use client';

import React, { useState, useEffect } from 'react';
import type { Session } from '@/lib/types';
import { timeAgo } from '@/lib/utils';

interface SessionRowProps {
  session: Session;
}

const SessionRow: React.FC<SessionRowProps> = ({ session }) => {
  const [ago, setAgo] = useState('');

  useEffect(() => {
    setAgo(timeAgo(session.started_at));
    const interval = setInterval(() => setAgo(timeAgo(session.started_at)), 30000);
    return () => clearInterval(interval);
  }, [session.started_at]);

  return (
    <a href={`/sessions/${session.id}`} className="block no-underline text-inherit bg-[var(--card)] border-[1px_solid_var(--border)] rounded-lg p-4 mb-2 hover:bg-[var(--card-hover)] hover:border-[var(--accent)] transition-all cursor-pointer">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[0.9rem] mb-1">{session.title || session.id}</div>
          <div className="text-[var(--muted)] text-[0.75rem]">{session.source} · {session.model?.split('/')[1] || session.model || 'unknown'}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="[color:var(--muted)] text-[0.75rem]">{ago}</div>
          <div className="flex gap-2 mt-1 justify-end">
            <span className="bg-[var(--accent)] text-white text-[0.75rem] px-2 py-1 rounded-full font-medium">{session.message_count} msgs</span>
            {session.tool_call_count > 0 && (
              <span className="bg-[var(--success)] text-white text-[0.75rem] px-2 py-1 rounded-full font-medium">{session.tool_call_count} tools</span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default SessionRow;
