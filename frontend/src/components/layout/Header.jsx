import React from 'react';
import { Moon, Sun, RefreshCw, Radio, Layers } from 'lucide-react';
import { useGeo } from '../../context/GeoContext';

export default function Header() {
  const { activeTab, theme, toggleTheme, apiStatus, verifyApiHealth, activeDataset } = useGeo();

  const titles = {
    dashboard: {
      title: 'Geospatial Analytics',
      subtitle: 'Analyze, measure, and explore your spatial vector datasets with high precision.',
    },
    upload: {
      title: 'Upload Geospatial Data',
      subtitle: 'Upload a KML file or Shapefile ZIP archive to extract features and compute metric measurements.',
    },
    files: {
      title: 'Dataset Management',
      subtitle: 'Inspect and manage processed geospatial files, layer properties, and geometries.',
    },
    measurements: {
      title: 'Spatial Measurements',
      subtitle: 'Accurate geodesic and UTM-projected area and length measurements.',
    },
    settings: {
      title: 'System & Engine Settings',
      subtitle: 'Configure backend connections, CRS reprojection options, and user preferences.',
    },
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="h-20 px-8 border-b border-[var(--border-main)] bg-[var(--bg-header)] backdrop-blur-md flex items-center justify-between sticky top-0 z-10 transition-colors">
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-[var(--text-title)] font-mono">
            {current.title}
          </h1>
          {activeDataset && activeTab !== 'upload' && (
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Layers className="w-3 h-3" />
              Active: {activeDataset.filename}
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-0.5 hidden sm:block">
          {current.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Real API Status Badge */}
        <div
          onClick={verifyApiHealth}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer select-none transition-all ${
            apiStatus.online
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
          }`}
          title="Click to re-ping FastAPI backend"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              apiStatus.online
                ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse'
                : 'bg-rose-500'
            }`}
          />
          <span className="font-mono">{apiStatus.message}</span>
          <RefreshCw className={`w-3 h-3 ml-0.5 opacity-70 ${apiStatus.checking ? 'animate-spin' : ''}`} />
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] hover:bg-[var(--bg-hover)] transition-all shadow-sm"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* User / Org Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-main)]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-slate-400/20">
            GIS
          </div>
        </div>
      </div>
    </header>
  );
}
