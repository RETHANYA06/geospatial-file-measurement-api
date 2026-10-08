/**
 * API Service Layer for Geospatial File Measurement API
 * Communicates strictly with existing backend endpoints:
 * - GET  /
 * - POST /api/files/
 * - GET  /api/files/{id}/
 * - GET  /api/files/{id}/measurements/
 */

const DIRECT_BACKEND_URL = 'https://geospatial-file-measurement-api-0a3i.onrender.com';

/**
 * Parses FastAPI error response details into user-friendly messages
 */
export function formatApiError(error) {
  if (typeof error === 'string') {
    return error;
  }
  const detail = error?.detail || error?.message || 'An unexpected error occurred';

  if (typeof detail === 'string') {
    if (detail.includes('10 MB limit') || detail.includes('413')) {
      return 'File Too Large: Please upload a file smaller than 10 MB.';
    }
    if (detail.includes('valid Shapefile')) {
      return 'Invalid Shapefile Archive: The ZIP file must contain at least .shp, .shx, and .dbf components.';
    }
    if (detail.includes('Only .kml and .zip')) {
      return 'Unsupported Format: Please upload a standard .kml file or a Shapefile .zip archive.';
    }
    if (detail.includes('not contain a CRS') || detail.includes('CRS')) {
      return `CRS Error: ${detail}`;
    }
    if (detail.includes('File not found')) {
      return 'Dataset Not Found: The requested spatial dataset could not be found in the database.';
    }
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail.map(d => d.msg || JSON.stringify(d)).join(', ');
  }

  return JSON.stringify(detail);
}

/**
 * Checks backend health across direct and proxied endpoints
 */
export async function checkApiHealth() {
  // Strategy 1: Ping direct FastAPI backend port 8000
  try {
    const res = await fetch(`${DIRECT_BACKEND_URL}/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.message || data.status)) {
        return { online: true, message: 'API Connected' };
      }
    }
  } catch {
    // Direct port ping failed, fall through to proxy check
  }

  // Strategy 2: Check proxied OpenAPI specification
  try {
    const res = await fetch('/openapi.json', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.openapi) {
        return { online: true, message: 'API Connected' };
      }
    }
  } catch {
    // Proxy check failed
  }

  // Strategy 3: Check localhost alias
  try {
    const res = await fetch('https://geospatial-file-measurement-api-0a3i.onrender.com', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.message) {
        return { online: true, message: 'API Connected' };
      }
    }
  } catch {
    // Offline
  }

  return { online: false, message: 'API Offline' };
}

/**
 * Helper to fetch with automatic proxy and direct fallback
 */
async function fetchWithFallback(endpoint, options = {}) {
  try {
    // Try relative endpoint (via Vite proxy)
    const response = await fetch(endpoint, options);
    // If not a 404/500 proxy error or HTML response
    const contentType = response.headers.get('content-type') || '';
    if (response.status < 500 && (contentType.includes('json') || response.status === 400 || response.status === 413 )) {
      return response;
    }
  } catch {
    // Relative proxy request threw network error, try direct backend URL
  }

  // Fallback directly to port 8000
  return await fetch(`${DIRECT_BACKEND_URL}${endpoint}`, options);
}

/**
 * Uploads a geospatial file (.kml or .zip) to POST /api/files/
 */
export async function uploadGeospatialFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetchWithFallback('/api/files/', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorJson;
    try {
      errorJson = await response.json();
    } catch {
      errorJson = { detail: response.statusText || `Upload failed with HTTP ${response.status}` };
    }
    const userMessage = formatApiError(errorJson);
    const err = new Error(userMessage);
    err.status = response.status;
    err.raw = errorJson;
    throw err;
  }

  return await response.json();
}

/**
 * Fetches file metadata and extracted features
 */
export async function getFileDetails(fileId) {
  const response = await fetchWithFallback(`/api/files/${fileId}/`);
  if (!response.ok) {
    let errorJson;
    try {
      errorJson = await response.json();
    } catch {
      errorJson = { detail: `HTTP ${response.status}` };
    }
    const err = new Error(formatApiError(errorJson));
    err.status = response.status;
    throw err;
  }
  return await response.json();
}

/**
 * Fetches calculated measurements for a file
 */
export async function getFileMeasurements(fileId) {
  const response = await fetchWithFallback(`/api/files/${fileId}/measurements/`);
  if (!response.ok) {
    let errorJson;
    try {
      errorJson = await response.json();
    } catch {
      errorJson = { detail: `HTTP ${response.status}` };
    }
    const err = new Error(formatApiError(errorJson));
    err.status = response.status;
    throw err;
  }
  return await response.json();
}

/**
 * Synchronizes client registry with existing backend database records.
 * Uses existing GET /api/files/{id}/ endpoints to discover existing files.
 */
export async function discoverBackendFiles(knownIds = []) {
  const idSet = new Set(knownIds.map(Number));
  const discovered = [];

  let consecutiveMisses = 0;
  for (let id = 1; id <= 60; id++) {
    try {
      const details = await getFileDetails(id);
      if (details && details.id) {
        let measurements = [];
        try {
          const mRes = await getFileMeasurements(id);
          measurements = mRes.measurements || [];
        } catch {
          // measurements may be empty
        }
        discovered.push({
          ...details,
          measurements,
        });
        idSet.add(id);
        consecutiveMisses = 0;
      }
    } catch (err) {
      if (err.status === 404) {
        consecutiveMisses++;
        if (consecutiveMisses >= 4 && id > 10) {
          break;
        }
      }
    }
  }

  return discovered;
}
