import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { Shipment, ShipmentStatus } from '../../types';
import { RefreshCw, FileText } from 'lucide-react';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
  onSubmit: (shipmentId: number, status: ShipmentStatus, notes: string) => Promise<void>;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  isOpen,
  onClose,
  shipment,
  onSubmit
}) => {
  const [status, setStatus] = useState<ShipmentStatus>('IN_TRANSIT');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (shipment) {
      setStatus(shipment.status);
      setNotes('');
    }
  }, [shipment]);

  if (!shipment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(shipment.id, status, notes);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions: { value: ShipmentStatus; label: string }[] = [
    { value: 'PENDING', label: 'Pending Pickup' },
    { value: 'ASSIGNED', label: 'Driver Assigned' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Shipment Status"
      subtitle={`PATCH /api/v1/shipments/${shipment.id}/update_status/ — ${shipment.tracking_number}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-zinc-300 mb-1 block">
            Select New Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
            className="w-full p-3 bg-black rounded-xl border border-zinc-700 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white font-bold"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            Status Log Notes (Optional)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter milestone details..."
            className="w-full p-3 bg-black rounded-xl border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-bold border border-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-zinc-200 border border-white flex items-center gap-2 disabled:opacity-50 shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 text-black ${isSubmitting ? 'animate-spin' : ''}`} />
            <span>{isSubmitting ? 'Updating...' : 'Update Status'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
