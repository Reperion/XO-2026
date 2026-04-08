'use client';

import { useEffect, useState } from 'react';
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
    <div style={{ marginTop: '0.5rem' }}>
      {calls.map((call, i) => (
        <div key={i} style={{ marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{
              background: 'var(--success)',
              color: 'white',
              fontSize: '0.7rem',
              padding: '0.1rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: 600,
            }}>
              TOOL
            </span>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{call.name || 'unknown'}</span>
          </div>
          {call.arguments ? (
            <pre className="json-viewer" style={{ fontSize: '0.75rem' }}>
              {JSON.stringify(call.arguments, null, 2)}
            </pre>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function MessageRow({ message }: { message: Message }) {
  const roleClass = message.role === 'user' ? 'message-user' :
                    message.tool_name ? 'message-tool' : 'message-assistant';

  return (
    <div className={roleClass} style={{ borderRadius: '0.5rem', padding: '1rem', marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {message.role === 'tool' ? `tool: ${message.tool_name}` : message.role}
        </span>
        <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
          {formatTimestamp(message.timestamp)}
          {message.token_count && ` · ${message.token_count} tokens`}
        </span>
      </div>

      {message.content && (
        <div style={{ fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {message.content.length > 2000 ? message.content.slice(0, 2000) + '...' : message.content}
        </div>
      )}

      <ToolCallView toolCalls={message.tool_calls} />

      {message.finish_reason && (
        <div style={{ color: 'var(--muted)', fontSize: '0.7rem', marginTop: '0.5rem' }}>
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
      } catch (e) {
        setError('Failed to load session');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId]);

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading session...</div>;
  if (error || !session) return <div style={{ color: 'var(--error)' }}>{error || 'Session not found'}</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <a href="/sessions" style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>← Back to Sessions</a>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.5rem' }}>
          {session.title || session.id}
        </h1>
        <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
          {session.source} · {session.model} · {formatTimestamp(session.started_at)}
          {session.ended_at && ` — ${formatTimestamp(session.ended_at)}`}
          {session.end_reason && ` · ${session.end_reason}`}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <span className="tool-badge">{session.message_count} messages</span>
        <span className="tool-badge" style={{ background: 'var(--success)' }}>{session.tool_call_count} tool calls</span>
        <span className="tool-badge" style={{ background: 'var(--muted)' }}>{session.input_tokens.toLocaleString()} in tokens</span>
        <span className="tool-badge" style={{ background: 'var(--muted)' }}>{session.output_tokens.toLocaleString()} out tokens</span>
        {session.actual_cost_usd !== null && (
          <span className="tool-badge" style={{ background: 'var(--warning)' }}>
            ${session.actual_cost_usd.toFixed(4)}
          </span>
        )}
      </div>

      {/* Messages */}
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--muted)' }}>
          Conversation ({messages.length} messages)
        </h2>
        {messages.map((msg) => (
          <MessageRow key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  );
}
