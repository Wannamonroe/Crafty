import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__bg-grid"></div>
      <div className="hero__glow hero__glow--top"></div>
      <div className="hero__glow hero__glow--bottom"></div>

      <div className="hero__content">
        <div className="hero__badge">
          <span className="hero__badge-dot"></span>
          <span>Second Life Fashion · Virtual Couture</span>
        </div>

        <h1 className="hero__title">
          <span className="hero__title-line">Moda que</span>
          <span className="hero__title-line hero__title-line--accent">vive dos veces</span>
        </h1>

        <p className="hero__subtitle">
          Diseños exclusivos para tu avatar. Cada pieza, una obra de arte digital.
          Descubre la colección que redefine el estilo en Second Life.
        </p>

        <div className="hero__actions">
          <a href="#coleccion" className="hero__btn hero__btn--primary">
            <span>Explorar Colección</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="#nosotros" className="hero__btn hero__btn--secondary">
            Sobre Crafty
          </a>
        </div>

        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-num">500+</span>
            <span className="hero__stat-label">Diseños únicos</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-num">12K+</span>
            <span className="hero__stat-label">Avatares vestidos</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-num">∞</span>
            <span className="hero__stat-label">Posibilidades</span>
          </div>
        </div>
      </div>

      <div className="hero__scroll-hint">
        <div className="hero__scroll-line"></div>
        <span>Scroll</span>
      </div>
    </section>
  );
}
