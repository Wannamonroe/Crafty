import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Hero.css';
import craftyLogo from '../assets/craftylogo.png';

/* ── SVG Icons (Copied from Footer) ────────────────────────────────────── */

function FacebookIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-social-icon">
      <rect width="36" height="36" fill="#1877F2" rx="10" />
      <path
        fill="#fff"
        d="M20.5 6.5h-2.8C15 6.5 13 8.6 13 11.4v2.6h-2.5V18H13v11h4.5V18h3l.5-4h-3.5v-2.2c0-.9.5-1.3 1.3-1.3H21.5V6.5H20.5z"
      />
    </svg>
  );
}

function InworldIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-social-icon">
      <rect width="36" height="36" rx="10" fill="#111"/>
      <rect width="36" height="36" rx="10" fill="url(#hero_iw_grad)"/>
      <circle cx="18" cy="18" r="9.5" stroke="#fff" strokeWidth="1.4" fill="none"/>
      <ellipse cx="18" cy="18" rx="4.5" ry="9.5" stroke="#fff" strokeWidth="1.4" fill="none"/>
      <line x1="8.5" y1="18" x2="27.5" y2="18" stroke="#fff" strokeWidth="1.4"/>
      <line x1="10" y1="13" x2="26" y2="13" stroke="#fff" strokeWidth="1" opacity="0.6"/>
      <line x1="10" y1="23" x2="26" y2="23" stroke="#fff" strokeWidth="1" opacity="0.6"/>
      <defs>
        <linearGradient id="hero_iw_grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6C3BFF"/>
          <stop offset="1" stopColor="#3B82F6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function SeraphimIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-social-icon">
      <rect width="36" height="36" rx="10" fill="url(#hero_sr_grad)"/>
      <path
        d="M18 26 C14 22, 8 20, 9 14 C10 10, 14 10, 16 13 C12 13, 11 16, 13 18 C15 20, 17 20, 18 26Z"
        fill="rgba(255,255,255,0.9)"
      />
      <path
        d="M18 26 C22 22, 28 20, 27 14 C26 10, 22 10, 20 13 C24 13, 25 16, 23 18 C21 20, 19 20, 18 26Z"
        fill="rgba(255,255,255,0.9)"
      />
      <circle cx="18" cy="12" r="2" fill="#fff"/>
      <defs>
        <linearGradient id="hero_sr_grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C026D3"/>
          <stop offset="1" stopColor="#7C3AED"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

const HERO_SOCIAL_BUTTONS = [
  { key: 'footer_facebook_album',  label: 'Facebook Album',  Icon: FacebookIcon,  positionClass: 'hero-social--top-left' },
  { key: 'footer_seraphim_gallery',label: 'Seraphim Gallery',Icon: SeraphimIcon,  positionClass: 'hero-social--top-right' },
  { key: 'footer_inworld_group',   label: 'Inworld Group',   Icon: InworldIcon,   positionClass: 'hero-social--bottom-left' },
  { key: 'footer_facebook_group',  label: 'Facebook Group',  Icon: FacebookIcon,  positionClass: 'hero-social--bottom-right' },
];

export default function Hero() {
  const [links, setLinks] = useState({
    footer_facebook_album: 'https://www.facebook.com',
    footer_facebook_group: 'https://www.facebook.com',
    footer_inworld_group: 'https://secondlife.com',
    footer_seraphim_gallery: 'https://seraphimsl.com',
  });

  useEffect(() => {
    async function fetchLinks() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', HERO_SOCIAL_BUTTONS.map(b => b.key));

        if (!error && data) {
          const map = { ...links };
          data.forEach(({ key, value }) => { map[key] = value; });
          setLinks(map);
        }
      } catch (err) {
        console.error('Hero: error cargando links', err);
      }
    }
    fetchLinks();
  }, []);
  return (
    <section className="hero" id="home">

      {/* ── Animated background layers ─────────────────────────── */}

      {/* Grid mesh */}
      <div className="hero__mesh-container" aria-hidden="true">
        <div className="hero__mesh" />
      </div>

      {/* Large ambient orbs */}
      <div className="hero__orb hero__orb--1" aria-hidden="true" />
      <div className="hero__orb hero__orb--2" aria-hidden="true" />
      <div className="hero__orb hero__orb--3" aria-hidden="true" />

      {/* Floating gold particles */}
      <div className="hero__particles" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, i) => (
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

          <div className="hero__logo-wrapper" style={{ '--logo-url': `url(${craftyLogo})` }}>
            <img src={craftyLogo} alt="Crafty Logo" className="hero__main-logo" />
            <div className="hero__logo-glint" aria-hidden="true" />
            
            {/* 4 Floating Social Links from Footer */}
            {HERO_SOCIAL_BUTTONS.map(({ key, label, Icon, positionClass }) => (
              <a
                key={key}
                href={links[key]}
                target="_blank"
                rel="noreferrer"
                className={`hero-social-pill ${positionClass}`}
                aria-label={label}
              >
                <div className="hero-social-pill__icon">
                  <Icon />
                </div>
                <span className="hero-social-pill__label">{label}</span>
              </a>
            ))}
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
