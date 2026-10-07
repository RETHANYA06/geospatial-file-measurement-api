import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { featuresToGeoJSON, formatArea, formatLength } from '../../utils/formatters';
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { useGeo } from '../../context/GeoContext';

export default function GeospatialMap({ features = [], measurements = [], crs = '' }) {
  const { theme } = useGeo();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  // Initialize or update map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20.5937, 78.9629],
        zoom: 4,
        zoomControl: false,
        attributionControl: false,
      });
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Update tile layer based on theme
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl = theme === 'light'
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    const tiles = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tiles;

    // Render geometries
    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    if (features && features.length > 0) {
      const geoJsonData = featuresToGeoJSON(features, measurements);

      if (geoJsonData.features.length > 0) {
        const geoLayer = L.geoJSON(geoJsonData, {
          style: (feature) => {
            const type = feature.geometry.type;
            if (type.includes('Polygon')) {
              return {
                color: '#10b981',
                weight: 2,
                opacity: 0.9,
                fillColor: '#10b981',
                fillOpacity: theme === 'light' ? 0.35 : 0.25,
              };
            } else if (type.includes('Line')) {
              return {
                color: theme === 'light' ? '#0284c7' : '#38bdf8',
                weight: 3.5,
                opacity: 0.9,
              };
            }
            return {
              color: '#f59e0b',
              weight: 2,
            };
          },
          pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 6,
              fillColor: '#f59e0b',
              color: '#ffffff',
              weight: 1.5,
              opacity: 1,
              fillOpacity: 0.9,
            });
          },
          onEachFeature: (feature, layer) => {
            layer.on({
              click: () => {
                setSelectedFeature(feature.properties);
              },
              mouseover: (e) => {
                const target = e.target;
                if (target.setStyle) {
                  target.setStyle({
                    fillOpacity: 0.55,
                    weight: 3,
                  });
                }
              },
              mouseout: (e) => {
                geoLayer.resetStyle(e.target);
              },
            });

            const p = feature.properties;
            const content = `
              <div class="text-xs font-mono p-1">
                <div class="font-bold text-emerald-500 dark:text-emerald-400 mb-1">Feature #${p.feature_id} (${p.geometry_type})</div>
                ${p.area !== null ? `<div>Area: <b>${formatArea(p.area)}</b></div>` : ''}
                ${p.length !== null ? `<div>Length: <b>${formatLength(p.length)}</b></div>` : ''}
              </div>
            `;
            layer.bindPopup(content);
          },
        }).addTo(map);

        geoJsonLayerRef.current = geoLayer;

        try {
          const bounds = geoLayer.getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
          }
        } catch {
          // Fallback
        }
      }
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [features, measurements, theme]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleFitBounds = () => {
    if (geoJsonLayerRef.current && mapInstanceRef.current) {
      const bounds = geoJsonLayerRef.current.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  };

  return (
    <div className="relative w-full h-[400px] lg:h-[480px] rounded-2xl overflow-hidden border border-[var(--border-main)] bg-[var(--bg-card)] shadow-md">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-[var(--bg-card)]/95 backdrop-blur-md p-1.5 rounded-xl border border-[var(--border-main)] shadow-lg">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-title)] hover:bg-[var(--bg-hover)] transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-title)] hover:bg-[var(--bg-hover)] transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-px bg-[var(--border-main)] my-0.5" />
        <button
          onClick={handleFitBounds}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-title)] hover:bg-[var(--bg-hover)] transition-colors"
          title="Fit Layer Bounds"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-4 bg-[var(--bg-card)]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[var(--border-main)] text-xs font-mono shadow-md">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500" />
          <span className="text-[var(--text-body)]">Polygon</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-sky-500 rounded" />
          <span className="text-[var(--text-body)]">LineString</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
          <span className="text-[var(--text-body)]">Point</span>
        </div>
        {crs && (
          <div className="hidden sm:flex items-center pl-3 border-l border-[var(--border-main)] text-[var(--text-muted)] text-[11px]">
            CRS: {crs}
          </div>
        )}
      </div>

      {/* Quick Feature Inspector Drawer */}
      {selectedFeature && (
        <div className="absolute top-4 left-4 z-20 max-w-xs bg-[var(--bg-card)]/95 backdrop-blur-md p-4 rounded-xl border border-[var(--border-main)] shadow-xl text-xs font-mono animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-emerald-500 dark:text-emerald-400">
              Feature #{selectedFeature.feature_id}
            </span>
            <button
              onClick={() => setSelectedFeature(null)}
              className="text-[var(--text-muted)] hover:text-[var(--text-title)]"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1 text-[var(--text-body)]">
            <div>Type: {selectedFeature.geometry_type}</div>
            {selectedFeature.area !== null && (
              <div>Area: {formatArea(selectedFeature.area)}</div>
            )}
            {selectedFeature.length !== null && (
              <div>Length: {formatLength(selectedFeature.length)}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
