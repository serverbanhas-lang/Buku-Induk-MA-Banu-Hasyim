/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Siswa, Kelas, UserRole } from '../types';
import { Search, UserPlus, Filter, ShieldAlert, FileText, Delete, Trash2, Eye, Edit3, AlertCircle } from 'lucide-react';

interface SiswaListProps {
  siswa: Siswa[];
  kelas: Kelas[];
  currentRole: UserRole;
  onSelectSiswa: (id: string, viewMode: 'detail' | 'edit') => void;
  onDeleteSiswa: (id: string) => void;
  onAddSiswa: () => void;
}

export default function SiswaList({ siswa, kelas, currentRole, onSelectSiswa, onDeleteSiswa, onAddSiswa }: SiswaListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJurusan, setSelectedJurusan] = useState<string>('ALL');
  const [selectedKelas, setSelectedKelas] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Role filters:
  // Wali Kelas (Ustadzah Aminah, S.Si.) edits XI - MIPA 1 (kls-ximipa)
  const isWaliKelas = currentRole === 'Wali Kelas';
  const targetWaliKelasId = 'kls-ximipa'; // Default class assigned to simulated teacher

  // Dynamic filter lists
  const filteredSiswa = siswa.filter(s => {
    // Search
    const matchesSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.nis.includes(searchTerm) ||
                          s.nisn.includes(searchTerm);
    // Jurusan
    const matchesJurusan = selectedJurusan === 'ALL' || s.jurusan === selectedJurusan;
    
    // Kelas
    const matchesKelas = selectedKelas === 'ALL' || s.id_kelas === selectedKelas;
    
    // Status Data Completeness
    const isComplete = s.nis && s.nisn && s.nik && s.foto && s.nama_ayah && s.nama_ibu && s.alamat_lengkap;
    const matchesStatus = selectedStatus === 'ALL' || 
                          (selectedStatus === 'LENGKAP' && isComplete) ||
                          (selectedStatus === 'BELUM_LENGKAP' && !isComplete);

    // Wali kelas privilege restriction (can view any, but prioritizes their class, or let's allow them to see all but restrict editing to their specific class)
    return matchesSearch && matchesJurusan && matchesKelas && matchesStatus;
  });

  const getSiswaClassLabel = (idKelasStr: string) => {
    const kls = kelas.find(k => k.id_kelas === idKelasStr);
    return kls ? kls.nama_kelas : idKelasStr;
  };

  const isProfileComplete = (s: Siswa) => {
    return !!(s.nis && s.nisn && s.nik && s.foto && s.nama_ayah && s.nama_ibu && s.alamat_lengkap);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 space-y-6">
      
      {/* List Header controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Daftar Induk Siswa</h2>
          <p className="text-xs text-slate-500">
            Kelola data biodata, riwayat madrasah, dan kelengkapan administrasi siswa aktif dan calon wisudawan.
          </p>
        </div>
        
        {/* Only Operator can add new students from scratch */}
        {currentRole === 'Operator' && (
          <button
            id="btn-add-siswa"
            onClick={onAddSiswa}
            className="flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>Tambah Siswa Manual</span>
          </button>
        )}
      </div>

      {/* Advanced Filter Widgets bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100/85">
        
        {/* Search */}
        <div className="relative">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Cari Siswa</label>
          <div className="relative">
            <input
              id="input-search-siswa"
              type="text"
              placeholder="Nama, NIS, atau NISN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-xs rounded-lg border border-slate-200 pl-8 pr-3 py-2 outline-none focus:border-emerald-500 font-sans focus:ring-1 focus:ring-emerald-200 transition"
            />
            <Search className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Filter Kelas */}
        <div>
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Kelas Aktif</label>
          <select
            id="select-filter-kelas"
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition cursor-pointer"
          >
            <option value="ALL">Semua Kelas</option>
            {kelas.map((k) => (
              <option key={k.id_kelas} value={k.id_kelas}>{k.nama_kelas}</option>
            ))}
          </select>
        </div>

        {/* Filter Jurusan */}
        <div>
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Jurusan</label>
          <select
            id="select-filter-jurusan"
            value={selectedJurusan}
            onChange={(e) => setSelectedJurusan(e.target.value)}
            className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition cursor-pointer"
          >
            <option value="ALL">Semua Jurusan</option>
            <option value="MIPA">MIPA (Sains)</option>
            <option value="IPS">IPS (Sosial)</option>
            <option value="Keagamaan">Keagamaan (Agama)</option>
          </select>
        </div>

        {/* Status Data completeness */}
        <div>
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Status Profil</label>
          <select
            id="select-filter-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="LENGKAP">Profil Lengkap</option>
            <option value="BELUM_LENGKAP">Butuh Pelengkapan</option>
          </select>
        </div>

      </div>

      {/* Main Student Responsive Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="min-w-full divide-y divide-slate-100 text-left">
          <thead className="bg-slate-55/70 font-mono text-[10.5px] uppercase tracking-wider text-slate-600 border-b border-slate-100">
            <tr>
              <th scope="col" className="px-5 py-3.5">Siswa</th>
              <th scope="col" className="px-3 py-3.5">NIS/NISN</th>
              <th scope="col" className="px-3 py-3.5">L/P</th>
              <th scope="col" className="px-3 py-3.5">Kelas & Jurusan</th>
              <th scope="col" className="px-3 py-3.5">Status Profil</th>
              <th scope="col" className="px-5 py-3.5 text-center">Aksi Buku Induk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white text-xs text-slate-700">
            {filteredSiswa.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <ShieldAlert className="h-8 w-8 text-slate-300" id="icon-warning-search" />
                    <p className="font-semibold text-slate-500 text-sm">Tidak Ada Data Siswa Ditemukan</p>
                    <p className="text-[11px] text-slate-400 max-w-sm">
                      Sesuaikan kata kunci pencarian atau filter kelas/jurusan Anda atau import data kembali.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSiswa.map((student) => {
                const complete = isProfileComplete(student);
                const isMyClass = student.id_kelas === targetWaliKelasId;
                
                // Wali Kelas can see all, but only edit students belonging to their own class.
                // Operator can edit everyone. Kepala Madrasah reads/prints everyone.
                const canEditThisStudent = currentRole === 'Operator' || (isWaliKelas && isMyClass);

                return (
                  <tr 
                    id={`siswa-row-${student.id_siswa}`}
                    key={student.id_siswa} 
                    className="hover:bg-emerald-50/10 transition-colors"
                  >
                    
                    {/* Student Info block */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-55 border border-emerald-100 overflow-hidden shrink-0 shadow-sm relative group">
                          {student.foto ? (
                            <img 
                              src={student.foto} 
                              alt={student.nama} 
                              className="h-full w-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="h-full w-full bg-emerald-700 text-white flex items-center justify-center font-bold font-sans text-sm">
                              {student.nama.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-tight block hover:text-emerald-850 transition">
                            {student.nama}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono tracking-tight mt-0.5">NIK: {student.nik || 'Belum diisi'}</p>
                        </div>
                      </div>
                    </td>

                    {/* NIS & NISN block */}
                    <td className="px-3 py-4 whitespace-nowrap font-mono">
                      <p className="text-slate-700 font-medium">NIS: {student.nis}</p>
                      <p className="text-[10px] text-slate-400">NISN: {student.nisn}</p>
                    </td>

                    {/* Gender badge */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-bold font-sans ${
                        student.jk === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                      }`}>
                        {student.jk === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </td>

                    {/* Class badge */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <p className="font-bold text-slate-800 font-sans">{getSiswaClassLabel(student.id_kelas)}</p>
                      <span className={`inline-block text-[9.5px] font-mono px-1.5 py-0.1 rounded uppercase ${
                        student.jurusan === 'MIPA' ? 'bg-emerald-55 text-emerald-850 font-semibold' :
                        student.jurusan === 'IPS' ? 'bg-amber-55 text-amber-850 font-semibold' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {student.jurusan === 'MIPA' ? 'Sains / MIPA' : student.jurusan === 'IPS' ? 'Sosial / IPS' : 'Islamic Rel'}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <span className={`h-2 w-2 rounded-full ${complete ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                        <span className={`font-medium ${complete ? 'text-green-700' : 'text-rose-600 font-semibold'}`}>
                          {complete ? 'Lengkap' : 'Butuh Pelengkapan'}
                        </span>
                      </div>
                    </td>

                    {/* Quick Access Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        
                        {/* Interactive Buku Induk Viewer */}
                        <button
                          id={`btn-view-induk-${student.id_siswa}`}
                          onClick={() => onSelectSiswa(student.id_siswa, 'detail')}
                          title="Buka Buku Induk Digital"
                          className="flex items-center space-x-1 py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-850 font-bold text-[11px] rounded-lg transition border border-emerald-100"
                        >
                          <FileText className="h-3.5 w-3.5 text-emerald-700" />
                          <span>Buku Induk</span>
                        </button>

                        {/* Interactive Edit and Grade details */}
                        <button
                          id={`btn-edit-student-${student.id_siswa}`}
                          onClick={() => {
                            if (canEditThisStudent) {
                              onSelectSiswa(student.id_siswa, 'edit');
                            } else {
                              alert(`Maaf, Ustadz/Ustadzah. Berdasarkan Hak Akses Anda sebagai Wali Kelas, Anda hanya dapat mengedit dan menginput nilai siswa untuk kelas Anda sendiri (XI-MIPA 1).`);
                            }
                          }}
                          title={canEditThisStudent ? "Edit Biodata & Rapor Siswa" : "Hanya untuk Operator / Wali Kelas terkait"}
                          className={`flex items-center space-x-1 py-1.5 px-2.5 rounded-lg border text-[11px] transition ${
                            canEditThisStudent 
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-100 font-bold' 
                              : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed opacity-60'
                          }`}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Delete Student profile */}
                        {currentRole === 'Operator' && (
                          <button
                            id={`btn-delete-student-${student.id_siswa}`}
                            onClick={() => {
                              if (window.confirm(`Apakah Anda yakin ingin menghapus siswa "${student.nama}" dari database Buku Induk Digital? Langkah ini tidak dapat dibatalkan.`)) {
                                onDeleteSiswa(student.id_siswa);
                              }
                            }}
                            title="Hapus dari Database"
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary count panel metadata */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono gap-2">
        <span className="flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>Wali Kelas XI-MIPA 1 memiliki hak edit terbatas pada kelasnya. Operator mengontrol penuh.</span>
        </span>
        <p>Menampilkan <span className="font-bold text-slate-600">{filteredSiswa.length}</span> dari <span className="font-bold text-slate-600">{siswa.length}</span> record madrasah</p>
      </div>

    </div>
  );
}
