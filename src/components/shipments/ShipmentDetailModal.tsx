import React from 'react';
import { Modal } from '../common/Modal';
import type { Shipment } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { TrackingTimeline } from '../public/TrackingTimeline';
import { Building2, MapPin, Clock } from 'lucide-react';

interface ShipmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
}

export const ShipmentDetailModal: React.FC<ShipmentDetailModalProps> = ({
  isOpen,
  onClose,
  shipment
}) => {
  if (!shipment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Shipment Details — ${shipment.tracking_number}`}
      subtitle="GET /api/v1/shipments/{id}/ & Status Log Trail"
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Status Header */}
        <div className="p-4 rounded-xl bg-black border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs text-zinc-400">Current Status:</span>
            <div className="mt-1">
              <StatusBadge status={shipment.status} size="lg" />
            </div>
          </div>

          <div className="text-right text-xs space-y-1 font-mono">
            <p className="text-zinc-400">
              Created: <strong className="text-white">{new Date(shipment.created_at).toLocaleString()}</strong>
            </p>
            <p className="text-zinc-400">
              Updated: <strong className="text-white">{new Date(shipment.updated_at).toLocaleString()}</strong>
            </p>
          </div>
        </div>

        {/* Route Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-black border border-zinc-800 space-y-1">
            <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-white" /> Pickup Location
            </span>
            <p className="text-sm font-medium text-white">{shipment.pickup_address}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-black border border-zinc-800 space-y-1">
            <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-white" /> Delivery Destination
            </span>
            <p className="text-sm font-medium text-white">{shipment.delivery_address}</p>
          </div>
        </div>

        {/* Payload Info */}
        <div className="grid grid-cols-3 gap-3 text-xs p-3.5 rounded-xl bg-black border border-zinc-800">
          <div>
            <span className="text-zinc-500 block">Customer</span>
            <strong className="text-white font-mono">@{shipment.customer}</strong>
          </div>
          <div>
            <span className="text-zinc-500 block">Assigned Driver</span>
            <strong className="text-white font-mono">{shipment.driver ? `@${shipment.driver}` : 'Unassigned'}</strong>
          </div>
          <div>
            <span className="text-zinc-500 block">Weight (kg)</span>
            <strong className="text-white font-mono">{shipment.weight_kg ? `${shipment.weight_kg} kg` : 'N/A'}</strong>
          </div>
        </div>

        {/* Status Log Timeline */}
        <div className="pt-2 border-t border-zinc-800">
          <h4 className="text-sm font-extrabold text-white mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" /> Status Logs & History
          </h4>
          <div className="max-h-72 overflow-y-auto pr-2">
            <TrackingTimeline logs={shipment.status_logs} currentStatus={shipment.status} />
          </div>
        </div>

        <div className="pt-4 flex justify-end border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white text-sm font-bold transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </Modal>
  );
};
