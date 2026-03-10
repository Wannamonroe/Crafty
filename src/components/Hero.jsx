import './Hero.css';
import craftyLogo from '../assets/craftylogo.png';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__ambient-light hero__ambient-light--1"></div>
      <div className="hero__ambient-light hero__ambient-light--2"></div>

      <div className="hero__container">
        <div className="hero__top-badge">
          <span className="hero__badge-dot"></span>
          AVAILABLE EVERY FRIDAY AT 08 AM SLT
        </div>

        <div className="hero__center-showcase">
          <h1 className="hero__title">
            <span className="hero__title-line">WELCOME TO CRAFTY</span>
            <span className="hero__title-highlight">WEEKEND SALES</span>
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
