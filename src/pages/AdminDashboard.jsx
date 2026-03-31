import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminDashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }
      
      setUserEmail(session.user.email);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (profile) {
        setUserRole(profile.role);
      }
      
      setLoading(false);
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
    <div style={{ display: 'flex', backgroundColor: '#1a1a1a', minHeight: '100vh', color: '#eaeaea', fontFamily: 'sans-serif' }}>
      <AdminSidebar userRole={userRole} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#000', borderBottom: '1px solid #333' }}>
          <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#7a8973' }}>Crafty Admin</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>{userEmail} <small style={{ color: '#888', textTransform: 'uppercase' }}>({userRole})</small></span>
            <button 
              onClick={handleLogout}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Salir
            </button>
          </div>
        </header>
        
        <main style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          <Outlet context={{ userRole }} />
        </main>
      </div>
    </div>
  );
}
