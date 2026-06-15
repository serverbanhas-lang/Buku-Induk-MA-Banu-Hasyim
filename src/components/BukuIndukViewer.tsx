/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Siswa, Kelas, NilaiSemester, NilaiIjazah, UserRole } from '../types';
import { FileText, Printer, ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Clock, Calendar, MapPin, Landmark, Award } from 'lucide-react';

interface BukuIndukViewerProps {
  siswa: Siswa;
  kelas: Kelas[];
  nilaiSemester: NilaiSemester[];
  nilaiIjazah: NilaiIjazah[];
  currentRole: UserRole;
  onBackToList: () => void;
  onTriggerPrint: (siswaId: string) => void;
}

export default function BukuIndukViewer({ siswa, kelas, nilaiSemester, nilaiIjazah, currentRole, onBackToList, onTriggerPrint }: BukuIndukViewerProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Read matching values
  const currentKelasObj = kelas.find(k => k.id_kelas === siswa.id_kelas);
  const classLabel = currentKelasObj ? currentKelasObj.nama_kelas : siswa.id_kelas;
  const waliKelasLabel = currentKelasObj ? currentKelasObj.wali_kelas : '-';

  // Filter student grades
  const studentGrades = nilaiSemester.filter(n => n.id_siswa === siswa.id_siswa);
  const studentIjazah = nilaiIjazah.filter(i => i.id_siswa === siswa.id_siswa);

  // Group semester grades by semester index (1-6)
  const gradesBySemester = (semNum: number) => {
    return studentGrades.filter(g => g.semester === semNum);
  };

  const getBirthDateLabel = (dateStr: string) => {
    if (!dateStr) return '-';
    // Format to Indonesian style list: Sidoarjo, 12 April 2008
    const event = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return event.toLocaleDateString('id-ID', options);
  };

  return (
    <div className="space-y-6">
      
      {/* Action Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
        <button
          id="btn-back-to-list"
          onClick={onBackToList}
          className="flex items-center space-x-1.5 py-1.5 px-3.5 hover:bg-slate-50 border border-slate-205 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-bold transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 text-slate-500" />
          <span>Kembali ke Daftar</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Print button */}
          <button
            id={`btn-trigger-print-${siswa.id_siswa}`}
            onClick={() => onTriggerPrint(siswa.id_siswa)}
            className="flex items-center space-x-1.5 py-1.5 px-4 bg-gradient-to-r from-[#0F7B6C] to-[#0A564B] hover:text-white active:scale-95 text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-all border border-emerald-800"
          >
            <Printer className="h-4 w-4 text-amber-300" />
            <span>Cetak Buku Induk Resmi (PDF)</span>
          </button>
        </div>
      </div>

      {/* Main interactive official book container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar Panel */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-4 h-fit">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Daftar Halaman</h3>
          
          <nav className="space-y-1.5">
            {[
              { num: 1, label: 'Halaman 1: Identitas & Ortu' },
              { num: 2, label: 'Halaman 2: Riwayat Sekolah' },
              { num: 3, label: 'Halaman 3: Rapor Semester 1-2' },
              { num: 4, label: 'Halaman 4: Rapor Semester 3-4' },
              { num: 5, label: 'Halaman 5: Rapor Semester 5-6' },
              { num: 6, label: 'Halaman 6: Transkrip Ijazah' },
            ].map(page => (
              <button
                id={`btn-page-nav-${page.num}`}
                key={page.num}
                onClick={() => setCurrentPage(page.num)}
                className={`w-full text-left font-sans text-xs px-3 py-2.5 rounded-lg font-bold border transition duration-150 flex items-center justify-between ${
                  currentPage === page.num
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'text-slate-650 hover:text-slate-900 border-transparent hover:bg-slate-50/50'
                }`}
              >
                <span>{page.label}</span>
                {currentPage === page.num && (
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span>
                )}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-3 bg-emerald-950/5 text-emerald-900 p-3 rounded-xl border border-emerald-100/60 text-[10.5px] leading-relaxed">
              <Landmark className="h-5 w-5 text-[#D4AF37] shrink-0" />
              <span>
                <strong>SIBIMA Banu Hasyim:</strong> Menghasilkan lembar buku induk resmi berukuran A4 Portrait sesuai instruksi kepala madrasah.
              </span>
            </div>
          </div>
        </div>

        {/* Breathtaking luxury gold border paper simulation */}
        <div className="bg-white rounded-3xl lg:col-span-3 border-8 border-double border-emerald-800 p-6 sm:p-10 shadow-xl relative overflow-hidden min-h-[750px]">
          
          {/* Subtle watermarked Islamic crest background */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-600 via-white to-white bg-grid pointer-events-none"></div>
          
          {/* Top Gold Line Header */}
          <div className="flex flex-col items-center text-center border-b-2 border-emerald-700 pb-5 mb-6 relative">
            <div className="p-1 px-4 bg-emerald-800 text-amber-300 font-mono text-[9px] font-bold tracking-[0.25em] rounded-full uppercase mb-2">
              MA BANU HASYIM SIDOARJO
            </div>
            <h2 className="text-xl font-black text-emerald-950 font-serif tracking-wide uppercase">
              BUKU INDUK DIGITAL MADRASAH
            </h2>
            <div className="w-16 h-0.5 bg-[#D4AF37] mt-1.5 mb-1"></div>
            <p className="text-[10px] text-slate-400 font-mono">STATUS DATA: {siswa.nisn ? 'TERVERIFIKASI SINKRON RDM' : 'DRAFT'}</p>
          </div>

          {/* PAGE 1: IDENTITAS LENGKAP & ALAMAT */}
          {currentPage === 1 && (
            <div className="space-y-6">
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                
                {/* 3x4 Photo block */}
                <div className="w-32 border-4 border-emerald-900/10 p-1 bg-white shadow shrink-0 rounded-lg mx-auto md:mx-0">
                  <div className="aspect-[3/4] bg-slate-50 overflow-hidden relative border border-slate-200">
                    {siswa.foto ? (
                      <img 
                        src={siswa.foto} 
                        alt={siswa.nama} 
                        className="h-full w-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-slate-400 text-center p-2 font-mono">
                        Belum ada Pasfoto 3x4
                      </div>
                    )}
                  </div>
                  <p className="text-center font-mono text-[9px] text-slate-400 mt-1 uppercase">Pasfoto 3x4</p>
                </div>

                {/* Core Personal register */}
                <div className="flex-1 w-full space-y-4">
                  <h3 className="text-xs font-bold text-emerald-850 uppercase tracking-wider border-b border-slate-100 pb-1">I. KETERANGAN IDENTITAS SISWA</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-slate-700">
                    <div>
                      <p className="font-semibold text-slate-450 uppercase text-[9.5px]">Nama Lengkap</p>
                      <p className="font-bold text-slate-900 border-b border-dotted border-slate-200 pb-0.5">{siswa.nama}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-450 uppercase text-[9.5px]">Nomor Induk Siswa / NISN</p>
                      <p className="font-bold text-slate-900 border-b border-dotted border-slate-200 pb-0.5">{siswa.nis} / {siswa.nisn}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-450 uppercase text-[9.5px]">NIK Siswa (KTP/KK)</p>
                      <p className="font-bold text-slate-900 border-b border-dotted border-slate-200 pb-0.5">{siswa.nik || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-450 uppercase text-[9.5px]">Tempat, Tanggal Lahir</p>
                      <p className="font-bold text-slate-900 border-b border-dotted border-slate-200 pb-0.5">{siswa.tempat_lahir}, {getBirthDateLabel(siswa.tgl_lahir)}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-450 uppercase text-[9.5px]">Jenis Kelamin / Agama</p>
                      <p className="font-bold text-slate-900 border-b border-dotted border-slate-200 pb-0.5">{siswa.jk === 'L' ? 'Laki-Laki' : 'Perempuan'} / {siswa.agama || 'Islam'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-450 uppercase text-[9.5px]">Status Kekeluargaan</p>
                      <p className="font-bold text-slate-900 border-b border-dotted border-slate-200 pb-0.5">Anak {siswa.status_anak || 'Kandung'} (Anak ke-{siswa.anak_ke} dari {siswa.jml_saudara + 1} bersaudara)</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-450 uppercase text-[9.5px]">Hobi Siswa / Cita-cita</p>
                      <p className="font-bold text-slate-900 border-b border-dotted border-slate-200 pb-0.5">{siswa.hobi || '-'} / {siswa.cita_cita || '-'}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Alamat Block */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-emerald-850 uppercase tracking-wider border-b border-slate-100 pb-1">II. KETERANGAN TEMPAT TINGGAL</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-slate-700">
                  <div className="md:col-span-2">
                    <p className="font-semibold text-slate-450 uppercase text-[9.5px]">Alamat Lengkap</p>
                    <p className="font-bold text-slate-900 border-b border-dotted border-slate-200 pb-0.5">{siswa.alamat_lengkap || '-'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-450 uppercase text-[9.5px]">Desa / Kelurahan / Kecamatan</p>
                    <p className="font-bold text-slate-900 border-b border-dotted border-slate-200 pb-0.5">{siswa.desa || '-'} / {siswa.kecamatan || '-'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-450 uppercase text-[9.5px]">Kabupaten / Provinsi / Kode Pos</p>
                    <p className="font-bold text-slate-900 border-b border-dotted border-slate-200 pb-0.5">{siswa.kabupaten || '-'} / {siswa.provinsi || '-'} (Pos: {siswa.kode_pos || '-'})</p>
                  </div>
                </div>
              </div>

              {/* OrangTua Block */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-emerald-850 uppercase tracking-wider border-b border-slate-100 pb-1">III. KETERANGAN ORANG TUA KANDUNG & WALI</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
                  
                  {/* Ayah */}
                  <div className="space-y-2">
                    <p className="font-bold text-slate-800 text-[10px] uppercase font-mono tracking-wider text-emerald-800">▲ Data Ayah Kandung</p>
                    <div className="space-y-1.5">
                      <p className="font-semibold text-slate-450 uppercase text-[9px]">Nama Ayah: <strong className="text-slate-800 font-sans">{siswa.nama_ayah || 'Belum diisi'}</strong></p>
                      <p className="font-semibold text-slate-450 uppercase text-[9px]">NIK Ayah: <span className="text-slate-800 font-mono">{siswa.nik_ayah || '-'}</span></p>
                      <p className="font-semibold text-slate-450 uppercase text-[9px]">Pendidikan / Pekerjaan: <span className="text-slate-800 font-sans">{siswa.pendidikan_ayah || '-'} / {siswa.pekerjaan_ayah || '-'}</span></p>
                      <p className="font-semibold text-slate-450 uppercase text-[9px]">Kategori Penghasilan: <span className="text-slate-800 font-sans">{siswa.penghasilan_ayah || 'Tidak Berpenghasilan'}</span></p>
                    </div>
                  </div>

                  {/* Ibu */}
                  <div className="space-y-2">
                    <p className="font-bold text-slate-800 text-[10px] uppercase font-mono tracking-wider text-emerald-800">▲ Data Ibu Kandung</p>
                    <div className="space-y-1.5">
                      <p className="font-semibold text-slate-450 uppercase text-[9px]">Nama Ibu: <strong className="text-slate-800 font-sans">{siswa.nama_ibu || 'Belum diisi'}</strong></p>
                      <p className="font-semibold text-slate-450 uppercase text-[9px]">NIK Ibu: <span className="text-slate-800 font-mono">{siswa.nik_ibu || '-'}</span></p>
                      <p className="font-semibold text-slate-450 uppercase text-[9px]">Pendidikan / Pekerjaan: <span className="text-slate-800 font-sans">{siswa.pendidikan_ibu || '-'} / {siswa.pekerjaan_ibu || '-'}</span></p>
                      <p className="font-semibold text-slate-450 uppercase text-[9px]">Kategori Penghasilan: <span className="text-slate-800 font-sans">{siswa.penghasilan_ibu || 'Tidak Berpenghasilan'}</span></p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* PAGE 2: RIWAYAT PENDIDIKAN */}
          {currentPage === 2 && (
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-emerald-850 uppercase tracking-wider border-b border-emerald-700 pb-1">IV. KETERANGAN RIWAYAT PENDIDIKAN / MADRASAH</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 text-xs text-slate-700 pt-3">
                
                <div>
                  <p className="font-semibold text-slate-450 uppercase text-[9.5px]">Tahun Masuk Madrasah Aliyah</p>
                  <p className="text-sm font-bold text-slate-900 border-b border-dotted border-slate-200 pb-1 font-sans">{siswa.tahun_masuk || '-'}</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-450 uppercase text-[9.5px]">Asal Sekolah SMP / MTs</p>
                  <p className="text-sm font-bold text-slate-900 border-b border-dotted border-slate-200 pb-1 font-sans">{siswa.asal_sekolah || '-'}</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-450 uppercase text-[9.5px]">Kelas & Jurusan Bidang Studi</p>
                  <p className="text-sm font-bold text-slate-900 border-b border-dotted border-slate-200 pb-1 font-sans">
                    Kelas {classLabel} ({siswa.jurusan})
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-slate-450 uppercase text-[9.5px]">Wali Kelas Penanggung Jawab</p>
                  <p className="text-sm font-bold text-slate-900 border-b border-dotted border-slate-200 pb-1 font-sans">{waliKelasLabel}</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-450 uppercase text-[9.5px]">Nomor SKHUN SMP / MTs</p>
                  <p className="text-sm font-bold text-slate-900 border-b border-dotted border-slate-200 pb-1 font-mono tracking-wide">{siswa.no_skhun || 'Belum diisi'}</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-450 uppercase text-[9.5px]">Nomor Seri Surat Ijazah SMP / MTs</p>
                  <p className="text-sm font-bold text-slate-900 border-b border-dotted border-slate-200 pb-1 font-mono tracking-wide">{siswa.no_ijazah_smp || 'Belum diisi'}</p>
                </div>

              </div>

              {/* Legal Stamp Notice */}
              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 mt-10 space-y-2 text-xs">
                <p className="font-semibold text-emerald-900 flex items-center gap-1.5 font-sans">
                  <Landmark className="h-4 w-4 text-[#D4AF37]" />
                  MA BANU HASYIM SIDOARJO • NOTULENSI
                </p>
                <p className="text-slate-650 leading-relaxed">
                  Buku Induk Digital madrasah adalah instrumen rekapitulasi data abadi. Diperbolehkan bagi operator untuk merubah riwayat masukan siswa apabila terjadi pembaharuan KK/KTP yang dilegalisir dari Kantor Catatan Sipil setempat.
                </p>
              </div>

            </div>
          )}

          {/* PAGE 3: RAPOR SEMESTER 1 - 2 */}
          {currentPage === 3 && (
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-emerald-850 uppercase tracking-wider border-b border-emerald-700 pb-1">V. ARSIP NILAI RAPOR DIGITAL MADRASAH (SMT 1 & 2)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                
                {/* Semester 1 */}
                <div className="space-y-2">
                  <p className="font-extrabold text-[#0F7B6C] bg-emerald-50 px-3 py-1 rounded text-xs font-sans">
                    NILAI RAPOR SEMESTER 1
                  </p>
                  <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm text-[11px]">
                    <div className="grid grid-cols-4 bg-slate-50 font-bold border-b border-slate-150 p-2 font-mono">
                      <div className="col-span-3 text-slate-600">Mata Pelajaran Kurikulum</div>
                      <div className="text-center text-slate-600">Nilai</div>
                    </div>
                    {gradesBySemester(1).map(g => (
                      <div key={g.id_nilai} className="grid grid-cols-4 p-2 border-b border-slate-50 hover:bg-neutral-50/30">
                        <div className="col-span-3 font-medium text-slate-700">{g.mapel}</div>
                        <div className="text-center font-bold text-emerald-950 font-mono">{g.nilai}</div>
                      </div>
                    ))}
                    {gradesBySemester(1).length === 0 && (
                      <div className="p-4 text-center text-slate-400 italic">Belum ada nilai terinput</div>
                    )}
                  </div>
                </div>

                {/* Semester 2 */}
                <div className="space-y-2">
                  <p className="font-extrabold text-[#0F7B6C] bg-emerald-50 px-3 py-1 rounded text-xs font-sans">
                    NILAI RAPOR SEMESTER 2
                  </p>
                  <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm text-[11px]">
                    <div className="grid grid-cols-4 bg-slate-50 font-bold border-b border-slate-150 p-2 font-mono">
                      <div className="col-span-3 text-slate-600">Mata Pelajaran Kurikulum</div>
                      <div className="text-center text-slate-600">Nilai</div>
                    </div>
                    {gradesBySemester(2).map(g => (
                      <div key={g.id_nilai} className="grid grid-cols-4 p-2 border-b border-slate-50 hover:bg-neutral-50/30">
                        <div className="col-span-3 font-medium text-slate-700">{g.mapel}</div>
                        <div className="text-center font-bold text-emerald-950 font-mono">{g.nilai}</div>
                      </div>
                    ))}
                    {gradesBySemester(2).length === 0 && (
                      <div className="p-4 text-center text-slate-400 italic">Belum ada nilai terinput</div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* PAGE 4: RAPOR SEMESTER 3 - 4 */}
          {currentPage === 4 && (
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-emerald-850 uppercase tracking-wider border-b border-emerald-700 pb-1">V. ARSIP NILAI RAPOR DIGITAL MADRASAH (SMT 3 & 4)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                
                {/* Semester 3 */}
                <div className="space-y-2">
                  <p className="font-extrabold text-[#0F7B6C] bg-emerald-50 px-3 py-1 rounded text-xs font-sans">
                    NILAI RAPOR SEMESTER 3
                  </p>
                  <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm text-[11px]">
                    <div className="grid grid-cols-4 bg-slate-50 font-bold border-b border-slate-150 p-2 font-mono">
                      <div className="col-span-3 text-slate-600">Mata Pelajaran Kurikulum</div>
                      <div className="text-center text-slate-600">Nilai</div>
                    </div>
                    {gradesBySemester(3).map(g => (
                      <div key={g.id_nilai} className="grid grid-cols-4 p-2 border-b border-slate-50 hover:bg-neutral-50/30">
                        <div className="col-span-3 font-medium text-slate-700">{g.mapel}</div>
                        <div className="text-center font-bold text-emerald-950 font-mono">{g.nilai}</div>
                      </div>
                    ))}
                    {gradesBySemester(3).length === 0 && (
                      <div className="p-4 text-center text-slate-400 italic">Nilai belum terinput pasca kelulusan kelas X</div>
                    )}
                  </div>
                </div>

                {/* Semester 4 */}
                <div className="space-y-2">
                  <p className="font-extrabold text-[#0F7B6C] bg-emerald-50 px-3 py-1 rounded text-xs font-sans">
                    NILAI RAPOR SEMESTER 4
                  </p>
                  <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm text-[11px]">
                    <div className="grid grid-cols-4 bg-slate-50 font-bold border-b border-slate-150 p-2 font-mono">
                      <div className="col-span-3 text-slate-600">Mata Pelajaran Kurikulum</div>
                      <div className="text-center text-slate-600">Nilai</div>
                    </div>
                    {gradesBySemester(4).map(g => (
                      <div key={g.id_nilai} className="grid grid-cols-4 p-2 border-b border-slate-50 hover:bg-neutral-50/30">
                        <div className="col-span-3 font-medium text-slate-700">{g.mapel}</div>
                        <div className="text-center font-bold text-emerald-950 font-mono">{g.nilai}</div>
                      </div>
                    ))}
                    {gradesBySemester(4).length === 0 && (
                      <div className="p-4 text-center text-slate-400 italic">Nilai belum terinput pasca kelulusan kelas X</div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* PAGE 5: RAPOR SEMESTER 5 - 6 */}
          {currentPage === 5 && (
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-emerald-850 uppercase tracking-wider border-b border-emerald-700 pb-1">V. ARSIP NILAI RAPOR DIGITAL MADRASAH (SMT 5 & 6)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                
                {/* Semester 5 */}
                <div className="space-y-2">
                  <p className="font-extrabold text-[#0F7B6C] bg-emerald-50 px-3 py-1 rounded text-xs font-sans">
                    NILAI RAPOR SEMESTER 5
                  </p>
                  <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm text-[11px]">
                    <div className="grid grid-cols-4 bg-slate-50 font-bold border-b border-slate-150 p-2 font-mono">
                      <div className="col-span-3 text-slate-600">Mata Pelajaran Kurikulum</div>
                      <div className="text-center text-slate-600">Nilai</div>
                    </div>
                    {gradesBySemester(5).map(g => (
                      <div key={g.id_nilai} className="grid grid-cols-4 p-2 border-b border-slate-50 hover:bg-neutral-50/30">
                        <div className="col-span-3 font-medium text-slate-700">{g.mapel}</div>
                        <div className="text-center font-bold text-emerald-950 font-mono">{g.nilai}</div>
                      </div>
                    ))}
                    {gradesBySemester(5).length === 0 && (
                      <div className="p-4 text-center text-slate-400 italic">Hanya terisi oleh siswa Kelas XII</div>
                    )}
                  </div>
                </div>

                {/* Semester 6 */}
                <div className="space-y-2">
                  <p className="font-extrabold text-[#0F7B6C] bg-emerald-50 px-3 py-1 rounded text-xs font-sans">
                    NILAI RAPOR SEMESTER 6
                  </p>
                  <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm text-[11px]">
                    <div className="grid grid-cols-4 bg-slate-50 font-bold border-b border-slate-150 p-2 font-mono">
                      <div className="col-span-3 text-slate-600">Mata Pelajaran Kurikulum</div>
                      <div className="text-center text-slate-600">Nilai</div>
                    </div>
                    {gradesBySemester(6).map(g => (
                      <div key={g.id_nilai} className="grid grid-cols-4 p-2 border-b border-slate-50 hover:bg-neutral-50/30">
                        <div className="col-span-3 font-medium text-slate-700">{g.mapel}</div>
                        <div className="text-center font-bold text-emerald-950 font-mono">{g.nilai}</div>
                      </div>
                    ))}
                    {gradesBySemester(6).length === 0 && (
                      <div className="p-4 text-center text-slate-400 italic">Hanya terisi oleh siswa Kelas XII</div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* PAGE 6: NILAI IJAZAH */}
          {currentPage === 6 && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-emerald-700 pb-2">
                <h3 className="text-xs font-bold text-emerald-850 uppercase tracking-wider">VI. TRANSKRIP NILAI IJAZAH KELULUSAN MADRASAH</h3>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono font-bold border border-amber-100">LAST PAGE OF RECORD</span>
              </div>

              <div className="max-w-xl mx-auto pt-3 space-y-4">
                
                <div className="border border-slate-105 rounded-xl overflow-hidden shadow-sm text-xs">
                  <div className="grid grid-cols-4 bg-emerald-900 text-white font-bold p-3 font-sans">
                    <div className="col-span-3">Mata Pelajaran Standard Kelulusan</div>
                    <div className="text-center text-amber-350">Nilai Ijazah</div>
                  </div>
                  {studentIjazah.map(ijz => (
                    <div key={ijz.id_ijazah} className="grid grid-cols-4 p-2.5 border-b border-slate-100 bg-emerald-50/10 hover:bg-emerald-55/20 transition duration-150">
                      <div className="col-span-3 font-bold text-slate-700">{ijz.mapel}</div>
                      <div className="text-center font-black text-emerald-950 font-mono">{ijz.nilai}</div>
                    </div>
                  ))}
                  {studentIjazah.length === 0 && (
                    <div className="p-6 text-center text-slate-400 italic">
                      Nilai Ijazah Kelulusan belum dirumuskan atau siswa bersangkutan masih menempuh Kelas X/XI.
                    </div>
                  )}
                </div>

                {/* Foot signatures of Kepala Madrasah official */}
                <div className="pt-6 grid grid-cols-2 gap-4 text-xs font-sans text-slate-700">
                  <div className="flex flex-col items-center justify-center p-3 text-center border border-slate-100 bg-slate-50/50 rounded-xl relative overflow-hidden min-h-[140px]">
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 mb-2">TID CAP JARI 3 JARI</p>
                    <div className="w-16 h-20 border-2 border-dashed border-slate-350 rounded flex items-center justify-center text-[10px] text-slate-300 font-mono">
                      Pasfoto 3x4
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-between text-center min-h-[140px]">
                    <div>
                      <p className="text-[10px] text-slate-450">Sidoarjo, 18 Juni 2026</p>
                      <p className="font-bold text-slate-800 text-[10.5px]">Kepala Madrasah MA Banu Hasyim</p>
                    </div>

                    {/* Official Stamp & Sign watermark overlay */}
                    <div className="relative mt-2 mb-2 select-none pointer-events-none">
                      <div className="text-emerald-600/70 absolute -top-4 -left-12 rotate-12 border-2 border-double border-emerald-500/50 rounded-full p-2 text-[9px] font-bold tracking-tight uppercase">
                        ★ MA BANU HASYIM ★
                      </div>
                      <span className="font-serif italic font-light text-slate-350 text-xs">A_Nuruddin_M_Pd_I</span>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 border-b border-slate-800 pb-0.5">K.H. Nuruddin, M.Pd.I.</p>
                      <p className="text-[9px] text-slate-400 font-mono">NIP. 196904121995031002</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Book Bottom Page footer */}
          <div className="border-t border-slate-100 mt-8 pt-4 flex items-center justify-between text-[11px] text-slate-450 font-mono">
            <span>SIBIMA DIGITAL • MA BANU HASYIM</span>
            <span>Halaman {currentPage} dari 6</span>
          </div>

        </div>

      </div>

    </div>
  );
}
