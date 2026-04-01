import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './GalleryManager.css';

export default function GalleryManager() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPacks();
  }, []);

  async function fetchPacks() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery_packs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPacks(data || []);
    } catch (err) {
      console.error('Error fetching gallery packs:', err);
      setError('Error al cargar los packs de imágenes.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePack() {
    const name = window.prompt('Nombre del nuevo pack de imágenes:');
    if (!name || name.trim() === '') return;

    try {
      const { error } = await supabase
        .from('gallery_packs')
        .insert([{ name: name.trim(), is_active: false }]);

      if (error) throw error;
      fetchPacks();
    } catch (err) {
      console.error('Error creating pack:', err);
      alert('Hubo un error al crear el pack.');
    }
  }

  async function handleSetActive(packId) {
    try {
      // Set all to false first
      await supabase
        .from('gallery_packs')
        .update({ is_active: false })
        .neq('id', packId);

      // Set the selected one to true
      const { error } = await supabase
        .from('gallery_packs')
        .update({ is_active: true })
        .eq('id', packId);

      if (error) throw error;
      fetchPacks();
    } catch (err) {
      console.error('Error updating active pack:', err);
      alert('Error al actualizar el pack activo.');
    }
  }

  async function handleRename(packId, oldName) {
    const newName = window.prompt('Nuevo nombre del pack:', oldName);
    if (!newName || newName.trim() === '' || newName === oldName) return;

    try {
      const { error } = await supabase
        .from('gallery_packs')
        .update({ name: newName.trim() })
        .eq('id', packId);

      if (error) throw error;
      fetchPacks();
    } catch (err) {
      console.error('Error renaming pack:', err);
      alert('Error al renombrar el pack.');
    }
  }

  async function handleDelete(packId) {
    if (!window.confirm('¿Estás seguro de que deseas borrar este pack? Todas sus imágenes se perderán.')) return;

    try {
      // Fetch associated images to delete from storage
      const { data: images } = await supabase
        .from('gallery_images')
        .select('image_url')
        .eq('pack_id', packId);

      if (images && images.length > 0) {
        // Find bucket paths (everything after /storage/v1/object/public/gallery/)
        const filePaths = images.map(img => {
          const parts = img.image_url.split('/gallery/');
          return parts.length > 1 ? parts[1] : null;
        }).filter(Boolean);

        if (filePaths.length > 0) {
          await supabase.storage.from('gallery').remove(filePaths);
        }
      }

      // Delete the pack from DB (Cascade applies to gallery_images)
      const { error } = await supabase
        .from('gallery_packs')
        .delete()
        .eq('id', packId);

      if (error) throw error;
      fetchPacks();
    } catch (err) {
      console.error('Error deleting pack:', err);
      alert('Error al borrar el pack.');
    }
  }

  if (loading) return <div className="gallery-manager-view"><p>Cargando packs...</p></div>;

  return (
    <div className="gallery-manager-view">
      <div className="gallery-header">
        <h1>Gestor de Galería</h1>
        <button className="btn-create-pack" onClick={handleCreatePack}>
          + Crear nuevo Pack de Imágenes
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="packs-grid">
        {packs.length === 0 && <p className="no-packs">No hay packs de imágenes creados. Crea uno para empezar.</p>}
        {packs.map((pack) => (
          <div key={pack.id} className={`pack-card ${pack.is_active ? 'active-pack' : ''}`}>
            <div className="pack-card-header">
              <h3>{pack.name}</h3>
              {pack.is_active && <span className="badge-active">⭐ Mostrando en Galería</span>}
            </div>
            
            <div className="pack-card-actions">
              <Link to={`/admin/gallery/${pack.id}`} className="btn-action btn-view">
                👀 Ver/Editar Pack
              </Link>

              {!pack.is_active && (
                <button className="btn-action btn-set-active" onClick={() => handleSetActive(pack.id)}>
                  ✅ Mostrar en Galería
                </button>
              )}

              <button className="btn-action btn-edit" onClick={() => handleRename(pack.id, pack.name)}>
                ✏️ Cambiar Nombre
              </button>
              
              <button className="btn-action btn-delete" onClick={() => handleDelete(pack.id)}>
                🗑️ Borrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
