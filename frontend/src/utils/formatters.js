import parseWkt from 'wellknown';

/**
 * Formats area in square meters professionally
 * e.g., 12016.978112 -> "12,016.98 m²"
 * For large areas, also provides hectare / km² tooltip
 */
export function formatArea(val) {
  if (val === null || val === undefined || isNaN(val)) {
    return '—';
  }
  const num = Number(val);
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} m²`;
}

/**
 * Formats length in meters professionally
 * e.g., 263.603778 -> "263.60 m"
 */
export function formatLength(val) {
  if (val === null || val === undefined || isNaN(val)) {
    return '—';
  }
  const num = Number(val);
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} m`;
}

/**
 * General number formatter with commas
 */
export function formatNumber(val, decimals = 0) {
  if (val === null || val === undefined || isNaN(val)) {
    return '0';
  }
  return Number(val).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats file size in bytes to human-readable format
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Summarizes geometry types from a list of features
 */
export function summarizeGeometries(features = []) {
  const counts = {
    Polygon: 0,
    MultiPolygon: 0,
    LineString: 0,
    MultiLineString: 0,
    Point: 0,
    Unsupported: 0,
    Total: features.length,
  };

  features.forEach(f => {
    const type = f.geometry_type;
    if (type === 'Polygon') counts.Polygon++;
    else if (type === 'MultiPolygon') counts.MultiPolygon++;
    else if (type === 'LineString') counts.LineString++;
    else if (type === 'MultiLineString') counts.MultiLineString++;
    else if (type === 'Point') counts.Point++;
    else counts.Unsupported++;
  });

  return counts;
}

/**
 * Converts a list of backend features into a GeoJSON FeatureCollection
 */
export function featuresToGeoJSON(features = [], measurements = []) {
  const measurementMap = new Map();
  measurements.forEach(m => {
    measurementMap.set(m.feature_id, m);
  });

  const geoJsonFeatures = [];

  features.forEach(f => {
    if (!f.geometry) return;
    try {
      const geo = parseWkt(f.geometry);
      if (geo) {
        const m = measurementMap.get(f.feature_id);
        geoJsonFeatures.push({
          type: 'Feature',
          id: f.feature_id,
          geometry: geo,
          properties: {
            feature_id: f.feature_id,
            geometry_type: f.geometry_type,
            area: m?.area ?? null,
            length: m?.length ?? null,
            ...(typeof f.properties === 'object' ? f.properties : {}),
          },
        });
      }
    } catch {
      // Ignored if WKT parser encounters irregular coordinate format
    }
  });

  return {
    type: 'FeatureCollection',
    features: geoJsonFeatures,
  };
}
