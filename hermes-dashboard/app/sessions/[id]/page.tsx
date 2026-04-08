'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Session, Message } from '@/lib/types';

function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleString();
}

function parseToolCalls(json: string | null): Array<{ id: string; type: string; name: string; arguments: unknown }> {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}

function ToolCallView({ toolCalls }: { toolCalls: string | null }) {
  const calls = parseToolCalls(toolCalls);
  if (calls.length === 0) return null;
  return (
    <div className="mt-2">
      {calls.map((call, i) => (
        <div key={i} className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[var(--success)] text-white text-xs px-1 py-px rounded font-semibold">
              TOOL
            </span>
            <span className="font-semibold text-sm">{call.name || 'unknown'}</span>
          </div>
          {call.arguments ? (
            <pre className="json-viewer text-xs">
              {JSON.stringify(call.arguments, null, 2)}
            </pre>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function MessageRow({ message }: { message: Message }) {
  const roleClass = message.role === 'user' ? 'message-user' : message.role === 'tool' ? 'message-tool' : 'message-assistant';
  return (
    <div className={`${roleClass} rounded-lg p-4 mb-3`}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm uppercase tracking-wider">
          {message.role === 'tool' ? `tool: ${message.tool_name}` : message.role}
        </span>
        <span className="text-[var(--muted)] text-xs">
          {formatTimestamp(message.timestamp)}
          {message.token_count && ` · ${message.token_count} tokens`}
        </span>
      </div>
      {message.content && (
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content.length > 2000 ? message.content.slice(0, 2000) + '...' : message.content}
        </div>
      )}
      <ToolCallView toolCalls={message.tool_calls} />
      {message.finish_reason && (
        <div className="text-[var(--muted)] text-xs mt-2">
          finish_reason: {message.finish_reason}
        </div>
      )}
    </div>
  );
}

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setSessionId(p.id));
  }, [params]);

  useEffect(() => {
    if (!sessionId) return;
    async function load() {
      try {
        const [sessionRes, messagesRes] = await Promise.all([
          fetch(`/api/sessions/${sessionId}`),
          fetch(`/api/sessions/${sessionId}/messages`),
        ]);
        if (!sessionRes.ok || !messagesRes.ok) throw new Error('Failed to load session');
        const sessionData = await sessionRes.json();
        const messagesData = await messagesRes.json();
        setSession(sessionData);
        setMessages(messagesData.messages);
      } catch {
        setError('Failed to load session');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId]);

  if (loading) return <div className="text-[var(--muted)]">Loading session...</div>;
  if (error || !session) return <div className="text-[var(--error)]">{error || 'Session not found'}</div>;

  return (
    <div>
      <div className="mb-6">
        <Link href="/sessions" className="text-sm text-[var(--muted)]">← Back to Sessions</Link>
        <h1 className="text-lg font-semibold mt-2">
          {session.title || session.id}
        </h1>
        <div className="text-[var(--muted)] text-xs mt-1">
          {session.source} · {session.model} · {formatTimestamp(session.started_at)}
          {session.ended_at && ` — ${formatTimestamp(session.ended_at)}`}
          {session.end_reason && ` · ${session.end_reason}`}
        </div>
      </div>
      <div className="flex gap-4 mb-6 flex-wrap">
        <span className="tool-badge">{session.message_count} messages</span>
        <span className="tool-badge bg-[var(--success)]">{session.tool_call_count} tool calls</span>
        <span className="tool-badge bg-[var(--muted)]">{session.input_tokens.toLocaleString()} in tokens</span>
        <span className="tool-badge bg-[var(--muted)]">{session.output_tokens.toLocaleString()} out tokens</span>
        {session.actual_cost_usd !== null && (
          <span className="tool-badge bg-[var(--warning)]">
            ${session.actual_cost_usd.toFixed(4)}
          </span>
        )}
      </div>
      <div>
        <h2 className="text-base font-semibold mb-4 text-[var(--muted)]">
          Conversation ({messages.length} messages)
        </h2>
        {messages.map((msg) => (
          <MessageRow key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  );
}