import { useState } from 'react'
import {
  calculateAge,
  calculateMarriageAge,
  formatIndonesianDate,
  formatRupiah,
} from '../../lib/superAdminData.js'

export default function DetailJemaatModal({ isOpen, onClose, member, family, allMembers = [] }) {
  const [activeTab, setActiveTab] = useState('identitas')

  if (!isOpen || !member) return null

  const usia = calculateAge(member.tgl_lhr)
  const usiaNikah = calculateMarriageAge(member.gerejawi?.tgl_pernikahan)

  // Anggota keluarga di KK yang sama
  const familyMembersList = allMembers.filter((m) => m.no_kk && m.no_kk === member.no_kk)

  return (
    <div className="sa-modal-overlay">
      <div className="sa-modal modal-lg">
        {/* HEADER */}
        <div className="sa-modal-header">
          <h2>Profil Lengkap Data Jemaat</h2>
          <button className="sa-modal-close" type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* TABS */}
        <div className="sa-modal-tabs">
          <button
            className={`sa-modal-tab ${activeTab === 'identitas' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('identitas')}
          >
            Identitas Pribadi
          </button>
          <button
            className={`sa-modal-tab ${activeTab === 'keluarga' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('keluarga')}
          >
            Keluarga & Anggota KK ({familyMembersList.length})
          </button>
          <button
            className={`sa-modal-tab ${activeTab === 'gerejawi' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('gerejawi')}
          >
            Data Gerejawi
          </button>
          <button
            className={`sa-modal-tab ${activeTab === 'pendidikan_pekerjaan' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('pendidikan_pekerjaan')}
          >
            Pendidikan & Pekerjaan
          </button>
          <button
            className={`sa-modal-tab ${activeTab === 'pelayanan_dokumen' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('pelayanan_dokumen')}
          >
            Pelayanan & Dokumen
          </button>
        </div>

        {/* BODY */}
        <div className="sa-modal-body">
          {/* TOP SUMMARY */}
          <div className="sa-detail-header">
            <div className="sa-detail-avatar">
              {member.nama_lengkap.charAt(0)}
            </div>
            <div className="sa-detail-meta">
              <h3>{member.nama_lengkap}</h3>
              <p>
                NIK: <strong>{member.nik}</strong> · {member.jenis_kelamin} · {member.nama_wilayah} · Status:{' '}
                <span className="sa-badge sa-badge-aktif" style={{ marginLeft: 4 }}>
                  {member.gerejawi?.status_keaktifan || 'Aktif'}
                </span>
              </p>
            </div>
          </div>

          {/* TAB 1: IDENTITAS PRIBADI */}
          {activeTab === 'identitas' && (
            <div className="sa-detail-grid">
              <div className="sa-detail-box">
                <span>Nama Lengkap</span>
                <strong>{member.nama_lengkap}</strong>
              </div>
              <div className="sa-detail-box">
                <span>Nomor Induk Keanggotaan (NIK)</span>
                <strong>{member.nik}</strong>
              </div>
              <div className="sa-detail-box">
                <span>Jenis Kelamin</span>
                <strong>{member.jenis_kelamin}</strong>
              </div>
              <div className="sa-detail-box">
                <span>Tempat, Tanggal Lahir</span>
                <strong>
                  {member.tmpt_lhr}, {formatIndonesianDate(member.tgl_lhr)} ({usia} tahun)
                </strong>
              </div>
              <div className="sa-detail-box">
                <span>Golongan Darah</span>
                <strong>{member.gol_darah || '-'}</strong>
              </div>
              <div className="sa-detail-box">
                <span>Status Jemaat</span>
                <strong>{member.status_jemaat}</strong>
              </div>
              <div className="sa-detail-box">
                <span>Wilayah Pelayanan</span>
                <strong>{member.nama_wilayah}</strong>
              </div>
              <div className="sa-detail-box">
                <span>Nomor WhatsApp / HP</span>
                <strong>{member.no_whatsapp || '-'}</strong>
              </div>
              <div className="sa-detail-box">
                <span>Email Akun Pengguna</span>
                <strong>{member.user?.email || '-'}</strong>
              </div>
            </div>
          )}

          {/* TAB 2: KELUARGA & ANGGOTA KK */}
          {activeTab === 'keluarga' && (
            <div>
              <div className="sa-detail-grid" style={{ marginBottom: 20 }}>
                <div className="sa-detail-box">
                  <span>Nomor Kartu Keluarga (No KK)</span>
                  <strong>{member.no_kk || '-'}</strong>
                </div>
                <div className="sa-detail-box">
                  <span>Nama Kepala Keluarga</span>
                  <strong>{family?.nama_kepala_keluarga || '-'}</strong>
                </div>
                <div className="sa-detail-box">
                  <span>Status dlm Keluarga</span>
                  <strong>{member.hubungan_keluarga || 'Anggota'}</strong>
                </div>
                <div className="sa-detail-box">
                  <span>Jumlah Anggota di KK</span>
                  <strong>{familyMembersList.length} Orang</strong>
                </div>
                <div className="sa-detail-box" style={{ gridColumn: 'span 2' }}>
                  <span>Alamat Lengkap</span>
                  <strong>
                    {family?.alamat
                      ? `${family.alamat}, RT ${family.rt || '-'}/RW ${family.rw || '-'}, Kel. ${family.desa || '-'}, Dusun ${family.dusun || '-'}, Kec. ${family.kecamatan || '-'}, ${family.kabupaten || '-'}, ${family.provinsi || '-'} ${family.kode_pos || ''}`
                      : 'Alamat belum diisi'}
                  </strong>
                </div>
              </div>

              <h4 style={{ fontSize: 14, margin: '16px 0 10px', color: '#1e293b' }}>
                Daftar Anggota Keluarga dalam KK Ini ({familyMembersList.length} Orang)
              </h4>
              <div className="sa-table-responsive" style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}>
                <table className="sa-table">
                  <thead>
                    <tr>
                      <th>Nama Anggota</th>
                      <th>NIK</th>
                      <th>Hubungan dlm KK</th>
                      <th>Usia</th>
                      <th>Status Keaktifan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {familyMembersList.map((famMem) => (
                      <tr key={famMem.nik}>
                        <td>
                          <strong>{famMem.nama_lengkap}</strong>
                          {famMem.nik === member.nik && (
                            <span style={{ fontSize: 11, color: '#0284c7', marginLeft: 6 }}>(Sedang Dilihat)</span>
                          )}
                        </td>
                        <td>{famMem.nik}</td>
                        <td>{famMem.hubungan_keluarga || '-'}</td>
                        <td>{calculateAge(famMem.tgl_lhr)} thn</td>
                        <td>
                          <span className="sa-badge sa-badge-aktif">
                            {famMem.gerejawi?.status_keaktifan || 'Aktif'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DATA GEREJAWI */}
          {activeTab === 'gerejawi' && (
            <div className="sa-detail-grid">
              <div className="sa-detail-box">
                <span>Status Baptis</span>
                <strong>{member.gerejawi?.status_baptis || 'Belum'}</strong>
              </div>
              <div className="sa-detail-box">
                <span>Tanggal Baptis</span>
                <strong>{formatIndonesianDate(member.gerejawi?.tgl_baptis)}</strong>
              </div>
              <div className="sa-detail-box">
                <span>Status Sidi</span>
                <strong>{member.gerejawi?.status_sidi || 'Belum'}</strong>
              </div>
              <div className="sa-detail-box">
                <span>Tanggal Sidi</span>
                <strong>{formatIndonesianDate(member.gerejawi?.tgl_sidi)}</strong>
              </div>
              <div className="sa-detail-box">
                <span>Status Pernikahan</span>
                <strong>{member.gerejawi?.status_pernikahan || 'Belum menikah'}</strong>
              </div>
              <div className="sa-detail-box">
                <span>Tanggal & Usia Pernikahan</span>
                <strong>
                  {member.gerejawi?.status_pernikahan === 'Menikah' && member.gerejawi?.tgl_pernikahan
                    ? `${formatIndonesianDate(member.gerejawi.tgl_pernikahan)} (${usiaNikah} tahun)`
                    : '-'}
                </strong>
              </div>
              <div className="sa-detail-box">
                <span>Status Keaktifan</span>
                <strong>{member.gerejawi?.status_keaktifan || 'Aktif'}</strong>
              </div>
            </div>
          )}

          {/* TAB 4: PENDIDIKAN & PEKERJAAN */}
          {activeTab === 'pendidikan_pekerjaan' && (
            <div>
              <h4 style={{ fontSize: 14, margin: '0 0 12px', color: '#1e293b' }}>Pendidikan Terakhir</h4>
              <div className="sa-detail-grid" style={{ marginBottom: 20 }}>
                <div className="sa-detail-box">
                  <span>Jenjang Pendidikan</span>
                  <strong>{member.pendidikan?.pendidikan_terakhir || '-'}</strong>
                </div>
                <div className="sa-detail-box">
                  <span>Nama Sekolah / Universitas</span>
                  <strong>{member.pendidikan?.nama_sekolah || '-'}</strong>
                </div>
                <div className="sa-detail-box">
                  <span>Tahun Kelulusan</span>
                  <strong>{member.pendidikan?.thn_lulus || '-'}</strong>
                </div>
              </div>

              <h4 style={{ fontSize: 14, margin: '16px 0 12px', color: '#1e293b' }}>Pekerjaan & Karir</h4>
              <div className="sa-detail-grid">
                <div className="sa-detail-box">
                  <span>Profesi / Pekerjaan</span>
                  <strong>{member.pekerjaan?.pekerjaan || '-'}</strong>
                </div>
                <div className="sa-detail-box">
                  <span>Instansi / Lembaga</span>
                  <strong>{member.pekerjaan?.instansi || '-'}</strong>
                </div>
                <div className="sa-detail-box">
                  <span>Jabatan</span>
                  <strong>{member.pekerjaan?.jabatan || '-'}</strong>
                </div>
                <div className="sa-detail-box">
                  <span>Penghasilan per Bulan</span>
                  <strong>{formatRupiah(member.pekerjaan?.penghasilan)}</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PELAYANAN & DOKUMEN */}
          {activeTab === 'pelayanan_dokumen' && (
            <div>
              <h4 style={{ fontSize: 14, margin: '0 0 12px', color: '#1e293b' }}>Riwayat Pelayanan Gereja</h4>
              {(!member.riwayat_pelayanan || member.riwayat_pelayanan.length === 0) ? (
                <p style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic', marginBottom: 20 }}>
                  Tidak ada riwayat pelayanan gerejawi yang tercatat.
                </p>
              ) : (
                <div className="sa-table-responsive" style={{ border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 20 }}>
                  <table className="sa-table">
                    <thead>
                      <tr>
                        <th>Bidang Pelayanan</th>
                        <th>Tahun Mulai</th>
                        <th>Tahun Selesai</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {member.riwayat_pelayanan.map((ply, idx) => (
                        <tr key={ply.id_pelayanan || idx}>
                          <td><strong>{ply.nama_pelayanan}</strong></td>
                          <td>{ply.thn_mulai}</td>
                          <td>{ply.thn_berakhir || 'Sekarang'}</td>
                          <td>
                            <span className="sa-badge sa-badge-aktif">
                              {ply.thn_berakhir ? 'Selesai' : 'Aktif Melayani'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <h4 style={{ fontSize: 14, margin: '16px 0 12px', color: '#1e293b' }}>Dokumen Terlampir</h4>
              {(!member.dokumen || member.dokumen.length === 0) ? (
                <p style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic' }}>
                  Tidak ada dokumen terlampir.
                </p>
              ) : (
                <div className="sa-detail-grid">
                  {member.dokumen.map((dok, idx) => (
                    <div className="sa-detail-box" key={dok.id_dokumen || idx}>
                      <span>{dok.jenis_dokumen}</span>
                      <strong>📄 {dok.file_path || 'dokumen.pdf'}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="sa-modal-footer">
          <button className="sa-btn-primary" type="button" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
