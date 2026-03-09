import './Hero.css';
import craftyLogo from '../assets/craftylogo.png';

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__background-glow"></div>

      <div className="hero__container">

        <div className="hero__top-badge">
          <span className="hero__badge-dot"></span>
          AVAILABLE EVERY SATURDAY AT 09 AM SLT
        </div>

        <h1 className="hero__title">
          WELCOME TO<br />
          <span className="hero__title-highlight">CRAFTY VIRTUAL COUTURE</span>
        </h1>

        <div className="hero__center-showcase">
          <div className="hero__blob">
            <div className="hero__blob-inner">
              <img src={craftyLogo} alt="Crafty" className="hero__center-logo" />
              <div className="hero__event-text">
                <span className="hero__event-time">SATURDAY 09 AM SLT</span>
                <span className="hero__event-price">
                  50L-<br />100L
                </span>
              </div>
            </div>
          </div>

          {/* Floating elements similar to reference */}
          <div className="hero__floating-feature hero__floating-feature--left">
            <span className="hero__floating-text">50-100L</span>
          </div>

          <div className="hero__floating-feature hero__floating-feature--right">
            <span className="hero__floating-text">SALES EVENT</span>
          </div>

          <div className="hero__info-list">
            <div className="hero__info-item">
              <span className="hero__info-icon">+</span>
              <span>Powered by CRAFTY Event</span>
            </div>
            <div className="hero__info-item">
              <span className="hero__info-icon">+</span>
              <span>Every Saturday</span>
            </div>
          </div>
        </div>

        <div className="hero__scroll-indicator">
          <a href="#coleccion" aria-label="Scroll down">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
