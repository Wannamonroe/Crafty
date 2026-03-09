import './Hero.css';
import craftyLogo from '../assets/craftylogo.png';

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__container">
        
        <div className="hero__left">
          <span className="hero__pre-title">Second Life Fashion &middot; Virtual Couture</span>
          
          <h1 className="hero__title">
            <span className="hero__title-line">Moda que</span>
            <div className="hero__title-line-mixed">
              <span>vive</span>
              <img src={craftyLogo} alt="Crafty" className="hero__inline-logo" />
            </div>
            <span className="hero__title-line">dos veces</span>
          </h1>
          
          <p className="hero__subtitle">
            Diseños exclusivos para tu avatar. Cada pieza es una obra de arte digital concebida para redefinir el estándar estético en Second Life.
          </p>
          
          <a href="#coleccion" className="hero__btn">
            Explorar Colección
          </a>
        </div>

        <div className="hero__right">
          <div className="hero__image-placeholder">
             {/* Aquí iría una foto destacada editorial, o espacio flotante */}
             <div className="hero__decor-circle"></div>
          </div>
          
          <div className="hero__scroll-indicator">
            <span className="hero__scroll-text">Descubre más</span>
            <div className="hero__scroll-line"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
