import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  addFamily,
  addMember,
  calculateAge,
  calculateMarriageAge,
  createInitialSuperAdminData,
  deleteFamily,
  deleteMember,
  formatIndonesianDate,
  formatRupiah,
  getFamilyMembers,
  updateFamily,
  updateMember,
} from '../src/lib/superAdminData.js'

test('createInitialSuperAdminData memuat 4 relasi ERD lengkap (Identitas, Keluarga, Gerejawi, Pendidikan & Pekerjaan)', () => {
  const data = createInitialSuperAdminData()
  assert.ok(Array.isArray(data.members))
  assert.ok(Array.isArray(data.families))
  assert.ok(data.members.length >= 5)
  assert.ok(data.families.length >= 4)

  const firstMember = data.members[0]
  // 1. Data Identitas
  assert.ok(firstMember.nik)
  assert.ok(firstMember.nama_lengkap)
  assert.ok(firstMember.tmpt_lhr)
  assert.ok(firstMember.tgl_lhr)
  assert.ok(firstMember.jenis_kelamin)
  assert.ok(firstMember.gol_darah)
  assert.ok(firstMember.status_jemaat)
  // 2. Data Keluarga
  assert.ok(firstMember.no_kk)
  assert.ok(firstMember.hubungan_keluarga)
  // 3. Data Gerejawi
  assert.ok(firstMember.gerejawi)
  assert.ok(firstMember.gerejawi.status_baptis)
  assert.ok(firstMember.gerejawi.status_sidi)
  assert.ok(firstMember.gerejawi.status_keaktifan)
  // 4. Data Pendidikan & Pekerjaan
  assert.ok(firstMember.pendidikan)
  assert.ok(firstMember.pendidikan.pendidikan_terakhir)
  assert.ok(firstMember.pekerjaan)
  assert.ok(firstMember.pekerjaan.pekerjaan)

  // Data Keluarga
  const firstFamily = data.families[0]
  assert.ok(firstFamily.no_kk)
  assert.ok(firstFamily.nama_kepala_keluarga)
  assert.ok(firstFamily.alamat)
  assert.ok(firstFamily.rt)
  assert.ok(firstFamily.rw)
  assert.ok(firstFamily.desa)
  assert.ok(firstFamily.kecamatan)
  assert.ok(firstFamily.kabupaten)
  assert.ok(firstFamily.provinsi)
  assert.ok(firstFamily.kode_pos)
})

test('CRUD Jemaat: tambah data jemaat baru berhasil dan menolak duplikasi NIK', () => {
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
    alamat: 'Jl. Contoh Alamat No. 1',
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

test('CRUD Jemaat: perbarui (update) data jemaat berhasil', () => {
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

test('CRUD Jemaat: hapus (delete) data jemaat berhasil', () => {
  const initial = createInitialSuperAdminData()
  const targetNik = initial.members[1].nik
  const initialCount = initial.members.length

  const afterDelete = deleteMember(initial, targetNik)
  assert.equal(afterDelete.members.length, initialCount - 1)
  assert.equal(afterDelete.members.find((m) => m.nik === targetNik), undefined)
})

test('CRUD Data Keluarga: mengelola kepala keluarga, hubungan keluarga, status & jumlah anggota keluarga', () => {
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

  // Update KK (Kepala Keluarga & Alamat)
  const afterUpdate = updateFamily(afterAdd, newFam.no_kk, {
    alamat: 'Jl. Solo Km. 8 No. 10',
    nama_kepala_keluarga: 'Kepala Keluarga Update',
  })
  const updatedFam = afterUpdate.families.find((f) => f.no_kk === newFam.no_kk)
  assert.equal(updatedFam.alamat, 'Jl. Solo Km. 8 No. 10')
  assert.equal(updatedFam.nama_kepala_keluarga, 'Kepala Keluarga Update')

  // Hitung jumlah anggota keluarga
  const targetKK = initial.families[0].no_kk
  const familyMembersList = getFamilyMembers(initial.members, targetKK)
  assert.ok(familyMembersList.length >= 2)
  for (const m of familyMembersList) {
    assert.equal(m.no_kk, targetKK)
    assert.ok(m.hubungan_keluarga)
  }

  // Hapus KK kosong berhasil
  const afterDeleteEmpty = deleteFamily(afterUpdate, newFam.no_kk)
  assert.equal(afterDeleteEmpty.families.some((f) => f.no_kk === newFam.no_kk), false)

  // Hapus KK yang masih memiliki anggota harus dicegah
  assert.throws(() => {
    deleteFamily(initial, targetKK)
  }, /masih memiliki.*anggota jemaat/)
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
