import React from 'react';
import {
  FileCode,
  ChevronRight,
  UploadCloud,
  CheckCircle,
  Eye,
  Trash2,
} from 'lucide-react';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { useGeo } from '../../context/GeoContext';

export default function FilesListView() {
  const { datasets, activeDataset, inspectDataset, setActiveTab, clearDatasets } = useGeo();

  if (datasets.length === 0) {
    return (
      <EmptyState
        title="No files registered yet"
        description="Upload your spatial datasets (.kml or Shapefile .zip) to inspect layers, attributes, and calculated geometries."
        actionText="Upload Files Now"
        onAction={() => setActiveTab('upload')}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-title)] font-mono">
            Spatial Dataset Registry
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            {datasets.length} spatial file{datasets.length > 1 ? 's' : ''} in active session
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearDatasets}
            className="px-3 py-1.5 rounded-xl border border-[var(--border-main)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-rose-400 font-medium text-xs font-mono transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs font-mono transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            Upload Dataset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {datasets.map(file => {
          const isSelected = activeDataset?.id === file.id;
          const featCount = file.features?.length || 0;
          const measCount = file.measurements?.length || 0;

          return (
            <div
              key={file.id}
              onClick={() => inspectDataset(file.id)}
              className={`group cursor-pointer rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 bg-[var(--bg-card)] ${
                isSelected
                  ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                  : 'border-[var(--border-main)] hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] group-hover:border-emerald-500/40 transition-colors">
                  <FileCode className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant={file.file_type === 'KML' ? 'success' : 'cyan'}>
                    {file.file_type}
                  </Badge>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-main)]">
                    ID #{file.id}
                  </span>
                </div>
              </div>

              <h3 className="font-mono text-sm font-bold text-[var(--text-title)] truncate mb-1" title={file.filename}>
                {file.filename}
              </h3>

              <p className="text-xs text-[var(--text-dim)] truncate mb-4 font-mono text-[11px]">
                Path: {file.file_path || 'Uploaded File'}
              </p>

              <div className="space-y-2 py-3 border-y border-[var(--border-main)] text-xs font-mono">
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Source CRS:</span>
                  <span className="text-[var(--text-title)] font-semibold truncate max-w-[150px]">
                    {file.crs || '—'}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Extracted Features:</span>
                  <span className="text-[var(--text-title)] font-semibold">
                    {featCount}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Calculated Measurements:</span>
                  <span className="text-[var(--text-title)] font-semibold">
                    {measCount}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {file.status || 'processed'}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inspectDataset(file.id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 border border-emerald-500/30 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
