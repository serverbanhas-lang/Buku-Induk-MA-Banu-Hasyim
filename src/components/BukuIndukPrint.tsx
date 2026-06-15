/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Siswa, Kelas, NilaiSemester, NilaiIjazah } from '../types';
import { Printer, X, FileText, CheckCircle2 } from 'lucide-react';

interface BukuIndukPrintProps {
  siswa: Siswa;
  kelas: Kelas[];
  nilaiSemester: NilaiSemester[];
  nilaiIjazah: NilaiIjazah[];
  onClosePrint: () => void;
}

export default function BukuIndukPrint({ siswa, kelas, nilaiSemester, nilaiIjazah, onClosePrint }: BukuIndukPrintProps) {
  // Trigger print onload or when modal finishes mounting
  useEffect(() => {
    // Add print styles dynamically
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @media print {
        body {
          background: white !important;
          color: black !important;
          font-family: "Times New Roman", Times, serif !important;
        }
        .no-print {
          display: none !important;
        }
        .print-page {
          margin: 0 !important;
          padding: 2cm !important;
          box-shadow: none !important;
          border: none !important;
          page-break-after: always !important;
          break-after: page !important;
          min-height: 100vh !important;
        }
        .print-border {
          border: 4px double #000000 !important;
          padding: 1.5cm !important;
        }
      }
    `;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  const currentKelasObj = kelas.find(k => k.id_kelas === siswa.id_kelas);
  const classLabel = currentKelasObj ? currentKelasObj.nama_kelas : siswa.id_kelas;
  const waliKelasLabel = currentKelasObj ? currentKelasObj.wali_kelas : '-';

  const studentGrades = nilaiSemester.filter(n => n.id_siswa === siswa.id_siswa);
  const studentIjazah = nilaiIjazah.filter(i => i.id_siswa === siswa.id_siswa);

  const getBirthLabel = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getGradesBySem = (semNum: number) => {
    return studentGrades.filter(g => g.semester === semNum);
  };

  const launchNativePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-y-auto pb-12 relative z-50">
      
      {/* Top sticky non-printable control header bar */}
      <div className="no-print bg-emerald-900 border-b border-[#D4AF37] p-4 sticky top-0 flex items-center justify-between shadow-xl z-50">
        <div className="flex items-center space-x-2.5">
          <FileText className="h-5 w-5 text-amber-400" />
          <div>
            <h1 className="font-extrabold text-sm text-white font-sans">Pratinjau Cetak Buku Induk Resmi</h1>
            <p className="text-[10.5px] text-emerald-100">
              Format: A4 Portrait • {siswa.nama} ({siswa.nisn})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-print-action"
            onClick={launchNativePrint}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/15 cursor-pointer transition active:scale-95"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Sekarang (Print / PDF)</span>
          </button>
          
          <button
            id="btn-print-close"
            onClick={onClosePrint}
            className="p-1.5 hover:bg-white/10 text-slate-350 hover:text-white rounded-lg transition"
            title="Keluar Pratinjau"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main layout frame */}
      <div className="max-w-[800px] mx-auto p-4 sm:p-8 space-y-8 text-black">
        
        {/* PAGE 1: COVER IDENTITAS & KETERANGAN DIRI */}
        <div className="print-page bg-white p-8 sm:p-12 shadow-2xl rounded-xl border border-slate-100 space-y-8">
          <div className="print-border border-4 border-double border-emerald-900 p-6 space-y-6">
            
            {/* Kop Madrasah */}
            <div className="flex flex-col items-center text-center border-b-2 border-slate-900 pb-4">
              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-600">KEMENTERIAN AGAMA REPUBLIK INDONESIA</span>
              <h2 className="text-sm font-bold tracking-normal text-slate-800">MADRASAH ALIYAH BANU HASYIM</h2>
              <p className="text-[9.5px] text-slate-500 font-serif lowercase italic">Pepe, Sedati, Kabupaten Sidoarjo, Jawa Timur 61253</p>
              <div className="w-20 h-0.5 bg-slate-900 mt-2"></div>
              <h1 className="text-base font-extrabold tracking-wide uppercase mt-3 font-serif">BUKU INDUK SISWA MADRASAH ALIYAH</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Photo placeholder 3x4 */}
              <div className="w-32 border-2 border-slate-800 p-1 bg-white shrink-0 mx-auto md:mx-0">
                <div className="aspect-[3/4] bg-slate-50 overflow-hidden relative">
                  {siswa.foto ? (
                    <img 
                      src={siswa.foto} 
                      alt={siswa.nama} 
                      className="h-full w-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400 text-center p-2 font-mono">
                      FOTO 3x4
                    </div>
                  )}
                </div>
              </div>

              {/* Data personal */}
              <div className="flex-1 space-y-4">
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">I. IDENTITAS PESERTA DIDIK</p>
                <table className="w-full text-xs text-left">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-bold text-slate-550 w-36">Nama Siswa</td>
                      <td className="py-1.5 font-black text-slate-900 uppercase">: {siswa.nama}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-bold text-slate-550">Nomor Induk / NISN</td>
                      <td className="py-1.5 font-bold text-slate-900">: {siswa.nis} / {siswa.nisn}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-bold text-slate-550">NIK (KTP/KK)</td>
                      <td className="py-1.5 font-mono text-slate-800">: {siswa.nik || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-bold text-slate-550">Tempat, Tgl Lahir</td>
                      <td className="py-1.5 text-slate-800">: {siswa.tempat_lahir}, {getBirthLabel(siswa.tgl_lahir)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-bold text-slate-550">Jenis Kelamin / Agama</td>
                      <td className="py-1.5 text-slate-800">: {siswa.jk === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'} / {siswa.agama || 'Islam'}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-bold text-slate-550">Status / Sdr</td>
                      <td className="py-1.5 text-slate-800">: Anak {siswa.status_anak || 'Kandung'} (Anak ke-{siswa.anak_ke} dari {siswa.jml_saudara + 1} sdr)</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-bold text-slate-550">Hobi / Cita-cita</td>
                      <td className="py-1.5 text-slate-850">: {siswa.hobi || '-'} / {siswa.cita_cita || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Alamat Rumah */}
            <div className="space-y-2">
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">II. KETERANGAN TEMPAT TINGGAL</p>
              <table className="w-full text-xs text-left">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-550 w-36">Alamat Rumah</td>
                    <td className="py-1.5 text-slate-900">: {siswa.alamat_lengkap || '-'}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-550">Desa / Kecamatan</td>
                    <td className="py-1.5 text-slate-900">: {siswa.desa || '-'} / {siswa.kecamatan || '-'}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-bold text-slate-550">Kabupaten / Provinsi</td>
                    <td className="py-1.5 text-slate-900">: {siswa.kabupaten || '-'} / {siswa.provinsi || '-'} (Pos: {siswa.kode_pos || '-'})</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Orang tua / Wali */}
            <div className="space-y-2">
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">III. KETERANGAN ORANG TUA KANDUNG / WALI</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-200 p-2.5 rounded text-xs space-y-1 bg-neutral-50/20">
                  <p className="font-extrabold text-slate-900 border-b border-slate-200 pb-0.5">▲ Data Ayah</p>
                  <p>Nama: <strong>{siswa.nama_ayah || 'Belum diisi'}</strong></p>
                  <p>NIK: <span className="font-mono">{siswa.nik_ayah || '-'}</span></p>
                  <p>Pekerjaan: {siswa.pekerjaan_ayah || '-'}</p>
                </div>

                <div className="border border-slate-200 p-2.5 rounded text-xs space-y-1 bg-neutral-50/20">
                  <p className="font-extrabold text-slate-900 border-b border-slate-200 pb-0.5">▲ Data Ibu</p>
                  <p>Nama: <strong>{siswa.nama_ibu || 'Belum diisi'}</strong></p>
                  <p>NIK: <span className="font-mono">{siswa.nik_ibu || '-'}</span></p>
                  <p>Pekerjaan: {siswa.pekerjaan_ibu || '-'}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* PAGE 2: RIWAYAT SEKOLAH & NILAI RAPOR SMT 1-2 */}
        <div className="print-page bg-white p-8 sm:p-12 shadow-2xl rounded-xl border border-slate-100 space-y-8">
          <div className="print-border border-4 border-double border-emerald-900 p-6 space-y-6">
            
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-300 pb-1">IV. KETERANGAN DATA AKADEMIK & REGISTER RAPOR</p>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase text-[9.5px] block">Asal Sekolah (SMP/MTs)</span>
                <span className="font-semibold text-slate-900 block">{siswa.asal_sekolah || '-'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase text-[9.5px] block">Nomor SKHUN / No. Ijazah SMP</span>
                <span className="font-mono text-slate-900 block">{siswa.no_skhun || '-'} / {siswa.no_ijazah_smp || '-'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase text-[9.5px] block">Tahun Masuk Aliyah</span>
                <span className="font-semibold text-slate-900 block">{siswa.tahun_masuk || '-'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase text-[9.5px] block">Kelas & Jurusan Aktif</span>
                <span className="font-semibold text-slate-950 block">{classLabel} ({siswa.jurusan})</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              
              {/* SMT 1 */}
              <div className="space-y-1.5 text-xs">
                <p className="font-black text-slate-800 border-b border-slate-900 pb-0.5">NILAI SEMESTER 1</p>
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[10px] font-bold">
                    <tr>
                      <th className="p-1">Mata Pelajaran</th>
                      <th className="p-1 text-center">Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getGradesBySem(1).map(g => (
                      <tr key={g.id_nilai} className="border-b border-slate-100">
                        <td className="p-1 truncate max-w-[120px]">{g.mapel}</td>
                        <td className="p-1 text-center font-bold font-mono">{g.nilai}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* SMT 2 */}
              <div className="space-y-1.5 text-xs">
                <p className="font-black text-slate-800 border-b border-slate-900 pb-0.5">NILAI SEMESTER 2</p>
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[10px] font-bold">
                    <tr>
                      <th className="p-1">Mata Pelajaran</th>
                      <th className="p-1 text-center">Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getGradesBySem(2).map(g => (
                      <tr key={g.id_nilai} className="border-b border-slate-100">
                        <td className="p-1 truncate max-w-[120px]">{g.mapel}</td>
                        <td className="p-1 text-center font-bold font-mono">{g.nilai}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        </div>

        {/* PAGE 3: NILAI RAPOR SMT 3-4 */}
        <div className="print-page bg-white p-8 sm:p-12 shadow-2xl rounded-xl border border-slate-100">
          <div className="print-border border-4 border-double border-emerald-900 p-6 space-y-6">
            
            <div className="grid grid-cols-2 gap-6">
              
              {/* SMT 3 */}
              <div className="space-y-1.5 text-xs">
                <p className="font-black text-slate-800 border-b border-slate-900 pb-0.5">NILAI SEMESTER 3</p>
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[10px] font-bold">
                    <tr>
                      <th className="p-1">Mata Pelajaran</th>
                      <th className="p-1 text-center">Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getGradesBySem(3).map(g => (
                      <tr key={g.id_nilai} className="border-b border-slate-100">
                        <td className="p-1 truncate max-w-[120px]">{g.mapel}</td>
                        <td className="p-1 text-center font-bold font-mono">{g.nilai}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* SMT 4 */}
              <div className="space-y-1.5 text-xs">
                <p className="font-black text-slate-800 border-b border-slate-900 pb-0.5">NILAI SEMESTER 4</p>
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[10px] font-bold">
                    <tr>
                      <th className="p-1">Mata Pelajaran</th>
                      <th className="p-1 text-center">Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getGradesBySem(4).map(g => (
                      <tr key={g.id_nilai} className="border-b border-slate-100">
                        <td className="p-1 truncate max-w-[120px]">{g.mapel}</td>
                        <td className="p-1 text-center font-bold font-mono">{g.nilai}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        </div>

        {/* PAGE 4: NILAI RAPOR SMT 5-6 */}
        <div className="print-page bg-white p-8 sm:p-12 shadow-2xl rounded-xl border border-slate-100">
          <div className="print-border border-4 border-double border-emerald-950 p-6 space-y-6">
            
            <div className="grid grid-cols-2 gap-6">
              
              {/* SMT 5 */}
              <div className="space-y-1.5 text-xs">
                <p className="font-black text-slate-800 border-b border-slate-900 pb-0.5">NILAI SEMESTER 5</p>
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[10px] font-bold">
                    <tr>
                      <th className="p-1">Mata Pelajaran</th>
                      <th className="p-1 text-center">Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getGradesBySem(5).map(g => (
                      <tr key={g.id_nilai} className="border-b border-slate-100">
                        <td className="p-1 truncate max-w-[120px]">{g.mapel}</td>
                        <td className="p-1 text-center font-bold font-mono">{g.nilai}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* SMT 6 */}
              <div className="space-y-1.5 text-xs">
                <p className="font-black text-slate-800 border-b border-slate-900 pb-0.5">NILAI SEMESTER 6</p>
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[10px] font-bold">
                    <tr>
                      <th className="p-1">Mata Pelajaran</th>
                      <th className="p-1 text-center">Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getGradesBySem(6).map(g => (
                      <tr key={g.id_nilai} className="border-b border-slate-100">
                        <td className="p-1 truncate max-w-[120px]">{g.mapel}</td>
                        <td className="p-1 text-center font-bold font-mono">{g.nilai}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        </div>

        {/* PAGE 5: NILAI IJAZAH KELULUSAN & LEGALITAS */}
        <div className="print-page bg-white p-8 sm:p-12 shadow-2xl rounded-xl border border-slate-100 space-y-8">
          <div className="print-border border-4 border-double border-slate-950 p-6 space-y-8">
            
            <div className="text-center font-bold border-b border-slate-350 pb-2">
              <h2 className="text-xs uppercase tracking-widest text-slate-500">TRANSKRIP ARSIP KELULUSAN MADRASAH</h2>
              <h1 className="text-sm uppercase tracking-wide text-slate-900 mt-1 font-serif">NILAI SURAT TANDA TAMAT BELAJAR (IJAZAH) ALIYAH</h1>
            </div>

            <div className="max-w-md mx-auto text-xs space-y-6">
              <table className="w-full text-left border border-slate-300">
                <thead className="bg-slate-100 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300">No.</th>
                    <th className="p-2 border-r border-slate-300">Mata Pelajaran Kurikulum Aliyah</th>
                    <th className="p-2 text-center">Nilai Ijazah</th>
                  </tr>
                </thead>
                <tbody>
                  {studentIjazah.map((ijz, idx) => (
                    <tr key={ijz.id_ijazah} className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-300 font-mono text-center">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-300 font-bold">{ijz.mapel}</td>
                      <td className="p-2 text-center font-black font-mono text-slate-950 bg-neutral-50/50">{ijz.nilai}</td>
                    </tr>
                  ))}
                  {studentIjazah.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-slate-400 italic">Nilai Ijazah belum disinkronisasikan</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-4 font-sans text-slate-700">
                <div className="flex flex-col items-center justify-center p-3 text-center border border-slate-200 bg-slate-50/10 rounded min-h-[120px]">
                  <p className="text-[9px] uppercase font-bold text-slate-400 mb-2">CAP TIGA JARI</p>
                  <div className="w-16 h-20 border border-slate-300 rounded"></div>
                </div>

                <div className="flex flex-col items-center justify-between text-center min-h-[120px]">
                  <div>
                    <p className="text-[10px] text-slate-500 font-mono">Sidoarjo, 18 Juni 2026</p>
                    <p className="font-bold text-slate-800">Kepala Madrasah MA Banu Hasyim</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-950 border-b border-slate-900 pb-0.5">K.H. Nuruddin, M.Pd.I.</p>
                    <p className="text-[9px] text-slate-400 font-mono">NIP. 196904121995031002</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
