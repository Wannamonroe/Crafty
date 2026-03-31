import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './UserModal.css';

export default function UserModal({ user, onClose }) {
  const isEditing = !!user;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('sin acceso');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const action = isEditing ? 'update_user' : 'create_user';
    const payload = {
      action,
      id: user?.id,
      email,
      password: password || undefined, // Only send if not empty
      role
    };

    try {
      const { data, error: functionError } = await supabase.functions.invoke('manage-users', {
        body: payload
      });

      if (functionError) throw functionError;
      if (data?.error) throw new Error(data.error);

      // Success! Close modal and refresh.
      onClose(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al guardar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
          <button className="modal-close" onClick={() => onClose(false)}>✕</button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={isEditing} 
              placeholder="correo@ejemplo.com"
            />
            {isEditing && <small>El correo no se puede cambiar por seguridad.</small>}
          </div>

          <div className="form-group">
            <label>
              Contraseña
              {isEditing && <span className="label-hint"> (Dejar en blanco para no cambiar)</span>}
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required={!isEditing} 
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Rol de Acceso</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="sin acceso">Sin Acceso</option>
              <option value="admin">Administrador (admin)</option>
              <option value="superadmin">Super Administrador (superadmin)</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => onClose(false)} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
