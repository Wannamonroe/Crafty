import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './GalleryManager.css';

export default function GalleryManager() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery Settings
  const [galleryTitle, setGalleryTitle] = useState('Galería');
  const [galleryButtonText, setGalleryButtonText] = useState('Visitar Sitio');

  // Modals state
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [buttonInput, setButtonInput] = useState('');
  const [settingsSaving, setSettingsSaving] = useState(false);

  useEffect(() => {
    fetchPacks();
    fetchGallerySettings();
  }, []);

  async function fetchGallerySettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['gallery_title', 'gallery_button_text']);

      if (!error && data) {
        const titleSetting = data.find(s => s.key === 'gallery_title');
        const btnSetting = data.find(s => s.key === 'gallery_button_text');
        
        if (titleSetting?.value) setGalleryTitle(titleSetting.value);
        if (btnSetting?.value) setGalleryButtonText(btnSetting.value);
      }
    } catch (_) {}
  }

  async function handleSaveGallerySettings() {
    if (!titleInput.trim() || !buttonInput.trim()) return;
    setSettingsSaving(true);

    try {
      const updates = [
        { key: 'gallery_title', value: titleInput.trim(), updated_at: new Date().toISOString() },
        { key: 'gallery_button_text', value: buttonInput.trim(), updated_at: new Date().toISOString() }
      ];

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates, { onConflict: 'key' });

      if (error) throw error;

      setGalleryTitle(titleInput.trim());
      setGalleryButtonText(buttonInput.trim());
      setSettingsModalOpen(false);
    } catch (err) {
      console.error('Error guardando configuración:', err);
      alert('Error al guardar la configuración.');
    } finally {
      setSettingsSaving(false);
    }
  }

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
        <div className="gallery-header__left">
          <h1>Gestor de Galería</h1>
          <div className="gallery-title-row">
            <span className="gallery-title-preview">Título público: <strong>{galleryTitle}</strong></span>
            <span className="gallery-title-preview" style={{marginLeft: '15px'}}>Botón: <strong>{galleryButtonText}</strong></span>
            <button
              className="btn-change-title"
              onClick={() => { 
                setTitleInput(galleryTitle);
                setButtonInput(galleryButtonText);
                setSettingsModalOpen(true); 
              }}
            >
              ⚙️ Configurar Galería
            </button>
          </div>
        </div>
        <button className="btn-create-pack" onClick={handleCreatePack}>
          + Crear nuevo Pack de Imágenes
        </button>
      </div>

      {/* Modal configuración galería */}
      {settingsModalOpen && (
        <div className="title-modal-overlay" onClick={() => setSettingsModalOpen(false)}>
          <div className="title-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="title-modal__heading">Configuración de Galería</h2>
            <p className="title-modal__hint">Modifica el título principal y el texto de los botones.</p>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Título de la Galería:</label>
              <input
                id="gallery-title-input"
                type="text"
                className="title-modal__input"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="Ej: Galería, Colección, Lookbook..."
                autoFocus
                maxLength={80}
                style={{ marginBottom: '0' }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Texto de todos los botones "Visitar":</label>
              <input
                id="gallery-button-input"
                type="text"
                className="title-modal__input"
                value={buttonInput}
                onChange={(e) => setButtonInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveGallerySettings()}
                placeholder="Ej: Visitar Sitio, Comprar, Ver más..."
                maxLength={80}
                style={{ marginBottom: '0' }}
              />
            </div>
            
            <div className="title-modal__actions">
              <button
                className="title-modal__cancel"
                onClick={() => setSettingsModalOpen(false)}
                disabled={settingsSaving}
              >
                Cancelar
              </button>
              <button
                className="title-modal__save"
                onClick={handleSaveGallerySettings}
                disabled={settingsSaving || !titleInput.trim() || !buttonInput.trim()}
              >
                {settingsSaving ? 'Guardando...' : '💾 Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

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
