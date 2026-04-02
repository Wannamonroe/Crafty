import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminHome from './pages/admin/AdminHome';
import UsersPage from './pages/admin/UsersPage';
import GalleryManager from './pages/admin/GalleryManager';
import GalleryPack from './pages/admin/GalleryPack';
import FooterSettings from './pages/admin/FooterSettings';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="gallery" element={<GalleryManager />} />
        <Route path="gallery/:packId" element={<GalleryPack />} />
        <Route path="footer" element={<FooterSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
