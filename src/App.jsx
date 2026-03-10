import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuoteCarousel from './components/QuoteCarousel';
import Gallery from './components/Gallery';
import About from './components/About';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero id="home" />
        <QuoteCarousel />
        <Gallery />
        <About />
      </main>
      <Footer />
    </div>
  );
}

export default App;
