import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Database,
  Layers,
} from 'lucide-react';
import Badge from '../common/Badge';
import { formatArea, formatLength } from '../../utils/formatters';

export default function MeasurementsTable({ features = [], measurements = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [sortField, setSortField] = useState('feature_id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Merge features and measurements by feature_id
  const mergedRows = useMemo(() => {
    const measurementMap = new Map();
    measurements.forEach(m => {
      measurementMap.set(m.feature_id, m);
    });

    return features.map(f => {
      const m = measurementMap.get(f.feature_id);
      return {
        feature_id: f.feature_id,
        geometry_type: f.geometry_type,
        geometry_wkt: f.geometry,
        properties: f.properties || {},
        area: m?.area ?? null,
        length: m?.length ?? null,
        status: m?.area !== null || m?.length !== null ? 'Calculated' : f.geometry_type === 'Point' ? 'Point (No Calc)' : 'Unsupported',
      };
    });
  }, [features, measurements]);

  // Filter and search
  const filteredRows = useMemo(() => {
    return mergedRows.filter(row => {
      if (filterType !== 'ALL' && row.geometry_type !== filterType) {
        return false;
      }

      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesId = String(row.feature_id).includes(query);
        const matchesType = row.geometry_type.toLowerCase().includes(query);
        const matchesProps = JSON.stringify(row.properties).toLowerCase().includes(query);
        if (!matchesId && !matchesType && !matchesProps) {
          return false;
        }
      }

      return true;
    });
  }, [mergedRows, filterType, searchTerm]);

  // Sorting
  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (valA === null || valA === undefined) valA = -Infinity;
      if (valB === null || valB === undefined) valB = -Infinity;

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleRow = (featureId) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(featureId)) {
        next.delete(featureId);
      } else {
        next.add(featureId);
      }
      return next;
    });
  };

  const availableTypes = useMemo(() => {
    const types = new Set(mergedRows.map(r => r.geometry_type));
    return ['ALL', ...Array.from(types)];
  }, [mergedRows]);

  const getGeometryBadgeVariant = (type) => {
    if (type.includes('Polygon')) return 'success';
    if (type.includes('Line')) return 'cyan';
    if (type === 'Point') return 'amber';
    return 'neutral';
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-main)] overflow-hidden shadow-sm">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-[var(--border-main)] flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by feature ID, geometry, or attribute..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-card-subtle)] border border-[var(--border-main)] rounded-xl text-xs text-[var(--text-title)] placeholder-[var(--text-dim)] focus:outline-none focus:border-emerald-500 font-mono transition-colors"
          />
        </div>

        {/* Geometry Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-[var(--text-muted)] mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Type:
          </span>
          {availableTypes.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                filterType === t
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                  : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-title)] border border-transparent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-main)] bg-[var(--bg-card-subtle)] text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] font-mono select-none">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th
                onClick={() => handleSort('feature_id')}
                className="py-3 px-4 cursor-pointer hover:text-[var(--text-title)] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Feature ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('geometry_type')}
                className="py-3 px-4 cursor-pointer hover:text-[var(--text-title)] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Geometry</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('area')}
                className="py-3 px-4 cursor-pointer hover:text-[var(--text-title)] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Area</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('length')}
                className="py-3 px-4 cursor-pointer hover:text-[var(--text-title)] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Length</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Attributes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-main)] text-xs font-mono">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[var(--text-muted)]">
                  No features match the selected filter.
                </td>
              </tr>
            ) : (
              sortedRows.map((row) => {
                const isExpanded = expandedRows.has(row.feature_id);
                const hasProps = Object.keys(row.properties).length > 0;

                return (
                  <React.Fragment key={row.feature_id}>
                    <tr
                      onClick={() => toggleRow(row.feature_id)}
                      className={`hover:bg-[var(--bg-hover)] transition-colors cursor-pointer ${
                        isExpanded ? 'bg-[var(--bg-card-subtle)]' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center text-[var(--text-muted)]">
                        {hasProps ? (
                          isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-emerald-500 inline" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-[var(--text-muted)] inline" />
                          )
                        ) : (
                          <span className="text-[var(--text-dim)]">·</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[var(--text-title)]">
                        #{row.feature_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={getGeometryBadgeVariant(row.geometry_type)}>
                          {row.geometry_type}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[var(--text-body)]">
                        {formatArea(row.area)}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[var(--text-body)]">
                        {formatLength(row.length)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                            row.status === 'Calculated'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : row.status === 'Point (No Calc)'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                              : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-main)]'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-[var(--text-muted)]">
                        {hasProps ? (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 underline underline-offset-2">
                            {Object.keys(row.properties).length} attrs
                          </span>
                        ) : (
                          <span className="text-[var(--text-dim)]">—</span>
                        )}
                      </td>
                    </tr>

                    {/* Expandable row: reveals attributes / WKT snippet */}
                    {isExpanded && (
                      <tr className="bg-[var(--bg-card-subtle)] border-b border-[var(--border-main)]">
                        <td colSpan={7} className="p-4 pl-12">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Feature Properties */}
                            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)]">
                              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[var(--text-title)]">
                                <Database className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                                <span>Feature Attributes (Properties)</span>
                              </div>
                              {hasProps ? (
                                <dl className="grid grid-cols-2 gap-2 text-xs">
                                  {Object.entries(row.properties).map(([k, v]) => (
                                    <div key={k} className="truncate">
                                      <dt className="text-[var(--text-dim)] text-[10px] uppercase truncate">{k}</dt>
                                      <dd className="text-[var(--text-title)] font-mono truncate font-medium">
                                        {v !== null && v !== undefined ? String(v) : '—'}
                                      </dd>
                                    </div>
                                  ))}
                                </dl>
                              ) : (
                                <div className="text-xs text-[var(--text-dim)] italic">
                                  No additional attributes in source layer
                                </div>
                              )}
                            </div>

                            {/* WKT Snippet */}
                            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)]">
                              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[var(--text-title)]">
                                <Layers className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                                <span>WKT Geometry Definition</span>
                              </div>
                              <pre className="text-[11px] text-[var(--text-muted)] overflow-x-auto max-h-24 whitespace-pre-wrap break-all p-2 bg-[var(--bg-card-inner)] rounded-lg border border-[var(--border-main)]">
                                {row.geometry_wkt || '—'}
                              </pre>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 border-t border-[var(--border-main)] flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
        <span>
          Showing {sortedRows.length} of {mergedRows.length} features
        </span>
        <span className="text-[11px] text-[var(--text-dim)]">
          Click any row to inspect feature attributes and WKT
        </span>
      </div>
    </div>
  );
}
