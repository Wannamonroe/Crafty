import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './FooterSettings.css';

const FOOTER_KEYS = [
  {
    key: 'footer_facebook_album',
    label: 'Facebook Album',
    icon: '📘',
    placeholder: 'https://www.facebook.com/...',
  },
  {
    key: 'footer_facebook_group',
    label: 'Facebook Group',
    icon: '👥',
    placeholder: 'https://www.facebook.com/groups/...',
  },
  {
    key: 'footer_inworld_group',
    label: 'Inworld Group',
    icon: '🌐',
    placeholder: 'https://secondlife.com/...',
  },
  {
    key: 'footer_seraphim_gallery',
    label: 'Seraphim Gallery',
    icon: '✨',
    placeholder: 'https://seraphimsl.com/...',
  },
];

export default function FooterSettings() {
  const [values, setValues] = useState({
    footer_facebook_album: '',
    footer_facebook_group: '',
    footer_inworld_group: '',
    footer_seraphim_gallery: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', FOOTER_KEYS.map((f) => f.key));

      if (error) throw error;

      const map = { ...values };
      (data || []).forEach(({ key, value }) => { map[key] = value; });
      setValues(map);
    } catch (err) {
      console.error('Error cargando footer settings:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(key, val) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const upserts = Object.entries(values).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('site_settings')
        .upsert(upserts, { onConflict: 'key' });

      if (error) throw error;
      setStatus('success');
    } catch (err) {
      console.error('Error guardando footer settings:', err);
      setStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3500);
    }
  }

  if (loading) {
    return (
      <div className="footer-settings-view">
        <p className="footer-settings-loading">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="footer-settings-view">
      <div className="footer-settings-header">
        <h1>Configuración del Footer</h1>
        <p className="footer-settings-subtitle">
          Edita los enlaces que aparecen en los botones de redes sociales del footer del sitio.
        </p>
      </div>

      <form className="footer-settings-form" onSubmit={handleSave}>
        <div className="footer-settings-grid">
          {FOOTER_KEYS.map(({ key, label, icon, placeholder }) => (
            <div key={key} className="footer-settings-card">
              <div className="footer-settings-card__title">
                <span className="footer-settings-card__icon">{icon}</span>
                {label}
              </div>

              <label className="footer-settings-card__label" htmlFor={key}>
                URL de destino
              </label>
              <input
                id={key}
                type="url"
                className="footer-settings-card__input"
                value={values[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                required
              />

              <a
                href={values[key] || '#'}
                target="_blank"
                rel="noreferrer"
                className="footer-settings-card__preview"
              >
                ↗ Ver enlace actual
              </a>
            </div>
          ))}
        </div>

        <div className="footer-settings-actions">
          {status === 'success' && (
            <span className="footer-settings-msg footer-settings-msg--success">
              ✅ Cambios guardados correctamente
            </span>
          )}
          {status === 'error' && (
            <span className="footer-settings-msg footer-settings-msg--error">
              ❌ Error al guardar. Inténtalo de nuevo.
            </span>
          )}
          <button
            type="submit"
            className="footer-settings-save-btn"
            disabled={saving}
          >
            {saving ? 'Guardando...' : '💾 Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
