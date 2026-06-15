/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, Siswa } from '../types';
import { Landmark, Lock, User, Eye, EyeOff, ShieldAlert, KeyRound, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { SEED_SISWA, getLocalStorageUsers } from '../data/seedData';

interface LoginProps {
  onLoginSuccess: (role: UserRole, username: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [role, setRole] = useState<UserRole>('Operator');
  const [username, setUsername] = useState('usman146');
  const [password, setPassword] = useState('operator');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Look up student list for authentication (reads from local storage if exists, otherwise uses SEED_SISWA)
  const [students] = useState<Siswa[]>(() => {
    try {
      const stored = localStorage.getItem('sibima_siswa');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return SEED_SISWA;
  });

  // Auto-fill presets when role is selected
  const handleRoleChange = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'Operator') {
      setUsername('usman146');
      setPassword('operator');
    } else if (selectedRole === 'Wali Kelas') {
      setUsername('aminah.si');
      setPassword('walikelas');
    } else if (selectedRole === 'Kepala Madrasah') {
      setUsername('nuruddin.head');
      setPassword('kamad');
    } else {
      // Siswa role preset (Wildan)
      setUsername('0085432101');
      setPassword('23241001');
    }
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Simulate database credentials verification
    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const trimmedPass = password.trim();

      if (role === 'Siswa') {
        // Authenticate student: Username = NISN, Password = NIS
        const student = students.find(
          (s) => s.nisn.trim() === trimmedUser && s.nis.trim() === trimmedPass
        );
        if (student) {
          onLoginSuccess('Siswa', student.nama);
        } else {
          setError('Siswa tidak ditemukan! Pastikan NISN (sebagai User ID) dan NIS (sebagai Sandi) sudah benar.');
          setIsSubmitting(false);
        }
      } else {
        // Authenticate admin/staff from dynamic local users list
        const userList = getLocalStorageUsers();
        const matchedUser = userList.find(
          (u) => u.role === role && 
                 u.username.trim().toLowerCase() === trimmedUser && 
                 u.password_plain === trimmedPass
        );
        
        if (matchedUser) {
          onLoginSuccess(matchedUser.role, matchedUser.nama);
        } else {
          setError('Kombinasi User ID, Password atau Hak Akses salah. Gunakan tombol "Masuk Cepat" di bawah jika tidak yakin.');
          setIsSubmitting(false);
        }
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Dynamic Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200 via-emerald-950 to-black bg-grid"></div>
      
      {/* Glowing Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-emerald-950/40 backdrop-blur-md rounded-3xl border border-emerald-500/20 shadow-2xl shadow-emerald-950/80 overflow-hidden"
      >
        {/* Banner Header */}
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-8 text-center border-b border-[#D4AF37]/30 relative">
          <div className="absolute top-3 right-4 flex items-center space-x-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
            <span className="text-[10px] text-emerald-300 font-mono">SERVER LIVE</span>
          </div>
          
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-[#D4AF37] rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-emerald-900/50 mb-4 animate-bounce">
            <Landmark className="h-9 w-9 text-emerald-950" />
          </div>

          <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber-400 font-bold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-850">
            MA BANU HASYIM SIDOARJO
          </span>
          
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-3">
            SIBIMA <span className="font-light text-[#D4AF37]">Digital</span>
          </h1>
          <p className="text-emerald-200/80 text-xs mt-1 italic font-sans">
            Sistem Buku Induk Digital Madrasah Aliyah - Rapor RDM Kemenag
          </p>
        </div>

        <div className="p-8 space-y-6">
          
          {/* Role selector panel */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-amber-300 font-mono uppercase tracking-wider block">Pilih Hak Akses:</label>
            <div className="grid grid-cols-4 gap-1.5 bg-emerald-950/80 p-1 rounded-xl border border-emerald-850">
              {(['Operator', 'Wali Kelas', 'Kepala Madrasah', 'Siswa'] as UserRole[]).map((r) => {
                const isSelected = role === r;
                return (
                  <button
                    type="button"
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`py-2 px-1 rounded-lg text-[10px] font-bold transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow'
                        : 'text-emerald-200 hover:bg-emerald-900/30'
                    }`}
                  >
                    {r === 'Kepala Madrasah' ? 'Kamad' : r === 'Wali Kelas' ? 'Walas' : r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* User ID field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-emerald-200 block">
                {role === 'Siswa' ? 'User ID / NISN (10 Digit)' : 'User ID / Username'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  id="login-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/60 border border-emerald-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder-emerald-600 focus:outline-none transition-all duration-200"
                  placeholder={role === 'Siswa' ? 'Ketik NISN Anda...' : 'Ketik username Anda...'}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-emerald-200 block">
                  {role === 'Siswa' ? 'Sandi Keamanan / NIS (8 Digit)' : 'Sandi Keamanan'}
                </label>
                <span className="text-[10px] text-amber-300 font-serif italic">bismillah ...</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-emerald-950/60 border border-emerald-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder-emerald-600 focus:outline-none transition-all duration-200"
                  placeholder={role === 'Siswa' ? 'Ketik NIS Anda...' : 'Ketik password Anda...'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/50 border border-red-500/20 text-red-300 text-xs rounded-xl flex items-start gap-2 animate-shake">
                <ShieldAlert className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              id="btn-login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-[#D4AF37] hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-amber-500/10 cursor-pointer transition active:scale-[0.98] disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              <KeyRound className="h-4 w-4" />
              <span>{isSubmitting ? 'Memproses Masuk...' : `MASUK SEBAGAI ${role.toUpperCase()}`}</span>
            </button>

          </form>

        </div>
      </motion.div>
    </div>
  );
}
