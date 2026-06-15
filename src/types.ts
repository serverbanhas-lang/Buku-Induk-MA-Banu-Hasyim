/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type JurusanType = 'MIPA' | 'IPS' | 'Keagamaan' | 'Umum';
export type GenderType = 'L' | 'P';
export type UserRole = 'Operator' | 'Wali Kelas' | 'Kepala Madrasah' | 'Siswa';

export interface Siswa {
  id_siswa: string;
  nis: string;
  nisn: string;
  nik: string;
  nama: string;
  tempat_lahir: string;
  tgl_lahir: string;
  jk: GenderType;
  agama: string;
  status_anak: string;
  anak_ke: number;
  jml_saudara: number;
  hobi: string;
  cita_cita: string;
  
  // Alamat
  alamat_lengkap: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kode_pos: string;

  // Orang Tua & Wali
  nama_ayah: string;
  nik_ayah: string;
  pendidikan_ayah: string;
  pekerjaan_ayah: string;
  penghasilan_ayah: string;
  
  nama_ibu: string;
  nik_ibu: string;
  pendidikan_ibu: string;
  pekerjaan_ibu: string;
  penghasilan_ibu: string;
  
  nama_wali?: string;
  hubungan_wali?: string;
  alamat_wali?: string;
  pekerjaan_wali?: string;

  // Data Pendidikan
  tahun_masuk: string;
  kelas_masuk: string;
  id_kelas: string;
  jurusan: JurusanType;
  asal_sekolah: string;
  no_skhun: string;
  no_ijazah_smp: string;
  foto: string;
}

export interface UserAccount {
  id_user: string;
  username: string;
  password_plain: string;
  role: UserRole;
  nama: string;
}

export interface NilaiSemester {
  id_nilai: string;
  id_siswa: string;
  semester: number; // 1 s.d. 6
  mapel: string;
  nilai: number;
}

export interface NilaiIjazah {
  id_ijazah: string;
  id_siswa: string;
  mapel: string;
  nilai: number;
}

export interface Kelas {
  id_kelas: string;
  nama_kelas: string;
  jurusan: JurusanType;
  wali_kelas: string;
}

export interface LogAktivitas {
  id_log: string;
  timestamp: string;
  operator: string;
  role: UserRole;
  aktivitas: string;
  tipe: 'create' | 'update' | 'delete' | 'import' | 'print';
}

export interface ImportSiswaFormat {
  nis: string;
  nisn: string;
  nama: string;
  jk: GenderType;
  tempat_lahir: string;
  tgl_lahir: string;
  alamat_lengkap: string;
  nama_ayah: string;
  nama_ibu: string;
  jurusan: JurusanType;
  tahun_masuk: string;
}
