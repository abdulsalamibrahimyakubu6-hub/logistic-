import React, { useState } from 'react';
import type { Shipment } from '../../types';
import { apiService } from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';
import { TrackingTimeline } from './TrackingTimeline';
import { TimelineSkeleton } from '../common/SkeletonLoader';
import { 
  Search, 
  Package, 
  MapPin, 
  Weight, 
  User as UserIcon, 
  LogIn, 
  ShieldCheck, 
  RefreshCw,
  AlertCircle,
  Truck,
  Building2
} from 'lucide-react';

interface PublicTrackingProps {
  onNavigateToLogin: () => void;
}

export const PublicTracking: React.FC<PublicTrackingProps> = ({ onNavigateToLogin }) => {
  const [trackingInput, setTrackingInput] = useState<string>('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const sampleTrackingNumbers = ['TRK-8F3A92B1', 'TRK-4E1D9A7C', 'TRK-9B2C4F1A', 'TRK-1A5D8C3E'];

  const handleSearch = async (numToSearch?: string) => {
    const query = (numToSearch || trackingInput).trim();
    if (!query) return;

    setIsLoading(true);
    setErrorMsg(null);
    setHasSearched(true);
    setTrackingInput(query);

    try {
      const data = await apiService.getPublicTracking(query);
      setShipment(data);
    } catch (err: any) {
      setShipment(null);
      setErrorMsg(err.message || `No shipment record found for tracking number '${query}'`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Top Navigation */}
      <header className="border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white text-black flex items-center justify-center shadow-lg border border-white">
              <Truck className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                LOGISTISTIC
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono border border-zinc-700">
                  Global Freight
                </span>
              </h1>
              <p className="text-xs text-zinc-400 font-medium">Logistics Management & Tracking Portal</p>
            </div>
          </div>

          <button
            onClick={onNavigateToLogin}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all border border-white shadow-lg"
          >
            <LogIn className="w-4 h-4 text-black" />
            <span>Staff Portal Login</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        {/* Hero Banner Section */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            Real-Time Cargo & Shipment Tracking
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight uppercase">
            Track Cargo Status <br className="hidden sm:block" />
            <span className="text-zinc-400 underline decoration-zinc-600 underline-offset-8">
              Anytime, Anywhere
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Enter your unique tracking number below to view complete status history, location logs, and delivery updates.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border border-zinc-800 shadow-2xl mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Enter Tracking Number (e.g. TRK-8F3A92B1)..."
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-black rounded-xl border border-zinc-700 text-white placeholder-zinc-500 text-sm sm:text-base font-mono uppercase tracking-wider focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !trackingInput.trim()}
              className="px-6 py-3.5 rounded-xl bg-white text-black font-extrabold text-sm sm:text-base hover:bg-zinc-200 border border-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Package className="w-5 h-5" />
                  <span>Track Package</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Test Samples */}
          <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            <span className="font-semibold text-zinc-500">Quick Test Samples:</span>
            {sampleTrackingNumbers.map((num) => (
              <button
                key={num}
                onClick={() => handleSearch(num)}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-mono border border-zinc-700 hover:border-zinc-400 transition-all"
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Results / Skeleton / Empty State */}
        {isLoading && (
          <div className="glass-card rounded-2xl p-8 border border-zinc-800">
            <TimelineSkeleton />
          </div>
        )}

        {!isLoading && errorMsg && (
          <div className="glass-card rounded-2xl p-8 border border-zinc-700 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 text-zinc-300 flex items-center justify-center mx-auto border border-zinc-700">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Shipment Not Found</h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">{errorMsg}</p>
          </div>
        )}

        {!isLoading && shipment && (
          <div className="space-y-6 animate-fade-in">
            {/* Shipment Overview Header Card */}
            <div className="glass-card rounded-2xl p-6 border border-zinc-800 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                <div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Tracking Number
                  </span>
                  <h3 className="text-2xl font-mono font-black text-white flex items-center gap-3 mt-0.5">
                    {shipment.tracking_number}
                    <StatusBadge status={shipment.status} size="lg" />
                  </h3>
                </div>

                <div className="flex items-center gap-6 text-sm text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Weight className="w-4 h-4 text-zinc-400" />
                    <span>
                      Weight:{' '}
                      <strong className="text-white font-mono">
                        {shipment.weight_kg ? `${shipment.weight_kg} kg` : 'N/A'}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-zinc-400" />
                    <span>
                      Customer: <strong className="text-white font-mono">@{shipment.customer}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Origin -> Destination Route Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-950 p-5 rounded-xl border border-zinc-800">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center flex-shrink-0 border border-zinc-700 mt-0.5">
                    <Building2 className="w-5 h-5 text-zinc-300" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Pickup Address
                    </span>
                    <p className="text-sm font-medium text-white mt-0.5">
                      {shipment.pickup_address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-4">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center flex-shrink-0 border border-zinc-700 mt-0.5">
                    <MapPin className="w-5 h-5 text-zinc-300" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Delivery Address
                    </span>
                    <p className="text-sm font-medium text-white mt-0.5">
                      {shipment.delivery_address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Vertical Timeline Card */}
            <div className="glass-card rounded-2xl p-6 border border-zinc-800">
              <h4 className="text-lg font-extrabold text-white flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-white" />
                Shipment Status Log Timeline
              </h4>
              <TrackingTimeline logs={shipment.status_logs} currentStatus={shipment.status} />
            </div>
          </div>
        )}

        {!isLoading && !hasSearched && (
          <div className="glass-card rounded-2xl p-10 border border-zinc-800 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-zinc-900 text-white flex items-center justify-center mx-auto border border-zinc-700 shadow-inner">
              <Package className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">Ready to Track Your Freight</h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Paste your tracking ID or select one of the sample tracking numbers above to see real-time status history.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-black/60 py-6 text-center text-xs text-zinc-500 font-mono">
        <p>© 2026 Logistics Management API v1 • High-Contrast Black & White Interface</p>
      </footer>
    </div>
  );
};
