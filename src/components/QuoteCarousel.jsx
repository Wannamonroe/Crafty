import { useState, useEffect, useRef } from 'react';
import './QuoteCarousel.css';

const quotes = [
  {
    text: "Monthly Event · The Arcade · Collabor88 · Fameshed",
    sub: "Los mejores eventos te esperan",
  },
  {
    text: "La moda es arte. Tu avatar, el lienzo.",
    sub: "Crafty — Virtual Fashion House",
  },
  {
    text: "Gatcha · Fantasy Faire · SaNaRae · Anthem",
    sub: "Coleccionables exclusivos cada temporada",
  },
  {
    text: "Viste tu identidad digital con clase y originalidad.",
    sub: "Crafty — Hecho con amor en Second Life",
  },
  {
    text: "Midnight Order · Kustom9 · Equal10 · Salem",
    sub: "Eventos de moda que marcan tendencia",
  },
  {
    text: "Cada pixel cuenta. Cada look, una historia.",
    sub: "Crafty — Where Style Meets the Metaverse",
  },
];

export default function QuoteCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef(null);

  const goTo = (index) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 400);
  };

  const next = () => goTo((current + 1) % quotes.length);
  const prev = () => goTo((current - 1 + quotes.length) % quotes.length);

  useEffect(() => {
    intervalRef.current = setInterval(next, 4500);
    return () => clearInterval(intervalRef.current);
  }, [current]);

  return (
    <section className="qcarousel" id="nosotros">
      <div className="qcarousel__inner">
        <div className="qcarousel__track">
          <button className="qcarousel__arrow qcarousel__arrow--prev" onClick={prev} aria-label="Anterior">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div className={`qcarousel__content ${animating ? 'qcarousel__content--out' : 'qcarousel__content--in'}`}>
            <div className="qcarousel__quote-icon">"</div>
            <p className="qcarousel__text">{quotes[current].text}</p>
            <span className="qcarousel__sub">{quotes[current].sub}</span>
          </div>

          <button className="qcarousel__arrow qcarousel__arrow--next" onClick={next} aria-label="Siguiente">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <div className="qcarousel__dots">
          {quotes.map((_, i) => (
            <button
              key={i}
              className={`qcarousel__dot ${i === current ? 'qcarousel__dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Ir a frase ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
