import { useMemo, useState } from 'react'
import { getFamilyMembers } from '../../lib/superAdminData.js'

export default function DataKeluargaView({
  data,
  onAddFamily,
  onUpdateFamily,
  onDeleteFamily,
  onAddMemberToFamily,
  onViewMember,
}) {
  const [search, setSearch] = useState('')
  const [selectedFamilyForView, setSelectedFamilyForView] = useState(null)
  const [familyModalMode, setFamilyModalMode] = useState(null) // 'create' | 'edit' | null
  const [editingFamily, setEditingFamily] = useState(null)

  const [form, setForm] = useState({
    no_kk: '',
    nama_kepala_keluarga: '',
    alamat: '',
    rt: '01',
    rw: '01',
    desa: 'Prenggan',
    dusun: 'Prenggan',
    kecamatan: 'Kotagede',
    kabupaten: 'Kota Yogyakarta',
    provinsi: 'DI Yogyakarta',
    kode_pos: '55172',
  })
  const [errorMsg, setErrorMsg] = useState('')

  const filteredFamilies = useMemo(() => {
    const q = search.toLowerCase().trim()
    return data.families.filter((f) => {
      if (!q) return true
      return (
        f.no_kk.toLowerCase().includes(q) ||
        f.nama_kepala_keluarga.toLowerCase().includes(q) ||
        (f.alamat && f.alamat.toLowerCase().includes(q)) ||
        (f.desa && f.desa.toLowerCase().includes(q))
      )
    })
  }, [data.families, search])

  const cleanFamilyForm = {
    no_kk: '',
    nama_kepala_keluarga: '',
    alamat: '',
    rt: '',
    rw: '',
    desa: '',
    dusun: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: '',
    kode_pos: '',
  }

  function handleOpenCreate() {
    setEditingFamily(null)
    setForm({ ...cleanFamilyForm })
    setErrorMsg('')
    setFamilyModalMode('create')
  }

  function handleOpenEdit(family) {
    setEditingFamily(family)
    setForm({ ...family })
    setErrorMsg('')
    setFamilyModalMode('edit')
  }

  function handleResetFamilyForm() {
    if (familyModalMode === 'edit' && editingFamily) {
      setForm({ ...editingFamily })
    } else {
      setForm({ ...cleanFamilyForm })
    }
    setErrorMsg('')
  }

  function handleSaveFamily(e) {
    e.preventDefault()
    setErrorMsg('')

    if (!form.no_kk || !form.no_kk.trim()) {
      setErrorMsg('Nomor Kartu Keluarga (No KK) wajib diisi.')
      return
    }
    if (!form.nama_kepala_keluarga || !form.nama_kepala_keluarga.trim()) {
      setErrorMsg('Nama kepala keluarga wajib diisi.')
      return
    }

    try {
      if (familyModalMode === 'create') {
        onAddFamily(form)
      } else {
        onUpdateFamily(editingFamily.no_kk, form)
      }
      setForm({ ...cleanFamilyForm })
      setErrorMsg('')
      setFamilyModalMode(null)
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menyimpan data keluarga.')
    }
  }

  return (
    <div className="sa-table-card">
      {/* TOOLBAR */}
      <div className="sa-table-toolbar">
        <div className="sa-toolbar-filters">
          <div className="sa-search-input">
            <span className="sa-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Cari No KK, nama kepala keluarga, alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="sa-toolbar-actions">
          <button className="sa-btn-primary" type="button" onClick={handleOpenCreate}>
            ＋ Tambah Kartu Keluarga
          </button>
        </div>
      </div>

      {/* TABEL KELUARGA */}
      <div className="sa-table-responsive">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Nomor KK</th>
              <th>Nama Kepala Keluarga</th>
              <th>Alamat Lengkap</th>
              <th>Kelurahan / Dusun</th>
              <th>Kecamatan & Kota</th>
              <th style={{ textAlign: 'center' }}>Jumlah Anggota</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredFamilies.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="sa-empty-state">Belum ada data Kartu Keluarga (KK).</div>
                </td>
              </tr>
            ) : (
              filteredFamilies.map((fam) => {
                const membersInFamily = getFamilyMembers(data.members, fam.no_kk)
                return (
                  <tr key={fam.no_kk}>
                    <td>
                      <strong style={{ color: '#0284c7' }}>{fam.no_kk}</strong>
                    </td>
                    <td>
                      <strong>{fam.nama_kepala_keluarga}</strong>
                    </td>
                    <td>
                      <div>{fam.alamat || '-'}</div>
                      <span style={{ fontSize: 11, color: '#64748b' }}>
                        RT {fam.rt || '-'}/RW {fam.rw || '-'}
                      </span>
                    </td>
                    <td>
                      {fam.desa || '-'} {fam.dusun ? `(${fam.dusun})` : ''}
                    </td>
                    <td>
                      {fam.kecamatan || '-'}, {fam.kabupaten || '-'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        className="sa-badge"
                        style={{
                          backgroundColor: membersInFamily.length > 0 ? '#e0f2fe' : '#f1f5f9',
                          color: membersInFamily.length > 0 ? '#0369a1' : '#64748b',
                          fontSize: 12,
                          padding: '4px 10px',
                          cursor: 'pointer',
                        }}
                        onClick={() => setSelectedFamilyForView(fam)}
                        title="Klik untuk melihat daftar anggota"
                      >
                        👥 {membersInFamily.length} Anggota
                      </span>
                    </td>
                    <td>
                      <div className="sa-actions-cell" style={{ justifyContent: 'center' }}>
                        <button
                          className="sa-btn-icon view"
                          type="button"
                          onClick={() => setSelectedFamilyForView(fam)}
                          title="Lihat Anggota Keluarga"
                        >
                          👁️
                        </button>
                        <button
                          className="sa-btn-icon"
                          style={{ backgroundColor: '#ecfdf5', color: '#059669', borderColor: '#a7f3d0' }}
                          type="button"
                          onClick={() => onAddMemberToFamily(fam)}
                          title="Tambah Anggota Baru ke KK ini"
                        >
                          ＋
                        </button>
                        <button
                          className="sa-btn-icon edit"
                          type="button"
                          onClick={() => handleOpenEdit(fam)}
                          title="Edit Data KK"
                        >
                          ✏️
                        </button>
                        <button
                          className="sa-btn-icon delete"
                          type="button"
                          onClick={() => onDeleteFamily(fam.no_kk)}
                          title="Hapus KK"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="sa-table-footer">
        <span>
          Total <strong>{filteredFamilies.length}</strong> Kartu Keluarga terdaftar
        </span>
        <span>GKJ Kotagede Yogyakarta</span>
      </div>

      {/* MODAL LIHAT ANGGOTA KELUARGA */}
      {selectedFamilyForView && (
        <div className="sa-modal-overlay">
          <div className="sa-modal modal-lg">
            <div className="sa-modal-header">
              <h2>Anggota Keluarga — KK No. {selectedFamilyForView.no_kk}</h2>
              <button className="sa-modal-close" type="button" onClick={() => setSelectedFamilyForView(null)}>
                ✕
              </button>
            </div>
            <div className="sa-modal-body">
              <div className="sa-detail-grid" style={{ marginBottom: 20 }}>
                <div className="sa-detail-box">
                  <span>Kepala Keluarga</span>
                  <strong>{selectedFamilyForView.nama_kepala_keluarga}</strong>
                </div>
                <div className="sa-detail-box">
                  <span>Alamat Surat</span>
                  <strong>{selectedFamilyForView.alamat}</strong>
                </div>
                <div className="sa-detail-box">
                  <span>Wilayah & Lokasi</span>
                  <strong>
                    RT {selectedFamilyForView.rt}/RW {selectedFamilyForView.rw}, {selectedFamilyForView.desa},{' '}
                    {selectedFamilyForView.kecamatan}
                  </strong>
                </div>
                <div className="sa-detail-box">
                  <span>Jumlah Anggota</span>
                  <strong>{getFamilyMembers(data.members, selectedFamilyForView.no_kk).length} Orang</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ margin: 0, fontSize: 14 }}>Daftar Anggota Keluarga</h4>
                <button
                  className="sa-btn-primary"
                  type="button"
                  style={{ padding: '6px 12px', fontSize: 12 }}
                  onClick={() => {
                    const fam = selectedFamilyForView
                    setSelectedFamilyForView(null)
                    onAddMemberToFamily(fam)
                  }}
                >
                  ＋ Tambah Anggota ke KK Ini
                </button>
              </div>

              <div className="sa-table-responsive" style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}>
                <table className="sa-table">
                  <thead>
                    <tr>
                      <th>Nama Lengkap</th>
                      <th>NIK</th>
                      <th>Status dlm Keluarga</th>
                      <th>Jenis Kelamin</th>
                      <th>No WhatsApp</th>
                      <th>Status Keaktifan</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFamilyMembers(data.members, selectedFamilyForView.no_kk).length === 0 ? (
                      <tr>
                        <td colSpan="7">
                          <div className="sa-empty-state">Belum ada anggota jemaat di dalam KK ini.</div>
                        </td>
                      </tr>
                    ) : (
                      getFamilyMembers(data.members, selectedFamilyForView.no_kk).map((m) => (
                        <tr key={m.nik}>
                          <td><strong>{m.nama_lengkap}</strong></td>
                          <td>{m.nik}</td>
                          <td>
                            <span className="sa-badge" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
                              {m.hubungan_keluarga || 'Anggota'}
                            </span>
                          </td>
                          <td>{m.jenis_kelamin}</td>
                          <td>{m.no_whatsapp || '-'}</td>
                          <td>
                            <span className="sa-badge sa-badge-aktif">
                              {m.gerejawi?.status_keaktifan || 'Aktif'}
                            </span>
                          </td>
                          <td>
                            <button
                              className="sa-btn-subtle"
                              type="button"
                              style={{ color: '#0284c7', borderColor: '#0284c7' }}
                              onClick={() => {
                                setSelectedFamilyForView(null)
                                onViewMember(m)
                              }}
                            >
                              Detail Jemaat
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="sa-modal-footer">
              <button className="sa-btn-secondary" type="button" onClick={() => setSelectedFamilyForView(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT KK */}
      {familyModalMode && (
        <div className="sa-modal-overlay">
          <div className="sa-modal">
            <div className="sa-modal-header">
              <h2>{familyModalMode === 'create' ? 'Tambah Kartu Keluarga Baru' : `Edit KK: ${editingFamily?.no_kk}`}</h2>
              <button className="sa-modal-close" type="button" onClick={() => setFamilyModalMode(null)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveFamily}>
              <div className="sa-modal-body">
                {errorMsg && (
                  <div
                    style={{
                      backgroundColor: '#fee2e2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      padding: '10px 14px',
                      borderRadius: 8,
                      marginBottom: 16,
                      fontSize: 13,
                    }}
                  >
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div className="sa-form-grid">
                  <div className="sa-form-group">
                    <label className="sa-form-label">
                      Nomor Kartu Keluarga (No KK)<span className="req">*</span>
                    </label>
                    <input
                      className="sa-input"
                      type="text"
                      required
                      disabled={familyModalMode === 'edit'}
                      placeholder="16 Digit No KK"
                      value={form.no_kk}
                      onChange={(e) => setForm({ ...form, no_kk: e.target.value })}
                    />
                  </div>

                  <div className="sa-form-group">
                    <label className="sa-form-label">
                      Nama Kepala Keluarga<span className="req">*</span>
                    </label>
                    <input
                      className="sa-input"
                      type="text"
                      required
                      placeholder="Nama kepala keluarga"
                      value={form.nama_kepala_keluarga}
                      onChange={(e) => setForm({ ...form, nama_kepala_keluarga: e.target.value })}
                    />
                  </div>

                  <div className="sa-form-group col-span-2">
                    <label className="sa-form-label">Alamat Jalan / Tempat Tinggal</label>
                    <input
                      className="sa-input"
                      type="text"
                      placeholder="Jl. Mondorakan No. 45"
                      value={form.alamat}
                      onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                    />
                  </div>

                  <div className="sa-form-group">
                    <label className="sa-form-label">RT / RW</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        className="sa-input"
                        style={{ width: '50%' }}
                        placeholder="RT (cth: 01)"
                        value={form.rt}
                        onChange={(e) => setForm({ ...form, rt: e.target.value })}
                      />
                      <input
                        className="sa-input"
                        style={{ width: '50%' }}
                        placeholder="RW (cth: 02)"
                        value={form.rw}
                        onChange={(e) => setForm({ ...form, rw: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="sa-form-group">
                    <label className="sa-form-label">Kelurahan / Desa & Dusun</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        className="sa-input"
                        style={{ width: '50%' }}
                        placeholder="Kelurahan / Desa"
                        value={form.desa}
                        onChange={(e) => setForm({ ...form, desa: e.target.value })}
                      />
                      <input
                        className="sa-input"
                        style={{ width: '50%' }}
                        placeholder="Dusun"
                        value={form.dusun}
                        onChange={(e) => setForm({ ...form, dusun: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="sa-form-group">
                    <label className="sa-form-label">Kecamatan & Kabupaten/Kota</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        className="sa-input"
                        style={{ width: '50%' }}
                        placeholder="Kecamatan"
                        value={form.kecamatan}
                        onChange={(e) => setForm({ ...form, kecamatan: e.target.value })}
                      />
                      <input
                        className="sa-input"
                        style={{ width: '50%' }}
                        placeholder="Kota / Kabupaten"
                        value={form.kabupaten}
                        onChange={(e) => setForm({ ...form, kabupaten: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="sa-form-group">
                    <label className="sa-form-label">Provinsi & Kode Pos</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        className="sa-input"
                        style={{ width: '70%' }}
                        placeholder="Provinsi"
                        value={form.provinsi}
                        onChange={(e) => setForm({ ...form, provinsi: e.target.value })}
                      />
                      <input
                        className="sa-input"
                        style={{ width: '30%' }}
                        placeholder="Kode Pos"
                        value={form.kode_pos}
                        onChange={(e) => setForm({ ...form, kode_pos: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="sa-modal-footer">
                <button
                  className="sa-btn-reset"
                  type="button"
                  onClick={handleResetFamilyForm}
                  title="Bersihkan seluruh isian form kembali ke awal"
                >
                  🔄 Reset Form
                </button>
                <button className="sa-btn-secondary" type="button" onClick={() => setFamilyModalMode(null)}>
                  Batal
                </button>
                <button className="sa-btn-primary" type="submit">
                  💾 Simpan Data Keluarga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
