import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import imageCompression from 'browser-image-compression';
import './CarouselManager.css';

export default function CarouselManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('carousel_images')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error('Error fetching carousel images:', err);
      // Fallback if table doesn't exist yet
    } finally {
      setLoading(false);
    }
  }

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const options = {
      maxSizeMB: 0.25, // Compress to ~250KB max
      maxWidthOrHeight: 1280, // Reduced from 1920 to 1280 to save space
      useWebWorker: true,
      fileType: 'image/webp' // Ensures WebP output for better compression
    };

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;

        const compressedFile = await imageCompression(file, options);
        const ext = file.name.split('.').pop() || 'png';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        const filePath = `carousel/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('carousel')
          .upload(filePath, compressedFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('carousel')
          .getPublicUrl(filePath);

        const publicUrl = data.publicUrl;

        // Current max order
        const maxOrder = images.length > 0 ? Math.max(...images.map(img => img.order || 0)) : 0;

        const { error: dbError } = await supabase
          .from('carousel_images')
          .insert([{
            image_url: publicUrl,
            order: maxOrder + 1
          }]);

        if (dbError) throw dbError;
      }
      fetchImages();
    } catch (err) {
      console.error('Error uploading files:', err);
      alert('Error al subir algunas imágenes. Asegúrate de haber creado el bucket "carousel" en Supabase.');
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
    if (!window.confirm('¿Seguro que quieres borrar esta imagen del carrusel?')) return;

    try {
      const parts = imageUrl.split('/carousel/');
      if (parts.length > 1) {
        const filePath = `carousel/${parts[1]}`;
        await supabase.storage.from('carousel').remove([filePath]);
      }

      const { error } = await supabase
        .from('carousel_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Error al borrar la imagen.');
    }
  };

  const moveItem = async (index, direction) => {
    const newItems = [...images];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    // Swap locally
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    
    // Update display orders
    const updated = newItems.map((item, idx) => ({
      id: item.id,
      order: idx
    }));

    setImages(newItems);

    try {
      // Small batch update loop (or use a stored procedure if available)
      for (const item of updated) {
        await supabase
          .from('carousel_images')
          .update({ order: item.order })
          .eq('id', item.id);
      }
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  if (loading) return <div className="carousel-manager-view"><p>Cargando carrusel...</p></div>;

  return (
    <div className="carousel-manager-view">
      <div className="carousel-header">
        <h1>Gestor de Carrusel</h1>
        <p className="subtitle">Sube las imágenes que aparecerán en el carrusel de la página principal.</p>
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
          id="carousel-upload" 
          disabled={uploading}
        />
        <label htmlFor="carousel-upload" className="upload-label">
          {uploading ? (
            <span className="upload-text">⏱️ Subiendo...</span>
          ) : (
            <span className="upload-text">
              📁 Arrastra imágenes aquí para el carrusel
            </span>
          )}
        </label>
      </div>

      <div className="carousel-preview-section">
        <h2>Imágenes actuales ({images.length})</h2>
        <div className="carousel-grid">
          {images.map((image, idx) => (
            <div key={image.id} className="carousel-card">
              <div className="carousel-card__img">
                <img src={image.image_url} alt={`Slide ${idx}`} />
              </div>
              <div className="carousel-card__actions">
                <div className="reorder-btns">
                  <button onClick={() => moveItem(idx, -1)} disabled={idx === 0}>⬆️</button>
                  <button onClick={() => moveItem(idx, 1)} disabled={idx === images.length - 1}>⬇️</button>
                </div>
                <button className="delete-btn" onClick={() => handleDeleteImage(image.id, image.image_url)}>
                  🗑️ Borrar
                </button>
              </div>
            </div>
          ))}
          {images.length === 0 && <p className="empty-msg">No hay imágenes en el carrusel.</p>}
        </div>
      </div>
    </div>
  );
}
