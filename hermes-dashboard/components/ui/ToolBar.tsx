import React from 'react';
import type { ToolUsage } from '@/lib/types';
import { timeAgo } from '@/lib/utils';

interface ToolBarProps {
  tool: ToolUsage;
  maxCalls: number;
}

const ToolBar: React.FC<ToolBarProps> = ({ tool, maxCalls }) => {
  const barWidth = (tool.call_count / maxCalls) * 100;
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 mb-3">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold font-mono text-[0.9rem]">{tool.tool_name}</span>
        <div className="flex gap-4 items-center">
          <span className="text-[var(--muted)] text-sm">last used {timeAgo(tool.last_used)}</span>
          <span className="font-bold text-[var(--accent)]">{tool.call_count}</span>
        </div>
      </div>
      <div className="bg-[var(--border)] rounded-full h-1.5 overflow-hidden">
        <div 
className={`h-full rounded-full bg-[var(--accent)] transition-all duration-300 w-[${barWidth}%]`}
        />
      </div>
    </div>
  );
};

export default ToolBar;
