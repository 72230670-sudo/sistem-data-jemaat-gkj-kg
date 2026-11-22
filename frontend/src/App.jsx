import { useMemo, useState } from 'react'
import './App.css'

const initialMembers = [
  {
    id: 'JMT-001',
    name: 'Maria Kristina Wibowo',
    nickname: 'Maria',
    nik: '3374••••••••1234',
    gender: 'Perempuan',
    birth: 'Yogyakarta, 12 Mei 1992',
    familyNumber: 'KK-001',
    family: 'Keluarga Wibowo',
    region: 'Wilayah 1',
    phone: '0812 3456 7890',
    email: 'maria.wibowo@email.com',
    status: 'Aktif',
    role: 'Jemaat',
    address: 'Jl. Kenari No. 12, Yogyakarta',
    education: 'S1',
    occupation: 'Guru',
    baptism: 'Sudah',
    confirmation: 'Sudah',
    services: ['Paduan Suara', 'Sekolah Minggu'],
  },
  {
    id: 'JMT-002',
    name: 'Yohanes Setiawan',
    nickname: 'Yohanes',
    nik: '3374••••••••5678',
    gender: 'Laki-laki',
    birth: 'Sleman, 03 Oktober 1988',
    familyNumber: 'KK-002',
    family: 'Keluarga Setiawan',
    region: 'Wilayah 2',
    phone: '0821 4567 8901',
    email: 'yohanes.setiawan@email.com',
    status: 'Aktif',
    role: 'Majelis',
    address: 'Jl. Melati No. 8, Sleman',
    education: 'S1',
    occupation: 'Wiraswasta',
    baptism: 'Sudah',
    confirmation: 'Sudah',
    services: ['Majelis Gereja'],
  },
  {
    id: 'JMT-003',
    name: 'Ester Lestari',
    nickname: 'Ester',
    nik: '3374••••••••9012',
    gender: 'Perempuan',
    birth: 'Bantul, 21 Januari 2001',
    familyNumber: 'KK-003',
    family: 'Keluarga Lestari',
    region: 'Wilayah 1',
    phone: '0838 7654 3210',
    email: 'ester.lestari@email.com',
    status: 'Aktif',
    role: 'Jemaat',
    address: 'Jl. Anggrek No. 4, Bantul',
    education: 'SMA',
    occupation: 'Mahasiswa',
    baptism: 'Sudah',
    confirmation: 'Belum',
    services: ['Pemuda'],
  },
]

const emptyForm = {
  name: '',
  nickname: '',
  nik: '',
  gender: 'Perempuan',
  birth: '',
  family: '',
  region: 'Wilayah 1',
  phone: '',
  email: '',
  address: '',
  status: 'Aktif',
  occupation: '',
}

function App() {
  const [members, setMembers] = useState(initialMembers)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua status')
  const [selectedId, setSelectedId] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [notice, setNotice] = useState('')

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()
    return members.filter((member) => {
      const matchesQuery =
        !normalizedQuery ||
        [member.name, member.id, member.family, member.region]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      const matchesStatus =
        statusFilter === 'Semua status' || member.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [members, query, statusFilter])

  const selectedMember = members.find((member) => member.id === selectedId)

  function updateForm(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }

  function saveMember(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      showNotice('Nama lengkap dan nomor WhatsApp wajib diisi.')
      return
    }

    const newMember = {
      ...form,
      id: `JMT-${String(members.length + 1).padStart(3, '0')}`,
      familyNumber: `KK-${String(members.length + 1).padStart(3, '0')}`,
      nickname: form.nickname || form.name.split(' ')[0],
      birth: form.birth || 'Belum diisi',
      email: form.email || 'Belum diisi',
      education: 'Belum diisi',
      baptism: 'Belum diisi',
      confirmation: 'Belum diisi',
      services: [],
      role: 'Jemaat',
    }
    setMembers((current) => [newMember, ...current])
    setForm(emptyForm)
    setIsAdding(false)
    showNotice('Data jemaat berhasil ditambahkan.')
  }

  function deleteMember() {
    if (!selectedMember) return
    setMembers((current) => current.filter((member) => member.id !== selectedMember.id))
    setSelectedId(null)
    showNotice('Data jemaat berhasil dihapus.')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">✦</div>
          <div>
            <strong>GKJ Kategorial</strong>
            <span>Yogyakarta</span>
          </div>
        </div>
        <nav>
          <button className="nav-item active" type="button">⌂ <span>Data Jemaat</span></button>
          <button className="nav-item" type="button">▣ <span>Data Keluarga</span></button>
          <button className="nav-item" type="button">◷ <span>Kegiatan</span></button>
          <button className="nav-item" type="button">▤ <span>Laporan</span></button>
        </nav>
        <div className="sidebar-user">
          <div className="avatar small">A</div>
          <div><strong>Administrator</strong><span>Super Admin</span></div>
          <button type="button" aria-label="Buka menu akun">⋮</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">SISTEM INFORMASI JEMAAT</p>
            <h1>Data Jemaat</h1>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Notifikasi">♢</button>
            <div className="avatar">A</div>
          </div>
        </header>

        {!selectedMember && !isAdding && (
          <>
            <section className="welcome-card">
              <div>
                <span className="welcome-label">Selamat datang, Administrator</span>
                <h2>Kelola data jemaat dengan lebih sederhana.</h2>
                <p>Data inti ditampilkan ringkas. Buka profil untuk melihat informasi lengkap.</p>
              </div>
              <div className="welcome-symbol">✦</div>
            </section>
            <section className="stats-grid">
              <div className="stat-card"><span>Total Jemaat</span><strong>{members.length}</strong><small>Data terdaftar</small></div>
              <div className="stat-card"><span>Jemaat Aktif</span><strong>{members.filter((m) => m.status === 'Aktif').length}</strong><small className="positive">● Semua wilayah</small></div>
              <div className="stat-card"><span>Wilayah</span><strong>2</strong><small>Wilayah pelayanan</small></div>
            </section>
            <section className="content-card">
              <div className="section-heading">
                <div><h2>Daftar Jemaat</h2><p>{filteredMembers.length} data ditemukan</p></div>
                <button className="primary-button" type="button" onClick={() => setIsAdding(true)}>＋ Tambah Jemaat</button>
              </div>
              <div className="filters">
                <label className="search-box">⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, nomor anggota, atau wilayah..." /></label>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option>Semua status</option><option>Aktif</option><option>Pasif</option>
                </select>
              </div>
              <div className="member-list">
                {filteredMembers.map((member) => (
                  <button className="member-row" key={member.id} type="button" onClick={() => setSelectedId(member.id)}>
                    <div className="avatar member-avatar">{member.name.charAt(0)}</div>
                    <div className="member-main"><strong>{member.name}</strong><span>{member.id} · {member.family}</span></div>
                    <div className="member-contact"><strong>{member.phone}</strong><span>{member.region}</span></div>
                    <span className={`status ${member.status.toLowerCase()}`}>{member.status}</span><span className="chevron">›</span>
                  </button>
                ))}
                {!filteredMembers.length && <div className="empty-state">Data jemaat tidak ditemukan.</div>}
              </div>
            </section>
          </>
        )}

        {selectedMember && (
          <section className="profile-view">
            <button className="back-button" type="button" onClick={() => setSelectedId(null)}>← Kembali ke daftar</button>
            <div className="profile-header">
              <div className="avatar profile-avatar">{selectedMember.name.charAt(0)}</div>
              <div><span className="eyebrow">{selectedMember.id}</span><h2>{selectedMember.name}</h2><p>{selectedMember.role} · {selectedMember.region}</p></div>
              <div className="profile-actions"><button className="secondary-button" type="button" onClick={() => { setForm(selectedMember); setSelectedId(null); setIsAdding(true) }}>Edit data</button><button className="danger-button" type="button" onClick={deleteMember}>Hapus</button></div>
            </div>
            <div className="detail-grid">
              <DetailCard title="Identitas Jemaat" items={[['Nama panggilan', selectedMember.nickname], ['Jenis kelamin', selectedMember.gender], ['Tempat, tanggal lahir', selectedMember.birth], ['NIK', selectedMember.nik || 'Belum diisi']]} />
              <DetailCard title="Kontak & Alamat" items={[['Nomor WhatsApp', selectedMember.phone], ['Email', selectedMember.email], ['Alamat', selectedMember.address]]} />
              <DetailCard title="Keanggotaan" items={[['Keluarga', selectedMember.family], ['Nomor kartu keluarga', selectedMember.familyNumber], ['Baptis', selectedMember.baptism], ['Sidi', selectedMember.confirmation]]} />
              <DetailCard title="Pelayanan" items={[['Pekerjaan', selectedMember.occupation], ['Pendidikan', selectedMember.education], ['Pelayanan yang diikuti', selectedMember.services?.join(', ') || 'Belum diisi']]} />
            </div>
          </section>
        )}

        {isAdding && (
          <section className="form-view">
            <button className="back-button" type="button" onClick={() => setIsAdding(false)}>← Kembali ke daftar</button>
            <div className="form-heading"><div><span className="eyebrow">DATA JEMAAT</span><h2>Tambah data jemaat</h2><p>Isi informasi penting terlebih dahulu. Data lainnya dapat dilengkapi nanti.</p></div><div className="step-indicator"><b>1</b><span>Informasi utama</span></div></div>
            <form onSubmit={saveMember}>
              <fieldset><legend>Informasi utama</legend><div className="form-grid"><Field label="Nama lengkap" name="name" value={form.name} onChange={updateForm} required /><Field label="Nama panggilan" name="nickname" value={form.nickname} onChange={updateForm} /><Field label="Nomor WhatsApp" name="phone" value={form.phone} onChange={updateForm} required /><Field label="Email" name="email" type="email" value={form.email} onChange={updateForm} /><Field label="Tempat & tanggal lahir" name="birth" value={form.birth} onChange={updateForm} /><label className="field"><span>Jenis kelamin</span><select name="gender" value={form.gender} onChange={updateForm}><option>Perempuan</option><option>Laki-laki</option></select></label></div></fieldset>
              <fieldset><legend>Keanggotaan & alamat</legend><div className="form-grid"><Field label="Keluarga" name="family" value={form.family} onChange={updateForm} /><label className="field"><span>Wilayah</span><select name="region" value={form.region} onChange={updateForm}><option>Wilayah 1</option><option>Wilayah 2</option></select></label><Field label="Pekerjaan" name="occupation" value={form.occupation} onChange={updateForm} /><Field label="Alamat" name="address" value={form.address} onChange={updateForm} /><label className="field"><span>Status keanggotaan</span><select name="status" value={form.status} onChange={updateForm}><option>Aktif</option><option>Pasif</option></select></label></div></fieldset>
              <div className="form-actions"><button className="secondary-button" type="button" onClick={() => setIsAdding(false)}>Batal</button><button className="primary-button" type="submit">Simpan data jemaat</button></div>
            </form>
          </section>
        )}
      </main>
      {notice && <div className="toast">✓ {notice}</div>}
    </div>
  )
}

function DetailCard({ title, items }) {
  return <article className="detail-card"><h3>{title}</h3>{items.map(([label, value]) => <div className="detail-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</article>
}

function Field({ label, name, value, onChange, type = 'text', required = false }) {
  return <label className="field"><span>{label}{required && ' *'}</span><input name={name} type={type} value={value} onChange={onChange} required={required} /></label>
}

export default App
