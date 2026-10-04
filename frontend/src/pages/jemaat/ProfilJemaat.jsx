import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ProfilJemaat({ userSession }) {
  // --- STATE NAVIGASI WARGA ---
  const [activeMenu, setActiveMenu] = useState('profil'); // Tab bawah: Profil atau Cari Jemaat

  // --- STATE DATA (Berdasarkan ERD KP-ERD_FIX) ---
  const [loading, setLoading] = useState(true);
  const [anggotaKeluarga, setAnggotaKeluarga] = useState([]);
  const [selectedNIK, setSelectedNIK] = useState('');
  const [jemaat, setJemaat] = useState(null);
  const [persembahan, setPersembahan] = useState([]);
  
  // --- STATE MODAL EDIT (Tanpa tombol Hapus) ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editField, setEditField] = useState({ key: '', label: '', value: '', table: 'Jemaat' });

  // --- STATE PENCARIAN (Akses Terbatas) ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchDataJemaat();
  }, [userSession]);

  // 1. FUNGSI AMBIL DATA PROFIL & KELUARGA
  const fetchDataJemaat = async () => {
    try {
      setLoading(true);
      // NIK Session login warga jemaat
      const targetNIK = userSession?.nik || '9102010106050005'; 
      
      // Query ke tabel Jemaat, Keluarga, dan Wilayah sesuai ERD
      const { data: userData, error: userError } = await supabase
        .from('Jemaat')
        .select(`
          nik, nama_lengkap, jenis_kelamin, tmpt_lhr, tgl_lhr, gol_darah, status_jemaat, no_kk,
          Keluarga (no_kk, alamat, desa, kecamatan),
          Wilayah (nama_wilayah)
        `)
        .eq('nik', targetNIK)
        .maybeSingle();

      if (userError) throw userError;

      if (userData) {
        setJemaat(userData);
        setSelectedNIK(userData.nik);

        // Ambil data anggota satu KK untuk Dropdown JKN
        if (userData.no_kk) {
          const { data: familyData } = await supabase
            .from('Jemaat')
            .select('nik, nama_lengkap')
            .eq('no_kk', userData.no_kk);
          setAnggotaKeluarga(familyData || []);
        }

        // Ambil riwayat persembahan_bulanan
        const { data: persembahanData } = await supabase
          .from('persembahan_bulanan')
          .select('bulan, status_byr')
          .eq('nik', userData.nik)
          .eq('tahun', new Date().getFullYear());
        setPersembahan(persembahanData || []);
      }
    } catch (err) {
      console.error('Error fetching:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMember = async (e) => {
    const nikTarget = e.target.value;
    setSelectedNIK(nikTarget);
    setLoading(true);

    const { data } = await supabase
      .from('Jemaat')
      .select(`
        nik, nama_lengkap, jenis_kelamin, tmpt_lhr, tgl_lhr, gol_darah, status_jemaat, no_kk,
        Keluarga (no_kk, alamat, desa, kecamatan),
        Wilayah (nama_wilayah)
      `)
      .eq('nik', nikTarget)
      .single();
    setJemaat(data);
    
    const { data: persembahanData } = await supabase
      .from('persembahan_bulanan')
      .select('bulan, status_byr')
      .eq('nik', nikTarget)
      .eq('tahun', new Date().getFullYear());
    setPersembahan(persembahanData || []);
    
    setLoading(false);
  };

  // 2. FUNGSI EDIT DATA (Hanya Update)
  const handleOpenEdit = (fieldKey, fieldLabel, currentValue, tableName = 'Jemaat') => {
    setEditField({ key: fieldKey, label: fieldLabel, value: currentValue || '', table: tableName });
    setIsEditOpen(true);
  };

  const handleSaveUpdate = async () => {
    try {
      if (editField.table === 'Jemaat') {
        const { error } = await supabase
          .from('Jemaat')
          .update({ [editField.key]: editField.value })
          .eq('nik', jemaat.nik);
        if (error) throw error;
        setJemaat({ ...jemaat, [editField.key]: editField.value });
      } else if (editField.table === 'Keluarga') {
        const { error } = await supabase
          .from('Keluarga')
          .update({ [editField.key]: editField.value })
          .eq('no_kk', jemaat.no_kk);
        if (error) throw error;
        setJemaat({ ...jemaat, Keluarga: { ...jemaat.Keluarga, [editField.key]: editField.value } });
      }
      setIsEditOpen(false);
    } catch (err) {
      alert('Gagal memperbarui data: ' + err.message);
    }
  };

  // 3. FUNGSI PENCARIAN AKSES TERBATAS
  const handleSearchJemaat = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const { data, error } = await supabase
        .from('Jemaat')
        .select('nama_lengkap, status_jemaat, Wilayah(nama_wilayah)')
        .ilike('nama_lengkap', `%${searchQuery}%`)
        .limit(10);
      if (error) throw error;
      setSearchResults(data || []);
    } catch (err) {
      console.error('Error searching:', err.message);
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100 text-[#0081a7] font-bold">Memuat...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-slate-100 min-h-screen font-sans text-slate-800 shadow-xl border-x border-slate-200 relative pb-20">
      
      {/* HEADER (Referensi Mobile JKN) */}
      <div className="bg-gradient-to-r from-[#006bd6] to-[#004a99] text-white p-4 sticky top-0 z-10 shadow-md">
        <h1 className="font-semibold text-lg text-center">
          {activeMenu === 'profil' ? 'Perubahan Data Peserta' : 'Pencarian Warga Jemaat'}
        </h1>
      </div>

      <div className="p-4 space-y-4">
        
        {/* ========================================= */}
        {/* TAB 1: PROFIL & KK (REPLIKA MOBILE JKN) */}
        {/* ========================================= */}
        {activeMenu === 'profil' && (
          <div className="space-y-4 animate-in fade-in">
            
            {/* KARTU DIGITAL & DROPDOWN KELUARGA (Referensi 11_2.jpeg) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
              
              <select 
                value={selectedNIK}
                onChange={handleSwitchMember}
                className="w-full bg-transparent p-2 text-[14px] font-bold text-[#006bd6] focus:outline-none mb-2 border-b border-slate-100"
              >
                {anggotaKeluarga.map((item) => (
                  <option key={item.nik} value={item.nik}>
                    {item.nama_lengkap} (No KK: {jemaat?.no_kk})
                  </option>
                ))}
              </select>

              <div className="bg-[#128a64] rounded-lg p-4 text-white shadow-inner relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
                
                <div className="flex items-center gap-2 mb-4 border-b border-white/20 pb-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#128a64] font-bold text-[10px]">GKJ</div>
                  <div>
                    <p className="text-[12px] font-bold tracking-wide">KARTU JEMAAT DIGITAL</p>
                    <p className="text-[9px] text-emerald-100">Gereja Kristen Jawa Kotagede</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-[9px] text-emerald-200 uppercase">Nomor Induk Keanggotaan (NIK)</p>
                  <p className="text-[16px] font-bold tracking-widest">{jemaat?.nik || '-'}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-emerald-100 pt-2 border-t border-white/20">
                  <div>
                    <p>NAMA</p>
                    <p className="font-bold text-white uppercase truncate">{jemaat?.nama_lengkap || '-'}</p>
                  </div>
                  <div>
                    <p>WILAYAH</p>
                    <p className="font-bold text-white uppercase truncate">{jemaat?.Wilayah?.nama_wilayah || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LIST DATA DENGAN CHEVRON (Referensi 22_2.jpeg & 11_2.jpeg) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
              
              {/* Segmen Peserta (Read Only) */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-[#006bd6] font-semibold mb-1">Segmen Peserta / Status Jemaat</p>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">👤</span>
                    <p className="text-[14px] font-bold text-red-600 uppercase">{jemaat?.status_jemaat || '-'}</p>
                  </div>
                </div>
                <span className="text-slate-300 font-bold text-lg">&gt;</span>
              </div>

              {/* Golongan Darah (Editable) */}
              <div 
                onClick={() => handleOpenEdit('gol_darah', 'Golongan Darah', jemaat?.gol_darah, 'Jemaat')}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
              >
                <div>
                  <p className="text-[12px] text-[#006bd6] font-semibold mb-1">Golongan Darah</p>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">🩸</span>
                    <p className="text-[14px] font-bold text-red-600 uppercase">{jemaat?.gol_darah || '-'}</p>
                  </div>
                </div>
                <span className="text-slate-300 font-bold text-lg">&gt;</span>
              </div>

              {/* Tempat Lahir (Editable) */}
              <div 
                onClick={() => handleOpenEdit('tmpt_lhr', 'Tempat Lahir', jemaat?.tmpt_lhr, 'Jemaat')}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
              >
                <div>
                  <p className="text-[12px] text-[#006bd6] font-semibold mb-1">Tempat Lahir</p>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">📍</span>
                    <p className="text-[14px] font-bold text-red-600 uppercase">{jemaat?.tmpt_lhr || '-'}</p>
                  </div>
                </div>
                <span className="text-slate-300 font-bold text-lg">&gt;</span>
              </div>

              {/* Alamat Surat (Editable) */}
              <div 
                onClick={() => handleOpenEdit('alamat', 'Alamat Surat', jemaat?.Keluarga?.alamat, 'Keluarga')}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
              >
                <div>
                  <p className="text-[12px] text-[#006bd6] font-semibold mb-1">Alamat Surat</p>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">🏠</span>
                    <p className="text-[14px] font-bold text-red-600 uppercase line-clamp-1">{jemaat?.Keluarga?.alamat || '-'}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 ml-6 uppercase">
                    Desa: {jemaat?.Keluarga?.desa || '-'}
                  </p>
                </div>
                <span className="text-slate-300 font-bold text-lg">&gt;</span>
              </div>
            </div>

            {/* GRID PERSEMBAHAN BULANAN */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <p className="text-[12px] text-[#006bd6] font-semibold mb-3 uppercase">Status Persembahan {new Date().getFullYear()}</p>
              <div className="grid grid-cols-4 gap-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map((namaBulan, idx) => {
                  const rec = persembahan.find(p => p.bulan === idx + 1);
                  const status = rec?.status_byr || 'BELUM';
                  
                  let badgeColor = 'bg-slate-100 text-slate-400 border-slate-200';
                  if (status === 'LUNAS') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  if (status === 'TERLEWAT') badgeColor = 'bg-rose-50 text-rose-600 border-rose-200';

                  return (
                    <div key={idx} className={`p-2 rounded border text-center ${badgeColor}`}>
                      <p className="text-[11px] font-bold">{namaBulan}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: PENCARIAN AKSES TERBATAS */}
        {/* ========================================= */}
        {activeMenu === 'cari' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-[13px] font-bold text-[#006bd6] mb-1">Cari Data Warga</h2>
              <p className="text-[11px] text-slate-500 mb-4">Informasi yang ditampilkan terbatas pada Nama, Status, dan Wilayah.</p>
              
              <form onSubmit={handleSearchJemaat} className="flex gap-2">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik nama jemaat..."
                  className="flex-1 border border-slate-300 rounded-lg p-3 text-[13px] focus:outline-none focus:border-[#006bd6] bg-slate-50"
                />
                <button type="submit" disabled={isSearching} className="bg-[#006bd6] text-white px-4 py-2 rounded-lg text-[13px] font-bold">
                  {isSearching ? '...' : 'Cari'}
                </button>
              </form>
            </div>

            <div className="space-y-2">
              {searchResults.length > 0 ? (
                searchResults.map((hasil, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col gap-1">
                    <p className="text-[13px] font-bold text-slate-800 uppercase">{hasil.nama_lengkap}</p>
                    <div className="flex gap-2 text-[10px] font-semibold mt-1">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded">Wilayah: {hasil.Wilayah?.nama_wilayah || '-'}</span>
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100">{hasil.status_jemaat || 'WARGA'}</span>
                    </div>
                  </div>
                ))
              ) : (!isSearching && searchQuery && (
                <p className="text-center text-xs text-slate-500 mt-6">Data tidak ditemukan.</p>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================= */}
      {/* BOTTOM NAVIGATION (GAYA APLIKASI HP) */}
      {/* ========================================= */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 flex justify-around p-1 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <button 
          onClick={() => setActiveMenu('profil')}
          className={`flex flex-col items-center p-2 flex-1 rounded-lg transition-colors ${activeMenu === 'profil' ? 'text-[#006bd6]' : 'text-slate-400'}`}
        >
          <span className="text-xl mb-1">👤</span>
          <span className="text-[10px] font-bold">Profil</span>
        </button>
        <button 
          onClick={() => setActiveMenu('cari')}
          className={`flex flex-col items-center p-2 flex-1 rounded-lg transition-colors ${activeMenu === 'cari' ? 'text-[#006bd6]' : 'text-slate-400'}`}
        >
          <span className="text-xl mb-1">🔍</span>
          <span className="text-[10px] font-bold">Cari Data</span>
        </button>
      </div>

      {/* MODAL EDIT DATA (Update Only) */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl">
            <h3 className="font-bold text-[#006bd6] text-sm mb-4">Ubah {editField.label}</h3>
            
            <input 
              type="text" 
              value={editField.value} 
              onChange={(e) => setEditField({ ...editField, value: e.target.value })}
              className="w-full border-b-2 border-[#006bd6] p-2 text-[14px] font-bold text-slate-800 focus:outline-none mb-6 bg-slate-50 rounded-t-md"
            />
            
            <div className="flex gap-3">
              <button onClick={() => setIsEditOpen(false)} className="flex-1 py-3 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold">Batal</button>
              <button onClick={handleSaveUpdate} className="flex-1 py-3 rounded-lg bg-[#006bd6] text-white text-xs font-bold shadow-md">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}