/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Siswa, Kelas, NilaiSemester, NilaiIjazah, UserRole, GenderType, JurusanType } from '../types';
import { FileSpreadsheet, Upload, CheckCircle2, AlertTriangle, Play, Database, FileText, ArrowRight, Table } from 'lucide-react';

interface ExcelImporterProps {
  currentRole: UserRole;
  siswa: Siswa[];
  kelas: Kelas[];
  onImportComplete: (
    newSiswaList: Siswa[],
    newNilaiSemester: NilaiSemester[],
    newNilaiIjazah: NilaiIjazah[],
    logMsg: string
  ) => void;
}

type ImportTab = 'siswa' | 'rdm' | 'ijazah';

const mapSubjectName = (name: string): string => {
  const clean = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (clean === 'qurdis' || clean === 'alquranhadis' || clean === 'quran' || clean === 'alquran' || clean === 'quranhadis' || clean === 'quranhadist') {
    return "Al-Qur'an Hadis";
  }
  if (clean === 'aqidah' || clean === 'aqidahakhlak' || clean === 'akidah' || clean === 'akidahakhlak') {
    return "Aqidah Akhlak";
  }
  if (clean === 'fiqih' || clean === 'fikih') {
    return "Fikih";
  }
  if (clean === 'ski' || clean === 'sejarahkebudayaanislam') {
    return "Sejarah Kebudayaan Islam (SKI)";
  }
  if (clean === 'bhsarab' || clean === 'bahasaarab' || clean === 'barab') {
    return "Bahasa Arab";
  }
  if (clean === 'ppkn' || clean === 'pkn') {
    return "PPKN";
  }
  if (clean === 'bhsindonesia' || clean === 'bahasaindonesia' || clean === 'bindonesia') {
    return "Bahasa Indonesia";
  }
  if (clean === 'matematik' || clean === 'matematika' || clean === 'mtk') {
    return "Matematika";
  }
  if (clean === 'bhsinggris' || clean === 'bahasainggris' || clean === 'binggris') {
    return "Bahasa Inggris";
  }
  if (clean === 'fisika') {
    return "Fisika";
  }
  if (clean === 'kimia') {
    return "Kimia";
  }
  if (clean === 'biologi') {
    return "Biologi";
  }
  if (clean === 'geografi' || clean === 'geo') {
    return "Geografi";
  }
  if (clean === 'sejarah' || clean === 'sejarahpeminatan') {
    return "Sejarah Peminatan";
  }
  if (clean === 'sosiologi' || clean === 'sosio') {
    return "Sosiologi";
  }
  if (clean === 'ekonomi' || clean === 'eko') {
    return "Ekonomi";
  }
  if (clean === 'tafsirilmutafsir' || clean === 'tafsir') {
    return "Tafsir-Ilmu Tafsir";
  }
  if (clean === 'hadisilmuhadis' || clean === 'hadis') {
    return "Hadis-Ilmu Hadis";
  }
  if (clean === 'ushulfikih' || clean === 'ushulfiqih') {
    return "Ushul Fikih";
  }
  if (clean === 'akhlaktasawuf') {
    return "Akhlak Tasawuf";
  }
  if (clean === 'pjo' || clean === 'pjok' || clean === 'penjas' || clean === 'penjaskes') {
    return "PJOK";
  }
  if (clean === 'informatiak' || clean === 'informatika' || clean === 'inf') {
    return "Informatika";
  }
  if (clean === 'prakarya' || clean === 'pky') {
    return "Prakarya";
  }
  if (clean === 'senibuoadaya' || clean === 'senibuadaya' || clean === 'senibudaya' || clean === 'seni') {
    return "Seni Budaya";
  }
  if (clean === 'bhsdaerah' || clean === 'bahasadaerah' || clean === 'bdaerah') {
    return "Bahasa Daerah";
  }
  if (clean === 'tatabusana' || clean === 'busana') {
    return "Tata Busana";
  }
  if (clean === 'pai' || clean === 'pendidikanagamaislam' || clean === 'agama') {
    return "PAI";
  }
  
  return name.trim();
};

export default function ExcelImporter({ currentRole, siswa, kelas, onImportComplete }: ExcelImporterProps) {
  const [activeImportTab, setActiveImportTab] = useState<ImportTab>('siswa');
  const [inputText, setInputText] = useState<string>('');
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    data: any[];
    errors: string[];
    warnings: string[];
  } | null>(null);

  const [savingState, setSavingState] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);
  const [importSemester, setImportSemester] = useState<number>(1);

  // Template generators for simple evaluation testing
  const loadSiswaTemplate = () => {
    // Columns: NIS, NISN, Nama, JK, Tempat Lahir, Tanggal Lahir, Alamat, Ayah, Ibu, Jurusan, Tahun Masuk
    const templateRows = [
      "NIS\tNISN\tNama\tJK\tTempat Lahir\tTanggal Lahir\tAlamat\tAyah\tIbu\tJurusan\tTahun Masuk",
      "22230915\t0071239561\tDewi Nur Latifah\tP\tSidoarjo\t2007-06-18\tJl. Masjid No. 5 Pepe\tHaji Maksum\tHajah Siti\tMIPA\t2022",
      "22230916\t0071239562\tAhmad Khoirul Anam\tL\tSurabaya\t2007-03-22\tDsn. Kwagean RT 02\tH. Munir\tSiti Zulaika\tIPS\t2022",
      "23241005\t0085432109\tM. Ridho Syahputra\tL\tGresik\t2008-11-20\tJl. Melati Raya No. 10\tSupriyanto\tSri Wahyuni\tKeagamaan\t2023"
    ];
    setInputText(templateRows.join('\n'));
    setValidationResult(null);
  };

  const loadRDMTemplate = () => {
    // Columns: NIS, NISN, Nama Siswa, then subjects
    const templateRows = [
      "NIS\tNISN\tNama Siswa\tQURDIS\tAQIDAH\tFIQIH\tSKI\tBhs Arab\tBhs Indonesia\tMatematik\tBiologi\tFisika\tKimia\tSosiologi\tEkonomi\tGeografi\tBhs Inggris\tPJO\tInformatiak\tPrakarya\tSeni Buadaya\tBhs Daerah\tTata Busana",
      "23241001\t0085432101\tMuhammad Wildan Al-Ghifari\t86\t90\t88\t86\t81\t90\t84\t87\t86\t88\t86\t84\t\t86\t89\t86\t86\t86\t86\t83",
      "230731\t0075321049\tAAISYAH MAIMUNAH BINSYEKH BAQIR\t86\t90\t88\t86\t81\t90\t84\t87\t86\t88\t86\t84\t\t86\t89\t86\t86\t86\t86\t83"
    ];
    setInputText(templateRows.join('\n'));
    setValidationResult(null);
  };

  const loadIjazahTemplate = () => {
    // Columns: NISN, Nama, PAI, PPKN, Bahasa Indonesia, Matematika, Bahasa Inggris, Mapel Pilihan
    const templateRows = [
      "NISN\tNama\tPAI\tPPKN\tBahasa Indonesia\tMatematika\tBahasa Inggris\tMapel Pilihan",
      "0071239556\tSiti Aisyah Rahmawati\t90\t88\t86\t89\t85\t92",
      "0071239557\tSyahril Ramadhan\t85\t82\t84\t80\t81\t85"
    ];
    setInputText(templateRows.join('\n'));
    setValidationResult(null);
  };

  // Safe tab switcher
  const handleTabSwitch = (tab: ImportTab) => {
    setActiveImportTab(tab);
    setInputText('');
    setValidationResult(null);
  };

  // Excel TSV string parser
  const handleValidate = () => {
    if (!inputText.trim()) {
      alert("Kolom impor masih kosong! Silakan tempel data Excel atau klik tombol 'Gunakan Template Contoh'.");
      return;
    }

    const rows = inputText.trim().split('\n').map(row => row.split('\t').map(it => it.trim()));
    if (rows.length < 2) {
      setValidationResult({
        success: false,
        data: [],
        errors: ["Data kosong atau baris judul kolom tidak lengkap!"],
        warnings: []
      });
      return;
    }

    const headers = rows[0].map(h => h.toLowerCase());
    const dataRows = rows.slice(1);
    
    const parsedData: any[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    if (activeImportTab === 'siswa') {
      // Validate Siswa Table Importer
      dataRows.forEach((cols, idx) => {
        if (cols.length < 10) {
          errors.push(`Baris ${idx + 2}: Kekurangan kolom. Wajib diisi sesuai pola template.`);
          return;
        }

        const rowData = {
          nis: cols[0] || '',
          nisn: cols[1] || '',
          nama: cols[2] || '',
          jk: (cols[3] || 'L').toUpperCase() as GenderType,
          tempat_lahir: cols[4] || '',
          tgl_lahir: cols[5] || '',
          alamat_lengkap: cols[6] || '',
          nama_ayah: cols[7] || '',
          nama_ibu: cols[8] || '',
          jurusan: (cols[9] || 'MIPA') as JurusanType,
          tahun_masuk: cols[10] || new Date().getFullYear().toString()
        };

        // Standard audits 
        if (!rowData.nis || !rowData.nisn || !rowData.nama) {
          errors.push(`Baris ${idx + 2}: NIS, NISN, dan Nama harus diisi!`);
        }
        if (rowData.nisn.length !== 10) {
          warnings.push(`Baris ${idx + 2} (${rowData.nama}): NISN idealnya 10 digit.`);
        }
        if (rowData.jk !== 'L' && rowData.jk !== 'P') {
          warnings.push(`Baris ${idx + 2} (${rowData.nama}): JK harus L atau P. Diubah bawaan ke 'L'.`);
          rowData.jk = 'L';
        }
        if (['MIPA', 'IPS', 'Keagamaan', 'Umum'].indexOf(rowData.jurusan) === -1) {
          errors.push(`Baris ${idx + 2} (${rowData.nama}): Jurusan harus diantara MIPA, IPS, Keagamaan, atau Umum!`);
        }

        parsedData.push(rowData);
      });
    } else if (activeImportTab === 'rdm') {
      // Validate Leger RDM (Horizontal format)
      let nisIdx = headers.findIndex(h => h === 'nis' || (h.includes('nis') && !h.includes('nisn')));
      if (nisIdx === -1) nisIdx = 0;
      
      let nisnIdx = headers.findIndex(h => h.includes('nisn'));
      if (nisnIdx === -1) nisnIdx = 1;
      
      let namaIdx = headers.findIndex(h => h.includes('nama') || h.includes('siswa'));
      if (namaIdx === -1) namaIdx = 2;

      // Other headers are subject columns
      const subjectCols: { colIndex: number; originalName: string; mappedName: string }[] = [];
      headers.forEach((h, colIndex) => {
        if (colIndex !== nisIdx && colIndex !== nisnIdx && colIndex !== namaIdx && h.trim()) {
          const originalName = rows[0][colIndex];
          const mappedName = mapSubjectName(originalName);
          subjectCols.push({ colIndex, originalName, mappedName });
        }
      });

      if (subjectCols.length === 0) {
        errors.push("Tidak ada kolom mata pelajaran yang terdeteksi!");
      }

      dataRows.forEach((cols, idx) => {
        const nisnVal = cols[nisnIdx] || '';
        const namaVal = cols[namaIdx] || '';
        const nisVal = cols[nisIdx] || '';

        if (!nisnVal) {
          errors.push(`Baris ${idx + 2}: NISN kosong!`);
          return;
        }

        const matchesSiswa = siswa.find(s => s.nisn === nisnVal || s.nis === nisVal);
        const identifyingName = matchesSiswa ? matchesSiswa.nama : (namaVal || `Siswa NISN ${nisnVal}`);
        if (!matchesSiswa) {
          warnings.push(`Baris ${idx + 2}: Siswa dengan NISN "${nisVal || nisnVal}" (${identifyingName}) belum terdaftar pada database.`);
        }

        // For each subject column, parse the score if it exists
        subjectCols.forEach(sub => {
          const cellVal = cols[sub.colIndex];
          if (cellVal !== undefined && cellVal.trim() !== '') {
            const score = parseInt(cellVal.trim());
            if (isNaN(score)) {
              warnings.push(`Baris ${idx + 2} (${identifyingName}): Nilai untuk mapel "${sub.originalName}" (${cellVal}) bukan angka valid.`);
            } else if (score < 0 || score > 100) {
              errors.push(`Baris ${idx + 2} (${identifyingName}): Nilai mapel "${sub.originalName}" (${score}) di luar rentang 0-100.`);
            } else {
              parsedData.push({
                nisn: nisnVal,
                nama: identifyingName,
                mapel: sub.mappedName,
                semester: importSemester,
                nilai: score
              });
            }
          }
        });
      });
    } else if (activeImportTab === 'ijazah') {
      // Validate Ijazah Values
      let nisnIdx = headers.findIndex(h => h.includes('nisn'));
      if (nisnIdx === -1) nisnIdx = 0;
      
      let namaIdx = headers.findIndex(h => h.includes('nama') || h.includes('siswa'));
      if (namaIdx === -1) namaIdx = 1;

      // Detect if we are using the old/classic template (which has 'pai')
      const hasPai = headers.some(h => h === 'pai');

      // Other headers are subject columns
      const subjectCols: { colIndex: number; originalName: string; mappedName: string }[] = [];
      headers.forEach((h, colIndex) => {
        if (colIndex !== nisnIdx && colIndex !== namaIdx && h.trim()) {
          const originalName = rows[0][colIndex];
          const mappedName = mapSubjectName(originalName);
          subjectCols.push({ colIndex, originalName, mappedName });
        }
      });

      if (subjectCols.length === 0) {
        errors.push("Tidak ada kolom mata pelajaran yang terdeteksi!");
      }

      dataRows.forEach((cols, idx) => {
        const nisnVal = cols[nisnIdx] || '';
        const namaVal = cols[namaIdx] || '';

        if (!nisnVal) {
          errors.push(`Baris ${idx + 2}: NISN kosong!`);
          return;
        }

        const matchesSiswa = siswa.find(s => s.nisn === nisnVal);
        const identifyingName = matchesSiswa ? matchesSiswa.nama : (namaVal || `Siswa NISN ${nisnVal}`);
        if (!matchesSiswa) {
          warnings.push(`Baris ${idx + 2}: Siswa dengan NISN "${nisnVal}" (${identifyingName}) belum terdaftar pada database.`);
        } else if (!matchesSiswa.id_kelas.includes('xii')) {
          warnings.push(`Baris ${idx + 2}: Siswa "${matchesSiswa.nama}" terdeteksi masuk kelas ${matchesSiswa.kelas_masuk} (Bukan Kelas XII / Alumni). Nilai tetap disimpan.`);
        }

        subjectCols.forEach(sub => {
          const cellVal = cols[sub.colIndex];
          if (cellVal !== undefined && cellVal.trim() !== '') {
            const score = parseInt(cellVal.trim());
            if (isNaN(score)) {
              warnings.push(`Baris ${idx + 2} (${identifyingName}): Nilai untuk mapel "${sub.originalName}" (${cellVal}) bukan angka valid.`);
            } else if (score < 0 || score > 100) {
              errors.push(`Baris ${idx + 2} (${identifyingName}): Nilai mapel "${sub.originalName}" (${score}) di luar rentang 0-100.`);
            } else {
              if (hasPai && sub.originalName.toLowerCase() === 'pai') {
                // Duplicate across the 5 standard Islamic subjects
                const religionMapels = [
                  "Al-Qur'an Hadis",
                  "Aqidah Akhlak",
                  "Fikih",
                  "Sejarah Kebudayaan Islam (SKI)",
                  "Bahasa Arab"
                ];
                religionMapels.forEach(relM => {
                  parsedData.push({
                    nisn: nisnVal,
                    nama: identifyingName,
                    mapel: relM,
                    nilai: score
                  });
                });
              } else {
                parsedData.push({
                  nisn: nisnVal,
                  nama: identifyingName,
                  mapel: sub.mappedName,
                  nilai: score
                });
              }
            }
          }
        });
      });
    }

    setValidationResult({
      success: errors.length === 0,
      data: parsedData,
      errors,
      warnings
    });
  };

  // Merge the validated array into our active lists
  const handleSaveToDatabase = () => {
    if (!validationResult || validationResult.data.length === 0) return;
    setSavingState(true);

    let updatedSiswaList = [...siswa];
    let newNilaiList: NilaiSemester[] = [];
    let newIjazahList: NilaiIjazah[] = [];
    let logMsg = '';

    if (activeImportTab === 'siswa') {
      // Mapping class placeholders to actual class items based on year & jurusan
      validationResult.data.forEach((item: any) => {
        // Find existing match
        const existingIdx = updatedSiswaList.findIndex(s => s.nisn === item.nisn || s.nis === item.nis);
        
        let targetClassId = 'kls-xmipa'; // fallback
        let targetGrade = 'X';
        if (item.tahun_masuk === '2022') targetGrade = 'XII';
        else if (item.tahun_masuk === '2023') targetGrade = 'XI';

        const foundClass = kelas.find(k => k.jurusan === item.jurusan && k.nama_kelas.toUpperCase().startsWith(targetGrade));
        if (foundClass) {
          targetClassId = foundClass.id_kelas;
        } else {
          const fallbackClass = kelas.find(k => k.jurusan === item.jurusan);
          if (fallbackClass) {
            targetClassId = fallbackClass.id_kelas;
          } else if (kelas.length > 0) {
            targetClassId = kelas[0].id_kelas;
          }
        }

        const mappedSiswa: Siswa = {
          id_siswa: existingIdx !== -1 ? updatedSiswaList[existingIdx].id_siswa : `sis-${Date.now()}-${item.nisn}`,
          nis: item.nis,
          nisn: item.nisn,
          nik: `${Date.now()}`.slice(0, 16), // Generate realistic NIK
          nama: item.nama,
          tempat_lahir: item.tempat_lahir,
          tgl_lahir: item.tgl_lahir,
          jk: item.jk,
          agama: 'Islam',
          status_anak: 'Kandung',
          anak_ke: 1,
          jml_saudara: 2,
          hobi: 'Belajar',
          cita_cita: '',
          alamat_lengkap: item.alamat_lengkap,
          desa: 'Pepe',
          kecamatan: 'Sedati',
          kabupaten: 'Sidoarjo',
          provinsi: 'Jawa Timur',
          kode_pos: '61253',
          nama_ayah: item.nama_ayah,
          nik_ayah: '',
          pendidikan_ayah: '',
          pekerjaan_ayah: '',
          penghasilan_ayah: '',
          nama_ibu: item.nama_ibu,
          nik_ibu: '',
          pendidikan_ibu: '',
          pekerjaan_ibu: '',
          penghasilan_ibu: '',
          tahun_masuk: item.tahun_masuk,
          kelas_masuk: 'X',
          id_kelas: targetClassId,
          jurusan: item.jurusan,
          asal_sekolah: 'MTs Negeri 1 Sidoarjo',
          no_skhun: '',
          no_ijazah_smp: '',
          foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', // preloading general avatar
        };

        if (existingIdx !== -1) {
          updatedSiswaList[existingIdx] = mappedSiswa;
        } else {
          updatedSiswaList.push(mappedSiswa);
        }
      });

      logMsg = `Berhasil mengimpor massal ${validationResult.data.length} record biodata siswa dari Excel.`;
    } else if (activeImportTab === 'rdm') {
      // Import RDM ledger score cells (horizontal parsed results)
      validationResult.data.forEach((item: any, idx: number) => {
        const matchingSiswa = siswa.find(s => s.nisn === item.nisn);
        if (matchingSiswa) {
          newNilaiList.push({
            id_nilai: `imported-nil-${matchingSiswa.id_siswa}-${item.semester}-${idx}-${Date.now()}`,
            id_siswa: matchingSiswa.id_siswa,
            semester: item.semester,
            mapel: item.mapel,
            nilai: item.nilai
          });
        }
      });

      logMsg = `Berhasil mengimpor & mensinkronisasikan ${validationResult.data.length} nilai rapor dari Ledger RDM untuk Semester ${importSemester}.`;
    } else if (activeImportTab === 'ijazah') {
      // Import Ijazah values (individual subject records already compiled during validate)
      validationResult.data.forEach((item: any, idx: number) => {
        const matchingSiswa = siswa.find(s => s.nisn === item.nisn);
        if (matchingSiswa) {
          newIjazahList.push({
            id_ijazah: `imported-ijz-${matchingSiswa.id_siswa}-${idx}-${Date.now()}`,
            id_siswa: matchingSiswa.id_siswa,
            mapel: item.mapel,
            nilai: item.nilai
          });
        }
      });

      logMsg = `Berhasil merekam nilai transkrip Kelulusan Ijazah untuk ${validationResult.data.length} records.`;
    }

    // Pass actions back up to merge state
    setTimeout(() => {
      onImportComplete(updatedSiswaList, newNilaiList, newIjazahList, logMsg);
      setSavingState(false);
      setInputText('');
      setValidationResult(null);
      setShowSuccessToast(logMsg);
      
      // Auto dismiss success alert
      setTimeout(() => setShowSuccessToast(null), 5000);
    }, 800);
  };

  const isOperator = currentRole === 'Operator';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 space-y-6">
      
      {/* Importer center header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-emerald-800" />
          Hub Penyelaras Data RDM (Import Excel)
        </h2>
        <p className="text-xs text-slate-500">
          Gunakan fitur ini untuk memperbaharui dan mengunggah database siswa, nilai rapor harian, serta nilai Ijazah resmi dari template ekspor RDM (Rapor Digital Madrasah).
        </p>
      </div>

      {/* Success alert toast */}
      {showSuccessToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-850 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 block shrink-0" />
          <span>{showSuccessToast}</span>
        </div>
      )}

      {/* Importer tab buttons */}
      <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 max-w-lg">
        <button
          id="btn-import-tab-siswa"
          onClick={() => handleTabSwitch('siswa')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeImportTab === 'siswa'
              ? 'bg-emerald-800 text-white font-extrabold shadow shadow-emerald-800/10'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <Table className="h-4 w-4" />
          <span>BI Siswa</span>
        </button>
        <button
          id="btn-import-tab-rdm"
          onClick={() => handleTabSwitch('rdm')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeImportTab === 'rdm'
              ? 'bg-emerald-800 text-white font-extrabold shadow shadow-emerald-800/10'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Leger RDM</span>
        </button>
        <button
          id="btn-import-tab-ijazah"
          onClick={() => handleTabSwitch('ijazah')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeImportTab === 'ijazah'
              ? 'bg-emerald-800 text-white font-extrabold shadow shadow-emerald-800/10'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Nilai Ijazah</span>
        </button>
      </div>

      {activeImportTab === 'rdm' && (
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-lg">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-800">Target Semester Sinkronisasi</h4>
            <p className="text-[10.5px] text-slate-500">Pilih semester target tempat nilai leger rapor RDM akan dicatat</p>
          </div>
          <select
            id="select-import-semester"
            value={importSemester}
            onChange={(e) => {
              setImportSemester(parseInt(e.target.value));
              setValidationResult(null);
            }}
            className="bg-white text-slate-800 border border-emerald-200 rounded-lg text-xs font-bold px-3 py-1.5 focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6].map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
      )}

      {/* Access Warning if Wali Kelas is active */}
      {!isOperator && (
        <div className="bg-amber-50 border border-amber-200 text-amber-850 p-4 rounded-xl text-xs flex gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Akses Terbatas:</strong> Hak Akses Anda saat ini adalah <strong>{currentRole}</strong>. Penggunaan sinkronisasi basis data Excel massal hanya dapat dijalankan pasca otorisasi <strong>Operator Madrasah Utama</strong>. Silakan ubah Hak Akses di bar atas untuk memproses.
          </p>
        </div>
      )}

      {/* Main import workspace */}
      <div className={`space-y-4 ${!isOperator ? 'opacity-50 pointer-events-none' : ''}`}>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <span className="text-xs font-extrabold text-slate-700">
            {activeImportTab === 'siswa' && 'Tempel Baris Excel Biodata Siswa'}
            {activeImportTab === 'rdm' && 'Tempel Baris Excel Leger RDM'}
            {activeImportTab === 'ijazah' && 'Tempel Baris Excel Transkrip Ijazah'}
          </span>
          
          <button
            id={`btn-load-template-${activeImportTab}`}
            type="button"
            onClick={
              activeImportTab === 'siswa' ? loadSiswaTemplate :
              activeImportTab === 'rdm' ? loadRDMTemplate : loadIjazahTemplate
            }
            className="text-xs font-bold text-amber-850 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
          >
            <Table className="h-3.5 w-3.5" />
            <span>Gunakan Template Contoh</span>
          </button>
        </div>

        {/* Excel area input */}
        <div className="relative">
          <textarea
            id="textarea-tsv-import"
            rows={8}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setValidationResult(null);
            }}
            placeholder="Salin baris dan sel langsung dari program Microsoft Excel Anda, lalu tempelkan (paste) di kotak text ini. Pemetaan tabulasi antar sel akan tersistematis secara otomatis..."
            className="w-full bg-slate-50 text-xs font-mono p-4 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* Action Validation Bar */}
        <div className="flex items-center gap-3">
          <button
            id="btn-validate-tsv"
            type="button"
            onClick={handleValidate}
            className="px-5 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Play className="h-4 w-4" />
            <span>Validasi Data Excel</span>
          </button>

          {validationResult && validationResult.success && (
            <button
              id="btn-commit-import"
              type="button"
              disabled={savingState}
              onClick={handleSaveToDatabase}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-md shadow-emerald-800/10 disabled:opacity-50"
            >
              <Database className="h-4 w-4" />
              <span>{savingState ? 'Menyimpan...' : 'Simpan ke Database Buku Induk'}</span>
            </button>
          )}
        </div>

        {/* Validation Report details */}
        {validationResult && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="text-xs font-bold text-slate-800">Laporan Validasi Skema</h4>
              <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                validationResult.success 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {validationResult.success ? '✓ Validasi Lolos' : '✗ Ada Kendala'}
              </span>
            </div>

            <div className="text-xs space-y-1.5">
              <p className="text-slate-600 font-medium">
                • Baris data terbaca: <strong className="text-slate-800">{validationResult.data.length} baris</strong>
              </p>
              
              {/* Warnings details */}
              {validationResult.warnings.map((warn, i) => (
                <div key={i} className="text-amber-800 flex items-start gap-1 pb-0.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600 mt-0.5" />
                  <span>{warn}</span>
                </div>
              ))}

              {/* Errors details */}
              {validationResult.errors.map((err, i) => (
                <div key={i} className="text-rose-800 flex items-start gap-1 pb-0.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-600 mt-0.5" />
                  <strong className="shrink-0">[Galat]</strong>
                  <span>{err}</span>
                </div>
              ))}

              {validationResult.success && (
                <p className="text-slate-500 italic mt-2 text-[11px] flex items-center gap-1 text-emerald-800">
                  <CheckCircle2 className="h-4 w-4" />
                  Sistem siap mengimpor data di atas. Klik <strong>Simpan ke Database</strong> untuk memproses sinkronisasi permanen.
                </p>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
