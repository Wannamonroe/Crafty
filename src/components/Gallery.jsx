import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Gallery.css';

export default function Gallery() {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [galleryTitle, setGalleryTitle] = useState('Galería');
  const [galleryButtonText, setGalleryButtonText] = useState('Visitar Sitio');

  useEffect(() => {
    fetchActiveGallery();
    fetchGallerySettings();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'ArrowRight') handleNextImage(e);
      if (e.key === 'ArrowLeft') handlePrevImage(e);
      if (e.key === 'Escape') setSelectedImageIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, images.length]);

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
    } catch (_) { }
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

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1);
    }
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1);
    }
  };

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

        {!loading && images.map((item, index) => (
          <article
            key={item.id}
            className="lookbook__item"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="lookbook__image-wrap" onClick={() => setSelectedImageIndex(index)}>
              <img src={item.image_url} alt={item.name} className="lookbook__image" loading="lazy" />

            </div>
            <div className="lookbook__info">
              <h3 className="lookbook__name">{item.name}</h3>
              {item.site_url && (
                <div className="lookbook__action">
                  <a
                    href={item.site_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-visit-site-elegant"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>📍{galleryButtonText}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Modal / Lightbox */}
      {selectedImageIndex !== null && (
        <div className="gallery-modal" onClick={() => setSelectedImageIndex(null)}>
          <span className="gallery-modal-close">&times;</span>
          <button className="gallery-modal-nav gallery-modal-prev" onClick={handlePrevImage}>
            &#10094;
          </button>
          <img
            src={images[selectedImageIndex]?.image_url}
            alt="Visor de imagen"
            className="gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="gallery-modal-nav gallery-modal-next" onClick={handleNextImage}>
            &#10095;
          </button>
        </div>
      )}
    </section>
  );
}
