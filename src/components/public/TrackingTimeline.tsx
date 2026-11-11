import React from 'react';
import type { ShipmentStatusLog, ShipmentStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Clock, CheckCircle2, Truck, UserCheck, MapPin, XCircle } from 'lucide-react';

interface TrackingTimelineProps {
  logs: ShipmentStatusLog[];
  currentStatus: ShipmentStatus;
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ logs }) => {
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const getStatusIcon = (status: ShipmentStatus, isCurrent: boolean) => {
    const iconClass = isCurrent ? 'w-4 h-4 text-black' : 'w-4 h-4 text-zinc-400';
    switch (status) {
      case 'PENDING':
        return <Clock className={iconClass} />;
      case 'ASSIGNED':
        return <UserCheck className={iconClass} />;
      case 'IN_TRANSIT':
        return <Truck className={iconClass} />;
      case 'OUT_FOR_DELIVERY':
        return <MapPin className={iconClass} />;
      case 'DELIVERED':
        return <CheckCircle2 className={iconClass} />;
      case 'CANCELLED':
        return <XCircle className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  return (
    <div className="relative pl-6 border-l-2 border-zinc-700 space-y-8 my-6">
      {sortedLogs.map((log, index) => {
        const isLatest = index === sortedLogs.length - 1;
        const formattedDate = new Date(log.timestamp).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div key={log.id} className="relative group">
            {/* Timeline Bullet */}
            <div
              className={`absolute -left-[31px] top-0 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                isLatest
                  ? 'bg-white border-white ring-4 ring-white/20 shadow-lg scale-110'
                  : 'bg-zinc-900 border-zinc-700 group-hover:border-zinc-400'
              }`}
            >
              {getStatusIcon(log.status, isLatest)}
            </div>

            {/* Event Card */}
            <div className="bg-zinc-900/90 rounded-xl p-4 border border-zinc-700 backdrop-blur-sm shadow-md transition-all hover:border-zinc-500">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={log.status} size="sm" />
                  {isLatest && (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-white text-black border border-white">
                      Current Stage
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  {formattedDate}
                </span>
              </div>

              <p className="text-sm text-zinc-100 font-medium leading-relaxed">{log.notes}</p>

              {log.updated_by && (
                <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5 pt-2 border-t border-zinc-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                  Logged by: <span className="text-white font-mono">@{log.updated_by}</span>
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
