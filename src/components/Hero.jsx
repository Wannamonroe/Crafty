import './Hero.css';
import craftyLogo from '../assets/craftylogo.png';

export default function Hero() {
  return (
    <section className="hero" id="home">

      {/* ── Animated background layers ─────────────────────────── */}

      {/* Grid mesh */}
      <div className="hero__mesh" aria-hidden="true" />

      {/* Large ambient orbs */}
      <div className="hero__orb hero__orb--1" aria-hidden="true" />
      <div className="hero__orb hero__orb--2" aria-hidden="true" />
      <div className="hero__orb hero__orb--3" aria-hidden="true" />

      {/* Floating gold particles */}
      <div className="hero__particles" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, i) => (
          <span key={i} className={`hero__particle hero__particle--${i + 1}`} />
        ))}
      </div>

      {/* Diagonal shimmer lines */}
      <div className="hero__shimmer" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="hero__container">
        <div className="hero__top-badge">
          <span className="hero__badge-dot"></span>
          AVAILABLE EVERY FRIDAY AT 08 AM SLT
        </div>

        <div className="hero__center-showcase">
          <h1 className="hero__title">
            <span className="hero__title-line">WELCOME TO</span>
          </h1>

          <div className="hero__logo-wrapper">
            <img src={craftyLogo} alt="Crafty Logo" className="hero__main-logo" />
          </div>
        </div>

        <div className="hero__scroll-indicator">
          <a href="#gallery" aria-label="Scroll down">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
