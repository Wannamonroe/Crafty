import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      } else {
        setUserEmail(session.user.email);
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000', color: '#fff' }}>Cargando administrador...</div>;
  }

  return (
    <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', color: '#eaeaea', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#000', borderBottom: '1px solid #333' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#7a8973' }}>Crafty Admin Panel</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>{userEmail}</span>
          <button 
            onClick={handleLogout}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      
      <main style={{ padding: '2rem' }}>
        <div style={{ background: '#2a2a2a', padding: '2rem', borderRadius: '8px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2>¡Bienvenido al Panel de Administración!</h2>
          <p style={{ color: '#aaa', marginTop: '1rem' }}>
            Has iniciado sesión correctamente con una cuenta de permisos elevados. 
            Este es un panel de prueba que se expandirá en el futuro.
          </p>
        </div>
      </main>
    </div>
  );
}
