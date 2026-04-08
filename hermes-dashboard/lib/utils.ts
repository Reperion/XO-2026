export function formatNumber(n: number | null): string {
  if (n === null || n === 0) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

export function formatCost(n: number | null): string {
  if (n === null) return '—';
  return '$' + n.toFixed(4);
}

export function timeAgo(ts: number): string {
  const seconds = Math.floor(Date.now() / 1000 - ts);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleString();
}

export function formatNext(ts: string | null): string {
  if (!ts) return '—';
  const d = new Date(ts);
  return d.toLocaleString();
}
