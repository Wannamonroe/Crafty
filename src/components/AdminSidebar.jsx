import { Link, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

export default function AdminSidebar({ userRole }) {
  const location = useLocation();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__logo">
        Admin Panel
      </div>
      
      <nav className="admin-sidebar__nav">
        <ul>
          <li>
            <Link 
              to="/admin" 
              className={`sidebar-link ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              <span className="icon">🏠</span> Inicio
            </Link>
          </li>
          
          {userRole === 'superadmin' && (
            <li>
              <Link 
                to="/admin/users" 
                className={`sidebar-link ${location.pathname.includes('/admin/users') ? 'active' : ''}`}
              >
                <span className="icon">👥</span> Usuarios
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
