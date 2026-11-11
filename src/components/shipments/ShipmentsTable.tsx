import React, { useEffect, useState } from 'react';
import type { Shipment, ShipmentStatus, User, CreateShipmentPayload } from '../../types';
import { apiService } from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';
import { TableSkeleton } from '../common/SkeletonLoader';
import { CreateShipmentModal } from './CreateShipmentModal';
import { UpdateStatusModal } from './UpdateStatusModal';
import { AssignDriverModal } from './AssignDriverModal';
import { ShipmentDetailModal } from './ShipmentDetailModal';
import { useToast } from '../../context/ToastContext';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  RefreshCw, 
  UserCheck, 
  Eye, 
  Package
} from 'lucide-react';

interface ShipmentsTableProps {
  currentUser: User | null;
}

export const ShipmentsTable: React.FC<ShipmentsTableProps> = ({ currentUser }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedShipmentForStatus, setSelectedShipmentForStatus] = useState<Shipment | null>(null);
  const [selectedShipmentForDriver, setSelectedShipmentForDriver] = useState<Shipment | null>(null);
  const [selectedShipmentDetail, setSelectedShipmentDetail] = useState<Shipment | null>(null);

  const { addToast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sData, uData] = await Promise.all([
        apiService.getShipments(),
        apiService.getUsers()
      ]);
      setShipments(sData);
      setUsers(uData);
    } catch (err: any) {
      addToast('error', 'Failed to fetch shipments', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const drivers = users.filter((u) => u.role === 'DRIVER');

  const handleCreateShipment = async (payload: CreateShipmentPayload) => {
    if (!currentUser) return;
    try {
      const newShipment = await apiService.createShipment(payload, currentUser);
      setShipments((prev) => [newShipment, ...prev]);
      addToast('success', 'Shipment Created', `Tracking number: ${newShipment.tracking_number}`);
    } catch (err: any) {
      addToast('error', 'Error Creating Shipment', err.message);
    }
  };

  const handleAssignDriver = async (shipmentId: number, driverId: number) => {
    if (!currentUser) return;
    try {
      const updated = await apiService.assignDriver(shipmentId, { driver_id: driverId }, currentUser);
      setShipments((prev) => prev.map((s) => (s.id === shipmentId ? updated : s)));
      addToast('success', 'Driver Assigned', `Driver assigned to ${updated.tracking_number}`);
    } catch (err: any) {
      addToast('error', 'Driver Assignment Failed', err.message);
    }
  };

  const handleUpdateStatus = async (shipmentId: number, status: ShipmentStatus, notes: string) => {
    if (!currentUser) return;
    try {
      const updated = await apiService.updateShipmentStatus(shipmentId, { status, notes }, currentUser);
      setShipments((prev) => prev.map((s) => (s.id === shipmentId ? updated : s)));
      addToast('success', 'Status Updated', `Shipment status updated to ${updated.status_display}`);
    } catch (err: any) {
      addToast('error', 'Status Update Failed', err.message);
    }
  };

  const filteredShipments = shipments.filter((s) => {
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      s.tracking_number.toLowerCase().includes(q) ||
      s.customer.toLowerCase().includes(q) ||
      (s.driver && s.driver.toLowerCase().includes(q)) ||
      s.pickup_address.toLowerCase().includes(q) ||
      s.delivery_address.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const canCreate = currentUser?.role === 'ADMIN' || currentUser?.role === 'CUSTOMER';
  const canAssign = currentUser?.role === 'ADMIN';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Action & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center border border-white">
            <Package className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Shipments Data Table</h2>
            <p className="text-xs text-zinc-400 font-mono">REST endpoint: /api/v1/shipments/</p>
          </div>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-zinc-200 transition-all border border-white shadow-lg"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>Create New Shipment</span>
          </button>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search tracking, addresses, driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black rounded-xl border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white focus:ring-1 focus:ring-white font-mono"
          />
        </div>

        {/* Status Filter Dropdown & Refresh */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 bg-black p-1 rounded-xl border border-zinc-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-zinc-400 ml-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-zinc-200 py-1.5 pr-3 focus:outline-none font-bold cursor-pointer"
            >
              <option value="ALL">All Statuses ({shipments.length})</option>
              <option value="PENDING">Pending Pickup</option>
              <option value="ASSIGNED">Driver Assigned</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <button
            onClick={loadData}
            title="Refresh Data Table"
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : filteredShipments.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-zinc-800 space-y-3">
          <div className="w-16 h-16 rounded-full bg-zinc-900 text-zinc-400 flex items-center justify-center mx-auto border border-zinc-700">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Shipments Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            No cargo orders matched your search query or status filter.
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider font-extrabold">
                  <th className="py-3.5 px-4">Tracking Number</th>
                  <th className="py-3.5 px-4">Route (Origin → Destination)</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Assigned Driver</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 font-medium">
                {filteredShipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="hover:bg-zinc-900/60 transition-colors group"
                  >
                    {/* Tracking Number */}
                    <td className="py-4 px-4 font-mono font-bold text-white whitespace-nowrap">
                      <button
                        onClick={() => setSelectedShipmentDetail(shipment)}
                        className="hover:underline flex items-center gap-1.5"
                      >
                        <span>{shipment.tracking_number}</span>
                      </button>
                      <span className="block text-[10px] text-zinc-500 font-normal">
                        {shipment.weight_kg ? `${shipment.weight_kg} kg` : 'Weight N/A'}
                      </span>
                    </td>

                    {/* Route */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="space-y-1">
                        <p className="text-zinc-200 truncate text-[11px] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          {shipment.pickup_address}
                        </p>
                        <p className="text-zinc-400 truncate text-[11px] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                          {shipment.delivery_address}
                        </p>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4 text-zinc-300 font-mono">
                      @{shipment.customer}
                    </td>

                    {/* Driver */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {shipment.driver ? (
                        <span className="text-white font-mono">@{shipment.driver}</span>
                      ) : (
                        <span className="text-zinc-500 italic text-[11px]">Unassigned</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={shipment.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Detail Timeline */}
                        <button
                          onClick={() => setSelectedShipmentDetail(shipment)}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white transition-colors"
                          title="View Details & Timeline"
                        >
                          <Eye className="w-4 h-4 text-white" />
                        </button>

                        {/* Assign Driver (Admin only) */}
                        {canAssign && (
                          <button
                            onClick={() => setSelectedShipmentForDriver(shipment)}
                            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white transition-colors"
                            title="Assign Driver"
                          >
                            <UserCheck className="w-4 h-4 text-white" />
                          </button>
                        )}

                        {/* Update Status (Admin or Driver) */}
                        <button
                          onClick={() => setSelectedShipmentForStatus(shipment)}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white transition-colors"
                          title="Update Status"
                        >
                          <RefreshCw className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-zinc-800 bg-zinc-950 text-xs text-zinc-400 flex items-center justify-between">
            <span>Showing {filteredShipments.length} of {shipments.length} total shipments</span>
            <span className="font-mono text-[10px]">API status 200 OK</span>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateShipmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateShipment}
        currentUser={currentUser}
      />

      <UpdateStatusModal
        isOpen={!!selectedShipmentForStatus}
        onClose={() => setSelectedShipmentForStatus(null)}
        shipment={selectedShipmentForStatus}
        onSubmit={handleUpdateStatus}
      />

      <AssignDriverModal
        isOpen={!!selectedShipmentForDriver}
        onClose={() => setSelectedShipmentForDriver(null)}
        shipment={selectedShipmentForDriver}
        drivers={drivers}
        onSubmit={handleAssignDriver}
      />

      <ShipmentDetailModal
        isOpen={!!selectedShipmentDetail}
        onClose={() => setSelectedShipmentDetail(null)}
        shipment={selectedShipmentDetail}
      />
    </div>
  );
};
