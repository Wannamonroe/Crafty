import { useState, useEffect } from 'react';
import './Footer.css';
import craftyLogo from '../assets/craftylogo.png';
import { supabase } from '../lib/supabase';

const DEFAULT_LINKS = {
  footer_facebook_album: 'https://www.facebook.com',
  footer_facebook_group: 'https://www.facebook.com',
  footer_inworld_group: 'https://secondlife.com',
  footer_seraphim_gallery: 'https://seraphimsl.com',
};

/* ── SVG Icons ─────────────────────────────────────────────────────────── */

function FacebookIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="social-logo">
      {/* Fondo azul que rellena todo el viewBox — el contenedor lo recorta con border-radius */}
      <rect width="36" height="36" fill="#1877F2" />
      {/* "f" limpia y bien centrada */}
      <path
        fill="#fff"
        d="M20.5 6.5h-2.8C15 6.5 13 8.6 13 11.4v2.6h-2.5V18H13v11h4.5V18h3l.5-4h-3.5v-2.2c0-.9.5-1.3 1.3-1.3H21.5V6.5H20.5z"
      />
    </svg>
  );
}

function InworldIcon() {
  /* Inworld AI logo — stylised "i" in a rounded square */
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="social-logo">
      <rect width="36" height="36" rx="10" fill="#111" />
      <rect width="36" height="36" rx="10" fill="url(#iw_grad)" />
      {/* Globe rings */}
      <circle cx="18" cy="18" r="9.5" stroke="#fff" strokeWidth="1.4" fill="none" />
      <ellipse cx="18" cy="18" rx="4.5" ry="9.5" stroke="#fff" strokeWidth="1.4" fill="none" />
      <line x1="8.5" y1="18" x2="27.5" y2="18" stroke="#fff" strokeWidth="1.4" />
      <line x1="10" y1="13" x2="26" y2="13" stroke="#fff" strokeWidth="1" opacity="0.6" />
      <line x1="10" y1="23" x2="26" y2="23" stroke="#fff" strokeWidth="1" opacity="0.6" />
      <defs>
        <linearGradient id="iw_grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6C3BFF" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SeraphimIcon() {
  /* Seraphim — stylised feathered wing / "S" mark */
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="social-logo">
      <rect width="36" height="36" rx="10" fill="url(#sr_grad)" />
      {/* Left wing */}
      <path
        d="M18 26 C14 22, 8 20, 9 14 C10 10, 14 10, 16 13 C12 13, 11 16, 13 18 C15 20, 17 20, 18 26Z"
        fill="rgba(255,255,255,0.9)"
      />
      {/* Right wing */}
      <path
        d="M18 26 C22 22, 28 20, 27 14 C26 10, 22 10, 20 13 C24 13, 25 16, 23 18 C21 20, 19 20, 18 26Z"
        fill="rgba(255,255,255,0.9)"
      />
      {/* Center body / halo dot */}
      <circle cx="18" cy="12" r="2" fill="#fff" />
      <defs>
        <linearGradient id="sr_grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C026D3" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Social button data ────────────────────────────────────────────────── */

const SOCIAL_BUTTONS = [
  { key: 'footer_facebook_album', label: 'Facebook Album', Icon: FacebookIcon },
  { key: 'footer_facebook_group', label: 'Facebook Group', Icon: FacebookIcon },
  { key: 'footer_inworld_group', label: 'Inworld Group', Icon: InworldIcon },
  { key: 'footer_seraphim_gallery', label: 'Seraphim Gallery', Icon: SeraphimIcon },
];

/* ── Component ─────────────────────────────────────────────────────────── */

export default function Footer() {
  const [links, setLinks] = useState(DEFAULT_LINKS);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', Object.keys(DEFAULT_LINKS));

        if (!error && data) {
          const map = { ...DEFAULT_LINKS };
          data.forEach(({ key, value }) => { map[key] = value; });
          setLinks(map);
        }
      } catch (err) {
        console.error('Footer: error cargando links', err);
      }
    }
    fetchLinks();
  }, []);

  return (
    <footer className="footer-modern">
      <div className="footer-modern__container">

        <div className="footer-modern__brand">
          <img src={craftyLogo} alt="Crafty Logo" className="footer-modern__logo" />
          <p className="footer-modern__tagline">Crafted with Love, Priced for You</p>
        </div>

        <div className="footer-modern__nav">
          <a href="/#home" className="footer-modern__link">HOME</a>
          <a href="/#gallery" className="footer-modern__link">GALLERY</a>
          <a href="/#about" className="footer-modern__link">ABOUT US</a>
          <a href="/apply" className="footer-modern__link">APPLY</a>
        </div>

        <div className="footer-modern__socials">
          {SOCIAL_BUTTONS.map(({ key, label, Icon }) => (
            <a
              key={key}
              href={links[key]}
              target="_blank"
              rel="noreferrer"
              className="footer-social-btn"
            >
              <span className="footer-social-btn__logo">
                <Icon />
              </span>
              <span className="footer-social-btn__label">{label}</span>
            </a>
          ))}
        </div>

        <div className="footer-modern__bottom">
          <span className="footer-modern__copy">&copy; {new Date().getFullYear()} CRAFTY. ALL RIGHTS RESERVED.</span>
          <span className="footer-modern__credits"></span>
        </div>

      </div>
    </footer>
  );
}
