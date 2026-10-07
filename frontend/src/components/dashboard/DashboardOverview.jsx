import React, { useMemo } from 'react';
import {
  FolderArchive,
  Layers,
  Maximize2,
  Ruler,
  UploadCloud,
  ChevronRight,
  FileCode,
  PieChart,
  Eye,
  Trash2,
} from 'lucide-react';
import KpiCard from '../common/KpiCard';
import EmptyState from '../common/EmptyState';
import Badge from '../common/Badge';
import FileAnalysisView from '../analysis/FileAnalysisView';
import { useGeo } from '../../context/GeoContext';
import {
  formatArea,
  formatLength,
  formatNumber,
  summarizeGeometries,
} from '../../utils/formatters';

export default function DashboardOverview() {
  const {
    datasets,
    activeDataset,
    inspectDataset,
    setActiveTab,
    clearDatasets,
  } = useGeo();

  // Aggregate metrics across all loaded datasets
  const metrics = useMemo(() => {
    let totalFeatures = 0;
    let totalArea = 0;
    let totalLength = 0;
    let hasArea = false;
    let hasLength = false;

    const allFeatures = [];

    datasets.forEach(d => {
      const feats = d.features || [];
      const meas = d.measurements || [];
      totalFeatures += feats.length;
      allFeatures.push(...feats);

      meas.forEach(m => {
        if (m.area !== null && m.area !== undefined) {
          totalArea += Number(m.area);
          hasArea = true;
        }
        if (m.length !== null && m.length !== undefined) {
          totalLength += Number(m.length);
          hasLength = true;
        }
      });
    });

    const geomSummary = summarizeGeometries(allFeatures);

    return {
      totalFiles: datasets.length,
      totalFeatures,
      totalArea: hasArea ? totalArea : null,
      totalLength: hasLength ? totalLength : null,
      geomSummary,
    };
  }, [datasets]);

  if (datasets.length === 0) {
    return (
      <div className="space-y-8 animate-fadeIn">
        {/* KPI Cards in Empty State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            icon={FolderArchive}
            label="Total Datasets"
            value="0"
            subtitle="No datasets uploaded"
            accentColor="emerald"
          />
          <KpiCard
            icon={Layers}
            label="Total Features"
            value="0"
            subtitle="Waiting for vector data"
            accentColor="blue"
          />
          <KpiCard
            icon={Maximize2}
            label="Total Area"
            value="—"
            subtitle="Metric polygon area"
            accentColor="cyan"
          />
          <KpiCard
            icon={Ruler}
            label="Total Length"
            value="—"
            subtitle="Metric linestring length"
            accentColor="purple"
          />
        </div>

        <EmptyState
          title="No geospatial datasets loaded yet"
          description="Upload a KML file or Shapefile ZIP archive to automatically extract vector features, reproject coordinates, and compute metric area and length measurements."
          actionText="Upload Geospatial File"
          onAction={() => setActiveTab('upload')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          icon={FolderArchive}
          label="Total Files"
          value={formatNumber(metrics.totalFiles)}
          subtitle="Processed spatial archives"
          accentColor="emerald"
        />
        <KpiCard
          icon={Layers}
          label="Total Features"
          value={formatNumber(metrics.totalFeatures)}
          subtitle="Vector spatial geometries"
          accentColor="blue"
        />
        <KpiCard
          icon={Maximize2}
          label="Total Area"
          value={formatArea(metrics.totalArea)}
          subtitle="Metric UTM projected"
          accentColor="cyan"
        />
        <KpiCard
          icon={Ruler}
          label="Total Length"
          value={formatLength(metrics.totalLength)}
          subtitle="Metric distance vectors"
          accentColor="purple"
        />
      </div>

      {/* Geometry Breakdown Analytics Bar */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-title)] font-mono">
              Aggregate Geometry Distribution
            </h3>
          </div>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {metrics.totalFeatures} Total Features
          </span>
        </div>

        {/* Proportional progress bar */}
        {metrics.totalFeatures > 0 && (
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-[var(--bg-card-subtle)] border border-[var(--border-main)] mb-4">
            {metrics.geomSummary.Polygon > 0 && (
              <div
                style={{ width: `${(metrics.geomSummary.Polygon / metrics.totalFeatures) * 100}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Polygon: ${metrics.geomSummary.Polygon}`}
              />
            )}
            {metrics.geomSummary.MultiPolygon > 0 && (
              <div
                style={{ width: `${(metrics.geomSummary.MultiPolygon / metrics.totalFeatures) * 100}%` }}
                className="bg-teal-400 transition-all duration-500"
                title={`MultiPolygon: ${metrics.geomSummary.MultiPolygon}`}
              />
            )}
            {metrics.geomSummary.LineString > 0 && (
              <div
                style={{ width: `${(metrics.geomSummary.LineString / metrics.totalFeatures) * 100}%` }}
                className="bg-sky-400 transition-all duration-500"
                title={`LineString: ${metrics.geomSummary.LineString}`}
              />
            )}
            {metrics.geomSummary.MultiLineString > 0 && (
              <div
                style={{ width: `${(metrics.geomSummary.MultiLineString / metrics.totalFeatures) * 100}%` }}
                className="bg-blue-500 transition-all duration-500"
                title={`MultiLineString: ${metrics.geomSummary.MultiLineString}`}
              />
            )}
            {metrics.geomSummary.Point > 0 && (
              <div
                style={{ width: `${(metrics.geomSummary.Point / metrics.totalFeatures) * 100}%` }}
                className="bg-amber-400 transition-all duration-500"
                title={`Point: ${metrics.geomSummary.Point}`}
              />
            )}
            {metrics.geomSummary.Unsupported > 0 && (
              <div
                style={{ width: `${(metrics.geomSummary.Unsupported / metrics.totalFeatures) * 100}%` }}
                className="bg-slate-500 transition-all duration-500"
                title={`Unsupported: ${metrics.geomSummary.Unsupported}`}
              />
            )}
          </div>
        )}

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[var(--text-muted)]">Polygon: {metrics.geomSummary.Polygon}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shrink-0" />
            <span className="text-[var(--text-muted)]">MultiPoly: {metrics.geomSummary.MultiPolygon}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
            <span className="text-[var(--text-muted)]">Line: {metrics.geomSummary.LineString}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
            <span className="text-[var(--text-muted)]">MultiLine: {metrics.geomSummary.MultiLineString}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-[var(--text-muted)]">Point: {metrics.geomSummary.Point}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shrink-0" />
            <span className="text-[var(--text-muted)]">Other: {metrics.geomSummary.Unsupported}</span>
          </div>
        </div>
      </div>

      {/* Recent Files Table / Selector */}
      <div id="recent-datasets-table" className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[var(--border-main)] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-title)] font-mono">
              Recent Spatial Datasets
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Click Inspect on any dataset to load its cartography map, attributes, and measurements
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearDatasets}
              className="px-3 py-1.5 rounded-xl border border-[var(--border-main)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-rose-400 font-medium text-xs font-mono transition-colors inline-flex items-center gap-1.5 shadow-sm"
              title="Clear all datasets in session"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs font-mono transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload New
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[var(--border-main)] bg-[var(--bg-card-subtle)] text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                <th className="py-3 px-4">Dataset</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">CRS</th>
                <th className="py-3 px-4">Features</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y border-[var(--border-main)]">
              {datasets.map(d => {
                const isSelected = activeDataset?.id === d.id;
                return (
                  <tr
                    key={d.id}
                    onClick={() => inspectDataset(d.id)}
                    className={`hover:bg-[var(--bg-hover)] transition-colors cursor-pointer ${
                      isSelected ? 'bg-emerald-500/10' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-semibold text-[var(--text-title)]">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="truncate max-w-[200px]">{d.filename}</span>
                        {isSelected && (
                          <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-semibold">
                            (Active)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={d.file_type === 'KML' ? 'success' : 'cyan'}>
                        {d.file_type}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--text-body)]">
                      {d.crs || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--text-body)]">
                      {d.features?.length ?? '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        {d.status || 'processed'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          inspectDataset(d.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1.5 border border-emerald-500/30 transition-all cursor-pointer shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Dataset Full Analysis Card */}
      {activeDataset && (
        <div id="file-analysis-section" className="pt-6 scroll-mt-24">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Active Dataset Inspector: {activeDataset.filename}
              </h3>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('recent-datasets-table');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-title)] transition-colors"
            >
              ↑ Back to Datasets Table
            </button>
          </div>
          <FileAnalysisView dataset={activeDataset} />
        </div>
      )}
    </div>
  );
}
