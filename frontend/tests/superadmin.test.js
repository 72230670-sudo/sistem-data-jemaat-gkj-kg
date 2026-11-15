import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  addFamily,
  addMember,
  calculateAge,
  calculateMarriageAge,
  computeDashboardStats,
  createInitialSuperAdminData,
  deleteFamily,
  deleteMember,
  exportMembersToCSV,
  formatIndonesianDate,
  formatRupiah,
  generateWhatsAppMessage,
  generateWhatsAppUrl,
  getFamilyMembers,
  updateFamily,
  updateMember,
  WILAYAH_LIST,
} from '../src/lib/superAdminData.js'

test('createInitialSuperAdminData memuat relasi ERD lengkap', () => {
  const data = createInitialSuperAdminData()
  assert.ok(Array.isArray(data.members))
  assert.ok(Array.isArray(data.families))
  assert.ok(Array.isArray(data.users))
  assert.ok(data.members.length >= 5)
  assert.ok(data.families.length >= 4)

  const firstMember = data.members[0]
  assert.ok(firstMember.nik)
  assert.ok(firstMember.nama_lengkap)
  assert.ok(firstMember.id_wil)
  assert.ok(firstMember.no_kk)
  assert.ok(firstMember.gerejawi)
  assert.ok(firstMember.pendidikan)
  assert.ok(firstMember.pekerjaan)

  const firstFamily = data.families[0]
  assert.ok(firstFamily.no_kk)
  assert.ok(firstFamily.nama_kepala_keluarga)
  assert.ok(firstFamily.alamat)
  assert.ok(firstFamily.rt)
  assert.ok(firstFamily.rw)
  assert.ok(firstFamily.kecamatan)
})

test('CRUD Jemaat: tambah jemaat baru berhasil dan menolak duplikasi NIK', () => {
  const initial = createInitialSuperAdminData()
  const initialCount = initial.members.length

  const newJemaat = {
    nik: '3471099999990001',
    nama_lengkap: 'Jemaat Baru Test',
    jenis_kelamin: 'Laki-laki',
    tmpt_lhr: 'Yogyakarta',
    tgl_lhr: '1998-07-21',
    gol_darah: 'B',
    status_jemaat: 'Warga jemaat',
    id_wil: 'WIL-02',
    no_kk: initial.families[0].no_kk,
    hubungan_keluarga: 'Anak',
    no_whatsapp: '081299998888',
    email: 'jemaat.baru@test.com',
    gerejawi: {
      status_baptis: 'Sudah',
      tgl_baptis: '2010-05-10',
      status_sidi: 'Sudah',
      tgl_sidi: '2015-04-12',
      status_pernikahan: 'Belum menikah',
      status_keaktifan: 'Aktif',
    },
    pendidikan: {
      pendidikan_terakhir: 'S1',
      nama_sekolah: 'UKDW',
      thn_lulus: '2020',
    },
    pekerjaan: {
      pekerjaan: 'Software Engineer',
      instansi: 'Tech Co',
      jabatan: 'Frontend Dev',
      penghasilan: 10000000,
    },
  }

  const afterAdd = addMember(initial, newJemaat)
  assert.equal(afterAdd.members.length, initialCount + 1)
  const saved = afterAdd.members.find((m) => m.nik === newJemaat.nik)
  assert.ok(saved)
  assert.equal(saved.nama_lengkap, 'Jemaat Baru Test')
  assert.equal(saved.nama_wilayah, 'Wilayah 2')
  assert.equal(saved.pekerjaan.pekerjaan, 'Software Engineer')

  // Duplikasi NIK harus ditolak
  assert.throws(() => {
    addMember(afterAdd, newJemaat)
  }, /sudah terdaftar/)
})

test('CRUD Jemaat: perbarui (update) jemaat berhasil', () => {
  const initial = createInitialSuperAdminData()
  const targetNik = initial.members[0].nik

  const updated = updateMember(initial, targetNik, {
    nama_lengkap: 'Nama Telah Diperbarui',
    gerejawi: {
      status_keaktifan: 'Pasif',
    },
    pekerjaan: {
      pekerjaan: 'Wiraswasta Baru',
      penghasilan: 15000000,
    },
  })

  const member = updated.members.find((m) => m.nik === targetNik)
  assert.equal(member.nama_lengkap, 'Nama Telah Diperbarui')
  assert.equal(member.gerejawi.status_keaktifan, 'Pasif')
  assert.equal(member.pekerjaan.pekerjaan, 'Wiraswasta Baru')
  assert.equal(member.pekerjaan.penghasilan, 15000000)
})

test('CRUD Jemaat: hapus (delete) jemaat berhasil', () => {
  const initial = createInitialSuperAdminData()
  const targetNik = initial.members[1].nik
  const initialCount = initial.members.length

  const afterDelete = deleteMember(initial, targetNik)
  assert.equal(afterDelete.members.length, initialCount - 1)
  assert.equal(afterDelete.members.find((m) => m.nik === targetNik), undefined)
})

test('CRUD Keluarga: tambah, perbarui, dan proteksi hapus KK yang memiliki anggota', () => {
  const initial = createInitialSuperAdminData()
  const newFam = {
    no_kk: '3471099900009999',
    nama_kepala_keluarga: 'Keluarga Baru Test',
    alamat: 'Jl. Solo Km. 7',
    rt: '02',
    rw: '05',
    desa: 'Caturtunggal',
    dusun: 'Nologaten',
    kecamatan: 'Depok',
    kabupaten: 'Sleman',
    provinsi: 'DI Yogyakarta',
    kode_pos: '55281',
  }

  // Tambah KK
  const afterAdd = addFamily(initial, newFam)
  assert.ok(afterAdd.families.some((f) => f.no_kk === newFam.no_kk))

  // Duplikasi No KK harus ditolak
  assert.throws(() => {
    addFamily(afterAdd, newFam)
  }, /sudah terdaftar/)

  // Update KK
  const afterUpdate = updateFamily(afterAdd, newFam.no_kk, {
    alamat: 'Jl. Solo Km. 8 No. 10',
    nama_kepala_keluarga: 'Kepala Keluarga Update',
  })
  const updatedFam = afterUpdate.families.find((f) => f.no_kk === newFam.no_kk)
  assert.equal(updatedFam.alamat, 'Jl. Solo Km. 8 No. 10')
  assert.equal(updatedFam.nama_kepala_keluarga, 'Kepala Keluarga Update')

  // Hapus KK kosong berhasil
  const afterDeleteEmpty = deleteFamily(afterUpdate, newFam.no_kk)
  assert.equal(afterDeleteEmpty.families.some((f) => f.no_kk === newFam.no_kk), false)

  // Hapus KK yang masih memiliki anggota harus dicegah
  const busyKK = initial.members[0].no_kk
  assert.throws(() => {
    deleteFamily(initial, busyKK)
  }, /masih memiliki.*anggota jemaat/)
})

test('getFamilyMembers mengembalikan seluruh anggota dalam KK yang sama', () => {
  const data = createInitialSuperAdminData()
  const targetKK = data.families[0].no_kk
  const familyMembersList = getFamilyMembers(data.members, targetKK)

  assert.ok(familyMembersList.length >= 2)
  for (const m of familyMembersList) {
    assert.equal(m.no_kk, targetKK)
  }
})

test('Statistik Demografi dan Dashboard dihitung akurat', () => {
  const data = createInitialSuperAdminData()
  const stats = computeDashboardStats(data)

  assert.equal(stats.totalJemaat, data.members.length)
  assert.equal(stats.totalKeluarga, data.families.length)
  assert.ok(stats.jemaatAktif >= 0)
  assert.equal(stats.perWilayah.length, WILAYAH_LIST.length)

  // Total usia harus sama dengan total jemaat
  const totalUsia =
    stats.usiaDistribution.anak +
    stats.usiaDistribution.remaja +
    stats.usiaDistribution.pemuda +
    stats.usiaDistribution.dewasa +
    stats.usiaDistribution.lansia
  assert.equal(totalUsia, stats.totalJemaat)

  // Total gender harus sama dengan total jemaat
  assert.equal(stats.gender.laki + stats.gender.perempuan, stats.totalJemaat)
})

test('Perhitungan usia dan formatting tanggal / rupiah', () => {
  const age = calculateAge('2000-01-01', new Date('2026-11-15'))
  assert.equal(age, 26)

  const marriedAge = calculateMarriageAge('2015-06-20', new Date('2026-11-15'))
  assert.equal(marriedAge, 11)

  const indDate = formatIndonesianDate('1992-05-12')
  assert.match(indDate, /12 Mei 1992/)

  const rp = formatRupiah(5000000)
  assert.match(rp, /5\.000\.000/)
})

test('WhatsApp Message and URL generation sesuai template', () => {
  const member = {
    nama_lengkap: 'Maria Kristina',
    tgl_lhr: '1992-05-12',
    gerejawi: {
      tgl_pernikahan: '2015-06-20',
    },
  }

  const msgLahir = generateWhatsAppMessage(null, member, 'lahir')
  assert.match(msgLahir, /Maria Kristina/)
  assert.match(msgLahir, /GKJ Kotagede/)

  const msgNikah = generateWhatsAppMessage(null, member, 'nikah')
  assert.match(msgNikah, /Maria Kristina/)
  assert.match(msgNikah, /Pernikahan/)

  const waUrl = generateWhatsAppUrl('081234567890', 'Halo Test')
  assert.match(waUrl, /^https:\/\/wa\.me\/6281234567890\?text=Halo%20Test/)
})

test('Ekspor CSV menghasilkan format CSV UTF-8 dengan seluruh kolom ERD', () => {
  const data = createInitialSuperAdminData()
  const csv = exportMembersToCSV(data.members, data.families)

  assert.ok(csv.startsWith('\uFEFF')) // BOM UTF-8
  assert.match(csv, /NIK,Nama Lengkap,Jenis Kelamin/)
  assert.match(csv, /Status Keaktifan,Status Baptis/)
  assert.match(csv, /Pendidikan Terakhir,Nama Sekolah/)
  assert.match(csv, /Pekerjaan,Instansi,Jabatan,Penghasilan/)
  assert.match(csv, new RegExp(data.members[0].nik))
})
