import { useState } from 'react';
import './Gallery.css';

const items = [
  { id: 1, name: 'Eclipse Dress', category: 'Vestidos', isNew: true },
  { id: 2, name: 'Nova Jacket', category: 'Chaquetas', isNew: false },
  { id: 3, name: 'Stellar Gown', category: 'Vestidos', isNew: false },
  { id: 4, name: 'Void Corset', category: 'Tops', isNew: true },
  { id: 5, name: 'Nebula Skirt', category: 'Faldas', isNew: false },
  { id: 6, name: 'Quantum Pants', category: 'Pantalones', isNew: false },
  { id: 7, name: 'Aura Suit', category: 'Conjuntos', isNew: true },
  { id: 8, name: 'Celestial Top', category: 'Tops', isNew: false },
];

export default function Gallery() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="lookbook" id="coleccion">
      <div className="lookbook__header">
        <h2 className="lookbook__title">Gallery</h2>
      </div>

      <div className="lookbook__grid">
        {items.map((item) => (
          <article
            key={item.id}
            className="lookbook__item"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="lookbook__image-wrap">
              <div className="lookbook__image-placeholder">
                <span className="lookbook__image-text">Image coming soon</span>
              </div>
            </div>
            <div className="lookbook__info">
              <span className="lookbook__category">{item.category}</span>
              <h3 className="lookbook__name">{item.name}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
