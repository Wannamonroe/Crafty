import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/craftylogo.png';
import './Navbar.css';

const navLinks = [
  { href: '/#home', label: 'Home' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/#about', label: 'About Us' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Current section detection based on path & hash
    if (location.pathname === '/apply') {
      setActiveSection('apply');
    } else if (location.hash) {
      setActiveSection(location.hash.replace('#', ''));
    } else {
      setActiveSection('home');
    }
  }, [location]);

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

  const handleNavClick = (section) => {
    setMenuOpen(false);
    setActiveSection(section);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${!visible && !menuOpen ? 'navbar--hidden' : ''}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__brand" onClick={() => handleNavClick('home')}>
          <img src={logo} alt="Crafty Logo" className="navbar__logo" />
        </Link>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map((link) => {
            const section = link.href.split('#')[1];
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`navbar__link ${activeSection === section ? 'navbar__link--active' : ''}`}
                  onClick={() => handleNavClick(section)}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
          <li>
            <Link 
              to="/apply" 
              className={`navbar__cta ${activeSection === 'apply' ? 'navbar__link--active' : ''}`} 
              onClick={() => handleNavClick('apply')}
            >
              Apply
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
