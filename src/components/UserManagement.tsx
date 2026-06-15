/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types';
import { User, KeyRound, Key, Plus, Trash2, Edit2, ShieldCheck, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserManagementProps {
  currentRole: UserRole;
  currentUser: string;
  onUpdateUsers: (updatedUsers: UserAccount[], logMessage: string) => void;
  usersList: UserAccount[];
}

export default function UserManagement({
  currentRole,
  currentUser,
  onUpdateUsers,
  usersList
}: UserManagementProps) {
  // UI views states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPasswordMap, setShowPasswordMap] = useState<{ [key: string]: boolean }>({});

  // Form inputs states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [role, setRole] = useState<UserRole>('Wali Kelas');

  // Trigger success banner
  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Find active personal account (for Walas/Kamad/Siswa)
  const myAccount = usersList.find(u => u.nama === currentUser) || usersList.find(u => u.role === currentRole);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setNama('');
    setRole('Wali Kelas');
    setEditingUserId(null);
    setShowAddForm(false);
    setErrorMsg(null);
  };

  const handleEditClick = (user: UserAccount) => {
    setEditingUserId(user.id_user);
    setUsername(user.username);
    setPassword(user.password_plain);
    setNama(user.nama);
    setRole(user.role);
    setShowAddForm(true);
    setErrorMsg(null);
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = usersList.find(u => u.id_user === userId);
    if (!userToDelete) return;

    if (userToDelete.username === 'usman146' || userToDelete.id_user === 'usr-1') {
      alert('Akses Dibatasi! Akun Operator utama SIBIMA tidak diperkenankan untuk dihapus demi mencegah lockout database.');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus user "${userToDelete.nama}" (${userToDelete.username})?`)) {
      const updatedList = usersList.filter(u => u.id_user !== userId);
      onUpdateUsers(updatedList, `Menghapus akun pengguna sitem: ${userToDelete.nama} (${userToDelete.username})`);
      triggerSuccess(`Akun ${userToDelete.nama} berhasil dihapus dari database.`);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanNama = nama.trim();

    if (!cleanUsername || !cleanPassword || !cleanNama) {
      setErrorMsg('Semua kolom wajib diisi dengan lengkap!');
      return;
    }

    if (cleanUsername.length < 4) {
      setErrorMsg('Username/User ID harus minimal berisi 4 karakter alfanumerik!');
      return;
    }

    if (cleanPassword.length < 4) {
      setErrorMsg('Sandi keamanan (Password) harus minimal berisi 4 karakter!');
      return;
    }

    // Check duplicate username if adding new or editing in another user
    const hasDup = usersList.some(
      u => u.username.toLowerCase() === cleanUsername && u.id_user !== editingUserId
    );
    if (hasDup) {
      setErrorMsg(`Maaf, nama pengguna (Username) "${cleanUsername}" sudah terdaftar untuk pengguna lain! Silakan pilih yang lain.`);
      return;
    }

    let updatedList: UserAccount[] = [];
    let logText = '';

    if (editingUserId) {
      // Editing
      updatedList = usersList.map(u => 
        u.id_user === editingUserId 
          ? { ...u, username: cleanUsername, password_plain: cleanPassword, nama: cleanNama, role } 
          : u
      );
      logText = `Memperbarui info sandi dan nama user: ${cleanNama} (As: ${role})`;
    } else {
      // Adding new
      const newUser: UserAccount = {
        id_user: `usr-${Date.now()}`,
        username: cleanUsername,
        password_plain: cleanPassword,
        nama: cleanNama,
        role
      };
      updatedList = [...usersList, newUser];
      logText = `Mendaftarkan masuk user login baru: ${cleanNama} sebagai role ${role}`;
    }

    onUpdateUsers(updatedList, logText);
    triggerSuccess(editingUserId ? 'Perubahan akun pengguna berhasil disimpan!' : 'Akun baru berhasil didaftarkan!');
    resetForm();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 space-y-6 font-sans">
      
      {/* Banner Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-emerald-700" />
            <span>Kredensial SIBIMA & Manajemen Pengguna</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Modul pengaman masuk madrasah dilaraskan dengan register Rapor RDM Kemenag. Kelola sandi, nama tampilan, dan hak akses.
          </p>
        </div>

        {currentRole === 'Operator' && !showAddForm && (
          <button
            type="button"
            onClick={() => { setShowAddForm(true); setEditingUserId(null); }}
            className="flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Entri User Baru</span>
          </button>
        )}
      </div>

      {/* Warnings & Success banners */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 border border-emerald-300 text-emerald-850 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm"
          >
            <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {errorMsg && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl flex items-start gap-2.5">
          <AlertCircle className="h-4.5 w-4.5 text-rose-600 mt-0.5 shrink-0" />
          <span className="text-xs text-rose-800 font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* FORM: ADD OR EDIT USER (Operator is editing, or Staff is editing their own password) */}
      {showAddForm || (currentRole !== 'Operator' && myAccount) ? (
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="h-4 w-4 text-[#0F7B6C]" />
              <span>
                {currentRole !== 'Operator' 
                  ? `Ubah Kredensial Saya (${currentRole})` 
                  : (editingUserId ? 'Form Edit User & Password' : 'Form Entri User Baru')}
              </span>
            </h3>
            
            {currentRole === 'Operator' && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Batal / Kembali
              </button>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Display Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nama Tampilan Lengkap</label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
                placeholder="Misal: Ust. Mahmud, S.Pd.I."
                disabled={currentRole !== 'Operator' && myAccount?.role !== currentRole}
              />
              <p className="text-[10px] text-slate-400 mt-1">Nama ini dicantumkan pada Tanda Tangan buku induk RDM.</p>
            </div>

            {/* Username */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nama Pengguna (Username / ID)</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 font-mono"
                placeholder="Ketik username login..."
                disabled={currentRole !== 'Operator'}
              />
              <p className="text-[10px] text-slate-400 mt-1">Hanya huruf kecil, angka, titik tanpa spasi.</p>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Sandi Baru (Password)</label>
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 font-mono"
                placeholder="Ketik password login..."
              />
              <p className="text-[10px] text-slate-400 mt-1">Simpan di tempat aman dan jangan dibagi ke siswa bimbingan.</p>
            </div>

            {/* Role (Operator only can change) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Pilih Tingkat Hak Akses</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                disabled={currentRole !== 'Operator'}
                className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none cursor-pointer focus:border-emerald-500"
              >
                <option value="Operator">Operator (Admin Sistem)</option>
                <option value="Wali Kelas">Wali Kelas (Walas XI-MIPA)</option>
                <option value="Kepala Madrasah">Kepala Madrasah (Kamad)</option>
                <option value="Siswa">Siswa (Akses Pengintip)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">Tingkatan hak mempegaruhi menu bimbingan madrasah SIBIMA.</p>
            </div>

            <div className="md:col-span-2 pt-3 flex items-center justify-end gap-2 border-t border-slate-200 mt-2">
              {currentRole === 'Operator' && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold border border-slate-250 cursor-pointer"
                >
                  Batal
                </button>
              )}
              
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold rounded-xl text-xs shadow-md transition cursor-pointer"
              >
                {editingUserId ? 'Simpan Perubahan Akun' : 'Daftarkan Akun Baru'}
              </button>
            </div>

          </form>
        </div>
      ) : null}

      {/* VIEW: SEED / SAVED ADMIN & STAFF ACCOUNTS (Seen by Operator only) */}
      {currentRole === 'Operator' ? (
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono">Daftar Akun Pengguna Terdaftar</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Sandi disimpan lokal terenkripsi di madrasah. Operator dapat mengedit semua sandi.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50 font-mono text-[10px] uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nama Pengguna</th>
                  <th className="px-4 py-3">Username / ID</th>
                  <th className="px-4 py-3">Sandi Keamanan (Password)</th>
                  <th className="px-4 py-3">Status Akses</th>
                  <th className="px-4 py-3 text-center">Aksi Pengurus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white text-xs">
                {usersList.map((user) => {
                  const isVisible = showPasswordMap[user.id_user] || false;
                  const isMainOperator = user.username === 'usman146';

                  return (
                    <tr key={user.id_user} className="hover:bg-slate-50/50">
                      
                      {/* Name */}
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {user.nama}
                      </td>

                      {/* Username */}
                      <td className="px-4 py-3 font-mono text-emerald-850">
                        {user.username}
                      </td>

                      {/* Password */}
                      <td className="px-4 py-3 font-mono">
                        <div className="flex items-center space-x-1.5">
                          <span>{isVisible ? user.password_plain : '••••••••'}</span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(user.id_user)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                            title={isVisible ? "Sembunyikan password" : "Tampilkan password"}
                          >
                            {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </button>
                        </div>
                      </td>

                      {/* Role badge */}
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          user.role === 'Operator' ? 'bg-emerald-55 text-emerald-850' :
                          user.role === 'Wali Kelas' ? 'bg-blue-50 text-blue-700' :
                          user.role === 'Kepala Madrasah' ? 'bg-amber-50 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1">
                          
                          <button
                            type="button"
                            onClick={() => handleEditClick(user)}
                            className="p-1 text-amber-700 hover:bg-amber-50 rounded"
                            title="Edit akun"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          {!isMainOperator && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user.id_user)}
                              className="p-1 text-red-650 hover:bg-red-50 rounded"
                              title="Hapus akun"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Non-operator informational panel
        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex items-start gap-2 text-xs text-emerald-800 leading-relaxed font-sans">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-700 mt-0.5 shrink-0" />
          <div>
            <span className="font-extrabold block">Akses Keamanan Aktif:</span>
            Sebagai <strong>{currentRole}</strong>, Anda hanya diperkenankan untuk merubah setelan kredensial login pribadi Anda sendiri lewat form profil di atas. Hubungi <strong>Operator Utama (Usman)</strong> untuk pendaftaran akun madrasah bimbingan baru lainnya.
          </div>
        </div>
      )}

    </div>
  );
}
