import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import Login from './pages/Auth/Login'; // Sesuaikan jalur foldernya jika berbeda
import DashboardAdminWilayah from './pages/adminWilayah/DashboardAdminWilayah';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;