import React from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardOverview from './components/dashboard/DashboardOverview';
import UploadDropzone from './components/upload/UploadDropzone';
import FilesListView from './components/files/FilesListView';
import MeasurementsView from './components/measurements/MeasurementsView';
import SettingsView from './components/settings/SettingsView';
import ToastContainer from './components/common/Toast';
import { useGeo } from './context/GeoContext';

export default function App() {
  const { activeTab, setActiveTab } = useGeo();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-app)] text-[var(--text-body)] transition-colors">
      {/* Collapsible SaaS Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[var(--bg-app)]">
        {/* Sticky Top Header */}
        <Header />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-12">
            {activeTab === 'dashboard' && <DashboardOverview />}
            {activeTab === 'upload' && (
              <UploadDropzone
                onUploadSuccess={() => {
                  setTimeout(() => setActiveTab('dashboard'), 800);
                }}
              />
            )}
            {activeTab === 'files' && <FilesListView />}
            {activeTab === 'measurements' && <MeasurementsView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
