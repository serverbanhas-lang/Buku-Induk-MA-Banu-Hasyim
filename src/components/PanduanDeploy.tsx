/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Book, Compass, Server, Terminal, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function PanduanDeploy() {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden text-sm">
      
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-b border-amber-400/50">
        <div className="flex items-center gap-2">
          <Book className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-extrabold text-white">Panduan Penggunaan & Protokol Deploy SIBIMA</h2>
        </div>
        <p className="text-xs text-slate-300 mt-1 font-sans">
          Dokumentasi teknis resmi pengoperasian sistem dan prosedur rilis madrasah mandiri
        </p>
      </div>

      <div className="p-6 space-y-8">
        
        {/* PART 1: GUIDELINES FOR SYSTEM ROLES */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-emerald-900 tracking-wide uppercase border-b border-slate-100 pb-1.5 flex items-center gap-2">
            <Compass className="h-4.5 w-4.5 text-emerald-700" />
            <span>I. Petunjuk Penggunaan Sistem (User Guide)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[10px] bg-emerald-100 font-extrabold text-emerald-800 px-2 py-0.5 rounded-full font-mono">1. LOGIN & HAK AKSES</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Gunakan menu <strong>Dasbor Login</strong> untuk memilih hak akses Anda.
              </p>
              <ul className="text-[11px] text-slate-550 list-disc list-inside space-y-1">
                <li><strong>Operator:</strong> Kontrol penuh kelola siswa & Master Konfigurasi.</li>
                <li><strong>Wali Kelas:</strong> Menilai rapor semester 1-6 khusus kelas binaannya.</li>
                <li><strong>Kamad:</strong> Pratinjau digital & menandatangani ijazah.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[10px] bg-amber-100 font-extrabold text-amber-800 px-2 py-0.5 rounded-full font-mono">2. INPUT MASTER CONFIG</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Akses menu <strong>Master Konfigurasi</strong> untuk menyusun struktur madrasah sebelum menambah data siswa:
              </p>
              <ul className="text-[11px] text-slate-550 list-disc list-inside space-y-1">
                <li>Input <strong>Kelas</strong> (Nama, Jurusan, Wali Kelas).</li>
                <li>Input <strong>Jurusan</strong> peminatan madrasah.</li>
                <li>Ganti <strong>Tahun Pelajaran</strong> aktif untuk register rapor berurutan.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[10px] bg-blue-100 font-extrabold text-blue-800 px-2 py-0.5 rounded-full font-mono">3. GOOGLE SHEETS SYNC</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Simpan database cadangan ke cloud melalu menu <strong>Sinkron Google Sheets</strong>:
              </p>
              <ul className="text-[11px] text-slate-550 list-disc list-inside space-y-1">
                <li>Klik <strong>Koneksikan Akun</strong> untuk otorisasi akses Drive/Sheets.</li>
                <li>Klik <strong>Generate Google Sheet</strong> untuk sinkron data.</li>
                <li>Atau gunakan <strong>Copy-Paste Tabular</strong> instan tanpa kuota internet.</li>
              </ul>
            </div>

          </div>
        </div>

        {/* PART 2: COMPLIANT DEPLOYMENT STEPS */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase border-b border-slate-100 pb-1.5 flex items-center gap-2">
            <Server className="h-4.5 w-4.5 text-amber-500" />
            <span>II. Protokol Deploy & Produksi (Deployment Protocol)</span>
          </h3>

          <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl font-mono text-xs space-y-4 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-amber-400 font-bold">📂 SIBIMA DIGITAL CLI DEPLOY</span>
              <span className="text-slate-500 text-[10px]">v1.4.0 • Node.js React SPA</span>
            </div>

            <div className="space-y-3">
              <p className="text-slate-400">// Langkah 1: Pasang semua dependensi npm di mesin server</p>
              <p className="text-green-400 bg-black/45 p-2 rounded border border-emerald-900/60 font-medium">
                $ npm install
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-slate-400">// Langkah 2: Lakukan build produksi untuk mengompilasi bundel CSS & TS</p>
              <p className="text-green-400 bg-black/45 p-2 rounded border border-emerald-900/60 font-medium">
                $ npm run build
              </p>
              <p className="text-[11px] text-slate-500">
                Langkah ini menguji kebenaran tipe TypeScript dan menyembur berkas statis terkompresi di folder <code className="text-slate-300">/dist</code>.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-slate-400">// Langkah 3: Menghidupkan server atau lakukan peninjauan lokal</p>
              <p className="text-green-400 bg-black/45 p-2 rounded border border-emerald-900/60 font-medium">
                $ npm run preview
              </p>
            </div>
          </div>
        </div>

        {/* PART 3: HOISTING OPTIONS */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">Pilih Opsi Provider Deployment:</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-bold text-slate-800">Opsi A: Hoisting Vercel (Paling Direkomendasikan)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vercel merupakan cloud host gratis paling cocok untuk React + Vite.
                Cukup hubungkan repositori GitHub Anda di dashboard Vercel, pilih proyek framework **Vite**, dan klik **Deploy**. 
                Vercel akan selesai mengonfigurasikan segalanya dalam waktu kurang dari 1 menit.
              </p>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-bold text-slate-800">Opsi B: Cloud Run / Docker</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gunakan container Docker jika ingin mendeploy di server internal Kementerian Agama atau Cloud Run Google. 
                Pastikan image mendengarkan port yang benar agar rute ingress berjalan lancar.
              </p>
            </div>

          </div>
        </div>

        {/* Checklist Certification */}
        <div className="bg-emerald-50/60 p-4 border border-emerald-100 rounded-2xl flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-850 leading-relaxed">
            <strong>Sertifikasi Kepatuhan RDM SIBIMA:</strong> Sistem ini menggunakan komputasi terdistribusi client-side hemat daya, 
            sehingga dapat dideploy secara aman tanpa membebani server fisik madrasah. Seluruh penyimpanan log dan entri siswa berada 
            pada lingkungan sandboxed yang aman demi privasi siswa.
          </div>
        </div>

      </div>
    </div>
  );
}
