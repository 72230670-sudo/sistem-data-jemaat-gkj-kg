import { useEffect, useRef, useState } from 'react'
import logo from '../../assets/logo_gkjkg.jpg'
import {
  ageFromDate, authenticateDemo, createDemoData, datePassword, familyMembers,
  formatDate, getValue, localCalendarDate, profileSections, updateMemberPhoto, updateMemberSection,
} from '../../lib/jemaatData.js'
import './JemaatApp.css'

const iconPaths = {
  person: 'M20 21v-2a7 7 0 0 0-14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  family: 'M16 21v-2a5 5 0 0 0-10 0v2M15 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM20 21v-2a5 5 0 0 0-3-4.6M17 3.4a4 4 0 0 1 0 7.2',
  home: 'm3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Zm6 11v-8h6v8',
  lock: 'M5 10h14v11H5V10Zm3 0V7a4 4 0 0 1 8 0v3M12 14v3',
  edit: 'm16 3 5 5-12 12-6 1 1-6L16 3Zm-2 2 5 5',
  church: 'M12 2v7M9 5h6M6 13l6-4 6 4v8H6v-8Zm4 8v-6h4v6M3 21h18',
  book: 'M12 5v16M3 3c4-1 6 0 9 2 3-2 5-3 9-2v16c-4-1-6 0-9 2-3-2-5-3-9-2V3Z',
  work: 'M3 7h18v14H3V7Zm5 0V3h8v4M3 12c6 3 12 3 18 0M12 11v4',
  phone: 'M8 3H4v4c0 7 6 13 13 13h4v-4l-5-2-2 2c-3-1-5-3-6-6l2-2-2-5Z',
  arrow: 'm9 5 7 7-7 7',
  back: 'm15 5-7 7 7 7M8 12h13',
  check: 'm5 12 4 4L19 6',
  logout: 'M9 3H3v18h6M10 12h11m-4-4 4 4-4 4',
  search: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 6 6',
  info: 'M12 11v6M12 7h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  upload: 'M12 16V3m-4 4 4-4 4 4M4 16v5h16v-5',
  document: 'M14 2H4v20h16V8l-6-6Zm0 0v6h6M8 12h8M8 16h8',
}

export function Icon({ name, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={iconPaths[name] || iconPaths.info} /></svg>
}

function Avatar({ member, large = false }) {
  return <span className={`jm-avatar${large ? ' jm-avatar-large' : ''}`}>
    {member.foto ? <img src={member.foto} alt={`Foto ${member.nama_lengkap}`} /> : member.nama_lengkap.split(' ').slice(0, 2).map((name) => name[0]).join('')}
  </span>
}

export function LoginPage({ onLogin, onDemo, error }) {
  const [nik, setNik] = useState('')
  const [password, setPassword] = useState('')
  return <main className="jm-login">
    <section className="jm-login-card">
      <img className="jm-login-logo" src={logo} alt="GKJ Kotagede" />
      <p className="jm-eyebrow">GKJ KOTAGEDE YOGYAKARTA</p>
      <h1>Selamat datang, Jemaat</h1>
      <p className="jm-login-intro">Masuk untuk melihat profil dan memperbarui data keluarga Anda.</p>
      <form onSubmit={(event) => { event.preventDefault(); onLogin(nik, password) }}>
        <label className="jm-field"><span>NIK</span><input name="username" inputMode="numeric" autoComplete="username" value={nik} onChange={(event) => setNik(event.target.value)} placeholder="Masukkan NIK Anda" required /></label>
        <label className="jm-field"><span>Kata sandi · tanggal lahir</span><input name="password" type="password" inputMode="numeric" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="DDMMYYYY" minLength={8} maxLength={8} required aria-describedby="jm-password-help" /></label>
        <p id="jm-password-help" className="jm-help">Gunakan tanggal lahir dengan format hari, bulan, tahun (DDMMYYYY).</p>
        {error && <p role="alert" className="jm-error">{error}</p>}
        <button className="jm-primary jm-login-button" type="submit">Masuk ke dashboard <Icon name="arrow" size={17} /></button>
      </form>
      <div className="jm-demo-box"><strong>Pratinjau tampilan · data contoh</strong><p>Belum terhubung ke autentikasi server. Jangan gunakan data pribadi asli. Perubahan akan hilang saat halaman dimuat ulang.</p><button className="jm-text-button" type="button" onClick={() => { const example = onDemo(); setNik(example.nik); setPassword(datePassword(example.tgl_lhr)) }}>Isi akun contoh <Icon name="arrow" size={15} /></button></div>
      <p className="jm-login-footer"><Icon name="lock" size={14} /> Akses khusus profil pribadi dan anggota dalam satu KK</p>
    </section>
  </main>
}

export function MemberCard({ member, family, self }) {
  return <section className="jm-member-card" aria-label="Kartu jemaat digital">
    <div className="jm-card-brand"><img src={logo} alt="" /><div><strong>GKJ KOTAGEDE</strong><span>Gereja Kristen Jawa · Yogyakarta</span></div><Icon name="church" size={30} /></div>
    <div className="jm-card-person"><Avatar member={member} large /><div><span className="jm-card-caption">KARTU JEMAAT DIGITAL</span><h2>{member.nama_lengkap}</h2><p>{self ? 'Profil saya' : 'Anggota keluarga'} · {member.status_jemaat}</p></div></div>
    <div className="jm-card-meta"><div><span>Nomor anggota</span><strong>{member.id}</strong></div><div><span>Wilayah</span><strong>{member.nama_wilayah}</strong></div></div>
    <div className="jm-card-bottom"><span><i className={member.gerejawi.status_keaktifan === 'Aktif' ? 'jm-dot' : 'jm-dot jm-dot-muted'} /> {member.gerejawi.status_keaktifan}</span><span>Keluarga {family.nama_kepala_keluarga}</span></div>
  </section>
}

function LockedField({ label, value }) {
  return <label className="jm-field jm-locked-field"><span>{label} <small><Icon name="lock" size={10} /> Terkunci</small></span><input value={value} readOnly aria-readonly="true" /></label>
}

function displayValue(field, record) {
  const value = getValue(record, field.key)
  if (!value) return 'Belum diisi'
  if (field.type === 'date') return formatDate(value)
  if (field.key === 'pekerjaan.penghasilan') return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value))
  return value
}

export function ProfileSection({ section, record, editing, draft, error, onEdit, onChange, onSave, onCancel, editDisabled }) {
  const heading = `jm-section-${section.id}`
  const [today] = useState(localCalendarDate)
  return <section className={`jm-panel jm-profile-section${editing ? ' jm-editing' : ''}`} aria-labelledby={heading}>
    <header className="jm-panel-heading"><span className="jm-section-icon"><Icon name={section.icon} /></span><div><h3 id={heading}>{section.title}</h3><p>{section.subtitle}</p></div>{!editing && <button className="jm-edit-button" type="button" onClick={onEdit} disabled={editDisabled} aria-label={`Ubah ${section.title}`}><Icon name="edit" size={15} /><span>Ubah</span></button>}</header>
    {editing ? <form onSubmit={onSave}>
      <div className="jm-form-grid">{section.fields.map((field) => <label key={field.key} className={`jm-field${field.wide ? ' jm-field-wide' : ''}`}>
        <span>{field.label}{field.required && <b className="jm-required"> *</b>}</span>
        {field.options ? <select name={field.key} value={draft[field.key]} onChange={onChange}>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : <input name={field.key} type={field.type || 'text'} value={draft[field.key]} onChange={onChange} required={field.required} maxLength={field.type === 'date' || field.type === 'number' ? undefined : 200} min={field.type === 'date' ? '1900-01-01' : field.key === 'pendidikan.thn_lulus' ? 1900 : field.type === 'number' ? 0 : undefined} max={field.type === 'date' ? today : field.key === 'pendidikan.thn_lulus' ? Number(today.slice(0, 4)) : undefined} step={field.key === 'pekerjaan.penghasilan' ? 'any' : undefined} />}
      </label>)}</div>
      {section.id === 'identitas' && <p className="jm-help jm-edit-help">Tanggal lahir digunakan sebagai kata sandi pada alur contoh ini. Perubahan juga mengubah tanggal lahir untuk login berikutnya.</p>}
      {error && <p className="jm-error" role="alert">{error}</p>}
      <div className="jm-form-actions"><span><Icon name="lock" size={13} /> ID & NIK tetap terkunci</span><button type="button" className="jm-secondary" onClick={onCancel}>Batal</button><button type="submit" className="jm-primary"><Icon name="check" size={16} /> Simpan perubahan</button></div>
    </form> : <dl className="jm-data-grid">{section.fields.map((field) => <div key={field.key} className={field.wide ? 'jm-field-wide' : ''}><dt>{field.label}</dt><dd className={getValue(record, field.key) ? '' : 'jm-unfilled'}>{displayValue(field, record)}</dd></div>)}{section.id === 'identitas' && <div><dt>Usia <span className="jm-auto">Otomatis</span></dt><dd>{ageFromDate(record.tgl_lhr)}</dd></div>}</dl>}
  </section>
}

export function ReadOnlyRecords({ member }) {
  return <section className="jm-panel jm-records">
    <header className="jm-panel-heading"><span className="jm-section-icon"><Icon name="document" /></span><div><h3>Catatan keanggotaan</h3><p>Informasi tercatat oleh gereja, hanya dapat dilihat</p></div><span className="jm-readonly-badge">Hanya baca</span></header>
    <div className="jm-record-grid"><div><h4>Riwayat pelayanan</h4>{member.riwayat_pelayanan.length ? <ul>{member.riwayat_pelayanan.map((item) => <li key={item.id_pelayanan}><strong>{item.nama_pelayanan}</strong><span>{item.thn_mulai} – {item.thn_berakhir || 'sekarang'}</span></li>)}</ul> : <p>Belum ada riwayat pelayanan.</p>}</div><div><h4>Dokumen</h4>{member.dokumen.length ? <ul>{member.dokumen.map((item) => <li key={item.id_dokumen}><strong>{item.jenis_dokumen}</strong><span>{item.file_path}</span></li>)}</ul> : <p>Belum ada dokumen tercatat.</p>}</div><div><h4>Persembahan bulanan</h4>{member.persembahan_bulanan.length ? <ul>{member.persembahan_bulanan.map((item) => <li key={item.id_persembahan}><strong>{item.bulan}/{item.tahun} · {item.status_byr}</strong><span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.jml_nominal)}</span></li>)}</ul> : <p>Belum ada catatan persembahan.</p>}</div></div>
  </section>
}

export default function JemaatApp() {
  const [data, setData] = useState(createDemoData)
  const [actorId, setActorId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [page, setPage] = useState('profile')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Semua')
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState({})
  const [error, setError] = useState('')
  const [loginError, setLoginError] = useState('')
  const [notice, setNotice] = useState('')
  const actorRef = useRef(null)
  const actor = data.members.find((member) => member.id === actorId)
  const relatives = familyMembers(data.members, actor)
  const member = relatives.find((item) => item.id === selectedId)
  const family = member && data.families.find((item) => item.no_kk === member.no_kk)

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(''), 5000)
    return () => window.clearTimeout(timeout)
  }, [notice])

  function login(nik, password) {
    const user = authenticateDemo(data.members, nik, password)
    if (!user) { setLoginError('NIK atau tanggal lahir tidak sesuai. Silakan periksa kembali.'); return }
    actorRef.current = user.id
    setActorId(user.id); setSelectedId(user.id); setLoginError(''); setPage('profile')
  }

  function navigate(nextPage, id = actorId) {
    if (editing && !window.confirm('Perubahan belum disimpan. Tinggalkan perubahan ini?')) return
    setEditing(null); setError(''); setNotice(''); setPage(nextPage); setSelectedId(id); setQuery(''); setFilter('Semua')
  }

  function logout() {
    if (editing && !window.confirm('Perubahan belum disimpan. Tetap keluar?')) return
    actorRef.current = null
    setActorId(null); setSelectedId(null); setEditing(null); setError(''); setNotice('')
  }

  function beginEdit(section) {
    setDraft(Object.fromEntries(section.fields.map((field) => [field.key, getValue(section.family ? family : member, field.key)])))
    setEditing(section.id); setError('')
  }

  function save(event) {
    event.preventDefault()
    try {
      const updated = updateMemberSection(data, actorId, selectedId, editing, draft)
      setData(updated); setEditing(null); setError(''); setNotice('Perubahan berhasil disimpan pada data contoh sesi ini.')
    } catch (failure) { setError(failure.message) }
  }

  function uploadPhoto(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) { setNotice('Foto harus JPG, PNG, atau WebP maksimal 2 MB.'); return }
    const uploadActor = actorId
    const uploadTarget = selectedId
    const reader = new FileReader()
    reader.onload = () => {
      // Pastikan gambar dapat ditampilkan sebelum mengganti foto sebelumnya.
      const image = new Image()
      image.onload = () => {
        if (actorRef.current !== uploadActor) return
        setData((current) => updateMemberPhoto(current, uploadActor, uploadTarget, String(reader.result)))
        setNotice('Foto berhasil diperbarui pada data contoh sesi ini.')
      }
      image.onerror = () => { if (actorRef.current === uploadActor) setNotice('File bukan gambar yang valid. Foto sebelumnya tidak diubah.') }
      image.src = String(reader.result)
    }
    reader.onerror = () => setNotice('Foto tidak dapat dibaca. Silakan pilih ulang.')
    reader.readAsDataURL(file)
  }

  if (!actor) return <LoginPage onLogin={login} onDemo={() => data.members[0]} error={loginError} />
  if (!member || !family) return <main className="jm-login"><section className="jm-panel"><h1>Profil keluarga tidak ditemukan</h1><button className="jm-primary" onClick={logout}>Kembali ke login</button></section></main>
  const self = member.id === actorId
  const filtered = relatives.filter((item) => `${item.nama_lengkap} ${item.nik}`.toLowerCase().includes(query.trim().toLowerCase()) && (filter === 'Semua' || item.gerejawi.status_keaktifan === filter))

  return <div className="jm-app">
    <aside className="jm-sidebar">
      <a className="jm-brand" href="#profil" onClick={(event) => { event.preventDefault(); navigate('profile') }}><img src={logo} alt="" /><span><strong>GKJ Kotagede</strong><small>Portal Jemaat</small></span></a>
      <p className="jm-nav-label">RUANG JEMAAT</p>
      <nav aria-label="Menu jemaat"><button type="button" className={`jm-nav-item${page === 'profile' && self ? ' active' : ''}`} aria-current={page === 'profile' && self ? 'page' : undefined} onClick={() => navigate('profile')}><Icon name="person" /><span>Profil saya</span></button><button type="button" className={`jm-nav-item${page === 'family' || !self ? ' active' : ''}`} aria-current={page === 'family' || !self ? 'page' : undefined} onClick={() => navigate('family')}><Icon name="family" /><span>Anggota keluarga</span><small>{relatives.length}</small></button></nav>
      <div className="jm-sidebar-info"><Icon name="lock" size={22} /><strong>Data keluarga Anda</strong><p>Akses hanya untuk melihat dan memperbarui. Identitas utama tetap terlindungi.</p></div>
      <div className="jm-sidebar-account"><Avatar member={actor} /><div><strong>{actor.nama_lengkap.split(' ')[0]}</strong><span>Warga jemaat</span></div><button type="button" onClick={logout} aria-label="Keluar dari akun"><Icon name="logout" size={18} /></button></div>
    </aside>
    <div className="jm-workspace">
      <header className="jm-topbar"><div><span className="jm-eyebrow">SISTEM INFORMASI DATA JEMAAT</span><strong>Dashboard Jemaat</strong></div><span className="jm-role-badge"><Icon name="check" size={13} /> Mode mandiri jemaat</span><button className="jm-mobile-logout" type="button" onClick={logout} aria-label="Keluar dari akun"><Icon name="logout" /></button></header>
      <div className="jm-demo-strip"><Icon name="info" size={14} /> Mode contoh · Belum terhubung ke server. Perubahan hanya selama halaman ini terbuka.</div>
      <main className="jm-main">
        <div className="jm-breadcrumb">Data saya <Icon name="arrow" size={12} /> {page === 'family' ? 'Anggota keluarga' : self ? 'Profil pribadi' : 'Profil anggota keluarga'}</div>
        <div className="jm-page-heading"><div><h1>{page === 'family' ? 'Anggota keluarga' : self ? 'Profil saya' : 'Profil anggota keluarga'}</h1><p>{page === 'family' ? 'Lihat dan perbarui data anggota yang terdaftar dalam satu kartu keluarga.' : 'Data yang lengkap membantu gereja melayani Anda dengan lebih baik.'}</p></div><span className="jm-access-badge"><Icon name="lock" size={14} /> Lihat & perbarui</span></div>
        <div className="jm-mobile-tabs"><button className={page === 'profile' && self ? 'active' : ''} type="button" onClick={() => navigate('profile')}><Icon name="person" size={16} /> Profil saya</button><button className={page === 'family' || !self ? 'active' : ''} type="button" onClick={() => navigate('family')}><Icon name="family" size={16} /> Keluarga <span>{relatives.length}</span></button></div>
        {page === 'family' ? <>
          <section className="jm-family-summary"><span className="jm-family-icon"><Icon name="home" size={26} /></span><div><span className="jm-eyebrow">KARTU KELUARGA</span><h2>Keluarga {family.nama_kepala_keluarga}</h2><p>{family.alamat}, {family.kecamatan}, {family.kabupaten}</p></div><div className="jm-kk-number"><span>Nomor KK <Icon name="lock" size={12} /></span><strong>{family.no_kk}</strong></div></section>
          <section className="jm-panel jm-family-panel"><div className="jm-family-title"><div><h3>Daftar anggota keluarga <span>{relatives.length}</span></h3><p>Pilih anggota untuk melihat atau memperbarui profilnya.</p></div><span className="jm-readonly-badge">Dalam satu KK</span></div><div className="jm-search-row"><label className="jm-search"><Icon name="search" size={18} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama atau NIK anggota keluarga" aria-label="Cari anggota keluarga" /></label><select aria-label="Filter status anggota keluarga" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="Semua">Semua status</option><option>Aktif</option><option>Pasif</option></select></div><div className="jm-family-list">{filtered.map((item) => <button type="button" className="jm-family-row" key={item.id} onClick={() => navigate('profile', item.id)}><Avatar member={item} /><div><strong>{item.nama_lengkap} {item.id === actorId && <small>Saya</small>}</strong><span>{item.jenis_kelamin} · {ageFromDate(item.tgl_lhr)} · {item.id}</span></div><span className={`jm-status${item.gerejawi.status_keaktifan === 'Pasif' ? ' jm-status-passive' : ''}`}>{item.gerejawi.status_keaktifan}</span><Icon name="arrow" size={18} /></button>)}{!filtered.length && <div className="jm-empty"><Icon name="search" size={28} /><strong>Anggota tidak ditemukan</strong><p>Coba nama atau status yang berbeda.</p></div>}</div></section>
          <p className="jm-family-note"><Icon name="info" size={16} /> Untuk perubahan nomor KK atau penambahan anggota, hubungi administrator gereja.</p>
        </> : <>
          {!self && <button type="button" className="jm-back-button" onClick={() => navigate('family')}><Icon name="back" size={16} /> Kembali ke anggota keluarga</button>}
          <div className="jm-profile-layout">
            <aside className="jm-profile-overview"><MemberCard member={member} family={family} self={self} /><div className="jm-panel jm-member-picker"><label htmlFor="jm-member-select">Profil yang ditampilkan</label><select id="jm-member-select" value={selectedId} onChange={(event) => navigate('profile', event.target.value)}>{relatives.map((item) => <option key={item.id} value={item.id}>{item.nama_lengkap}{item.id === actorId ? ' (Saya)' : ''}</option>)}</select><span><Icon name="family" size={15} /> {relatives.length} anggota dalam satu KK</span></div><div className="jm-security-note"><Icon name="lock" size={21} /><div><strong>Identitas utama terkunci</strong><p>ID, NIK, nomor KK, dan wilayah tidak dapat diubah oleh jemaat. Hubungi administrator jika ada koreksi.</p></div></div></aside>
            <div className="jm-profile-details">
              <section className="jm-panel jm-photo-panel"><Avatar member={member} large /><div><h3>Foto profil jemaat</h3><p>Gunakan foto terbaru agar mudah dikenali.</p><label className={`jm-photo-upload${editing ? ' disabled' : ''}`}><Icon name="upload" size={14} /> Perbarui foto<input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto} disabled={Boolean(editing)} aria-label={`Perbarui foto ${member.nama_lengkap}`} /></label><small>JPG, PNG, atau WebP · maksimal 2 MB</small></div></section>
              <section className="jm-panel jm-identity-panel" aria-label="Identitas terkunci"><LockedField label="Nomor ID" value={member.id} /><LockedField label="NIK" value={member.nik} /><LockedField label="Nomor KK" value={member.no_kk} /><LockedField label="Wilayah" value={member.nama_wilayah} /></section>
              {profileSections.map((section) => <ProfileSection key={section.id} section={section} record={section.family ? family : member} editing={editing === section.id} draft={draft} error={editing === section.id ? error : ''} editDisabled={Boolean(editing)} onEdit={() => beginEdit(section)} onChange={(event) => { const { name, value } = event.target; setDraft((current) => ({ ...current, [name]: value })); setError('') }} onSave={save} onCancel={() => { setEditing(null); setError('') }} />)}
              <ReadOnlyRecords member={member} />
              <p className="jm-profile-footer"><Icon name="check" size={15} /> Jemaat hanya dapat melihat dan memperbarui data. Tidak tersedia aksi tambah atau hapus.</p>
            </div>
          </div>
        </>}
      </main>
      <footer className="jm-app-footer">GKJ Kotagede Yogyakarta <span>Portal mandiri jemaat</span></footer>
    </div>
    {notice && <div className="jm-toast" role="status"><Icon name="info" size={18} />{notice}<button type="button" onClick={() => setNotice('')} aria-label="Tutup pemberitahuan">×</button></div>}
  </div>
}
