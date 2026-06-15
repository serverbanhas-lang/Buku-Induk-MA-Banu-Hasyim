/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserRole } from '../types';
import { Shield, BookOpen, GraduationCap, CheckCircle2, Moon, Landmark } from 'lucide-react';

interface RoleHeaderProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  operatorName: string;
  onResetDatabase: () => void;
}

export default function RoleHeader({ currentRole, onChangeRole, operatorName, onResetDatabase }: RoleHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-xl border-b-4 border-[#D4AF37] relative overflow-hidden">
      {/* Decorative Islamic Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200 via-emerald-900 to-black bg-grid"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Calligraphy block */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-[#D4AF37] rounded-xl shadow-lg ring-2 ring-emerald-400">
              <Landmark className="h-8 w-8 text-emerald-900" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700">
                  MA BANU HASYIM
                </span>
                <span className="text-[11px] font-serif text-slate-300 italic">
                  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight font-sans text-white flex items-center">
                SIBIMA 
                <span className="text-amber-400 ml-1 font-light text-lg">Digital</span>
              </h1>
              <p className="text-xs text-emerald-100 font-light italic">
                "Tertib Administrasi, Mudah Akses, Siap Cetak Buku Induk Digital"
              </p>
            </div>
          </div>

          {/* Configuration & Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* User role configuration switcher */}
            <div className="bg-emerald-950/80 p-1.5 rounded-xl border border-emerald-700/60 flex items-center shadow-inner">
              <span className="text-xs text-amber-300 px-3 font-mono font-medium hidden sm:inline">Hak Akses:</span>
              <div className="flex bg-emerald-900/60 rounded-lg p-0.5 border border-emerald-800">
                {(currentRole === 'Operator'
                  ? (['Operator', 'Wali Kelas', 'Kepala Madrasah', 'Siswa'] as UserRole[])
                  : ([currentRole] as UserRole[])
                ).map((role) => {
                  const isActive = currentRole === role;
                  return (
                    <button
                      id={`btn-role-${role.replace(/\s+/g, '-').toLowerCase()}`}
                      key={role}
                      onClick={() => onChangeRole(role)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 font-bold shadow shadow-amber-500/20'
                          : 'text-slate-300 hover:text-white hover:bg-emerald-850/50'
                      }`}
                    >
                      {role === 'Operator' && 'Operator'}
                      {role === 'Wali Kelas' && 'Walas'}
                      {role === 'Kepala Madrasah' && 'Kamad'}
                      {role === 'Siswa' && 'Siswa'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* active role badge */}
            <div className="flex items-center space-x-2 bg-emerald-950/50 px-3 py-2 rounded-xl border border-emerald-700/40">
              <Shield className="h-4 w-4 text-amber-400 animate-pulse" />
              <div className="text-left text-xs">
                <p className="text-[10px] text-slate-400 leading-none">Pengguna Aktif</p>
                <p className="font-semibold text-emerald-100 max-w-[120px] truncate leading-tight">
                  {operatorName}
                </p>
              </div>
            </div>

            {/* Reset Button for easy demo refresh */}
            <button
              id="btn-reset-db"
              onClick={onResetDatabase}
              title="Reset data ke bawaan awal"
              className="px-2.5 py-2 hover:bg-red-900/40 hover:text-red-300 text-slate-400 rounded-xl transition duration-200 border border-transparent hover:border-red-800/30 text-xs flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              Reset Data
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
