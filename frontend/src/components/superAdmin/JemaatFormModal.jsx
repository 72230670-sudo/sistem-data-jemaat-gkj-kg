import { useState } from 'react'
import {
  DOKUMEN_OPTIONS,
  HUBUNGAN_KELUARGA_OPTIONS,
  PELAYANAN_OPTIONS,
  WILAYAH_LIST,
} from '../../lib/superAdminData.js'

function getCleanFormData(initialData, families) {
  const isRealEdit = Boolean(initialData && initialData.nik)

  if (isRealEdit) {
    return {
      ...initialData,
      email: initialData.user?.email || initialData.email || '',
      gerejawi: {
        status_baptis: 'Belum',
        tgl_baptis: '',
        status_sidi: 'Belum',
        tgl_sidi: '',
        status_pernikahan: 'Belum menikah',
        tgl_pernikahan: '',
        status_keaktifan: 'Aktif',
        ...initialData.gerejawi,
      },
      pendidikan: {
        pendidikan_terakhir: 'S1',
        nama_sekolah: '',
        thn_lulus: '',
        ...initialData.pendidikan,
      },
      pekerjaan: {
        pekerjaan: '',
        instansi: '',
        jabatan: '',
        penghasilan: '',
        ...initialData.pekerjaan,
      },
      riwayat_pelayanan: Array.isArray(initialData.riwayat_pelayanan)
        ? initialData.riwayat_pelayanan.map((p) => ({ ...p }))
        : [],
      dokumen: Array.isArray(initialData.dokumen)
        ? initialData.dokumen.map((d) => ({ ...d }))
        : [],
    }
  }

  const defaultNoKk = (initialData && initialData.no_kk) || (families[0] ? families[0].no_kk : '')
  return {
    nik: '',
    nama_lengkap: '',
    jenis_kelamin: 'Laki-laki',
    tmpt_lhr: '',
    tgl_lhr: '',
    gol_darah: 'O',
    status_jemaat: 'Warga jemaat',
    hubungan_keluarga: 'Kepala Keluarga',
    no_whatsapp: '',
    email: '',
    id_wil: 'WIL-01',
    nama_wilayah: 'Wilayah 1',
    no_kk: defaultNoKk,
    new_kk: {
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
    },
    gerejawi: {
      status_baptis: 'Belum',
      tgl_baptis: '',
      status_sidi: 'Belum',
      tgl_sidi: '',
      status_pernikahan: 'Belum menikah',
      tgl_pernikahan: '',
      status_keaktifan: 'Aktif',
    },
    pendidikan: {
      pendidikan_terakhir: 'S1',
      nama_sekolah: '',
      thn_lulus: '',
    },
    pekerjaan: {
      pekerjaan: '',
      instansi: '',
      jabatan: '',
      penghasilan: '',
    },
    riwayat_pelayanan: [],
    dokumen: [],
  }
}

export default function JemaatFormModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  families = [],
}) {
  const isEditing = Boolean(initialData && initialData.nik)

  const [activeTab, setActiveTab] = useState('identitas')
  const [useExistingKK, setUseExistingKK] = useState(
    !initialData || !initialData.nik || families.some((f) => f.no_kk === initialData.no_kk)
  )

  const [form, setForm] = useState(() => getCleanFormData(initialData, families))
  const [errorMsg, setErrorMsg] = useState('')
  const [resetSuccessNotice, setResetSuccessNotice] = useState(false)

  if (!isOpen) return null

  function handleResetForm() {
    setForm(getCleanFormData(initialData, families))
    setUseExistingKK(!initialData || !initialData.nik || families.some((f) => f.no_kk === initialData.no_kk))
    setActiveTab('identitas')
    setErrorMsg('')
    setResetSuccessNotice(true)
    setTimeout(() => setResetSuccessNotice(false), 2500)
  }

  function handleCloseModal() {
    setForm(getCleanFormData(null, families))
    setActiveTab('identitas')
    setErrorMsg('')
    setResetSuccessNotice(false)
    onClose()
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleNestedChange(category, field, value) {
    setForm((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }))
  }

  function handleNewKKChange(field, value) {
    setForm((prev) => ({
      ...prev,
      new_kk: {
        ...prev.new_kk,
        [field]: value,
      },
    }))
  }

  // Pelayanan handlers
  function addPelayanan() {
    const newItem = {
      id_pelayanan: `PLY-${Date.now()}`,
      nama_pelayanan: PELAYANAN_OPTIONS[0],
      thn_mulai: String(new Date().getFullYear()),
      thn_berakhir: '',
    }
    setForm((prev) => ({
      ...prev,
      riwayat_pelayanan: [...prev.riwayat_pelayanan, newItem],
    }))
  }

  function removePelayanan(index) {
    setForm((prev) => ({
      ...prev,
      riwayat_pelayanan: prev.riwayat_pelayanan.filter((_, i) => i !== index),
    }))
  }

  function updatePelayanan(index, field, value) {
    setForm((prev) => {
      const next = [...prev.riwayat_pelayanan]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, riwayat_pelayanan: next }
    })
  }

  // Dokumen handlers
  function addDokumen() {
    const newItem = {
      id_dokumen: `DOK-${Date.now()}`,
      jenis_dokumen: DOKUMEN_OPTIONS[0],
      file_path: 'dokumen_terlampir.pdf',
    }
    setForm((prev) => ({
      ...prev,
      dokumen: [...prev.dokumen, newItem],
    }))
  }

  function removeDokumen(index) {
    setForm((prev) => ({
      ...prev,
      dokumen: prev.dokumen.filter((_, i) => i !== index),
    }))
  }

  function updateDokumen(index, field, value) {
    setForm((prev) => {
      const next = [...prev.dokumen]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, dokumen: next }
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setErrorMsg('')

    if (!form.nik || !form.nik.trim()) {
      setErrorMsg('Nomor Induk Keanggotaan (NIK) wajib diisi.')
      setActiveTab('identitas')
      return
    }

    if (!form.nama_lengkap || !form.nama_lengkap.trim()) {
      setErrorMsg('Nama lengkap jemaat wajib diisi.')
      setActiveTab('identitas')
      return
    }

    if (!form.tgl_lhr) {
      setErrorMsg('Tanggal lahir wajib diisi.')
      setActiveTab('identitas')
      return
    }

    // Tentukan KK final
    let finalNoKk = form.no_kk
    let newFamilyObject = null

    if (!useExistingKK) {
      if (!form.new_kk?.no_kk || !form.new_kk.no_kk.trim()) {
        setErrorMsg('Nomor Kartu Keluarga (KK) baru wajib diisi.')
        setActiveTab('keluarga')
        return
      }
      if (!form.new_kk?.nama_kepala_keluarga || !form.new_kk.nama_kepala_keluarga.trim()) {
        setErrorMsg('Nama Kepala Keluarga pada KK baru wajib diisi.')
        setActiveTab('keluarga')
        return
      }
      finalNoKk = form.new_kk.no_kk.trim()
      newFamilyObject = {
        ...form.new_kk,
        no_kk: finalNoKk,
      }
    }

    const payload = {
      ...form,
      no_kk: finalNoKk,
      _newFamily: newFamilyObject,
    }

    try {
      onSave(payload, isEditing ? initialData.nik : undefined)
      // Form kembali bersih setelah data entry disimpan
      setForm(getCleanFormData(null, families))
      setActiveTab('identitas')
      setErrorMsg('')
      setResetSuccessNotice(false)
      onClose()
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan data.')
    }
  }

  return (
    <div className="sa-modal-overlay">
      <div className="sa-modal modal-lg">
        {/* HEADER */}
        <div className="sa-modal-header">
          <h2>{isEditing ? `Edit Master Data: ${initialData.nama_lengkap}` : 'Tambah Data Jemaat Baru'}</h2>
          <button className="sa-modal-close" type="button" onClick={handleCloseModal}>
            ✕
          </button>
        </div>

        {/* TABS HEADER SESUAI ERD */}
        <div className="sa-modal-tabs">
          <button
            className={`sa-modal-tab ${activeTab === 'identitas' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('identitas')}
          >
            👤 1. Identitas Pribadi
          </button>
          <button
            className={`sa-modal-tab ${activeTab === 'keluarga' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('keluarga')}
          >
            🏠 2. Keluarga & Alamat
          </button>
          <button
            className={`sa-modal-tab ${activeTab === 'gerejawi' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('gerejawi')}
          >
            ⛪ 3. Data Gerejawi
          </button>
          <button
            className={`sa-modal-tab ${activeTab === 'pendidikan_pekerjaan' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('pendidikan_pekerjaan')}
          >
            🎓 4. Pendidikan & Pekerjaan
          </button>
          <button
            className={`sa-modal-tab ${activeTab === 'pelayanan_dokumen' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('pelayanan_dokumen')}
          >
            📋 5. Pelayanan & Dokumen
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
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

            {/* TAB 1: IDENTITAS PRIBADI */}
            {activeTab === 'identitas' && (
              <div className="sa-form-grid">
                <div className="sa-form-group">
                  <label className="sa-form-label">
                    Nomor Induk Keanggotaan (NIK)<span className="req">*</span>
                  </label>
                  <input
                    className="sa-input"
                    type="text"
                    required
                    placeholder="Contoh: 3471015205920001"
                    value={form.nik}
                    onChange={(e) => handleChange('nik', e.target.value)}
                  />
                  <span className="sa-form-help">NIK jemaat sebagai Primary Key (PK)</span>
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">
                    Nama Lengkap Jemaat<span className="req">*</span>
                  </label>
                  <input
                    className="sa-input"
                    type="text"
                    required
                    placeholder="Nama lengkap jemaat"
                    value={form.nama_lengkap}
                    onChange={(e) => handleChange('nama_lengkap', e.target.value)}
                  />
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Jenis Kelamin</label>
                  <select
                    className="sa-select"
                    value={form.jenis_kelamin}
                    onChange={(e) => handleChange('jenis_kelamin', e.target.value)}
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Golongan Darah</label>
                  <select
                    className="sa-select"
                    value={form.gol_darah}
                    onChange={(e) => handleChange('gol_darah', e.target.value)}
                  >
                    <option value="Belum diketahui">Belum diketahui</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Tempat Lahir</label>
                  <input
                    className="sa-input"
                    type="text"
                    placeholder="Kota tempat lahir"
                    value={form.tmpt_lhr}
                    onChange={(e) => handleChange('tmpt_lhr', e.target.value)}
                  />
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">
                    Tanggal Lahir<span className="req">*</span>
                  </label>
                  <input
                    className="sa-input"
                    type="date"
                    required
                    value={form.tgl_lhr}
                    onChange={(e) => handleChange('tgl_lhr', e.target.value)}
                  />
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Status Jemaat</label>
                  <select
                    className="sa-select"
                    value={form.status_jemaat}
                    onChange={(e) => handleChange('status_jemaat', e.target.value)}
                  >
                    <option value="Warga jemaat">Warga jemaat</option>
                    <option value="Simpatisan">Simpatisan</option>
                  </select>
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Wilayah Pelayanan</label>
                  <select
                    className="sa-select"
                    value={form.id_wil}
                    onChange={(e) => {
                      const wil = WILAYAH_LIST.find((w) => w.id_wil === e.target.value)
                      handleChange('id_wil', e.target.value)
                      handleChange('nama_wilayah', wil?.nama_wilayah || '')
                    }}
                  >
                    {WILAYAH_LIST.map((w) => (
                      <option key={w.id_wil} value={w.id_wil}>
                        {w.nama_wilayah}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Nomor WhatsApp / HP</label>
                  <input
                    className="sa-input"
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={form.no_whatsapp}
                    onChange={(e) => handleChange('no_whatsapp', e.target.value)}
                  />
                  <span className="sa-form-help">Digunakan untuk kirim ucapan ulang tahun</span>
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Email Akun (Tabel Users)</label>
                  <input
                    className="sa-input"
                    type="email"
                    placeholder="jemaat@email.com"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                  <span className="sa-form-help">Terhubung ke user login</span>
                </div>
              </div>
            )}

            {/* TAB 2: KELUARGA & ALAMAT */}
            {activeTab === 'keluarga' && (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <label className="sa-form-label" style={{ marginBottom: 8, display: 'block' }}>
                    Metode Pemilihan Kartu Keluarga (KK):
                  </label>
                  <div style={{ display: 'flex', gap: 14 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="kkMode"
                        checked={useExistingKK}
                        onChange={() => setUseExistingKK(true)}
                      />
                      Pilih dari KK Terdaftar ({families.length} KK)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="kkMode"
                        checked={!useExistingKK}
                        onChange={() => setUseExistingKK(false)}
                      />
                      ＋ Buat Kartu Keluarga Baru
                    </label>
                  </div>
                </div>

                {useExistingKK ? (
                  <div className="sa-form-grid">
                    <div className="sa-form-group col-span-2">
                      <label className="sa-form-label">
                        Pilih Kartu Keluarga (KK)<span className="req">*</span>
                      </label>
                      <select
                        className="sa-select"
                        value={form.no_kk}
                        onChange={(e) => handleChange('no_kk', e.target.value)}
                      >
                        {families.map((f) => (
                          <option key={f.no_kk} value={f.no_kk}>
                            {f.no_kk} — Kepala: {f.nama_kepala_keluarga} ({f.alamat})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sa-form-group">
                      <label className="sa-form-label">Hubungan / Status Dalam Keluarga</label>
                      <select
                        className="sa-select"
                        value={form.hubungan_keluarga}
                        onChange={(e) => handleChange('hubungan_keluarga', e.target.value)}
                      >
                        {HUBUNGAN_KELUARGA_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="sa-form-grid">
                    <div className="sa-form-group">
                      <label className="sa-form-label">
                        Nomor KK Baru (16 Digit)<span className="req">*</span>
                      </label>
                      <input
                        className="sa-input"
                        type="text"
                        placeholder="Contoh: 3471010101010001"
                        value={form.new_kk?.no_kk || ''}
                        onChange={(e) => handleNewKKChange('no_kk', e.target.value)}
                      />
                    </div>

                    <div className="sa-form-group">
                      <label className="sa-form-label">
                        Nama Kepala Keluarga<span className="req">*</span>
                      </label>
                      <input
                        className="sa-input"
                        type="text"
                        placeholder="Nama kepala keluarga"
                        value={form.new_kk?.nama_kepala_keluarga || ''}
                        onChange={(e) => handleNewKKChange('nama_kepala_keluarga', e.target.value)}
                      />
                    </div>

                    <div className="sa-form-group">
                      <label className="sa-form-label">Status Jemaat Ini dlm Keluarga</label>
                      <select
                        className="sa-select"
                        value={form.hubungan_keluarga}
                        onChange={(e) => handleChange('hubungan_keluarga', e.target.value)}
                      >
                        {HUBUNGAN_KELUARGA_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sa-form-group">
                      <label className="sa-form-label">Alamat Jalan / Rumah</label>
                      <input
                        className="sa-input"
                        type="text"
                        placeholder="Jl. Mondorakan No. 12"
                        value={form.new_kk?.alamat || ''}
                        onChange={(e) => handleNewKKChange('alamat', e.target.value)}
                      />
                    </div>

                    <div className="sa-form-group">
                      <label className="sa-form-label">RT / RW</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          className="sa-input"
                          style={{ width: '50%' }}
                          placeholder="RT 01"
                          value={form.new_kk?.rt || ''}
                          onChange={(e) => handleNewKKChange('rt', e.target.value)}
                        />
                        <input
                          className="sa-input"
                          style={{ width: '50%' }}
                          placeholder="RW 02"
                          value={form.new_kk?.rw || ''}
                          onChange={(e) => handleNewKKChange('rw', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sa-form-group">
                      <label className="sa-form-label">Kelurahan / Desa & Dusun</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          className="sa-input"
                          style={{ width: '50%' }}
                          placeholder="Prenggan"
                          value={form.new_kk?.desa || ''}
                          onChange={(e) => handleNewKKChange('desa', e.target.value)}
                        />
                        <input
                          className="sa-input"
                          style={{ width: '50%' }}
                          placeholder="Dusun"
                          value={form.new_kk?.dusun || ''}
                          onChange={(e) => handleNewKKChange('dusun', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sa-form-group">
                      <label className="sa-form-label">Kecamatan & Kabupaten</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          className="sa-input"
                          style={{ width: '50%' }}
                          placeholder="Kotagede"
                          value={form.new_kk?.kecamatan || ''}
                          onChange={(e) => handleNewKKChange('kecamatan', e.target.value)}
                        />
                        <input
                          className="sa-input"
                          style={{ width: '50%' }}
                          placeholder="Kota Yogyakarta"
                          value={form.new_kk?.kabupaten || ''}
                          onChange={(e) => handleNewKKChange('kabupaten', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sa-form-group">
                      <label className="sa-form-label">Provinsi & Kode Pos</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          className="sa-input"
                          style={{ width: '70%' }}
                          placeholder="DI Yogyakarta"
                          value={form.new_kk?.provinsi || ''}
                          onChange={(e) => handleNewKKChange('provinsi', e.target.value)}
                        />
                        <input
                          className="sa-input"
                          style={{ width: '30%' }}
                          placeholder="55172"
                          value={form.new_kk?.kode_pos || ''}
                          onChange={(e) => handleNewKKChange('kode_pos', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: DATA GEREJAWI */}
            {activeTab === 'gerejawi' && (
              <div className="sa-form-grid">
                <div className="sa-form-group">
                  <label className="sa-form-label">Status Baptis</label>
                  <select
                    className="sa-select"
                    value={form.gerejawi.status_baptis}
                    onChange={(e) => handleNestedChange('gerejawi', 'status_baptis', e.target.value)}
                  >
                    <option value="Belum">Belum</option>
                    <option value="Sudah">Sudah</option>
                  </select>
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Tanggal Baptis</label>
                  <input
                    className="sa-input"
                    type="date"
                    disabled={form.gerejawi.status_baptis !== 'Sudah'}
                    value={form.gerejawi.tgl_baptis || ''}
                    onChange={(e) => handleNestedChange('gerejawi', 'tgl_baptis', e.target.value)}
                  />
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Status Sidi</label>
                  <select
                    className="sa-select"
                    value={form.gerejawi.status_sidi}
                    onChange={(e) => handleNestedChange('gerejawi', 'status_sidi', e.target.value)}
                  >
                    <option value="Belum">Belum</option>
                    <option value="Sudah">Sudah</option>
                  </select>
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Tanggal Sidi</label>
                  <input
                    className="sa-input"
                    type="date"
                    disabled={form.gerejawi.status_sidi !== 'Sudah'}
                    value={form.gerejawi.tgl_sidi || ''}
                    onChange={(e) => handleNestedChange('gerejawi', 'tgl_sidi', e.target.value)}
                  />
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Status Pernikahan</label>
                  <select
                    className="sa-select"
                    value={form.gerejawi.status_pernikahan}
                    onChange={(e) => handleNestedChange('gerejawi', 'status_pernikahan', e.target.value)}
                  >
                    <option value="Belum menikah">Belum menikah</option>
                    <option value="Menikah">Menikah</option>
                    <option value="Cerai hidup">Cerai hidup</option>
                    <option value="Cerai mati">Cerai mati</option>
                  </select>
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Tanggal Pernikahan</label>
                  <input
                    className="sa-input"
                    type="date"
                    disabled={form.gerejawi.status_pernikahan !== 'Menikah'}
                    value={form.gerejawi.tgl_pernikahan || ''}
                    onChange={(e) => handleNestedChange('gerejawi', 'tgl_pernikahan', e.target.value)}
                  />
                  <span className="sa-form-help">Digunakan untuk notifikasi Ultah Nikah</span>
                </div>

                <div className="sa-form-group col-span-2">
                  <label className="sa-form-label">Status Keaktifan Jemaat</label>
                  <select
                    className="sa-select"
                    value={form.gerejawi.status_keaktifan}
                    onChange={(e) => handleNestedChange('gerejawi', 'status_keaktifan', e.target.value)}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Pasif">Pasif</option>
                    <option value="Pindah">Pindah</option>
                    <option value="Meninggal">Meninggal</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB 4: PENDIDIKAN & PEKERJAAN */}
            {activeTab === 'pendidikan_pekerjaan' && (
              <div className="sa-form-grid">
                <div className="sa-form-group col-span-2" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 6 }}>
                  <strong style={{ fontSize: 14, color: '#0f172a' }}>Data Pendidikan (Tabel Pendidikan)</strong>
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Pendidikan Terakhir</label>
                  <select
                    className="sa-select"
                    value={form.pendidikan.pendidikan_terakhir}
                    onChange={(e) => handleNestedChange('pendidikan', 'pendidikan_terakhir', e.target.value)}
                  >
                    <option value="Belum sekolah">Belum sekolah</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA / SMK">SMA / SMK</option>
                    <option value="D1 / D2 / D3">D1 / D2 / D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Nama Sekolah / Universitas</label>
                  <input
                    className="sa-input"
                    type="text"
                    placeholder="Contoh: UKDW Yogyakarta"
                    value={form.pendidikan.nama_sekolah || ''}
                    onChange={(e) => handleNestedChange('pendidikan', 'nama_sekolah', e.target.value)}
                  />
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Tahun Lulus</label>
                  <input
                    className="sa-input"
                    type="number"
                    placeholder="Contoh: 2020"
                    value={form.pendidikan.thn_lulus || ''}
                    onChange={(e) => handleNestedChange('pendidikan', 'thn_lulus', e.target.value)}
                  />
                </div>

                <div className="sa-form-group col-span-2" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 6, marginTop: 12 }}>
                  <strong style={{ fontSize: 14, color: '#0f172a' }}>Data Pekerjaan (Tabel Pekerjaan)</strong>
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Profesi / Pekerjaan</label>
                  <input
                    className="sa-input"
                    type="text"
                    placeholder="Guru, Wiraswasta, PNS, dll."
                    value={form.pekerjaan.pekerjaan || ''}
                    onChange={(e) => handleNestedChange('pekerjaan', 'pekerjaan', e.target.value)}
                  />
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Instansi / Perusahaan</label>
                  <input
                    className="sa-input"
                    type="text"
                    placeholder="Nama tempat bekerja"
                    value={form.pekerjaan.instansi || ''}
                    onChange={(e) => handleNestedChange('pekerjaan', 'instansi', e.target.value)}
                  />
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Jabatan / Posisi</label>
                  <input
                    className="sa-input"
                    type="text"
                    placeholder="Posisi / jabatan"
                    value={form.pekerjaan.jabatan || ''}
                    onChange={(e) => handleNestedChange('pekerjaan', 'jabatan', e.target.value)}
                  />
                </div>

                <div className="sa-form-group">
                  <label className="sa-form-label">Penghasilan per Bulan (Rp)</label>
                  <input
                    className="sa-input"
                    type="number"
                    placeholder="Nominal rupiah"
                    value={form.pekerjaan.penghasilan || ''}
                    onChange={(e) => handleNestedChange('pekerjaan', 'penghasilan', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* TAB 5: RIWAYAT PELAYANAN & DOKUMEN */}
            {activeTab === 'pelayanan_dokumen' && (
              <div>
                {/* PELAYANAN */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <strong style={{ fontSize: 14, color: '#0f172a' }}>Riwayat Pelayanan (Tabel Riwayat_Pelayanan)</strong>
                  <button className="sa-btn-secondary" type="button" onClick={addPelayanan} style={{ padding: '4px 10px', fontSize: 12 }}>
                    ＋ Tambah Pelayanan
                  </button>
                </div>

                {form.riwayat_pelayanan.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic', marginBottom: 20 }}>
                    Belum ada riwayat pelayanan yang dicatat.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                    {form.riwayat_pelayanan.map((ply, idx) => (
                      <div
                        key={ply.id_pelayanan || idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 1fr 1fr auto',
                          gap: 8,
                          alignItems: 'center',
                          padding: 10,
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 8,
                        }}
                      >
                        <select
                          className="sa-select"
                          value={ply.nama_pelayanan}
                          onChange={(e) => updatePelayanan(idx, 'nama_pelayanan', e.target.value)}
                        >
                          {PELAYANAN_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>

                        <input
                          className="sa-input"
                          type="number"
                          placeholder="Mulai (thn)"
                          value={ply.thn_mulai || ''}
                          onChange={(e) => updatePelayanan(idx, 'thn_mulai', e.target.value)}
                        />

                        <input
                          className="sa-input"
                          type="number"
                          placeholder="Selesai (kosongkan jika aktif)"
                          value={ply.thn_berakhir || ''}
                          onChange={(e) => updatePelayanan(idx, 'thn_berakhir', e.target.value)}
                        />

                        <button
                          className="sa-btn-icon delete"
                          type="button"
                          onClick={() => removePelayanan(idx)}
                          title="Hapus"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* DOKUMEN */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 16 }}>
                  <strong style={{ fontSize: 14, color: '#0f172a' }}>Dokumen Terlampir (Tabel Dokumen)</strong>
                  <button className="sa-btn-secondary" type="button" onClick={addDokumen} style={{ padding: '4px 10px', fontSize: 12 }}>
                    ＋ Tambah Dokumen
                  </button>
                </div>

                {form.dokumen.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic' }}>
                    Belum ada dokumen terlampir.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {form.dokumen.map((dok, idx) => (
                      <div
                        key={dok.id_dokumen || idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.5fr 2fr auto',
                          gap: 8,
                          alignItems: 'center',
                          padding: 10,
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 8,
                        }}
                      >
                        <select
                          className="sa-select"
                          value={dok.jenis_dokumen}
                          onChange={(e) => updateDokumen(idx, 'jenis_dokumen', e.target.value)}
                        >
                          {DOKUMEN_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>

                        <input
                          className="sa-input"
                          type="text"
                          placeholder="Nama berkas atau file path"
                          value={dok.file_path || ''}
                          onChange={(e) => updateDokumen(idx, 'file_path', e.target.value)}
                        />

                        <button
                          className="sa-btn-icon delete"
                          type="button"
                          onClick={() => removeDokumen(idx)}
                          title="Hapus Dokumen"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="sa-modal-footer">
            <button
              className="sa-btn-reset"
              type="button"
              onClick={handleResetForm}
              title="Bersihkan seluruh isian form kembali ke awal"
            >
              🔄 Reset Form
            </button>
            {resetSuccessNotice && (
              <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                ✓ Form dibersihkan
              </span>
            )}
            <button className="sa-btn-secondary" type="button" onClick={handleCloseModal}>
              Batal
            </button>
            <button className="sa-btn-primary" type="submit">
              💾 Simpan Master Data Jemaat
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
