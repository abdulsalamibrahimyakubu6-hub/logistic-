import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { HealthCheckResponse, RootApiData } from '../types';
import { apiService } from '../services/api';

interface HealthContextType {
  health: HealthCheckResponse | null;
  rootApiData: RootApiData | null;
  isPolling: boolean;
  lastChecked: Date | null;
  refetchHealth: () => Promise<void>;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [rootApiData, setRootApiData] = useState<RootApiData | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchHealthAndRoot = useCallback(async () => {
    setIsPolling(true);
    try {
      const [hRes, rRes] = await Promise.all([
        apiService.checkHealth(),
        apiService.getRootInfo()
      ]);
      setHealth(hRes);
      setRootApiData(rRes);
      setLastChecked(new Date());
    } catch (err) {
      console.warn('Health check polling error:', err);
    } finally {
      setIsPolling(false);
    }
  }, []);

  useEffect(() => {
    fetchHealthAndRoot();
    const interval = setInterval(() => {
      fetchHealthAndRoot();
    }, 15000); // Poll every 15 seconds

    return () => clearInterval(interval);
  }, [fetchHealthAndRoot]);

  return (
    <HealthContext.Provider
      value={{
        health,
        rootApiData,
        isPolling,
        lastChecked,
        refetchHealth: fetchHealthAndRoot
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = (): HealthContextType => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
