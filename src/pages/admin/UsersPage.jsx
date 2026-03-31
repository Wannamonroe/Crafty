import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import UserModal from '../../components/UserModal';
import './UsersPage.css';

export default function UsersPage() {
  const { userRole } = useOutletContext();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Security check
    if (userRole !== 'superadmin') {
      navigate('/admin');
      return;
    }
    fetchUsers();
  }, [userRole, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call our Supabase Edge Function to list users securely
      const { data, error: functionError } = await supabase.functions.invoke('manage-users', {
        body: { action: 'list_users' },
      });

      if (functionError) throw functionError;
      if (data?.error) throw new Error(data.error);

      setUsers(data?.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Detalles del error: ' + (err.message || 'Error desconocido al invocar la función.'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) return;
    
    try {
      const { data, error: functionError } = await supabase.functions.invoke('manage-users', {
        body: { action: 'delete_user', id: userId },
      });

      if (functionError) throw functionError;
      if (data?.error) throw new Error(data.error);

      // Refresh table
      fetchUsers();
    } catch (err) {
      alert('Error al eliminar usuario: ' + err.message);
    }
  };

  const handleModalClose = (wasSuccessful) => {
    setIsModalOpen(false);
    if (wasSuccessful) {
      fetchUsers(); // Refresh after create/edit
    }
  };

  if (loading) return <div className="users-loading">Cargando usuarios...</div>;

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Gestión de Usuarios</h2>
        <button className="btn-primary" onClick={handleCreateNew}>
          + Nuevo Usuario
        </button>
      </div>

      {error && <div className="users-error">{error}</div>}

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha de Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No hay usuarios encontrados.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td className="cell-id" title={user.id}>{user.id.substring(0, 8)}...</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role.replace(' ', '-')}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button className="btn-icon btn-edit" onClick={() => handleEdit(user)} title="Editar">
                      ✏️
                    </button>
                    <button className="btn-icon btn-delete" onClick={() => handleDelete(user.id)} title="Borrar">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <UserModal 
          user={selectedUser} 
          onClose={handleModalClose} 
        />
      )}
    </div>
  );
}
