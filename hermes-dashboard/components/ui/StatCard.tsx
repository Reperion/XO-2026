import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <div className="bg-[var(--card)] border-[1px_solid_var(--border)] rounded-[0.75rem] p-[1.25rem]">
    <div className="[font-size:2rem] font-bold [font-variant-numeric:tabular-nums]">{value}</div>
    <div className="text-[0.875rem] text-[var(--muted)] mt-[0.25rem]">{label}</div>
  </div>
);

export default StatCard;
