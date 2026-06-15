/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Siswa, Kelas, NilaiSemester, NilaiIjazah, LogAktivitas, UserRole, UserAccount } from '../types';

export const SEED_CLASSES: Kelas[] = [
  { id_kelas: 'kls-xmipa', nama_kelas: 'X - MIPA 1', jurusan: 'MIPA', wali_kelas: 'Ust. H. Abdurrahman, S.Pd.' },
  { id_kelas: 'kls-ximipa', nama_kelas: 'XI - MIPA 1', jurusan: 'MIPA', wali_kelas: 'Ustadzah Aminah, S.Si.' },
  { id_kelas: 'kls-xiimipa', nama_kelas: 'XII - MIPA 1', jurusan: 'MIPA', wali_kelas: 'Ustadzah Siti khadijah, M.Pd.' },
  { id_kelas: 'kls-xips', nama_kelas: 'X - IPS 1', jurusan: 'IPS', wali_kelas: 'Ust. Ahmad Fauzi, S.Sos.' },
  { id_kelas: 'kls-xiips', nama_kelas: 'XI - IPS 1', jurusan: 'IPS', wali_kelas: 'Ust. Sholahuddin, S.Pd.' },
  { id_kelas: 'kls-xiiips', nama_kelas: 'XII - IPS 1', jurusan: 'IPS', wali_kelas: 'Ustadzah Lailatul Qodriyah, M.A.' },
  { id_kelas: 'kls-xrel', nama_kelas: 'X - Keagamaan', jurusan: 'Keagamaan', wali_kelas: 'Ust. M. Syifaur Ramli, S.Th.I.' },
  { id_kelas: 'kls-xiirel', nama_kelas: 'XII - Keagamaan', jurusan: 'Keagamaan', wali_kelas: 'K.H. Nuruddin, M.Pd.I.' },
];

export const MAPEL_LIST_MIPA = [
  'Al-Qur\'an Hadis',
  'Aqidah Akhlak',
  'Fikih',
  'Sejarah Kebudayaan Islam (SKI)',
  'Bahasa Arab',
  'PPKN',
  'Bahasa Indonesia',
  'Matematika',
  'Bahasa Inggris',
  'Fisika',
  'Kimia',
  'Biologi',
  'PJOK',
];

export const MAPEL_LIST_IPS = [
  'Al-Qur\'an Hadis',
  'Aqidah Akhlak',
  'Fikih',
  'Sejarah Kebudayaan Islam (SKI)',
  'Bahasa Arab',
  'PPKN',
  'Bahasa Indonesia',
  'Matematika',
  'Bahasa Inggris',
  'Geografi',
  'Sejarah Peminatan',
  'Sosiologi',
  'Ekonomi',
];

export const MAPEL_LIST_RELIGION = [
  'Al-Qur\'an Hadis',
  'Aqidah Akhlak',
  'Fikih',
  'Sejarah Kebudayaan Islam (SKI)',
  'Bahasa Arab',
  'PPKN',
  'Bahasa Indonesia',
  'Matematika',
  'Bahasa Inggris',
  'Tafsir-Ilmu Tafsir',
  'Hadis-Ilmu Hadis',
  'Ushul Fikih',
  'Akhlak Tasawuf',
];

export const MAPEL_LIST_UMUM = [
  'Al-Qur\'an Hadis',
  'Aqidah Akhlak',
  'Fikih',
  'Sejarah Kebudayaan Islam (SKI)',
  'Bahasa Arab',
  'PPKN',
  'Bahasa Indonesia',
  'Matematika',
  'Bahasa Inggris',
  'Fisika',
  'Kimia',
  'Biologi',
  'Geografi',
  'Sosiologi',
  'Ekonomi',
  'Seni Budaya',
  'Informatika',
  'PJOK',
];

export const GENERAL_IJAZAH_MAPEL = [
  'Al-Qur\'an Hadis',
  'Aqidah Akhlak',
  'Fikih',
  'Sejarah Kebudayaan Islam (SKI)',
  'Bahasa Arab',
  'PPKN',
  'Bahasa Indonesia',
  'Matematika',
  'Bahasa Inggris',
  'Mapel Pilihan'
];

export const SEED_SISWA: Siswa[] = [
  {
    id_siswa: 'sis-1001',
    nis: '23241001',
    nisn: '0085432101',
    nik: '3515120104080001',
    nama: 'Muhammad Wildan Al-Ghifari',
    tempat_lahir: 'Sidoarjo',
    tgl_lahir: '2008-04-12',
    jk: 'L',
    agama: 'Islam',
    status_anak: 'Kandung',
    anak_ke: 1,
    jml_saudara: 2,
    hobi: 'Membaca Kitab Kuning, Coding',
    cita_cita: 'Ulama Teknologi / Software Engineer',
    alamat_lengkap: 'Jl. KH. Hasyim Asy\'ari No. 12 RT 04 RW 02',
    desa: 'Pepe',
    kecamatan: 'Sedati',
    kabupaten: 'Sidoarjo',
    provinsi: 'Jawa Timur',
    kode_pos: '61253',
    nama_ayah: 'KH. Solihin Mansur',
    nik_ayah: '3515120805720002',
    pendidikan_ayah: 'S1 Hukum Islam',
    pekerjaan_ayah: 'Guru / Swasta',
    penghasilan_ayah: 'Rp. 5.000.000 - Rp. 7.500.000',
    nama_ibu: 'Hj. Aminah Maimunah',
    nik_ibu: '3515121408750003',
    pendidikan_ibu: 'D3 Tarbiyah',
    pekerjaan_ibu: 'Ibu Rumah Tangga',
    penghasilan_ibu: 'Tidak Berpenghasilan',
    tahun_masuk: '2023',
    kelas_masuk: 'X',
    id_kelas: 'kls-ximipa',
    jurusan: 'MIPA',
    asal_sekolah: 'MTs Banu Hasyim Sidoarjo',
    no_skhun: 'SKHUN-MTs-2023-0091',
    no_ijazah_smp: 'DN-24/MTs/03/491028',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id_siswa: 'sis-1002',
    nis: '23241002',
    nisn: '0085432102',
    nik: '3515125509080002',
    nama: 'Nabila Zahratul Syita',
    tempat_lahir: 'Surabaya',
    tgl_lahir: '2008-09-15',
    jk: 'P',
    agama: 'Islam',
    status_anak: 'Kandung',
    anak_ke: 2,
    jml_saudara: 3,
    hobi: 'Menulis Kaligrafi, Thariqah Hadrah',
    cita_cita: 'Dosen Sastra Arab / Desainer Grafis',
    alamat_lengkap: 'Perum Pondok Mutiara Blok CC-09 RT 01 RW 10',
    desa: 'Kepadangan',
    kecamatan: 'Tulangan',
    kabupaten: 'Sidoarjo',
    provinsi: 'Jawa Timur',
    kode_pos: '61273',
    nama_ayah: 'H. Rudy Hermawan, S.E.',
    nik_ayah: '3515102211750001',
    pendidikan_ayah: 'S1 Ekonomi',
    pekerjaan_ayah: 'Wiraswasta',
    penghasilan_ayah: 'Rp. 7.500.000 - Rp. 10.000.000',
    nama_ibu: 'Hj. Fatimah Az-Zahra',
    nik_ibu: '3515106512780004',
    pendidikan_ibu: 'S1 Farmasi',
    pekerjaan_ibu: 'Apoteker',
    penghasilan_ibu: 'Rp. 3.000.000 - Rp. 5.000.000',
    tahun_masuk: '2023',
    kelas_masuk: 'X',
    id_kelas: 'kls-ximipa',
    jurusan: 'MIPA',
    asal_sekolah: 'SMP Al-Hikmah Surabaya',
    no_skhun: 'SKHUN-SMP-2023-1120',
    no_ijazah_smp: 'DN-18/SMP/03/512961',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id_siswa: 'sis-1003',
    nis: '23241003',
    nisn: '0085432103',
    nik: '3515091802080001',
    nama: 'Achmad Dani Yusuf',
    tempat_lahir: 'Sidoarjo',
    tgl_lahir: '2008-02-18',
    jk: 'L',
    agama: 'Islam',
    status_anak: 'Kandung',
    anak_ke: 1,
    jml_saudara: 1,
    hobi: 'Futsal, Menghafal Al-Qur\'an',
    cita_cita: 'TNI-AL / Hafidz',
    alamat_lengkap: 'Dusun Wagir RT 03 RW 01',
    desa: 'Kwagean',
    kecamatan: 'Loceret',
    kabupaten: 'Nganjuk',
    provinsi: 'Jawa Timur',
    kode_pos: '64471',
    nama_ayah: 'Sugianto',
    nik_ayah: '3518112310700001',
    pendidikan_ayah: 'SMA',
    pekerjaan_ayah: 'Petani',
    penghasilan_ayah: 'Rp. 1.500.000 - Rp. 3.000.000',
    nama_ibu: 'Siti Masithoh',
    nik_ibu: '3518115504740003',
    pendidikan_ibu: 'SMA',
    pekerjaan_ibu: 'Buruh Tani',
    penghasilan_ibu: 'Rp. 1.000.000 - Rp. 2.000.000',
    tahun_masuk: '2023',
    kelas_masuk: 'X',
    id_kelas: 'kls-xiips',
    jurusan: 'IPS',
    asal_sekolah: 'MTs Negeri 1 Nganjuk',
    no_skhun: 'SKHUN-MTs-2023-4509',
    no_ijazah_smp: 'DN-24/MTs/12/334051',
    foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id_siswa: 'sis-1004',
    nis: '22230910',
    nisn: '0071239556',
    nik: '3515031111070003',
    nama: 'Siti Aisyah Rahmawati',
    tempat_lahir: 'Mojokerto',
    tgl_lahir: '2007-11-11',
    jk: 'P',
    agama: 'Islam',
    status_anak: 'Kandung',
    anak_ke: 3,
    jml_saudara: 4,
    hobi: 'Memasak, Tilawatil Qur\'an',
    cita_cita: 'Dokter Spesialis Anak',
    alamat_lengkap: 'Dusun Mlaten RT 02 RW 04',
    desa: 'Wringinanom',
    kecamatan: 'Wringinanom',
    kabupaten: 'Gresik',
    provinsi: 'Jawa Timur',
    kode_pos: '61176',
    nama_ayah: 'H. Nurul Huda',
    nik_ayah: '3525110303650001',
    pendidikan_ayah: 'D3 Teknik',
    pekerjaan_ayah: 'Wiraswasta Bengkel',
    penghasilan_ayah: 'Rp. 3.000.000 - Rp. 5.000.000',
    nama_ibu: 'Hj. Zulaikho',
    nik_ibu: '3525114505700002',
    pendidikan_ibu: 'D2 Pendidikan Islam',
    pekerjaan_ibu: 'Guru PAUD',
    penghasilan_ibu: 'Rp. 1.000.000 - Rp. 2.000.000',
    tahun_masuk: '2022',
    kelas_masuk: 'X',
    id_kelas: 'kls-xiimipa',
    jurusan: 'MIPA',
    asal_sekolah: 'MTs Pondok Modern Darussalam Gontor',
    no_skhun: 'SKHUN-MTs-2022-7712',
    no_ijazah_smp: 'DN-21/MTs/08/988410',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id_siswa: 'sis-1005',
    nis: '22230911',
    nisn: '0071239557',
    nik: '3515050512070005',
    nama: 'Syahril Ramadhan',
    tempat_lahir: 'Gresik',
    tgl_lahir: '2007-12-05',
    jk: 'L',
    agama: 'Islam',
    status_anak: 'Anak Angkat',
    anak_ke: 1,
    jml_saudara: 0,
    hobi: 'Nasyid, Basket',
    cita_cita: 'Akuntan Syariah / Pebisnis Kuliner',
    alamat_lengkap: 'Sukodono Raya Gg. Mawar No. 15',
    desa: 'Sukodono',
    kecamatan: 'Sukodono',
    kabupaten: 'Sidoarjo',
    provinsi: 'Jawa Timur',
    kode_pos: '61258',
    nama_ayah: 'Hartono, S.E.',
    nik_ayah: '3515051506720005',
    pendidikan_ayah: 'S1 Manajemen',
    pekerjaan_ayah: 'Karyawan Swasta',
    penghasilan_ayah: 'Rp. 5.000.000 - Rp. 7.500.000',
    nama_ibu: 'Ika Pujiastuti',
    nik_ibu: '3515054911760002',
    pendidikan_ibu: 'SMA',
    pekerjaan_ibu: 'Karyawan Swasta',
    penghasilan_ibu: 'Rp. 3.000.000 - Rp. 5.000.000',
    tahun_masuk: '2022',
    kelas_masuk: 'X',
    id_kelas: 'kls-xiiips',
    jurusan: 'IPS',
    asal_sekolah: 'SMP Swasta Muhammadiyah 2 Sidoarjo',
    no_skhun: 'SKHUN-SMP-2022-9010',
    no_ijazah_smp: 'DN-18/SMP/11/409121',
    foto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  {
    id_siswa: 'sis-1006',
    nis: '22230912',
    nisn: '0071239558',
    nik: '3515012508070004',
    nama: 'Aulia Zahra Shofia',
    tempat_lahir: 'Sidoarjo',
    tgl_lahir: '2007-08-25',
    jk: 'P',
    agama: 'Islam',
    status_anak: 'Kandung',
    anak_ke: 2,
    jml_saudara: 2,
    hobi: 'Qasidah, Membaca Sejarah Islam',
    cita_cita: 'Diplomat RI / Ahli Fiqih Wanita',
    alamat_lengkap: 'Krembangan Gg. Utama No. 44 RT 02 RW 03',
    desa: 'Krembangan',
    kecamatan: 'Taman',
    kabupaten: 'Sidoarjo',
    provinsi: 'Jawa Timur',
    kode_pos: '61257',
    nama_ayah: 'Budi Utomo, M.Ag.',
    nik_ayah: '3515011112700002',
    pendidikan_ayah: 'S2 Syariah',
    pekerjaan_ayah: 'Dosen / Penghulu KUA',
    penghasilan_ayah: 'Rp. 5.000.000 - Rp. 7.500.000',
    nama_ibu: 'Hj. Syarifah Aminah',
    nik_ibu: '3515014310740001',
    pendidikan_ibu: 'S1 Tarbiyah',
    pekerjaan_ibu: 'Guru MIN Sidoarjo',
    penghasilan_ibu: 'Rp. 3.000.000 - Rp. 5.000.000',
    tahun_masuk: '2022',
    kelas_masuk: 'X',
    id_kelas: 'kls-xiirel',
    jurusan: 'Keagamaan',
    asal_sekolah: 'MTs Banu Hasyim Sidoarjo',
    no_skhun: 'SKHUN-MTs-2022-3844',
    no_ijazah_smp: 'DN-24/MTs/03/491040',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  }
];

// Compile standard semester grades for standard students
export const generateSeedGrades = (): NilaiSemester[] => {
  const grades: NilaiSemester[] = [];
  const mapelMipa = MAPEL_LIST_MIPA;
  const mapelIps = MAPEL_LIST_IPS;
  const mapelRel = MAPEL_LIST_RELIGION;

  SEED_SISWA.forEach((siswa) => {
    const listMapel = siswa.jurusan === 'MIPA' 
      ? mapelMipa 
      : (siswa.jurusan === 'IPS' ? mapelIps : mapelRel);
    
    // Generate grades for semesters
    // Active Class X: ends semi grade 1 and 2
    // Active Class XI: grade 1,2,3,4
    // Active Class XII: grade 1,2,3,4,5,6
    let maxSem = 2; // base
    if (siswa.id_kelas.includes('xi-') || siswa.id_kelas.includes('ximipa') || siswa.id_kelas.includes('xiips')) {
      maxSem = 4;
    } else if (siswa.id_kelas.includes('xii')) {
      maxSem = 6;
    }

    const startIdx = siswa.id_siswa === 'sis-1001' ? 78 : (siswa.id_siswa === 'sis-1002' ? 82 : 75);

    for (let sem = 1; sem <= maxSem; sem++) {
      listMapel.forEach((mapel, index) => {
        // Pseudo-random but consistent school grades
        const scoreOffset = (index % 5) + (sem % 3);
        const finalScore = Math.min(100, Math.max(70, startIdx + scoreOffset));
        grades.push({
          id_nilai: `nil-${siswa.id_siswa}-${sem}-${index}`,
          id_siswa: siswa.id_siswa,
          semester: sem,
          mapel,
          nilai: finalScore,
        });
      });
    }
  });

  return grades;
};

export const generateSeedIjazah = (): NilaiIjazah[] => {
  const ijazahList: NilaiIjazah[] = [];
  
  // Only Class XII has Ijazah grades or graduating seniors
  SEED_SISWA.forEach((siswa) => {
    if (siswa.id_kelas.includes('xii')) {
      const mapels = GENERAL_IJAZAH_MAPEL;
      const startIdx = siswa.id_siswa === 'sis-1004' ? 84 : (siswa.id_siswa === 'sis-1005' ? 79 : 86);
      
      mapels.forEach((mapel, idx) => {
        const scoreOffset = (idx % 4);
        ijazahList.push({
          id_ijazah: `ijz-${siswa.id_siswa}-${idx}`,
          id_siswa: siswa.id_siswa,
          mapel,
          nilai: startIdx + scoreOffset,
        });
      });
    }
  });

  return ijazahList;
};

export const SEED_LOGS: LogAktivitas[] = [
  {
    id_log: 'log-1',
    timestamp: '2026-06-10T08:30:00Z',
    operator: 'Ust. Usman Fauzi (Operator)',
    role: 'Operator',
    aktivitas: 'Inisialisasi database SIBIMA MA Banu Hasyim',
    tipe: 'create',
  },
  {
    id_log: 'log-2',
    timestamp: '2026-06-10T09:15:00Z',
    operator: 'Ust. Usman Fauzi (Operator)',
    role: 'Operator',
    aktivitas: 'Import data siswa gelombang-1 (6 siswa)',
    tipe: 'import',
  },
  {
    id_log: 'log-3',
    timestamp: '2026-06-10T11:02:00Z',
    operator: 'Ust. Solihin Mansur (Kepala Madrasah)',
    role: 'Kepala Madrasah',
    aktivitas: 'Mengecek Buku Induk Digital Muhammad Wildan Al-Ghifari',
    tipe: 'print',
  }
];

// Initialize and retrieve data from local storage
export const getLocalStorageData = () => {
  if (typeof window === 'undefined') {
    return {
      siswa: SEED_SISWA,
      kelas: SEED_CLASSES,
      nilaiSemester: generateSeedGrades(),
      nilaiIjazah: generateSeedIjazah(),
      logs: SEED_LOGS,
    };
  }

  const storedSiswa = localStorage.getItem('sibima_siswa');
  const storedKelas = localStorage.getItem('sibima_kelas');
  const storedNilai = localStorage.getItem('sibima_nilai');
  const storedIjazah = localStorage.getItem('sibima_ijazah');
  const storedLogs = localStorage.getItem('sibima_logs');

  let siswa = SEED_SISWA;
  let kelas = SEED_CLASSES;
  let nilaiSemester = generateSeedGrades();
  let nilaiIjazah = generateSeedIjazah();
  let logs = SEED_LOGS;

  if (storedSiswa) siswa = JSON.parse(storedSiswa);
  else localStorage.setItem('sibima_siswa', JSON.stringify(siswa));

  if (storedKelas) kelas = JSON.parse(storedKelas);
  else localStorage.setItem('sibima_kelas', JSON.stringify(kelas));

  if (storedNilai) nilaiSemester = JSON.parse(storedNilai);
  else localStorage.setItem('sibima_nilai', JSON.stringify(nilaiSemester));

  if (storedIjazah) nilaiIjazah = JSON.parse(storedIjazah);
  else localStorage.setItem('sibima_ijazah', JSON.stringify(nilaiIjazah));

  if (storedLogs) logs = JSON.parse(storedLogs);
  else localStorage.setItem('sibima_logs', JSON.stringify(logs));

  return { siswa, kelas, nilaiSemester, nilaiIjazah, logs };
};

export const saveLocalStorageData = (data: {
  siswa: Siswa[];
  kelas: Kelas[];
  nilaiSemester: NilaiSemester[];
  nilaiIjazah: NilaiIjazah[];
  logs: LogAktivitas[];
}) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sibima_siswa', JSON.stringify(data.siswa));
  localStorage.setItem('sibima_kelas', JSON.stringify(data.kelas));
  localStorage.setItem('sibima_nilai', JSON.stringify(data.nilaiSemester));
  localStorage.setItem('sibima_ijazah', JSON.stringify(data.nilaiIjazah));
  localStorage.setItem('sibima_logs', JSON.stringify(data.logs));
};

export const addActivityLog = (operator: string, role: UserRole, aktivitas: string, tipe: LogAktivitas['tipe']) => {
  if (typeof window === 'undefined') return;
  const storedLogs = localStorage.getItem('sibima_logs');
  const logs: LogAktivitas[] = storedLogs ? JSON.parse(storedLogs) : SEED_LOGS;
  
  const newLog: LogAktivitas = {
    id_log: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    operator,
    role,
    aktivitas,
    tipe,
  };

  const updatedLogs = [newLog, ...logs].slice(0, 50); // Keep last 50 logs
  localStorage.setItem('sibima_logs', JSON.stringify(updatedLogs));
  return updatedLogs;
};

export const SEED_USERS: UserAccount[] = [
  { id_user: 'usr-1', username: 'usman146', password_plain: 'operator', role: 'Operator', nama: 'Ust. Usman Fauzi' },
  { id_user: 'usr-2', username: 'aminah.si', password_plain: 'walikelas', role: 'Wali Kelas', nama: 'Ustadzah Aminah, S.Si.' },
  { id_user: 'usr-3', username: 'nuruddin.head', password_plain: 'kamad', role: 'Kepala Madrasah', nama: 'K.H. Nuruddin, M.Pd.I.' }
];

export const getLocalStorageUsers = (): UserAccount[] => {
  if (typeof window === 'undefined') {
    return SEED_USERS;
  }
  const stored = localStorage.getItem('sibima_users');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored users', e);
    }
  }
  localStorage.setItem('sibima_users', JSON.stringify(SEED_USERS));
  return SEED_USERS;
};

export const saveLocalStorageUsers = (users: UserAccount[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sibima_users', JSON.stringify(users));
};

