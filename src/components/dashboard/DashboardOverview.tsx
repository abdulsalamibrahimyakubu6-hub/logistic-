import React, { useEffect, useState } from 'react';
import type { Shipment, User, ActiveTab } from '../../types';
import { apiService } from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';
import { CardSkeleton } from '../common/SkeletonLoader';
import { useHealth } from '../../context/HealthContext';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  PlusCircle, 
  UserPlus, 
  Activity, 
  Layers
} from 'lucide-react';

interface DashboardOverviewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCreateShipmentModal: () => void;
  onOpenCreateUserModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  setActiveTab,
  onOpenCreateShipmentModal,
  onOpenCreateUserModal
}) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { rootApiData } = useHealth();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [sData, uData] = await Promise.all([
          apiService.getShipments(),
          apiService.getUsers()
        ]);
        setShipments(sData);
        setUsers(uData);
      } catch (err) {
        console.warn('Error loading overview data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const totalShipments = shipments.length;
  const inTransitCount = shipments.filter((s) => s.status === 'IN_TRANSIT' || s.status === 'OUT_FOR_DELIVERY').length;
  const deliveredCount = shipments.filter((s) => s.status === 'DELIVERED').length;
  const pendingCount = shipments.filter((s) => s.status === 'PENDING').length;
  const activeDriversCount = users.filter((u) => u.role === 'DRIVER').length;

  const statusCounts = {
    PENDING: shipments.filter((s) => s.status === 'PENDING').length,
    ASSIGNED: shipments.filter((s) => s.status === 'ASSIGNED').length,
    IN_TRANSIT: shipments.filter((s) => s.status === 'IN_TRANSIT').length,
    OUT_FOR_DELIVERY: shipments.filter((s) => s.status === 'OUT_FOR_DELIVERY').length,
    DELIVERED: shipments.filter((s) => s.status === 'DELIVERED').length,
    CANCELLED: shipments.filter((s) => s.status === 'CANCELLED').length,
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in w-full max-w-full">
      {/* Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl glass-panel border border-zinc-800">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight">Logistics Control Center</h2>
          <p className="text-xs text-zinc-400">Monitor active freight, driver routes, and REST API health.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button
            onClick={onOpenCreateShipmentModal}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-zinc-200 transition-all border border-white shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-black shrink-0" />
            <span className="whitespace-nowrap">New Shipment</span>
          </button>

          <button
            onClick={onOpenCreateUserModal}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-700 transition-all"
          >
            <UserPlus className="w-4 h-4 text-zinc-300 shrink-0" />
            <span className="whitespace-nowrap">Add User</span>
          </button>

          <button
            onClick={() => setActiveTab('shipments')}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-700 transition-all"
          >
            <Layers className="w-4 h-4 text-zinc-300 shrink-0" />
            <span className="whitespace-nowrap">All Shipments</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Shipments */}
          <div className="p-4 sm:p-5 rounded-2xl glass-card border border-zinc-800 space-y-2 relative overflow-hidden group hover:border-zinc-600 transition-all">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 truncate">Total Shipments</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center border border-zinc-700 shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{totalShipments}</span>
              <span className="text-xs text-white font-bold flex items-center gap-0.5 shrink-0">
                <TrendingUp className="w-3 h-3" /> +12%
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono truncate">Active records in database</p>
          </div>

          {/* Active Freight In Transit */}
          <div className="p-4 sm:p-5 rounded-2xl glass-card border border-zinc-800 space-y-2 relative overflow-hidden group hover:border-zinc-600 transition-all">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 truncate">In Transit / Delivery</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center border border-zinc-700 shrink-0">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{inTransitCount}</span>
              <span className="text-xs text-zinc-400 shrink-0">active routes</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono truncate">{pendingCount} pending driver dispatch</p>
          </div>

          {/* Delivered Total */}
          <div className="p-4 sm:p-5 rounded-2xl glass-card border border-zinc-800 space-y-2 relative overflow-hidden group hover:border-zinc-600 transition-all">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 truncate">Delivered Total</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center border border-zinc-700 shrink-0">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{deliveredCount}</span>
              <span className="text-xs text-zinc-300 font-bold flex items-center gap-0.5 shrink-0">
                <TrendingUp className="w-3 h-3" /> 100% fulfill
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono truncate">Completed shipments with POD</p>
          </div>

          {/* Active Drivers */}
          <div className="p-4 sm:p-5 rounded-2xl glass-card border border-zinc-800 space-y-2 relative overflow-hidden group hover:border-zinc-600 transition-all">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 truncate">Registered Drivers</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center border border-zinc-700 shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{activeDriversCount}</span>
              <span className="text-xs text-zinc-400 shrink-0">fleet personnel</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono truncate">{users.length} total system users</p>
          </div>
        </div>
      )}

      {/* Middle Section: Status Breakdown & API Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Status Distribution Visualizer */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-4 sm:p-6 border border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
              <span>Shipment Status Distribution</span>
            </h3>
            <span className="text-[11px] sm:text-xs font-mono text-zinc-400">GET /api/v1/shipments/</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(statusCounts).map(([statusKey, count]) => {
              const pct = totalShipments > 0 ? Math.round((count / totalShipments) * 100) : 0;
              return (
                <div key={statusKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <StatusBadge status={statusKey} size="sm" />
                    <span className="font-mono text-zinc-300 text-right shrink-0">
                      <strong>{count}</strong> ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System & Endpoint Metadata */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
              <span>Backend REST Endpoints</span>
            </h3>

            <div className="space-y-2 text-xs font-mono">
              {rootApiData?.endpoints &&
                Object.entries(rootApiData.endpoints).map(([key, path]) => (
                  <div
                    key={key}
                    className="p-2.5 rounded-xl bg-black border border-zinc-800 flex items-center justify-between gap-2"
                  >
                    <span className="text-zinc-400 uppercase text-[10px] font-bold shrink-0">{key}</span>
                    <span className="text-white truncate max-w-[150px] sm:max-w-[200px] md:max-w-[240px] text-right" title={String(path)}>
                      {path}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 flex flex-wrap items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0"></span>
            <span className="break-words">
              System Status: <strong>{rootApiData?.status || 'healthy'}</strong> (Version: {rootApiData?.version || 'v1'})
            </span>
          </div>
        </div>
      </div>

      {/* Recent Shipments Feed */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">Recent Freight Feed</h3>
            <p className="text-xs text-zinc-400">Latest active shipments in system</p>
          </div>
          <button
            onClick={() => setActiveTab('shipments')}
            className="flex items-center gap-1 text-xs text-white hover:underline font-bold self-start sm:self-auto"
          >
            <span>View All</span> <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-3 whitespace-nowrap">Tracking #</th>
                <th className="py-3 px-3 whitespace-nowrap">Customer</th>
                <th className="py-3 px-3 whitespace-nowrap">Driver</th>
                <th className="py-3 px-3 whitespace-nowrap">Status</th>
                <th className="py-3 px-3 whitespace-nowrap">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {shipments.slice(0, 5).map((s) => (
                <tr key={s.id} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-white whitespace-nowrap">{s.tracking_number}</td>
                  <td className="py-3 px-3 text-zinc-300 font-mono whitespace-nowrap">@{s.customer}</td>
                  <td className="py-3 px-3 text-zinc-400 font-mono whitespace-nowrap">{s.driver ? `@${s.driver}` : 'Unassigned'}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <StatusBadge status={s.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-zinc-400 font-mono whitespace-nowrap">
                    {new Date(s.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
