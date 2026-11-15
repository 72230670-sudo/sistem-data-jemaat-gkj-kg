import { useMemo, useState } from 'react'
import {
  calculateAge,
  exportMembersToCSV,
  formatIndonesianDate,
  WILAYAH_LIST,
} from '../../lib/superAdminData.js'

export default function DaftarJemaatView({
  data,
  onAddJemaat,
  onViewJemaat,
  onEditJemaat,
  onDeleteJemaat,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterWilayah, setFilterWilayah] = useState('Semua')
  const [filterKeaktifan, setFilterKeaktifan] = useState('Semua')
  const [filterSakramen, setFilterSakramen] = useState('Semua')
  const [filterGender, setFilterGender] = useState('Semua')

  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return data.members.filter((m) => {
      // Pencarian
      const matchSearch =
        !q ||
        m.nama_lengkap.toLowerCase().includes(q) ||
        m.nik.toLowerCase().includes(q) ||
        (m.no_kk && m.no_kk.toLowerCase().includes(q)) ||
        (m.no_whatsapp && m.no_whatsapp.includes(q)) ||
        (m.nama_wilayah && m.nama_wilayah.toLowerCase().includes(q))

      // Filter Wilayah
      const matchWil = filterWilayah === 'Semua' || m.id_wil === filterWilayah

      // Filter Status Keaktifan
      const matchKeaktifan =
        filterKeaktifan === 'Semua' || m.gerejawi?.status_keaktifan === filterKeaktifan

      // Filter Sakramen
      let matchSakramen = true
      if (filterSakramen === 'Sudah Baptis') matchSakramen = m.gerejawi?.status_baptis === 'Sudah'
      else if (filterSakramen === 'Belum Baptis') matchSakramen = m.gerejawi?.status_baptis !== 'Sudah'
      else if (filterSakramen === 'Sudah Sidi') matchSakramen = m.gerejawi?.status_sidi === 'Sudah'
      else if (filterSakramen === 'Belum Sidi') matchSakramen = m.gerejawi?.status_sidi !== 'Sudah'

      // Filter Gender
      const matchGender = filterGender === 'Semua' || m.jenis_kelamin === filterGender

      return matchSearch && matchWil && matchKeaktifan && matchSakramen && matchGender
    })
  }, [data.members, searchQuery, filterWilayah, filterKeaktifan, filterSakramen, filterGender])

  function handleExportCSV() {
    const csvContent = exportMembersToCSV(filteredMembers, data.families)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `data_jemaat_gkj_kotagede_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="sa-table-card">
      {/* TOOLBAR FILTER & SEARCH */}
      <div className="sa-table-toolbar">
        <div className="sa-toolbar-filters">
          <div className="sa-search-input">
            <span className="sa-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Cari nama, NIK, No KK, atau kontak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="sa-select-filter"
            value={filterWilayah}
            onChange={(e) => setFilterWilayah(e.target.value)}
          >
            <option value="Semua">Semua Wilayah</option>
            {WILAYAH_LIST.map((w) => (
              <option key={w.id_wil} value={w.id_wil}>
                {w.nama_wilayah}
              </option>
            ))}
          </select>

          <select
            className="sa-select-filter"
            value={filterKeaktifan}
            onChange={(e) => setFilterKeaktifan(e.target.value)}
          >
            <option value="Semua">Semua Keaktifan</option>
            <option value="Aktif">Aktif</option>
            <option value="Pasif">Pasif</option>
            <option value="Pindah">Pindah</option>
            <option value="Meninggal">Meninggal</option>
          </select>

          <select
            className="sa-select-filter"
            value={filterSakramen}
            onChange={(e) => setFilterSakramen(e.target.value)}
          >
            <option value="Semua">Semua Status Sakramen</option>
            <option value="Sudah Baptis">Sudah Baptis</option>
            <option value="Belum Baptis">Belum Baptis</option>
            <option value="Sudah Sidi">Sudah Sidi</option>
            <option value="Belum Sidi">Belum Sidi</option>
          </select>

          <select
            className="sa-select-filter"
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
          >
            <option value="Semua">Semua Gender</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div className="sa-toolbar-actions">
          <button className="sa-btn-secondary" type="button" onClick={handleExportCSV} title="Ekspor data jemaat ke file CSV/Excel">
            📥 Ekspor Excel
          </button>
          <button className="sa-btn-secondary" type="button" onClick={handlePrint} title="Cetak laporan">
            🖨️ Cetak
          </button>
          <button className="sa-btn-primary" type="button" onClick={onAddJemaat}>
            ＋ Tambah Jemaat
          </button>
        </div>
      </div>

      {/* TABEL DATA JEMAAT */}
      <div className="sa-table-responsive">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Jemaat (Nama & NIK)</th>
              <th>Gender</th>
              <th>TTL & Usia</th>
              <th>Keluarga (No KK)</th>
              <th>Wilayah</th>
              <th>Status Keaktifan</th>
              <th>Sakramen</th>
              <th>WhatsApp</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="9">
                  <div className="sa-empty-state">
                    Tidak ada data jemaat yang sesuai dengan filter atau kata kunci pencarian.
                  </div>
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => {
                const usia = calculateAge(m.tgl_lhr)
                const keaktifan = m.gerejawi?.status_keaktifan || 'Aktif'
                const badgeClass =
                  keaktifan === 'Aktif'
                    ? 'sa-badge-aktif'
                    : keaktifan === 'Pasif'
                    ? 'sa-badge-pasif'
                    : keaktifan === 'Pindah'
                    ? 'sa-badge-pindah'
                    : 'sa-badge-meninggal'

                return (
                  <tr key={m.nik}>
                    <td>
                      <div className="sa-member-cell">
                        <div className="sa-avatar-circle">
                          {m.nama_lengkap.charAt(0)}
                        </div>
                        <div className="sa-member-meta">
                          <strong>{m.nama_lengkap}</strong>
                          <span>NIK: {m.nik}</span>
                        </div>
                      </div>
                    </td>
                    <td>{m.jenis_kelamin}</td>
                    <td>
                      <div style={{ fontSize: 12 }}>
                        <div>{formatIndonesianDate(m.tgl_lhr)}</div>
                        <span style={{ color: '#64748b' }}>({usia} tahun)</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12 }}>
                        <strong>{m.hubungan_keluarga || 'Anggota'}</strong>
                        <div style={{ color: '#64748b' }}>KK: {m.no_kk || '-'}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{m.nama_wilayah}</span>
                    </td>
                    <td>
                      <span className={`sa-badge ${badgeClass}`}>{keaktifan}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <span className="sa-badge sa-badge-baptis">
                          Baptis: {m.gerejawi?.status_baptis || 'Belum'}
                        </span>
                        <span style={{ fontSize: 11, color: '#64748b' }}>
                          Sidi: {m.gerejawi?.status_sidi || 'Belum'}
                        </span>
                      </div>
                    </td>
                    <td>{m.no_whatsapp || '-'}</td>
                    <td>
                      <div className="sa-actions-cell" style={{ justifyContent: 'center' }}>
                        <button
                          className="sa-btn-icon view"
                          type="button"
                          onClick={() => onViewJemaat(m)}
                          title="Lihat Detail Lengkap"
                        >
                          👁️
                        </button>
                        <button
                          className="sa-btn-icon edit"
                          type="button"
                          onClick={() => onEditJemaat(m)}
                          title="Edit Data Jemaat"
                        >
                          ✏️
                        </button>
                        <button
                          className="sa-btn-icon delete"
                          type="button"
                          onClick={() => onDeleteJemaat(m)}
                          title="Hapus Data Jemaat"
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

      {/* FOOTER TABEL */}
      <div className="sa-table-footer">
        <span>
          Menampilkan <strong>{filteredMembers.length}</strong> dari <strong>{data.members.length}</strong> total data jemaat
        </span>
        <span>GKJ Kotagede Yogyakarta</span>
      </div>
    </div>
  )
}
