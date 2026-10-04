import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import JemaatApp from './components/jemaat/JemaatApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <JemaatApp />
  </StrictMode>,
)
