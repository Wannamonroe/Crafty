import './Footer.css';
import craftyLogo from '../assets/craftylogo.png';

export default function Footer() {
  return (
    <footer className="footer-editorial">
      <div className="footer-editorial__top">
        <div className="footer-editorial__col footer-editorial__col--brand">
          <img src={craftyLogo} alt="Crafty Logo" className="footer-editorial__logo" />
          <p className="footer-editorial__desc">
            Redefiniendo la costura en Second Life a través del arte digital y patrones de pixel perfectos.
          </p>
        </div>

        <div className="footer-editorial__col">
          <h4 className="footer-editorial__heading">Colecciones</h4>
          <ul className="footer-editorial__links">
            <li><a href="#vestidos">Vestidos de Noche</a></li>
            <li><a href="#casual">Casual & Streetwear</a></li>
            <li><a href="#accesorios">Accesorios</a></li>
            <li><a href="#eventos">Eventos Exclusivos</a></li>
          </ul>
        </div>

        <div className="footer-editorial__col">
          <h4 className="footer-editorial__heading">Maison Crafty</h4>
          <ul className="footer-editorial__links">
            <li><a href="#nosotros">Sobre Nosotros</a></li>
            <li><a href="#journal">El Journal</a></li>
            <li><a href="#contacto">Contacto & Prensa</a></li>
            <li><a href="#atencion">Atención al Cliente</a></li>
          </ul>
        </div>

        <div className="footer-editorial__col">
          <h4 className="footer-editorial__heading">Social</h4>
          <div className="footer-editorial__socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">IG.</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">TW.</a>
            <a href="https://flickr.com" target="_blank" rel="noreferrer">FL.</a>
          </div>
        </div>
      </div>

      <div className="footer-editorial__massive-brand">
        CRAFTY
      </div>

      <div className="footer-editorial__bottom">
        <span>&copy; {new Date().getFullYear()} CRAFTY. TODOS LOS DERECHOS RESERVADOS.</span>
        <span>MODA DIGITAL CREADA CON PASIÓN.</span>
      </div>
    </footer>
  );
}
