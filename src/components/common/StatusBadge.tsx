import React from 'react';
import { ShipmentStatus, UserRole } from '../../types';
import { 
  Clock, 
  UserCheck, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Car, 
  User as UserIcon 
} from 'lucide-react';

interface StatusBadgeProps {
  status?: ShipmentStatus | string;
  role?: UserRole | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, role, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-bold gap-2',
  }[size];

  if (role) {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return (
          <span className={`inline-flex items-center rounded-md bg-white text-black font-bold uppercase tracking-wider ${sizeClasses}`}>
            <ShieldCheck className="w-3.5 h-3.5 text-black" />
            Admin
          </span>
        );
      case 'DRIVER':
        return (
          <span className={`inline-flex items-center rounded-md bg-zinc-800 text-white border border-zinc-600 ${sizeClasses}`}>
            <Car className="w-3.5 h-3.5 text-zinc-300" />
            Driver
          </span>
        );
      case 'CUSTOMER':
      default:
        return (
          <span className={`inline-flex items-center rounded-md bg-zinc-900 text-zinc-300 border border-zinc-700 ${sizeClasses}`}>
            <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
            Customer
          </span>
        );
    }
  }

  switch (status?.toUpperCase()) {
    case 'PENDING':
      return (
        <span className={`inline-flex items-center rounded-md bg-zinc-900 text-zinc-300 border border-zinc-700 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-zinc-400 animate-pulse" />
          Pending Pickup
        </span>
      );
    case 'ASSIGNED':
      return (
        <span className={`inline-flex items-center rounded-md bg-zinc-800 text-zinc-200 border border-zinc-600 ${sizeClasses}`}>
          <UserCheck className="w-3.5 h-3.5 text-zinc-300" />
          Driver Assigned
        </span>
      );
    case 'IN_TRANSIT':
      return (
        <span className={`inline-flex items-center rounded-md bg-zinc-100 text-black border border-white ${sizeClasses}`}>
          <Truck className="w-3.5 h-3.5 text-black" />
          In Transit
        </span>
      );
    case 'OUT_FOR_DELIVERY':
      return (
        <span className={`inline-flex items-center rounded-md bg-zinc-200 text-black border border-zinc-300 ${sizeClasses}`}>
          <MapPin className="w-3.5 h-3.5 text-black" />
          Out for Delivery
        </span>
      );
    case 'DELIVERED':
      return (
        <span className={`inline-flex items-center rounded-md bg-white text-black font-extrabold border border-white ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-black" />
          Delivered
        </span>
      );
    case 'CANCELLED':
      return (
        <span className={`inline-flex items-center rounded-md bg-zinc-950 text-zinc-400 border border-zinc-800 line-through ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5 text-zinc-500" />
          Cancelled
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-md bg-zinc-800 text-zinc-300 ${sizeClasses}`}>
          {status || 'Unknown'}
        </span>
      );
  }
};
