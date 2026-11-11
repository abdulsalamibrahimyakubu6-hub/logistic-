import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HealthProvider } from './context/HealthContext';
import { ActiveTab } from './types';
import { PublicTracking } from './components/public/PublicTracking';
import { LoginForm } from './components/auth/LoginForm';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { ShipmentsTable } from './components/shipments/ShipmentsTable';
import { UserManagement } from './components/users/UserManagement';
import { AdminPanel } from './components/admin/AdminPanel';
import { CreateShipmentModal } from './components/shipments/CreateShipmentModal';
import { UserModal } from './components/users/UserModal';
import { apiService } from './services/api';
import { useToast } from './context/ToastContext';

const MainAppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<ActiveTab>('tracking');

  // Modals triggered from Overview quick action bar
  const [isOverviewCreateShipmentOpen, setIsOverviewCreateShipmentOpen] = useState(false);
  const [isOverviewCreateUserOpen, setIsOverviewCreateUserOpen] = useState(false);

  // Handlers for Overview quick actions
  const handleOverviewCreateShipment = async (payload: any) => {
    if (!user) return;
    try {
      const res = await apiService.createShipment(payload, user);
      addToast('success', 'Shipment Created', `Tracking number: ${res.tracking_number}`);
    } catch (err: any) {
      addToast('error', 'Failed to create shipment', err.message);
    }
  };

  const handleOverviewCreateUser = async (payload: any) => {
    try {
      const res = await apiService.createUser(payload);
      addToast('success', 'User Created', `User @${res.username} registered.`);
    } catch (err: any) {
      addToast('error', 'Failed to create user', err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-400">Loading Logistics Management Platform...</p>
      </div>
    );
  }

  // 1. Landing Public Tracking Page
  if (activeTab === 'tracking') {
    return <PublicTracking onNavigateToLogin={() => setActiveTab(isAuthenticated ? 'overview' : 'login')} />;
  }

  // 2. Authentication Login Page
  if (!isAuthenticated || activeTab === 'login') {
    return <LoginForm onBackToPublicTracking={() => setActiveTab('tracking')} />;
  }

  // 3. Authenticated Dashboard Layout
  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onNavigateToPublicTracking={() => setActiveTab('tracking')}
    >
      {activeTab === 'overview' && (
        <DashboardOverview
          setActiveTab={setActiveTab}
          onOpenCreateShipmentModal={() => setIsOverviewCreateShipmentOpen(true)}
          onOpenCreateUserModal={() => setIsOverviewCreateUserOpen(true)}
        />
      )}

      {activeTab === 'shipments' && <ShipmentsTable currentUser={user} />}

      {activeTab === 'users' && <UserManagement />}

      {activeTab === 'admin' && <AdminPanel />}

      {/* Overview Quick Action Modals */}
      <CreateShipmentModal
        isOpen={isOverviewCreateShipmentOpen}
        onClose={() => setIsOverviewCreateShipmentOpen(false)}
        onSubmit={handleOverviewCreateShipment}
        currentUser={user}
      />

      <UserModal
        isOpen={isOverviewCreateUserOpen}
        onClose={() => setIsOverviewCreateUserOpen(false)}
        userToEdit={null}
        onSubmit={handleOverviewCreateUser}
      />
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <HealthProvider>
          <MainAppContent />
        </HealthProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
