import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { Shipment, User } from '../../types';
import { UserCheck, ShieldAlert } from 'lucide-react';

interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
  drivers: User[];
  onSubmit: (shipmentId: number, driverId: number) => Promise<void>;
}

export const AssignDriverModal: React.FC<AssignDriverModalProps> = ({
  isOpen,
  onClose,
  shipment,
  drivers,
  onSubmit
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (drivers.length > 0) {
      setSelectedDriverId(drivers[0].id);
    }
  }, [drivers]);

  if (!shipment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriverId) return;

    setIsSubmitting(true);
    try {
      await onSubmit(shipment.id, Number(selectedDriverId));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Driver to Cargo"
      subtitle={`PATCH /api/v1/shipments/${shipment.id}/assign_driver/ — ${shipment.tracking_number}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-white" />
            Select Available Driver (DRIVER role)
          </label>
          <select
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(Number(e.target.value))}
            className="w-full p-3 bg-black rounded-xl border border-zinc-700 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white font-bold"
          >
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.first_name ? `${d.first_name} ${d.last_name}` : d.username} (@{d.username})
              </option>
            ))}
          </select>
        </div>

        {drivers.length === 0 && (
          <p className="text-xs text-zinc-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-white" />
            No registered drivers available in database. Create a driver user first.
          </p>
        )}

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
            disabled={isSubmitting || !selectedDriverId}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-zinc-200 border border-white flex items-center gap-2 disabled:opacity-50 shadow-lg"
          >
            <UserCheck className="w-4 h-4 text-black" />
            <span>{isSubmitting ? 'Assigning...' : 'Confirm Driver Assignment'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
