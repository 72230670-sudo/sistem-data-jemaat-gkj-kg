import { useMemo, useState } from 'react'

export default function KelolaPenggunaView({ data, onUpdateUserRole, onAddUser }) {
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState('jemaat')
  const [errorMsg, setErrorMsg] = useState('')

  const usersList = useMemo(() => {
    // Kumpulkan user dari data.users dan data.members.user
    const map = new Map()
    if (Array.isArray(data.users)) {
      data.users.forEach((u) => {
        if (u && u.id_user) map.set(u.id_user, u)
      })
    }
    data.members.forEach((m) => {
      if (m.user && m.user.id_user) {
        map.set(m.user.id_user, {
          ...m.user,
          nama_lengkap: m.nama_lengkap,
          nik: m.nik,
        })
      }
    })
    const list = Array.from(map.values())
    if (!search) return list
    const q = search.toLowerCase()
    return list.filter(
      (u) =>
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.role && u.role.toLowerCase().includes(q)) ||
        (u.nama_lengkap && u.nama_lengkap.toLowerCase().includes(q))
    )
  }, [data.users, data.members, search])

  function handleCreateUser(e) {
    e.preventDefault()
    setErrorMsg('')
    if (!newUserEmail || !newUserEmail.includes('@')) {
      setErrorMsg('Format email tidak valid.')
      return
    }
    try {
      onAddUser({
        id_user: `USR-${Date.now()}`,
        email: newUserEmail.trim(),
        role: newUserRole,
      })
      setShowAddModal(false)
      setNewUserEmail('')
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menambahkan pengguna.')
    }
  }

  return (
    <div className="sa-table-card">
      <div className="sa-table-toolbar">
        <div className="sa-toolbar-filters">
          <div className="sa-search-input">
            <span className="sa-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Cari email atau nama pengguna..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="sa-toolbar-actions">
          <button className="sa-btn-primary" type="button" onClick={() => setShowAddModal(true)}>
            ＋ Tambah Akun Pengguna
          </button>
        </div>
      </div>

      <div className="sa-table-responsive">
        <table className="sa-table">
          <thead>
            <tr>
              <th>ID User</th>
              <th>Email</th>
              <th>Nama Jemaat Terkait</th>
              <th>Role / Hak Akses</th>
              <th>Ubah Role</th>
            </tr>
          </thead>
          <tbody>
            {usersList.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="sa-empty-state">Tidak ada akun pengguna yang ditemukan.</div>
                </td>
              </tr>
            ) : (
              usersList.map((u) => (
                <tr key={u.id_user}>
                  <td>
                    <strong style={{ color: '#0284c7' }}>{u.id_user}</strong>
                  </td>
                  <td>{u.email || '-'}</td>
                  <td>{u.nama_lengkap ? `${u.nama_lengkap} (NIK: ${u.nik})` : 'Akun Sistem'}</td>
                  <td>
                    <span
                      className="sa-badge"
                      style={{
                        backgroundColor:
                          u.role === 'super admin'
                            ? '#fee2e2'
                            : u.role === 'admin wilayah'
                            ? '#fef3c7'
                            : '#e0f2fe',
                        color:
                          u.role === 'super admin'
                            ? '#b91c1c'
                            : u.role === 'admin wilayah'
                            ? '#b45309'
                            : '#0369a1',
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <select
                      className="sa-select"
                      style={{ padding: '4px 8px', fontSize: 12 }}
                      value={u.role}
                      onChange={(e) => onUpdateUserRole(u.id_user, e.target.value)}
                    >
                      <option value="jemaat">Jemaat</option>
                      <option value="admin wilayah">Admin Wilayah</option>
                      <option value="super admin">Super Admin</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="sa-table-footer">
        <span>Total <strong>{usersList.length}</strong> akun pengguna terdaftar</span>
        <span>Tabel ERD: Users</span>
      </div>

      {showAddModal && (
        <div className="sa-modal-overlay">
          <div className="sa-modal modal-sm">
            <div className="sa-modal-header">
              <h2>Tambah Akun Pengguna Baru</h2>
              <button className="sa-modal-close" type="button" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="sa-modal-body">
                {errorMsg && (
                  <div
                    style={{
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      padding: 10,
                      borderRadius: 6,
                      fontSize: 12,
                      marginBottom: 12,
                    }}
                  >
                    ⚠️ {errorMsg}
                  </div>
                )}
                <div className="sa-form-group" style={{ marginBottom: 14 }}>
                  <label className="sa-form-label">
                    Alamat Email<span className="req">*</span>
                  </label>
                  <input
                    className="sa-input"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <div className="sa-form-group">
                  <label className="sa-form-label">Role Akses</label>
                  <select
                    className="sa-select"
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                  >
                    <option value="jemaat">Jemaat (Warga)</option>
                    <option value="admin wilayah">Admin Wilayah</option>
                    <option value="super admin">Super Admin</option>
                  </select>
                </div>
              </div>
              <div className="sa-modal-footer">
                <button className="sa-btn-secondary" type="button" onClick={() => setShowAddModal(false)}>
                  Batal
                </button>
                <button className="sa-btn-primary" type="submit">
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
