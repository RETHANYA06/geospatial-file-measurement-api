import React from 'react';

export default function KpiCard({
  icon: Icon,
  label,
  value,
  unit,
  subtitle,
  accentColor = 'emerald',
}) {
  const accentClasses = {
    emerald: 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    blue: 'text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/30',
    cyan: 'text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    purple: 'text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/30',
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] font-mono">
          {label}
        </span>
        <div
          className={`p-2.5 rounded-xl border transition-colors ${accentClasses[accentColor] || accentClasses.emerald}`}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-[var(--text-title)] font-mono">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-[var(--text-muted)]">
            {unit}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-[var(--text-dim)] truncate">
          {subtitle}
        </p>
      )}

      {/* Subtle bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent group-hover:via-emerald-500/60 transition-all duration-500" />
    </div>
  );
}
