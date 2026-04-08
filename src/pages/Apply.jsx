import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Apply.css';

const DEFAULT_APPLY_TITLE = "Join the Collective";
const DEFAULT_APPLY_TEXT = "Are you a creator? Join us as a designer and showcase your creations in our exclusive event. Perfect for fashion designers, accessory creators, and visual artists";
const DEFAULT_APPLY_URL = "https://forms.gle/"; // Placeholder

export default function Apply() {
  const [applyTitle, setApplyTitle] = useState(DEFAULT_APPLY_TITLE);
  const [applyText, setApplyText] = useState(DEFAULT_APPLY_TEXT);
  const [applyUrl, setApplyUrl] = useState(DEFAULT_APPLY_URL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplySettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', ['apply_title', 'apply_text', 'apply_url']);

        if (!error && data) {
          data.forEach(item => {
            if (item.key === 'apply_title' && item.value) setApplyTitle(item.value);
            if (item.key === 'apply_text' && item.value) setApplyText(item.value);
            if (item.key === 'apply_url' && item.value) setApplyUrl(item.value);
          });
        }
      } catch (err) {
        console.error('Error fetching apply settings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchApplySettings();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="apply-page">
      <Navbar />
      
      <main className="apply-content">
        <div className="apply-container">
          <div className="apply-card">
            <h1 className="apply-title">{applyTitle}</h1>
            <div className="apply-divider"></div>
            
            {loading ? (
              <div className="apply-loading">Loading application details...</div>
            ) : (
              <>
                <p className="apply-description">
                  {applyText}
                </p>
                
                <div className="apply-actions">
                  <a 
                    href={applyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="apply-button"
                  >
                    Apply Now
                    <span className="apply-button__icon">→</span>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
