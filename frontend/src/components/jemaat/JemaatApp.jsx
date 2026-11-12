import { useEffect, useRef, useState } from 'react'
import logo from '../../assets/logo_gkjkg.jpg'
import {
  ageFromDate, authenticateDemo, createDemoData, datePassword, familyMembers,
  formatDate, getValue, localCalendarDate,
  updateMemberPhoto, updateMemberSection,
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
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm0 3 8 5 8-5',
  blood: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z',
  location: 'M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z',
  calendar: 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-7 1v4M7 3v4M17 3v4M3 10h18',
  card: 'M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 4h18M7 15h4',
  arrow: 'm9 5 7 7-7 7',
  back: 'm15 5-7 7 7 7M8 12h13',
  check: 'm5 12 4 4L19 6',
  logout: 'M9 3H3v18h6M10 12h11m-4-4 4 4-4 4',
  search: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 6 6',
  info: 'M12 11v6M12 7h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  upload: 'M12 16V3m-4 4 4-4 4 4M4 16v5h16v-5',
  document: 'M14 2H4v20h16V8l-6-6Zm0 0v6h6M8 12h8M8 16h8',
}

export function Icon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={iconPaths[name] || iconPaths.info} />
    </svg>
  )
}

function Avatar({ member, large = false }) {
  return (
    <span className={`jkn-avatar${large ? ' jkn-avatar-lg' : ''}`}>
      {member.foto ? (
        <img src={member.foto} alt={`Foto ${member.nama_lengkap}`} />
      ) : (
        member.nama_lengkap.split(' ').slice(0, 2).map((n) => n[0]).join('')
      )}
    </span>
  )
}

export function LoginPage({ onLogin, onDemo, error }) {
  const [nik, setNik] = useState('')
  const [password, setPassword] = useState('')

  return (
    <main className="jkn-login-screen">
      <div className="jkn-login-box">
        <img className="jkn-login-logo" src={logo} alt="GKJ Kotagede" />
        <span className="jkn-login-badge">SISTEM INFORMASI DATA JEMAAT</span>
        <h1>Selamat datang, Jemaat</h1>
        <p className="jkn-login-sub">Masuk untuk melihat profil pribadi dan memperbarui data anggota keluarga.</p>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(nik, password) }}>
          <label className="jkn-field">
            <span>Nomor Induk Keanggotaan (NIK)</span>
            <input
              name="username"
              inputMode="numeric"
              autoComplete="username"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              placeholder="Masukkan NIK Anda"
              required
            />
          </label>

          <label className="jkn-field">
            <span>Kata sandi · Tanggal lahir</span>
            <input
              name="password"
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="DDMMYYYY (contoh: 12051992)"
              minLength={8}
              maxLength={8}
              required
            />
          </label>
          <p className="jkn-login-help">Gunakan tanggal lahir dengan format hari, bulan, tahun (DDMMYYYY).</p>

          {error && <p role="alert" className="jkn-alert-error">{error}</p>}

          <button className="jkn-btn-primary jkn-btn-block" type="submit">
            Masuk ke Web Portal Jemaat <Icon name="arrow" size={16} />
          </button>
        </form>

        <div className="jkn-demo-card">
          <strong>Mode Uji Coba · Data Contoh</strong>
          <p>Belum terhubung ke autentikasi server. Klik tombol di bawah untuk mengisi akun contoh secara otomatis:</p>
          <button
            className="jkn-btn-demo jkn-btn-block"
            type="button"
            onClick={() => {
              const ex = onDemo()
              setNik(ex.nik)
              setPassword(datePassword(ex.tgl_lhr))
            }}
          >
            Gunakan Akun Contoh Jemaat (Otomatis)
          </button>
        </div>

        <p className="jkn-login-secure">
          <Icon name="lock" size={13} /> Akses khusus profil pribadi dan anggota keluarga dalam 1 KK (Read &amp; Update Only)
        </p>
      </div>
    </main>
  )
}

export function MemberCard({ member, family, self }) {
  return (
    <section className="jkn-digital-card" aria-label="Kartu jemaat digital">
      <div className="jkn-card-watermark" aria-hidden="true" />
      <div className="jkn-card-head">
        <div className="jkn-card-logo-wrap">
          <img src={logo} alt="" className="jkn-card-logo" />
          <div>
            <strong>GKJ KOTAGEDE</strong>
            <span>Gereja Kristen Jawa · Yogyakarta</span>
          </div>
        </div>
        <div className="jkn-card-symbol">
          <Icon name="church" size={24} />
        </div>
      </div>

      <div className="jkn-card-label">KARTU JEMAAT DIGITAL</div>

      <div className="jkn-card-nik">
        <span className="jkn-card-caption">Nomor anggota · NIK</span>
        <strong>{member.nik || member.id}</strong>
      </div>

      <div className="jkn-card-name-row">
        <div>
          <span className="jkn-card-caption">NAMA LENGKAP</span>
          <h2>{member.nama_lengkap}</h2>
        </div>
        <div className="jkn-card-right">
          <span className="jkn-card-caption">WILAYAH</span>
          <p className="jkn-card-wilayah">{member.nama_wilayah || 'Wilayah 1'}</p>
        </div>
      </div>

      <div className="jkn-card-footer">
        <span className="jkn-badge-active">
          <span className="jkn-dot-active" /> {member.gerejawi?.status_keaktifan || 'Aktif'}
        </span>
        <span className="jkn-card-meta-text">
          {self ? 'Profil saya' : 'Anggota keluarga'} {family?.nama_kepala_keluarga ? `· Kel. ${family.nama_kepala_keluarga}` : ''}
        </span>
      </div>
    </section>
  )
}

export function ProfileSection({ section, record, editing, draft, error, onEdit, onChange, onSave, onCancel, editDisabled }) {
  const heading = `section-${section.id}`
  const [today] = useState(localCalendarDate)

  return (
    <section className={`jkn-section-panel${editing ? ' editing' : ''}`} aria-labelledby={heading}>
      <header className="jkn-section-head">
        <div className="jkn-section-icon">
          <Icon name={section.icon} />
        </div>
        <div>
          <h3 id={heading}>{section.title}</h3>
          <p>{section.subtitle}</p>
        </div>
        {!editing && (
          <button className="jkn-btn-edit" type="button" onClick={onEdit} disabled={editDisabled} aria-label={`Ubah ${section.title}`}>
            <Icon name="edit" size={14} /> <span>Ubah</span>
          </button>
        )}
      </header>

      {editing ? (
        <form onSubmit={onSave} className="jkn-edit-form">
          <div className="jkn-edit-grid">
            {section.fields.map((field) => (
              <label key={field.key} className={`jkn-field${field.wide ? ' wide' : ''}`}>
                <span>{field.label}{field.required && <b className="jkn-req"> *</b>}</span>
                {field.options ? (
                  <select name={field.key} value={draft[field.key] ?? ''} onChange={onChange}>
                    {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    name={field.key}
                    type={field.type || 'text'}
                    value={draft[field.key] ?? ''}
                    onChange={onChange}
                    required={field.required}
                    min={field.type === 'date' ? '1900-01-01' : undefined}
                    max={field.type === 'date' ? today : undefined}
                  />
                )}
              </label>
            ))}
          </div>
          {error && <p className="jkn-alert-error" role="alert">{error}</p>}
          <div className="jkn-edit-actions">
            <span className="jkn-locked-hint"><Icon name="lock" size={13} /> ID &amp; NIK tetap terkunci</span>
            <button type="button" className="jkn-btn-secondary" onClick={onCancel}>Batal</button>
            <button type="submit" className="jkn-btn-primary"><Icon name="check" size={14} /> Simpan perubahan</button>
          </div>
        </form>
      ) : (
        <dl className="jkn-dl-grid">
          {section.fields.map((field) => (
            <div key={field.key} className={field.wide ? 'wide' : ''}>
              <dt>{field.label}</dt>
              <dd>{getValue(record, field.key) ? (field.type === 'date' ? formatDate(getValue(record, field.key)) : getValue(record, field.key)) : 'Belum diisi'}</dd>
            </div>
          ))}
          {section.id === 'identitas' && (
            <div>
              <dt>Usia</dt>
              <dd>{ageFromDate(record.tgl_lhr)}</dd>
            </div>
          )}
        </dl>
      )}
    </section>
  )
}

export function ReadOnlyRecords({ member }) {
  return (
    <section className="jkn-section-panel jkn-readonly-panel">
      <header className="jkn-section-head">
        <div className="jkn-section-icon">
          <Icon name="document" />
        </div>
        <div>
          <h3>Catatan keanggotaan</h3>
          <p>Data pelayanan dan dokumen tercatat oleh gereja</p>
        </div>
        <span className="jkn-pill-readonly">Hanya baca</span>
      </header>

      <div className="jkn-readonly-content">
        <div className="jkn-record-block">
          <h4>Riwayat pelayanan</h4>
          {member.riwayat_pelayanan?.length ? (
            <ul>
              {member.riwayat_pelayanan.map((item) => (
                <li key={item.id_pelayanan}>
                  <strong>{item.nama_pelayanan}</strong>
                  <span>{item.thn_mulai} – {item.thn_berakhir || 'sekarang'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Belum ada riwayat pelayanan.</p>
          )}
        </div>

        <div className="jkn-record-block">
          <h4>Dokumen</h4>
          {member.dokumen?.length ? (
            <ul>
              {member.dokumen.map((item) => (
                <li key={item.id_dokumen}>
                  <strong>{item.jenis_dokumen}</strong>
                  <span>{item.file_path}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Belum ada dokumen terdaftar.</p>
          )}
        </div>

        <div className="jkn-record-block">
          <h4>Persembahan bulanan</h4>
          {member.persembahan_bulanan?.length ? (
            <ul>
              {member.persembahan_bulanan.slice(-4).map((item) => (
                <li key={item.id_persembahan}>
                  <strong>Bulan {item.bulan}/{item.tahun} · {item.status_byr}</strong>
                  <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.jml_nominal)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Belum ada catatan persembahan.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default function JemaatApp() {
  const [data, setData] = useState(createDemoData)
  const [actorId, setActorId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [activeTab, setActiveTab] = useState('peserta') // 'peserta' (Profil) | 'kk' (Nomor Kartu Keluarga)
  const [loginError, setLoginError] = useState('')
  const [notice, setNotice] = useState('')

  // Modal edit per-baris (Gaya JKN Mobile dalam Dialog Web Modern)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTarget, setModalTarget] = useState({ key: '', label: '', value: '', type: 'text', options: null, isFamily: false })
  const [modalError, setModalError] = useState('')

  const actorRef = useRef(null)
  const actor = data.members.find((m) => m.id === actorId)
  const relatives = familyMembers(data.members, actor)
  const member = relatives.find((item) => item.id === selectedId) || actor
  const family = member && data.families.find((item) => item.no_kk === member.no_kk)

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(''), 4500)
    return () => clearTimeout(timer)
  }, [notice])

  function handleLogin(nik, password) {
    const user = authenticateDemo(data.members, nik, password)
    if (!user) {
      setLoginError('NIK atau tanggal lahir tidak sesuai. Format password: DDMMYYYY (contoh: 12051992).')
      return
    }
    actorRef.current = user.id
    setActorId(user.id)
    setSelectedId(user.id)
    setLoginError('')
    setActiveTab('peserta')
    setNotice(`Selamat datang, ${user.nama_lengkap.split(' ')[0]}!`)
  }

  function handleLogout() {
    actorRef.current = null
    setActorId(null)
    setSelectedId(null)
    setModalOpen(false)
    setNotice('')
  }

  function handleSwitchMember(nikTarget) {
    const target = relatives.find((item) => item.nik === nikTarget || item.id === nikTarget)
    if (target) {
      setSelectedId(target.id)
      setActiveTab('peserta')
    }
  }

  function openEditModal(key, label, currentValue, type = 'text', options = null, isFamily = false) {
    if (key === 'nik' || key === 'id' || key === 'no_kk' || key === 'id_wil') {
      setNotice('Field ini bersifat tetap dan dilindungi oleh sistem gereja (Terkunci).')
      return
    }
    setModalTarget({ key, label, value: currentValue ?? '', type, options, isFamily })
    setModalError('')
    setModalOpen(true)
  }

  function handleSaveModal(e) {
    e.preventDefault()
    try {
      const sectionId = modalTarget.isFamily
        ? 'keluarga'
        : modalTarget.key.startsWith('gerejawi.')
        ? 'gerejawi'
        : modalTarget.key.startsWith('pendidikan.')
        ? 'pendidikan'
        : modalTarget.key.startsWith('pekerjaan.')
        ? 'pekerjaan'
        : modalTarget.key.startsWith('user.') || modalTarget.key === 'no_whatsapp'
        ? 'kontak'
        : 'identitas'

      const draft = { [modalTarget.key]: modalTarget.value }
      const updated = updateMemberSection(data, actorId, selectedId, sectionId, draft)
      setData(updated)
      setModalOpen(false)
      setNotice(`Data ${modalTarget.label} berhasil diperbarui.`)
    } catch (err) {
      setModalError(err.message)
    }
  }

  function handleUploadPhoto(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setNotice('Foto harus JPG, PNG, atau WebP maksimal 2 MB.')
      return
    }
    const currentActor = actorId
    const currentTarget = selectedId
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        if (actorRef.current !== currentActor) return
        setData((curr) => updateMemberPhoto(curr, currentActor, currentTarget, String(reader.result)))
        setNotice('Foto profil berhasil diperbarui.')
      }
      img.onerror = () => setNotice('File gambar tidak valid.')
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  }

  if (!actor) {
    return <LoginPage onLogin={handleLogin} onDemo={() => data.members[0]} error={loginError} />
  }

  const isSelf = member.id === actorId

  return (
    <div className="jkn-web-root">

      {/* ========================================================= */}
      {/* 1. TOP WEB NAVBAR (DESKTOP WEB HEADER)                    */}
      {/* ========================================================= */}
      <header className="jkn-web-navbar">
        <div className="jkn-nav-container">
          <div className="jkn-nav-brand">
            <img src={logo} alt="GKJ Kotagede" className="jkn-nav-logo" />
            <div className="jkn-nav-brand-text">
              <span className="jkn-brand-title">GKJ KOTAGEDE</span>
              <span className="jkn-brand-sub">Sistem Informasi Data Jemaat</span>
            </div>
          </div>

          <nav className="jkn-nav-tabs" aria-label="Navigasi Utama">
            <button
              type="button"
              className={`jkn-nav-tab-btn ${activeTab === 'peserta' ? 'active' : ''}`}
              onClick={() => setActiveTab('peserta')}
            >
              <Icon name="person" size={16} />
              <span>Kepesertaan Terdaftar (Profil)</span>
            </button>
            <button
              type="button"
              className={`jkn-nav-tab-btn ${activeTab === 'kk' ? 'active' : ''}`}
              onClick={() => setActiveTab('kk')}
            >
              <Icon name="family" size={16} />
              <span>Nomor Kartu Keluarga ({relatives.length})</span>
            </button>
          </nav>

          <div className="jkn-nav-user">
            <Avatar member={actor} />
            <div className="jkn-nav-user-info">
              <strong className="jkn-nav-user-name">{actor.nama_lengkap}</strong>
              <span className="jkn-nav-user-role">Warga Jemaat</span>
            </div>
            <button type="button" className="jkn-btn-logout-web" onClick={handleLogout} title="Keluar dari akun">
              <Icon name="logout" size={16} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MAIN WEB CONTAINER (GRID DESKTOP WEB)                  */}
      {/* ========================================================= */}
      <main className="jkn-web-container">

        {/* TOAST NOTIFIKASI */}
        {notice && (
          <div className="jkn-web-toast" role="status">
            <Icon name="info" size={18} />
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice('')}>×</button>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE 1: KEPESERTAAN TERDAFTAR (PROFIL JEMAAT & SWITCHER)  */}
        {/* ========================================================= */}
        {activeTab === 'peserta' && (
          <div className="jkn-profile-grid">

            {/* KOLOM KIRI (SIDEBAR): KARTU DIGITAL & PEMILIH KELUARGA */}
            <aside className="jkn-profile-sidebar">
              {/* KARTU JEMAAT DIGITAL (HIJAU EMERALD JKN) */}
              <MemberCard member={member} family={family} self={isSelf} />

              {/* PEMILIH ANGGOTA KELUARGA 1 KK */}
              <div className="jkn-sidebar-card">
                <div className="jkn-sidebar-card-head">
                  <Icon name="family" size={16} />
                  <h3>Anggota Keluarga (1 KK)</h3>
                </div>
                <p className="jkn-sidebar-desc">
                  Pilih anggota keluarga untuk melihat dan memperbarui profilnya:
                </p>

                <div className="jkn-family-select-wrap">
                  <select
                    className="jkn-web-select"
                    value={member.nik}
                    onChange={(e) => handleSwitchMember(e.target.value)}
                  >
                    {relatives.map((item) => (
                      <option key={item.id} value={item.nik}>
                        {item.nama_lengkap} {item.id === actorId ? '(Saya)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="jkn-family-quick-list">
                  {relatives.map((item) => {
                    const isCurrent = item.id === member.id
                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`jkn-family-pill-btn ${isCurrent ? 'active' : ''}`}
                        onClick={() => handleSwitchMember(item.nik)}
                      >
                        <Avatar member={item} />
                        <div className="jkn-pill-info">
                          <strong>{item.nama_lengkap}</strong>
                          <span>{item.jenis_kelamin} · {ageFromDate(item.tgl_lhr)}</span>
                        </div>
                        {isCurrent ? (
                          <span className="jkn-pill-status active">Aktif</span>
                        ) : (
                          <span className="jkn-pill-status">Pilih ›</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* FOTO PROFIL */}
              <div className="jkn-sidebar-card">
                <div className="jkn-sidebar-card-head">
                  <Icon name="person" size={16} />
                  <h3>Foto Profil: {member.nama_lengkap.split(' ')[0]}</h3>
                </div>
                <div className="jkn-photo-web-box">
                  <Avatar member={member} large />
                  <div className="jkn-photo-web-actions">
                    <span className="jkn-photo-sub">Format JPG, PNG, atau WebP (Maksimal 2 MB)</span>
                    <label className="jkn-btn-upload-web">
                      <Icon name="upload" size={14} /> Ganti Foto Profil
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUploadPhoto} />
                    </label>
                  </div>
                </div>
              </div>

              {/* HAK AKSES NOTE */}
              <div className="jkn-access-info-card">
                <Icon name="lock" size={16} />
                <div>
                  <strong>Hak Akses Jemaat</strong>
                  <p>Hanya Read &amp; Update untuk diri sendiri dan anggota keluarga 1 KK. Field ID dan NIK dikunci permanen.</p>
                </div>
              </div>
            </aside>

            {/* KOLOM KANAN: DETAIL PROFIL LENGKAP & TERSTRUKTUR */}
            <section className="jkn-profile-main">
              {/* HEADER PROFIL */}
              <div className="jkn-main-banner">
                <div>
                  <span className="jkn-badge-view-status">
                    {isSelf ? 'Profil Pribadi Saya' : `Anggota Keluarga · Kel. ${family?.nama_kepala_keluarga || ''}`}
                  </span>
                  <h2>{member.nama_lengkap}</h2>
                  <p>Nomor Kartu Keluarga: <strong>{family?.no_kk || '-'}</strong> · Wilayah: <strong>{member.nama_wilayah || 'Wilayah 1'}</strong></p>
                </div>
                <div className="jkn-main-banner-badge">
                  <span className="jkn-dot-active" /> {member.gerejawi?.status_keaktifan || 'Aktif'}
                </div>
              </div>

              {/* GROUP 1: IDENTITAS PRIBADI */}
              <div className="jkn-web-section-panel">
                <div className="jkn-section-header-bar">
                  <div className="jkn-section-title-wrap">
                    <div className="jkn-sec-icon"><Icon name="person" /></div>
                    <div>
                      <h3>Identitas Pribadi</h3>
                      <span>Data kependudukan &amp; keanggotaan warga jemaat</span>
                    </div>
                  </div>
                </div>

                <div className="jkn-row-list">
                  {/* NIK (Terkunci) */}
                  <div className="jkn-web-row jkn-row-locked" onClick={() => openEditModal('nik', 'NIK', member.nik)}>
                    <div className="jkn-row-icon"><Icon name="card" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Nomor Induk Keanggotaan (NIK)</span>
                      <strong className="jkn-row-val jkn-red">{member.nik}</strong>
                    </div>
                    <span className="jkn-tag-locked"><Icon name="lock" size={12} /> ID/NIK Terkunci</span>
                  </div>

                  {/* Status Jemaat */}
                  <div className="jkn-web-row" onClick={() => openEditModal('status_jemaat', 'Status Jemaat', member.status_jemaat, 'select', ['Warga jemaat', 'Simpatisan'])}>
                    <div className="jkn-row-icon"><Icon name="church" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Status Jemaat</span>
                      <strong className="jkn-row-val jkn-red">{member.status_jemaat?.toUpperCase() || 'WARGA JEMAAT'}</strong>
                    </div>
                    <span className="jkn-btn-row-edit">Ubah ›</span>
                  </div>

                  {/* Jenis Kelamin */}
                  <div className="jkn-web-row" onClick={() => openEditModal('jenis_kelamin', 'Jenis Kelamin', member.jenis_kelamin, 'select', ['Laki-laki', 'Perempuan'])}>
                    <div className="jkn-row-icon"><Icon name="person" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Jenis Kelamin</span>
                      <strong className="jkn-row-val">{member.jenis_kelamin || 'Belum diisi'}</strong>
                    </div>
                    <span className="jkn-btn-row-edit">Ubah ›</span>
                  </div>

                  {/* Tempat Lahir */}
                  <div className="jkn-web-row" onClick={() => openEditModal('tmpt_lhr', 'Tempat Lahir', member.tmpt_lhr)}>
                    <div className="jkn-row-icon"><Icon name="location" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Tempat Lahir</span>
                      <strong className="jkn-row-val">{member.tmpt_lhr || 'Belum diisi'}</strong>
                    </div>
                    <span className="jkn-btn-row-edit">Ubah ›</span>
                  </div>

                  {/* Tanggal Lahir & Usia */}
                  <div className="jkn-web-row" onClick={() => openEditModal('tgl_lhr', 'Tanggal Lahir', member.tgl_lhr, 'date')}>
                    <div className="jkn-row-icon"><Icon name="calendar" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Tanggal Lahir &amp; Usia (Dihitung Otomatis)</span>
                      <strong className="jkn-row-val">{formatDate(member.tgl_lhr)} ({ageFromDate(member.tgl_lhr)})</strong>
                    </div>
                    <span className="jkn-btn-row-edit">Ubah ›</span>
                  </div>

                  {/* Golongan Darah */}
                  <div className="jkn-web-row" onClick={() => openEditModal('gol_darah', 'Golongan Darah', member.gol_darah, 'select', ['Belum diketahui', 'A', 'B', 'AB', 'O'])}>
                    <div className="jkn-row-icon"><Icon name="blood" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Golongan Darah</span>
                      <strong className="jkn-row-val jkn-red">{member.gol_darah || 'Belum diketahui'}</strong>
                    </div>
                    <span className="jkn-btn-row-edit">Ubah ›</span>
                  </div>
                </div>
              </div>

              {/* GROUP 2: KONTAK & KOMUNIKASI */}
              <div className="jkn-web-section-panel">
                <div className="jkn-section-header-bar">
                  <div className="jkn-section-title-wrap">
                    <div className="jkn-sec-icon"><Icon name="phone" /></div>
                    <div>
                      <h3>Kontak &amp; Komunikasi</h3>
                      <span>Saluran komunikasi jemaat dengan gereja</span>
                    </div>
                  </div>
                </div>

                <div className="jkn-row-list">
                  {/* WhatsApp */}
                  <div className="jkn-web-row" onClick={() => openEditModal('no_whatsapp', 'Nomor Handphone / WhatsApp', member.no_whatsapp, 'tel')}>
                    <div className="jkn-row-icon"><Icon name="phone" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Nomor Handphone / WhatsApp</span>
                      <strong className="jkn-row-val jkn-red">{member.no_whatsapp || 'Belum diisi'}</strong>
                    </div>
                    <span className="jkn-btn-row-edit">Ubah ›</span>
                  </div>

                  {/* Email */}
                  <div className="jkn-web-row" onClick={() => openEditModal('user.email', 'Email', member.user?.email, 'email')}>
                    <div className="jkn-row-icon"><Icon name="mail" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Alamat Email</span>
                      <strong className="jkn-row-val jkn-red">{member.user?.email || 'Belum diisi'}</strong>
                    </div>
                    <span className="jkn-btn-row-edit">Ubah ›</span>
                  </div>
                </div>
              </div>

              {/* GROUP 3: ALAMAT KELUARGA (1 KK) */}
              <div className="jkn-web-section-panel">
                <div className="jkn-section-header-bar">
                  <div className="jkn-section-title-wrap">
                    <div className="jkn-sec-icon"><Icon name="home" /></div>
                    <div>
                      <h3>Alamat Surat &amp; Domisili Keluarga</h3>
                      <span>Berlaku untuk seluruh anggota dalam 1 Kartu Keluarga (KK)</span>
                    </div>
                  </div>
                </div>

                <div className="jkn-row-list">
                  {/* Alamat Surat */}
                  <div className="jkn-web-row" onClick={() => openEditModal('alamat', 'Alamat Surat', family?.alamat, 'text', null, true)}>
                    <div className="jkn-row-icon"><Icon name="home" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Alamat Surat (Keluarga)</span>
                      <strong className="jkn-row-val jkn-red">{family?.alamat || 'Belum diisi'}</strong>
                      <span className="jkn-row-sub">
                        RT {family?.rt || '-'}/RW {family?.rw || '-'}, {family?.desa || '-'}, {family?.kecamatan || '-'}, {family?.kabupaten || '-'} {family?.kode_pos || ''}
                      </span>
                    </div>
                    <span className="jkn-btn-row-edit">Ubah ›</span>
                  </div>

                  {/* RT / RW */}
                  <div className="jkn-web-row" onClick={() => openEditModal('rt', 'RT', family?.rt, 'text', null, true)}>
                    <div className="jkn-row-icon"><Icon name="location" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">RT / RW</span>
                      <strong className="jkn-row-val">RT {family?.rt || '-'} / RW {family?.rw || '-'}</strong>
                    </div>
                    <span className="jkn-btn-row-edit">Ubah ›</span>
                  </div>

                  {/* Wilayah Administratif */}
                  <div className="jkn-web-row" onClick={() => openEditModal('desa', 'Desa / Kelurahan', family?.desa, 'text', null, true)}>
                    <div className="jkn-row-icon"><Icon name="location" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Kelurahan &amp; Kecamatan</span>
                      <strong className="jkn-row-val">{family?.desa || '-'}, Kec. {family?.kecamatan || '-'} ({family?.kabupaten || '-'})</strong>
                    </div>
                    <span className="jkn-btn-row-edit">Ubah ›</span>
                  </div>
                </div>
              </div>

              {/* GROUP 4: DATA GEREJAWI GKJ */}
              <div className="jkn-web-section-panel">
                <div className="jkn-section-header-bar">
                  <div className="jkn-section-title-wrap">
                    <div className="jkn-sec-icon"><Icon name="church" /></div>
                    <div>
                      <h3>Data Gerejawi GKJ Kotagede</h3>
                      <span>Wilayah pelayanan, sakramen baptis, sidi, dan pernikahan</span>
                    </div>
                  </div>
                </div>

                <div className="jkn-row-list">
                  {/* Wilayah Pelayanan (Terkunci) */}
                  <div className="jkn-web-row jkn-row-locked" onClick={() => openEditModal('id_wil', 'Wilayah Pelayanan', member.nama_wilayah)}>
                    <div className="jkn-row-icon"><Icon name="church" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Wilayah Pelayanan Gereja</span>
                      <strong className="jkn-row-val">{member.nama_wilayah || 'Wilayah 1'}</strong>
                    </div>
                    <span className="jkn-tag-locked"><Icon name="lock" size={12} /> Tetap / Terkunci</span>
                  </div>

                  {/* Status Baptis */}
                  <div className="jkn-web-row" onClick={() => openEditModal('gerejawi.status_baptis', 'Status Baptis', member.gerejawi?.status_baptis, 'select', ['Sudah', 'Belum'])}>
                    <div className="jkn-row-icon"><Icon name="church" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Status Baptis</span>
                      <strong className="jkn-row-val">{member.gerejawi?.status_baptis || 'Belum'} {member.gerejawi?.tgl_baptis ? `(${formatDate(member.gerejawi.tgl_baptis)})` : ''}</strong>
                    </div>
                    <span className="jkn-btn-row-edit">Ubah ›</span>
                  </div>

                  {/* Status Sidi */}
                  <div className="jkn-web-row" onClick={() => openEditModal('gerejawi.status_sidi', 'Status Sidi', member.gerejawi?.status_sidi, 'select', ['Sudah', 'Belum'])}>
                    <div className="jkn-row-icon"><Icon name="church" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Status Sidi</span>
                      <strong className="jkn-row-val">{member.gerejawi?.status_sidi || 'Belum'} {member.gerejawi?.tgl_sidi ? `(${formatDate(member.gerejawi.tgl_sidi)})` : ''}</strong>
                    </div>
                    <span className="jkn-btn-row-edit">Ubah ›</span>
                  </div>

                  {/* Status Pernikahan */}
                  <div className="jkn-web-row" onClick={() => openEditModal('gerejawi.status_pernikahan', 'Status Pernikahan', member.gerejawi?.status_pernikahan, 'select', ['Belum menikah', 'Menikah', 'Cerai hidup', 'Cerai mati'])}>
                    <div className="jkn-row-icon"><Icon name="family" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Status Pernikahan</span>
                      <strong className="jkn-row-val">{member.gerejawi?.status_pernikahan || 'Belum menikah'} {member.gerejawi?.tgl_pernikahan ? `(${formatDate(member.gerejawi.tgl_pernikahan)})` : ''}</strong>
                    </div>
                    <span className="jkn-btn-row-edit">Ubah ›</span>
                  </div>
                </div>
              </div>

              {/* GROUP 5: PENDIDIKAN & PEKERJAAN */}
              <div className="jkn-web-section-panel">
                <div className="jkn-section-header-bar">
                  <div className="jkn-section-title-wrap">
                    <div className="jkn-sec-icon"><Icon name="book" /></div>
                    <div>
                      <h3>Pendidikan &amp; Pekerjaan</h3>
                      <span>Latar belakang pendidikan dan profesi jemaat</span>
                    </div>
                  </div>
                </div>

                <div className="jkn-row-list">
                  {/* Pendidikan */}
                  <div className="jkn-web-row" onClick={() => openEditModal('pendidikan.pendidikan_terakhir', 'Pendidikan Terakhir', member.pendidikan?.pendidikan_terakhir, 'select', ['Belum sekolah', 'SD', 'SMP', 'SMA / SMK', 'D1', 'D2', 'D3', 'D4 / S1', 'S2', 'S3'])}>
                    <div className="jkn-row-icon"><Icon name="book" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Pendidikan Terakhir</span>
                      <strong className="jkn-row-val">{member.pendidikan?.pendidikan_terakhir || 'Belum diisi'} {member.pendidikan?.nama_sekolah ? `· ${member.pendidikan.nama_sekolah}` : ''}</strong>
                    </div>
                    <span className="jkn-btn-row-edit">Ubah ›</span>
                  </div>

                  {/* Pekerjaan */}
                  <div className="jkn-web-row" onClick={() => openEditModal('pekerjaan.pekerjaan', 'Pekerjaan', member.pekerjaan?.pekerjaan)}>
                    <div className="jkn-row-icon"><Icon name="work" /></div>
                    <div className="jkn-row-body">
                      <span className="jkn-row-label">Pekerjaan &amp; Profesi</span>
                      <strong className="jkn-row-val">{member.pekerjaan?.pekerjaan || 'Belum diisi'} {member.pekerjaan?.instansi ? `(${member.pekerjaan.instansi})` : ''}</strong>
                    </div>
                    <span className="jkn-btn-row-edit">Ubah ›</span>
                  </div>
                </div>
              </div>

            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE 2: NOMOR KARTU KELUARGA (FULL WIDTH DESKTOP WEB)     */}
        {/* ========================================================= */}
        {activeTab === 'kk' && (
          <div className="jkn-kk-web-layout">
            {/* KK HERO BANNER */}
            <div className="jkn-kk-web-banner">
              <div className="jkn-kk-banner-left">
                <div className="jkn-kk-big-icon"><Icon name="home" size={28} /></div>
                <div>
                  <span className="jkn-kk-pill-label">KARTU KELUARGA (KK)</span>
                  <h2>Keluarga {family?.nama_kepala_keluarga}</h2>
                  <p className="jkn-kk-addr">
                    {family?.alamat}, RT {family?.rt}/RW {family?.rw}, {family?.desa}, {family?.kecamatan}, {family?.kabupaten} {family?.kode_pos}
                  </p>
                </div>
              </div>

              <div className="jkn-kk-banner-right">
                <span className="jkn-kk-num-title"><Icon name="lock" size={13} /> Nomor Kartu Keluarga (Terkunci)</span>
                <strong className="jkn-kk-num-val">{family?.no_kk}</strong>
              </div>
            </div>

            {/* DAFTAR ANGGOTA KELUARGA (GRID CARD) */}
            <div className="jkn-kk-members-section">
              <div className="jkn-kk-section-header">
                <div>
                  <h3>Daftar Anggota Keluarga Terdaftar ({relatives.length} Orang)</h3>
                  <p>Klik tombol pada anggota keluarga di bawah ini untuk melihat detail dan memperbarui data profil mereka:</p>
                </div>
              </div>

              <div className="jkn-kk-cards-grid">
                {relatives.map((item) => {
                  const isActor = item.id === actorId
                  const isSelected = item.id === member.id
                  return (
                    <div key={item.id} className={`jkn-family-card-web ${isSelected ? 'selected' : ''}`}>
                      <div className="jkn-fam-card-head">
                        <Avatar member={item} large />
                        <div className="jkn-fam-card-head-info">
                          <h4>{item.nama_lengkap}</h4>
                          <div className="jkn-fam-badges">
                            {isActor && <span className="jkn-badge-me">Saya</span>}
                            <span className="jkn-badge-gender">{item.jenis_kelamin}</span>
                            <span className="jkn-badge-age">{ageFromDate(item.tgl_lhr)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="jkn-fam-card-body">
                        <div className="jkn-fam-prop">
                          <span>NIK</span>
                          <strong>{item.nik}</strong>
                        </div>
                        <div className="jkn-fam-prop">
                          <span>Status Jemaat</span>
                          <strong>{item.status_jemaat}</strong>
                        </div>
                        <div className="jkn-fam-prop">
                          <span>Baptis / Sidi</span>
                          <strong>{item.gerejawi?.status_baptis || 'Belum'} / {item.gerejawi?.status_sidi || 'Belum'}</strong>
                        </div>
                      </div>

                      <div className="jkn-fam-card-footer">
                        <button
                          type="button"
                          className="jkn-btn-view-member"
                          onClick={() => {
                            setSelectedId(item.id)
                            setActiveTab('peserta')
                          }}
                        >
                          Lihat &amp; Perbarui Profil ›
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="jkn-kk-footer-info">
              <Icon name="info" size={16} />
              <span>Untuk perubahan nomor KK atau penambahan anggota keluarga baru, silakan menghubungi Sekretariat / Majelis GKJ Kotagede.</span>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* 3. MODAL EDIT DATA (HANYA UPDATE, TANPA TOMBOL HAPUS)     */}
      {/* ========================================================= */}
      {modalOpen && (
        <div className="jkn-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="jkn-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="jkn-modal-header">
              <h3>Ubah {modalTarget.label}</h3>
              <button type="button" className="jkn-modal-close" onClick={() => setModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="jkn-modal-body">
                <label className="jkn-modal-label">
                  <span>{modalTarget.label}</span>
                  {modalTarget.options ? (
                    <select
                      className="jkn-modal-input"
                      value={modalTarget.value}
                      onChange={(e) => setModalTarget({ ...modalTarget, value: e.target.value })}
                      autoFocus
                    >
                      {modalTarget.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={modalTarget.type || 'text'}
                      className="jkn-modal-input"
                      value={modalTarget.value}
                      onChange={(e) => setModalTarget({ ...modalTarget, value: e.target.value })}
                      autoFocus
                      required
                    />
                  )}
                </label>

                {modalTarget.isFamily && (
                  <p className="jkn-modal-hint">
                    <Icon name="info" size={13} /> Perubahan alamat berlaku untuk seluruh anggota dalam satu Kartu Keluarga (KK).
                  </p>
                )}

                {modalError && <p className="jkn-alert-error" role="alert">{modalError}</p>}
              </div>

              {/* HANYA TOMBOL BATAL & SIMPAN — TANPA TOMBOL HAPUS */}
              <div className="jkn-modal-footer">
                <button type="button" className="jkn-btn-secondary" onClick={() => setModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="jkn-btn-primary">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
