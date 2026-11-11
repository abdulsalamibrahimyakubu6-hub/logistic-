import React, { useEffect, useState } from 'react';
import type { User, CreateUserPayload } from '../../types';
import { apiService } from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';
import { TableSkeleton } from '../common/SkeletonLoader';
import { UserModal } from './UserModal';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  Radio
} from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { user: currentUser, selectMockUser } = useAuth();
  const { addToast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (err: any) {
      addToast('error', 'Error Loading Users', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSaveUser = async (payload: CreateUserPayload, isEdit: boolean) => {
    try {
      if (isEdit && userToEdit) {
        const updated = await apiService.updateUser(userToEdit.id, payload);
        setUsers((prev) => prev.map((u) => (u.id === userToEdit.id ? updated : u)));
        addToast('success', 'User Updated', `Updated account @${updated.username}`);
      } else {
        const created = await apiService.createUser(payload);
        setUsers((prev) => [...prev, created]);
        addToast('success', 'User Created', `Created user @${created.username}`);
      }
    } catch (err: any) {
      addToast('error', 'Action Failed', err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await apiService.deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      addToast('info', 'User Removed', `Account @${userToDelete.username} deleted.`);
      setUserToDelete(null);
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.first_name && u.first_name.toLowerCase().includes(q)) ||
      (u.last_name && u.last_name.toLowerCase().includes(q)) ||
      (u.phone_number && u.phone_number.toLowerCase().includes(q));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center border border-white">
            <Users className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">System User & Role Management</h2>
            <p className="text-xs text-zinc-400 font-mono">REST endpoint: /api/v1/users/</p>
          </div>
        </div>

        <button
          onClick={() => {
            setUserToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-zinc-200 transition-all border border-white shadow-lg"
        >
          <UserPlus className="w-4 h-4 text-black" />
          <span>Add New System User</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search username, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black rounded-xl border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white focus:ring-1 focus:ring-white font-mono"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 bg-black p-1 rounded-xl border border-zinc-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-zinc-400 ml-2" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-zinc-200 py-1.5 pr-3 focus:outline-none font-bold cursor-pointer"
            >
              <option value="ALL">All Roles ({users.length})</option>
              <option value="ADMIN">Admins Only</option>
              <option value="DRIVER">Drivers Only</option>
              <option value="CUSTOMER">Customers Only</option>
            </select>
          </div>

          <button
            onClick={loadUsers}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid View of Users */}
      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((u) => {
            const isSelf = currentUser?.id === u.id;
            return (
              <div
                key={u.id}
                className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-4 hover:border-zinc-600 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-base shadow-md border border-white">
                        {u.first_name ? u.first_name[0] : u.username[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                          {u.first_name ? `${u.first_name} ${u.last_name || ''}` : u.username}
                          {isSelf && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-mono border border-zinc-700">
                              You
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-zinc-400 font-mono">@{u.username}</p>
                      </div>
                    </div>

                    <StatusBadge role={u.role} size="sm" />
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Mail className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="truncate font-mono">{u.email}</span>
                    </div>

                    {u.phone_number && (
                      <div className="flex items-center gap-2 text-zinc-300 font-mono">
                        <Phone className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{u.phone_number}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => selectMockUser(u.id)}
                    className="flex items-center gap-1.5 text-xs text-white hover:underline font-bold px-2 py-1 rounded-lg hover:bg-zinc-900"
                    title="Switch active session persona to this user"
                  >
                    <Radio className="w-3.5 h-3.5 text-white" />
                    <span>Switch Persona</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setUserToEdit(u);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white transition-colors"
                      title="Edit User"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-white" />
                    </button>

                    {!isSelf && (
                      <button
                        onClick={() => setUserToDelete(u)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* User Create/Edit Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={userToEdit}
        onSubmit={handleSaveUser}
      />

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title="Confirm User Deletion"
        subtitle={`DELETE /api/v1/users/${userToDelete?.id}/`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-300">
            Are you sure you want to permanently delete user <strong className="text-white">@{userToDelete?.username}</strong>?
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setUserToDelete(null)}
              className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 text-sm font-bold hover:bg-zinc-800 border border-zinc-700"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded-xl bg-white text-black text-sm font-extrabold hover:bg-zinc-200 border border-white shadow-lg"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
