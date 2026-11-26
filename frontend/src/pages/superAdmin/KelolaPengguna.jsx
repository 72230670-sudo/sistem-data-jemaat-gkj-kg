import React, { useState} from "react";
import './KelolaPengguna.css'; //impor file css karena beda file

export default function KelolaPengguna() {
    const [users, setUsers] = useState([
        {id:1, username: 'admin', nama:'Administrator', role:'Super Admin', status:'Aktif'},
        {id:2, username: 'admin1', nama:'Admin Wilayah 1', role:'Admin Wilayah', status:'Aktif'},
        {id:3, username: 'admin2', nama:'Admin Wilayah 2', role:'Admin Wilayah', status:'Aktif'},
        {id:4, username: 'admin3', nama:'Admin Wilayah 3', role:'Admin Wilayah', status:'Aktif'},
    ]);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ username: '', nama: '', role: 'Admin Wilayah', password: '' });

    const handleOpenModal = () => setShowModal(true);   
    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newUser = {
            id: users.length + 1,
            ...formData,
            status: 'Aktif',
        };
        setUsers([...users, newUser]);

        // kode ini untuk mereset form data setelah submit, agar form kosong kembali
        setFormData({ username:'', nama:'', role:'Admin Wilayah', password:''});
        // kode ini untuk menutup modal setelah submit
        setShowModal(false);
    };

    const handleDelete = (id, username) => {
        if (username === 'admin') {
            alert('Akun Super Admin tidak dapat dihapus.');
            return;
        }
        if (window.confirm(`Apakah Anda yakin ingin menghapus akun ${username}?`)) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    const handleEdit = (id, username) => {
        alert(`Fungsi edit untuk pengguna dengan ID ${id} dan username ${username} belum diimplementasikan.`);
    }
    const handleResetPassword = (id) => {
      alert(`Password untuk pengguna dengan ID ${id} telah direset.`);
    };

    return (
    <div className="kelola-container">
      {/* Header Halaman */}
      <div className="kelola-header-row">
        <h2 className="kelola-title">Kelola Pengguna</h2>
        <button className="kelola-btn-add" onClick={handleOpenModal}>
          + Tambah Pengguna
        </button>
      </div>

      {/* Tabel Data Pengguna */}
      <div className="kelola-table-wrapper">
        <table className="kelola-table">
          <thead>
            <tr className="kelola-th-row">
              <th className="kelola-th">Username</th>
              <th className="kelola-th">Nama</th>
              <th className="kelola-th">Role / Hak Akses</th>
              <th className="kelola-th">Status</th>
              <th className="kelola-th-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="kelola-tr">
                <td className="kelola-td">{user.username}</td>
                <td className="kelola-td">{user.nama}</td>
                <td className="kelola-td">
                  <span className="kelola-badge-role">{user.role}</span>
                </td>
                <td className="kelola-td">
                  <span className="kelola-badge-status">{user.status}</span>
                </td>
                <td className="kelola-td-center">
                <div className="btn-action-wrapper">
                  {/* Tombol Edit */}
                <button className="btn-icon-box btn-edit" title="Edit Pengguna" 
                onClick={() => handleEdit(user.id, user.username)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6" stroke="none">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                </button>

                {/* Tombol Reset Password */}
                <button className="btn-icon-box btn-key" title="Reset Sandi" onClick={() => handleResetPassword(user.id)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                    <path d="M12.65 10C11.7 7.31 9.08 5.5 6 5.5c-3.31 0-6 2.69-6 6s2.69 6 6 6c3.08 0 5.7-1.81 6.65-4.5H18v3h3v-3h3v-3h-7.35zM6 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
                </button>

                {/* Tombol Hapus (Hanya untuk non-admin */}
                {user.username !== 'admin' && (
                <button className="btn-icon-box btn-delete" onClick={() => handleDelete(user.id)} title="Hapus">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444" stroke="none">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
                )}          
                </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Pengguna */}
      {showModal && (
        <div className="kelola-modal-overlay">
          <div className="kelola-modal-content">
            <h3>Tambah Pengguna Baru</h3>
            <form onSubmit={handleSubmit} className="kelola-form">
              <div className="kelola-form-group">
                <label className="kelola-label">Username</label>
                <input
                  type="text"
                  required
                  className="kelola-input"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Masukkan username..."
                />
              </div>
              <div className="kelola-form-group">
                <label className="kelola-label">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  className="kelola-input"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Masukkan nama lengkap..."
                />
              </div>
              <div className="kelola-form-group">
                <label className="kelola-label">Hak Akses (Role)</label>
                <select
                  className="kelola-input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin Wilayah">Admin Wilayah</option>
                  <option value="Majelis / Pimpinan">Majelis / Pimpinan</option>
                </select>
              </div>
              <div className="kelola-form-group">
                <label className="kelola-label">Kata Sandi</label>
                <input
                  type="password"
                  required
                  className="kelola-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="********"
                />
              </div>
              <div className="kelola-modal-actions">
                <button type="button" className="kelola-btn-cancel" onClick={handleCloseModal}>Batal</button>
                <button type="submit" className="kelola-btn-save">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    );
}