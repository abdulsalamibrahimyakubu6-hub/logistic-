import React from 'react';
import type { ActiveTab } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useHealth } from '../../context/HealthContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShieldAlert, 
  LogOut, 
  Search, 
  Activity, 
  Truck, 
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNavigateToPublicTracking: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onNavigateToPublicTracking
}) => {
  const { user, logout } = useAuth();
  const { health, rootApiData, isPolling, lastChecked } = useHealth();

  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'shipments' as ActiveTab, label: 'Shipments', icon: Package },
    { id: 'users' as ActiveTab, label: 'User Management', icon: Users },
    { id: 'admin' as ActiveTab, label: 'Admin Panel', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between h-screen sticky top-0 z-30 select-none backdrop-blur-xl">
      {/* Top Branding */}
      <div>
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-lg border border-white">
              <Truck className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight leading-none">LOGISTISTIC</h2>
              <span className="text-[10px] text-zinc-400 font-mono">v1.0.4 • B&W Edition</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-white text-black border border-white shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Public Tracker Shortcut */}
          <div className="pt-3">
            <button
              onClick={onNavigateToPublicTracking}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-sm text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-white" />
                <span>Public Tracking</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>
        </nav>
      </div>

      {/* Bottom Section: Health Status Indicator & Profile */}
      <div className="p-3 space-y-3 border-t border-zinc-800 bg-black/60">
        {/* System Health Widget */}
        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-white" />
              API Health
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-white text-black border border-white">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
              {health?.status || rootApiData?.status || 'Healthy'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[11px] text-zinc-400 pt-1 border-t border-zinc-800">
            <div>
              Endpoint: <strong className="text-white font-mono">/health/</strong>
            </div>
            <div>
              Latency: <strong className="text-white font-mono">{health?.latency_ms || 24}ms</strong>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
            <span>DB: {health?.db_status || 'connected'}</span>
            <span>{isPolling ? 'Polling...' : lastChecked ? lastChecked.toLocaleTimeString() : 'Live'}</span>
          </div>
        </div>

        {/* User Profile Card */}
        {user && (
          <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-9 h-9 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-sm shadow-md flex-shrink-0 border border-white">
                {user.first_name ? user.first_name[0] : user.username[0].toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  {user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.username}
                </p>
                <div className="mt-0.5">
                  <StatusBadge role={user.role} size="sm" />
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
