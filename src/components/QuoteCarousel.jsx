import './QuoteCarousel.css';

const phrases = [
  "WEEKLY EVENT",
  "WEEKEND SALES",
  "NEW ARRIVALS",
  "EXCLUSIVE RELEASES",
  "CRAFTY ORIGINAL",
  "HIGH FASHION",
  "DIGITAL COUTURE"
];

export default function QuoteCarousel() {
  // Render a single group of phrases
  const renderGroup = (keyPrefix) => (
    <div className="quote-marquee__group" aria-hidden={keyPrefix !== 'g1' ? 'true' : 'false'} key={keyPrefix}>
      {phrases.map((phrase, index) => (
        <div className="quote-marquee__item" key={`${keyPrefix}-${index}`}>
          <span>{phrase}</span>
          <span className="quote-marquee__separator"></span>
        </div>
      ))}
    </div>
  );

  return (
    <section className="quote-marquee" aria-label="Scrolling announcements">
      {renderGroup('g1')}
      {renderGroup('g2')}
      {renderGroup('g3')}
      {renderGroup('g4')}
    </section>
  );
}
