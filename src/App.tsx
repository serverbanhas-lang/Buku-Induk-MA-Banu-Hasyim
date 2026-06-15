/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import RoleHeader from './components/RoleHeader';
import Dashboard from './components/Dashboard';
import SiswaList from './components/SiswaList';
import SiswaForm from './components/SiswaForm';
import ExcelImporter from './components/ExcelImporter';
import BukuIndukViewer from './components/BukuIndukViewer';
import BukuIndukPrint from './components/BukuIndukPrint';
import Login from './components/Login';
import KonfigurasiMaster, { AcademicYear, MasterJurusan } from './components/KonfigurasiMaster';
import GoogleSheetsSync from './components/GoogleSheetsSync';
import PanduanDeploy from './components/PanduanDeploy';
import SiswaFotoEntri from './components/SiswaFotoEntri';
import UserManagement from './components/UserManagement';
import { getLocalStorageData, saveLocalStorageData, addActivityLog, getLocalStorageUsers, saveLocalStorageUsers } from './data/seedData';
import { Siswa, Kelas, NilaiSemester, NilaiIjazah, LogAktivitas, UserRole, UserAccount } from './types';
import { 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  Info, 
  Award, 
  UserCheck, 
  HelpCircle,
  Layers,
  CloudLightning,
  Book,
  LogOut,
  Settings,
  Camera,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Role & menu states
  const [currentRole, setCurrentRole] = useState<UserRole>('Operator');
  const [currentUser, setCurrentUser] = useState<string>('Ust. Usman Fauzi');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<string>('Dashboard');
  
  // Database tables state
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [nilaiSemesterList, setNilaiSemesterList] = useState<NilaiSemester[]>([]);
  const [nilaiIjazahList, setNilaiIjazahList] = useState<NilaiIjazah[]>([]);
  const [logs, setLogs] = useState<LogAktivitas[]>([]);
  const [usersList, setUsersList] = useState<UserAccount[]>([]);

  // Master lists
  const [jurusanList, setJurusanList] = useState<MasterJurusan[]>([
    { id_jurusan: 'jur-mipa', nama: 'Sains dan Matematika', kode: 'MIPA', keterangan: 'Peminatan Ilmu Pengetahuan Alam' },
    { id_jurusan: 'jur-ips', nama: 'Ilmu Pengetahuan Sosial', kode: 'IPS', keterangan: 'Peminatan Ilmu Pengetahuan Sosial' },
    { id_jurusan: 'jur-keagamaan', nama: 'Keagamaan', kode: 'Keagamaan', keterangan: 'Imersi pembelajaran pendalaman Kitab Kuning dan Tafsir' },
    { id_jurusan: 'jur-umum', nama: 'Umum / Kelas X', kode: 'Umum', keterangan: 'Pembelajaran umum fase E untuk kelas 10 sebelum penjurusan' }
  ]);

  const [tapelList, setTapelList] = useState<AcademicYear[]>([
    { id_tapel: 'tapel-2324-ganjil', tahun: '2023/2024', semester: 'Ganjil', aktif: false },
    { id_tapel: 'tapel-2324-genap', tahun: '2023/2024', semester: 'Genap', aktif: false },
    { id_tapel: 'tapel-2425-ganjil', tahun: '2024/2025', semester: 'Ganjil', aktif: false },
    { id_tapel: 'tapel-2425-genap', text: '2024/2025', semester: 'Genap', aktif: false } as any, // fallback
    { id_tapel: 'tapel-2526-ganjil', tahun: '2025/2026', semester: 'Ganjil', aktif: false },
    { id_tapel: 'tapel-2526-genap', tahun: '2025/2026', semester: 'Genap', aktif: true },
  ]);

  // Dynamic Mapel Lists states
  const [mapelMipa, setMapelMipa] = useState<string[]>([]);
  const [mapelIps, setMapelIps] = useState<string[]>([]);
  const [mapelKeagamaan, setMapelKeagamaan] = useState<string[]>([]);
  const [mapelUmum, setMapelUmum] = useState<string[]>([]);
  const [mapelIjazah, setMapelIjazah] = useState<string[]>([]);

  // Focus state managers
  const [selectedSiswaId, setSelectedSiswaId] = useState<string | null>(null);
  const [editSiswaId, setEditSiswaId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [printSiswaId, setPrintSiswaId] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const data = getLocalStorageData();
    setSiswaList(data.siswa);
    setKelasList(data.kelas);
    setNilaiSemesterList(data.nilaiSemester);
    setNilaiIjazahList(data.nilaiIjazah);
    setLogs(data.logs);

    // Custom master lists
    const storedJurusan = localStorage.getItem('sibima_jurusan');
    if (storedJurusan) {
      const parsed = JSON.parse(storedJurusan);
      if (!parsed.some((j: any) => j.kode === 'Umum')) {
        const updated = [
          ...parsed,
          { id_jurusan: 'jur-umum', nama: 'Umum / Kelas X', kode: 'Umum', keterangan: 'Pembelajaran umum fase E untuk kelas 10 sebelum penjurusan' }
        ];
        setJurusanList(updated);
        localStorage.setItem('sibima_jurusan', JSON.stringify(updated));
      } else {
        setJurusanList(parsed);
      }
    } else {
      const initialJurusan = [
        { id_jurusan: 'jur-mipa', nama: 'Sains dan Matematika', kode: 'MIPA', keterangan: 'Peminatan Ilmu Pengetahuan Alam' },
        { id_jurusan: 'jur-ips', nama: 'Ilmu Pengetahuan Sosial', kode: 'IPS', keterangan: 'Peminatan Ilmu Pengetahuan Sosial' },
        { id_jurusan: 'jur-keagamaan', nama: 'Keagamaan', kode: 'Keagamaan', keterangan: 'Imersi pembelajaran pendalaman Kitab Kuning dan Tafsir' },
        { id_jurusan: 'jur-umum', nama: 'Umum / Kelas X', kode: 'Umum', keterangan: 'Pembelajaran umum fase E untuk kelas 10 sebelum penjurusan' }
      ];
      setJurusanList(initialJurusan);
      localStorage.setItem('sibima_jurusan', JSON.stringify(initialJurusan));
    }

    const storedTapel = localStorage.getItem('sibima_tapel');
    if (storedTapel) {
      setTapelList(JSON.parse(storedTapel));
    } else {
      localStorage.setItem('sibima_tapel', JSON.stringify(tapelList));
    }

    // Dynamic mapel state initialization
    const storedMapelMipa = localStorage.getItem('sibima_mapel_mipa');
    if (storedMapelMipa) {
      setMapelMipa(JSON.parse(storedMapelMipa));
    } else {
      const defaultMipa = [
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
      setMapelMipa(defaultMipa);
      localStorage.setItem('sibima_mapel_mipa', JSON.stringify(defaultMipa));
    }

    const storedMapelIps = localStorage.getItem('sibima_mapel_ips');
    if (storedMapelIps) {
      setMapelIps(JSON.parse(storedMapelIps));
    } else {
      const defaultIps = [
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
      setMapelIps(defaultIps);
      localStorage.setItem('sibima_mapel_ips', JSON.stringify(defaultIps));
    }

    const storedMapelKeagamaan = localStorage.getItem('sibima_mapel_keagamaan');
    if (storedMapelKeagamaan) {
      setMapelKeagamaan(JSON.parse(storedMapelKeagamaan));
    } else {
      const defaultKeagamaan = [
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
      setMapelKeagamaan(defaultKeagamaan);
      localStorage.setItem('sibima_mapel_keagamaan', JSON.stringify(defaultKeagamaan));
    }

    const storedMapelIjazah = localStorage.getItem('sibima_mapel_ijazah');
    if (storedMapelIjazah) {
      setMapelIjazah(JSON.parse(storedMapelIjazah));
    } else {
      const defaultIjazah = [
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
      setMapelIjazah(defaultIjazah);
      localStorage.setItem('sibima_mapel_ijazah', JSON.stringify(defaultIjazah));
    }

    const storedMapelUmum = localStorage.getItem('sibima_mapel_umum');
    if (storedMapelUmum) {
      setMapelUmum(JSON.parse(storedMapelUmum));
    } else {
      const defaultUmum = [
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
      setMapelUmum(defaultUmum);
      localStorage.setItem('sibima_mapel_umum', JSON.stringify(defaultUmum));
    }

    // Auth status check
    const storedLogin = localStorage.getItem('sibima_logged_in');
    if (storedLogin === 'true') {
      const storedRole = localStorage.getItem('sibima_role');
      const storedUser = localStorage.getItem('sibima_username');
      if (storedRole) setCurrentRole(storedRole as UserRole);
      if (storedUser) setCurrentUser(storedUser);
      setIsLoggedIn(true);
    }

    // Load users database
    const users = getLocalStorageUsers();
    setUsersList(users);
  }, []);

  // Save changes to localStorage on any state change
  const persistChanges = (
    updatedSiswa: Siswa[],
    updatedKelas: Kelas[],
    updatedNilai: NilaiSemester[],
    updatedIjazah: NilaiIjazah[],
    updatedLogs: LogAktivitas[]
  ) => {
    setSiswaList(updatedSiswa);
    setKelasList(updatedKelas);
    setNilaiSemesterList(updatedNilai);
    setNilaiIjazahList(updatedIjazah);
    setLogs(updatedLogs);

    saveLocalStorageData({
      siswa: updatedSiswa,
      kelas: updatedKelas,
      nilaiSemester: updatedNilai,
      nilaiIjazah: updatedIjazah,
      logs: updatedLogs,
    });
  };

  const handleResetDatabase = () => {
    if (window.confirm("Apakah Anda yakin ingin mengatur ulang data Buku Induk SIBIMA kembali ke bawaan awal? Semua data impor tambahan Anda akan terhapus.")) {
      localStorage.removeItem('sibima_siswa');
      localStorage.removeItem('sibima_kelas');
      localStorage.removeItem('sibima_nilai');
      localStorage.removeItem('sibima_ijazah');
      localStorage.removeItem('sibima_logs');

      // Reload
      const data = getLocalStorageData();
      persistChanges(data.siswa, data.kelas, data.nilaiSemester, data.nilaiIjazah, data.logs);
      
      const updatedLogs = addActivityLog(
        'Sistem Utama',
        'Operator',
        'Mengatur ulang database SIBIMA ke bawaan awal madrasah',
        'delete'
      );
      if (updatedLogs) setLogs(updatedLogs);

      setSelectedSiswaId(null);
      setEditSiswaId(null);
      setShowForm(false);
      setActiveMenu('Dashboard');
    }
  };

  // Student list action helper (Viewing detail or triggering inline edits)
  const handleSelectSiswa = (id: string, viewMode: 'detail' | 'edit' = 'detail') => {
    if (viewMode === 'detail') {
      setSelectedSiswaId(id);
      setActiveMenu('Buku Induk Digital');
    } else {
      setEditSiswaId(id);
      setShowForm(true);
    }
  };

  const handleDeleteSiswa = (id: string) => {
    const student = siswaList.find(s => s.id_siswa === id);
    const updatedSiswa = siswaList.filter(s => s.id_siswa !== id);
    const updatedGrades = nilaiSemesterList.filter(n => n.id_siswa !== id);
    const updatedIjazah = nilaiIjazahList.filter(i => i.id_siswa !== id);

    const updatedLogs = addActivityLog(
      'Ust. Usman Fauzi',
      currentRole,
      `Menghapus berkas buku induk siswa: ${student?.nama || id}`,
      'delete'
    );

    persistChanges(updatedSiswa, kelasList, updatedGrades, updatedIjazah, updatedLogs || logs);
  };

  const handleImportComplete = (
    newSiswaList: Siswa[],
    newNilaiSemester: NilaiSemester[],
    newNilaiIjazah: NilaiIjazah[],
    logMsg: string
  ) => {
    // Merge grades and ijazah values
    const mergedSiswaList = [...newSiswaList];
    
    let mergedGradesList = [...nilaiSemesterList];
    if (newNilaiSemester.length > 0) {
      // Overwrite/Add imported grades
      newNilaiSemester.forEach(importedGrade => {
        const existingIdx = mergedGradesList.findIndex(
          g => g.id_siswa === importedGrade.id_siswa && 
               g.semester === importedGrade.semester && 
               g.mapel === importedGrade.mapel
        );
        if (existingIdx !== -1) {
          mergedGradesList[existingIdx] = importedGrade;
        } else {
          mergedGradesList.push(importedGrade);
        }
      });
    }

    let mergedIjazahList = [...nilaiIjazahList];
    if (newNilaiIjazah.length > 0) {
      newNilaiIjazah.forEach(importedIjz => {
        const existingIdx = mergedIjazahList.findIndex(
          i => i.id_siswa === importedIjz.id_siswa && i.mapel === importedIjz.mapel
        );
        if (existingIdx !== -1) {
          mergedIjazahList[existingIdx] = importedIjz;
        } else {
          mergedIjazahList.push(importedIjz);
        }
      });
    }

    const updatedLogs = addActivityLog(
      'Ust. Usman Fauzi',
      currentRole,
      logMsg,
      'import'
    );

    persistChanges(mergedSiswaList, kelasList, mergedGradesList, mergedIjazahList, updatedLogs || logs);
    setActiveMenu('Data Siswa Lengkap');
  };

  // Callback from SiswaForm (saves or registers new students)
  const handleSaveStudent = (
    savedSiswa: Siswa,
    savedGrades: NilaiSemester[],
    savedIjazah: NilaiIjazah[]
  ) => {
    const isNew = !siswaList.some(s => s.id_siswa === savedSiswa.id_siswa);
    
    let updatedSiswaList = [...siswaList];
    if (isNew) {
      updatedSiswaList.push(savedSiswa);
    } else {
      updatedSiswaList = updatedSiswaList.map(s => s.id_siswa === savedSiswa.id_siswa ? savedSiswa : s);
    }

    // Merge grades
    let mergedGrades = [...nilaiSemesterList];
    if (isNew) {
      mergedGrades = [...mergedGrades, ...savedGrades];
    } else {
      // replace for this student
      mergedGrades = mergedGrades.filter(g => g.id_siswa !== savedSiswa.id_siswa);
      mergedGrades = [...mergedGrades, ...savedGrades];
    }

    // Merge ijazah
    let mergedIjazah = [...nilaiIjazahList];
    if (isNew) {
      mergedIjazah = [...mergedIjazah, ...savedIjazah];
    } else {
      mergedIjazah = mergedIjazah.filter(i => i.id_siswa !== savedSiswa.id_siswa);
      mergedIjazah = [...mergedIjazah, ...savedIjazah];
    }

    const updatedLogs = addActivityLog(
      currentRole === 'Wali Kelas' ? 'Ustadzah Aminah' : 'Ust. Usman Fauzi',
      currentRole,
      `${isNew ? 'Menambahkan register siswa baru' : 'Memperbaharui biodata/rapor siswa'}: ${savedSiswa.nama}`,
      isNew ? 'create' : 'update'
    );

    persistChanges(updatedSiswaList, kelasList, mergedGrades, mergedIjazah, updatedLogs || logs);
    setShowForm(false);
    setEditSiswaId(null);
  };

  const handleUpdateSiswaPhoto = (idSiswa: string, base64Photo: string) => {
    const student = siswaList.find(s => s.id_siswa === idSiswa);
    if (!student) return;

    const updatedSiswaList = siswaList.map(s => 
      s.id_siswa === idSiswa ? { ...s, foto: base64Photo } : s
    );

    const updatedLogs = addActivityLog(
      currentUser,
      currentRole,
      `Memperbarui foto digital siswa: ${student.nama}`,
      'update'
    );

    persistChanges(updatedSiswaList, kelasList, nilaiSemesterList, nilaiIjazahList, updatedLogs || logs);
  };

  const handleUpdateUsers = (updatedUsers: UserAccount[], logMessage: string) => {
    setUsersList(updatedUsers);
    saveLocalStorageUsers(updatedUsers);

    const updatedLogs = addActivityLog(
      currentUser,
      currentRole,
      logMessage,
      'update'
    );
    if (updatedLogs) {
      setLogs(updatedLogs);
      saveLocalStorageData({
        siswa: siswaList,
        kelas: kelasList,
        nilaiSemester: nilaiSemesterList,
        nilaiIjazah: nilaiIjazahList,
        logs: updatedLogs
      });
    }
  };

  const handleLoginSuccess = (role: UserRole, name: string) => {
    setCurrentRole(role);
    setCurrentUser(name);
    setIsLoggedIn(true);
    localStorage.setItem('sibima_logged_in', 'true');
    localStorage.setItem('sibima_role', role);
    localStorage.setItem('sibima_username', name);

    const updatedLogs = addActivityLog(
      name,
      role,
      `Berhasil masuk ke Dashboard SIBIMA MA Banu Hasyim`,
      'update'
    );
    if (updatedLogs) setLogs(updatedLogs);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('sibima_logged_in');
    localStorage.removeItem('sibima_role');
    localStorage.removeItem('sibima_username');
  };

  const handleUpdateMaster = (data: {
    kelas?: Kelas[];
    jurusan?: MasterJurusan[];
    tapel?: AcademicYear[];
    logMessage: string;
  }) => {
    let currentKelas = kelasList;
    if (data.kelas) {
      currentKelas = data.kelas;
      setKelasList(data.kelas);
      localStorage.setItem('sibima_kelas', JSON.stringify(data.kelas));
    }

    if (data.jurusan) {
      setJurusanList(data.jurusan);
      localStorage.setItem('sibima_jurusan', JSON.stringify(data.jurusan));
    }

    if (data.tapel) {
      setTapelList(data.tapel);
      localStorage.setItem('sibima_tapel', JSON.stringify(data.tapel));
    }

    const updatedLogs = addActivityLog(
      currentUser,
      currentRole,
      data.logMessage,
      'update'
    );
    if (updatedLogs) setLogs(updatedLogs);

    persistChanges(siswaList, currentKelas, nilaiSemesterList, nilaiIjazahList, updatedLogs || logs);
  };

  const handleUpdateMapel = (major: 'MIPA' | 'IPS' | 'Keagamaan' | 'Umum' | 'Ijazah', list: string[]) => {
    if (major === 'MIPA') {
      setMapelMipa(list);
      localStorage.setItem('sibima_mapel_mipa', JSON.stringify(list));
    } else if (major === 'IPS') {
      setMapelIps(list);
      localStorage.setItem('sibima_mapel_ips', JSON.stringify(list));
    } else if (major === 'Keagamaan') {
      setMapelKeagamaan(list);
      localStorage.setItem('sibima_mapel_keagamaan', JSON.stringify(list));
    } else if (major === 'Umum') {
      setMapelUmum(list);
      localStorage.setItem('sibima_mapel_umum', JSON.stringify(list));
    } else if (major === 'Ijazah') {
      setMapelIjazah(list);
      localStorage.setItem('sibima_mapel_ijazah', JSON.stringify(list));
    }

    const updatedLogs = addActivityLog(
      currentUser,
      currentRole,
      `Memperbarui daftar mata pelajaran master untuk kategori: ${major}`,
      'update'
    );
    if (updatedLogs) setLogs(updatedLogs);
  };

  // If NOT logged in, return Login view dashboard
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // If in fullscreen print view mode
  if (printSiswaId) {
    const pSiswa = siswaList.find(s => s.id_siswa === printSiswaId);
    if (pSiswa) {
      return (
        <BukuIndukPrint
          siswa={pSiswa}
          kelas={kelasList}
          nilaiSemester={nilaiSemesterList}
          nilaiIjazah={nilaiIjazahList}
          onClosePrint={() => setPrintSiswaId(null)}
        />
      );
    }
  }

  // Active student object helper in viewer
  const activeSiswaObj = siswaList.find(s => s.id_siswa === selectedSiswaId) || siswaList[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased overflow-x-hidden selection:bg-emerald-200">
      
      {/* Dynamic Role Header Banner */}
      <RoleHeader
        currentRole={currentRole}
        onChangeRole={(role) => {
          setCurrentRole(role);
          if (role === 'Operator') {
            setCurrentUser('Ust. Usman Fauzi');
          } else if (role === 'Wali Kelas') {
            setCurrentUser('Ustadzah Aminah, S.Si.');
          } else if (role === 'Kepala Madrasah') {
            setCurrentUser('K.H. Nuruddin, M.Pd.I.');
          } else {
            setCurrentUser('Muhammad Wildan Al-Ghifari');
          }
        }}
        operatorName={currentUser}
        onResetDatabase={handleResetDatabase}
      />

      {/* Main Core Layout wrapper */}
      <div className="max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* Left Sidebar Portal Navigation */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="p-4 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white border-b-2 border-amber-400">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300">Menu Navigasi</span>
              <h3 className="font-extrabold text-sm tracking-tight">MA Banu Hasyim</h3>
            </div>

             <nav className="p-2 space-y-1">
              {[
                { name: 'Dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" />, roles: ['Operator', 'Wali Kelas', 'Kepala Madrasah', 'Siswa'] },
                { name: 'Data Siswa Lengkap', icon: <Users className="h-4.5 w-4.5" />, roles: ['Operator', 'Wali Kelas', 'Kepala Madrasah'] },
                { name: 'Entri Foto Siswa', icon: <Camera className="h-4.5 w-4.5" />, roles: ['Operator', 'Wali Kelas'] },
                { name: 'Buku Induk Saya', icon: <Award className="h-4.5 w-4.5" />, roles: ['Siswa'] },
                { name: 'Import Data Excel', icon: <FileSpreadsheet className="h-4.5 w-4.5" />, roles: ['Operator'] },
                { name: 'Entri & Edit Master', icon: <Layers className="h-4.5 w-4.5" />, roles: ['Operator'] },
                { name: 'Kelola User & Sandi', icon: <KeyRound className="h-4.5 w-4.5" />, roles: ['Operator'] },
                { name: 'Sinkron Google Sheets', icon: <CloudLightning className="h-4.5 w-4.5" />, roles: ['Operator', 'Wali Kelas', 'Kepala Madrasah'] },
                { name: 'Panduan & Deploy', icon: <Book className="h-4.5 w-4.5" />, roles: ['Operator', 'Wali Kelas', 'Kepala Madrasah'] },
              ].filter(item => item.roles.includes(currentRole)).map((item) => {
                const isActive = activeMenu === item.name && !selectedSiswaId;
                return (
                  <button
                    id={`sidebar-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    key={item.name}
                    onClick={() => {
                      setSelectedSiswaId(null);
                      setActiveMenu(item.name);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border duration-150 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-990 border-emerald-200 font-bold'
                        : 'text-slate-600 hover:text-emerald-805 border-transparent hover:bg-emerald-50/20'
                    }`}
                  >
                    <span className={isActive ? 'text-emerald-700' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </button>
                );
              })}

              <button
                id="sidebar-nav-logout"
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-red-650 hover:text-red-700 hover:bg-red-50/50 mt-4 border border-transparent cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5 text-red-400" />
                <span>Keluar (Logout)</span>
              </button>

              {/* If viewing a selected student's Buku Induk register */}
              {selectedSiswaId && activeSiswaObj && (
                <div className="pt-2 mt-2 border-t border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold px-3 uppercase tracking-wider mb-1">PENGINTIP AKTIF</div>
                  <button
                    id="sidebar-nav-active-induk"
                    onClick={() => setActiveMenu('Buku Induk Digital')}
                    className="w-full flex items-center space-x-2 px-3 py-2 bg-amber-50 text-amber-900 font-bold rounded-xl text-xs border border-amber-200"
                  >
                    <Award className="h-4 w-4 text-amber-600 shrink-0" />
                    <span className="truncate">{activeSiswaObj.nama}</span>
                  </button>
                </div>
              )}
            </nav>
          </div>

          {/* Quick Help guide block */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 space-y-3">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-450 block">Panduan Cepat SIBIMA</span>
            
            <div className="space-y-2 text-xs text-slate-650 leading-relaxed font-sans">
              <div className="flex gap-2">
                <span className="font-bold text-amber-600">1.</span>
                <span>Pilih Hak Akses di bar atas untuk mensimulasikan tugas operator, wali kelas, atau kepala madrasah.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-amber-600">2.</span>
                <span>Klik tab <strong>Penyelaras Excel</strong> untuk menyontek data baru / nilai langsung ke siswa.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-[#0F7B6C]">3.</span>
                <span>Klik tombol <strong>Buku Induk</strong> pada siswa mana saja untuk pratinjau lembaran digital resmi.</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Dynamic Center Workstation panel */}
        <main className="lg:col-span-9 space-y-6">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSiswaId ? `induk-${selectedSiswaId}` : activeMenu}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* Render Selected student's Buku Induk viewer */}
              {selectedSiswaId && activeSiswaObj ? (
                <BukuIndukViewer
                  siswa={activeSiswaObj}
                  kelas={kelasList}
                  nilaiSemester={nilaiSemesterList}
                  nilaiIjazah={nilaiIjazahList}
                  currentRole={currentRole}
                  onBackToList={() => { setSelectedSiswaId(null); setActiveMenu('Data Siswa Lengkap'); }}
                  onTriggerPrint={(sId) => setPrintSiswaId(sId)}
                />
              ) : (
                <>
                  {/* Dashboard */}
                  {activeMenu === 'Dashboard' && (
                    <Dashboard
                      siswa={siswaList}
                      kelas={kelasList}
                      logs={logs}
                      onNavigate={(tab) => setActiveMenu(tab)}
                      onSelectSiswa={(sId) => handleSelectSiswa(sId, 'detail')}
                      currentRole={currentRole}
                      currentUser={currentUser}
                    />
                  )}

                  {/* Buku Induk Saya (Siswa Role only) */}
                  {activeMenu === 'Buku Induk Saya' && (
                    <BukuIndukViewer
                      siswa={siswaList.find(s => s.nama === currentUser) || siswaList[0]}
                      kelas={kelasList}
                      nilaiSemester={nilaiSemesterList}
                      nilaiIjazah={nilaiIjazahList}
                      currentRole={currentRole}
                      onBackToList={() => { setActiveMenu('Dashboard'); }}
                      onTriggerPrint={(sId) => setPrintSiswaId(sId)}
                    />
                  )}

                  {/* Student List */}
                  {activeMenu === 'Data Siswa Lengkap' && (
                    <SiswaList
                      siswa={siswaList}
                      kelas={kelasList}
                      currentRole={currentRole}
                      onSelectSiswa={(id, mode) => handleSelectSiswa(id, mode)}
                      onDeleteSiswa={handleDeleteSiswa}
                      onAddSiswa={() => { setEditSiswaId(null); setShowForm(true); }}
                    />
                  )}

                  {/* Import Data Excel */}
                  {activeMenu === 'Import Data Excel' && (
                    <ExcelImporter
                      currentRole={currentRole}
                      siswa={siswaList}
                      kelas={kelasList}
                      onImportComplete={handleImportComplete}
                    />
                  )}

                  {/* Entri & Edit Master */}
                  {activeMenu === 'Entri & Edit Master' && (
                    <KonfigurasiMaster
                      kelasList={kelasList}
                      jurusanList={jurusanList}
                      tapelList={tapelList}
                      currentRole={currentRole}
                      onUpdateMaster={handleUpdateMaster}
                      mapelMipa={mapelMipa}
                      mapelIps={mapelIps}
                      mapelKeagamaan={mapelKeagamaan}
                      mapelUmum={mapelUmum}
                      mapelIjazah={mapelIjazah}
                      onUpdateMapel={handleUpdateMapel}
                    />
                  )}

                  {/* Sinkron Google Sheets */}
                  {activeMenu === 'Sinkron Google Sheets' && (
                    <GoogleSheetsSync
                      siswa={siswaList}
                      kelas={kelasList}
                      nilaiSemester={nilaiSemesterList}
                      currentRole={currentRole}
                    />
                  )}

                  {/* Entri Foto Siswa */}
                  {activeMenu === 'Entri Foto Siswa' && (
                    <SiswaFotoEntri
                      siswa={siswaList}
                      kelas={kelasList}
                      currentRole={currentRole}
                      onUpdateSiswaPhoto={handleUpdateSiswaPhoto}
                    />
                  )}

                  {/* Kelola User & Sandi */}
                  {activeMenu === 'Kelola User & Sandi' && (
                    <UserManagement
                      currentRole={currentRole}
                      currentUser={currentUser}
                      usersList={usersList}
                      onUpdateUsers={handleUpdateUsers}
                    />
                  )}

                  {/* Panduan & Deploy */}
                  {activeMenu === 'Panduan & Deploy' && (
                    <PanduanDeploy />
                  )}
                </>
              )}

            </motion.div>
          </AnimatePresence>

        </main>

      </div>

      {/* Floating Backdrop modal for SISWA ADD/EDIT FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
          <div className="w-full max-w-4xl my-8">
            <SiswaForm
              siswaId={editSiswaId || undefined}
              siswaList={siswaList}
              kelasList={kelasList}
              nilaiSemesterList={nilaiSemesterList}
              nilaiIjazahList={nilaiIjazahList}
              onSave={handleSaveStudent}
              onClose={() => { setShowForm(false); setEditSiswaId(null); }}
              mapelMipa={mapelMipa}
              mapelIps={mapelIps}
              mapelKeagamaan={mapelKeagamaan}
              mapelUmum={mapelUmum}
              mapelIjazah={mapelIjazah}
            />
          </div>
        </div>
      )}

      {/* Footer copyright */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 text-center font-mono">
        <p className="font-extrabold text-[#D4AF37] tracking-wider uppercase mb-1">SIBIMA DIGITAL MA BANU HASYIM SIDOARJO</p>
        <p className="font-light">Sistem Buku Induk Digital Madrasah Aliyah • Selaras RDM Rapor Digital Madrasah Kementerian Agama</p>
        <p className="mt-4 text-slate-600">© 2026 MA Banu Hasyim. Hak Cipta Dilindungi.</p>
      </footer>

    </div>
  );
}
