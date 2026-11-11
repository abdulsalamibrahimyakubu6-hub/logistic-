export type UserRole = 'ADMIN' | 'DRIVER' | 'CUSTOMER';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
}

export type ShipmentStatus = 
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface ShipmentStatusLog {
  id: number;
  status: ShipmentStatus;
  status_display: string;
  updated_by: string | null;
  notes: string;
  timestamp: string;
}

export interface Shipment {
  id: number;
  tracking_number: string;
  customer: string;
  driver: string | null;
  delivery_address: string;
  pickup_address: string;
  status: ShipmentStatus;
  status_display: string;
  weight_kg: string | number | null;
  status_logs: ShipmentStatusLog[];
  created_at: string;
  updated_at: string;
}

export interface CreateShipmentPayload {
  delivery_address: string;
  pickup_address: string;
  weight_kg?: number | string;
  customer_id?: number;
  notes?: string;
}

export interface UpdateShipmentStatusPayload {
  status: ShipmentStatus;
  notes?: string;
}

export interface AssignDriverPayload {
  driver_id: number;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user?: User;
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  latency_ms?: number;
  db_status?: 'connected' | 'disconnected';
  active_jobs?: number;
}

export interface RootApiData {
  name: string;
  status: string;
  version: string;
  endpoints: {
    admin: string;
    auth_login: string;
    auth_refresh: string;
    users: string;
    user_me: string;
    shipments: string;
    public_tracking: string;
    health_check: string;
  };
}

export type ActiveTab = 'overview' | 'shipments' | 'users' | 'admin' | 'tracking' | 'login';
