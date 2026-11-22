import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pengguna');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nik: '',
        tanggalLahir: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showTanggalLahir, setShowTanggalLahir] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Konversi input tanggal lahir (YYYYMMDD / DDMMYYYY / YYYY-MM-DD) ke format PostgreSQL date (YYYY-MM-DD)
    const formatTanggalLahir = (input) => {
        const clean = input.trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
        if (/^\d{8}$/.test(clean)) {
            if (clean.startsWith('19') || clean.startsWith('20')) {
                return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`;
            }
            return `${clean.slice(4, 8)}-${clean.slice(2, 4)}-${clean.slice(0, 2)}`;
        }
        return clean;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (activeTab === 'pengguna') {
            // === LOGIKA LOGIN PENGGUNA / ADMIN (Supabase Auth) ===
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: formData.username.trim(),
                    password: formData.password
                });

                if (error) throw error;

                // Cek role akun di tabel users
                const { data: userProfile, error: roleError } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id_user', data.user.id)
                    .single();

                if (roleError || !userProfile) {
                    throw new Error('Data role akun tidak ditemukan di tabel users.');
                }

                if (userProfile.role === 'adminWilayah') {
                    navigate('/admin-wilayah');
                } else if (userProfile.role === 'superAdmin') {
                    navigate('/super-admin');
                } else {
                    navigate('/admin-wilayah');
                }
            } catch (error) {
                alert('Gagal login: ' + error.message);
            } finally {
                setLoading(false);
            }
        } else {
            // === LOGIKA LOGIN JEMAAT (Mencocokkan NIK & tgl_lhr di Database) ===
            try {
                const formattedDate = formatTanggalLahir(formData.tanggalLahir);

                const { data, error } = await supabase
                    .from('jemaat')
                    .select('*')
                    .eq('nik', formData.nik.trim())
                    .eq('tgl_lhr', formattedDate)
                    .single();

                if (error || !data) {
                    throw new Error('NIK atau Tanggal Lahir tidak terdaftar.');
                }

                localStorage.setItem('jemaatSession', JSON.stringify(data));
                alert(`Selamat datang, ${data.nama_lengkap || 'Jemaat'}!`);
                // navigate('/dashboard-jemaat');
            } catch (error) {
                alert('Login Jemaat Gagal: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Header Logo & Judul */}
                <div className="auth-header">
                    <div className="auth-icon-church">⛪</div>
                    <h2>Sistem Data Jemaat</h2>
                    <p>Pilih jenis akun untuk masuk</p>
                </div>

                {/* Tab Switcher (Pengguna vs Jemaat) */}
                <div className="auth-tabs">
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === 'pengguna' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pengguna')}
                    >
                        👤 Pengguna
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === 'jemaat' ? 'active' : ''}`}
                        onClick={() => setActiveTab('jemaat')}
                    >
                        🪪 Jemaat (NIK)
                    </button>
                </div>

                {/* Form Input */}
                <form onSubmit={handleSubmit} className="auth-form">
                    {activeTab === 'pengguna' ? (
                        /* Form untuk Pengguna / Admin */
                        <>
                            <div className="input-group">
                                <label>Username / Email</label>
                                <div className="input-field-wrapper">
                                    <span className="input-icon">👤</span>
                                    <input
                                        type="email"
                                        name="username"
                                        placeholder="Masukkan email pengguna"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <div className="input-field-wrapper">
                                    <span className="input-icon">🔒</span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Masukkan password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="eye-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? '👁️‍🗨️' : '👁️'}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Form untuk Jemaat (Berdasarkan NIK & Tanggal Lahir) */
                        <>
                            <div className="input-group">
                                <label>NIK (10 Digit)</label>
                                <div className="input-field-wrapper">
                                    <span className="input-icon">🪪</span>
                                    <input
                                        type="text"
                                        name="nik"
                                        maxLength="10"
                                        placeholder="Masukkan 10 digit NIK Anda"
                                        value={formData.nik}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Tanggal Lahir (Sebagai Password)</label>
                                <div className="input-field-wrapper">
                                    <span className="input-icon">🔒</span>
                                    <input
                                        type={showTanggalLahir ? 'text' : 'password'}
                                        name="tanggalLahir"
                                        placeholder="YYYYMMDD (Contoh: 19900517)"
                                        value={formData.tanggalLahir}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="eye-btn"
                                        onClick={() => setShowTanggalLahir(!showTanggalLahir)}
                                    >
                                        {showTanggalLahir ? '👁️‍🗨️' : '👁️'}
                                    </button>
                                </div>
                                <small className="input-hint">
                                    ℹ️ Password jemaat adalah Tanggal Lahir (contoh: 19900517).
                                </small>
                            </div>
                        </>
                    )}

                    {/* Tombol Masuk Universal */}
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>
            </div>
        </div>
    );
}