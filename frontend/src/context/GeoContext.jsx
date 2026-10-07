import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { checkApiHealth } from '../services/api';

const GeoContext = createContext(null);

export function GeoProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('geomeasure_theme') || 'dark';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Datasets start empty unless manually uploaded by the user in this session
  const [datasets, setDatasets] = useState(() => {
    try {
      const stored = sessionStorage.getItem('geomeasure_uploaded_files');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeDatasetId, setActiveDatasetId] = useState(() => {
    try {
      const stored = sessionStorage.getItem('geomeasure_uploaded_files');
      const list = stored ? JSON.parse(stored) : [];
      return list.length > 0 ? list[0].id : null;
    } catch {
      return null;
    }
  });

  const [apiStatus, setApiStatus] = useState({
    online: false,
    checking: true,
    message: 'Checking API...',
  });
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Theme effect
  useEffect(() => {
    localStorage.setItem('geomeasure_theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check API health
  const verifyApiHealth = useCallback(async () => {
    setApiStatus(prev => ({ ...prev, checking: true }));
    const res = await checkApiHealth();
    setApiStatus({
      online: res.online,
      checking: false,
      message: res.online ? 'API Connected' : 'API Offline',
    });
    return res.online;
  }, []);

  // Periodic health check without auto-uploading or probing arbitrary DB IDs
  useEffect(() => {
    verifyApiHealth();
    const interval = setInterval(verifyApiHealth, 15000);
    return () => clearInterval(interval);
  }, [verifyApiHealth]);

  // Persist session-uploaded datasets
  useEffect(() => {
    try {
      sessionStorage.setItem('geomeasure_uploaded_files', JSON.stringify(datasets));
    } catch {
      // Storage safety
    }
  }, [datasets]);

  // Add newly uploaded dataset (only upon explicit user upload)
  const addDataset = useCallback((newDataset) => {
    setDatasets(prev => {
      const filtered = prev.filter(d => d.id !== newDataset.id);
      return [newDataset, ...filtered];
    });
    setActiveDatasetId(newDataset.id);
  }, []);

  // Clear datasets
  const clearDatasets = useCallback(() => {
    setDatasets([]);
    setActiveDatasetId(null);
    try {
      sessionStorage.removeItem('geomeasure_uploaded_files');
      localStorage.removeItem('geomeasure_datasets_cache');
    } catch {
      //
    }
    showToast('Dataset session cleared', 'info');
  }, [showToast]);

  // Dedicated inspect handler that selects dataset and scrolls to analysis section
  const inspectDataset = useCallback((id) => {
    setActiveDatasetId(id);
    setActiveTab('dashboard');

    setTimeout(() => {
      const el = document.getElementById('file-analysis-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  }, []);

  const activeDataset = datasets.find(d => d.id === activeDatasetId) || datasets[0] || null;

  return (
    <GeoContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        datasets,
        setDatasets,
        activeDataset,
        activeDatasetId,
        setActiveDatasetId,
        addDataset,
        clearDatasets,
        inspectDataset,
        apiStatus,
        verifyApiHealth,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </GeoContext.Provider>
  );
}

export function useGeo() {
  const context = useContext(GeoContext);
  if (!context) {
    throw new Error('useGeo must be used within a GeoProvider');
  }
  return context;
}
