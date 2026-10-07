import React from 'react';
import {
  Server,
  Moon,
  Sun,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { useGeo } from '../../context/GeoContext';

export default function SettingsView() {
  const { theme, toggleTheme, apiStatus, verifyApiHealth, datasets } = useGeo();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Backend & API Diagnostics */}
      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-title)] font-mono">
                FastAPI Backend Diagnostics
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Core engine status and connected spatial services
              </p>
            </div>
          </div>

          <button
            onClick={verifyApiHealth}
            className="px-4 py-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-hover)] text-xs font-mono font-medium text-[var(--text-title)] border border-[var(--border-main)] transition-colors shadow-sm"
          >
            Re-test Connectivity
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] space-y-2">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Service Status:</span>
              <span
                className={`font-semibold ${
                  apiStatus.online ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {apiStatus.message}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">FastAPI Root:</span>
              <span className="text-[var(--text-title)]">/</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Upload Endpoint:</span>
              <span className="text-[var(--text-title)]">POST /api/files/</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Details Endpoint:</span>
              <span className="text-[var(--text-title)]">GET /api/files/&#123;id&#125;/</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Measurements:</span>
              <span className="text-[var(--text-title)]">GET /api/files/&#123;id&#125;/measurements/</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] space-y-2">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">GIS Libraries:</span>
              <span className="text-[var(--text-title)]">GeoPandas 1.1.4 · Shapely 2.1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Projections Engine:</span>
              <span className="text-[var(--text-title)]">PyProj 3.7 (UTM Reprojection)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Persistence Store:</span>
              <span className="text-[var(--text-title)]">SQLite · SQLAlchemy 2.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">File Payload Ceiling:</span>
              <span className="text-[var(--text-title)]">10 MB (Chunked Validation)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Active Datasets Cached:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{datasets.length}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-[var(--border-main)] flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)] font-mono">
            Interactive OpenAPI / Swagger Documentation
          </span>
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-mono font-medium transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Open /docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Interface & Theme Preferences */}
      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-sm">
        <h3 className="text-base font-bold text-[var(--text-title)] font-mono mb-4">
          UI Theme & Appearance
        </h3>

        <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)]">
          <div>
            <div className="font-mono text-sm font-semibold text-[var(--text-title)]">
              Color Theme
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              Select between Dark GIS Cartography Mode and Light Clean Mode
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:bg-[var(--bg-hover)] text-xs font-mono font-semibold transition-all text-[var(--text-title)] shadow-sm"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-4 h-4 text-emerald-400" />
                <span>Dark Theme (Active)</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Theme (Active)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Geospatial Architecture Notes */}
      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-sm font-mono text-xs">
        <h3 className="text-base font-bold text-[var(--text-title)] mb-2">
          Engine Architecture Notes
        </h3>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          This frontend interfaces directly with the FastAPI backend without modifying backend endpoints, schemas, or calculation logic. Features are rendered onto dynamic Leaflet vector layers from WKT strings, and measurements represent metric UTM projections calculated by GeoPandas and Shapely.
        </p>

        <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-dim)] text-[11px] border border-[var(--border-main)]">
          <div>Client: React 19 · Vite 8 · Tailwind CSS 4 · Leaflet 1.9 · Lucide React</div>
          <div className="mt-1">Backend: FastAPI · Uvicorn · GeoPandas 1.1 · Fiona · PyProj · SQLAlchemy</div>
        </div>
      </div>
    </div>
  );
}
