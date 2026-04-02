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
          <p className="footer-modern__tagline">DIGITAL COUTURE &amp; VIRTUAL ELEGANCE</p>
        </div>

        <div className="footer-modern__nav">
          <a href="#galeria" className="footer-modern__link">GALERÍA</a>
          <a href="#eventos" className="footer-modern__link">EVENTOS</a>
          <a href="#nosotros" className="footer-modern__link">NOSOTROS</a>
          <a href="#contacto" className="footer-modern__link">CONTACTO</a>
        </div>

        <div className="footer-modern__socials">
          <a href={links.footer_facebook_album}  target="_blank" rel="noreferrer" className="footer-social-btn">
            <span className="footer-social-btn__icon">📘</span>
            FACEBOOK ALBUM
          </a>
          <a href={links.footer_facebook_group}  target="_blank" rel="noreferrer" className="footer-social-btn">
            <span className="footer-social-btn__icon">👥</span>
            FACEBOOK GROUP
          </a>
          <a href={links.footer_inworld_group}   target="_blank" rel="noreferrer" className="footer-social-btn">
            <span className="footer-social-btn__icon">🌐</span>
            INWORLD GROUP
          </a>
          <a href={links.footer_seraphim_gallery} target="_blank" rel="noreferrer" className="footer-social-btn">
            <span className="footer-social-btn__icon">✨</span>
            SERAPHIM GALLERY
          </a>
        </div>

        <div className="footer-modern__bottom">
          <span className="footer-modern__copy">&copy; {new Date().getFullYear()} CRAFTY. ALL RIGHTS RESERVED.</span>
          <span className="footer-modern__credits">DESIGNED FOR SECOND LIFE</span>
        </div>
      </div>
    </footer>
  );
}
