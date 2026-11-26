import { useMemo } from 'react'

function hitungUsia(tglLahir) {
  if (!tglLahir) return null
  const today = new Date()
  const birth = new Date(tglLahir)
  if (Number.isNaN(birth.getTime())) return null
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

function isSudahSakramen(val) {
  if (val === true) return true
  if (typeof val === 'string') {
    const clean = val.trim().toLowerCase()
    return clean === 'sudah' || clean === 'ya' || clean === 'true'
  }
  return false
}

function DonutChart({ items, centerLabel, centerValue }) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const total = items.reduce((sum, item) => sum + Math.max(0, Number(item.value) || 0), 0)

  let accumulatedAngle = 0

  return (
    <div className="sa-donut-wrap">
      <div className="sa-donut-svg-box">
        <svg viewBox="0 0 120 120" className="sa-donut-svg" role="img" aria-label={centerLabel}>
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="14"
          />
          {total > 0 &&
            items.map((item) => {
              const val = Math.max(0, Number(item.value) || 0)
              const ratio = val / total
              const dashLength = ratio * circumference
              const rotation = -90 + accumulatedAngle
              accumulatedAngle += ratio * 360

              if (val === 0) return null

              return (
                <circle
                  key={item.label}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="14"
                  strokeDasharray={`${dashLength} ${circumference}`}
                  transform={`rotate(${rotation} 60 60)`}
                />
              )
            })}
        </svg>
        <div className="sa-donut-center">
          <strong>{centerValue ?? total}</strong>
          <span>{centerLabel}</span>
        </div>
      </div>

      <div className="sa-legend-list">
        {items.map((item) => {
          const val = Number(item.value) || 0
          const pct = total > 0 ? Math.round((val / total) * 100) : 0
          return (
            <div key={item.label} className="sa-legend-row">
              <span className="sa-legend-dot" style={{ backgroundColor: item.color }} />
              <span className="sa-legend-label">{item.label}</span>
              <strong className="sa-legend-val">
                {val} <small>({pct}%)</small>
              </strong>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function StatistikJemaat({ members = [], families = [] }) {
  const stats = useMemo(() => {
    let pria = 0
    let wanita = 0
    let anak = 0
    let dewasa = 0
    let lansia = 0
    let baptis = 0
    let sidi = 0
    const perWilayah = {}

    members.forEach((m) => {
      const genderRaw =
        m.jenis_kelamin ?? m.gender ?? m.jk ?? m.identitas?.jenis_kelamin ?? ''
      const g = String(genderRaw).trim().toLowerCase()
      if (g === 'l' || g === 'laki-laki' || g === 'laki laki' || g === 'pria') {
        pria++
      } else if (g === 'p' || g === 'perempuan' || g === 'wanita') {
        wanita++
      }

      const tglRaw =
        m.tgl_lhr ?? m.tanggal_lahir ?? m.tgl_lahir ?? m.identitas?.tgl_lhr ?? null
      const usia = hitungUsia(tglRaw)
      if (usia !== null) {
        if (usia < 13) anak++
        else if (usia >= 60) lansia++
        else dewasa++
      }

      const baptisRaw =
        m.status_baptis ?? m.baptis ?? m.gerejawi?.status_baptis ?? m.gerejawi?.baptis
      const sidiRaw =
        m.status_sidi ?? m.sidi ?? m.gerejawi?.status_sidi ?? m.gerejawi?.sidi

      if (isSudahSakramen(baptisRaw)) baptis++
      if (isSudahSakramen(sidiRaw)) sidi++

      const wilRaw =
        m.nama_wilayah ??
        m.wilayah ??
        (m.id_wil ? `Wilayah ${m.id_wil}` : null) ??
        m.gerejawi?.wilayah ??
        'Tanpa Wilayah'
      const wilKey = String(wilRaw).trim() || 'Tanpa Wilayah'
      perWilayah[wilKey] = (perWilayah[wilKey] || 0) + 1
    })

    return {
      totalJemaat: members.length,
      totalKK: families.length,
      pria,
      wanita,
      anak,
      dewasa,
      lansia,
      baptis,
      sidi,
      wilayahList: Object.entries(perWilayah).map(([nama, jumlah]) => ({
        nama,
        jumlah,
      })),
    }
  }, [members, families])

  const maxWil = Math.max(...stats.wilayahList.map((w) => w.jumlah), 1)
  const belumBaptis = Math.max(stats.totalJemaat - stats.baptis, 0)
  const belumSidi = Math.max(stats.totalJemaat - stats.sidi, 0)

  return (
    <section className="sa-dash-section">
      {/* KARTU KPI RINGKAS */}
      <div className="sa-kpi-grid">
        <div className="sa-kpi-card">
          <span className="sa-kpi-label">Total Jemaat</span>
          <strong className="sa-kpi-value">{stats.totalJemaat}</strong>
          <span className="sa-kpi-sub">{stats.totalKK} Kepala Keluarga</span>
        </div>

        <div className="sa-kpi-card">
          <span className="sa-kpi-label">Jenis Kelamin</span>
          <strong className="sa-kpi-value">
            {stats.pria} L <span className="sa-kpi-sep">/</span> {stats.wanita} P
          </strong>
          <span className="sa-kpi-sub">Pria & Wanita</span>
        </div>

        <div className="sa-kpi-card">
          <span className="sa-kpi-label">Lansia (≥ 60 Thn)</span>
          <strong className="sa-kpi-value accent-amber">{stats.lansia}</strong>
          <span className="sa-kpi-sub">
            Anak: {stats.anak} • Dewasa/Remaja: {stats.dewasa}
          </span>
        </div>

        <div className="sa-kpi-card">
          <span className="sa-kpi-label">Sakramen</span>
          <strong className="sa-kpi-value accent-blue">
            {stats.baptis} <span className="sa-kpi-sep">/</span> {stats.sidi}
          </strong>
          <span className="sa-kpi-sub">Sudah Baptis / Sudah Sidi</span>
        </div>
      </div>

      {/* GRAFIK SEBARAN PER WILAYAH & KATEGORI USIA */}
      <div className="sa-dash-subgrid">
        <div className="sa-dash-box">
          <h3>Grafik Jemaat per Wilayah</h3>
          {stats.wilayahList.length === 0 ? (
            <p className="sa-empty-chart">Belum ada data wilayah.</p>
          ) : (
            <div className="sa-wil-bars">
              {stats.wilayahList.map((w) => {
                const pct = Math.round((w.jumlah / stats.totalJemaat) * 100) || 0
                return (
                  <div key={w.nama} className="sa-wil-item">
                    <div className="sa-wil-top">
                      <span>{w.nama}</span>
                      <strong>
                        {w.jumlah} jemaat <small>({pct}%)</small>
                      </strong>
                    </div>
                    <div className="sa-wil-track">
                      <div
                        className="sa-wil-fill"
                        style={{ width: `${(w.jumlah / maxWil) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="sa-dash-box">
          <h3>Grafik Kategori Usia</h3>
          <DonutChart
            centerValue={stats.anak + stats.dewasa + stats.lansia}
            centerLabel="Terdata"
            items={[
              { label: 'Anak (< 13 thn)', value: stats.anak, color: '#0ea5e9' },
              { label: 'Remaja & Dewasa', value: stats.dewasa, color: '#2563eb' },
              { label: 'Lansia (≥ 60 thn)', value: stats.lansia, color: '#f59e0b' },
            ]}
          />
        </div>
      </div>

      {/* GRAFIK GENDER & SAKRAMEN */}
      <div className="sa-dash-subgrid">
        <div className="sa-dash-box">
          <h3>Grafik Jenis Kelamin</h3>
          <DonutChart
            centerValue={stats.pria + stats.wanita}
            centerLabel="Jemaat"
            items={[
              { label: 'Laki-laki (L)', value: stats.pria, color: '#1d4ed8' },
              { label: 'Perempuan (P)', value: stats.wanita, color: '#ec4899' },
            ]}
          />
        </div>

        <div className="sa-dash-box">
          <h3>Grafik Cakupan Sakramen Baptis & Sidi</h3>
          <div className="sa-sacrament-bars">
            <div className="sa-wil-item">
              <div className="sa-wil-top">
                <span>Sudah Baptis</span>
                <strong>
                  {stats.baptis} / {stats.totalJemaat}
                </strong>
              </div>
              <div className="sa-wil-track">
                <div
                  className="sa-wil-fill"
                  style={{
                    width: `${stats.totalJemaat ? (stats.baptis / stats.totalJemaat) * 100 : 0}%`,
                    backgroundColor: '#0284c7',
                  }}
                />
              </div>
              <span className="sa-kpi-sub">Belum tercatat baptis: {belumBaptis}</span>
            </div>

            <div className="sa-wil-item">
              <div className="sa-wil-top">
                <span>Sudah Sidi</span>
                <strong>
                  {stats.sidi} / {stats.totalJemaat}
                </strong>
              </div>
              <div className="sa-wil-track">
                <div
                  className="sa-wil-fill"
                  style={{
                    width: `${stats.totalJemaat ? (stats.sidi / stats.totalJemaat) * 100 : 0}%`,
                    backgroundColor: '#16a34a',
                  }}
                />
              </div>
              <span className="sa-kpi-sub">Belum tercatat sidi: {belumSidi}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}