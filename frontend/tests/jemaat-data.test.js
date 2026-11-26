import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  ageFromDate, authenticateDemo, createDemoData, datePassword, familyMembers,
  getValue, localCalendarDate, profileSections, updateMemberPhoto, updateMemberSection, validateSection,
} from '../src/lib/jemaatData.js'

function valuesFor(data, sectionId, memberId = 'JMT-001') {
  const member = data.members.find((item) => item.id === memberId)
  const section = profileSections.find((item) => item.id === sectionId)
  const record = section.family ? data.families.find((item) => item.no_kk === member.no_kk) : member
  return Object.fromEntries(section.fields.map((field) => [field.key, getValue(record, field.key)]))
}

test('login contoh hanya menerima NIK dan tanggal lahir yang cocok', () => {
  const { members } = createDemoData()
  const member = members[0]
  assert.equal(authenticateDemo(members, member.nik, datePassword(member.tgl_lhr))?.id, member.id)
  assert.equal(authenticateDemo(members, member.nik, datePassword(members[1].tgl_lhr)), null)
  assert.equal(authenticateDemo(members, 'tidak-terdaftar', datePassword(member.tgl_lhr)), null)
  assert.equal(authenticateDemo(members, '', ''), null)
})

test('role non-jemaat tidak dapat login atau mengakses keluarga', () => {
  const { members } = createDemoData()
  members[0].user.role = 'super_admin'
  assert.equal(authenticateDemo(members, members[0].nik, datePassword(members[0].tgl_lhr)), null)
  assert.deepEqual(familyMembers(members, members[0]), [])
})

test('anggota yang terlihat hanya anggota dengan nomor KK yang sama', () => {
  const { members } = createDemoData()
  assert.deepEqual(familyMembers(members, members[0]).map((member) => member.id), ['JMT-001', 'JMT-002', 'JMT-003'])
  assert.deepEqual(familyMembers(members, null), [])
  assert.deepEqual(familyMembers(members, { ...members[0], no_kk: '' }), [])
})

for (const targetId of ['JMT-001', 'JMT-002', 'JMT-003']) {
  test(`update profil ${targetId} mengganti data, tidak menambah atau menghapus anggota`, () => {
    const data = createDemoData()
    const draft = valuesFor(data, 'identitas', targetId)
    draft.nama_lengkap = 'Nama diperbarui'
    const result = updateMemberSection(data, 'JMT-001', targetId, 'identitas', draft)
    const before = data.members.find((member) => member.id === targetId)
    const after = result.members.find((member) => member.id === targetId)
    assert.equal(result.members.length, data.members.length)
    assert.equal(after.nama_lengkap, draft.nama_lengkap)
    assert.equal(after.id, before.id)
    assert.equal(after.nik, before.nik)
    assert.equal(after.no_kk, before.no_kk)
    assert.equal(before.nama_lengkap === draft.nama_lengkap, false)
    assert.equal(result.members.find((member) => member.id === 'JMT-004'), data.members[3])
  })
}

for (const field of ['id', 'nik', 'no_kk', 'id_user', 'id_wil', 'user.role', 'gerejawi.id_gereja', 'gerejawi.nik', '__proto__']) {
  test(`menolak perubahan field terkunci ${field}`, () => {
    const data = createDemoData()
    const draft = valuesFor(data, 'identitas')
    Object.defineProperty(draft, field, { value: 'diubah', enumerable: true })
    assert.throws(() => updateMemberSection(data, 'JMT-001', 'JMT-001', 'identitas', draft), /tidak dapat diubah/)
  })
}

test('menolak update profil anggota keluarga lain, role salah, dan aktor kosong', () => {
  const data = createDemoData()
  const draft = valuesFor(data, 'identitas', 'JMT-004')
  assert.throws(() => updateMemberSection(data, 'JMT-001', 'JMT-004', 'identitas', draft), /keluarga sendiri/)
  assert.throws(() => updateMemberSection(data, null, 'JMT-001', 'identitas', draft), /keluarga sendiri/)
  data.members[0].user.role = 'admin'
  assert.throws(() => updateMemberSection(data, 'JMT-001', 'JMT-001', 'identitas', draft), /keluarga sendiri/)
})

test('update alamat keluarga dibagikan pada KK yang sama tanpa mengubah KK lainnya', () => {
  const data = createDemoData()
  const draft = valuesFor(data, 'keluarga')
  draft.alamat = 'Alamat keluarga diperbarui'
  const result = updateMemberSection(data, 'JMT-001', 'JMT-002', 'keluarga', draft)
  assert.equal(result.families[0].alamat, draft.alamat)
  assert.equal(result.families[0].no_kk, data.families[0].no_kk)
  assert.equal(result.families[1], data.families[1])
  assert.equal(result.members, data.members)
  assert.notEqual(data.families[0].alamat, draft.alamat)
})

test('update data terkait menjaga ID dan NIK referensi', () => {
  const data = createDemoData()
  for (const sectionId of ['kontak', 'gerejawi', 'pendidikan', 'pekerjaan']) {
    const result = updateMemberSection(data, 'JMT-001', 'JMT-002', sectionId, valuesFor(data, sectionId, 'JMT-002'))
    const member = result.members[1]
    assert.equal(member.user.id_user, data.members[1].id_user)
    assert.equal(member.gerejawi.id_gereja, data.members[1].gerejawi.id_gereja)
    assert.equal(member.gerejawi.nik, data.members[1].nik)
    assert.equal(member.pendidikan.id_pendidikan, data.members[1].pendidikan.id_pendidikan)
    assert.equal(member.pekerjaan.id_pekerjaan, data.members[1].pekerjaan.id_pekerjaan)
  }
})

test('validasi menolak nama kosong, tanggal tidak valid dan masa depan', () => {
  const data = createDemoData()
  const section = profileSections[0]
  for (const patch of [{ nama_lengkap: ' ' }, { tgl_lhr: '2025-02-30' }, { tgl_lhr: '2099-01-01' }, { jenis_kelamin: 'Tidak valid' }]) {
    assert.throws(() => validateSection(section, { ...valuesFor(data, 'identitas'), ...patch }, '2026-10-04'))
  }
})

test('validasi nomor telepon, email, kode pos, tahun lulus, dan penghasilan', () => {
  const data = createDemoData()
  const cases = [['kontak', 'user.email', 'invalid'], ['kontak', 'no_whatsapp', '123'], ['keluarga', 'kode_pos', '123'], ['keluarga', 'rt', 'abc'], ['pendidikan', 'pendidikan.thn_lulus', '2099'], ['pekerjaan', 'pekerjaan.penghasilan', '-10']]
  for (const [id, key, value] of cases) {
    assert.throws(() => validateSection(profileSections.find((section) => section.id === id), { ...valuesFor(data, id), [key]: value }, '2026-10-04'))
  }
})

test('tanggal gerejawi tidak boleh diisi jika status belum dilaksanakan', () => {
  const data = createDemoData()
  const section = profileSections.find((item) => item.id === 'gerejawi')
  const draft = valuesFor(data, 'gerejawi')
  draft['gerejawi.status_sidi'] = 'Belum'
  draft['gerejawi.tgl_sidi'] = '2020-01-01'
  assert.throws(() => validateSection(section, draft), /harus kosong/)
})

test('foto hanya dapat diubah untuk keluarga sendiri dan format yang diterima', () => {
  const data = createDemoData()
  const photo = 'data:image/png;base64,aGVsbG8='
  const result = updateMemberPhoto(data, 'JMT-001', 'JMT-002', photo)
  assert.equal(result.members[1].foto, photo)
  assert.equal(result.members[1].nik, data.members[1].nik)
  assert.equal(result.members.length, data.members.length)
  assert.throws(() => updateMemberPhoto(data, 'JMT-001', 'JMT-004', photo), /tidak dapat diakses/)
  assert.throws(() => updateMemberPhoto(data, 'JMT-001', 'JMT-002', 'data:image/svg+xml;base64,aGVsbG8='), /Foto harus/)
  assert.throws(() => updateMemberPhoto(data, 'JMT-001', 'JMT-002', `data:image/png;base64,${'a'.repeat(2800000)}`), /Foto harus/)
})

test('tanggal kalender memakai hari lokal, termasuk sebelum pukul 07:00 WIB', () => {
  const earlyMorning = new Date(2026, 9, 4, 0, 30)
  assert.equal(localCalendarDate(earlyMorning), '2026-10-04')
  const data = createDemoData()
  const section = profileSections.find((item) => item.id === 'gerejawi')
  const draft = valuesFor(data, 'gerejawi')
  draft['gerejawi.tgl_baptis'] = localCalendarDate(earlyMorning)
  assert.doesNotThrow(() => validateSection(section, draft, localCalendarDate(earlyMorning)))
})

test('tanggal gerejawi dan tahun lulus tidak boleh mendahului kelahiran', () => {
  const data = createDemoData()
  const baptism = valuesFor(data, 'gerejawi')
  baptism['gerejawi.tgl_baptis'] = '1980-01-01'
  assert.throws(() => updateMemberSection(data, 'JMT-001', 'JMT-001', 'gerejawi', baptism), /tanggal lahir/)
  const education = valuesFor(data, 'pendidikan')
  education['pendidikan.thn_lulus'] = '1980'
  assert.throws(() => updateMemberSection(data, 'JMT-001', 'JMT-001', 'pendidikan', education), /tahun lahir/)
  const identity = valuesFor(data, 'identitas')
  identity.tgl_lhr = '2016-01-01'
  assert.throws(() => updateMemberSection(data, 'JMT-001', 'JMT-001', 'identitas', identity), /tanggal lahir/)
})

test('tanggal sidi tidak boleh mendahului baptis', () => {
  const data = createDemoData()
  const draft = valuesFor(data, 'gerejawi')
  draft['gerejawi.tgl_baptis'] = '2005-01-01'
  draft['gerejawi.tgl_sidi'] = '2004-01-01'
  assert.throws(() => updateMemberSection(data, 'JMT-001', 'JMT-001', 'gerejawi', draft), /tanggal baptis/)
})

test('usia dihitung otomatis dengan memperhitungkan hari ulang tahun', () => {
  assert.equal(ageFromDate('1992-05-12', new Date(2026, 4, 11)), '33 tahun')
  assert.equal(ageFromDate('1992-05-12', new Date(2026, 4, 12)), '34 tahun')
})
