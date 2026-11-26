// Data sintetis untuk prototipe UI. Bukan autentikasi atau otorisasi produksi.
// Backend harus memvalidasi kredensial, role, nomor KK, dan field update sendiri.
export const profileSections = [
  { id: 'identitas', title: 'Identitas pribadi', subtitle: 'Informasi dasar sesuai data jemaat', icon: 'person', fields: [
    { key: 'nama_lengkap', label: 'Nama lengkap', required: true },
    { key: 'jenis_kelamin', label: 'Jenis kelamin', options: ['Laki-laki', 'Perempuan'] },
    { key: 'tmpt_lhr', label: 'Tempat lahir', required: true },
    { key: 'tgl_lhr', label: 'Tanggal lahir', type: 'date', required: true },
    { key: 'gol_darah', label: 'Golongan darah', options: ['Belum diketahui', 'A', 'B', 'AB', 'O'] },
    { key: 'status_jemaat', label: 'Status jemaat', options: ['Warga jemaat', 'Simpatisan'] },
  ] },
  { id: 'kontak', title: 'Kontak', subtitle: 'Kontak yang dapat digunakan untuk menghubungi jemaat', icon: 'phone', fields: [
    { key: 'no_whatsapp', label: 'Nomor WhatsApp', type: 'tel' },
    { key: 'user.email', label: 'Email', type: 'email' },
  ] },
  { id: 'keluarga', title: 'Keluarga & alamat', subtitle: 'Perubahan alamat berlaku untuk seluruh anggota dalam KK ini', icon: 'home', family: true, fields: [
    { key: 'nama_kepala_keluarga', label: 'Nama kepala keluarga', required: true },
    { key: 'alamat', label: 'Alamat surat', required: true, wide: true },
    { key: 'rt', label: 'RT' }, { key: 'rw', label: 'RW' },
    { key: 'desa', label: 'Desa / kelurahan' }, { key: 'dusun', label: 'Dusun' },
    { key: 'kecamatan', label: 'Kecamatan' }, { key: 'kabupaten', label: 'Kabupaten / kota' },
    { key: 'provinsi', label: 'Provinsi' }, { key: 'kode_pos', label: 'Kode pos' },
  ] },
  { id: 'gerejawi', title: 'Data gerejawi', subtitle: 'Baptis, sidi, dan pernikahan', icon: 'church', fields: [
    { key: 'gerejawi.status_baptis', label: 'Status baptis', options: ['Sudah', 'Belum'] },
    { key: 'gerejawi.tgl_baptis', label: 'Tanggal baptis', type: 'date' },
    { key: 'gerejawi.status_sidi', label: 'Status sidi', options: ['Sudah', 'Belum'] },
    { key: 'gerejawi.tgl_sidi', label: 'Tanggal sidi', type: 'date' },
    { key: 'gerejawi.status_pernikahan', label: 'Status pernikahan', options: ['Belum menikah', 'Menikah', 'Cerai hidup', 'Cerai mati'] },
    { key: 'gerejawi.tgl_pernikahan', label: 'Tanggal pernikahan', type: 'date' },
    { key: 'gerejawi.status_keaktifan', label: 'Status keaktifan', options: ['Aktif', 'Pasif'] },
  ] },
  { id: 'pendidikan', title: 'Pendidikan', subtitle: 'Pendidikan terakhir jemaat', icon: 'book', fields: [
    { key: 'pendidikan.pendidikan_terakhir', label: 'Pendidikan terakhir', options: ['Belum sekolah', 'SD', 'SMP', 'SMA / SMK', 'D1', 'D2', 'D3', 'D4 / S1', 'S2', 'S3'] },
    { key: 'pendidikan.nama_sekolah', label: 'Nama sekolah / perguruan tinggi' },
    { key: 'pendidikan.thn_lulus', label: 'Tahun lulus', type: 'number' },
  ] },
  { id: 'pekerjaan', title: 'Pekerjaan', subtitle: 'Informasi pekerjaan dan instansi', icon: 'work', fields: [
    { key: 'pekerjaan.pekerjaan', label: 'Pekerjaan' },
    { key: 'pekerjaan.instansi', label: 'Instansi' },
    { key: 'pekerjaan.jabatan', label: 'Jabatan' },
    { key: 'pekerjaan.penghasilan', label: 'Penghasilan per bulan (Rp)', type: 'number' },
  ] },
]

export function createDemoData() {
  const currentYear = new Date().getFullYear()
  const makeMember = (id, name, nik, birth, gender, kk, userId) => ({
    id, nik, no_kk: kk, id_user: userId, id_wil: 'WIL-01', nama_wilayah: 'Wilayah 1',
    nama_lengkap: name, jenis_kelamin: gender, tmpt_lhr: 'Yogyakarta', tgl_lhr: birth,
    gol_darah: 'O', status_jemaat: 'Warga jemaat', foto: '', no_whatsapp: '081234567890',
    user: { id_user: userId, email: '', role: 'jemaat' },
    gerejawi: { id_gereja: `GRJ-${id}`, nik, status_baptis: 'Sudah', tgl_baptis: '', status_sidi: 'Sudah', tgl_sidi: '', status_pernikahan: 'Menikah', tgl_pernikahan: '', status_keaktifan: 'Aktif' },
    pendidikan: { id_pendidikan: `PDK-${id}`, nik, pendidikan_terakhir: 'D4 / S1', nama_sekolah: 'Universitas di Yogyakarta', thn_lulus: '' },
    pekerjaan: { id_pekerjaan: `PKJ-${id}`, nik, pekerjaan: 'Guru', instansi: 'Sekolah di Yogyakarta', jabatan: 'Guru kelas', penghasilan: '4500000' },
    riwayat_pelayanan: [
      { id_pelayanan: `PLY-${id}-1`, nik, nama_pelayanan: 'Paduan suara', thn_mulai: '2019', thn_berakhir: '' },
      { id_pelayanan: `PLY-${id}-2`, nik, nama_pelayanan: 'Guru SMG (Sekolah Minggu)', thn_mulai: '2021', thn_berakhir: '' }
    ],
    dokumen: [
      { id_dokumen: `DOK-${id}-1`, nik, jenis_dokumen: 'KTP', file_path: 'ktp_jemaat.pdf' },
      { id_dokumen: `DOK-${id}-2`, nik, jenis_dokumen: 'Kartu Keluarga', file_path: 'kartu_keluarga.pdf' },
    ],
    persembahan_bulanan: [
      { id_persembahan: `PRB-${id}-01`, nik, tahun: currentYear, bulan: 1, jml_nominal: 100000, status_byr: 'LUNAS' },
      { id_persembahan: `PRB-${id}-02`, nik, tahun: currentYear, bulan: 2, jml_nominal: 100000, status_byr: 'LUNAS' },
      { id_persembahan: `PRB-${id}-03`, nik, tahun: currentYear, bulan: 3, jml_nominal: 100000, status_byr: 'LUNAS' },
      { id_persembahan: `PRB-${id}-04`, nik, tahun: currentYear, bulan: 4, jml_nominal: 100000, status_byr: 'LUNAS' },
      { id_persembahan: `PRB-${id}-05`, nik, tahun: currentYear, bulan: 5, jml_nominal: 100000, status_byr: 'LUNAS' },
      { id_persembahan: `PRB-${id}-06`, nik, tahun: currentYear, bulan: 6, jml_nominal: 100000, status_byr: 'LUNAS' },
      { id_persembahan: `PRB-${id}-07`, nik, tahun: currentYear, bulan: 7, jml_nominal: 100000, status_byr: 'LUNAS' },
      { id_persembahan: `PRB-${id}-08`, nik, tahun: currentYear, bulan: 8, jml_nominal: 100000, status_byr: 'LUNAS' },
      { id_persembahan: `PRB-${id}-09`, nik, tahun: currentYear, bulan: 9, jml_nominal: 100000, status_byr: 'LUNAS' },
      { id_persembahan: `PRB-${id}-10`, nik, tahun: currentYear, bulan: 10, jml_nominal: 100000, status_byr: 'LUNAS' },
      { id_persembahan: `PRB-${id}-11`, nik, tahun: currentYear, bulan: 11, jml_nominal: 100000, status_byr: 'BELUM' },
      { id_persembahan: `PRB-${id}-12`, nik, tahun: currentYear, bulan: 12, jml_nominal: 100000, status_byr: 'BELUM' },
    ],
  })
  const mother = makeMember('JMT-001', 'Maria Kristina Wibowo', '0000000000000001', '1992-05-12', 'Perempuan', '0000000000000101', 'USR-001')
  mother.user.email = 'maria@example.com'
  mother.pekerjaan.pekerjaan = 'Guru'
  mother.pekerjaan.instansi = 'Sekolah di Yogyakarta'
  mother.pekerjaan.jabatan = 'Guru kelas'
  mother.pendidikan.nama_sekolah = 'Universitas di Yogyakarta'
  mother.pendidikan.thn_lulus = '2014'
  mother.gerejawi.tgl_baptis = '2005-06-12'
  mother.gerejawi.tgl_sidi = '2010-04-18'
  mother.gerejawi.tgl_pernikahan = '2015-06-20'
  mother.riwayat_pelayanan = [{ id_pelayanan: 'PLY-001', nik: mother.nik, nama_pelayanan: 'Paduan suara', thn_mulai: '2019', thn_berakhir: '' }]
  const father = makeMember('JMT-002', 'Daniel Wibowo', '0000000000000002', '1990-08-17', 'Laki-laki', mother.no_kk, 'USR-002')
  father.pekerjaan.pekerjaan = 'Wiraswasta'
  father.no_whatsapp = '081298765432'
  const child = makeMember('JMT-003', 'Naomi Wibowo', '0000000000000003', '2017-03-09', 'Perempuan', mother.no_kk, 'USR-003')
  child.gerejawi.status_pernikahan = 'Belum menikah'
  child.gerejawi.status_sidi = 'Belum'
  child.pendidikan.pendidikan_terakhir = 'SD'
  child.pekerjaan.pekerjaan = 'Pelajar'
  const outsider = makeMember('JMT-004', 'Anggota keluarga lain', '0000000000000004', '1988-10-03', 'Laki-laki', '0000000000000202', 'USR-004')
  
  // Data akun jemaat sesuai referensi tangkapan layar 2.jpg
  const yohanes = makeMember('JMT-005', 'Yohanes Thiapok Setiawan', '9102010106050005', '2005-05-01', 'Laki-laki', '9102010106050105', 'USR-005')
  yohanes.user.email = 'yohanesthiapok@gmail.com'
  yohanes.no_whatsapp = '081343446030'
  yohanes.pekerjaan.pekerjaan = 'Mahasiswa'
  yohanes.pekerjaan.instansi = 'Universitas di Yogyakarta'
  yohanes.pekerjaan.jabatan = 'Mahasiswa'
  yohanes.gerejawi.status_pernikahan = 'Belum menikah'
  yohanes.gerejawi.status_sidi = 'Sudah'
  yohanes.pendidikan.pendidikan_terakhir = 'SMA / SMK'
  yohanes.pendidikan.nama_sekolah = 'SMA di Yogyakarta'
  yohanes.pendidikan.thn_lulus = '2023'

  const makeFamily = (no_kk, name, address) => ({
    no_kk, nama_kepala_keluarga: name, alamat: address, rt: '04', rw: '02',
    desa: 'Prenggan', dusun: 'Prenggan', kecamatan: 'Kotagede', kabupaten: 'Yogyakarta',
    provinsi: 'DI Yogyakarta', kode_pos: '55172',
  })
  return {
    members: [mother, father, child, outsider, yohanes],
    families: [
      makeFamily(mother.no_kk, father.nama_lengkap, 'Jl. Kemasan No. 12'),
      makeFamily(outsider.no_kk, outsider.nama_lengkap, 'Jl. Contoh No. 8'),
      makeFamily(yohanes.no_kk, yohanes.nama_lengkap, 'Jl. Mondorakan No. 45')
    ],
  }
}

export function searchJemaatRestricted(members, query) {
  if (!query || !query.trim()) return []
  const q = query.toLowerCase().trim()
  return members
    .filter((m) => m.nama_lengkap.toLowerCase().includes(q) || (m.nama_wilayah && m.nama_wilayah.toLowerCase().includes(q)))
    .map((m) => ({
      nama_lengkap: m.nama_lengkap,
      nama_wilayah: m.nama_wilayah,
      status_jemaat: m.status_jemaat,
    }))
    .slice(0, 15)
}

export function getValue(record, key) {
  return key.split('.').reduce((value, part) => value?.[part], record) ?? ''
}

export function datePassword(date) {
  const [year, month, day] = date.split('-')
  return `${day}${month}${year}`
}

export function authenticateDemo(members, nik, password) {
  const cleanNik = (nik || '').trim()
  const cleanPw = (password || '').trim().replace(/-/g, '')
  return members.find((member) => {
    if (member.user.role !== 'jemaat') return false
    if (member.nik !== cleanNik) return false
    const expected = datePassword(member.tgl_lhr)
    const [y, m, d] = member.tgl_lhr.split('-')
    const yyyymmdd = `${y}${m}${d}`
    return cleanPw === expected || cleanPw === yyyymmdd || cleanPw === member.tgl_lhr
  }) ?? null
}

export function familyMembers(members, actor) {
  if (!actor || actor.user.role !== 'jemaat' || !actor.no_kk) return []
  return members.filter((member) => member.no_kk === actor.no_kk)
}

export function localCalendarDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function validateSection(section, values, today = localCalendarDate()) {
  for (const field of section.fields) {
    const value = String(values[field.key] ?? '').trim()
    if (field.required && !value) throw new Error(`${field.label} wajib diisi.`)
    if (field.options && !field.options.includes(value)) throw new Error(`${field.label} tidak valid.`)
    if (value && field.type === 'date') {
      const date = new Date(`${value}T00:00:00Z`)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value || value > today || value < '1900-01-01') throw new Error(`${field.label} tidak valid atau berada di masa depan.`)
    }
    if (value && field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error('Format email tidak valid.')
    if (value && field.type === 'tel' && !/^(?:08|628|\+628)\d{7,12}$/.test(value)) throw new Error('Nomor WhatsApp harus diawali 08 atau 628, tanpa spasi.')
    if (value && field.type === 'number' && (!Number.isFinite(Number(value)) || Number(value) < 0)) throw new Error(`${field.label} harus berupa angka positif.`)
    if (field.key === 'pendidikan.thn_lulus' && value && (!/^\d{4}$/.test(value) || Number(value) < 1900 || Number(value) > Number(today.slice(0, 4)))) throw new Error('Tahun lulus tidak valid.')
    if (['rt', 'rw'].includes(field.key) && value && !/^\d{1,3}$/.test(value)) throw new Error(`${field.label} harus berisi 1–3 angka.`)
    if (field.key === 'kode_pos' && value && !/^\d{5}$/.test(value)) throw new Error('Kode pos harus berisi 5 angka.')
  }
  if (section.id === 'gerejawi') {
    for (const [status, date, notCompleted] of [['status_baptis', 'tgl_baptis', 'Belum'], ['status_sidi', 'tgl_sidi', 'Belum'], ['status_pernikahan', 'tgl_pernikahan', 'Belum menikah']]) {
      if (values[`gerejawi.${status}`] === notCompleted && values[`gerejawi.${date}`]) throw new Error('Tanggal gerejawi harus kosong jika status belum dilaksanakan.')
    }
  }
}

function applyFields(record, fields, values) {
  const result = { ...record }
  for (const field of fields) {
    const value = String(values[field.key] ?? '').trim()
    const [parent, child] = field.key.split('.')
    if (child) result[parent] = { ...result[parent], [child]: value }
    else result[parent] = value
  }
  return result
}

export function updateMemberSection(data, actorId, targetId, sectionId, values) {
  // Allowlist di sini menjaga alur UI; ini bukan pengganti RLS/API authorization.
  const actor = data.members.find((member) => member.id === actorId)
  const target = familyMembers(data.members, actor).find((member) => member.id === targetId)
  const section = profileSections.find((item) => item.id === sectionId)
  if (!target || !section) throw new Error('Anda hanya dapat memperbarui data keluarga sendiri.')
  if (Object.keys(values).some((key) => !section.fields.some((field) => field.key === key))) throw new Error('ID, NIK, nomor KK, role, dan referensi data tidak dapat diubah.')
  validateSection(section, values)
  if (section.family) {
    const family = data.families.find((item) => item.no_kk === target.no_kk)
    if (!family) throw new Error('Data keluarga tidak ditemukan.')
    return { ...data, families: data.families.map((item) => item.no_kk === target.no_kk ? applyFields(item, section.fields, values) : item) }
  }
  const updated = applyFields(target, section.fields, values)
  for (const key of ['tgl_baptis', 'tgl_sidi', 'tgl_pernikahan']) {
    if (updated.gerejawi[key] && updated.gerejawi[key] < updated.tgl_lhr) throw new Error('Tanggal gerejawi tidak boleh mendahului tanggal lahir.')
  }
  if (updated.gerejawi.tgl_baptis && updated.gerejawi.tgl_sidi && updated.gerejawi.tgl_sidi < updated.gerejawi.tgl_baptis) throw new Error('Tanggal sidi tidak boleh mendahului tanggal baptis.')
  if (updated.pendidikan.thn_lulus && Number(updated.pendidikan.thn_lulus) < Number(updated.tgl_lhr.slice(0, 4))) throw new Error('Tahun lulus tidak boleh mendahului tahun lahir.')
  return { ...data, members: data.members.map((member) => member.id === target.id ? updated : member) }
}

export function updateMemberPhoto(data, actorId, targetId, photo) {
  const actor = data.members.find((member) => member.id === actorId)
  if (!familyMembers(data.members, actor).some((member) => member.id === targetId)) throw new Error('Profil ini tidak dapat diakses.')
  if (!/^data:image\/(jpeg|png|webp);base64,/.test(photo) || photo.length > 2800000) throw new Error('Foto harus JPG, PNG, atau WebP maksimal 2 MB.')
  return { ...data, members: data.members.map((member) => member.id === targetId ? { ...member, foto: photo } : member) }
}

export function formatDate(value) {
  if (!value) return 'Belum diisi'
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? 'Belum diisi' : new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export function ageFromDate(value, today = new Date()) {
  const birth = new Date(`${value}T00:00:00`)
  if (Number.isNaN(birth.getTime())) return '—'
  let age = today.getFullYear() - birth.getFullYear()
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age -= 1
  return `${age} tahun`
}
