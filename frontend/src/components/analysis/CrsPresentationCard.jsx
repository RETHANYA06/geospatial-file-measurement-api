import React from 'react';
import { Globe, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import Badge from '../common/Badge';

export default function CrsPresentationCard({ crs, fileType }) {
  const isGeographic = crs && (crs.includes('4326') || crs.toLowerCase().includes('wgs') || crs.toLowerCase().includes('geographic'));

  return (
    <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-title)] font-mono tracking-tight">
              Coordinate Reference System (CRS) & Reprojection
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Preserving metric spatial integrity across spheroidal transformations
            </p>
          </div>
        </div>
        <Badge variant="cyan" size="sm">
          {fileType || 'VECTOR'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center my-4 p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)]">
        {/* Source CRS */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-dim)]">
            Source CRS (Stored)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-[var(--text-title)] font-mono">
              {crs || 'Undefined CRS'}
            </span>
            {crs && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 font-mono">
                {isGeographic ? 'Geographic' : 'Projected'}
              </span>
            )}
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">
            {isGeographic ? 'Angles (Degrees: Longitude, Latitude)' : 'Planar Coordinates (Meters)'}
          </span>
        </div>

        {/* Reprojection Indicator */}
        <div className="flex flex-col items-center justify-center py-2 md:py-0 border-y md:border-y-0 md:border-x border-[var(--border-main)]">
          <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-mono text-xs font-semibold">
            <span className="hidden sm:inline">Reprojected</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-[var(--text-dim)] text-center mt-1">
            PyProj UTM Dynamic Estimation
          </span>
        </div>

        {/* Measurement CRS */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-dim)]">
            Measurement CRS (Engine)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-emerald-500 dark:text-emerald-400 font-mono">
              {isGeographic ? 'UTM Projected Grid' : (crs || 'Planar Grid')}
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">
            Metric Units: Area in m², Length in m
          </span>
        </div>
      </div>

      <div className="flex items-start gap-2.5 mt-3 text-xs text-[var(--text-muted)] bg-[var(--bg-card-subtle)] p-3 rounded-lg border border-[var(--border-main)]">
        <Info className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Geographic coordinate systems use angular degrees, meaning Euclidean area and distance calculations would produce distorted ellipsoidal measurements. The backend safely reprojects geographic geometries into an estimated local UTM projected coordinate system before computing area and perimeter length.
        </p>
      </div>
    </div>
  );
}
