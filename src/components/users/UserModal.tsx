import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { User, UserRole, CreateUserPayload } from '../../types';
import { User as UserIcon, Mail, Phone, Lock, ShieldCheck, UserPlus } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: User | null;
  onSubmit: (payload: CreateUserPayload, isEdit: boolean) => Promise<void>;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
  onSubmit
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('DRIVER');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setUsername(userToEdit.username);
      setEmail(userToEdit.email);
      setPassword('');
      setRole(userToEdit.role);
      setPhoneNumber(userToEdit.phone_number || '');
      setFirstName(userToEdit.first_name || '');
      setLastName(userToEdit.last_name || '');
    } else {
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('DRIVER');
      setPhoneNumber('');
      setFirstName('');
      setLastName('');
    }
  }, [userToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email) return;

    setIsSubmitting(true);
    try {
      await onSubmit(
        {
          username,
          email,
          password: password || undefined,
          role,
          phone_number: phoneNumber,
          first_name: firstName,
          last_name: lastName,
        },
        !!userToEdit
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={userToEdit ? `Edit User — @${userToEdit.username}` : 'Add New System User'}
      subtitle={
        userToEdit
          ? `PATCH /api/v1/users/${userToEdit.id}/`
          : 'POST /api/v1/users/ — Create dispatcher, driver or customer'
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-white" /> Username *
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. driver_sam"
              className="w-full p-3 bg-black rounded-xl border border-zinc-700 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-white" /> Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sam@logistatic.com"
              className="w-full p-3 bg-black rounded-xl border border-zinc-700 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-400" /> Password {userToEdit ? '(Leave blank to keep unchanged)' : '*'}
            </label>
            <input
              type="password"
              required={!userToEdit}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-black rounded-xl border border-zinc-700 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-white" /> User System Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full p-3 bg-black rounded-xl border border-zinc-700 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white font-bold"
            >
              <option value="DRIVER">DRIVER (Freight Logistics)</option>
              <option value="CUSTOMER">CUSTOMER (Order Client)</option>
              <option value="ADMIN">ADMIN (System Administrator)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-300 mb-1 block">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name..."
              className="w-full p-3 bg-black rounded-xl border border-zinc-700 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 mb-1 block">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name..."
              className="w-full p-3 bg-black rounded-xl border border-zinc-700 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-zinc-400" /> Phone Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full p-3 bg-black rounded-xl border border-zinc-700 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white font-mono"
            />
          </div>
        </div>

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
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-zinc-200 border border-white flex items-center gap-2 disabled:opacity-50 shadow-lg"
          >
            <UserPlus className="w-4 h-4 text-black" />
            <span>{isSubmitting ? 'Saving...' : userToEdit ? 'Save Changes' : 'Create User'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
