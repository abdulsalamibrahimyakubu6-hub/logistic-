import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LogIn, 
  Lock, 
  User as UserIcon, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Radio
} from 'lucide-react';

interface LoginFormProps {
  onBackToPublicTracking: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onBackToPublicTracking }) => {
  const { login, useMockMode, toggleMockMode, selectMockUser } = useAuth();
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('admin123');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsSubmitting(true);
    try {
      await login(username, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const presetUsers = [
    { id: 1, label: 'Admin (Alex)', username: 'admin', role: 'ADMIN', color: 'bg-white text-black border-white hover:bg-zinc-200' },
    { id: 2, label: 'Driver (John)', username: 'driver_john', role: 'DRIVER', color: 'bg-zinc-800 text-white border-zinc-600 hover:bg-zinc-700' },
    { id: 4, label: 'Customer (Jane)', username: 'customer_jane', role: 'CUSTOMER', color: 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800' },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-white selection:text-black">
      {/* Top Header & Back Button */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <button
          onClick={onBackToPublicTracking}
          className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Public Tracking
        </button>

        {/* Toggle Mode Control */}
        <button
          onClick={toggleMockMode}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800"
          title="Toggle between Mock Demo state and Django REST Backend"
        >
          <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
          <span>{useMockMode ? 'Mock Engine: Active' : 'Live API Mode'}</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl p-8 relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center mx-auto shadow-lg border border-white">
            <Truck className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Staff Portal Login</h2>
          <p className="text-xs text-zinc-400">
            Authenticate hitting <code className="text-white font-mono">/api/v1/auth/login/</code>
          </p>
        </div>

        {/* Quick Persona Selectors */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block text-center">
            Quick Persona Login Presets:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {presetUsers.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setUsername(p.username);
                  setPassword('password');
                  selectMockUser(p.id);
                }}
                className={`px-2 py-2 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1 transition-all ${p.color}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="truncate w-full text-center">{p.role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-300 mb-1.5 block">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                className="w-full pl-10 pr-4 py-3 bg-black rounded-xl border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-10 pr-4 py-3 bg-black rounded-xl border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-zinc-200 border border-white disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-black" />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Security & Endpoint Footer note */}
        <div className="pt-4 border-t border-zinc-800 text-center text-xs text-zinc-500 space-y-1">
          <p className="flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            JWT Access & Refresh Token Interceptor Enabled
          </p>
          <p className="font-mono text-[10px] text-zinc-600">POST /api/v1/auth/login/ → GET /api/v1/users/me/</p>
        </div>
      </div>
    </div>
  );
};
