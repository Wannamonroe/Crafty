import './Footer.css';
import logo from '../assets/craftylogo.png';

export default function Footer() {
  return (
    <footer className="footer" id="contacto">
      <div className="footer__glow"></div>
      <div className="footer__inner">
        <div className="footer__brand">
          <img src={logo} alt="Crafty" className="footer__logo" />
          <span className="footer__name">CRAFTY</span>
          <p className="footer__tagline">
            Moda exclusiva para Second Life.<br />Tu avatar merece lo mejor.
          </p>
        </div>

        <div className="footer__links-group">
          <h4 className="footer__heading">Explorar</h4>
          <ul className="footer__links">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#coleccion">Colección</a></li>
            <li><a href="#nosotros">Nosotros</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>

        <div className="footer__links-group">
          <h4 className="footer__heading">Eventos SL</h4>
          <ul className="footer__links">
            <li><a href="#">Monthly Event</a></li>
            <li><a href="#">Arcade Gacha</a></li>
            <li><a href="#">Collabor88</a></li>
            <li><a href="#">Fameshed</a></li>
          </ul>
        </div>

        <div className="footer__social">
          <h4 className="footer__heading">Síguenos</h4>
          <div className="footer__social-links">
            <a href="#" className="footer__social-link" aria-label="Flickr">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="7" cy="12" r="5.5"/>
                <circle cx="17" cy="12" r="5.5" fill="none" stroke="currentColor" strokeWidth="0"/>
                <circle cx="17" cy="12" r="5.5" opacity="0.7"/>
              </svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="Marketplace">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4.5"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Crafty. Todos los derechos reservados.</p>
        <p>Hecho con <span className="footer__heart">♥</span> para Second Life</p>
      </div>
    </footer>
  );
}
