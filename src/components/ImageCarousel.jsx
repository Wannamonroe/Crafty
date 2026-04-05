import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './ImageCarousel.css';

export default function ImageCarousel() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCarousel() {
      try {
        const { data, error } = await supabase
          .from('carousel_images')
          .select('image_url')
          .order('order', { ascending: true });

        if (error) throw error;
        setImages(data || []);
      } catch (err) {
        console.error('Error loading carousel:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCarousel();
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000); // 6 seconds per slide

    return () => clearInterval(interval);
  }, [images]);

  if (loading || images.length === 0) return null;

  return (
    <section className="image-carousel">
      <div className="image-carousel__container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`image-carousel__slide ${index === currentIndex ? 'active' : ''}`}
            aria-hidden={index !== currentIndex}
          >
            <div 
              className="image-carousel__image" 
              style={{ backgroundImage: `url(${image.image_url})` }}
            />
          </div>
        ))}
        
        {/* Decorative Overlay for depth */}
        <div className="image-carousel__overlay" />
        
        {/* Dots indicators */}
        <div className="image-carousel__indicators">
          {images.map((_, index) => (
            <button
              key={index}
              className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
