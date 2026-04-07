import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/craftylogo.png';
import './Navbar.css';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#about', label: 'About Us' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolled style
      setScrolled(currentScrollY > 50);

      // Visibility logic
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        // Scrolling down and past a threshold
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    setActiveSection(href.replace('#', ''));
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${!visible && !menuOpen ? 'navbar--hidden' : ''}`}>
      <div className="navbar__container">
        <a href="#home" className="navbar__brand" onClick={() => handleNavClick('#home')}>
          <img src={logo} alt="Crafty Logo" className="navbar__logo" />
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
            <Link to="/apply" className="navbar__cta" onClick={() => handleNavClick('apply')}>
              Apply
            </Link>
          </li>
          <li>
            <Link to="/admin/login" className="navbar__admin-link" onClick={() => setMenuOpen(false)}>
              <span className="admin-icon">⚙️</span> Admin
            </Link>
          </li>
        </ul>

        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
