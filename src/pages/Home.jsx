import '../index.css';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ImageCarousel from '../components/ImageCarousel';
import Gallery from '../components/Gallery';
import About from '../components/About';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero id="home" />
        <ImageCarousel />
        <Gallery />
        <About />
      </main>
      <Footer />
    </div>
  );
}
