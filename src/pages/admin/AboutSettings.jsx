import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './AboutSettings.css';

const DEFAULT_TITLE = 'Digital Elegance';
const DEFAULT_TEXT  =
  'Crafty is a premier weekly event in Second Life dedicated to high-end virtual aesthetics. ' +
  'We bring together the finest digital designers to offer exclusive, meticulously crafted ' +
  'clothing, accessories, and aesthetic enhancements for your avatar.\n\n' +
  'Every weekend, discover a curated selection of virtual couture designed to elevate ' +
  'your digital presence to the highest standard of luxury.';

export default function AboutSettings() {
  const [title,   setTitle]   = useState(DEFAULT_TITLE);
  const [text,    setText]    = useState(DEFAULT_TEXT);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState(null); // 'success' | 'error'

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
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
    finally { setLoading(false); }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert([
          { key: 'about_title', value: title.trim(),  updated_at: new Date().toISOString() },
          { key: 'about_text',  value: text.trim(),   updated_at: new Date().toISOString() },
        ], { onConflict: 'key' });

      if (error) throw error;
      setStatus('success');
    } catch (err) {
      console.error('Error guardando About:', err);
      setStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3500);
    }
  }

  function handleReset() {
    if (!window.confirm('¿Restaurar los textos por defecto?')) return;
    setTitle(DEFAULT_TITLE);
    setText(DEFAULT_TEXT);
  }

  if (loading) return (
    <div className="about-settings-view">
      <p className="about-settings-loading">Cargando...</p>
    </div>
  );

  return (
    <div className="about-settings-view">
      <div className="about-settings-header">
        <h1>About Us</h1>
        <p className="about-settings-subtitle">
          Edita el título y el texto del apartado "About Us" de la página principal.
        </p>
      </div>

      <form className="about-settings-form" onSubmit={handleSave}>

        {/* Preview en vivo */}
        <div className="about-settings-preview">
          <span className="about-settings-preview__label">Vista previa</span>
          <h2 className="about-settings-preview__title">{title || 'Título...'}</h2>
          {text.split(/\n{2,}/).filter(Boolean).map((p, i) => (
            <p key={i} className="about-settings-preview__text">{p}</p>
          ))}
        </div>

        {/* Campos */}
        <div className="about-settings-fields">
          <div className="about-settings-field">
            <label htmlFor="about-title" className="about-settings-field__label">
              Título
            </label>
            <input
              id="about-title"
              type="text"
              className="about-settings-field__input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Digital Elegance"
              maxLength={120}
              required
            />
            <span className="about-settings-field__count">{title.length}/120</span>
          </div>

          <div className="about-settings-field">
            <label htmlFor="about-text" className="about-settings-field__label">
              Texto <span className="about-settings-field__hint">(separa párrafos con una línea en blanco)</span>
            </label>
            <textarea
              id="about-text"
              className="about-settings-field__textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe el texto del apartado..."
              rows={8}
              required
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="about-settings-actions">
          {status === 'success' && (
            <span className="about-settings-msg about-settings-msg--success">
              ✅ Cambios guardados correctamente
            </span>
          )}
          {status === 'error' && (
            <span className="about-settings-msg about-settings-msg--error">
              ❌ Error al guardar. Inténtalo de nuevo.
            </span>
          )}
          <button
            type="button"
            className="about-settings-reset-btn"
            onClick={handleReset}
            disabled={saving}
          >
            ↩ Restaurar defecto
          </button>
          <button
            type="submit"
            className="about-settings-save-btn"
            disabled={saving}
          >
            {saving ? 'Guardando...' : '💾 Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
