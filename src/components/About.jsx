import { useState, useEffect } from 'react';
import './About.css';
import craftyLogo from '../assets/craftylogo.png';
import { supabase } from '../lib/supabase';

const DEFAULT_TITLE = 'Digital Elegance';
const DEFAULT_TEXT  =
  'Crafty is a premier weekly event in Second Life dedicated to high-end virtual aesthetics. ' +
  'We bring together the finest digital designers to offer exclusive, meticulously crafted ' +
  'clothing, accessories, and aesthetic enhancements for your avatar.\n\n' +
  'Every weekend, discover a curated selection of virtual couture designed to elevate ' +
  'your digital presence to the highest standard of luxury.';

export default function About() {
  const [title, setTitle]   = useState(DEFAULT_TITLE);
  const [text,  setText]    = useState(DEFAULT_TEXT);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', ['about_title', 'about_text']);

        if (!error && data) {
          data.forEach(({ key, value }) => {
            if (key === 'about_title' && value) setTitle(value);
            if (key === 'about_text'  && value) setText(value);
          });
        }
      } catch (_) {}
    }
    fetchAbout();
  }, []);

  // Split text on double newlines into paragraphs
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);

  return (
    <section className="about" id="about">
      <div className="about__container">
        <div className="about__content">
          <div className="about__text-block">
            <h2 className="about__title">{title}</h2>
            {paragraphs.map((p, i) => (
              <p key={i} className="about__description">{p}</p>
            ))}
          </div>

          <div className="about__visual">
            <div className="about__logo-container">
              <img src={craftyLogo} alt="Crafty Logo" className="about__logo" />
              <div className="about__glow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
