import './Footer.css';
import craftyLogo from '../assets/craftylogo.png';

export default function Footer() {
  return (
    <footer className="footer-modern">
      <div className="footer-modern__container">
        <div className="footer-modern__brand">
          <img src={craftyLogo} alt="Crafty Logo" className="footer-modern__logo" />
          <p className="footer-modern__tagline">DIGITAL COUTURE & VIRTUAL ELEGANCE</p>
        </div>

        <div className="footer-modern__nav">
          <a href="#galeria" className="footer-modern__link">GALERÍA</a>
          <a href="#eventos" className="footer-modern__link">EVENTOS</a>
          <a href="#nosotros" className="footer-modern__link">NOSOTROS</a>
          <a href="#contacto" className="footer-modern__link">CONTACTO</a>
        </div>

        <div className="footer-modern__socials">
          <a href="https://instagram.com" target="_blank" rel="noreferrer">INSTAGRAM</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">TWITTER</a>
          <a href="https://flickr.com" target="_blank" rel="noreferrer">FLICKR</a>
        </div>

        <div className="footer-modern__bottom">
          <span className="footer-modern__copy">&copy; {new Date().getFullYear()} CRAFTY. ALL RIGHTS RESERVED.</span>
          <span className="footer-modern__credits">DESIGNED FOR SECOND LIFE</span>
        </div>
      </div>
    </footer>
  );
}
