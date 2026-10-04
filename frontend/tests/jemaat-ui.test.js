import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { createDemoData, getValue, profileSections } from '../src/lib/jemaatData.js'

let server
let components
before(async () => {
  server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' })
  components = await server.ssrLoadModule('/src/components/jemaat/JemaatApp.jsx')
})
after(async () => { await server?.close() })

const noop = () => {}

test('halaman awal hanya login Jemaat, bukan landing atau dashboard administrator', () => {
  const html = renderToStaticMarkup(createElement(components.default))
  assert.match(html, /Selamat datang, Jemaat/)
  assert.match(html, /name="username"/)
  assert.match(html, /<input(?=[^>]*name="password")(?=[^>]*type="password")[^>]*>/)
  assert.match(html, /DDMMYYYY/)
  assert.match(html, /Belum terhubung ke autentikasi server/)
  assert.doesNotMatch(html, /Selamat datang, Administrator|Tambah Jemaat|Hapus|TENTANG GEREJA/)
})

test('kartu digital menampilkan atribut jemaat, bukan atribut peserta BPJS', () => {
  const data = createDemoData()
  const html = renderToStaticMarkup(createElement(components.MemberCard, { member: data.members[0], family: data.families[0], self: true }))
  assert.match(html, /KARTU JEMAAT DIGITAL/)
  assert.match(html, /GKJ KOTAGEDE/)
  assert.match(html, /Profil saya/)
  assert.match(html, /Nomor anggota/)
  assert.match(html, /Wilayah 1/)
  assert.doesNotMatch(html, /BPJS|Segmen Peserta|Fasilitas Kesehatan/)
})

for (const section of profileSections) {
  test(`bagian ${section.title} menampilkan atribut ERD dan hanya tombol ubah`, () => {
    const data = createDemoData()
    const record = section.family ? data.families[0] : data.members[0]
    const html = renderToStaticMarkup(createElement(components.ProfileSection, { section, record, editing: false, draft: {}, onEdit: noop }))
    for (const field of section.fields) assert.ok(html.includes(field.label.replaceAll('&', '&amp;')))
    assert.match(html, /Ubah/)
    assert.doesNotMatch(html, /Hapus|Tambah|type="submit"/)
  })
}

test('mode edit hanya menyediakan field yang diizinkan dan tombol simpan/batal', () => {
  const member = createDemoData().members[0]
  const section = profileSections[0]
  const draft = Object.fromEntries(section.fields.map((field) => [field.key, getValue(member, field.key)]))
  const html = renderToStaticMarkup(createElement(components.ProfileSection, { section, record: member, editing: true, draft, onChange: noop, onSave: noop, onCancel: noop }))
  assert.match(html, /Simpan perubahan/)
  assert.match(html, /Batal/)
  assert.match(html, /ID &amp; NIK tetap terkunci/)
  assert.doesNotMatch(html, /name="(?:id|nik|id_user|id_wil|no_kk|user.role)"|Hapus|Tambah/)
})

test('pelayanan, dokumen, dan persembahan hanya baca tanpa aksi mutasi', () => {
  const html = renderToStaticMarkup(createElement(components.ReadOnlyRecords, { member: createDemoData().members[0] }))
  assert.match(html, /Riwayat pelayanan/)
  assert.match(html, /Dokumen/)
  assert.match(html, /Persembahan bulanan/)
  assert.match(html, /Hanya baca/)
  assert.doesNotMatch(html, /<button|<form|<input/)
})
