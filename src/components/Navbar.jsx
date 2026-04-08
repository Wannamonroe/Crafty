import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import logo from '../assets/craftylogo.png';
import './Navbar.css';

const DEFAULT_LINKS = {
  footer_facebook_album: 'https://www.facebook.com',
  footer_seraphim_gallery: 'https://seraphimsl.com',
  footer_facebook_group: 'https://www.facebook.com',
  footer_inworld_group: 'https://secondlife.com',
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [socialLinks, setSocialLinks] = useState(DEFAULT_LINKS);
  const location = useLocation();

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
          setSocialLinks(map);
        }
      } catch (err) {}
    }
    fetchLinks();
  }, []);

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
          {[
            { href: '/#home', label: 'Home' },
            { href: '/#gallery', label: 'Gallery' },
            { href: '/#about', label: 'About Us' },
          ].map((link) => {
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
          
          {/* External Social Links */}
          <li>
            <a href={socialLinks.footer_facebook_album} target="_blank" rel="noreferrer" className="navbar__link">
              Facebook Album
            </a>
          </li>
          <li>
            <a href={socialLinks.footer_seraphim_gallery} target="_blank" rel="noreferrer" className="navbar__link">
              Seraphim Gallery
            </a>
          </li>
          <li>
            <a href={socialLinks.footer_facebook_group} target="_blank" rel="noreferrer" className="navbar__link">
              Facebook Group
            </a>
          </li>
          <li>
            <a href={socialLinks.footer_inworld_group} target="_blank" rel="noreferrer" className="navbar__link">
              Inworld Group
            </a>
          </li>

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
