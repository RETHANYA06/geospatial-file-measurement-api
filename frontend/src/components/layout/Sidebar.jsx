import React, { useState } from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  FolderArchive,
  Ruler,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  Compass,
} from 'lucide-react';
import { useGeo } from '../../context/GeoContext';

export default function Sidebar() {
  const { activeTab, setActiveTab, datasets } = useGeo();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'upload',
      label: 'Upload & Analyze',
      icon: UploadCloud,
      badge: null,
    },
    {
      id: 'files',
      label: 'Files',
      icon: FolderArchive,
      badge: datasets.length > 0 ? datasets.length : null,
    },
    {
      id: 'measurements',
      label: 'Measurements',
      icon: Ruler,
      badge: null,
    },
    {
      id: 'api-docs',
      label: 'API Documentation',
      icon: BookOpen,
      isExternal: true,
      href: '/docs',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-[var(--border-main)] bg-[var(--bg-sidebar)] transition-all duration-300 ease-in-out select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-[var(--border-main)]">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 p-0.5 shadow-md shadow-emerald-950/20 shrink-0">
            <div className="w-full h-full bg-[var(--bg-card-inner)] rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-[var(--text-title)] font-mono">
                Geo<span className="text-emerald-500 dark:text-emerald-400">Measure</span>
              </span>
              <span className="text-[10px] font-medium text-[var(--text-dim)] uppercase tracking-widest">
                GIS Analytics
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-title)] hover:bg-[var(--bg-hover)] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isExternal) {
            return (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group text-[var(--text-muted)] hover:text-[var(--text-title)] hover:bg-[var(--bg-hover)] ${
                  collapsed ? 'justify-center' : ''
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0 text-[var(--text-muted)] group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  </>
                )}
              </a>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-title)] hover:bg-[var(--bg-hover)]'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-muted)] group-hover:text-[var(--text-title)]'
                }`}
              />

              {!collapsed && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.badge !== null && (
                    <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-main)]">
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Dataset quick badge footer */}
      {!collapsed && (
        <div className="p-4 mx-3 mb-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] text-xs">
          <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>Active Engine</span>
          </div>
          <div className="font-mono text-[11px] text-[var(--text-body)] truncate">
            FastAPI · GeoPandas · PyProj
          </div>
        </div>
      )}
    </aside>
  );
}
