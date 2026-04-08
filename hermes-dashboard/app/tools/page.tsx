'use client';

import { useEffect, useState } from 'react';
import ToolBar from '@/components/ui/ToolBar';
import type { ToolUsage } from '@/lib/types';

export default function ToolsPage() {
  const [tools, setTools] = useState<ToolUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/tools');
        const data = await res.json();
        setTools(data.tools || []);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  const maxCalls = tools.length > 0 ? Math.max(...tools.map(t => t.call_count)) : 1;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Tool Usage</h1>
        <p className="text-sm text-muted-foreground">
          Which tools Hermes uses most, based on message records
        </p>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading tool data...</div>
      ) : tools.length === 0 ? (
        <div className="text-muted-foreground">No tool usage data yet</div>
      ) : (
        tools.map((tool) => (
          <ToolBar key={tool.tool_name} tool={tool} maxCalls={maxCalls} />
        ))
      )}
    </div>
  );
}