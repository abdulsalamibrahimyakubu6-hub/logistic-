import { User, Shipment, RootApiData, HealthCheckResponse } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@logistatic.com',
    role: 'ADMIN',
    phone_number: '+1 (555) 019-2834',
    first_name: 'Alex',
    last_name: 'Vance'
  },
  {
    id: 2,
    username: 'driver_john',
    email: 'john.driver@logistatic.com',
    role: 'DRIVER',
    phone_number: '+1 (555) 349-8120',
    first_name: 'John',
    last_name: 'Miller'
  },
  {
    id: 3,
    username: 'driver_sarah',
    email: 'sarah.driver@logistatic.com',
    role: 'DRIVER',
    phone_number: '+1 (555) 982-1204',
    first_name: 'Sarah',
    last_name: 'Conner'
  },
  {
    id: 4,
    username: 'customer_jane',
    email: 'jane.smith@acmecorp.com',
    role: 'CUSTOMER',
    phone_number: '+1 (555) 771-9023',
    first_name: 'Jane',
    last_name: 'Smith'
  },
  {
    id: 5,
    username: 'customer_techcorp',
    email: 'logistics@nexusglobal.io',
    role: 'CUSTOMER',
    phone_number: '+1 (555) 443-8811',
    first_name: 'Robert',
    last_name: 'Chen'
  }
];

export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 101,
    tracking_number: 'TRK-8F3A92B1',
    customer: 'customer_jane',
    driver: 'driver_john',
    pickup_address: 'Distribution Center A, 100 Logistics Way, San Jose, CA',
    delivery_address: 'Acme Corp HQ, 450 Innovation Blvd, San Francisco, CA',
    status: 'IN_TRANSIT',
    status_display: 'In Transit',
    weight_kg: 45.5,
    created_at: '2026-10-01T08:30:00Z',
    updated_at: '2026-10-02T10:15:00Z',
    status_logs: [
      {
        id: 1001,
        status: 'PENDING',
        status_display: 'Pending Pickup',
        updated_by: 'customer_jane',
        notes: 'Order placed by customer.',
        timestamp: '2026-10-01T08:30:00Z'
      },
      {
        id: 1002,
        status: 'ASSIGNED',
        status_display: 'Driver Assigned',
        updated_by: 'admin',
        notes: 'Driver driver_john assigned to route #CA-402.',
        timestamp: '2026-10-01T11:00:00Z'
      },
      {
        id: 1003,
        status: 'IN_TRANSIT',
        status_display: 'In Transit',
        updated_by: 'driver_john',
        notes: 'Picked up cargo from Hub 1. Departed on I-101 North.',
        timestamp: '2026-10-02T10:15:00Z'
      }
    ]
  },
  {
    id: 102,
    tracking_number: 'TRK-4E1D9A7C',
    customer: 'customer_techcorp',
    driver: 'driver_sarah',
    pickup_address: 'Port Terminal 4, Pier 12, Long Beach, CA',
    delivery_address: 'Nexus Datacenter, 800 Cyber Way, Austin, TX',
    status: 'DELIVERED',
    status_display: 'Delivered',
    weight_kg: 1250.0,
    created_at: '2026-09-28T14:20:00Z',
    updated_at: '2026-10-02T09:45:00Z',
    status_logs: [
      {
        id: 2001,
        status: 'PENDING',
        status_display: 'Pending Pickup',
        updated_by: 'customer_techcorp',
        notes: 'Bulk order dispatched for priority datacenter equipment.',
        timestamp: '2026-09-28T14:20:00Z'
      },
      {
        id: 2002,
        status: 'ASSIGNED',
        status_display: 'Driver Assigned',
        updated_by: 'admin',
        notes: 'Assigned long-haul specialist Sarah Conner.',
        timestamp: '2026-09-29T09:00:00Z'
      },
      {
        id: 2003,
        status: 'IN_TRANSIT',
        status_display: 'In Transit',
        updated_by: 'driver_sarah',
        notes: 'Freight checked in at Arizona weigh station.',
        timestamp: '2026-09-30T16:40:00Z'
      },
      {
        id: 2004,
        status: 'OUT_FOR_DELIVERY',
        status_display: 'Out for Delivery',
        updated_by: 'driver_sarah',
        notes: 'Final mile dispatch from Austin Sorting Hub.',
        timestamp: '2026-10-02T07:15:00Z'
      },
      {
        id: 2005,
        status: 'DELIVERED',
        status_display: 'Delivered',
        updated_by: 'driver_sarah',
        notes: 'Delivered to Receiving Bay 3. Signed by R. Chen.',
        timestamp: '2026-10-02T09:45:00Z'
      }
    ]
  },
  {
    id: 103,
    tracking_number: 'TRK-9B2C4F1A',
    customer: 'customer_jane',
    driver: null,
    pickup_address: 'Warehouse B, 55 Freight Rd, Seattle, WA',
    delivery_address: 'Retail Store #88, 12 Pine St, Portland, OR',
    status: 'PENDING',
    status_display: 'Pending Pickup',
    weight_kg: 18.0,
    created_at: '2026-10-02T11:05:00Z',
    updated_at: '2026-10-02T11:05:00Z',
    status_logs: [
      {
        id: 3001,
        status: 'PENDING',
        status_display: 'Pending Pickup',
        updated_by: 'customer_jane',
        notes: 'Order placed by customer.',
        timestamp: '2026-10-02T11:05:00Z'
      }
    ]
  },
  {
    id: 104,
    tracking_number: 'TRK-1A5D8C3E',
    customer: 'customer_techcorp',
    driver: 'driver_john',
    pickup_address: 'High-Tech Park, 200 Silicon Ave, San Jose, CA',
    delivery_address: 'BioLabs Inc, 99 Medical Center Dr, Sacramento, CA',
    status: 'OUT_FOR_DELIVERY',
    status_display: 'Out for Delivery',
    weight_kg: 8.4,
    created_at: '2026-10-01T15:45:00Z',
    updated_at: '2026-10-02T12:00:00Z',
    status_logs: [
      {
        id: 4001,
        status: 'PENDING',
        status_display: 'Pending Pickup',
        updated_by: 'customer_techcorp',
        notes: 'Temperature-sensitive medical equipment order.',
        timestamp: '2026-10-01T15:45:00Z'
      },
      {
        id: 4002,
        status: 'ASSIGNED',
        status_display: 'Driver Assigned',
        updated_by: 'admin',
        notes: 'Driver driver_john assigned.',
        timestamp: '2026-10-01T17:00:00Z'
      },
      {
        id: 4003,
        status: 'IN_TRANSIT',
        status_display: 'In Transit',
        updated_by: 'driver_john',
        notes: 'Refrigerated van en route to Sacramento.',
        timestamp: '2026-10-02T06:30:00Z'
      },
      {
        id: 4004,
        status: 'OUT_FOR_DELIVERY',
        status_display: 'Out for Delivery',
        updated_by: 'driver_john',
        notes: 'On local courier delivery loop 4B.',
        timestamp: '2026-10-02T12:00:00Z'
      }
    ]
  },
  {
    id: 105,
    tracking_number: 'TRK-77C2E90D',
    customer: 'customer_jane',
    driver: null,
    pickup_address: 'North Hub, 12 Cargo Way, Chicago, IL',
    delivery_address: 'Depot 9, Detroit, MI',
    status: 'CANCELLED',
    status_display: 'Cancelled',
    weight_kg: 110.0,
    created_at: '2026-09-30T10:00:00Z',
    updated_at: '2026-10-01T14:20:00Z',
    status_logs: [
      {
        id: 5001,
        status: 'PENDING',
        status_display: 'Pending Pickup',
        updated_by: 'customer_jane',
        notes: 'Order placed by customer.',
        timestamp: '2026-09-30T10:00:00Z'
      },
      {
        id: 5002,
        status: 'CANCELLED',
        status_display: 'Cancelled',
        updated_by: 'admin',
        notes: 'Shipment cancelled per customer request.',
        timestamp: '2026-10-01T14:20:00Z'
      }
    ]
  }
];

export const MOCK_ROOT_API_DATA: RootApiData = {
  name: 'Logistics Management API',
  status: 'healthy',
  version: 'v1',
  endpoints: {
    admin: '/admin/',
    auth_login: '/api/v1/auth/login/',
    auth_refresh: '/api/v1/auth/token/refresh/',
    users: '/api/v1/users/',
    user_me: '/api/v1/users/me/',
    shipments: '/api/v1/shipments/',
    public_tracking: '/api/v1/track/{tracking_number}/',
    health_check: '/health/'
  }
};

export const MOCK_HEALTH_DATA: HealthCheckResponse = {
  status: 'ok',
  service: 'logistics-backend',
  latency_ms: 24,
  db_status: 'connected',
  active_jobs: 14
};
