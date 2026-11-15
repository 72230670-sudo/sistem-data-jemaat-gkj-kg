// superAdminData.js
// Pengelolaan Master Data Jemaat GKJ Kotagede Yogyakarta sesuai ERD SuperAdmin:
// 1. Data Identitas (NIK, Nama, TTL, Jenis Kelamin, Gol Darah, Status Jemaat, Foto, Kontak)
// 2. Data Keluarga (Kepala Keluarga, No KK, Hubungan/Status dlm Keluarga, Jmlh Anggota Keluarga, Alamat)
// 3. Data Gerejawi (Status Baptis, Tgl Baptis, Status Sidi, Tgl Sidi, Status Pernikahan, Tgl Pernikahan, Status Keaktifan)
// 4. Data Pendidikan & Pekerjaan (Pendidikan Terakhir, Nama Sekolah, Thn Lulus, Pekerjaan, Instansi, Jabatan, Penghasilan)

export const WILAYAH_LIST = [
  { id_wil: 'WIL-01', nama_wilayah: 'Wilayah 1' },
  { id_wil: 'WIL-02', nama_wilayah: 'Wilayah 2' },
  { id_wil: 'WIL-03', nama_wilayah: 'Wilayah 3' },
  { id_wil: 'WIL-04', nama_wilayah: 'Wilayah 4' },
  { id_wil: 'WIL-05', nama_wilayah: 'Wilayah 5' },
  { id_wil: 'WIL-06', nama_wilayah: 'Wilayah 6' },
]

export const HUBUNGAN_KELUARGA_OPTIONS = [
  'Kepala Keluarga',
  'Istri',
  'Anak',
  'Orang Tua',
  'Famili Lain',
]

export const PELAYANAN_OPTIONS = [
  'Penatua',
  'Diaken',
  'Multimedia',
  'Guru SMG (Sekolah Minggu)',
  'Pelayanan Musik',
  'Paduan Suara',
  'Komisi Anak',
  'Komisi Remaja',
  'Komisi Pemuda',
  'Komisi Dewasa',
  'Komisi Adiyuswa (Lansia)',
]

export const DOKUMEN_OPTIONS = [
  'KTP',
  'Kartu Keluarga',
  'Surat / Akta Baptis',
  'Surat / Akta Sidi',
  'Surat Nikah Gereja',
  'Pas Foto',
]

// Menghitung usia
export function calculateAge(birthDateStr, referenceDate = new Date()) {
  if (!birthDateStr) return 0
  const birth = new Date(`${birthDateStr}T00:00:00`)
  if (Number.isNaN(birth.getTime())) return 0
  let age = referenceDate.getFullYear() - birth.getFullYear()
  const m = referenceDate.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && referenceDate.getDate() < birth.getDate())) {
    age--
  }
  return Math.max(0, age)
}

// Menghitung usia pernikahan
export function calculateMarriageAge(weddingDateStr, referenceDate = new Date()) {
  if (!weddingDateStr) return 0
  const wed = new Date(`${weddingDateStr}T00:00:00`)
  if (Number.isNaN(wed.getTime())) return 0
  let years = referenceDate.getFullYear() - wed.getFullYear()
  const m = referenceDate.getMonth() - wed.getMonth()
  if (m < 0 || (m === 0 && referenceDate.getDate() < wed.getDate())) {
    years--
  }
  return Math.max(0, years)
}

// Format tanggal ke Bahasa Indonesia (cth: 12 Mei 1992)
export function formatIndonesianDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateStr
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

// Format Rupiah
export function formatRupiah(num) {
  if (num === null || num === undefined || num === '') return '-'
  const val = Number(num)
  if (Number.isNaN(val)) return num
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val)
}

// Inisialisasi Master Data awal sesuai ERD
export function createInitialSuperAdminData() {
  const families = [
    {
      no_kk: '3471010101010001',
      nama_kepala_keluarga: 'Daniel Wibowo',
      alamat: 'Jl. Kemasan No. 12',
      rt: '04',
      rw: '02',
      desa: 'Prenggan',
      dusun: 'Prenggan Kidul',
      kecamatan: 'Kotagede',
      kabupaten: 'Kota Yogyakarta',
      provinsi: 'DI Yogyakarta',
      kode_pos: '55172',
    },
    {
      no_kk: '3471010202020002',
      nama_kepala_keluarga: 'Bambang Setyadi',
      alamat: 'Jl. Mondorakan No. 45',
      rt: '02',
      rw: '01',
      desa: 'Purbayan',
      dusun: 'Purbayan Tengah',
      kecamatan: 'Kotagede',
      kabupaten: 'Kota Yogyakarta',
      provinsi: 'DI Yogyakarta',
      kode_pos: '55173',
    },
    {
      no_kk: '3471010303030003',
      nama_kepala_keluarga: 'Yohanes Thiapok Setiawan',
      alamat: 'Jl. Retno Dumilah No. 8',
      rt: '05',
      rw: '03',
      desa: 'Rejowinangun',
      dusun: 'Rejowinangun',
      kecamatan: 'Kotagede',
      kabupaten: 'Kota Yogyakarta',
      provinsi: 'DI Yogyakarta',
      kode_pos: '55171',
    },
    {
      no_kk: '3471010404040004',
      nama_kepala_keluarga: 'Paulus Sudarman',
      alamat: 'Jl. Karanglo No. 20',
      rt: '01',
      rw: '04',
      desa: 'Purbayan',
      dusun: 'Purbayan Kulon',
      kecamatan: 'Kotagede',
      kabupaten: 'Kota Yogyakarta',
      provinsi: 'DI Yogyakarta',
      kode_pos: '55173',
    },
    {
      no_kk: '3471010505050005',
      nama_kepala_keluarga: 'Markus Hariyanto',
      alamat: 'Jl. Gedongkuning No. 99',
      rt: '03',
      rw: '05',
      desa: 'Banguntapan',
      dusun: 'Banguntapan',
      kecamatan: 'Banguntapan',
      kabupaten: 'Bantul',
      provinsi: 'DI Yogyakarta',
      kode_pos: '55198',
    },
    {
      no_kk: '3471010606060006',
      nama_kepala_keluarga: 'Lukas Prasetyo',
      alamat: 'Jl. Wonosari Km. 6',
      rt: '06',
      rw: '02',
      desa: 'Baturetno',
      dusun: 'Manggisan',
      kecamatan: 'Banguntapan',
      kabupaten: 'Bantul',
      provinsi: 'DI Yogyakarta',
      kode_pos: '55197',
    },
  ]

  const members = [
    {
      nik: '3471015205920001',
      id_wil: 'WIL-01',
      nama_wilayah: 'Wilayah 1',
      no_kk: '3471010101010001',
      id_user: 'USR-001',
      nama_lengkap: 'Maria Kristina Wibowo',
      jenis_kelamin: 'Perempuan',
      tmpt_lhr: 'Yogyakarta',
      tgl_lhr: '1992-05-12',
      gol_darah: 'O',
      status_jemaat: 'Warga jemaat',
      hubungan_keluarga: 'Istri',
      foto: '',
      no_whatsapp: '081234567890',
      alamat: 'Jl. Kemasan No. 12, Prenggan, Kotagede',
      gerejawi: {
        id_gereja: 'GRJ-001',
        nik: '3471015205920001',
        status_baptis: 'Sudah',
        tgl_baptis: '2005-06-12',
        status_sidi: 'Sudah',
        tgl_sidi: '2010-04-18',
        status_pernikahan: 'Menikah',
        tgl_pernikahan: '2015-06-20',
        status_keaktifan: 'Aktif',
      },
      pendidikan: {
        id_pendidikan: 'PDK-001',
        nik: '3471015205920001',
        pendidikan_terakhir: 'S1',
        nama_sekolah: 'Universitas Sanata Dharma',
        thn_lulus: '2014',
      },
      pekerjaan: {
        id_pekerjaan: 'PKJ-001',
        nik: '3471015205920001',
        pekerjaan: 'Guru',
        instansi: 'SMA Bopkri 1 Yogyakarta',
        jabatan: 'Guru Bahasa Inggris',
        penghasilan: 4800000,
      },
      riwayat_pelayanan: [
        { id_pelayanan: 'PLY-001-1', nik: '3471015205920001', nama_pelayanan: 'Paduan Suara', thn_mulai: '2016', thn_berakhir: '' },
        { id_pelayanan: 'PLY-001-2', nik: '3471015205920001', nama_pelayanan: 'Guru SMG (Sekolah Minggu)', thn_mulai: '2019', thn_berakhir: '' },
      ],
      dokumen: [
        { id_dokumen: 'DOK-001-1', nik: '3471015205920001', jenis_dokumen: 'KTP', file_path: 'ktp_maria.pdf' },
      ],
    },
    {
      nik: '3471011708900002',
      id_wil: 'WIL-01',
      nama_wilayah: 'Wilayah 1',
      no_kk: '3471010101010001',
      id_user: 'USR-002',
      nama_lengkap: 'Daniel Wibowo',
      jenis_kelamin: 'Laki-laki',
      tmpt_lhr: 'Surakarta',
      tgl_lhr: '1990-08-17',
      gol_darah: 'A',
      status_jemaat: 'Warga jemaat',
      hubungan_keluarga: 'Kepala Keluarga',
      foto: '',
      no_whatsapp: '081298765432',
      alamat: 'Jl. Kemasan No. 12, Prenggan, Kotagede',
      gerejawi: {
        id_gereja: 'GRJ-002',
        nik: '3471011708900002',
        status_baptis: 'Sudah',
        tgl_baptis: '2004-12-25',
        status_sidi: 'Sudah',
        tgl_sidi: '2008-03-23',
        status_pernikahan: 'Menikah',
        tgl_pernikahan: '2015-06-20',
        status_keaktifan: 'Aktif',
      },
      pendidikan: {
        id_pendidikan: 'PDK-002',
        nik: '3471011708900002',
        pendidikan_terakhir: 'S1',
        nama_sekolah: 'Universitas Kristen Duta Wacana',
        thn_lulus: '2012',
      },
      pekerjaan: {
        id_pekerjaan: 'PKJ-002',
        nik: '3471011708900002',
        pekerjaan: 'Wiraswasta',
        instansi: 'Percetakan Mandiri Sejahtera',
        jabatan: 'Pemilik Usaha',
        penghasilan: 8500000,
      },
      riwayat_pelayanan: [
        { id_pelayanan: 'PLY-002-1', nik: '3471011708900002', nama_pelayanan: 'Diaken', thn_mulai: '2020', thn_berakhir: '2023' },
      ],
      dokumen: [
        { id_dokumen: 'DOK-002-1', nik: '3471011708900002', jenis_dokumen: 'KTP', file_path: 'ktp_daniel.pdf' },
      ],
    },
    {
      nik: '3471014903170003',
      id_wil: 'WIL-01',
      nama_wilayah: 'Wilayah 1',
      no_kk: '3471010101010001',
      id_user: null,
      nama_lengkap: 'Naomi Wibowo',
      jenis_kelamin: 'Perempuan',
      tmpt_lhr: 'Yogyakarta',
      tgl_lhr: '2017-03-09',
      gol_darah: 'O',
      status_jemaat: 'Warga jemaat',
      hubungan_keluarga: 'Anak',
      foto: '',
      no_whatsapp: '',
      alamat: 'Jl. Kemasan No. 12, Prenggan, Kotagede',
      gerejawi: {
        id_gereja: 'GRJ-003',
        nik: '3471014903170003',
        status_baptis: 'Sudah',
        tgl_baptis: '2017-06-11',
        status_sidi: 'Belum',
        tgl_sidi: '',
        status_pernikahan: 'Belum menikah',
        tgl_pernikahan: '',
        status_keaktifan: 'Aktif',
      },
      pendidikan: {
        id_pendidikan: 'PDK-003',
        nik: '3471014903170003',
        pendidikan_terakhir: 'SD',
        nama_sekolah: 'SD Kanisius Kotagede',
        thn_lulus: '',
      },
      pekerjaan: {
        id_pekerjaan: 'PKJ-003',
        nik: '3471014903170003',
        pekerjaan: 'Pelajar',
        instansi: 'SD Kanisius',
        jabatan: 'Siswa',
        penghasilan: 0,
      },
      riwayat_pelayanan: [],
      dokumen: [],
    },
    {
      nik: '3471011202820004',
      id_wil: 'WIL-02',
      nama_wilayah: 'Wilayah 2',
      no_kk: '3471010202020002',
      id_user: 'USR-003',
      nama_lengkap: 'Bambang Setyadi',
      jenis_kelamin: 'Laki-laki',
      tmpt_lhr: 'Sleman',
      tgl_lhr: '1982-02-12',
      gol_darah: 'B',
      status_jemaat: 'Warga jemaat',
      hubungan_keluarga: 'Kepala Keluarga',
      foto: '',
      no_whatsapp: '081328019283',
      alamat: 'Jl. Mondorakan No. 45, Purbayan, Kotagede',
      gerejawi: {
        id_gereja: 'GRJ-004',
        nik: '3471011202820004',
        status_baptis: 'Sudah',
        tgl_baptis: '1995-10-15',
        status_sidi: 'Sudah',
        tgl_sidi: '2000-04-20',
        status_pernikahan: 'Menikah',
        tgl_pernikahan: '2009-08-08',
        status_keaktifan: 'Aktif',
      },
      pendidikan: {
        id_pendidikan: 'PDK-004',
        nik: '3471011202820004',
        pendidikan_terakhir: 'S2',
        nama_sekolah: 'Universitas Gadjah Mada',
        thn_lulus: '2008',
      },
      pekerjaan: {
        id_pekerjaan: 'PKJ-004',
        nik: '3471011202820004',
        pekerjaan: 'PNS / Dosen',
        instansi: 'Universitas Negeri Yogyakarta',
        jabatan: 'Lektor Kepala',
        penghasilan: 11000000,
      },
      riwayat_pelayanan: [
        { id_pelayanan: 'PLY-004-1', nik: '3471011202820004', nama_pelayanan: 'Penatua', thn_mulai: '2018', thn_berakhir: '' },
      ],
      dokumen: [
        { id_dokumen: 'DOK-004-1', nik: '3471011202820004', jenis_dokumen: 'KTP', file_path: 'ktp_bambang.pdf' },
      ],
    },
    {
      nik: '3471010106050005',
      id_wil: 'WIL-03',
      nama_wilayah: 'Wilayah 3',
      no_kk: '3471010303030003',
      id_user: 'USR-004',
      nama_lengkap: 'Yohanes Thiapok Setiawan',
      jenis_kelamin: 'Laki-laki',
      tmpt_lhr: 'Yogyakarta',
      tgl_lhr: '2005-05-01',
      gol_darah: 'O',
      status_jemaat: 'Warga jemaat',
      hubungan_keluarga: 'Kepala Keluarga',
      foto: '',
      no_whatsapp: '081343446030',
      alamat: 'Jl. Retno Dumilah No. 8, Rejowinangun, Kotagede',
      gerejawi: {
        id_gereja: 'GRJ-005',
        nik: '3471010106050005',
        status_baptis: 'Sudah',
        tgl_baptis: '2005-12-25',
        status_sidi: 'Sudah',
        tgl_sidi: '2023-04-09',
        status_pernikahan: 'Belum menikah',
        tgl_pernikahan: '',
        status_keaktifan: 'Aktif',
      },
      pendidikan: {
        id_pendidikan: 'PDK-005',
        nik: '3471010106050005',
        pendidikan_terakhir: 'SMA / SMK',
        nama_sekolah: 'SMA BOPKRI 2 Yogyakarta',
        thn_lulus: '2023',
      },
      pekerjaan: {
        id_pekerjaan: 'PKJ-005',
        nik: '3471010106050005',
        pekerjaan: 'Mahasiswa',
        instansi: 'Universitas Kristen Duta Wacana',
        jabatan: 'Mahasiswa Informatika',
        penghasilan: 0,
      },
      riwayat_pelayanan: [
        { id_pelayanan: 'PLY-005-1', nik: '3471010106050005', nama_pelayanan: 'Multimedia', thn_mulai: '2022', thn_berakhir: '' },
      ],
      dokumen: [],
    },
  ]

  return {
    families,
    members,
  }
}

const STORAGE_KEY = 'gkj_superadmin_master_data_crud_v3'

export function loadMasterData() {
  if (typeof window === 'undefined') {
    return createInitialSuperAdminData()
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.members) && Array.isArray(parsed.families)) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Gagal memuat master data, menggunakan default data.', err)
  }
  const initial = createInitialSuperAdminData()
  saveMasterData(initial)
  return initial
}

export function saveMasterData(data) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (err) {
      console.error('Gagal menyimpan ke localStorage:', err)
    }
  }
}

export function resetMasterData() {
  const initial = createInitialSuperAdminData()
  saveMasterData(initial)
  return initial
}

// ==========================================
// OPERASI CRUD JEMAAT
// ==========================================

export function addMember(data, newMemberData) {
  const exists = data.members.some((m) => m.nik === newMemberData.nik)
  if (exists) {
    throw new Error(`Jemaat dengan NIK "${newMemberData.nik}" sudah terdaftar.`)
  }

  const wil = WILAYAH_LIST.find((w) => w.id_wil === newMemberData.id_wil)
  const nama_wilayah = wil ? wil.nama_wilayah : (newMemberData.nama_wilayah || 'Wilayah 1')

  const fullMember = {
    nik: newMemberData.nik.trim(),
    id_wil: newMemberData.id_wil || 'WIL-01',
    nama_wilayah,
    no_kk: newMemberData.no_kk ? newMemberData.no_kk.trim() : '',
    nama_lengkap: newMemberData.nama_lengkap.trim(),
    jenis_kelamin: newMemberData.jenis_kelamin || 'Laki-laki',
    tmpt_lhr: newMemberData.tmpt_lhr || 'Yogyakarta',
    tgl_lhr: newMemberData.tgl_lhr || '',
    gol_darah: newMemberData.gol_darah || 'Belum diketahui',
    status_jemaat: newMemberData.status_jemaat || 'Warga jemaat',
    hubungan_keluarga: newMemberData.hubungan_keluarga || 'Kepala Keluarga',
    foto: newMemberData.foto || '',
    no_whatsapp: newMemberData.no_whatsapp || '',
    alamat: newMemberData.alamat || '',
    gerejawi: {
      id_gereja: `GRJ-${Date.now()}`,
      nik: newMemberData.nik.trim(),
      status_baptis: newMemberData.gerejawi?.status_baptis || 'Belum',
      tgl_baptis: newMemberData.gerejawi?.tgl_baptis || '',
      status_sidi: newMemberData.gerejawi?.status_sidi || 'Belum',
      tgl_sidi: newMemberData.gerejawi?.tgl_sidi || '',
      status_pernikahan: newMemberData.gerejawi?.status_pernikahan || 'Belum menikah',
      tgl_pernikahan: newMemberData.gerejawi?.tgl_pernikahan || '',
      status_keaktifan: newMemberData.gerejawi?.status_keaktifan || 'Aktif',
    },
    pendidikan: {
      id_pendidikan: `PDK-${Date.now()}`,
      nik: newMemberData.nik.trim(),
      pendidikan_terakhir: newMemberData.pendidikan?.pendidikan_terakhir || 'SMA / SMK',
      nama_sekolah: newMemberData.pendidikan?.nama_sekolah || '',
      thn_lulus: newMemberData.pendidikan?.thn_lulus || '',
    },
    pekerjaan: {
      id_pekerjaan: `PKJ-${Date.now()}`,
      nik: newMemberData.nik.trim(),
      pekerjaan: newMemberData.pekerjaan?.pekerjaan || '',
      instansi: newMemberData.pekerjaan?.instansi || '',
      jabatan: newMemberData.pekerjaan?.jabatan || '',
      penghasilan: newMemberData.pekerjaan?.penghasilan ? Number(newMemberData.pekerjaan.penghasilan) : 0,
    },
    riwayat_pelayanan: Array.isArray(newMemberData.riwayat_pelayanan) ? newMemberData.riwayat_pelayanan : [],
    dokumen: Array.isArray(newMemberData.dokumen) ? newMemberData.dokumen : [],
  }

  const updatedMembers = [fullMember, ...data.members]
  const updatedData = { ...data, members: updatedMembers }
  saveMasterData(updatedData)
  return updatedData
}

export function updateMember(data, oldNik, updatedFields) {
  const index = data.members.findIndex((m) => m.nik === oldNik)
  if (index === -1) {
    throw new Error(`Data jemaat dengan NIK ${oldNik} tidak ditemukan.`)
  }

  if (updatedFields.nik && updatedFields.nik !== oldNik) {
    const conflict = data.members.some((m) => m.nik === updatedFields.nik)
    if (conflict) {
      throw new Error(`NIK ${updatedFields.nik} sudah digunakan oleh jemaat lain.`)
    }
  }

  const current = data.members[index]
  const wil = WILAYAH_LIST.find((w) => w.id_wil === (updatedFields.id_wil || current.id_wil))
  const nama_wilayah = wil ? wil.nama_wilayah : current.nama_wilayah
  const newNik = updatedFields.nik ? updatedFields.nik.trim() : current.nik

  const merged = {
    ...current,
    ...updatedFields,
    nik: newNik,
    nama_wilayah,
    gerejawi: {
      ...current.gerejawi,
      ...updatedFields.gerejawi,
      nik: newNik,
    },
    pendidikan: {
      ...current.pendidikan,
      ...updatedFields.pendidikan,
      nik: newNik,
    },
    pekerjaan: {
      ...current.pekerjaan,
      ...updatedFields.pekerjaan,
      penghasilan: updatedFields.pekerjaan?.penghasilan !== undefined
        ? Number(updatedFields.pekerjaan.penghasilan)
        : current.pekerjaan?.penghasilan,
      nik: newNik,
    },
    riwayat_pelayanan: updatedFields.riwayat_pelayanan ?? current.riwayat_pelayanan,
    dokumen: updatedFields.dokumen ?? current.dokumen,
  }

  const updatedMembers = [...data.members]
  updatedMembers[index] = merged
  const updatedData = { ...data, members: updatedMembers }
  saveMasterData(updatedData)
  return updatedData
}

export function deleteMember(data, nik) {
  const updatedMembers = data.members.filter((m) => m.nik !== nik)
  const updatedData = { ...data, members: updatedMembers }
  saveMasterData(updatedData)
  return updatedData
}

// ==========================================
// OPERASI CRUD KELUARGA
// ==========================================

export function addFamily(data, familyData) {
  const exists = data.families.some((f) => f.no_kk === familyData.no_kk)
  if (exists) {
    throw new Error(`Nomor Kartu Keluarga (KK) "${familyData.no_kk}" sudah terdaftar.`)
  }

  const newFam = {
    no_kk: familyData.no_kk.trim(),
    nama_kepala_keluarga: familyData.nama_kepala_keluarga.trim(),
    alamat: familyData.alamat || '',
    rt: familyData.rt || '',
    rw: familyData.rw || '',
    desa: familyData.desa || '',
    dusun: familyData.dusun || '',
    kecamatan: familyData.kecamatan || 'Kotagede',
    kabupaten: familyData.kabupaten || 'Kota Yogyakarta',
    provinsi: familyData.provinsi || 'DI Yogyakarta',
    kode_pos: familyData.kode_pos || '',
  }

  const updatedFamilies = [newFam, ...data.families]
  const updatedData = { ...data, families: updatedFamilies }
  saveMasterData(updatedData)
  return updatedData
}

export function updateFamily(data, no_kk, updatedFields) {
  const index = data.families.findIndex((f) => f.no_kk === no_kk)
  if (index === -1) {
    throw new Error(`Keluarga dengan No KK ${no_kk} tidak ditemukan.`)
  }

  const updatedFamilies = [...data.families]
  updatedFamilies[index] = {
    ...updatedFamilies[index],
    ...updatedFields,
    no_kk,
  }

  const updatedData = { ...data, families: updatedFamilies }
  saveMasterData(updatedData)
  return updatedData
}

export function deleteFamily(data, no_kk) {
  const memberCount = data.members.filter((m) => m.no_kk === no_kk).length
  if (memberCount > 0) {
    throw new Error(
      `Tidak dapat menghapus KK ${no_kk} karena masih memiliki ${memberCount} anggota jemaat terdaftar.`
    )
  }

  const updatedFamilies = data.families.filter((f) => f.no_kk !== no_kk)
  const updatedData = { ...data, families: updatedFamilies }
  saveMasterData(updatedData)
  return updatedData
}

// Menghitung anggota keluarga untuk sebuah KK
export function getFamilyMembers(members, no_kk) {
  if (!no_kk) return []
  return members.filter((m) => m.no_kk === no_kk)
}
