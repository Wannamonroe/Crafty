import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './ImageCarousel.css';

export default function ImageCarousel() {
  const [images, setImages] = useState([]);
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

  if (loading || images.length === 0) return null;

  // Function to render brand items
  const renderItems = (classNameSuffix) => (
    <div className={`marquee__group ${classNameSuffix}`} key={classNameSuffix}>
      {images.map((image, index) => (
        <div className="marquee__item" key={`${classNameSuffix}-${index}`}>
          <img src={image.image_url} alt={`Brand logo ${index}`} className="marquee__logo" />
        </div>
      ))}
    </div>
  );

  return (
    <section className="image-marquee" aria-label="Brand reel">
      <div className="marquee__mask">
        <div className="marquee__content">
          {/* Render 4 sets to ensure no gaps even on ultra-wide screens */}
          {renderItems('set-1')}
          {renderItems('set-2')}
          {renderItems('set-3')}
          {renderItems('set-4')}
        </div>
      </div>
    </section>
  );
}
