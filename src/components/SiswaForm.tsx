/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Siswa, Kelas, NilaiSemester, NilaiIjazah, JurusanType, GenderType } from '../types';
import { Save, X, User, Home, Users, BookOpen, GraduationCap, Upload, Image, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { MAPEL_LIST_MIPA, MAPEL_LIST_IPS, MAPEL_LIST_RELIGION, MAPEL_LIST_UMUM, GENERAL_IJAZAH_MAPEL } from '../data/seedData';

interface SiswaFormProps {
  siswaId?: string; // If undefined, we are adding a new student
  siswaList: Siswa[];
  kelasList: Kelas[];
  nilaiSemesterList: NilaiSemester[];
  nilaiIjazahList: NilaiIjazah[];
  onSave: (
    updatedSiswa: Siswa,
    updatedNilaiSem: NilaiSemester[],
    updatedNilaiIjazah: NilaiIjazah[]
  ) => void;
  onClose: () => void;
  mapelMipa?: string[];
  mapelIps?: string[];
  mapelKeagamaan?: string[];
  mapelUmum?: string[];
  mapelIjazah?: string[];
}

type TabType = 'identitas' | 'alamat' | 'ortu' | 'pendidikan' | 'akademik';

export default function SiswaForm({ 
  siswaId, 
  siswaList, 
  kelasList, 
  nilaiSemesterList, 
  nilaiIjazahList, 
  onSave, 
  onClose,
  mapelMipa = MAPEL_LIST_MIPA,
  mapelIps = MAPEL_LIST_IPS,
  mapelKeagamaan = MAPEL_LIST_RELIGION,
  mapelUmum = MAPEL_LIST_UMUM,
  mapelIjazah = GENERAL_IJAZAH_MAPEL
}: SiswaFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>('identitas');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Core Form State
  const [siswa, setSiswa] = useState<Siswa>({
    id_siswa: `sis-${Date.now()}`,
    nis: '',
    nisn: '',
    nik: '',
    nama: '',
    tempat_lahir: '',
    tgl_lahir: '',
    jk: 'L',
    agama: 'Islam',
    status_anak: 'Kandung',
    anak_ke: 1,
    jml_saudara: 0,
    hobi: '',
    cita_cita: '',
    alamat_lengkap: '',
    desa: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: '',
    kode_pos: '',
    nama_ayah: '',
    nik_ayah: '',
    pendidikan_ayah: '',
    pekerjaan_ayah: '',
    penghasilan_ayah: '',
    nama_ibu: '',
    nik_ibu: '',
    pendidikan_ibu: '',
    pekerjaan_ibu: '',
    penghasilan_ibu: '',
    nama_wali: '',
    hubungan_wali: '',
    alamat_wali: '',
    pekerjaan_wali: '',
    tahun_masuk: new Date().getFullYear().toString(),
    kelas_masuk: 'X',
    id_kelas: kelasList[0]?.id_kelas || '',
    jurusan: 'MIPA',
    asal_sekolah: '',
    no_skhun: '',
    no_ijazah_smp: '',
    foto: '',
  });

  // State arrays for grades
  const [nilaiSem, setNilaiSem] = useState<NilaiSemester[]>([]);
  const [nilaiIjz, setNilaiIjz] = useState<NilaiIjazah[]>([]);
  const [selectedSemesterTab, setSelectedSemesterTab] = useState<number>(1);

  // Photo uploading handler helper
  const [previewPhoto, setPreviewPhoto] = useState<string>('');

  // Loads either default new student or selected edit values
  useEffect(() => {
    if (siswaId) {
      const match = siswaList.find(s => s.id_siswa === siswaId);
      if (match) {
        setSiswa({ ...match });
        setPreviewPhoto(match.foto || '');
        
        // Filter grades for this student
        const filteredNilai = nilaiSemesterList.filter(n => n.id_siswa === siswaId);
        setNilaiSem(filteredNilai);

        const filteredIjazah = nilaiIjazahList.filter(n => n.id_siswa === siswaId);
        setNilaiIjz(filteredIjazah);
      }
    } else {
      // It's a new student. Pre-generate mock grades for them based on MIPA
      initializeNewStudentGrades('MIPA', `sis-${Date.now()}`);
    }
  }, [siswaId, siswaList]);

  // Recalculates subjects if department/jurusan shifts for the new/edit student
  const handleJurusanChange = (newJurusan: JurusanType) => {
    setSiswa(prev => ({ ...prev, jurusan: newJurusan }));
    
    // If adding a new student or editing and grades are empty, re-initialize
    initializeNewStudentGrades(newJurusan, siswa.id_siswa);
  };

  const initializeNewStudentGrades = (jurusan: JurusanType, sId: string) => {
    const listMapel = jurusan === 'MIPA' 
      ? mapelMipa 
      : (jurusan === 'IPS' ? mapelIps : (jurusan === 'Keagamaan' ? mapelKeagamaan : mapelUmum));
    
    const initialGrades: NilaiSemester[] = [];
    // Initialize 6 semesters with generic passing grade (80)
    for (let sem = 1; sem <= 6; sem++) {
      listMapel.forEach((mapel, index) => {
        initialGrades.push({
          id_nilai: `nil-${sId}-${sem}-${index}-${Date.now()}`,
          id_siswa: sId,
          semester: sem,
          mapel,
          nilai: 80,
        });
      });
    }
    setNilaiSem(initialGrades);

    // Initialize generic Ijazah values
    const ijazahMapels = mapelIjazah;
    const initialIjazah = ijazahMapels.map((mapel, index) => ({
      id_ijazah: `ijz-${sId}-${index}-${Date.now()}`,
      id_siswa: sId,
      mapel,
      nilai: 80,
    }));
    setNilaiIjz(initialIjazah);
  };

  const handleInputChange = (field: keyof Siswa, value: any) => {
    setSiswa(prev => ({ ...prev, [field]: value }));
  };

  // Convert uploaded image to Base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Sayang sekali! Ukuran foto melebihi batas maksimal 2MB. Silakan gunakan foto yang lebih kecil.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewPhoto(base64String);
        handleInputChange('foto', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGradeChange = (idNilai: string, value: number) => {
    const score = Math.min(100, Math.max(0, isNaN(value) ? 0 : value));
    setNilaiSem(prev => prev.map(n => n.id_nilai === idNilai ? { ...n, nilai: score } : n));
  };

  const handleIjazahGradeChange = (idIjazah: string, value: number) => {
    const score = Math.min(100, Math.max(0, isNaN(value) ? 0 : value));
    setNilaiIjz(prev => prev.map(i => i.id_ijazah === idIjazah ? { ...i, nilai: score } : i));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Hard verification requirements
    if (!siswa.nis || !siswa.nisn || !siswa.nama) {
      setErrorMessage("Mohon lengkapi kolom utama: Nama Lengkap, NIS, dan NISN wajib diisi!");
      setActiveTab('identitas');
      return;
    }

    if (siswa.nik && siswa.nik.length !== 16) {
      setErrorMessage("Format NIK harus 16 digit angka yang valid sesuai KTP/KK!");
      setActiveTab('identitas');
      return;
    }

    // Pass back up to local storage triggers
    onSave(siswa, nilaiSem, nilaiIjz);
  };

  // Filter semester grades for current viewing tab (1-6)
  const currentSemesterGrades = nilaiSem.filter(n => n.semester === selectedSemesterTab);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
      
      {/* Banner / Title bar of Form Modal */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-5 text-white flex items-center justify-between border-b-2 border-amber-400">
        <div className="flex items-center space-x-2.5">
          <BookOpen className="h-5 w-5 text-amber-400" />
          <div>
            <h2 className="font-bold text-base leading-tight">
              {siswaId ? 'Mutasi & Perubahan Data Siswa' : 'Input Register Siswa Baru (Buku Induk)'}
            </h2>
            <p className="text-[11px] text-emerald-100 font-light">
              {siswaId ? `Mengedit berkas: ${siswa.nama}` : 'Tambahkan data master biodata madrasah dan ijazah'}
            </p>
          </div>
        </div>
        <button
          id="btn-close-form"
          type="button"
          onClick={onClose}
          className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Warning banner */}
      {errorMessage && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 shrink-0 transition flex items-start gap-2.5">
          <AlertCircle className="h-4.5 w-4.5 text-rose-600 mt-0.5 shrink-0" />
          <span className="text-xs text-rose-800 font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Tab Navigation buttons */}
      <div className="flex border-b border-slate-100 bg-slate-50/70 p-1 divide-x divide-slate-200">
        {(['identitas', 'alamat', 'ortu', 'pendidikan', 'akademik'] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              id={`tab-form-${tab}`}
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-b-3 ${
                isActive
                  ? 'bg-white border-emerald-700 text-emerald-900 font-extrabold text-shadow'
                  : 'text-slate-500 hover:text-slate-800 border-transparent bg-transparent hover:bg-slate-50'
              }`}
            >
              {tab === 'identitas' && <User className="h-4 w-4 shrink-0" />}
              {tab === 'alamat' && <Home className="h-4 w-4 shrink-0" />}
              {tab === 'ortu' && <Users className="h-4 w-4 shrink-0" />}
              {tab === 'pendidikan' && <GraduationCap className="h-4 w-4 shrink-0" />}
              {tab === 'akademik' && <BookOpen className="h-4 w-4 shrink-0" />}
              <span className="hidden md:inline capitalize">{tab === 'ortu' ? 'Orang Tua' : tab}</span>
            </button>
          );
        })}
      </div>

      {/* Form Submission blocks */}
      <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
        
        {/* TAB 1: IDENTITAS */}
        {activeTab === 'identitas' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left: Foto & quick check */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-700 block">Foto Digital Siswa (3x4)</label>
              
              <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center relative group min-h-[220px]">
                {previewPhoto ? (
                  <div className="relative">
                    <img 
                      src={previewPhoto} 
                      alt="Preview" 
                      className="h-40 w-30 object-cover rounded-lg shadow-md border-2 border-emerald-500" 
                      referrerPolicy="no-referrer"
                    />
                    <button
                      id="btn-remove-photo"
                      type="button"
                      onClick={() => { setPreviewPhoto(''); handleInputChange('foto', ''); }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition"
                      title="Hapus foto"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-full shadow text-slate-400 inline-block">
                      <Image className="h-6 w-6" />
                    </div>
                    <p className="text-xs text-slate-500">Pasfoto 3x4 formal</p>
                    <p className="text-[10px] text-slate-400">Dimensi ideal portrait, maks. 2MB</p>
                  </div>
                )}

                <div className="mt-3">
                  <label className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-850 border border-emerald-200 text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 transition">
                    <Upload className="h-3 w-3" />
                    <span>Upload Foto</span>
                    <input 
                      id="input-photo-upload"
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Photo Helper tip */}
              <p className="text-[10px] text-slate-400 leading-relaxed">
                *Foto akan dikompresi ke kode Base64 lokal secara aman untuk dicetak di Buku Induk Resmi.
              </p>
            </div>

            {/* Right: Identitas inputs */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap Siswa*</label>
                <input
                  id="form-input-nama"
                  type="text"
                  required
                  value={siswa.nama}
                  onChange={(e) => handleInputChange('nama', e.target.value)}
                  className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition"
                  placeholder="Muhammad Wildan Al-Ghifari"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nomor Induk Siswa (NIS)*</label>
                <input
                  id="form-input-nis"
                  type="text"
                  required
                  value={siswa.nis}
                  onChange={(e) => handleInputChange('nis', e.target.value)}
                  className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition font-mono"
                  placeholder="23241001"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">NISN (10 Digit)*</label>
                <input
                  id="form-input-nisn"
                  type="text"
                  required
                  maxLength={10}
                  value={siswa.nisn}
                  onChange={(e) => handleInputChange('nisn', e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition font-mono"
                  placeholder="0085432101"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">NIK (16 Digit)*</label>
                <input
                  id="form-input-nik"
                  type="text"
                  maxLength={16}
                  required
                  value={siswa.nik}
                  onChange={(e) => handleInputChange('nik', e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition font-mono"
                  placeholder="351512XXXXXXXXXX"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tempat Lahir</label>
                <input
                  id="form-input-tempat-lahir"
                  type="text"
                  value={siswa.tempat_lahir}
                  onChange={(e) => handleInputChange('tempat_lahir', e.target.value)}
                  className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition"
                  placeholder="Sidoarjo"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tanggal Lahir</label>
                <input
                  id="form-input-tgl-lahir"
                  type="date"
                  value={siswa.tgl_lahir}
                  onChange={(e) => handleInputChange('tgl_lahir', e.target.value)}
                  className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Jenis Kelamin</label>
                <select
                  id="form-select-jk"
                  value={siswa.jk}
                  onChange={(e) => handleInputChange('jk', e.target.value as GenderType)}
                  className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition cursor-pointer"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Agama</label>
                <input
                  id="form-input-agama"
                  type="text"
                  value={siswa.agama}
                  onChange={(e) => handleInputChange('agama', e.target.value)}
                  className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition"
                  placeholder="Islam"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Status Anak</label>
                <input
                  id="form-input-status-anak"
                  type="text"
                  value={siswa.status_anak}
                  onChange={(e) => handleInputChange('status_anak', e.target.value)}
                  className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition"
                  placeholder="Kandung / Angkat"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Anak Ke</label>
                  <input
                    id="form-input-anak-ke"
                    type="number"
                    min={1}
                    value={siswa.anak_ke}
                    onChange={(e) => handleInputChange('anak_ke', parseInt(e.target.value))}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Sdr. Kandung</label>
                  <input
                    id="form-input-jml-saudara"
                    type="number"
                    min={0}
                    value={siswa.jml_saudara}
                    onChange={(e) => handleInputChange('jml_saudara', parseInt(e.target.value))}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hobi Siswa</label>
                <input
                  id="form-input-hobi"
                  type="text"
                  value={siswa.hobi}
                  onChange={(e) => handleInputChange('hobi', e.target.value)}
                  className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
                  placeholder="Menghafal Quran, Kaligrafi"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Cita-Cita Siswa</label>
                <input
                  id="form-input-cita-cita"
                  type="text"
                  value={siswa.cita_cita}
                  onChange={(e) => handleInputChange('cita_cita', e.target.value)}
                  className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                  placeholder="Dosen Sastra Arab, Muballigh"
                />
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: ALAMAT */}
        {activeTab === 'alamat' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Rumah Lengkap (RT/RW / Dusun / Jalan)</label>
              <textarea
                id="form-input-alamat"
                rows={3}
                value={siswa.alamat_lengkap}
                onChange={(e) => handleInputChange('alamat_lengkap', e.target.value)}
                className="w-full bg-white text-xs text-slate-700 rounded-lg border border-slate-200 p-3 outline-none focus:border-emerald-500"
                placeholder="Jl. KH. Hasyim Asy'ari No. 12 RT 04 RW 02"
              ></textarea>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Desa / Kelurahan</label>
              <input
                id="form-input-desa"
                type="text"
                value={siswa.desa}
                onChange={(e) => handleInputChange('desa', e.target.value)}
                className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
                placeholder="Pepe"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Kecamatan</label>
              <input
                id="form-input-kecamatan"
                type="text"
                value={siswa.kecamatan}
                onChange={(e) => handleInputChange('kecamatan', e.target.value)}
                className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
                placeholder="Sedati"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Kabupaten / Kota</label>
              <input
                id="form-input-kabupaten"
                type="text"
                value={siswa.kabupaten}
                onChange={(e) => handleInputChange('kabupaten', e.target.value)}
                className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                placeholder="Sidoarjo"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Provinsi</label>
              <input
                id="form-input-provinsi"
                type="text"
                value={siswa.provinsi}
                onChange={(e) => handleInputChange('provinsi', e.target.value)}
                className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                placeholder="Jawa Timur"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Kode Pos (5 Digit)</label>
              <input
                id="form-input-kode-pos"
                type="text"
                maxLength={5}
                value={siswa.kode_pos}
                onChange={(e) => handleInputChange('kode_pos', e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none font-mono"
                placeholder="61253"
              />
            </div>

          </div>
        )}

        {/* TAB 3: ORANG TUA / WALI */}
        {activeTab === 'ortu' && (
          <div className="space-y-6">
            
            {/* Ayah block */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h3 className="text-xs font-bold text-emerald-850 uppercase tracking-wider mb-3">Identitas Ayah Kandung</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Nama Lengkap Ayah</label>
                  <input
                    id="form-input-ayah"
                    type="text"
                    value={siswa.nama_ayah}
                    onChange={(e) => handleInputChange('nama_ayah', e.target.value)}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                    placeholder="KH. Solihin Mansur"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">NIK Ayah (16 Digit)</label>
                  <input
                    id="form-input-nik-ayah"
                    type="text"
                    maxLength={16}
                    value={siswa.nik_ayah}
                    onChange={(e) => handleInputChange('nik_ayah', e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none font-mono"
                    placeholder="3515XXXXXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Pendidikan Terakhir</label>
                  <input
                    id="form-input-pendidikan-ayah"
                    type="text"
                    value={siswa.pendidikan_ayah}
                    onChange={(e) => handleInputChange('pendidikan_ayah', e.target.value)}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                    placeholder="S1 Hukum Islam"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Pekerjaan</label>
                  <input
                    id="form-input-pekerjaan-ayah"
                    type="text"
                    value={siswa.pekerjaan_ayah}
                    onChange={(e) => handleInputChange('pekerjaan_ayah', e.target.value)}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                    placeholder="Guru Syariah"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Penghasilan Per Bulan</label>
                  <input
                    id="form-input-penghasilan-ayah"
                    type="text"
                    value={siswa.penghasilan_ayah}
                    onChange={(e) => handleInputChange('penghasilan_ayah', e.target.value)}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                    placeholder="Rp. 5.000.000 - Rp. 7.500.000"
                  />
                </div>
              </div>
            </div>

            {/* Ibu block */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h3 className="text-xs font-bold text-emerald-850 uppercase tracking-wider mb-3">Identitas Ibu Kandung</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Nama Lengkap Ibu</label>
                  <input
                    id="form-input-ibu"
                    type="text"
                    value={siswa.nama_ibu}
                    onChange={(e) => handleInputChange('nama_ibu', e.target.value)}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                    placeholder="Hj. Aminah Maimunah"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">NIK Ibu (16 Digit)</label>
                  <input
                    id="form-input-nik-ibu"
                    type="text"
                    maxLength={16}
                    value={siswa.nik_ibu}
                    onChange={(e) => handleInputChange('nik_ibu', e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none font-mono"
                    placeholder="3515XXXXXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Pendidikan Terakhir</label>
                  <input
                    id="form-input-pendidikan-ibu"
                    type="text"
                    value={siswa.pendidikan_ibu}
                    onChange={(e) => handleInputChange('pendidikan_ibu', e.target.value)}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                    placeholder="D3 Tarbiyah"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Pekerjaan</label>
                  <input
                    id="form-input-pekerjaan-ibu"
                    type="text"
                    value={siswa.pekerjaan_ibu}
                    onChange={(e) => handleInputChange('pekerjaan_ibu', e.target.value)}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                    placeholder="Ibu Rumah Tangga"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Penghasilan Per Bulan</label>
                  <input
                    id="form-input-penghasilan-ibu"
                    type="text"
                    value={siswa.penghasilan_ibu}
                    onChange={(e) => handleInputChange('penghasilan_ibu', e.target.value)}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                    placeholder="Tidak Berpenghasilan"
                  />
                </div>
              </div>
            </div>

            {/* Wali (Optional) block */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Data Wali Siswa (Opsional/Jika Ikut Wali)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Nama Wali</label>
                  <input
                    id="form-input-wali"
                    type="text"
                    value={siswa.nama_wali || ''}
                    onChange={(e) => handleInputChange('nama_wali', e.target.value)}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                    placeholder="H. Ahmad Sholeh"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Hubungan</label>
                  <input
                    id="form-input-hubungan-wali"
                    type="text"
                    value={siswa.hubungan_wali || ''}
                    onChange={(e) => handleInputChange('hubungan_wali', e.target.value)}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                    placeholder="Paman / Kakak"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Alamat Wali</label>
                  <input
                    id="form-input-alamat-wali"
                    type="text"
                    value={siswa.alamat_wali || ''}
                    onChange={(e) => handleInputChange('alamat_wali', e.target.value)}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                    placeholder="Sidoarjo"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Pekerjaan Wali</label>
                  <input
                    id="form-input-pekerjaan-wali"
                    type="text"
                    value={siswa.pekerjaan_wali || ''}
                    onChange={(e) => handleInputChange('pekerjaan_wali', e.target.value)}
                    className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                    placeholder="Wiraswasta"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: RIWAYAT PENDIDIKAN */}
        {activeTab === 'pendidikan' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tahun Masuk Madrasah*</label>
              <input
                id="form-input-tahun-masuk"
                type="text"
                required
                value={siswa.tahun_masuk}
                onChange={(e) => handleInputChange('tahun_masuk', e.target.value)}
                className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 font-mono"
                placeholder="2023"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Kelas Aktif Saat Ini</label>
              <select
                id="form-select-kelas"
                value={siswa.id_kelas}
                onChange={(e) => {
                  const kId = e.target.value;
                  const selectedKls = kelasList.find(k => k.id_kelas === kId);
                  handleInputChange('id_kelas', kId);
                  if (selectedKls) {
                    handleInputChange('kelas_masuk', selectedKls.nama_kelas.split(' ')[0]);
                  }
                }}
                className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 cursor-pointer animate-none"
              >
                {kelasList.map((k) => (
                  <option key={k.id_kelas} value={k.id_kelas}>{k.nama_kelas} [Wali: {k.wali_kelas}]</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Jurusan / Peminatan*</label>
              <select
                id="form-select-jurusan"
                value={siswa.jurusan}
                onChange={(e) => handleJurusanChange(e.target.value as JurusanType)}
                className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="MIPA">MIPA (Sains)</option>
                <option value="IPS">IPS (Sosial)</option>
                <option value="Keagamaan">Keagamaan (Agama)</option>
                <option value="Umum">Umum (Umum / Kelas X)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                *Memilih jurusan lain akan me-reset struktur peta mata pelajaran RDM pada tab <strong>Akademik</strong>.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Asal Sekolah (SMP/MTs)</label>
              <input
                id="form-input-asal-sekolah"
                type="text"
                value={siswa.asal_sekolah}
                onChange={(e) => handleInputChange('asal_sekolah', e.target.value)}
                className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none"
                placeholder="MTs Banu Hasyim Sidoarjo"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nomor SKHUN SMP/MTs</label>
              <input
                id="form-input-skhun"
                type="text"
                value={siswa.no_skhun}
                onChange={(e) => handleInputChange('no_skhun', e.target.value)}
                className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none font-mono"
                placeholder="SKHUN-MTs-2023-0091"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nomor Ijazah SMP/MTs</label>
              <input
                id="form-input-ijazah-smp"
                type="text"
                value={siswa.no_ijazah_smp}
                onChange={(e) => handleInputChange('no_ijazah_smp', e.target.value)}
                className="w-full bg-white text-xs rounded-lg border border-slate-200 px-3 py-2 outline-none font-mono"
                placeholder="DN-24/MTs/03/491028"
              />
            </div>

          </div>
        )}

        {/* TAB 5: AKADEMIK RAPOR RDM */}
        {activeTab === 'akademik' && (
          <div className="space-y-6">
            
            {/* Split Semester select */}
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-xs text-emerald-950">Pengisian Lembar Rapor RDM & Ijazah</h4>
                <p className="text-[11px] text-emerald-800">Ubah nilai sesuai kurikulum MA Banu Hasyim</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {[1, 2, 3, 4, 5, 6, 99].map((sem) => (
                  <button
                    id={`btn-sem-tab-${sem}`}
                    key={sem}
                    type="button"
                    onClick={() => setSelectedSemesterTab(sem)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
                      selectedSemesterTab === sem
                        ? 'bg-emerald-800 text-white border-transparent'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {sem === 99 ? 'Nilai Ijazah' : `Smt ${sem}`}
                  </button>
                ))}
              </div>
            </div>

            {/* If semester selected (1-6) */}
            {selectedSemesterTab !== 99 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-extrabold text-slate-800 font-sans">
                    Arsip Nilai Rapor Semester {selectedSemesterTab}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono uppercase font-bold bg-slate-100 px-2 py-0.5 rounded">
                    Kurikulum {siswa.jurusan}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {currentSemesterGrades.map((grade) => (
                    <div key={grade.id_nilai} className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between gap-2.5">
                      <span className="text-xs text-slate-600 truncate font-semibold leading-tight">{grade.mapel}</span>
                      <input
                        id={`input-grade-${grade.id_nilai}`}
                        type="number"
                        min={0}
                        max={100}
                        value={grade.nilai}
                        onChange={(e) => handleGradeChange(grade.id_nilai, parseInt(e.target.value))}
                        className="w-14 bg-white text-center text-xs font-bold rounded px-1.5 py-1 border border-slate-200 outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  ))}
                  {currentSemesterGrades.length === 0 && (
                    <p className="text-center text-slate-400 text-xs col-span-3 py-6">
                      Tidak ada mapel terinisialisasi. Silakan simpan dan set-up Jurusan terlebih dahulu.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              // Nilai Ijazah selected (99)
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-extrabold text-slate-800">
                    Nilai Ijazah Resmi (Asas Kelulusan)
                  </span>
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded font-bold border border-amber-100">
                    Syarat Cetak Last Page
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {nilaiIjz.map((ijz) => (
                    <div key={ijz.id_ijazah} className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between gap-2.5">
                      <span className="text-xs text-slate-600 truncate font-semibold leading-tight">{ijz.mapel}</span>
                      <input
                        id={`input-ijz-${ijz.id_ijazah}`}
                        type="number"
                        min={0}
                        max={100}
                        value={ijz.nilai}
                        onChange={(e) => handleIjazahGradeChange(ijz.id_ijazah, parseInt(e.target.value))}
                        className="w-14 bg-white text-center text-xs font-bold rounded px-1.5 py-1 border border-slate-200 outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Footer actions for saving */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-100">
          <button
            id="form-btn-cancel"
            type="button"
            onClick={onClose}
            className="px-4 py-2 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold border border-slate-250 cursor-pointer"
          >
            Batal
          </button>
          
          <button
            id="form-btn-save"
            type="submit"
            className="flex items-center justify-center space-x-1.5 py-2 px-5 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Berkas Buku Induk</span>
          </button>
        </div>

      </form>

    </div>
  );
}
