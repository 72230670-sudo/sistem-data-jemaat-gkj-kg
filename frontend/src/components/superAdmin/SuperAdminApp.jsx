import { useState } from 'react'
import {
  addFamily,
  addMember,
  deleteFamily,
  deleteMember,
  generateWhatsAppMessage,
  generateWhatsAppUrl,
  loadMasterData,
  saveMasterData,
  updateFamily,
  updateMember,
} from '../../lib/superAdminData.js'
import './SuperAdminApp.css'

import DaftarJemaatView from './DaftarJemaatView.jsx'
import DashboardView from './DashboardView.jsx'
import DataKeluargaView from './DataKeluargaView.jsx'
import DetailJemaatModal from './DetailJemaatModal.jsx'
import JemaatFormModal from './JemaatFormModal.jsx'
import KelolaPenggunaView from './KelolaPenggunaView.jsx'
import TemplateWAView from './TemplateWAView.jsx'

export default function SuperAdminApp({ onSwitchRole }) {
  const [data, setData] = useState(() => loadMasterData())
  const [activeMenu, setActiveMenu] = useState('dashboard') // 'dashboard' | 'daftar' | 'keluarga' | 'wa' | 'pengguna'

  // Modal State
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [viewingMember, setViewingMember] = useState(null)
  const [deletingMember, setDeletingMember] = useState(null)

  // WhatsApp send preview modal state
  const [waModalData, setWaModalData] = useState(null) // { member, type, text, phone }

  // Toast State
  const [toast, setToast] = useState(null) // { message, type }

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
        showToast(`Jemaat baru ${payload.nama_lengkap} berhasil ditambahkan.`)
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

  // Handle Template WA
  function handleSaveTemplates(newTemplates) {
    const updated = { ...data, wa_templates: newTemplates }
    setData(updated)
    saveMasterData(updated)
    showToast('Template ucapan WhatsApp berhasil disimpan.')
  }

  function handleResetTemplates() {
    const updated = { ...data, wa_templates: null }
    setData(updated)
    saveMasterData(updated)
    showToast('Template WhatsApp dikembalikan ke bawaan.')
  }

  // Handle Send WA Dialog
  function handleTriggerWA(member, type = 'lahir') {
    const template = type === 'lahir' ? data.wa_templates?.ultah_lahir : data.wa_templates?.ultah_nikah
    const text = generateWhatsAppMessage(template, member, type)
    setWaModalData({
      member,
      type,
      text,
      phone: member.no_whatsapp || '',
    })
  }

  function handleSendWA() {
    if (!waModalData?.phone) {
      alert('Nomor WhatsApp jemaat belum terdaftar.')
      return
    }
    const url = generateWhatsAppUrl(waModalData.phone, waModalData.text)
    window.open(url, '_blank', 'noopener,noreferrer')
    setWaModalData(null)
    showToast('Membuka tautan kirim pesan WhatsApp.')
  }

  // Handle User Role
  function handleUpdateUserRole(id_user, newRole) {
    const updatedUsers = (data.users || []).map((u) =>
      u.id_user === id_user ? { ...u, role: newRole } : u
    )
    const updatedMembers = data.members.map((m) => {
      if (m.user && m.user.id_user === id_user) {
        return {
          ...m,
          user: { ...m.user, role: newRole },
        }
      }
      return m
    })
    const updated = { ...data, users: updatedUsers, members: updatedMembers }
    setData(updated)
    saveMasterData(updated)
    showToast(`Role pengguna diperbarui menjadi "${newRole}".`)
  }

  function handleAddUser(newUser) {
    const updatedUsers = [...(data.users || []), newUser]
    const updated = { ...data, users: updatedUsers }
    setData(updated)
    saveMasterData(updated)
    showToast(`Akun pengguna ${newUser.email} berhasil dibuat.`)
  }

  return (
    <div className="sa-app-layout">
      {/* SIDEBAR NAVIGATION SESUAI TAMPILAN SISTEM */}
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
            className={`sa-nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveMenu('dashboard')}
          >
            <span className="sa-nav-icon">📊</span>
            <span>Dashboard</span>
          </button>

          <button
            className={`sa-nav-item ${activeMenu === 'daftar' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveMenu('daftar')}
          >
            <span className="sa-nav-icon">👥</span>
            <span>Daftar Jemaat</span>
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

          <button
            className={`sa-nav-item ${activeMenu === 'wa' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveMenu('wa')}
          >
            <span className="sa-nav-icon">💬</span>
            <span>Template WA</span>
          </button>

          <button
            className={`sa-nav-item ${activeMenu === 'pengguna' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveMenu('pengguna')}
          >
            <span className="sa-nav-icon">⚙️</span>
            <span>Kelola Pengguna</span>
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
              onClick={() => showToast('Fitur ganti kata sandi siap diintegrasikan dengan Supabase Auth.')}
            >
              🔑 Sandi
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
              {activeMenu === 'dashboard' && 'Ringkasan Dashboard'}
              {activeMenu === 'daftar' && 'Master Data Jemaat'}
              {activeMenu === 'keluarga' && 'Pengelolaan Master Data Keluarga'}
              {activeMenu === 'wa' && 'Kelola Template Pesan WhatsApp'}
              {activeMenu === 'pengguna' && 'Kelola Hak Akses Pengguna'}
            </h1>
            <p>
              {activeMenu === 'dashboard' && 'Statistik demografi, ulang tahun hari ini, dan keaktifan jemaat GKJ Kotagede'}
              {activeMenu === 'daftar' && 'CRUD Data Identitas, Gerejawi, Pendidikan, dan Pekerjaan Jemaat'}
              {activeMenu === 'keluarga' && 'Kelola Kepala Keluarga, hubungan keluarga, status & jumlah anggota KK'}
              {activeMenu === 'wa' && 'Template pesan ucapan ulang tahun lahir dan hari ulang tahun pernikahan'}
              {activeMenu === 'pengguna' && 'Daftar akun login dan perizinan hak akses sistem'}
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
          {activeMenu === 'dashboard' && (
            <DashboardView
              data={data}
              onNavigate={(menu) => setActiveMenu(menu)}
              onSendWA={handleTriggerWA}
            />
          )}

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

          {activeMenu === 'wa' && (
            <TemplateWAView
              data={data}
              onSaveTemplates={handleSaveTemplates}
              onResetTemplates={handleResetTemplates}
            />
          )}

          {activeMenu === 'pengguna' && (
            <KelolaPenggunaView
              data={data}
              onUpdateUserRole={handleUpdateUserRole}
              onAddUser={handleAddUser}
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

      {/* MODAL PRATINJAU & KIRIM WHATSAPP */}
      {waModalData && (
        <div className="sa-modal-overlay">
          <div className="sa-modal">
            <div className="sa-modal-header">
              <h2>
                {waModalData.type === 'lahir'
                  ? '🎂 Kirim Ucapan Ulang Tahun Lahir'
                  : '❤️ Kirim Ucapan Ulang Tahun Pernikahan'}
              </h2>
              <button className="sa-modal-close" type="button" onClick={() => setWaModalData(null)}>
                ✕
              </button>
            </div>
            <div className="sa-modal-body">
              <div className="sa-form-group" style={{ marginBottom: 14 }}>
                <label className="sa-form-label">Tujuan (Nama & Nomor WhatsApp)</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    className="sa-input"
                    type="text"
                    disabled
                    style={{ width: '50%' }}
                    value={waModalData.member.nama_lengkap}
                  />
                  <input
                    className="sa-input"
                    type="tel"
                    style={{ width: '50%' }}
                    placeholder="Nomor WA (contoh: 081234567890)"
                    value={waModalData.phone}
                    onChange={(e) => setWaModalData({ ...waModalData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="sa-form-group">
                <label className="sa-form-label">Isi Pesan WhatsApp</label>
                <textarea
                  className="sa-textarea"
                  rows={6}
                  style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
                  value={waModalData.text}
                  onChange={(e) => setWaModalData({ ...waModalData, text: e.target.value })}
                />
              </div>
            </div>
            <div className="sa-modal-footer">
              <button className="sa-btn-secondary" type="button" onClick={() => setWaModalData(null)}>
                Batal
              </button>
              <button
                className="sa-btn-wa"
                type="button"
                style={{ padding: '8px 16px', fontSize: 13 }}
                onClick={handleSendWA}
              >
                💬 Kirim via WhatsApp Sekarang
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
