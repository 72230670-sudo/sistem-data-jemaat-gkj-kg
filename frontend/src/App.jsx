import { useState } from 'react'
import JemaatApp from './components/jemaat/JemaatApp.jsx'
import SuperAdminApp from './components/superAdmin/SuperAdminApp.jsx'

export default function App() {
  // Di branch superadmin-yohanes, role default adalah superAdmin
  const [role, setRole] = useState('superAdmin')

  if (role === 'jemaat') {
    return (
      <div>
        <div
          style={{
            position: 'fixed',
            top: 12,
            right: 12,
            zIndex: 9999,
            backgroundColor: '#0f2942',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: 8,
            boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>Mode: Portal Jemaat</span>
          <button
            type="button"
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: 4,
              padding: '4px 8px',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={() => setRole('superAdmin')}
          >
            ← Kembali ke Super Admin
          </button>
        </div>
        <JemaatApp />
      </div>
    )
  }

  return <SuperAdminApp onSwitchRole={(r) => setRole(r)} />
}
