import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHealth } from '../../context/HealthContext';
import { 
  ShieldAlert, 
  Terminal, 
  Sliders, 
  Lock, 
  ExternalLink, 
  RefreshCw, 
  Database,
  Radio
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { rootApiData, refetchHealth } = useHealth();
  const [activeTab, setActiveTab] = useState<'configs' | 'logs' | 'endpoints'>('configs');

  const [logs] = useState([
    { id: 1, level: 'INFO', module: 'auth', msg: 'JWT Access token issued for user @admin', timestamp: '2026-10-02T13:40:12Z' },
    { id: 2, level: 'INFO', module: 'shipments', msg: 'Shipment TRK-8F3A92B1 status updated to IN_TRANSIT by driver_john', timestamp: '2026-10-02T12:15:00Z' },
    { id: 3, level: 'WARN', module: 'dispatch', msg: 'Cargo TRK-9B2C4F1A pending pickup without driver assignment > 2 hours', timestamp: '2026-10-02T11:30:00Z' },
    { id: 4, level: 'INFO', module: 'health', msg: 'Database connection check PASSED (latency 24ms)', timestamp: '2026-10-02T10:00:00Z' },
    { id: 5, level: 'ERROR', module: 'auth', msg: 'Failed login attempt for username @guest_test from 192.168.1.45', timestamp: '2026-10-02T09:12:00Z' },
  ]);

  const isAdmin = user?.role === 'ADMIN';

  if (!isAdmin) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center border border-zinc-700 space-y-4 max-w-2xl mx-auto my-12 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-zinc-900 text-white flex items-center justify-center mx-auto border border-zinc-700">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Access Restricted</h2>
        <p className="text-zinc-400 text-sm">
          The Admin Area (<code className="text-white font-mono">/admin/</code>) is restricted to users with the <strong className="text-white">ADMIN</strong> role.
        </p>
        <p className="text-xs text-zinc-500 font-mono">
          Current logged in account: <strong className="text-white">@{user?.username}</strong> (Role: {user?.role})
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center border border-white">
            <ShieldAlert className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">System Admin Console</h2>
            <p className="text-xs text-zinc-400">Direct interface to Django Admin & Infrastructure Configuration</p>
          </div>
        </div>

        <a
          href="/admin/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-zinc-200 border border-white shadow-lg transition-all"
        >
          <ExternalLink className="w-4 h-4 text-black" />
          <span>Launch Django Admin UI (/admin/)</span>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('configs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'configs'
              ? 'bg-white text-black shadow-md border border-white'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>System Configurations</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'logs'
              ? 'bg-white text-black shadow-md border border-white'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Real-time System Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('endpoints')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'endpoints'
              ? 'bg-white text-black shadow-md border border-white'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>API Infrastructure</span>
        </button>
      </div>

      {/* Tab Content 1: System Configs */}
      {activeTab === 'configs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-white" /> Dispatch Rules & Auto-Assign
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-black border border-zinc-800">
                <div>
                  <h4 className="font-bold text-white">Auto-Assign Nearest Driver</h4>
                  <p className="text-zinc-400 text-[11px]">Automatically assign pending cargo based on geofence proximity</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-white rounded" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black border border-zinc-800">
                <div>
                  <h4 className="font-bold text-white">JWT Token Expiration Window</h4>
                  <p className="text-zinc-400 text-[11px]">Access Token Lifetime: 60 minutes / Refresh: 7 days</p>
                </div>
                <span className="font-mono text-white font-bold">60m / 7d</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black border border-zinc-800">
                <div>
                  <h4 className="font-bold text-white">Public Tracking Rate Limiting</h4>
                  <p className="text-zinc-400 text-[11px]">Throttling for /api/v1/track/{'{'}tracking_number{'}'}/</p>
                </div>
                <span className="font-mono text-white font-bold">100 req/min</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-white" /> Webhooks & Event Notifications
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-black border border-zinc-800 space-y-1">
                <span className="text-zinc-400 font-mono text-[10px] block font-bold">DELIVERY_COMPLETED_WEBHOOK</span>
                <p className="text-white font-mono truncate">https://api.acmecorp.com/webhooks/shipments/</p>
              </div>

              <div className="p-3 rounded-xl bg-black border border-zinc-800 space-y-1">
                <span className="text-zinc-400 font-mono text-[10px] block font-bold">DRIVER_ASSIGNED_SMS_DISPATCH</span>
                <p className="text-white font-mono truncate">https://messaging.logistatic.io/sms/v1/send</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Real-time System Logs */}
      {activeTab === 'logs' && (
        <div className="glass-card rounded-2xl p-6 border border-zinc-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-white" /> Audit Log Stream
            </h3>
            <span className="text-zinc-500 text-[11px]">Showing last 5 system log entries</span>
          </div>

          <div className="bg-black p-4 rounded-xl border border-zinc-800 space-y-2 max-h-80 overflow-y-auto">
            {logs.map((log) => {
              return (
                <div key={log.id} className="flex items-start gap-3 py-1 border-b border-zinc-900 last:border-none">
                  <span className="text-zinc-500 shrink-0">{log.timestamp}</span>
                  <span className="font-bold shrink-0 w-14 text-white">[{log.level}]</span>
                  <span className="text-zinc-400 shrink-0">[{log.module}]</span>
                  <span className="text-zinc-200">{log.msg}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 3: API Infrastructure */}
      {activeTab === 'endpoints' && (
        <div className="glass-card rounded-2xl p-6 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-white" /> Root API Payload & Endpoints
            </h3>
            <button
              onClick={refetchHealth}
              className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-xs text-white flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-query Root API
            </button>
          </div>

          <pre className="bg-black p-4 rounded-xl border border-zinc-800 text-xs text-white font-mono overflow-x-auto">
            {JSON.stringify(rootApiData || { name: "Logistics Management API", status: "healthy", version: "v1" }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
