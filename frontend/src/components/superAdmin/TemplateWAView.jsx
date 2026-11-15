import { useState } from 'react'
import { DEFAULT_WA_TEMPLATES, generateWhatsAppMessage } from '../../lib/superAdminData.js'

export default function TemplateWAView({ data, onSaveTemplates, onResetTemplates }) {
  const [lahirTemplate, setLahirTemplate] = useState(
    data.wa_templates?.ultah_lahir || DEFAULT_WA_TEMPLATES.ultah_lahir
  )
  const [nikahTemplate, setNikahTemplate] = useState(
    data.wa_templates?.ultah_nikah || DEFAULT_WA_TEMPLATES.ultah_nikah
  )
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Contoh sampel jemaat untuk preview
  const sampleMember = data.members[0] || {
    nama_lengkap: 'Maria Kristina Wibowo',
    tgl_lhr: '1992-05-12',
    gerejawi: {
      status_pernikahan: 'Menikah',
      tgl_pernikahan: '2015-06-20',
    },
  }

  function handleSave(e) {
    e.preventDefault()
    onSaveTemplates({
      ultah_lahir: lahirTemplate,
      ultah_nikah: nikahTemplate,
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  function handleReset() {
    if (confirm('Kembalikan template ucapan WhatsApp ke pengaturan bawaan?')) {
      setLahirTemplate(DEFAULT_WA_TEMPLATES.ultah_lahir)
      setNikahTemplate(DEFAULT_WA_TEMPLATES.ultah_nikah)
      onResetTemplates()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {savedSuccess && (
        <div className="sa-toast success" style={{ position: 'static', margin: 0 }}>
          ✓ Template WhatsApp berhasil diperbarui!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* TEMPLATE ULANG TAHUN LAHIR */}
        <div className="sa-card">
          <div className="sa-card-header">
            <h3>🎂 Template Ucapan Ulang Tahun Lahir Jemaat</h3>
          </div>
          <div className="sa-card-body">
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 0 }}>
              Gunakan placeholder: <code>{'{nama}'}</code> (nama jemaat), <code>{'{usia}'}</code> (umur),{' '}
              <code>{'{gereja}'}</code> (nama gereja)
            </p>

            <textarea
              className="sa-textarea"
              rows={4}
              style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
              value={lahirTemplate}
              onChange={(e) => setLahirTemplate(e.target.value)}
            />

            <div style={{ marginTop: 14, padding: 14, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                Pratinjau Pesan:
              </span>
              <p style={{ fontSize: 13, color: '#14532d', margin: '6px 0 0', whiteSpace: 'pre-line' }}>
                {generateWhatsAppMessage(lahirTemplate, sampleMember, 'lahir')}
              </p>
            </div>
          </div>
        </div>

        {/* TEMPLATE ULANG TAHUN PERNIKAHAN */}
        <div className="sa-card">
          <div className="sa-card-header">
            <h3>❤️ Template Ucapan Hari Ulang Tahun Pernikahan</h3>
          </div>
          <div className="sa-card-body">
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 0 }}>
              Gunakan placeholder: <code>{'{nama}'}</code> (nama kepala/pasangan),{' '}
              <code>{'{usia_pernikahan}'}</code> (lama tahun pernikahan), <code>{'{gereja}'}</code>
            </p>

            <textarea
              className="sa-textarea"
              rows={4}
              style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
              value={nikahTemplate}
              onChange={(e) => setNikahTemplate(e.target.value)}
            />

            <div style={{ marginTop: 14, padding: 14, backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9f1239', textTransform: 'uppercase' }}>
                Pratinjau Pesan:
              </span>
              <p style={{ fontSize: 13, color: '#881337', margin: '6px 0 0', whiteSpace: 'pre-line' }}>
                {generateWhatsAppMessage(nikahTemplate, sampleMember, 'nikah')}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="sa-btn-secondary" type="button" onClick={handleReset}>
            Kembalikan ke Default
          </button>
          <button className="sa-btn-primary" type="submit">
            💾 Simpan Template WA
          </button>
        </div>
      </form>
    </div>
  )
}
