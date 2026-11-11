import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { CreateShipmentPayload, User } from '../../types';
import { Building2, MapPin, Weight, FileText, PlusCircle } from 'lucide-react';

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateShipmentPayload) => Promise<void>;
  currentUser: User | null;
}

export const CreateShipmentModal: React.FC<CreateShipmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser
}) => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupAddress || !deliveryAddress) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
        weight_kg: weightKg ? parseFloat(weightKg) : undefined,
        notes: notes || 'Order placed by customer.',
      });
      setPickupAddress('');
      setDeliveryAddress('');
      setWeightKg('');
      setNotes('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Shipment"
      subtitle="POST /api/v1/shipments/ — Register new cargo order"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-white" />
            Pickup Address *
          </label>
          <textarea
            required
            rows={2}
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            placeholder="Enter full pickup location address..."
            className="w-full p-3 bg-black rounded-xl border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-white" />
            Delivery Address *
          </label>
          <textarea
            required
            rows={2}
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Enter destination delivery address..."
            className="w-full p-3 bg-black rounded-xl border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
              <Weight className="w-3.5 h-3.5 text-zinc-400" />
              Package Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="e.g. 45.5"
              className="w-full p-3 bg-black rounded-xl border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 mb-1 block">Customer Account</label>
            <input
              type="text"
              disabled
              value={`@${currentUser?.username || 'customer'}`}
              className="w-full p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 text-sm font-mono cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            Initial Shipment Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special instructions or cargo details..."
            className="w-full p-3 bg-black rounded-xl border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-bold transition-colors border border-zinc-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-zinc-200 border border-white flex items-center gap-2 disabled:opacity-50 shadow-lg"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>{isSubmitting ? 'Creating...' : 'Create Shipment'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
