import { useMemo } from 'react'
import {
  calculateAge,
  calculateMarriageAge,
  computeDashboardStats,
  generateWhatsAppMessage,
  generateWhatsAppUrl,
} from '../../lib/superAdminData.js'

export default function DashboardView({ data, onNavigate, onSendWA }) {
  const stats = useMemo(() => computeDashboardStats(data), [data])

  function handleQuickWA(member, type) {
    if (onSendWA) {
      onSendWA(member, type)
    } else {
      const template = type === 'lahir' ? data.wa_templates?.ultah_lahir : data.wa_templates?.ultah_nikah
      const text = generateWhatsAppMessage(template, member, type)
      const url = generateWhatsAppUrl(member.no_whatsapp, text)
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        alert('Nomor WhatsApp jemaat belum terdaftar.')
      }
    }
  }

  return (
    <div>
      {/* 4 KARTU METRIK UTAMA */}
      <section className="sa-metrics-grid">
        <div className="sa-metric-card sa-metric-blue" onClick={() => onNavigate('daftar')} style={{ cursor: 'pointer' }}>
          <div className="sa-metric-info">
            <span>Total Jemaat</span>
            <strong>{stats.totalJemaat}</strong>
          </div>
          <div className="sa-metric-icon">👥</div>
        </div>

        <div className="sa-metric-card sa-metric-green" onClick={() => onNavigate('daftar')} style={{ cursor: 'pointer' }}>
          <div className="sa-metric-info">
            <span>Jemaat Aktif</span>
            <strong>{stats.jemaatAktif}</strong>
          </div>
          <div className="sa-metric-icon">👤✓</div>
        </div>

        <div className="sa-metric-card sa-metric-amber">
          <div className="sa-metric-info">
            <span>Ultah Lahir Hari Ini</span>
            <strong>{stats.ultahLahirCount}</strong>
          </div>
          <div className="sa-metric-icon">🎂</div>
        </div>

        <div className="sa-metric-card sa-metric-rose">
          <div className="sa-metric-info">
            <span>Ultah Nikah Hari Ini</span>
            <strong>{stats.ultahNikahCount}</strong>
          </div>
          <div className="sa-metric-icon">❤️</div>
        </div>
      </section>

      {/* 2 WIDGET ULANG TAHUN */}
      <section className="sa-widgets-row">
        {/* ULANG TAHUN LAHIR */}
        <div className="sa-card">
          <div className="sa-card-header">
            <h3>🎂 Ulang Tahun Lahir Hari Ini</h3>
            <span className="sa-badge-count">{stats.ultahLahirList.length} Jemaat</span>
          </div>
          <div className="sa-card-body">
            {stats.ultahLahirList.length === 0 ? (
              <div className="sa-empty-state">Tidak ada jemaat yang berulang tahun hari ini.</div>
            ) : (
              <div className="sa-celebration-list">
                {stats.ultahLahirList.map((m) => {
                  const usia = calculateAge(m.tgl_lhr)
                  return (
                    <div className="sa-celebration-item" key={m.nik}>
                      <div className="sa-celebration-info">
                        <div className="sa-avatar-circle gold">
                          {m.nama_lengkap.charAt(0)}
                        </div>
                        <div className="sa-celebration-text">
                          <strong>{m.nama_lengkap}</strong>
                          <span>
                            Usia: {usia} thn · {m.nama_wilayah || 'Wilayah 1'} · {m.no_whatsapp ? `WA: ${m.no_whatsapp}` : 'No WA -'}
                          </span>
                        </div>
                      </div>
                      <button
                        className="sa-btn-wa"
                        type="button"
                        onClick={() => handleQuickWA(m, 'lahir')}
                        title="Kirim ucapan via WhatsApp"
                      >
                        💬 Ucapkan
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ULANG TAHUN PERNIKAHAN */}
        <div className="sa-card">
          <div className="sa-card-header">
            <h3>❤️ Ulang Tahun Pernikahan Hari Ini</h3>
            <span className="sa-badge-count">{stats.ultahNikahList.length} Pasangan</span>
          </div>
          <div className="sa-card-body">
            {stats.ultahNikahList.length === 0 ? (
              <div className="sa-empty-state">Tidak ada ulang tahun pernikahan hari ini.</div>
            ) : (
              <div className="sa-celebration-list">
                {stats.ultahNikahList.map((m) => {
                  const usiaNikah = calculateMarriageAge(m.gerejawi?.tgl_pernikahan)
                  return (
                    <div className="sa-celebration-item" key={m.nik}>
                      <div className="sa-celebration-info">
                        <div className="sa-avatar-circle rose">
                          {m.nama_lengkap.charAt(0)}
                        </div>
                        <div className="sa-celebration-text">
                          <strong>{m.nama_lengkap}</strong>
                          <span>
                            Usia Pernikahan: {usiaNikah} thn · {m.nama_wilayah} · {m.no_whatsapp ? `WA: ${m.no_whatsapp}` : 'No WA -'}
                          </span>
                        </div>
                      </div>
                      <button
                        className="sa-btn-wa"
                        type="button"
                        onClick={() => handleQuickWA(m, 'nikah')}
                        title="Kirim ucapan pernikahan via WhatsApp"
                      >
                        💬 Ucapkan
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CHARTS DEMOGRAFI */}
      <section className="sa-charts-grid">
        {/* JEMAAT PER WILAYAH */}
        <div className="sa-card">
          <div className="sa-card-header">
            <h3>🗺️ Jemaat per Wilayah Pelayanan</h3>
          </div>
          <div className="sa-card-body">
            <div className="sa-bar-chart">
              {stats.perWilayah.map((w) => {
                const percent = stats.totalJemaat ? Math.round((w.count / stats.totalJemaat) * 100) : 0
                return (
                  <div className="sa-bar-item" key={w.id_wil}>
                    <div className="sa-bar-label">
                      <span>{w.nama_wilayah}</span>
                      <strong>{w.count} org ({percent}%)</strong>
                    </div>
                    <div className="sa-bar-track">
                      <div className="sa-bar-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* JEMAAT PER KELOMPOK USIA */}
        <div className="sa-card">
          <div className="sa-card-header">
            <h3>📊 Jemaat per Kelompok Usia</h3>
          </div>
          <div className="sa-card-body">
            <div className="sa-bar-chart">
              {[
                { label: 'Anak (< 12 thn)', count: stats.usiaDistribution.anak, colorClass: 'green' },
                { label: 'Remaja (12 - 17 thn)', count: stats.usiaDistribution.remaja, colorClass: 'amber' },
                { label: 'Pemuda (18 - 30 thn)', count: stats.usiaDistribution.pemuda, colorClass: 'purple' },
                { label: 'Dewasa (31 - 59 thn)', count: stats.usiaDistribution.dewasa, colorClass: '' },
                { label: 'Adiyuswa / Lansia (≥ 60 thn)', count: stats.usiaDistribution.lansia, colorClass: 'amber' },
              ].map((item) => {
                const percent = stats.totalJemaat ? Math.round((item.count / stats.totalJemaat) * 100) : 0
                return (
                  <div className="sa-bar-item" key={item.label}>
                    <div className="sa-bar-label">
                      <span>{item.label}</span>
                      <strong>{item.count} org ({percent}%)</strong>
                    </div>
                    <div className="sa-bar-track">
                      <div className={`sa-bar-fill ${item.colorClass}`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* KOMPOSISI GENDER & STATUS GEREJAWI */}
        <div className="sa-card">
          <div className="sa-card-header">
            <h3>⚧ Gender & Status Sakramen Gerejawi</h3>
          </div>
          <div className="sa-card-body">
            <h4 style={{ fontSize: 13, margin: '0 0 10px', color: '#64748b' }}>Komposisi Jenis Kelamin</h4>
            <div className="sa-status-pills" style={{ marginBottom: 18 }}>
              <div className="sa-status-pill">
                <span>Laki-laki</span>
                <strong style={{ color: '#0284c7' }}>{stats.gender.laki}</strong>
              </div>
              <div className="sa-status-pill">
                <span>Perempuan</span>
                <strong style={{ color: '#e11d48' }}>{stats.gender.perempuan}</strong>
              </div>
            </div>

            <h4 style={{ fontSize: 13, margin: '0 0 10px', color: '#64748b' }}>Status Baptis & Sidi</h4>
            <div className="sa-status-pills">
              <div className="sa-status-pill">
                <span>Sudah Baptis</span>
                <strong style={{ color: '#16a34a' }}>{stats.statusGerejawi.sudahBaptis}</strong>
              </div>
              <div className="sa-status-pill">
                <span>Belum Baptis</span>
                <strong style={{ color: '#64748b' }}>{stats.statusGerejawi.belumBaptis}</strong>
              </div>
              <div className="sa-status-pill">
                <span>Sudah Sidi</span>
                <strong style={{ color: '#8b5cf6' }}>{stats.statusGerejawi.sudahSidi}</strong>
              </div>
              <div className="sa-status-pill">
                <span>Belum Sidi</span>
                <strong style={{ color: '#64748b' }}>{stats.statusGerejawi.belumSidi}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
