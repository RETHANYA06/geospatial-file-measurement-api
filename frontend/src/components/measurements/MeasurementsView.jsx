import React from 'react';
import { Ruler } from 'lucide-react';
import MeasurementsTable from '../analysis/MeasurementsTable';
import EmptyState from '../common/EmptyState';
import { useGeo } from '../../context/GeoContext';

export default function MeasurementsView() {
  const { datasets, activeDataset, setActiveDatasetId, setActiveTab } = useGeo();

  if (datasets.length === 0) {
    return (
      <EmptyState
        title="No measurements available yet"
        description="Upload a geospatial vector file to calculate geodesic and UTM projected measurements for polygons and linestrings."
        actionText="Upload Dataset"
        onAction={() => setActiveTab('upload')}
      />
    );
  }

  const currentDataset = activeDataset || datasets[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Selector & Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 dark:text-purple-400">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-title)] font-mono">
              Dataset Measurement Inspector
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Examining metric area and length calculations computed by backend
            </p>
          </div>
        </div>

        {/* Dataset Switcher */}
        {datasets.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--text-muted)]">Dataset:</span>
            <select
              value={currentDataset.id}
              onChange={(e) => setActiveDatasetId(Number(e.target.value))}
              className="bg-[var(--bg-card-subtle)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--text-title)] focus:outline-none focus:border-emerald-500"
            >
              {datasets.map(d => (
                <option key={d.id} value={d.id} className="bg-[var(--bg-card)] text-[var(--text-title)]">
                  #{d.id} - {d.filename} ({d.file_type})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Measurements Table for active dataset */}
      <MeasurementsTable
        features={currentDataset.features || []}
        measurements={currentDataset.measurements || []}
      />
    </div>
  );
}
