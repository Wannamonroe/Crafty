import { useState, useEffect } from 'react';
import logo from '../assets/react.svg';
import './Navbar.css';

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#coleccion', label: 'Colección' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    setActiveSection(href.replace('#', ''));
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <a href="#inicio" className="navbar__brand" onClick={() => handleNavClick('#inicio')}>
          <img src={logo} alt="Crafty Logo" className="navbar__logo" />
          <span className="navbar__brand-name">CRAFTY</span>
        </a>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`navbar__link ${activeSection === link.href.replace('#', '') ? 'navbar__link--active' : ''}`}
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#coleccion" className="navbar__cta" onClick={() => handleNavClick('#coleccion')}>
              Ver Tienda
            </a>
          </li>
        </ul>

        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
