/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Siswa, Kelas, LogAktivitas } from '../types';
import { Users, BookOpen, AlertTriangle, Activity, Award, Briefcase, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  siswa: Siswa[];
  kelas: Kelas[];
  logs: LogAktivitas[];
  onNavigate: (tab: string) => void;
  onSelectSiswa: (siswaId: string) => void;
  currentRole?: string;
  currentUser?: string;
}

export default function Dashboard({ 
  siswa, 
  kelas, 
  logs, 
  onNavigate, 
  onSelectSiswa,
  currentRole = 'Operator',
  currentUser = ''
}: DashboardProps) {
  // If role is Siswa, render customized personal student dashboard
  if (currentRole === 'Siswa') {
    const mySiswaObj = siswa.find(s => s.nama === currentUser) || siswa[0];
    const myKelasObj = kelas.find(k => k.id_kelas === mySiswaObj?.id_kelas);

    return (
      <div className="space-y-6 font-sans">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-850 rounded-2xl shadow-sm border border-emerald-850 p-6 relative overflow-hidden text-white">
          <div className="absolute right-0 top-0 bottom-0 w-48 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-amber-400/10 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 space-y-2">
            <span className="text-amber-300 bg-emerald-950/80 border border-emerald-700 font-mono px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              PORTAL SISWA SIBIMA
            </span>
            <h2 className="text-2xl font-extrabold text-white">
              Assalamualaikum Wr. Wb., {currentUser || 'Siswa'}!
            </h2>
            <p className="text-sm text-emerald-100/90 leading-relaxed max-w-xl">
              Anda masuk dengan status hak akses resmi sebagai <strong>Siswa MA Banu Hasyim Sidoarjo</strong>. Di sini Anda dapat memverifikasi keselarasan data Buku Induk dan portofolio nilai rapor RDM digital Anda.
            </p>
          </div>
        </div>

        {/* Siswa Quick Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Biodata Ringkas */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 col-span-2">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 text-sm uppercase tracking-wider font-mono">Biodata Utama Siswa</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Nama Lengkap</span>
                <p className="font-bold text-slate-850 text-sm">{mySiswaObj?.nama || 'Belum Terdaftar'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Kelas / Jurusan</span>
                <p className="font-bold text-slate-800 text-sm">{myKelasObj?.nama_kelas || mySiswaObj?.kelas_masuk || '-'} / {mySiswaObj?.jurusan || '-'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">NISN (User ID)</span>
                <p className="font-mono font-bold text-slate-850">{mySiswaObj?.nisn || '-'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">NIS (Password)</span>
                <p className="font-mono font-bold text-slate-850">{mySiswaObj?.nis || '-'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Tempat, Tanggal Lahir</span>
                <p className="font-bold text-slate-800">{mySiswaObj?.tempat_lahir || '-'}, {mySiswaObj?.tgl_lahir ? new Date(mySiswaObj.tgl_lahir).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Wali Kelas</span>
                <p className="font-bold text-emerald-800 font-serif">{myKelasObj?.wali_kelas || '-'}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4">
              <button
                type="button"
                onClick={() => onNavigate('Buku Induk Saya')}
                className="px-4 py-2 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-950 hover:to-slate-950 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 border border-transparent shadow shadow-emerald-950/20"
              >
                <Award className="h-4 w-4 text-amber-400" />
                <span>Buka Lembaran Buku Induk Saya</span>
              </button>
            </div>
          </div>

          {/* Card 2: Foto & Status Keaktifan */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <img
                src={mySiswaObj?.foto || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'}
                alt={mySiswaObj?.nama || 'Siswa'}
                className="w-28 h-28 object-cover rounded-2xl border-4 border-emerald-50 shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-xs leading-snug">{mySiswaObj?.nama || 'Nama'}</h4>
              <p className="text-[10px] text-slate-400 font-mono">NIS: {mySiswaObj?.nis || '-'}</p>
            </div>
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold border border-green-200 uppercase tracking-widest font-mono scale-95">
              STATUS: AKTIF (TERDAFTAR)
            </span>
          </div>

        </div>

        {/* Infobox & Notes */}
        <div className="p-5 bg-amber-50/50 border border-amber-200/60 rounded-2xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-950">Pemberitahuan Proteksi Data Buku Induk (Siswa Read-Only)</p>
            <p>
              Untuk tujuan keamanan data dan keabsahan dokumen kenegaraan madrasah, hak masuk sebagai <strong>Siswa</strong> bersifat <strong>hanya baca (Read-only)</strong>. Jika Anda menemukan ketidaksesuaian data utama, nama orang tua, NISN/NIS, ataupun nilai rapor RDM digital Anda, silakan hubungi operator madrasah <strong>Ust. Usman Fauzi</strong> untuk dilakukan perbaikan dari panel Operator utama.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculated Statistics
  const totalSiswa = siswa.length;
  const countMipa = siswa.filter(s => s.jurusan === 'MIPA').length;
  const countIps = siswa.filter(s => s.jurusan === 'IPS').length;
  const countKeagamaan = siswa.filter(s => s.jurusan === 'Keagamaan').length;
  
  const totalKelas = kelas.length;
  
  // Checking incomplete student profiles (missing vital things like SN, NIK, or Photo)
  const dataIncomplete = siswa.filter(s => 
    !s.nis || !s.nisn || !s.nik || !s.foto || !s.nama_ayah || !s.nama_ibu
  );
  
  const totalAlumni = siswa.filter(s => s.id_kelas.includes('xii')).length; // XII ready for graduation
  const totalAktif = totalSiswa - totalAlumni;

  // Let's create an elegant custom geometric breakdown chart for department ratios
  const maxJurusan = Math.max(countMipa, countIps, countKeagamaan, 1);
  const percentMipa = (countMipa / totalSiswa) * 100 || 0;
  const percentIps = (countIps / totalSiswa) * 100 || 0;
  const percentKeagamaan = (countKeagamaan / totalSiswa) * 100 || 0;

  // Render recent logs in Indonesian
  const formatTimeDifference = (isoString: string) => {
    const time = new Date(isoString).getTime();
    const now = new Date().getTime();
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return new Date(isoString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome & Bismillah Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-emerald-50 to-transparent pointer-events-none rounded-r-2xl"></div>
        
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              MA BANU HASYIM SIDOARJO
            </span>
          </div>
          <h2 className="text-2xl font-bold font-sans text-slate-800">
            Selamat Datang di Portal SIBIMA
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Sistem Buku Induk Digital MA Banu Hasyim merupakan terobosan administrasi terintegrasi, siap cetak kapan saja, sinkron data RDM, dan terdokumentasi rapi demi kemajuan madrasah.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col items-center justify-center p-4 bg-emerald-50 rounded-xl border border-emerald-100/80 min-w-[200px] text-center">
          <span className="text-xs text-emerald-800 font-serif italic mb-1">"Al-ittihadu asasun najaah"</span>
          <span className="text-[10px] text-emerald-600 font-sans tracking-tight">Persatuan adalah pangkal keberhasilan</span>
        </div>
      </div>

      {/* Grid Metrics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Siswa Aktif</p>
            <p className="text-3xl font-extrabold text-emerald-950 font-sans">{totalAktif}</p>
            <p className="text-[10.5px] text-emerald-700 bg-emerald-50/70 inline-block px-2 py-0.5 rounded font-medium">X & XI Madrasah</p>
          </div>
          <div className="p-3 bg-emerald-100/50 rounded-2xl text-emerald-800">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Calon Alumni (XII)</p>
            <p className="text-3xl font-extrabold text-emerald-950 font-sans">{totalAlumni}</p>
            <p className="text-[10.5px] text-amber-700 bg-amber-50 inline-block px-2 py-0.5 rounded font-medium">Buku Induk Siap Cetak</p>
          </div>
          <div className="p-3 bg-amber-100/50 rounded-2xl text-amber-600">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Data Kurang Lengkap</p>
            <p className="text-3xl font-extrabold text-red-700 font-sans">{dataIncomplete.length}</p>
            <p className="text-[10.5px] text-red-600 bg-red-50 inline-block px-2 py-0.5 rounded font-medium">Butuh Pelengkapan</p>
          </div>
          <div className={`p-3 rounded-2xl ${dataIncomplete.length > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
            <AlertTriangle className="h-6 w-6" id="icon-warning-incomplete" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Kelas & Wali Kelas</p>
            <p className="text-3xl font-extrabold text-emerald-950 font-sans">{totalKelas}</p>
            <p className="text-[10.5px] text-emerald-700 bg-emerald-50/70 inline-block px-2 py-0.5 rounded font-medium">Terdaftar di Sistem</p>
          </div>
          <div className="p-3 bg-emerald-100/50 rounded-2xl text-emerald-800">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Department SVG Chart Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-800">Proporsi Jurusan & Program Studi</h3>
              <p className="text-xs text-slate-500">Persentase pendaftaran siswa Banu Hasyim berdasarkan peminatan</p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">Rasio Rapor</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
            
            {/* Custom SVG Donut Chart */}
            <div className="flex flex-col items-center justify-center relative">
              <svg viewBox="0 0 100 100" className="w-40 h-40 transform -rotate-90">
                {/* Total Circle */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                
                {/* MIPA Segment (Emerald) */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#0F7B6C" 
                  strokeWidth="12" 
                  strokeDasharray={`${percentMipa * 2.51} 251`} 
                  strokeDashoffset="0"
                />
                
                {/* IPS Segment (Gold) */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#D4AF37" 
                  strokeWidth="12" 
                  strokeDasharray={`${percentIps * 2.51} 251`} 
                  strokeDashoffset={`-${percentMipa * 2.51}`}
                />
                
                {/* Keagamaan Segment (Slate/Blue) */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#475569" 
                  strokeWidth="12" 
                  strokeDasharray={`${percentKeagamaan * 2.51} 251`} 
                  strokeDashoffset={`-${(percentMipa + percentIps) * 2.51}`}
                />
              </svg>

              {/* Centered Total */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                <span className="text-2xl font-black font-sans text-slate-800 leading-none">{totalSiswa}</span>
                <span className="text-[10px] text-slate-500 font-mono">SISWA</span>
              </div>
            </div>

            {/* Custom Legends & Details */}
            <div className="space-y-4">
              
              {/* MIPA Legend */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 bg-[#0F7B6C] rounded-full border border-emerald-600 block shadow-sm"></span>
                    <span className="font-semibold text-slate-700">MIPA (Sains)</span>
                  </div>
                  <span className="font-bold text-slate-900">{countMipa} Siswa ({percentMipa.toFixed(0)}%)</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F7B6C] rounded-full" style={{ width: `${percentMipa}%` }}></div>
                </div>
              </div>

              {/* IPS Legend */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 bg-[#D4AF37] rounded-full border border-amber-600 block shadow-sm"></span>
                    <span className="font-semibold text-slate-700">IPS (Sosial)</span>
                  </div>
                  <span className="font-bold text-slate-900">{countIps} Siswa ({percentIps.toFixed(0)}%)</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: `${percentIps}%` }}></div>
                </div>
              </div>

              {/* Keagamaan Legend */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 bg-slate-600 rounded-full border border-slate-700 block shadow-sm"></span>
                    <span className="font-semibold text-slate-700">Keagamaan (Islam)</span>
                  </div>
                  <span className="font-bold text-slate-900">{countKeagamaan} Siswa ({percentKeagamaan.toFixed(0)}%)</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-600 rounded-full" style={{ width: `${percentKeagamaan}%` }}></div>
                </div>
              </div>

            </div>

          </div>

          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/60 mt-4 text-xs text-emerald-800 leading-relaxed flex items-start gap-2.5">
            <Award className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>RDM Aliyah Sync:</strong> Jumlah ini secara otomatis terekam dari data rapor yang diimpor melalui tab <strong>Leger Nilai RDM</strong> dan otomatis terintegrasi ke cetakan Buku Induk Madrasah.
            </span>
          </div>
        </div>

        {/* Right Card: Quick Warn Checklist */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-rose-500 rounded-full block animate-ping"></span>
              Aksi Butuh Perhatian
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">TOTAL: {dataIncomplete.length}</span>
          </div>

          {dataIncomplete.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <div className="inline-block p-3 bg-green-50 text-green-600 rounded-full">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-slate-700">Semua Data Siswa Lengkap!</p>
              <p className="text-[11px] text-slate-400">100% siswa memiliki NIS, NISN, NIK, Foto, dan data wali.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {dataIncomplete.map((s) => {
                const missing = [];
                if (!s.nisn) missing.push('NISN');
                if (!s.nik) missing.push('NIK');
                if (!s.foto || s.foto.includes('placeholder')) missing.push('Foto');
                if (!s.nama_ayah && !s.nama_ibu) missing.push('Ortu');

                return (
                  <div 
                    id={`incomplete-siswa-${s.id_siswa}`}
                    key={s.id_siswa}
                    onClick={() => onSelectSiswa(s.id_siswa)}
                    className="group border border-slate-100 hover:border-amber-300 bg-slate-50 hover:bg-amber-50/20 p-3 rounded-xl transition duration-200 cursor-pointer flex items-start justify-between gap-2"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 group-hover:text-amber-800 transition">{s.nama}</h4>
                      <p className="text-[10px] text-slate-500">{s.jurusan} • Kelas {s.kelas_masuk}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {missing.map((m) => (
                          <span key={m} className="bg-red-50 text-[9px] font-semibold text-rose-700 px-1.5 py-0.5 rounded border border-rose-100">
                            {m} Kosong
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded shrink-0 font-medium font-sans">Lengkapi</span>
                  </div>
                );
              })}
            </div>
          )}

          <button
            id="btn-goto-siswa"
            onClick={() => onNavigate('Data Siswa Lengkap')}
            className="w-full text-center py-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 text-slate-600 hover:text-emerald-850 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Akses Seluruh Portal Siswa
          </button>
        </div>

      </div>

      {/* Foot Grid: Logs Activity */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Catatan Aktivitas Sistem (Log Aktivitas)</h3>
              <p className="text-xs text-slate-500">Log elektronik audit administrasi madrasah terenkripsi lokal</p>
            </div>
          </div>
          <span className="text-xs font-medium font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded">Secure Mode</span>
        </div>

        <div className="flow-root">
          <ul className="-mb-8">
            {logs.slice(0, 5).map((logItem, logIdx) => (
              <li key={logItem.id_log}>
                <div className="relative pb-8">
                  {logIdx !== logs.slice(0, 5).length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3 items-start">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                        logItem.tipe === 'create' ? 'bg-green-50 text-green-700' :
                        logItem.tipe === 'update' ? 'bg-amber-50 text-amber-700' :
                        logItem.tipe === 'delete' ? 'bg-red-50 text-red-700' :
                        logItem.tipe === 'import' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {logItem.tipe === 'create' && <Users className="h-4 w-4" />}
                        {logItem.tipe === 'update' && <Activity className="h-4 w-4" />}
                        {logItem.tipe === 'delete' && <AlertTriangle className="h-4 w-4" />}
                        {logItem.tipe === 'import' && <BookOpen className="h-4 w-4" />}
                        {logItem.tipe === 'print' && <Award className="h-4 w-4" />}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-xs text-slate-700">
                          {logItem.aktivitas}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Oleh {logItem.operator} • <span className="bg-slate-100 px-1.5 py-0.2 rounded font-mono text-[9px]">{logItem.role}</span>
                        </p>
                      </div>
                      <div className="text-right text-[10px] whitespace-nowrap text-slate-400">
                        <time dateTime={logItem.timestamp}>{formatTimeDifference(logItem.timestamp)}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
