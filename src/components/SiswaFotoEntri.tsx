/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Siswa, Kelas, UserRole } from '../types';
import { Search, Upload, Image, Check, AlertCircle, RefreshCw, Filter, Camera, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SiswaFotoEntriProps {
  siswa: Siswa[];
  kelas: Kelas[];
  currentRole: UserRole;
  onUpdateSiswaPhoto: (idSiswa: string, base64Photo: string) => void;
}

export default function SiswaFotoEntri({ 
  siswa, 
  kelas, 
  currentRole, 
  onUpdateSiswaPhoto 
}: SiswaFotoEntriProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKelas, setSelectedKelas] = useState<string>('ALL');
  const [dragActiveId, setDragActiveId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const targetWaliKelasId = 'kls-ximipa'; // Default class assigned to simulated Wali Kelas
  const isWaliKelas = currentRole === 'Wali Kelas';

  // Filter students based on search query, selected class, and role limits
  const filteredSiswa = siswa.filter(s => {
    const matchesSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.nis.includes(searchTerm) || 
                          s.nisn.includes(searchTerm);
    const matchesKelas = selectedKelas === 'ALL' || s.id_kelas === selectedKelas;
    
    // Wali kelas is allowed to view, but we label who they can write/upload to
    return matchesSearch && matchesKelas;
  });

  const getClassName = (idKelas: string) => {
    const found = kelas.find(k => k.id_kelas === idKelas);
    return found ? found.nama_kelas : idKelas;
  };

  const notifySuccess = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  const handleFileChange = (idSiswa: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processPhotoFile(idSiswa, file);
    }
  };

  const processPhotoFile = (idSiswa: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Format berkas salah! Silakan unggah berkas gambar (JPG, PNG, JPEG).');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert('Terlalu besar! Batas ukuran pasfoto siswa maksimal adalah 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onUpdateSiswaPhoto(idSiswa, base64String);
      
      const foundSiswa = siswa.find(s => s.id_siswa === idSiswa);
      notifySuccess(`Foto siswa ${foundSiswa?.nama || ''} berhasil diperbarui!`);
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop implementation
  const handleDragOver = (idSiswa: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveId(idSiswa);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveId(null);
  };

  const handleDrop = (idSiswa: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveId(null);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processPhotoFile(idSiswa, file);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 space-y-6 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Camera className="h-5 w-5 text-emerald-700" />
            <span>Portal Entri & Pasfoto Siswa Digital</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Modul cepat unggah, ganti, dan sesuaikan pasfoto 3x4 Buku Induk Siswa. Seret berkas gambar atau klik tombol unggah.
          </p>
        </div>
        
        {isWaliKelas && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 text-[11px] text-amber-800 leading-tight md:max-w-xs shrink-0">
            <span className="font-bold block">💡 Perhatian Wali Kelas:</span>
            Anda memiliki hak entri foto untuk siswa kelas bimbingan Anda (<strong>XI - MIPA 1</strong>).
          </div>
        )}
      </div>

      {/* Success banner notifications */}
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

      {/* Search and class selection filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
        
        {/* Search */}
        <div className="md:col-span-8 relative">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Cari Nama / NIS / NISN</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ketik kata kunci pencarian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-xs rounded-lg border border-slate-200 pl-8 pr-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition"
            />
            <Search className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Filter Kelas */}
        <div className="md:col-span-4">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Filter Kelas</label>
          <select
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

      </div>

      {/* Grid of Student Cards with custom upload containers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredSiswa.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-25/50 rounded-2xl border border-dashed border-slate-200">
            <AlertCircle className="h-8 w-8 text-slate-350 mx-auto mb-2" />
            <p className="text-slate-500 font-semibold text-xs">Siswa tidak ditemukan</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Sesuaikan filter pencarian atau kelas aktif Anda.</p>
          </div>
        ) : (
          filteredSiswa.map((student) => {
            const isMyClassSiswa = student.id_kelas === targetWaliKelasId;
            const canUploadThis = currentRole === 'Operator' || (isWaliKelas && isMyClassSiswa);
            const isDragActive = dragActiveId === student.id_siswa;

            return (
              <div 
                key={student.id_siswa}
                className={`bg-white border rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 ${
                  isDragActive 
                    ? 'border-amber-400 bg-amber-50/20 scale-[1.02] shadow-md shadow-amber-500/5' 
                    : 'border-slate-150 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-100'
                }`}
              >
                {/* Siswa quick details header */}
                <div className="flex items-start gap-3">
                  <div className="relative">
                    {student.foto ? (
                      <img 
                        src={student.foto} 
                        alt={student.nama} 
                        className="h-16 w-12 object-cover rounded-lg shadow-sm border border-slate-100"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-16 w-12 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg flex flex-col items-center justify-center">
                        <Image className="h-5 w-5 text-emerald-400" />
                        <span className="text-[8px] font-bold uppercase mt-0.5 text-slate-400">KOSONG</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-0.5 overflow-hidden">
                    <p className="font-extrabold text-slate-800 truncate text-xs leading-normal" title={student.nama}>
                      {student.nama}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">{getClassName(student.id_kelas)}</p>
                    <p className="text-[9px] text-slate-400 font-mono">NIS: {student.nis} / NISN: {student.nisn}</p>
                    
                    <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-1 ${
                      student.foto 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-650'
                    }`}>
                      {student.foto ? '✅ Foto Tersedia' : '❌ Belum Ada Foto'}
                    </span>
                  </div>
                </div>

                {/* File Drop & Action section */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  {canUploadThis ? (
                    <div 
                      onDragOver={(e) => handleDragOver(student.id_siswa, e)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(student.id_siswa, e)}
                      onClick={() => fileInputRefs.current[student.id_siswa]?.click()}
                      className={`border border-dashed rounded-xl p-2.5 text-center cursor-pointer transition-all ${
                        isDragActive 
                          ? 'border-amber-400 bg-amber-50/50 text-amber-900' 
                          : 'border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/10 hover:text-emerald-950'
                      }`}
                    >
                      <Upload className={`h-4 w-4 mx-auto mb-1 ${isDragActive ? 'text-amber-500 animate-bounce' : 'text-slate-400'}`} />
                      <p className="text-[10px] font-bold text-slate-600 block">
                        {isDragActive ? 'Lepaskan Berkas!' : 'Klik atau Seret Pasfoto'}
                      </p>
                      <p className="text-[8.5px] text-slate-400">Format portrait, maks. 2MB</p>
                      
                      <input 
                        type="file"
                        accept="image/*"
                        ref={(el) => { fileInputRefs.current[student.id_siswa] = el; }}
                        onChange={(e) => handleFileChange(student.id_siswa, e)}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-center text-slate-400">
                      <p className="text-[9.5px] font-bold">Akses Unggah Terkunci</p>
                      <p className="text-[8.5px] leading-tight mt-0.5">Wali kelas hanya dapat mengedit foto siswa di kelas bimbingannya.</p>
                    </div>
                  )}

                  {/* Clean reset photo action */}
                  {student.foto && canUploadThis && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Hapus foto profil siswa "${student.nama}"?`)) {
                          onUpdateSiswaPhoto(student.id_siswa, '');
                          notifySuccess(`Foto profil siswa ${student.nama} berhasil dihapus.`);
                        }
                      }}
                      className="w-full py-1 text-[9.5px] text-red-600 hover:bg-red-50 font-bold rounded-lg border border-red-100 transition flex items-center justify-center gap-1"
                    >
                      <Trash className="h-3 w-3" />
                      <span>Hapus Pasfoto Siswa</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
