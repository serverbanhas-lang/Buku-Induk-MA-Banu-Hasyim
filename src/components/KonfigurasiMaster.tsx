/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Kelas, JurusanType } from '../types';
import { Plus, Edit2, Trash2, BookOpen, Layers, Calendar, Check, AlertCircle, RotateCcw, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Define master interfaces that extending standard models
export interface AcademicYear {
  id_tapel: string;
  tahun: string;      // e.g. "2025/2026"
  semester: 'Ganjil' | 'Genap';
  aktif: boolean;
}

export interface MasterJurusan {
  id_jurusan: string;
  nama: string;
  kode: string; // MIPA, IPS, DLL
  keterangan: string;
}

interface KonfigurasiMasterProps {
  kelasList: Kelas[];
  jurusanList: MasterJurusan[];
  tapelList: AcademicYear[];
  currentRole: string;
  onUpdateMaster: (data: {
    kelas?: Kelas[];
    jurusan?: MasterJurusan[];
    tapel?: AcademicYear[];
    logMessage: string;
  }) => void;
  mapelMipa: string[];
  mapelIps: string[];
  mapelKeagamaan: string[];
  mapelUmum: string[];
  mapelIjazah: string[];
  onUpdateMapel: (major: 'MIPA' | 'IPS' | 'Keagamaan' | 'Umum' | 'Ijazah', list: string[]) => void;
}

export default function KonfigurasiMaster({
  kelasList,
  jurusanList,
  tapelList,
  currentRole,
  onUpdateMaster,
  mapelMipa,
  mapelIps,
  mapelKeagamaan,
  mapelUmum,
  mapelIjazah,
  onUpdateMapel,
}: KonfigurasiMasterProps) {
  const [activeSubTab, setActiveSubTab] = useState<'kelas' | 'jurusan' | 'tapel' | 'mapel'>('kelas');

  // Inner form states
  const [errorInput, setErrorInput] = useState<string | null>(null);

  // Mapel Tab fields & states
  const [activeMapelMajor, setActiveMapelMajor] = useState<'MIPA' | 'IPS' | 'Keagamaan' | 'Umum' | 'Ijazah'>('MIPA');
  const [inputMapelName, setInputMapelName] = useState('');
  const [editingMapelIndex, setEditingMapelIndex] = useState<number | null>(null);
  const [editMapelValue, setEditMapelValue] = useState('');

  // Classroom fields
  const [namaKelas, setNamaKelas] = useState('');
  const [jurusanKelas, setJurusanKelas] = useState<JurusanType>('MIPA');
  const [waliKelas, setWaliKelas] = useState('');
  const [editingKelasId, setEditingKelasId] = useState<string | null>(null);

  // Jurusan fields
  const [namaJurusan, setNamaJurusan] = useState('');
  const [kodeJurusan, setKodeJurusan] = useState('');
  const [ketJurusan, setKetJurusan] = useState('');
  const [editingJurusanId, setEditingJurusanId] = useState<string | null>(null);

  // Tahun Pelajaran fields
  const [tapelTahun, setTapelTahun] = useState('2026/2027');
  const [tapelSemester, setTapelSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [tapelAktif, setTapelAktif] = useState(false);
  const [editingTapelId, setEditingTapelId] = useState<string | null>(null);

  // Submitting classrooms
  const handleSaveKelas = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole !== 'Operator') {
      alert('Hanya Operator Madrasah yang memiliki izin untuk mengubah master data.');
      return;
    }
    if (!namaKelas.trim() || !waliKelas.trim()) {
      setErrorInput('Nama Kelas dan Wali Kelas tidak boleh kosong.');
      return;
    }

    let updatedKelas = [...kelasList];
    if (editingKelasId) {
      updatedKelas = updatedKelas.map((k) =>
        k.id_kelas === editingKelasId
          ? { ...k, nama_kelas: namaKelas, jurusan: jurusanKelas, wali_kelas: waliKelas }
          : k
      );
      onUpdateMaster({
        kelas: updatedKelas,
        logMessage: `Memperbaharui master kelas: ${namaKelas} (Wali: ${waliKelas})`,
      });
      setEditingKelasId(null);
    } else {
      const newId = `kls-${namaKelas.toLowerCase().replace(/\s+/g, '')}`;
      if (kelasList.some((k) => k.id_kelas === newId)) {
        setErrorInput('ID atau Nama Kelas ini sudah digunakan.');
        return;
      }
      updatedKelas.push({
        id_kelas: newId,
        nama_kelas: namaKelas,
        jurusan: jurusanKelas,
        wali_kelas: waliKelas,
      });
      onUpdateMaster({
        kelas: updatedKelas,
        logMessage: `Menambahkan master kelas baru: ${namaKelas}`,
      });
    }

    setNamaKelas('');
    setWaliKelas('');
    setErrorInput(null);
  };

  const handleDeleteKelas = (id: string, name: string) => {
    if (currentRole !== 'Operator') {
      alert('Izin ditolak. Hanya Operator Madrasah.');
      return;
    }
    if (window.confirm(`Hapus master kelas ${name}? Siswa di kelas ini harus dipindahkan nanti.`)) {
      const updated = kelasList.filter((k) => k.id_kelas !== id);
      onUpdateMaster({
        kelas: updated,
        logMessage: `Menghapus master kelas: ${name}`,
      });
    }
  };

  // Submitting Jurusan
  const handleSaveJurusan = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole !== 'Operator') {
      alert('Hanya Operator yang memiliki akses.');
      return;
    }
    if (!namaJurusan.trim() || !kodeJurusan.trim()) {
      setErrorInput('Nama Jurusan dan Singkatan/Kode tidak boleh kosong.');
      return;
    }

    let updatedJurusan = [...jurusanList];
    if (editingJurusanId) {
      updatedJurusan = updatedJurusan.map((j) =>
        j.id_jurusan === editingJurusanId
          ? { ...j, nama: namaJurusan, kode: kodeJurusan, keterangan: ketJurusan }
          : j
      );
      onUpdateMaster({
        jurusan: updatedJurusan,
        logMessage: `Memperbaharui master jurusan: ${namaJurusan} (${kodeJurusan})`,
      });
      setEditingJurusanId(null);
    } else {
      const newId = `jur-${kodeJurusan.toLowerCase()}`;
      if (jurusanList.some((j) => j.id_jurusan === newId)) {
        setErrorInput('Kode Jurusan ini sudah terdaftar.');
        return;
      }
      updatedJurusan.push({
        id_jurusan: newId,
        nama: namaJurusan,
        kode: kodeJurusan,
        keterangan: ketJurusan,
      });
      onUpdateMaster({
        jurusan: updatedJurusan,
        logMessage: `Menambahkan master jurusan baru: ${namaJurusan} (${kodeJurusan})`,
      });
    }

    setNamaJurusan('');
    setKodeJurusan('');
    setKetJurusan('');
    setErrorInput(null);
  };

  const handleDeleteJurusan = (id: string, name: string) => {
    if (currentRole !== 'Operator') {
      alert('Hanya Operator yang memiliki akses.');
      return;
    }
    if (window.confirm(`Hapus master jurusan ${name}?`)) {
      const updated = jurusanList.filter((j) => j.id_jurusan !== id);
      onUpdateMaster({
        jurusan: updated,
        logMessage: `Menghapus master jurusan: ${name}`,
      });
    }
  };

  // Submitting Tahun Pelajaran
  const handleSaveTapel = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole !== 'Operator') {
      alert('Hanya Operator yang memiliki akses.');
      return;
    }
    if (!tapelTahun.trim()) {
      setErrorInput('Tahun Pelajaran (Format: YYYY/YYYY) tidak boleh kosong.');
      return;
    }

    let updatedTapel = [...tapelList];
    
    // If setting this tapel to ACTIVE, we must turn off active status for others
    if (tapelAktif) {
      updatedTapel = updatedTapel.map((t) => ({ ...t, aktif: false }));
    }

    if (editingTapelId) {
      updatedTapel = updatedTapel.map((t) =>
        t.id_tapel === editingTapelId
          ? { ...t, tahun: tapelTahun, semester: tapelSemester, aktif: tapelAktif }
          : t
      );
      onUpdateMaster({
        tapel: updatedTapel,
        logMessage: `Memperbaharui tahun pelajaran: ${tapelTahun} - ${tapelSemester}`,
      });
      setEditingTapelId(null);
    } else {
      const newId = `tapel-${tapelTahun.replace('/', '')}-${tapelSemester.toLowerCase()}`;
      if (tapelList.some((t) => t.id_tapel === newId)) {
        setErrorInput('Tahun Pelajaran & Semester ini sudah terdaftar.');
        return;
      }
      updatedTapel.push({
        id_tapel: newId,
        tahun: tapelTahun,
        semester: tapelSemester,
        aktif: tapelAktif,
      });
      onUpdateMaster({
        tapel: updatedTapel,
        logMessage: `Menambahkan tahun pelajaran baru: ${tapelTahun} - ${tapelSemester}`,
      });
    }

    setTapelTahun('2026/2027');
    setTapelSemester('Ganjil');
    setTapelAktif(false);
    setErrorInput(null);
  };

  const handleDeleteTapel = (id: string, label: string) => {
    if (currentRole !== 'Operator') {
      alert('Hanya Operator yang memiliki akses.');
      return;
    }
    if (window.confirm(`Hapus tahun pelajaran ${label}?`)) {
      const updated = tapelList.filter((t) => t.id_tapel !== id);
      onUpdateMaster({
        tapel: updated,
        logMessage: `Menghapus tahun pelajaran: ${label}`,
      });
    }
  };

  const handleSetActiveTapel = (id: string) => {
    if (currentRole !== 'Operator') {
      alert('Hanya Operator yang memiliki akses.');
      return;
    }
    const updated = tapelList.map((t) => ({
      ...t,
      aktif: t.id_tapel === id,
    }));
    const targetTapel = tapelList.find((t) => t.id_tapel === id);
    onUpdateMaster({
      tapel: updated,
      logMessage: `Mengubah Tahun Pelajaran Aktif menjadi: ${targetTapel?.tahun} (${targetTapel?.semester})`,
    });
  };

  // Mapel Tab CRUD handlers
  const handleAddMapel = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole !== 'Operator') {
      alert('Hanya Operator Madrasah yang memiliki izin para meluruskan master Mapel.');
      return;
    }
    const trimmed = inputMapelName.trim();
    if (!trimmed) {
      setErrorInput('Nama mata pelajaran tidak boleh kosong.');
      return;
    }

    let currentList: string[] = [];
    if (activeMapelMajor === 'MIPA') currentList = [...mapelMipa];
    else if (activeMapelMajor === 'IPS') currentList = [...mapelIps];
    else if (activeMapelMajor === 'Keagamaan') currentList = [...mapelKeagamaan];
    else if (activeMapelMajor === 'Umum') currentList = [...mapelUmum];
    else currentList = [...mapelIjazah];

    if (currentList.some(m => m.toLowerCase() === trimmed.toLowerCase())) {
      setErrorInput('Mata pelajaran ini sudah terdaftar dalam kategori ini.');
      return;
    }

    const updated = [...currentList, trimmed];
    onUpdateMapel(activeMapelMajor, updated);
    setInputMapelName('');
    setErrorInput(null);
  };

  const handleDeleteMapel = (index: number) => {
    if (currentRole !== 'Operator') {
      alert('Izin ditolak. Hanya Operator Madrasah.');
      return;
    }
    let currentList: string[] = [];
    if (activeMapelMajor === 'MIPA') currentList = [...mapelMipa];
    else if (activeMapelMajor === 'IPS') currentList = [...mapelIps];
    else if (activeMapelMajor === 'Keagamaan') currentList = [...mapelKeagamaan];
    else if (activeMapelMajor === 'Umum') currentList = [...mapelUmum];
    else currentList = [...mapelIjazah];

    const targetMapel = currentList[index];
    if (window.confirm(`Hapus mata pelajaran "${targetMapel}" dari kategori ${activeMapelMajor}?`)) {
      const updated = currentList.filter((_, i) => i !== index);
      onUpdateMapel(activeMapelMajor, updated);
      setErrorInput(null);
    }
  };

  const handleSaveEditMapel = (index: number) => {
    if (currentRole !== 'Operator') return;
    const trimmed = editMapelValue.trim();
    if (!trimmed) {
      alert('Nama mata pelajaran tidak boleh kosong.');
      return;
    }
    let currentList: string[] = [];
    if (activeMapelMajor === 'MIPA') currentList = [...mapelMipa];
    else if (activeMapelMajor === 'IPS') currentList = [...mapelIps];
    else if (activeMapelMajor === 'Keagamaan') currentList = [...mapelKeagamaan];
    else if (activeMapelMajor === 'Umum') currentList = [...mapelUmum];
    else currentList = [...mapelIjazah];

    currentList[index] = trimmed;
    onUpdateMapel(activeMapelMajor, currentList);
    setEditingMapelIndex(null);
    setEditMapelValue('');
  };

  const handleResetMapelToDefault = () => {
    if (currentRole !== 'Operator') return;
    if (window.confirm(`Mengatur ulang daftar mapel untuk kategori ${activeMapelMajor} kembali ke setelan standar kurikulum madrasah?`)) {
      let defaults: string[] = [];
      if (activeMapelMajor === 'MIPA') {
        defaults = [
          "Al-Qur'an Hadis",
          "Aqidah Akhlak",
          "Fikih",
          "Sejarah Kebudayaan Islam (SKI)",
          "Bahasa Arab",
          "PPKN",
          "Bahasa Indonesia",
          "Matematika",
          "Bahasa Inggris",
          "Fisika",
          "Kimia",
          "Biologi",
          "PJOK"
        ];
      } else if (activeMapelMajor === 'IPS') {
        defaults = [
          "Al-Qur'an Hadis",
          "Aqidah Akhlak",
          "Fikih",
          "Sejarah Kebudayaan Islam (SKI)",
          "Bahasa Arab",
          "PPKN",
          "Bahasa Indonesia",
          "Matematika",
          "Bahasa Inggris",
          "Geografi",
          "Sejarah Peminatan",
          "Sosiologi",
          "Ekonomi"
        ];
      } else if (activeMapelMajor === 'Keagamaan') {
        defaults = [
          "Al-Qur'an Hadis",
          "Aqidah Akhlak",
          "Fikih",
          "Sejarah Kebudayaan Islam (SKI)",
          "Bahasa Arab",
          "PPKN",
          "Bahasa Indonesia",
          "Matematika",
          "Bahasa Inggris",
          "Tafsir-Ilmu Tafsir",
          "Hadis-Ilmu Hadis",
          "Ushul Fikih",
          "Akhlak Tasawuf"
        ];
      } else if (activeMapelMajor === 'Umum') {
        defaults = [
          "Al-Qur'an Hadis",
          "Aqidah Akhlak",
          "Fikih",
          "Sejarah Kebudayaan Islam (SKI)",
          "Bahasa Arab",
          "PPKN",
          "Bahasa Indonesia",
          "Matematika",
          "Bahasa Inggris",
          "Fisika",
          "Kimia",
          "Biologi",
          "Geografi",
          "Sosiologi",
          "Ekonomi",
          "Seni Budaya",
          "Informatika",
          "PJOK"
        ];
      } else if (activeMapelMajor === 'Ijazah') {
        defaults = [
          "Al-Qur'an Hadis",
          "Aqidah Akhlak",
          "Fikih",
          "Sejarah Kebudayaan Islam (SKI)",
          "Bahasa Arab",
          "PPKN",
          "Bahasa Indonesia",
          "Matematika",
          "Bahasa Inggris",
          "Mapel Pilihan"
        ];
      }
      onUpdateMapel(activeMapelMajor, defaults);
      setErrorInput(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
      
      {/* Title Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-900 to-emerald-850 text-white border-b border-[#D4AF37]/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <Layers className="h-5 w-5 text-amber-400" />
            <span>Entri & Edit Master Madrasah</span>
          </h2>
          <p className="text-xs text-emerald-100">
            Kelola data dasar kelas, jurusan peminatan, serta kalender akademik tahun pelajaran
          </p>
        </div>
        <span className="text-[10px] font-mono bg-emerald-950 px-2 py-1 rounded text-amber-300 font-bold border border-emerald-800">
          MODE MASTER ADMIN
        </span>
      </div>

      {/* Role Alert warning */}
      {currentRole !== 'Operator' && (
        <div className="p-4 bg-amber-50 border-b border-amber-200 text-amber-850 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>
            <strong>Hak Akses Terbatas:</strong> Anda saat ini login sebagai <strong>{currentRole}</strong>. 
            Melihat master diperbolehkan, tetapi hanya <strong>Operator Madrasah</strong> yang diizinkan untuk membuat, mengedit, atau menghapus master data ini.
          </span>
        </div>
      )}

      {/* Sub-tab selection menu */}
      <div className="flex bg-slate-50 border-b border-slate-100 p-1 flex-wrap sm:flex-nowrap">
        {[
          { id: 'kelas', label: '1. Entri & Edit Kelas', icon: <BookOpen className="h-4 w-4" /> },
          { id: 'jurusan', label: '2. Entri & Edit Jurusan', icon: <Layers className="h-4 w-4" /> },
          { id: 'tapel', label: '3. Entri & Edit Tahun Pelajaran', icon: <Calendar className="h-4 w-4" /> },
          { id: 'mapel', label: '4. Entri & Edit Mapel', icon: <BookOpen className="h-4 w-4" /> },
        ].map((sub) => (
          <button
            key={sub.id}
            id={`subtab-${sub.id}`}
            onClick={() => {
              setActiveSubTab(sub.id as any);
              setErrorInput(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition border-b-2 cursor-pointer ${
              activeSubTab === sub.id
                ? 'border-emerald-700 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-slate-500 hover:text-emerald-700 hover:bg-slate-100/50'
            }`}
          >
            {sub.icon}
            <span>{sub.label}</span>
          </button>
        ))}
      </div>

      {/* Container Content */}
      <div className="p-6">
        
        {/* TAB 1: KELAS CONFIG */}
        {activeSubTab === 'kelas' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Input Form Column (35%) */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4 flex items-center gap-1.5">
                  <Plus className="h-4' w-4 text-emerald-700" />
                  <span>{editingKelasId ? 'Edit Master Kelas' : 'Tambah Kelas Baru'}</span>
                </h3>

                <form onSubmit={handleSaveKelas} className="space-y-3 text-xs">
                  
                  {/* Nama Kelas */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-650">Nama Kelas (contoh: X - MIPA 1)</label>
                    <input
                      id="input-kelas-nama"
                      type="text"
                      value={namaKelas}
                      onChange={(e) => setNamaKelas(e.target.value)}
                      placeholder="Masukkan nama kelas..."
                      disabled={currentRole !== 'Operator'}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none text-xs"
                    />
                  </div>

                  {/* Jurusan */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-650">Jurusan Peminatan</label>
                    <select
                      id="input-kelas-jurusan"
                      value={jurusanKelas}
                      onChange={(e) => setJurusanKelas(e.target.value as JurusanType)}
                      disabled={currentRole !== 'Operator'}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none text-xs"
                    >
                      <option value="Umum">Umum (Umum / Kelas X)</option>
                      <option value="MIPA">MIPA (Matematika & Ilmu Pengetahuan Alam)</option>
                      <option value="IPS">IPS (Ilmu Pengetahuan Sosial)</option>
                      <option value="Keagamaan">Keagamaan (Agama Islam)</option>
                    </select>
                  </div>

                  {/* Wali Kelas */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-650">Nama Guru Wali Kelas & Gelar</label>
                    <input
                      id="input-kelas-wali"
                      type="text"
                      value={waliKelas}
                      onChange={(e) => setWaliKelas(e.target.value)}
                      placeholder="Nama Wali Kelas beserta gelar..."
                      disabled={currentRole !== 'Operator'}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none text-xs"
                    />
                  </div>

                  {errorInput && (
                    <p className="text-red-700 font-medium text-[11px] bg-red-50 p-2 rounded border border-red-200">
                      ⚠ {errorInput}
                    </p>
                  )}

                  {currentRole === 'Operator' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg cursor-pointer transition text-center text-xs"
                      >
                        {editingKelasId ? 'Simpan Pembaruan' : 'Tambahkan Kelas'}
                      </button>
                      {editingKelasId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingKelasId(null);
                            setNamaKelas('');
                            setWaliKelas('');
                            setErrorInput(null);
                          }}
                          className="py-2 px-3 bg-slate-200 text-slate-700 rounded-lg text-xs"
                        >
                          Batal
                        </button>
                      )}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* List Table Column (65%) */}
            <div className="md:col-span-7 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest pb-1 border-b border-slate-100 flex items-center justify-between">
                <span>Daftar Master Kelas Terdokumentasi</span>
                <span className="text-slate-400 font-mono text-[11px]">Total: {kelasList.length}</span>
              </h3>

              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Nama Kelas</th>
                      <th className="p-3">Jurusan</th>
                      <th className="p-3">Wali Kelas</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kelasList.map((k) => (
                      <tr key={k.id_kelas} className="border-b border-slate-150 hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-900">{k.nama_kelas}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            k.jurusan === 'MIPA' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                            k.jurusan === 'IPS' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
                            k.jurusan === 'Keagamaan' ? 'bg-blue-50 text-blue-800 border border-blue-100' :
                            'bg-purple-50 text-purple-800 border border-purple-100'
                          }`}>
                            {k.jurusan}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-slate-600">{k.wali_kelas}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingKelasId(k.id_kelas);
                                setNamaKelas(k.nama_kelas);
                                setJurusanKelas(k.jurusan);
                                setWaliKelas(k.wali_kelas);
                                setErrorInput(null);
                              }}
                              title="Edit master kelas"
                              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-emerald-700 transition"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteKelas(k.id_kelas, k.nama_kelas)}
                              title="Hapus master kelas"
                              className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-700 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: JURUSAN CONFIG */}
        {activeSubTab === 'jurusan' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Form Column (35%) */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4 flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-emerald-700" />
                  <span>{editingJurusanId ? 'Edit Master Jurusan' : 'Tambah Jurusan Baru'}</span>
                </h3>

                <form onSubmit={handleSaveJurusan} className="space-y-3 text-xs">
                  
                  {/* Singkatan / Kode */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-650">Singkatan / Kode Jurusan</label>
                    <input
                      id="input-jur-kode"
                      type="text"
                      value={kodeJurusan}
                      onChange={(e) => setKodeJurusan(e.target.value)}
                      placeholder="Contoh: MIPA, IPS, KEAGAMAAN"
                      disabled={currentRole !== 'Operator'}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 uppercase text-xs"
                    />
                  </div>

                  {/* Nama Jurusan */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-650">Nama Lengkap Jurusan</label>
                    <input
                      id="input-jur-nama"
                      type="text"
                      value={namaJurusan}
                      onChange={(e) => setNamaJurusan(e.target.value)}
                      placeholder="Masukkan nama lengkap peminatan..."
                      disabled={currentRole !== 'Operator'}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
                    />
                  </div>

                  {/* Keterangan */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-650">Deskripsi / Keterangan Singkat</label>
                    <textarea
                      id="input-jur-ket"
                      value={ketJurusan}
                      onChange={(e) => setKetJurusan(e.target.value)}
                      placeholder="Deskripsi penjurusan..."
                      disabled={currentRole !== 'Operator'}
                      rows={3}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs"
                    />
                  </div>

                  {errorInput && (
                    <p className="text-red-700 font-medium text-[11px] bg-red-50 p-2 rounded border border-red-200">
                      ⚠ {errorInput}
                    </p>
                  )}

                  {currentRole === 'Operator' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg cursor-pointer transition text-xs"
                      >
                        {editingJurusanId ? 'Simpan Jurusan' : 'Tambahkan Jurusan'}
                      </button>
                      {editingJurusanId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingJurusanId(null);
                            setNamaJurusan('');
                            setKodeJurusan('');
                            setKetJurusan('');
                            setErrorInput(null);
                          }}
                          className="py-2 px-3 bg-slate-200 text-slate-700 rounded-lg text-xs"
                        >
                          Batal
                        </button>
                      )}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Table Column (65%) */}
            <div className="md:col-span-7 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest pb-1 border-b border-slate-100 flex items-center justify-between">
                <span>Daftar Jurusan Master Madrasah</span>
                <span className="text-slate-400 font-mono text-[11px]">Total: {jurusanList.length}</span>
              </h3>

              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-28">Kode Jurusan</th>
                      <th className="p-3">Nama Lengkap</th>
                      <th className="p-3">Keterangan</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jurusanList.map((j) => (
                      <tr key={j.id_jurusan} className="border-b border-slate-150 hover:bg-slate-50/50">
                        <td className="p-3 font-extrabold text-emerald-800 font-mono tracking-wider">{j.kode}</td>
                        <td className="p-3 font-bold text-slate-900">{j.nama}</td>
                        <td className="p-3 text-slate-500 italic max-w-[150px] truncate">{j.keterangan || '-'}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingJurusanId(j.id_jurusan);
                                setNamaJurusan(j.nama);
                                setKodeJurusan(j.kode);
                                setKetJurusan(j.keterangan);
                                setErrorInput(null);
                              }}
                              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-emerald-700 transition"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteJurusan(j.id_jurusan, j.nama)}
                              className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-700 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: TAHUN PELAJARAN (TAPEL) CONFIG */}
        {activeSubTab === 'tapel' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Form Column (35%) */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4 flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-emerald-700" />
                  <span>{editingTapelId ? 'Edit Tahun Pelajaran' : 'Tambah Kalender Tapel'}</span>
                </h3>

                <form onSubmit={handleSaveTapel} className="space-y-3 text-xs">
                  
                  {/* Tahun Pelajaran */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-650">Tahun Pelajaran (Format: YYYY/YYYY)</label>
                    <input
                      id="input-tapel-tahun"
                      type="text"
                      value={tapelTahun}
                      onChange={(e) => setTapelTahun(e.target.value)}
                      placeholder="Contoh: 2025/2026"
                      disabled={currentRole !== 'Operator'}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs text-center font-mono font-bold"
                    />
                  </div>

                  {/* Semester */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-650">Semester</label>
                    <div className="flex gap-4 p-2 bg-white border border-slate-300 rounded-lg">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tapelSemester"
                          checked={tapelSemester === 'Ganjil'}
                          onChange={() => setTapelSemester('Ganjil')}
                          className="text-emerald-700 focus:ring-emerald-600"
                        />
                        <span>Smt Ganjil</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tapelSemester"
                          checked={tapelSemester === 'Genap'}
                          onChange={() => setTapelSemester('Genap')}
                          className="text-emerald-700 focus:ring-emerald-600"
                        />
                        <span>Smt Genap</span>
                      </label>
                    </div>
                  </div>

                  {/* Status Aktif */}
                  <div className="flex items-center gap-2.5 p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                    <input
                      id="input-tapel-aktif"
                      type="checkbox"
                      checked={tapelAktif}
                      disabled={currentRole !== 'Operator'}
                      onChange={(e) => setTapelAktif(e.target.checked)}
                      className="h-4.5 w-4.5 text-emerald-700 rounded focus:ring-emerald-500 border-slate-300 cursor-pointer"
                    />
                    <label htmlFor="input-tapel-aktif" className="text-slate-700 font-medium select-none cursor-pointer">
                      Jadikan Tahun Pelajaran AKTIF Saat Ini
                    </label>
                  </div>

                  {errorInput && (
                    <p className="text-red-700 font-medium text-[11px] bg-red-50 p-2 rounded border border-red-200">
                      ⚠ {errorInput}
                    </p>
                  )}

                  {currentRole === 'Operator' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg cursor-pointer transition text-xs"
                      >
                        {editingTapelId ? 'Simpan Kalender' : 'Tambahkan Kalender'}
                      </button>
                      {editingTapelId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTapelId(null);
                            setTapelTahun('2026/2027');
                            setTapelSemester('Ganjil');
                            setTapelAktif(false);
                            setErrorInput(null);
                          }}
                          className="py-2 px-3 bg-slate-200 text-slate-700 rounded-lg text-xs"
                        >
                          Batal
                        </button>
                      )}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Table Column (65%) */}
            <div className="md:col-span-7 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest pb-1 border-b border-slate-100 flex items-center justify-between">
                <span>Daftar Kalender Tahun Pelajaran SIBIMA</span>
                <span className="text-slate-400 font-mono text-[11px]">Total: {tapelList.length}</span>
              </h3>

              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Tahun Pelajaran</th>
                      <th className="p-3">Semester</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tapelList.map((t) => (
                      <tr key={t.id_tapel} className={`border-b border-slate-150 ${t.aktif ? 'bg-emerald-50/20 font-semibold' : 'hover:bg-slate-50/50'}`}>
                        <td className="p-3 font-mono font-bold text-slate-900">{t.tahun}</td>
                        <td className="p-3 font-semibold text-slate-700">Semester {t.semester}</td>
                        <td className="p-3 text-center">
                          {t.aktif ? (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 py-0.5 px-2.5 rounded-full text-emerald-800 border border-emerald-200 font-bold">
                              <Check className="h-3 w-3" /> Aktif
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetActiveTapel(t.id_tapel)}
                              disabled={currentRole !== 'Operator'}
                              className="text-[10px] bg-slate-100 hover:bg-emerald-100 border border-slate-200 hover:border-emerald-200 text-slate-650 hover:text-emerald-800 py-0.5 px-2 rounded-full transition cursor-pointer"
                            >
                              Aktifkan
                            </button>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingTapelId(t.id_tapel);
                                setTapelTahun(t.tahun);
                                setTapelSemester(t.semester);
                                setTapelAktif(t.aktif);
                                setErrorInput(null);
                              }}
                              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-emerald-700 transition"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTapel(t.id_tapel, `${t.tahun} Smt ${t.semester}`)}
                              className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-700 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: MAPEL CONFIG */}
        {activeSubTab === 'mapel' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in duration-200">
            
            {/* Input Form Column (35%) */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4 flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-emerald-700" />
                  <span>Tambah Mata Pelajaran</span>
                </h3>

                {/* Major Select */}
                <div className="space-y-3 text-xs mb-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-650">Pilih Jurusan / Kategori Mapel</label>
                    <select
                      id="select-mapel-major"
                      value={activeMapelMajor}
                      onChange={(e) => {
                        setActiveMapelMajor(e.target.value as any);
                        setEditingMapelIndex(null);
                        setErrorInput(null);
                      }}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none text-xs"
                    >
                      <option value="MIPA">Jurusan MIPA (Sains & Matematika)</option>
                      <option value="IPS">Jurusan IPS (Sosial)</option>
                      <option value="Keagamaan">Jurusan Keagamaan (Agama Islam)</option>
                      <option value="Umum">Jurusan Umum (Kelas X)</option>
                      <option value="Ijazah">Umum / Mapel Ijazah</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed bg-amber-50 rounded-lg p-2.5 border border-amber-100 text-amber-900 mt-1">
                    Nilai rapor / RDM akan disesuaikan dengan daftar mapel di jurusan terpilih saat diimpor atau dibuat berkas barunya.
                  </p>
                </div>

                <form onSubmit={handleAddMapel} className="space-y-3 text-xs">
                  
                  {/* Nama Mapel */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-650">Nama Mata Pelajaran Baru</label>
                    <input
                      id="input-mapel-nama-field"
                      type="text"
                      value={inputMapelName}
                      onChange={(e) => setInputMapelName(e.target.value)}
                      placeholder="Contoh: Geografi, Ushul Fikih, Prakarya..."
                      disabled={currentRole !== 'Operator'}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none text-xs"
                    />
                  </div>

                  {errorInput && (
                    <p className="text-red-700 font-medium text-[11px] bg-red-50 p-2 rounded border border-red-200">
                      ⚠ {errorInput}
                    </p>
                  )}

                  {currentRole === 'Operator' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg cursor-pointer transition text-center text-xs"
                      >
                        Tambahkan Mapel
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Reset to Default Standar Button for Operator */}
              {currentRole === 'Operator' && (
                <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/60 text-xs">
                  <h4 className="font-bold text-slate-800 mb-1">Setelan Bawaan Kurikulum</h4>
                  <p className="text-slate-500 mb-3 text-[11px]">Butuh mengembalikan seluruh daftar mapel untuk {activeMapelMajor} kembali ke standar madrasah?</p>
                  <button
                    onClick={handleResetMapelToDefault}
                    className="flex items-center gap-1.5 py-2 px-3 border border-emerald-200 hover:border-emerald-300 text-emerald-850 hover:text-emerald-950 font-bold bg-white shadow-xs rounded-lg transition text-[11px]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset ke Mapel Standar {activeMapelMajor}</span>
                  </button>
                </div>
              )}
            </div>

            {/* List Table Column (65%) */}
            <div className="md:col-span-7 space-y-3 font-sans">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest pb-1 border-b border-slate-100 flex items-center justify-between">
                <span>Daftar Mapel Kategori: {activeMapelMajor}</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  Total Mapel: {
                    activeMapelMajor === 'MIPA' ? mapelMipa.length :
                    activeMapelMajor === 'IPS' ? mapelIps.length :
                    activeMapelMajor === 'Keagamaan' ? mapelKeagamaan.length :
                    activeMapelMajor === 'Umum' ? mapelUmum.length :
                    mapelIjazah.length
                  }
                </span>
              </h3>

              <div className="border border-slate-150 rounded-xl overflow-hidden shadow-xs bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-12 text-center">No</th>
                      <th className="p-3">Nama Mata Pelajaran</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeMapelMajor === 'MIPA' ? mapelMipa :
                      activeMapelMajor === 'IPS' ? mapelIps :
                      activeMapelMajor === 'Keagamaan' ? mapelKeagamaan :
                      activeMapelMajor === 'Umum' ? mapelUmum :
                      mapelIjazah).map((mapel, index) => (
                      <tr key={`${activeMapelMajor}-${index}`} className="border-b border-slate-150 hover:bg-slate-50/30">
                        <td className="p-3 text-center font-mono text-slate-400">{index + 1}</td>
                        <td className="p-3 font-semibold text-slate-850">
                          {editingMapelIndex === index ? (
                            <div className="flex gap-1.5 items-center">
                              <input
                                id="input-edit-mapel"
                                type="text"
                                value={editMapelValue}
                                onChange={(e) => setEditMapelValue(e.target.value)}
                                className="p-1.5 px-2 border border-slate-300 rounded text-xs w-full max-w-sm focus:outline-emerald-600 font-semibold"
                              />
                              <button
                                onClick={() => handleSaveEditMapel(index)}
                                className="p-1 text-emerald-800 hover:bg-emerald-50 rounded"
                                title="Simpan Perubahan"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <span>{mapel}</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {currentRole === 'Operator' && editingMapelIndex !== index && (
                              <button
                                onClick={() => {
                                  setEditingMapelIndex(index);
                                  setEditMapelValue(mapel);
                                }}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-emerald-700 transition"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {currentRole === 'Operator' && (
                              <button
                                onClick={() => handleDeleteMapel(index)}
                                className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-700 transition"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
