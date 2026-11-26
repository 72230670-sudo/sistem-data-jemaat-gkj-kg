import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './DashboardAdminWilayah.css';

const NAMA_BULAN = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DashboardAdminWilayah = () => {
    const navigate = useNavigate();

    // State Identitas Admin & Wilayah
    const [currentUserId, setCurrentUserId] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [adminWilayah, setAdminWilayah] = useState({ id_wil: null, nama_wilayah: 'Memuat...' });

    // State Data & Navigasi
    const [activeTab, setActiveTab] = useState('dashboard');
    const [jemaatList, setJemaatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    // State Pencarian & Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterUltah, setFilterUltah] = useState(false);

    // State Modal Detail & Edit Terbatas
    const [selectedJemaat, setSelectedJemaat] = useState(null);
    const [editingJemaat, setEditingJemaat] = useState(null);
    const [saving, setSaving] = useState(false);

    const bulanSekarang = new Date().getMonth() + 1; // 1 - 12
    const namaBulanSekarang = NAMA_BULAN[bulanSekarang - 1];

    useEffect(() => {
        checkUserAndFetchData();
    }, []);

    const checkUserAndFetchData = async () => {
        setLoading(true);
        setErrorMsg('');

        // 1. Cek sesi login dari Supabase Auth
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            navigate('/login');
            return;
        }

        setCurrentUserId(session.user.id);
        setUserEmail(session.user.email);

        // 2. Pastikan role akun adalah adminWilayah
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id_user', session.user.id)
            .single();

        if (userError || userData?.role !== 'adminWilayah') {
            setErrorMsg('Akses ditolak: Akun ini tidak memiliki hak akses Admin Wilayah.');
            setLoading(false);
            return;
        }

        // 3. Ambil id_wil dan nama_wilayah milik admin dari tabel jemaat -> wilayah
        const { data: adminProfile, error: profileError } = await supabase
            .from('jemaat')
            .select(`
                id_wil,
                wilayah (
                    id_wil,
                    nama_wilayah
                )
            `)
            .eq('id_user', session.user.id)
            .single();

        if (profileError || !adminProfile?.id_wil) {
            setErrorMsg('Data wilayah admin tidak ditemukan. Pastikan akun terhubung dengan data jemaat dan wilayah.');
            setLoading(false);
            return;
        }

        const currentIdWil = adminProfile.id_wil;
        setAdminWilayah({
            id_wil: currentIdWil,
            nama_wilayah: adminProfile.wilayah?.nama_wilayah || `Wilayah ${currentIdWil}`,
        });

        // 4. Ambil daftar jemaat khusus untuk id_wil admin ini saja
        await fetchJemaatByWilayah(currentIdWil);
        setLoading(false);
    };

    const fetchJemaatByWilayah = async (idWil) => {
        const { data, error } = await supabase
            .from('jemaat')
            .select(`
                nik,
                id_wil,
                no_kk,
                id_user,
                nama_lengkap,
                jenis_kelamin,
                tmpt_lhr,
                tgl_lhr,
                gol_darah,
                no_hp,
                status_jemaat,
                foto,
                keluarga (
                    nama_kepala_keluarga,
                    alamat,
                    rt,
                    rw
                ),
                gerejawi (*)
            `)
            .eq('id_wil', idWil)
            .order('nama_lengkap', { ascending: true });

        if (error) {
            console.error('Gagal mengambil data jemaat:', error.message);
            setErrorMsg(`Gagal memuat data: ${error.message}`);
        } else {
            setJemaatList(data || []);
        }
    };

    // Fungsi Logout
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    // Helper parsing tanggal lahir (YYYY-MM-DD) tanpa terpengaruh zona waktu
    const parseTanggalLahir = (tglStr) => {
        if (!tglStr) return null;
        const parts = tglStr.split('-');
        if (parts.length !== 3) return null;
        return {
            tahun: parseInt(parts[0], 10),
            bulan: parseInt(parts[1], 10),
            hari: parseInt(parts[2], 10),
        };
    };

    const formatTanggalIndo = (tglStr, denganTahun = true) => {
        const parsed = parseTanggalLahir(tglStr);
        if (!parsed) return '-';
        const bulanText = NAMA_BULAN[parsed.bulan - 1] || '';
        return denganTahun
            ? `${parsed.hari} ${bulanText} ${parsed.tahun}`
            : `${parsed.hari} ${bulanText}`;
    };

    const hitungUsia = (tglStr) => {
        const parsed = parseTanggalLahir(tglStr);
        if (!parsed) return null;
        const today = new Date();
        let usia = today.getFullYear() - parsed.tahun;
        const selisihBulan = (today.getMonth() + 1) - parsed.bulan;
        if (selisihBulan < 0 || (selisihBulan === 0 && today.getDate() < parsed.hari)) {
            usia--;
        }
        return usia;
    };

    const isUlangTahunBulanIni = (tglStr) => {
        const parsed = parseTanggalLahir(tglStr);
        if (!parsed) return false;
        return parsed.bulan === bulanSekarang;
    };

    // Helper status gerejawi (Baptis/Sidi)
    const getStatusGerejawi = (jemaat) => {
        const g = Array.isArray(jemaat.gerejawi) ? jemaat.gerejawi[0] : jemaat.gerejawi;
        if (!g) return 'Belum tercatat';
        if (g.tgl_sidi || g.status_sidi) return 'Sudah Sidi';
        if (g.tgl_baptis || g.status_baptis) return 'Sudah Baptis';
        return g.jenis_sakramen || g.status || 'Tercatat';
    };

    // Helper alamat lengkap dari relasi tabel keluarga
    const getAlamatLengkap = (jemaat) => {
        if (!jemaat.keluarga) return '-';
        const { alamat, rt, rw } = jemaat.keluarga;
        const rtrw = rt || rw ? ` (RT ${rt || '-'}/RW ${rw || '-'})` : '';
        return `${alamat || '-'}${rtrw}`;
    };

    // Daftar jemaat yang berulang tahun di bulan berjalan (diurutkan berdasarkan tanggal)
    const jemaatUltahBulanIni = jemaatList
        .filter((j) => isUlangTahunBulanIni(j.tgl_lhr))
        .sort((a, b) => {
            const pa = parseTanggalLahir(a.tgl_lhr);
            const pb = parseTanggalLahir(b.tgl_lhr);
            return (pa?.hari || 0) - (pb?.hari || 0);
        });

    // Filter pencarian & dropdown pada tabel utama
    const filteredJemaat = jemaatList.filter((item) => {
        const keyword = searchTerm.toLowerCase();
        const matchSearch =
            item.nama_lengkap?.toLowerCase().includes(keyword) ||
            item.nik?.toLowerCase().includes(keyword) ||
            item.no_kk?.toLowerCase().includes(keyword);

        const matchGender = filterGender ? item.jenis_kelamin === filterGender : true;
        const matchStatus = filterStatus ? item.status_jemaat === filterStatus : true;
        const matchUltah = filterUltah ? isUlangTahunBulanIni(item.tgl_lhr) : true;

        return matchSearch && matchGender && matchStatus && matchUltah;
    });

    // Statistik Demografi Wilayah
    const totalJemaat = jemaatList.length;
    const totalKK = new Set(jemaatList.map((j) => j.no_kk).filter(Boolean)).size;
    const totalLaki = jemaatList.filter((j) => j.jenis_kelamin === 'Laki-laki' || j.jenis_kelamin === 'L').length;
    const totalPerempuan = jemaatList.filter((j) => j.jenis_kelamin === 'Perempuan' || j.jenis_kelamin === 'P').length;

    // Rincian Kelompok Usia / Kategorial Gereja
    const kategoriUsia = {
        anak: 0,       // 0 - 12 tahun
        remajaPemuda: 0, // 13 - 25 tahun
        dewasa: 0,     // 26 - 59 tahun
        adiyuswa: 0,   // >= 60 tahun
        belumDiisi: 0,
    };

    jemaatList.forEach((j) => {
        const usia = hitungUsia(j.tgl_lhr);
        if (usia === null || usia < 0) {
            kategoriUsia.belumDiisi++;
        } else if (usia <= 12) {
            kategoriUsia.anak++;
        } else if (usia <= 25) {
            kategoriUsia.remajaPemuda++;
        } else if (usia <= 59) {
            kategoriUsia.dewasa++;
        } else {
            kategoriUsia.adiyuswa++;
        }
    });

    // Rincian Status Sakramen / Gerejawi
    const statSudahSidi = jemaatList.filter((j) => getStatusGerejawi(j) === 'Sudah Sidi').length;
    const statSudahBaptis = jemaatList.filter((j) => getStatusGerejawi(j) === 'Sudah Baptis').length;
    const statBelumSakramen = totalJemaat - statSudahSidi - statSudahBaptis;

    // Rincian Status Keanggotaan
    const totalAktif = jemaatList.filter((j) => j.status_jemaat === 'Aktif').length;
    const totalTidakAktif = jemaatList.filter((j) => j.status_jemaat === 'Tidak Aktif').length;
    const totalPindah = jemaatList.filter((j) => j.status_jemaat === 'Pindah').length;

    // Ekspor Laporan ke CSV (Excel)
    const handleExportExcel = () => {
        if (filteredJemaat.length === 0) {
            alert('Tidak ada data jemaat untuk diekspor.');
            return;
        }

        const headers = [
            'No',
            'NIK',
            'No KK',
            'Nama Lengkap',
            'Jenis Kelamin',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Usia (Tahun)',
            'Golongan Darah',
            'No WhatsApp / HP',
            'Status Jemaat',
            'Status Gerejawi',
            'Alamat',
        ];

        const rows = filteredJemaat.map((j, idx) => {
            const usia = hitungUsia(j.tgl_lhr);
            return [
                idx + 1,
                `"${j.nik || ''}"`,
                `"${j.no_kk || ''}"`,
                `"${j.nama_lengkap || ''}"`,
                `"${j.jenis_kelamin || ''}"`,
                `"${j.tmpt_lhr || ''}"`,
                `"${j.tgl_lhr || ''}"`,
                usia !== null ? usia : '-',
                `"${j.gol_darah || ''}"`,
                `"${j.no_hp || ''}"`,
                `"${j.status_jemaat || ''}"`,
                `"${getStatusGerejawi(j)}"`,
                `"${getAlamatLengkap(j).replace(/"/g, '""')}"`,
            ];
        });

        const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Laporan_Jemaat_${adminWilayah.nama_wilayah.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Simpan perubahan Edit Data Jemaat
    const handleUpdateJemaat = async (e) => {
        e.preventDefault();
        if (!editingJemaat) return;

        setSaving(true);
        const { error } = await supabase
            .from('jemaat')
            .update({
                nama_lengkap: editingJemaat.nama_lengkap,
                jenis_kelamin: editingJemaat.jenis_kelamin,
                tmpt_lhr: editingJemaat.tmpt_lhr,
                tgl_lhr: editingJemaat.tgl_lhr || null,
                gol_darah: editingJemaat.gol_darah,
                no_hp: editingJemaat.no_hp || null,
                status_jemaat: editingJemaat.status_jemaat,
            })
            .eq('nik', editingJemaat.nik)
            .eq('id_wil', adminWilayah.id_wil);

        setSaving(false);

        if (error) {
            alert(`Gagal menyimpan perubahan: ${error.message}`);
            return;
        }

        await fetchJemaatByWilayah(adminWilayah.id_wil);
        setEditingJemaat(null);
        alert('Data jemaat berhasil diperbarui.');
    };

    // Hapus Data Jemaat
    const handleDeleteJemaat = async (jemaat) => {
        if (jemaat.id_user && jemaat.id_user === currentUserId) {
            alert('Tidak dapat menghapus data jemaat yang terhubung langsung dengan akun Admin Wilayah Anda sendiri.');
            return;
        }

        const konfirmasi = window.confirm(
            `Yakin ingin menghapus data jemaat "${jemaat.nama_lengkap}" (NIK: ${jemaat.nik})?`
        );
        if (!konfirmasi) return;

        const { error } = await supabase
            .from('jemaat')
            .delete()
            .eq('nik', jemaat.nik)
            .eq('id_wil', adminWilayah.id_wil);

        if (error) {
            alert(`Gagal menghapus data: ${error.message}`);
            return;
        }

        await fetchJemaatByWilayah(adminWilayah.id_wil);
        alert('Data jemaat berhasil dihapus.');
    };

    // Kirim Ucapan WhatsApp langsung ke nomor HP jemaat
    const handleKirimWA = (jemaat) => {
        if (!jemaat.no_hp) {
            alert(`Nomor WhatsApp untuk ${jemaat.nama_lengkap} belum diisi. Silakan lengkapi melalui tombol Edit.`);
            return;
        }

        let nomor = jemaat.no_hp.replace(/\D/g, '');
        if (nomor.startsWith('0')) {
            nomor = '62' + nomor.slice(1);
        }

        const pesan = `Shalom ${jemaat.nama_lengkap}, salam kasih dari pengurus ${adminWilayah.nama_wilayah} GKJ. Selamat berulang tahun, Tuhan Yesus memberkati senantiasa.`;
        window.open(`https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`, '_blank', 'noopener,noreferrer');
    };

    // Komponen Bar Grafik Horizontal
    const renderStatBar = (label, count, colorClass = 'bar-blue') => {
        const persen = totalJemaat > 0 ? Math.round((count / totalJemaat) * 100) : 0;
        return (
            <div className="stat-bar-item" key={label}>
                <div className="stat-bar-label">
                    <span>{label}</span>
                    <span>
                        <strong>{count}</strong> orang ({persen}%)
                    </span>
                </div>
                <div className="stat-bar-track">
                    <div
                        className={`stat-bar-fill ${colorClass}`}
                        style={{ width: `${persen}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="admin-layout">
            {/* Sidebar Navigasi */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>GKJ {adminWilayah.nama_wilayah}</h2>
                    <span className="badge-role">Admin Wilayah</span>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Dashboard & Data Jemaat
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'statistik' ? 'active' : ''}`}
                        onClick={() => setActiveTab('statistik')}
                    >
                        Rekap Statistik Wilayah
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <p className="user-info">{userEmail}</p>
                    <button onClick={handleLogout} className="btn-logout">Keluar / Logout</button>
                </div>
            </aside>

            {/* Konten Utama */}
            <main className="main-content">
                <header className="top-header">
                    <div>
                        <h1>Dashboard {adminWilayah.nama_wilayah}</h1>
                        <p>Pantau demografi dan kelola biodata warga jemaat di wilayah pelayanan Anda.</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-primary btn-export" onClick={handleExportExcel}>
                            Ekspor Excel (CSV)
                        </button>
                        <button className="btn-primary btn-print" onClick={() => window.print()}>
                            Cetak / PDF
                        </button>
                    </div>
                </header>

                {errorMsg && (
                    <div className="alert-error">
                        {errorMsg}
                    </div>
                )}

                {/* Kartu Statistik Ringkas */}
                <section className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Warga Jemaat</h3>
                        <p className="stat-number">{totalJemaat}</p>
                        <span className="stat-desc">Terdaftar di {adminWilayah.nama_wilayah}</span>
                    </div>
                    <div className="stat-card">
                        <h3>Total Kepala Keluarga</h3>
                        <p className="stat-number">{totalKK}</p>
                        <span className="stat-desc">Nomor KK terdaftar</span>
                    </div>
                    <div className="stat-card">
                        <h3>Jemaat Laki-laki</h3>
                        <p className="stat-number">{totalLaki}</p>
                        <span className="stat-desc">Warga pria</span>
                    </div>
                    <div className="stat-card">
                        <h3>Jemaat Perempuan</h3>
                        <p className="stat-number">{totalPerempuan}</p>
                        <span className="stat-desc">Warga wanita</span>
                    </div>
                </section>

                {/* Tab 1: Tabel Data Jemaat */}
                {activeTab === 'dashboard' && (
                    <section className="table-section">
                        <div className="table-header">
                            <h2>Daftar Warga Jemaat</h2>
                            <div className="filter-controls">
                                <button
                                    type="button"
                                    className={`btn-ultah-filter ${filterUltah ? 'active' : ''}`}
                                    onClick={() => setFilterUltah(!filterUltah)}
                                    title={`Tampilkan warga yang berulang tahun pada bulan ${namaBulanSekarang}`}
                                >
                                    Ultah {namaBulanSekarang} ({jemaatUltahBulanIni.length})
                                </button>

                                <select
                                    className="filter-select"
                                    value={filterGender}
                                    onChange={(e) => setFilterGender(e.target.value)}
                                >
                                    <option value="">Semua Gender</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>

                                <select
                                    className="filter-select"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                    <option value="Pindah">Pindah</option>
                                </select>

                                <input
                                    type="text"
                                    placeholder="Cari nama, NIK, atau No. KK..."
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <p className="loading-text">Memuat data jemaat dari database...</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="jemaat-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Nama Lengkap</th>
                                            <th>Jenis Kelamin</th>
                                            <th>Status Baptis/Sidi</th>
                                            <th>Alamat / Blok</th>
                                            <th className="col-aksi">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredJemaat.length > 0 ? (
                                            filteredJemaat.map((jemaat, index) => {
                                                const ultahBulanIni = isUlangTahunBulanIni(jemaat.tgl_lhr);
                                                return (
                                                    <tr key={jemaat.nik}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <div className="nama-row">
                                                                <strong>{jemaat.nama_lengkap || '-'}</strong>
                                                                {ultahBulanIni && (
                                                                    <span className="badge-ultah">
                                                                        🎂 {formatTanggalIndo(jemaat.tgl_lhr, false)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="nik-subtext">NIK: {jemaat.nik}</span>
                                                        </td>
                                                        <td>{jemaat.jenis_kelamin || '-'}</td>
                                                        <td>{getStatusGerejawi(jemaat)}</td>
                                                        <td>{getAlamatLengkap(jemaat)}</td>
                                                        <td className="action-buttons col-aksi">
                                                            <button
                                                                className="btn-edit"
                                                                onClick={() => setEditingJemaat({ ...jemaat })}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn-detail"
                                                                onClick={() => setSelectedJemaat(jemaat)}
                                                            >
                                                                Detail
                                                            </button>
                                                            <button
                                                                className="btn-delete"
                                                                onClick={() => handleDeleteJemaat(jemaat)}
                                                            >
                                                                Hapus
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="empty-state">
                                                    Tidak ada data jemaat yang sesuai dengan pencarian atau filter.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {/* Tab 2: Rekap Statistik Wilayah dengan Grafik Batang */}
                {activeTab === 'statistik' && (
                    <section className="table-section">
                        <div className="table-header">
                            <h2>Rekap Demografi {adminWilayah.nama_wilayah}</h2>
                            <span className="stat-subtitle">Total Populasi: {totalJemaat} Warga</span>
                        </div>

                        <div className="stats-detail-grid">
                            {/* Grafik 1: Kelompok Usia / Kategorial Gereja */}
                            <div className="detail-stat-card">
                                <h4>Kelompok Usia / Kategorial Gereja</h4>
                                {renderStatBar('Anak / Sekolah Minggu (0–12 th)', kategoriUsia.anak, 'bar-sky')}
                                {renderStatBar('Remaja & Pemuda (13–25 th)', kategoriUsia.remajaPemuda, 'bar-indigo')}
                                {renderStatBar('Dewasa (26–59 th)', kategoriUsia.dewasa, 'bar-blue')}
                                {renderStatBar('Adiyuswa / Lansia (≥ 60 th)', kategoriUsia.adiyuswa, 'bar-amber')}
                                {kategoriUsia.belumDiisi > 0 &&
                                    renderStatBar('Tanggal Lahir Belum Diisi', kategoriUsia.belumDiisi, 'bar-slate')}
                            </div>

                            {/* Grafik 2: Status Sakramen (Baptis & Sidi) */}
                            <div className="detail-stat-card">
                                <h4>Status Sakramen (Baptis & Sidi)</h4>
                                {renderStatBar('Sudah Sidi', statSudahSidi, 'bar-emerald')}
                                {renderStatBar('Sudah Baptis', statSudahBaptis, 'bar-blue')}
                                {renderStatBar('Belum Tercatat', statBelumSakramen, 'bar-slate')}
                            </div>

                            {/* Grafik 3: Proporsi Jenis Kelamin */}
                            <div className="detail-stat-card">
                                <h4>Proporsi Jenis Kelamin</h4>
                                {renderStatBar('Laki-laki', totalLaki, 'bar-blue')}
                                {renderStatBar('Perempuan', totalPerempuan, 'bar-pink')}
                            </div>

                            {/* Grafik 4: Status Keanggotaan */}
                            <div className="detail-stat-card">
                                <h4>Status Keanggotaan</h4>
                                {renderStatBar('Jemaat Aktif', totalAktif, 'bar-emerald')}
                                {renderStatBar('Tidak Aktif', totalTidakAktif, 'bar-amber')}
                                {renderStatBar('Pindah Wilayah / Gereja', totalPindah, 'bar-slate')}
                            </div>

                            {/* Grafik 5: Sebaran Golongan Darah */}
                            <div className="detail-stat-card">
                                <h4>Sebaran Golongan Darah</h4>
                                {['A', 'B', 'AB', 'O'].map((gol) => {
                                    const jumlahGol = jemaatList.filter(
                                        (j) => j.gol_darah?.toUpperCase() === gol
                                    ).length;
                                    return renderStatBar(`Golongan Darah ${gol}`, jumlahGol, 'bar-rose');
                                })}
                            </div>

                            {/* Kartu 6: Daftar Ulang Tahun Bulan Berjalan */}
                            <div className="detail-stat-card">
                                <h4>Warga Berulang Tahun Bulan {namaBulanSekarang}</h4>
                                {jemaatUltahBulanIni.length > 0 ? (
                                    <div className="ultah-list">
                                        {jemaatUltahBulanIni.map((warga) => (
                                            <div className="ultah-item" key={warga.nik}>
                                                <div>
                                                    <strong>{warga.nama_lengkap}</strong>
                                                    <span className="ultah-date">
                                                        {formatTanggalIndo(warga.tgl_lhr, false)} (Ke-{hitungUsia(warga.tgl_lhr)} th)
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn-wa-mini col-aksi"
                                                    onClick={() => handleKirimWA(warga)}
                                                >
                                                    💬 Kirim WA
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="empty-ultah">
                                        Tidak ada warga yang berulang tahun pada bulan {namaBulanSekarang}.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Modal Detail Jemaat */}
                {selectedJemaat && (
                    <div className="modal-overlay" onClick={() => setSelectedJemaat(null)}>
                        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                            <h3>Detail Data Jemaat</h3>
                            <div className="detail-grid">
                                <p><strong>NIK:</strong> {selectedJemaat.nik}</p>
                                <p><strong>No. KK:</strong> {selectedJemaat.no_kk || '-'}</p>
                                <p><strong>Kepala Keluarga:</strong> {selectedJemaat.keluarga?.nama_kepala_keluarga || '-'}</p>
                                <p><strong>Nama Lengkap:</strong> {selectedJemaat.nama_lengkap}</p>
                                <p><strong>Jenis Kelamin:</strong> {selectedJemaat.jenis_kelamin || '-'}</p>
                                <p>
                                    <strong>Tempat, Tgl Lahir:</strong> {selectedJemaat.tmpt_lhr || '-'},{' '}
                                    {formatTanggalIndo(selectedJemaat.tgl_lhr, true)}
                                    {hitungUsia(selectedJemaat.tgl_lhr) !== null && ` (${hitungUsia(selectedJemaat.tgl_lhr)} th)`}
                                </p>
                                <p><strong>Golongan Darah:</strong> {selectedJemaat.gol_darah || '-'}</p>
                                <p><strong>No. WhatsApp / HP:</strong> {selectedJemaat.no_hp || '-'}</p>
                                <p><strong>Status Jemaat:</strong> {selectedJemaat.status_jemaat || '-'}</p>
                                <p><strong>Status Gerejawi:</strong> {getStatusGerejawi(selectedJemaat)}</p>
                                <p><strong>Alamat:</strong> {getAlamatLengkap(selectedJemaat)}</p>
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-wa"
                                    onClick={() => handleKirimWA(selectedJemaat)}
                                >
                                    💬 Kirim Ucapan WA
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setSelectedJemaat(null)}
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Edit Terbatas (Admin Wilayah) */}
                {editingJemaat && (
                    <div className="modal-overlay" onClick={() => setEditingJemaat(null)}>
                        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                            <h3>Edit Biodata Jemaat</h3>
                            <p className="modal-subtitle">
                                Kolom NIK, Wilayah, dan No. KK dikunci (hanya dapat diubah oleh Super Admin).
                            </p>
                            <form onSubmit={handleUpdateJemaat} className="modal-form">
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>NIK (Terkunci)</label>
                                        <input type="text" value={editingJemaat.nik} disabled className="form-input form-input-disabled" />
                                    </div>
                                    <div className="form-group">
                                        <label>No. KK (Terkunci)</label>
                                        <input type="text" value={editingJemaat.no_kk || '-'} disabled className="form-input form-input-disabled" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Nama Lengkap</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingJemaat.nama_lengkap || ''}
                                        onChange={(e) => setEditingJemaat({ ...editingJemaat, nama_lengkap: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>Jenis Kelamin</label>
                                        <select
                                            value={editingJemaat.jenis_kelamin || ''}
                                            onChange={(e) => setEditingJemaat({ ...editingJemaat, jenis_kelamin: e.target.value })}
                                            className="form-input"
                                        >
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Golongan Darah</label>
                                        <select
                                            value={editingJemaat.gol_darah || ''}
                                            onChange={(e) => setEditingJemaat({ ...editingJemaat, gol_darah: e.target.value })}
                                            className="form-input"
                                        >
                                            <option value="">-</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="AB">AB</option>
                                            <option value="O">O</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>Tempat Lahir</label>
                                        <input
                                            type="text"
                                            value={editingJemaat.tmpt_lhr || ''}
                                            onChange={(e) => setEditingJemaat({ ...editingJemaat, tmpt_lhr: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Tanggal Lahir</label>
                                        <input
                                            type="date"
                                            value={editingJemaat.tgl_lhr || ''}
                                            onChange={(e) => setEditingJemaat({ ...editingJemaat, tgl_lhr: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>No. WhatsApp / HP</label>
                                        <input
                                            type="tel"
                                            placeholder="Contoh: 081234567890"
                                            value={editingJemaat.no_hp || ''}
                                            onChange={(e) => setEditingJemaat({ ...editingJemaat, no_hp: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Status Jemaat</label>
                                        <select
                                            value={editingJemaat.status_jemaat || 'Aktif'}
                                            onChange={(e) => setEditingJemaat({ ...editingJemaat, status_jemaat: e.target.value })}
                                            className="form-input"
                                        >
                                            <option value="Aktif">Aktif</option>
                                            <option value="Tidak Aktif">Tidak Aktif</option>
                                            <option value="Pindah">Pindah</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setEditingJemaat(null)}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="btn-primary"
                                    >
                                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DashboardAdminWilayah;