import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import imageCompression from 'browser-image-compression';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './GalleryPack.css';

function SortableImageCard({ image, handleUpdateImage, handleDeleteImage }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 99 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`image-card ${isDragging ? 'shadow-lg' : ''}`}>
      <div className="drag-handle" {...attributes} {...listeners} title="Arrastrar para reordenar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>
      </div>
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
        <input 
          type="text" 
          value={image.button_text || ''} 
          onChange={(e) => handleUpdateImage(image.id, 'button_text', e.target.value)}
          placeholder="Texto del botón (Opcional)"
          className="image-input"
        />
        <button className="btn-delete-image" onClick={(e) => { e.preventDefault(); handleDeleteImage(image.id, image.image_url); }}>
          🗑️ Borrar
        </button>
      </div>
    </div>
  );
}

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Background DB Update
        setTimeout(async () => {
          try {
            const now = new Date().getTime();
            for (let i = 0; i < newArray.length; i++) {
              const image = newArray[i];
              // El más arriba tendrá un created_at más reciente (now - i * 1000)
              const newDate = new Date(now - i * 1000).toISOString();
              
              const { error } = await supabase
                .from('gallery_images')
                .update({ created_at: newDate })
                .eq('id', image.id);
              
              if (error) console.error("Error order:", error);
            }
          } catch (e) {
            console.error("Error updating order timestamps:", e);
          }
        }, 0);
        
        return newArray;
      });
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
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="images-grid">
            <SortableContext items={images} strategy={rectSortingStrategy}>
              {images.map(image => (
                <SortableImageCard 
                  key={image.id}
                  image={image}
                  handleUpdateImage={handleUpdateImage}
                  handleDeleteImage={handleDeleteImage}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </div>
  );
}
