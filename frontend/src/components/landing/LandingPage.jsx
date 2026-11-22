import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="gkj-landing">
            {/* 1. Navbar / Header */}
            <header className="gkj-navbar">
                <div className="navbar-brand">
                    <span className="navbar-icon">⛪</span>
                    <span className="brand-title">GKJ KOTAGEDE</span>
                </div>
                <nav className="navbar-menu">
                    <div
                        className="dropdown-container"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <a href="#tentang" className="dropdown-toggle">TENTANG GEREJA ▾</a>
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <a href="#sambutan">Sambutan Gereja</a>
                                <a href="#sejarah">Sejarah Gereja</a>
                                <a href="#visi">Visi dan Misi</a>
                                <a href="#tata">Tata Gereja</a>
                                <a href="#struktur">Struktur Organisasi</a>
                                <a href="#pendeta">Pendeta dan Majelis</a>
                            </div>
                        )}
                    </div>
                    <a href="#kegiatan">KEGIATAN ▾</a>
                    <a href="#download">DOWNLOAD ▾</a>
                    <a href="#kontak">KONTAK ▾</a>
                </nav>
            </header>

            {/* 2. Hero Section */}
            <section className="gkj-hero">
                <div className="hero-content">
                    <span className="hero-date">KAMIS, 1 OKTOBER 2026</span>
                    <h1 className="hero-title">
                        Berakar dalam Tradisi,<br />Bertumbuh dalam Kasih.
                    </h1>
                    <p className="hero-subtitle">Gereja Kristen Jawa Kotagede</p>
                    <button
                        className="dashboard-btn"
                        onClick={() => navigate('/login')}
                    >
                        DASHBOARD
                    </button>
                </div>
            </section>

            {/* 3. Statistik Section */}
            <section className="gkj-stats">
                <div className="stat-item">
                    <div className="stat-icon1">👥</div>
                    <span className="stat-label">Pengunjung Hari Ini</span>
                    <span className="stat-value">492</span>
                </div>
                <div className="stat-item">
                    <div className="stat-icon2">📄</div>
                    <span className="stat-label">Views Hari Ini</span>
                    <span className="stat-value">667</span>
                </div>
                <div className="stat-item">
                    <div className="stat-icon3">📊</div>
                    <span className="stat-label">Pengunjung 7 Hari</span>
                    <span className="stat-value">2,837</span>
                </div>
                <div className="stat-item">
                    <div className="stat-icon4">📈</div>
                    <span className="stat-label">Total Pengunjung</span>
                    <span className="stat-value">6,303</span>
                </div>
                <div className="stat-item">
                    <div className="stat-icon5">👁️</div>
                    <span className="stat-label">Total Views</span>
                    <span className="stat-value">11,109</span>
                </div>
                <div className="stat-item">
                    <div className="stat-icon6">🕒</div>
                    <span className="stat-label">Terakhir Diperbarui</span>
                    <span className="stat-value">29 Sep 2026</span>
                </div>
            </section>

            {/* 4. Sambutan Majelis Gereja */}
            <section id="sambutan" className="section-container sambutan-section">
                <div className="sambutan-grid">
                    <div className="pastor-card">
                        <div className="pastor-image-placeholder">
                            {/* Tempat Foto Pendeta / Majelis */}
                        </div>
                        <div className="pastor-badge">“Rumah bagi Semua”</div>
                    </div>
                    <div className="sambutan-text">
                        <h2 className="section-heading">Sambutan Majelis Gereja</h2>
                        <p>
                            Sugeng Rawuh Website bukan sekadar media digital, tetapi menjadi sarana komunikasi, informasi, dan pelayanan yang dapat menjangkau jemaat kapan pun dan di mana pun. Salam sejahtera dalam kasih Tuhan Yesus Kristus. Puji syukur kami panjatkan kepada Tuhan Yang Maha Esa atas penyertaan dan kasih-Nya, sehingga website GKJ Kotagede kini hadir dengan wajah baru melalui penataan dan pembaruan yang lebih baik...
                        </p>
                        <a href="#tentang-kami" className="text-link">SELENGKAPNYA TENTANG KAMI</a>
                    </div>
                </div>
            </section>

            {/* 5. Tentang Gereja (Sejarah, Visi Misi, Tata Gereja) */}
            <section id="tentang" className="section-container tentang-section">
                <div className="center-header">
                    <h2 className="section-heading">Tentang Gereja</h2>
                </div>
                <div className="cards-grid-3">
                    <div className="info-card">
                        <div className="card-img-placeholder"></div>
                        <div className="card-icon-small">📜</div>
                        <h3>Sejarah Gereja</h3>
                        <p>Sejarah Singkat GKJ Kotagede</p>
                        <a href="#sejarah" className="card-action">BUKA →</a>
                    </div>
                    <div id="visi" className="info-card highlight-card">
                        <div className="card-icon-small">👁️</div>
                        <h3>Visi dan Misi</h3>
                        <p>Visi Kami Menjadi Gereja Yang Menghadirkan Damai Sejahtera Misi Kami 1. Mengupayakan pembaruan hidup... tercinta.</p>
                        <a href="#visi-misi" className="card-action">BUKA →</a>
                    </div>
                    <div id="tata" className="info-card">
                        <div className="card-icon-small">⚖️</div>
                        <h3>Tata Gereja Tata Laksana</h3>
                        <p>GKJ Kotagede berpegang teguh pada Tata Gereja dan Tata Laksana Gereja-gereja Kristen Jawa.</p>
                        <a href="#tata-gereja" className="card-action">BUKA →</a>
                    </div>
                </div>
            </section>

            {/* 6. Jadwal Ibadah & Lokasi */}
            <section className="section-container jadwal-lokasi-section">
                <div className="jadwal-lokasi-box">
                    <div className="jadwal-col">
                        <h2>Jadwal Ibadah Hari Minggu</h2>
                        <div className="jadwal-row">
                            <span className="j-icon">📖</span>
                            <div>
                                <strong>IBADAH MINGGU PAGI</strong>
                                <p className="j-time">06.30</p>
                                <span className="j-lang">Bahasa Jawa</span>
                            </div>
                        </div>
                        <div className="jadwal-row">
                            <span className="j-icon">⏰</span>
                            <div>
                                <strong>IBADAH MINGGU SIANG</strong>
                                <p className="j-time">09.00</p>
                                <span className="j-lang">Bahasa Indonesia</span>
                            </div>
                        </div>
                        <div className="jadwal-row">
                            <span className="j-icon">😊</span>
                            <div>
                                <strong>IBADAH MINGGU SORE</strong>
                                <p className="j-time">18.00</p>
                                <span className="j-lang">Bahasa Indonesia</span>
                            </div>
                        </div>
                    </div>
                    <div className="lokasi-col">
                        <div className="lokasi-pin">📍Lokasi Ibadah </div>

                        <p>Jl. Depokan II No.184 Prenggan Kec, Prenggan, Kec. Kotagede, Kota Yogyakarta, Daerah Istimewa Yogyakarta 5517</p>
                        <button className="lokasi-btn">PETUNJUK LOKASI</button>
                    </div>
                </div>
            </section>

            {/* 7. Informasi Terbaru */}
            <section id="kegiatan" className="section-container info-terbaru-section">
                <div className="header-flex">
                    <div>
                        <h2>Informasi Terbaru</h2>
                        <p>Update terkini mengenai kehidupan menggereja di Kotagede.</p>
                    </div>
                    <a href="#semua-info" className="text-link">LIHAT SEMUA</a>
                </div>
                <div className="cards-grid-3">
                    <div className="news-card">
                        <div className="news-img img-1"></div>
                        <span className="news-category">BERITA & INFORMASI</span>
                        <h3>REKRUTMEN TENAGA PELAYANAN KESEHATAN</h3>
                        <span className="news-date">SEPTEMBER 26, 2026</span>
                        <a href="#baca" className="card-action">SELENGKAPNYA →</a>
                    </div>
                    <div className="news-card">
                        <div className="news-img img-2"></div>
                        <span className="news-category">BERITA KEGIATAN</span>
                        <h3>LAYANAN KONSELING PSIKOLOGI JEMAAT</h3>
                        <span className="news-date">SEPTEMBER 26, 2026</span>
                        <a href="#baca" className="card-action">SELENGKAPNYA →</a>
                    </div>
                    <div className="news-card">
                        <div className="news-img img-3"></div>
                        <span className="news-category">BERITA KEGIATAN</span>
                        <h3>HARI PEKABARAN INJIL DI INDONESIA (HPII) & HARI PERJAMUAN KUDUS SEDUNIA (HPKD)</h3>
                        <span className="news-date">SEPTEMBER 26, 2026</span>
                        <a href="#baca" className="card-action">SELENGKAPNYA →</a>
                    </div>
                </div>
            </section>

            {/* 8. Warta Gereja & Agenda */}
            <section id="download" className="section-container warta-section">
                <div className="center-header">
                    <h2>Warta Gereja</h2>
                    <p>Informasi rutin dan agenda pelayanan jemaat pekan ini.</p>
                </div>
                <div className="warta-grid-2">
                    <div className="warta-card-pdf">
                        <div className="pdf-date-box">
                            <span className="pdf-month">SEP</span>
                            <span className="pdf-day">27</span>
                        </div>
                        <div>
                            <h3>Warta Jemaat, Minggu 27-09-2026</h3>
                            <a href="#pdf" className="pdf-download-link">UNDUH PDF 📥</a>
                        </div>
                    </div>
                    <div className="agenda-card-box">
                        <div className="agenda-icon">📅</div>
                        <div>
                            <h3>Agenda Kegiatan Jemaat</h3>
                            <p>Lihat jadwal lengkap kegiatan komisi, kelompok kecil, dan pertemuan rutin lainnya di kalender gereja.</p>
                            <a href="#kalender" className="card-action">BUKA KALENDER 📅</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. Menjadi Jemaat & Persembahan */}
            <section className="section-container action-banner-section">
                <div className="center-header">
                    <h2>Jadilah Bagian dari Kami</h2>
                    <p>Pintu kami selalu terbuka untuk Anda. Mari bersama-sama menyebarkan kasih dan damai sejahtera di Kotagede dan sekitarnya.</p>
                </div>
                <div className="action-cards-2">
                    <div className="action-box">
                        <span className="action-big-icon">👤+</span>
                        <h3>Menjadi Jemaat</h3>
                        <p>Ingin bergabung menjadi anggota resmi GKJ KOTAGEDE?</p>
                        <button className="dashboard-btn" onClick={() => navigate('/login')}>DAFTAR SEKARANG</button>
                    </div>
                    <div className="action-box">
                        <span className="action-big-icon">🤲</span>
                        <h3>Persembahan</h3>
                        <p>Saluran berkat untuk mendukung pelayanan pekerjaan Tuhan.</p>
                        <button className="dashboard-btn" onClick={() => navigate('/login')}>SALURKAN SEKARANG</button>
                    </div>
                </div>
            </section>

            {/* 10. Footer */}
            <footer id="kontak" className="gkj-footer">
                <div className="footer-grid">
                    <div className="footer-col-info">
                        <h3>GKJ KOTAGEDE</h3>
                        <p>Jl. Depokan II No.184 Prenggan Kec, Prenggan, Kec. Kotagede, Kota Yogyakarta, Daerah Istimewa Yogyakarta 5517</p>
                        <p>Telepon: 0274-375010</p>
                        <p>Email: gkjkotagede184@gmail.com</p>
                        <div className="footer-socials">
                            <span>🌐</span>
                            <span>📷</span>
                            <span>▶️</span>
                            <span>💬</span>
                        </div>
                    </div>
                    <div className="footer-col-links">
                        <h4>JELAJAHI</h4>
                        <ul>
                            <li><a href="#tentang">Tentang Gereja</a></li>
                            <li><a href="#kegiatan">Kegiatan</a></li>
                            <li><a href="#download">Download</a></li>
                            <li><a href="#kontak">Kontak</a></li>
                        </ul>
                    </div>
                    <div className="footer-col-contact">
                        <h4>IBADAH & KONTAK</h4>
                        <p><strong>Ibadah Minggu Pagi</strong> — 06.30</p>
                        <p><strong>Ibadah Minggu Siang</strong> — 09.00</p>
                        <p><strong>Ibadah Minggu Sore</strong> — 18.00</p>
                        <button className="wa-btn">💬 HUBUNGI VIA WHATSAPP</button>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 GKJ KOTAGEDE. Segala kemuliaan bagi Tuhan.</p>
                </div>
            </footer>
        </div>
    );
}