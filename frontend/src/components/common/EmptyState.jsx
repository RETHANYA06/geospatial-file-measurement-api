import React from 'react';
import { MapPin, UploadCloud, Layers } from 'lucide-react';
import { useGeo } from '../../context/GeoContext';

export default function EmptyState({
  icon: Icon = Layers,
  title = 'No datasets yet',
  description = 'Upload a geospatial file (KML or Shapefile ZIP) to begin analyzing your spatial data.',
  actionText = 'Upload File',
  onAction,
}) {
  const { setActiveTab } = useGeo();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      setActiveTab('upload');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-[var(--border-main)] bg-[var(--bg-card)] my-6">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shadow-inner">
          <Icon className="w-8 h-8" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
          <MapPin className="w-3.5 h-3.5" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-[var(--text-title)] mb-2 font-mono">
        {title}
      </h3>

      <p className="max-w-md text-sm text-[var(--text-muted)] mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && (
        <button
          onClick={handleAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <UploadCloud className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
}
