import React from 'react';
import type { ActiveTab } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useHealth } from '../../context/HealthContext';
import { StatusBadge } from '../common/StatusBadge';
import { Radio, RefreshCw, Menu } from 'lucide-react';

interface TopNavbarProps {
  activeTab: ActiveTab;
  onOpenMobileMenu?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ activeTab, onOpenMobileMenu }) => {
  const { user, useMockMode, toggleMockMode } = useAuth();
  const { health, refetchHealth, isPolling } = useHealth();

  const titleMap: Record<ActiveTab, string> = {
    overview: 'Dashboard Overview',
    shipments: 'Shipments Operations Management',
    users: 'System Users & Driver Management',
    admin: 'Restricted System Admin Panel',
    tracking: 'Public Tracking Portal',
    login: 'Portal Authentication'
  };

  return (
    <header className="h-16 border-b border-zinc-800 bg-black/90 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile menu toggle + Title */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-lg font-black text-white tracking-tight leading-tight">
            {titleMap[activeTab] || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <span>Logistics API v1</span>
            <span>•</span>
            <span className="text-white capitalize">{activeTab}</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Refresh Health Button */}
        <button
          onClick={refetchHealth}
          disabled={isPolling}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 font-bold transition-all"
          title="Refresh System Health & Root Metadata"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-zinc-400 ${isPolling ? 'animate-spin' : ''}`} />
          <span>{health?.latency_ms ? `${health.latency_ms}ms` : 'Check API'}</span>
        </button>

        {/* Mock Mode Toggle */}
        <button
          onClick={toggleMockMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all bg-zinc-900 text-white border-zinc-700 hover:bg-zinc-800"
          title="Toggle between in-memory mock engine & live Django backend"
        >
          <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
          <span className="hidden sm:inline">{useMockMode ? 'Mock Engine' : 'Live Render API'}</span>
        </button>

        {/* User Role Badge */}
        {user && (
          <div className="hidden md:block">
            <StatusBadge role={user.role} size="md" />
          </div>
        )}
      </div>
    </header>
  );
};
