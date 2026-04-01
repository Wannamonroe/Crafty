import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import imageCompression from 'browser-image-compression';
import './GalleryPack.css';

export default function GalleryPack() {
  const { packId } = useParams();
  const [pack, setPack] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchPackAndImages();
  }, [packId]);

  async function fetchPackAndImages() {
    try {
      setLoading(true);
      
      const { data: packData, error: packError } = await supabase
        .from('gallery_packs')
        .select('*')
        .eq('id', packId)
        .single();
        
      if (packError) throw packError;
      setPack(packData);

      const { data: imagesData, error: imagesError } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('pack_id', packId)
        .order('created_at', { ascending: false });

      if (imagesError) throw imagesError;
      setImages(imagesData || []);

    } catch (err) {
      console.error('Error fetching pack:', err);
      alert('Error al cargar el pack de imágenes.');
    } finally {
      setLoading(false);
    }
  }

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    
    // Compression options
    const options = {
      maxSizeMB: 1, // Max 1MB
      maxWidthOrHeight: 1080, // Target around 1080px to save space but keep quality
      useWebWorker: true
    };

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        
        // 1. Compress Image
        const compressedFile = await imageCompression(file, options);
        
        // 2. Generate unique filename inside the pack folder
        const ext = file.name.split('.').pop() || 'png';
        const baseName = file.name.replace(/\.[^/.]+$/, ""); // Name without extension
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        const filePath = `${packId}/${fileName}`;
        
        // 3. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, compressedFile);

        if (uploadError) throw uploadError;

        // 4. Get Public URL
        const { data } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        const publicUrl = data.publicUrl;

        // 5. Insert into Database
        const { error: dbError } = await supabase
          .from('gallery_images')
          .insert([{
            pack_id: packId,
            name: baseName, // Use filename as default name
            image_url: publicUrl,
            site_url: ''
          }]);

        if (dbError) throw dbError;
      }
      
      // Refresh list after all are done
      fetchPackAndImages();
      
    } catch (err) {
      console.error('Error uploading files:', err);
      alert('Error al subir algunas imágenes.');
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleDeleteImage = async (imageId, imageUrl) => {
    if (!window.confirm('¿Seguro que quieres borrar esta imagen?')) return;

    try {
      // 1. Find filepath from URL to delete from storage
      const parts = imageUrl.split('/gallery/');
      if (parts.length > 1) {
        const filePath = parts[1];
        await supabase.storage.from('gallery').remove([filePath]);
      }

      // 2. Delete from database
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      
      // Remove from UI state securely
      setImages(prev => prev.filter(img => img.id !== imageId));

    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Error al borrar la imagen.');
    }
  };

  const handleUpdateImage = async (imageId, field, value) => {
    // Update locally for quick UI feedback
    setImages(prev => prev.map(img => img.id === imageId ? { ...img, [field]: value } : img));
    
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({ [field]: value })
        .eq('id', imageId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating image:', err);
      alert('Error al actualizar la imagen.');
    }
  };

  if (loading) return <div className="gallery-pack-view"><p>Cargando pack...</p></div>;
  if (!pack) return <div className="gallery-pack-view"><p>No se encontró el pack.</p></div>;

  return (
    <div className="gallery-pack-view">
      <div className="pack-header">
        <div>
          <Link to="/admin/gallery" className="back-link">← Volver a Packs</Link>
          <h1>Pack: {pack.name}</h1>
        </div>
      </div>

      <div 
        className={`upload-zone ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={onFileInputChange} 
          id="file-upload" 
          disabled={uploading}
        />
        <label htmlFor="file-upload" className="upload-label">
          {uploading ? (
            <span className="upload-text">⏱️ Comprimiendo y subiendo imágenes...</span>
          ) : (
            <span className="upload-text">
              📁 Arrastra y suelta imágenes aquí, o haz clic para seleccionar
              <small>Las imágenes se comprimirán automáticamente.</small>
            </span>
          )}
        </label>
      </div>

      <div className="images-section">
        <h2>Imágenes del Pack ({images.length})</h2>
        <div className="images-grid">
          {images.map(image => (
            <div key={image.id} className="image-card">
              <div className="image-preview">
                <img src={image.image_url} alt={image.name} loading="lazy" />
              </div>
              <div className="image-details">
                <input 
                  type="text" 
                  value={image.name} 
                  onChange={(e) => handleUpdateImage(image.id, 'name', e.target.value)}
                  placeholder="Nombre de imagen"
                  className="image-input"
                />
                <input 
                  type="url" 
                  value={image.site_url || ''} 
                  onChange={(e) => handleUpdateImage(image.id, 'site_url', e.target.value)}
                  placeholder="URL del sitio (Second Life)"
                  className="image-input"
                />
                <button className="btn-delete-image" onClick={() => handleDeleteImage(image.id, image.image_url)}>
                  🗑️ Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
