import React from 'react';
import './LandingPage.css';
import logoGkj from '../../assets/logo_gkjkg.jpg'; // Digunakan untuk background hero section

export default function LandingPage() {
    return (
        <div className="gkj-landing">
            {/* 1. Navbar / Header dengan Emoji Gereja */}
            <header className="gkj-navbar">
                <div className="navbar-brand">
                    <span className="navbar-icon">⛪</span>
                    <span className="brand-title">GKJ KOTAGEDE</span>
                </div>
                <nav className="navbar-menu">
                    <a href="#tentang">TENTANG GEREJA ▾</a>
                    <a href="#kegiatan">KEGIATAN ▾</a>
                    <a href="#download">DOWNLOAD ▾</a>
                    <a href="#kontak">KONTAK ▾</a>
                </nav>
            </header>

            {/* 2. Hero Section dengan Background logo_gkjkg.jpg */}
            <section className="gkj-hero">
                <div className="hero-content">
                    <span className="hero-date">KAMIS, 1 OKTOBER 2026</span>
                    <h1 className="hero-title">
                        Berakar dalam Tradisi,<br />Bertumbuh dalam Kasih.
                    </h1>
                    <p className="hero-subtitle">Gereja Kristen Jawa Kotagede</p>

                    {/* Tombol Dashboard Utama */}
                    <button
                        className="dashboard-btn"
                        onClick={() => alert('Navigasi ke halaman Login / Dashboard system!')}
                    >
                        DASHBOARD
                    </button>
                </div>
            </section>

            {/* 3. Statistik Section */}
            <section className="gkj-stats">
                <div className="stat-item">
                    <div className="stat-icon">👥</div>
                    <span className="stat-label">Pengunjung Hari Ini</span>
                    <span className="stat-value">492</span>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">📄</div>
                    <span className="stat-label">Views Hari Ini</span>
                    <span className="stat-value">667</span>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">📊</div>
                    <span className="stat-label">Pengunjung 7 Hari</span>
                    <span className="stat-value">2,837</span>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">📈</div>
                    <span className="stat-label">Total Pengunjung</span>
                    <span className="stat-value">6,303</span>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">👁️</div>
                    <span className="stat-label">Total Views</span>
                    <span className="stat-value">11,109</span>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">🕒</div>
                    <span className="stat-label">Terakhir Diperbarui</span>
                    <span className="stat-value">29 Sep 2026</span>
                </div>
            </section>
        </div>
    );
}