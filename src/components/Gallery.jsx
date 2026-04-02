import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Gallery.css';

export default function Gallery() {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [galleryTitle, setGalleryTitle] = useState('Galería');

  useEffect(() => {
    fetchActiveGallery();
    fetchGalleryTitle();
  }, []);

  async function fetchGalleryTitle() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'gallery_title')
        .single();
      if (!error && data?.value) setGalleryTitle(data.value);
    } catch (_) {}
  }

  async function fetchActiveGallery() {
    try {
      setLoading(true);
      // Find the active pack
      const { data: pack, error: packError } = await supabase
        .from('gallery_packs')
        .select('id')
        .eq('is_active', true)
        .single();

      if (packError && packError.code !== 'PGRST116') { // Ignore "No rows found"
        throw packError;
      }

      if (pack) {
        // Find images for this pack
        const { data: imgs, error: imgsError } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('pack_id', pack.id)
          .order('created_at', { ascending: false });

        if (imgsError) throw imgsError;
        setImages(imgs || []);
      } else {
        setImages([]);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="lookbook" id="gallery">
      <div className="lookbook__header">
        <h2 className="lookbook__title">{galleryTitle}</h2>
      </div>

      <div className="lookbook__grid">
        {loading && <p className="gallery-loading">Cargando galería...</p>}
        {!loading && images.length === 0 && (
          <p className="gallery-empty">No hay imágenes en la galería actualmente.</p>
        )}
        
        {!loading && images.map((item) => (
          <article
            key={item.id}
            className="lookbook__item"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="lookbook__image-wrap" onClick={() => setSelectedImage(item.image_url)}>
              <img src={item.image_url} alt={item.name} className="lookbook__image" loading="lazy" />
              
              {/* Overlay for Visit Site */}
              {hoveredId === item.id && item.site_url && (
                <div className="lookbook__overlay">
                  <a 
                    href={item.site_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-visit-site"
                    onClick={(e) => e.stopPropagation()}
                  >
                    📍 Visitar Sitio
                  </a>
                </div>
              )}
            </div>
            <div className="lookbook__info">
              <h3 className="lookbook__name">{item.name}</h3>
            </div>
          </article>
        ))}
      </div>

      {/* Modal / Lightbox */}
      {selectedImage && (
        <div className="gallery-modal" onClick={() => setSelectedImage(null)}>
          <span className="gallery-modal-close">&times;</span>
          <img 
            src={selectedImage} 
            alt="Visor de imagen" 
            className="gallery-modal-content" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </section>
  );
}
