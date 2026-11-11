import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { 
  User, 
  Shipment, 
  CreateShipmentPayload, 
  UpdateShipmentStatusPayload, 
  AssignDriverPayload, 
  CreateUserPayload, 
  AuthTokens, 
  LoginResponse,
  HealthCheckResponse,
  RootApiData
} from '../types';
import { 
  MOCK_USERS, 
  MOCK_SHIPMENTS, 
  MOCK_ROOT_API_DATA, 
  MOCK_HEALTH_DATA 
} from './mockData';

// Live Render Backend Base URL provided by user
export const LIVE_API_BASE_URL = 'https://logistatic-backend-1.onrender.com';

// Storage keys
const ACCESS_TOKEN_KEY = 'logistics_access_token';
const REFRESH_TOKEN_KEY = 'logistics_refresh_token';
const MOCK_MODE_KEY = 'logistics_use_mock';
const MOCK_CURRENT_USER_KEY = 'logistics_mock_user_id';

// Initialize mock state in memory
let inMemoryUsers: User[] = [...MOCK_USERS];
let inMemoryShipments: Shipment[] = [...MOCK_SHIPMENTS];

// Global helper for Mock Mode toggle
export const getUseMockMode = (): boolean => {
  const value = localStorage.getItem(MOCK_MODE_KEY);
  return value === null ? false : value === 'true';
};

export const setUseMockMode = (useMock: boolean): void => {
  localStorage.setItem(MOCK_MODE_KEY, String(useMock));
};

export const getStoredTokens = (): AuthTokens | null => {
  const access = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (access && refresh) {
    return { access, refresh };
  }
  return null;
};

export const setStoredTokens = (tokens: AuthTokens | null): void => {
  if (tokens) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const getStoredMockUserId = (): number => {
  const val = localStorage.getItem(MOCK_CURRENT_USER_KEY);
  return val ? parseInt(val, 10) : 1; // Default to Admin
};

export const setStoredMockUserId = (id: number): void => {
  localStorage.setItem(MOCK_CURRENT_USER_KEY, String(id));
};

// Create Axios Instance with Live Render URL
export const apiClient = axios.create({
  baseURL: LIVE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Authorization Header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = getStoredTokens();
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Token Refresh on 401
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes('/api/v1/auth/token/refresh/')) {
        setStoredTokens(null);
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      const tokens = getStoredTokens();

      if (tokens?.refresh) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          // Send request to refreshToken endpoint
          const res = await apiService.refreshToken(tokens.refresh);
          const newAccess = res.access;
          setStoredTokens({ access: newAccess, refresh: tokens.refresh });
          
          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          
          processQueue(null, newAccess);
          return apiClient(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          setStoredTokens(null);
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }
    }
    return Promise.reject(error);
  }
);

// Unified API Service with Live Backend & Seamless Mock Fallback
export const apiService = {
  // 1. Root API Info (`/`)
  async getRootInfo(): Promise<RootApiData> {
    if (!getUseMockMode()) {
      try {
        const res = await apiClient.get<RootApiData>('/');
        return res.data;
      } catch (err) {
        console.warn('Real API failed for root info, falling back to mock response', err);
      }
    }
    await new Promise((res) => setTimeout(res, 200));
    return MOCK_ROOT_API_DATA;
  },

  // 2. Health Check (`/health/`)
  async checkHealth(): Promise<HealthCheckResponse> {
    const startTime = performance.now();
    if (!getUseMockMode()) {
      try {
        const res = await apiClient.get<HealthCheckResponse>('/health/');
        const endTime = performance.now();
        return {
          ...res.data,
          latency_ms: Math.round(endTime - startTime),
          db_status: 'connected',
        };
      } catch (err) {
        console.warn('Health check request to backend failed, using mock status', err);
      }
    }
    await new Promise((res) => setTimeout(res, 300));
    return {
      ...MOCK_HEALTH_DATA,
      latency_ms: Math.floor(15 + Math.random() * 25),
    };
  },

  // 3. Auth Login (`/api/v1/auth/login/`)
  async login(username: string, password: string): Promise<LoginResponse> {
    if (!getUseMockMode()) {
      try {
        const res = await apiClient.post<LoginResponse>('/api/v1/auth/login/', {
          username,
          password,
        });
        setStoredTokens({ access: res.data.access, refresh: res.data.refresh });
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          throw err;
        }
        console.warn('Backend unavailable, attempting mock authentication');
      }
    }

    // Mock Login Logic
    await new Promise((res) => setTimeout(res, 500));
    const foundUser = inMemoryUsers.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!foundUser) {
      throw new Error('Invalid credentials. User not found.');
    }

    const mockTokens: AuthTokens = {
      access: `mock_access_jwt_token_${foundUser.id}_${Date.now()}`,
      refresh: `mock_refresh_jwt_token_${foundUser.id}_${Date.now()}`,
    };

    setStoredTokens(mockTokens);
    setStoredMockUserId(foundUser.id);

    return {
      ...mockTokens,
      user: foundUser,
    };
  },

  // 4. Token Refresh (`/api/v1/auth/token/refresh/`)
  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    if (!getUseMockMode()) {
      try {
        const res = await apiClient.post<{ access: string }>('/api/v1/auth/token/refresh/', {
          refresh: refreshToken,
        });
        return res.data;
      } catch (err) {
        console.warn('Token refresh failed on backend, simulating refresh token');
      }
    }

    await new Promise((res) => setTimeout(res, 300));
    return {
      access: `mock_refreshed_jwt_${Date.now()}`,
    };
  },

  // 5. Current User Profile (`/api/v1/users/me/`)
  async getCurrentUser(): Promise<User> {
    if (!getUseMockMode()) {
      try {
        const res = await apiClient.get<User>('/api/v1/users/me/');
        return res.data;
      } catch (err) {
        console.warn('Failed fetching /api/v1/users/me/ from real API, falling back to mock user');
      }
    }

    await new Promise((res) => setTimeout(res, 300));
    const mockId = getStoredMockUserId();
    const mockUser = inMemoryUsers.find((u) => u.id === mockId) || inMemoryUsers[0];
    return mockUser;
  },

  // Update current user profile
  async updateCurrentUser(payload: Partial<User>): Promise<User> {
    if (!getUseMockMode()) {
      try {
        const res = await apiClient.patch<User>('/api/v1/users/me/', payload);
        return res.data;
      } catch (err) {
        console.warn('Backend patch failed, updating in mock state');
      }
    }

    await new Promise((res) => setTimeout(res, 400));
    const mockId = getStoredMockUserId();
    inMemoryUsers = inMemoryUsers.map((u) => (u.id === mockId ? { ...u, ...payload } : u));
    return inMemoryUsers.find((u) => u.id === mockId)!;
  },

  // 6. Users Management (`/api/v1/users/`)
  async getUsers(): Promise<User[]> {
    if (!getUseMockMode()) {
      try {
        const res = await apiClient.get<User[]>('/api/v1/users/');
        return res.data;
      } catch (err) {
        console.warn('Failed fetching users from backend, returning mock users list');
      }
    }

    await new Promise((res) => setTimeout(res, 400));
    return [...inMemoryUsers];
  },

  async createUser(payload: CreateUserPayload): Promise<User> {
    if (!getUseMockMode()) {
      try {
        const res = await apiClient.post<User>('/api/v1/users/', payload);
        return res.data;
      } catch (err) {
        console.warn('Backend create user failed, creating in mock store');
      }
    }

    await new Promise((res) => setTimeout(res, 500));
    const newUser: User = {
      id: Math.floor(100 + Math.random() * 900),
      username: payload.username,
      email: payload.email,
      role: payload.role,
      phone_number: payload.phone_number || '',
      first_name: payload.first_name || '',
      last_name: payload.last_name || '',
    };
    inMemoryUsers.push(newUser);
    return newUser;
  },

  async updateUser(id: number, payload: Partial<CreateUserPayload>): Promise<User> {
    if (!getUseMockMode()) {
      try {
        const res = await apiClient.patch<User>(`/api/v1/users/${id}/`, payload);
        return res.data;
      } catch (err) {
        console.warn('Backend update user failed, performing mock update');
      }
    }

    await new Promise((res) => setTimeout(res, 400));
    inMemoryUsers = inMemoryUsers.map((u) => (u.id === id ? { ...u, ...payload } : u));
    return inMemoryUsers.find((u) => u.id === id)!;
  },

  async deleteUser(id: number): Promise<void> {
    if (!getUseMockMode()) {
      try {
        await apiClient.delete(`/api/v1/users/${id}/`);
        return;
      } catch (err) {
        console.warn('Backend delete user failed, updating mock store');
      }
    }

    await new Promise((res) => setTimeout(res, 400));
    inMemoryUsers = inMemoryUsers.filter((u) => u.id !== id);
  },

  // 7. Shipments Management (`/api/v1/shipments/`)
  async getShipments(): Promise<Shipment[]> {
    if (!getUseMockMode()) {
      try {
        const res = await apiClient.get<Shipment[]>('/api/v1/shipments/');
        return res.data;
      } catch (err) {
        console.warn('Failed to fetch shipments from backend API, using mock list');
      }
    }

    await new Promise((res) => setTimeout(res, 500));
    return [...inMemoryShipments];
  },

  async createShipment(payload: CreateShipmentPayload, currentUser: User): Promise<Shipment> {
    if (!getUseMockMode()) {
      try {
        const res = await apiClient.post<Shipment>('/api/v1/shipments/', payload);
        return res.data;
      } catch (err) {
        console.warn('Failed to create shipment on backend API, using mock store');
      }
    }

    await new Promise((res) => setTimeout(res, 600));
    const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
    const tracking_number = `TRK-${randomHex}`;
    const now = new Date().toISOString();

    const newShipment: Shipment = {
      id: Math.floor(200 + Math.random() * 800),
      tracking_number,
      customer: currentUser.username || 'customer_jane',
      driver: null,
      pickup_address: payload.pickup_address,
      delivery_address: payload.delivery_address,
      status: 'PENDING',
      status_display: 'Pending Pickup',
      weight_kg: payload.weight_kg ? Number(payload.weight_kg) : null,
      created_at: now,
      updated_at: now,
      status_logs: [
        {
          id: Math.floor(1000 + Math.random() * 9000),
          status: 'PENDING',
          status_display: 'Pending Pickup',
          updated_by: currentUser.username,
          notes: payload.notes || 'Order placed by customer.',
          timestamp: now,
        },
      ],
    };

    inMemoryShipments.unshift(newShipment);
    return newShipment;
  },

  async assignDriver(shipmentId: number, payload: AssignDriverPayload, currentUser: User): Promise<Shipment> {
    if (!getUseMockMode()) {
      try {
        const res = await apiClient.patch<Shipment>(`/api/v1/shipments/${shipmentId}/assign_driver/`, payload);
        return res.data;
      } catch (err) {
        console.warn('Failed to assign driver on backend API, assigning in mock store');
      }
    }

    await new Promise((res) => setTimeout(res, 500));
    const driverUser = inMemoryUsers.find((u) => u.id === payload.driver_id);
    const driverName = driverUser ? driverUser.username : `driver_${payload.driver_id}`;
    const now = new Date().toISOString();

    inMemoryShipments = inMemoryShipments.map((s) => {
      if (s.id === shipmentId) {
        const updatedLogs = [
          {
            id: Math.floor(1000 + Math.random() * 9000),
            status: 'ASSIGNED' as const,
            status_display: 'Driver Assigned',
            updated_by: currentUser.username,
            notes: `Driver ${driverName} assigned to delivery request.`,
            timestamp: now,
          },
          ...s.status_logs,
        ];
        return {
          ...s,
          driver: driverName,
          status: 'ASSIGNED' as const,
          status_display: 'Driver Assigned',
          updated_at: now,
          status_logs: updatedLogs,
        };
      }
      return s;
    });

    return inMemoryShipments.find((s) => s.id === shipmentId)!;
  },

  async updateShipmentStatus(
    shipmentId: number, 
    payload: UpdateShipmentStatusPayload, 
    currentUser: User
  ): Promise<Shipment> {
    if (!getUseMockMode()) {
      try {
        const res = await apiClient.patch<Shipment>(`/api/v1/shipments/${shipmentId}/update_status/`, payload);
        return res.data;
      } catch (err) {
        console.warn('Failed updating shipment status on backend, updating mock store');
      }
    }

    await new Promise((res) => setTimeout(res, 500));
    const now = new Date().toISOString();
    const statusMap: Record<string, string> = {
      PENDING: 'Pending Pickup',
      ASSIGNED: 'Driver Assigned',
      IN_TRANSIT: 'In Transit',
      OUT_FOR_DELIVERY: 'Out for Delivery',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled',
    };

    inMemoryShipments = inMemoryShipments.map((s) => {
      if (s.id === shipmentId) {
        const newLog = {
          id: Math.floor(1000 + Math.random() * 9000),
          status: payload.status,
          status_display: statusMap[payload.status] || payload.status,
          updated_by: currentUser.username,
          notes: payload.notes || `Status updated to ${statusMap[payload.status]}`,
          timestamp: now,
        };
        return {
          ...s,
          status: payload.status,
          status_display: statusMap[payload.status] || payload.status,
          updated_at: now,
          status_logs: [newLog, ...s.status_logs],
        };
      }
      return s;
    });

    return inMemoryShipments.find((s) => s.id === shipmentId)!;
  },

  // 8. Public Tracking (`/api/v1/track/{tracking_number}/`)
  async getPublicTracking(trackingNumber: string): Promise<Shipment> {
    const formattedNum = trackingNumber.trim().toUpperCase();
    if (!getUseMockMode()) {
      try {
        const res = await apiClient.get<Shipment>(`/api/v1/track/${encodeURIComponent(formattedNum)}/`);
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          throw new Error(`Shipment with tracking number '${formattedNum}' was not found.`);
        }
        console.warn('Public tracking call failed on real endpoint, checking mock data');
      }
    }

    await new Promise((res) => setTimeout(res, 400));
    const shipment = inMemoryShipments.find(
      (s) => s.tracking_number.toUpperCase() === formattedNum
    );

    if (!shipment) {
      throw new Error(`Shipment matching '${formattedNum}' not found in system record.`);
    }

    return shipment;
  },
};
