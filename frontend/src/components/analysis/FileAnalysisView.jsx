import React, { useMemo } from 'react';
import {
  FileText,
  Layers,
  Ruler,
  Compass,
  CheckCircle,
} from 'lucide-react';
import Badge from '../common/Badge';
import GeospatialMap from './GeospatialMap';
import MeasurementsTable from './MeasurementsTable';
import CrsPresentationCard from './CrsPresentationCard';
import {
  formatArea,
  formatLength,
  summarizeGeometries,
  formatNumber,
} from '../../utils/formatters';

export default function FileAnalysisView({ dataset }) {
  if (!dataset) return null;

  const features = dataset.features || [];
  const measurements = dataset.measurements || [];

  // Summary counts
  const summary = useMemo(() => {
    return summarizeGeometries(features);
  }, [features]);

  // Aggregate measurements for this file
  const { totalArea, totalLength } = useMemo(() => {
    let aSum = 0;
    let lSum = 0;
    let hasArea = false;
    let hasLength = false;

    measurements.forEach(m => {
      if (m.area !== null && m.area !== undefined) {
        aSum += Number(m.area);
        hasArea = true;
      }
      if (m.length !== null && m.length !== undefined) {
        lSum += Number(m.length);
        hasLength = true;
      }
    });

    return {
      totalArea: hasArea ? aSum : null,
      totalLength: hasLength ? lSum : null,
    };
  }, [measurements]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / File Meta Card */}
      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-[var(--text-title)] font-mono tracking-tight">
                  {dataset.filename}
                </h2>
                <Badge variant={dataset.file_type === 'KML' ? 'success' : 'cyan'}>
                  {dataset.file_type}
                </Badge>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle className="w-3 h-3" />
                  {dataset.status || 'processed'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                Dataset Record #{dataset.id} · Stored at: {dataset.file_path || 'Indexed File'}
              </p>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] font-mono text-xs">
              <span className="text-[var(--text-dim)] block text-[10px] uppercase">Total Features</span>
              <span className="text-base font-bold text-[var(--text-title)]">
                {formatNumber(features.length)}
              </span>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] font-mono text-xs">
              <span className="text-[var(--text-dim)] block text-[10px] uppercase">Aggregated Area</span>
              <span className="text-base font-bold text-emerald-500 dark:text-emerald-400">
                {formatArea(totalArea)}
              </span>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] font-mono text-xs">
              <span className="text-[var(--text-dim)] block text-[10px] uppercase">Aggregated Length</span>
              <span className="text-base font-bold text-sky-500 dark:text-sky-400">
                {formatLength(totalLength)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Geometry Breakdown Summary Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-title)] font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            Geometry Type Breakdown
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] font-mono">
            <span className="text-[11px] text-[var(--text-muted)] block truncate">Polygon</span>
            <span className="text-xl font-bold text-emerald-500 dark:text-emerald-400">{summary.Polygon}</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] font-mono">
            <span className="text-[11px] text-[var(--text-muted)] block truncate">MultiPolygon</span>
            <span className="text-xl font-bold text-teal-500 dark:text-teal-400">{summary.MultiPolygon}</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] font-mono">
            <span className="text-[11px] text-[var(--text-muted)] block truncate">LineString</span>
            <span className="text-xl font-bold text-sky-500 dark:text-sky-400">{summary.LineString}</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] font-mono">
            <span className="text-[11px] text-[var(--text-muted)] block truncate">MultiLineString</span>
            <span className="text-xl font-bold text-blue-500 dark:text-blue-400">{summary.MultiLineString}</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] font-mono">
            <span className="text-[11px] text-[var(--text-muted)] block truncate">Point</span>
            <span className="text-xl font-bold text-amber-500 dark:text-amber-400">{summary.Point}</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] font-mono">
            <span className="text-[11px] text-[var(--text-muted)] block truncate">Unsupported</span>
            <span className="text-xl font-bold text-[var(--text-muted)]">{summary.Unsupported}</span>
          </div>
        </div>
      </div>

      {/* CRS Presentation Card */}
      <CrsPresentationCard crs={dataset.crs} fileType={dataset.file_type} />

      {/* Interactive Map Visualizer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-title)] font-mono flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            Interactive Spatial Cartography
          </h3>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            Rendered from WKT geometries via Leaflet
          </span>
        </div>

        <GeospatialMap
          features={features}
          measurements={measurements}
          crs={dataset.crs}
        />
      </div>

      {/* Measurements & Feature Inspector Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-title)] font-mono flex items-center gap-2">
            <Ruler className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            Extracted Features & Measurements
          </h3>
        </div>

        <MeasurementsTable features={features} measurements={measurements} />
      </div>
    </div>
  );
}
