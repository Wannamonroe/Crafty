import { useState, useEffect, useRef } from 'react';
import './QuoteCarousel.css';

const quotes = [
  {
    text: "Monthly Event · The Arcade · Collabor88 · Fameshed",
    sub: "Los mejores eventos te esperan",
    id: 1,
    text: "La moda en Second Life no es solo vestirse, es proyectar quien realmente quieres ser sin las limitaciones del mundo físico.",
    author: "Vogue Virtual"
  },
  {
    id: 2,
    text: "Crafty ha elevado el estándar de lo que consideramos alta costura digital. Sus texturas son inigualables.",
    author: "SL Style Magazine"
  },
  {
    id: 3,
    text: "Vestir un diseño de Crafty es experimentar el lujo en su estado más puro e inmaterial.",
    author: "Avatar Chic"
  }
];

export default function QuoteCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextQuote = () => setCurrentIndex((prev) => (prev + 1) % quotes.length);
  const prevQuote = () => setCurrentIndex((prev) => (prev === 0 ? quotes.length - 1 : prev - 1));

  return (
    <section className="quotes-editorial">
      <div className="quotes-editorial__container">
        <div className="quotes-editorial__content">
          <blockquote className="quotes-editorial__text">
            "{quotes[currentIndex].text}"
          </blockquote>
          <span className="quotes-editorial__author">&mdash; {quotes[currentIndex].author}</span>
        </div>
        
        <div className="quotes-editorial__controls">
          <button className="quotes-editorial__btn" onClick={prevQuote}>
            ANTERIOR
          </button>
          
          <div className="quotes-editorial__counter">
            0{currentIndex + 1} / 0{quotes.length}
          </div>
          
          <button className="quotes-editorial__btn" onClick={nextQuote}>
            SIGUIENTE
          </button>
        </div>
      </div>
    </section>
  );
}
