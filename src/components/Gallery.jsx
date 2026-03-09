import { useState } from 'react';
import './Gallery.css';

const placeholderItems = [
  { id: 1, name: 'Eclipse Dress', category: 'Vestidos', color: '#2a2a3e' },
  { id: 2, name: 'Nova Jacket', category: 'Chaquetas', color: '#1e2e1e' },
  { id: 3, name: 'Stellar Gown', category: 'Vestidos', color: '#3e1e2a' },
  { id: 4, name: 'Void Corset', category: 'Tops', color: '#1e1e3e' },
  { id: 5, name: 'Lunar Skirt', category: 'Faldas', color: '#2e2e1e' },
  { id: 6, name: 'Aurora Set', category: 'Conjuntos', color: '#1e3e2e' },
  { id: 7, name: 'Nebula Coat', category: 'Chaquetas', color: '#3e2a1e' },
  { id: 8, name: 'Cosmos Pants', category: 'Pantalones', color: '#2a1e3e' },
  { id: 9, name: 'Zenith Blouse', category: 'Tops', color: '#1e2a2a' },
  { id: 10, name: 'Orbit Suit', category: 'Conjuntos', color: '#2e1e1e' },
  { id: 11, name: 'Halo Dress', category: 'Vestidos', color: '#1e2e3e' },
  { id: 12, name: 'Prism Top', category: 'Tops', color: '#3e1e3e' },
];

const categories = ['Todos', 'Vestidos', 'Chaquetas', 'Tops', 'Faldas', 'Pantalones', 'Conjuntos'];

function GalleryCard({ item }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`gallery__card ${hovered ? 'gallery__card--hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="gallery__img-wrap" style={{ background: item.color }}>
        <div className="gallery__img-placeholder">
          <div className="gallery__img-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(248,228,128,0.3)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
          <span className="gallery__img-soon">Imagen próximamente</span>
        </div>
        <div className="gallery__overlay">
          <button className="gallery__overlay-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Ver detalle
          </button>
        </div>
      </div>
      <div className="gallery__info">
        <span className="gallery__category">{item.category}</span>
        <h3 className="gallery__name">{item.name}</h3>
        <div className="gallery__footer">
          <div className="gallery__sl-badge">Second Life</div>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filtered = activeFilter === 'Todos'
    ? placeholderItems
    : placeholderItems.filter(i => i.category === activeFilter);

  return (
    <section className="gallery" id="coleccion">
      <div className="gallery__header">
        <span className="gallery__label">Colección</span>
        <h2 className="gallery__title">Nuestras Piezas</h2>
        <p className="gallery__desc">
          Diseños exclusivos para Second Life. Próximamente disponibles en nuestra tienda.
        </p>
      </div>

      <div className="gallery__filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`gallery__filter ${activeFilter === cat ? 'gallery__filter--active' : ''}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="gallery__grid">
        {filtered.map(item => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
