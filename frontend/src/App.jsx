import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import Login from './pages/Auth/Login'; // Sesuaikan jalur foldernya jika berbeda
import SuperAdminApp from './components/superAdmin/SuperAdminApp';
import DashboardAdminWilayah from './pages/adminWilayah/DashboardAdminWilayah';
import JemaatApp from './components/jemaat/JemaatApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute untuk halaman utama / landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Rute untuk halaman login pendataan jemaat */}
        <Route path="/login" element={<Login />} />

        {/* Rute untuk halaman admin wilayah */}
        <Route path="/admin-wilayah" element={<DashboardAdminWilayah />} />

        {/* Rute untuk halaman super admin */}
        <Route path="/super-admin" element={<SuperAdminApp />} />

        {/* Rute untuk halaman portal mandiri jemaat */}
        <Route path="/dashboard-jemaat" element={<JemaatApp />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;