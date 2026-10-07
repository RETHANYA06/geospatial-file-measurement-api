import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileCheck,
  AlertCircle,
  RefreshCw,
  FileCode,
  CheckCircle2,
  FolderArchive,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { uploadGeospatialFile } from '../../services/api';
import { formatFileSize } from '../../utils/formatters';
import { useGeo } from '../../context/GeoContext';

export default function UploadDropzone({ onUploadSuccess }) {
  const { addDataset, setActiveTab, showToast } = useGeo();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState('IDLE'); // IDLE, SELECTED, UPLOADING, PROCESSING, SUCCESS, ERROR
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadResult, setUploadResult] = useState(null);

  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

  const validateFile = (file) => {
    if (!file) return 'No file selected';
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'kml' && ext !== 'zip') {
      return 'Unsupported format: Only .kml files and Shapefile .zip archives are supported.';
    }
    if (file.size > MAX_SIZE_BYTES) {
      return 'File Too Large: File size exceeds the 10 MB limit.';
    }
    return null;
  };

  const handleFileSelection = (file) => {
    const error = validateFile(file);
    if (error) {
      setStatus('ERROR');
      setErrorMessage(error);
      setSelectedFile(file);
      showToast(error, 'error');
      return;
    }

    setSelectedFile(file);
    setStatus('SELECTED');
    setErrorMessage('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    try {
      setStatus('UPLOADING');
      setTimeout(() => {
        if (status === 'UPLOADING') setStatus('PROCESSING');
      }, 400);

      const result = await uploadGeospatialFile(selectedFile);
      setUploadResult(result);
      setStatus('SUCCESS');
      addDataset(result);
      showToast(`Successfully processed ${result.filename}!`, 'success');

      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (err) {
      setStatus('ERROR');
      setErrorMessage(err.message || 'An unexpected error occurred while processing the file.');
      showToast(err.message, 'error');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setStatus('IDLE');
    setErrorMessage('');
    setUploadResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Upload Box */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 p-10 text-center ${
          dragActive
            ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
            : status === 'ERROR'
            ? 'border-rose-500/60 bg-rose-500/10'
            : status === 'SUCCESS'
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-[var(--border-main)] bg-[var(--bg-card)] hover:border-emerald-500/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".kml,.zip"
          onChange={handleChange}
          className="hidden"
          id="file-upload-input"
        />

        {/* Status: IDLE */}
        {status === 'IDLE' && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400 mb-6 shadow-xl">
              <UploadCloud className="w-10 h-10" />
            </div>

            <h2 className="text-xl font-bold text-[var(--text-title)] mb-2 font-mono">
              Upload Geospatial Data
            </h2>

            <p className="text-sm text-[var(--text-muted)] max-w-md mb-8 leading-relaxed">
              Upload a <span className="text-emerald-500 dark:text-emerald-400 font-semibold font-mono">KML</span> file or{' '}
              <span className="text-cyan-500 dark:text-cyan-400 font-semibold font-mono">Shapefile ZIP</span> to analyze your spatial features and measure polygons and linestrings.
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2"
            >
              <FolderArchive className="w-4 h-4" />
              Browse Files
            </button>

            <div className="flex items-center gap-6 mt-8 text-xs font-mono text-[var(--text-dim)]">
              <span>Formats: .kml, .zip (Shapefile)</span>
              <span>•</span>
              <span>Max Size: 10 MB</span>
            </div>
          </div>
        )}

        {/* Status: SELECTED */}
        {status === 'SELECTED' && selectedFile && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 dark:text-cyan-400 mb-5">
              <FileCheck className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-[var(--text-title)] font-mono mb-1">
              File Ready for Processing
            </h3>

            <div className="my-4 p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] w-full max-w-md font-mono text-xs">
              <div className="flex justify-between py-1 text-[var(--text-body)]">
                <span className="text-[var(--text-muted)]">Filename:</span>
                <span className="font-semibold truncate max-w-[220px]">{selectedFile.name}</span>
              </div>
              <div className="flex justify-between py-1 text-[var(--text-body)]">
                <span className="text-[var(--text-muted)]">Format:</span>
                <span className="uppercase">{selectedFile.name.split('.').pop()}</span>
              </div>
              <div className="flex justify-between py-1 text-[var(--text-body)]">
                <span className="text-[var(--text-muted)]">File Size:</span>
                <span>{formatFileSize(selectedFile.size)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-[var(--border-main)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] text-xs font-semibold font-mono transition-colors"
              >
                Choose Another
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono transition-all shadow-lg inline-flex items-center gap-2"
              >
                <span>Upload & Calculate Measurements</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Status: UPLOADING or PROCESSING */}
        {(status === 'UPLOADING' || status === 'PROCESSING') && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-[var(--text-title)] font-mono mb-2">
              {status === 'UPLOADING' ? 'Uploading Spatial Dataset...' : 'Executing Geospatial Pipeline...'}
            </h3>

            <p className="text-xs text-[var(--text-muted)] max-w-sm mb-6 leading-relaxed">
              Parsing vector geometries, inspecting CRS attributes, reprojecting to local UTM grid, and calculating metric area & length via Shapely and GeoPandas.
            </p>

            <div className="w-64 h-1.5 bg-[var(--bg-card-subtle)] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        )}

        {/* Status: SUCCESS */}
        {status === 'SUCCESS' && uploadResult && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500 dark:text-emerald-400 mb-4 shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-[var(--text-title)] font-mono mb-1">
              Dataset Analyzed Successfully
            </h3>

            <p className="text-xs text-[var(--text-muted)] mb-6 font-mono">
              Processed {uploadResult.filename} · {uploadResult.features?.length || 0} features extracted
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-[var(--border-main)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] text-xs font-semibold font-mono transition-colors"
              >
                Upload Another File
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono transition-all shadow-lg inline-flex items-center gap-2"
              >
                <span>View Full Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Status: ERROR */}
        {status === 'ERROR' && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 dark:text-rose-400 mb-4 shadow-xl">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-rose-500 dark:text-rose-400 font-mono mb-2">
              Processing Error
            </h3>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 max-w-md w-full mb-6 text-xs text-rose-600 dark:text-rose-200 font-mono leading-relaxed">
              {errorMessage}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-hover)] text-[var(--text-title)] font-semibold text-xs font-mono transition-colors inline-flex items-center gap-2 border border-[var(--border-main)]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Upload
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Specification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)]">
          <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-semibold mb-2">
            <FileCode className="w-4 h-4" />
            <span>Supported Spatial Formats</span>
          </div>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Upload Keyhole Markup Language (<code className="text-[var(--text-title)]">.kml</code>) or ESRI Shapefile Archives (<code className="text-[var(--text-title)]">.zip</code>) containing at least <code className="text-[var(--text-title)]">.shp</code>, <code className="text-[var(--text-title)]">.shx</code>, and <code className="text-[var(--text-title)]">.dbf</code> files.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)]">
          <div className="flex items-center gap-2 text-cyan-500 dark:text-cyan-400 font-semibold mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Integrity & Security Limit</span>
          </div>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Files are strictly validated and constrained to a 10 MB payload ceiling. Upload streams exceeding this threshold are aborted with automatic cleanup.
          </p>
        </div>
      </div>
    </div>
  );
}
