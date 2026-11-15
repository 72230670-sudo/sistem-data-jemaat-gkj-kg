import { useState } from 'react'
import {
  addFamily,
  addMember,
  deleteFamily,
  deleteMember,
  loadMasterData,
  updateFamily,
  updateMember,
} from '../../lib/superAdminData.js'
import './SuperAdminApp.css'

import DaftarJemaatView from './DaftarJemaatView.jsx'
import DataKeluargaView from './DataKeluargaView.jsx'
import DetailJemaatModal from './DetailJemaatModal.jsx'
import JemaatFormModal from './JemaatFormModal.jsx'

export default function SuperAdminApp({ onSwitchRole }) {
  const [data, setData] = useState(() => loadMasterData())
  // Hanya 2 menu utama sesuai tugas: 'daftar' (Data Jemaat) & 'keluarga' (Data Keluarga)
  const [activeMenu, setActiveMenu] = useState('daftar')

  // Modal State
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [viewingMember, setViewingMember] = useState(null)
  const [deletingMember, setDeletingMember] = useState(null)

  // Toast State
  const [toast, setToast] = useState(null)

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  // Handle Save (Add or Update) Jemaat
  function handleSaveJemaat(payload, oldNik = null) {
    let currentData = data

    // Jika membuat KK baru secara inline
    if (payload._newFamily) {
      try {
        currentData = addFamily(currentData, payload._newFamily)
      } catch (err) {
        showToast(err.message, 'error')
        return
      }
    }

    try {
      let updatedData
      if (oldNik) {
        updatedData = updateMember(currentData, oldNik, payload)
        showToast(`Data jemaat ${payload.nama_lengkap} berhasil diperbarui.`)
      } else {
        updatedData = addMember(currentData, payload)
        showToast(`Data jemaat baru ${payload.nama_lengkap} berhasil ditambahkan.`)
      }
      setData(updatedData)
      setEditingMember(null)
      setFormModalOpen(false)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  // Handle Delete Jemaat
  function confirmDeleteMember() {
    if (!deletingMember) return
    try {
      const updated = deleteMember(data, deletingMember.nik)
      setData(updated)
      showToast(`Data jemaat ${deletingMember.nama_lengkap} berhasil dihapus.`)
      setDeletingMember(null)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  // Handle Family CRUD
  function handleAddFamily(famData) {
    const updated = addFamily(data, famData)
    setData(updated)
    showToast(`Kartu Keluarga ${famData.no_kk} berhasil ditambahkan.`)
  }

  function handleUpdateFamily(no_kk, famData) {
    const updated = updateFamily(data, no_kk, famData)
    setData(updated)
    showToast(`Kartu Keluarga ${no_kk} berhasil diperbarui.`)
  }

  function handleDeleteFamily(no_kk) {
    if (confirm(`Yakin ingin menghapus Kartu Keluarga ${no_kk}?`)) {
      try {
        const updated = deleteFamily(data, no_kk)
        setData(updated)
        showToast(`Kartu Keluarga ${no_kk} berhasil dihapus.`)
      } catch (err) {
        showToast(err.message, 'error')
      }
    }
  }

  function handleAddMemberToFamily(family) {
    setEditingMember({ no_kk: family?.no_kk || '' })
    setFormModalOpen(true)
  }

  return (
    <div className="sa-app-layout">
      {/* SIDEBAR NAVIGATION: HANYA DATA JEMAAT & DATA KELUARGA */}
      <aside className="sa-sidebar">
        <div className="sa-sidebar-header">
          <div className="sa-sidebar-logo">⛪</div>
          <div className="sa-sidebar-brand">
            <h2>Data Jemaat</h2>
            <p>GKJ Kotagede</p>
          </div>
        </div>

        <nav className="sa-sidebar-nav">
          <button
            className={`sa-nav-item ${activeMenu === 'daftar' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveMenu('daftar')}
          >
            <span className="sa-nav-icon">👥</span>
            <span>Data Jemaat</span>
          </button>

          <button
            className="sa-nav-item"
            type="button"
            onClick={() => {
              setEditingMember(null)
              setFormModalOpen(true)
            }}
          >
            <span className="sa-nav-icon">➕</span>
            <span>Tambah Jemaat</span>
          </button>

          <button
            className={`sa-nav-item ${activeMenu === 'keluarga' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveMenu('keluarga')}
          >
            <span className="sa-nav-icon">🏠</span>
            <span>Data Keluarga</span>
          </button>
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="sa-sidebar-footer">
          <div className="sa-user-badge">
            <div className="sa-user-avatar">SA</div>
            <div className="sa-user-info">
              <strong>Super Administrator</strong>
              <span>Super Admin</span>
            </div>
          </div>
          <div className="sa-footer-actions">
            <button
              className="sa-btn-subtle"
              type="button"
              onClick={() => showToast('Sesi aktif sebagai Super Administrator GKJ Kotagede.')}
            >
              🔒 Super Admin
            </button>
            <button
              className="sa-btn-subtle"
              type="button"
              onClick={() => {
                if (onSwitchRole) onSwitchRole('jemaat')
                else showToast('Keluar dari sesi Super Administrator.')
              }}
            >
              🚪 Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEW AREA */}
      <main className="sa-main-content">
        {/* TOPBAR */}
        <header className="sa-topbar">
          <div className="sa-page-title">
            <h1>
              {activeMenu === 'daftar' && 'Master Data Jemaat'}
              {activeMenu === 'keluarga' && 'Pengelolaan Master Data Keluarga'}
            </h1>
            <p>
              {activeMenu === 'daftar' &&
                'CRUD Master Data Identitas (NIK, TTL, Alamat dll), Data Gerejawi, Data Pendidikan & Pekerjaan'}
              {activeMenu === 'keluarga' &&
                'Mengelola Kepala Keluarga, Hubungan Keluarga, Status dalam Keluarga, dan Jumlah Anggota Keluarga'}
            </p>
          </div>

          <div className="sa-topbar-actions">
            <span className="sa-badge-role">Super Admin</span>
            {onSwitchRole && (
              <button
                className="sa-btn-secondary"
                type="button"
                onClick={() => onSwitchRole('jemaat')}
                style={{ fontSize: 12, padding: '6px 12px' }}
              >
                Lihat Portal Jemaat ↗
              </button>
            )}
          </div>
        </header>

        {/* CONTAINER CONTENT */}
        <div className="sa-container">
          {activeMenu === 'daftar' && (
            <DaftarJemaatView
              data={data}
              onAddJemaat={() => {
                setEditingMember(null)
                setFormModalOpen(true)
              }}
              onViewJemaat={(m) => setViewingMember(m)}
              onEditJemaat={(m) => {
                setEditingMember(m)
                setFormModalOpen(true)
              }}
              onDeleteJemaat={(m) => setDeletingMember(m)}
            />
          )}

          {activeMenu === 'keluarga' && (
            <DataKeluargaView
              data={data}
              onAddFamily={handleAddFamily}
              onUpdateFamily={handleUpdateFamily}
              onDeleteFamily={handleDeleteFamily}
              onAddMemberToFamily={handleAddMemberToFamily}
              onViewMember={(m) => setViewingMember(m)}
            />
          )}
        </div>
      </main>

      {/* MODAL FORM TAMBAH / EDIT JEMAAT */}
      {formModalOpen && (
        <JemaatFormModal
          isOpen={formModalOpen}
          initialData={editingMember}
          families={data.families}
          onClose={() => {
            setFormModalOpen(false)
            setEditingMember(null)
          }}
          onSave={handleSaveJemaat}
        />
      )}

      {/* MODAL DETAIL JEMAAT LENGKAP */}
      {viewingMember && (
        <DetailJemaatModal
          isOpen={Boolean(viewingMember)}
          member={viewingMember}
          family={data.families.find((f) => f.no_kk === viewingMember.no_kk)}
          allMembers={data.members}
          onClose={() => setViewingMember(null)}
        />
      )}

      {/* MODAL KONFIRMASI HAPUS JEMAAT */}
      {deletingMember && (
        <div className="sa-modal-overlay">
          <div className="sa-modal modal-sm">
            <div className="sa-modal-header">
              <h2>Konfirmasi Hapus Data</h2>
              <button className="sa-modal-close" type="button" onClick={() => setDeletingMember(null)}>
                ✕
              </button>
            </div>
            <div className="sa-modal-body">
              <p style={{ margin: 0, fontSize: 14, color: '#334155' }}>
                Apakah Anda yakin ingin menghapus data master jemaat <strong>{deletingMember.nama_lengkap}</strong> (NIK:{' '}
                {deletingMember.nik})?
              </p>
              <p style={{ fontSize: 12, color: '#ef4444', marginTop: 8 }}>
                Tindakan ini akan menghapus seluruh data identitas, data gerejawi, pendidikan, dan pekerjaan jemaat ini.
              </p>
            </div>
            <div className="sa-modal-footer">
              <button className="sa-btn-secondary" type="button" onClick={() => setDeletingMember(null)}>
                Batal
              </button>
              <button
                className="sa-btn-primary"
                type="button"
                style={{ backgroundColor: '#dc2626' }}
                onClick={confirmDeleteMember}
              >
                Hapus Jemaat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST FEEDBACK */}
      {toast && (
        <div className={`sa-toast ${toast.type}`}>
          {toast.type === 'error' ? '⚠️' : '✓'} {toast.message}
        </div>
      )}
    </div>
  )
}
