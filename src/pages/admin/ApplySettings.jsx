import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './ApplySettings.css';

const DEFAULT_APPLY_TEXT = "Are you a creator? Join us as a designer and showcase your creations in our exclusive event. Perfect for fashion designers, accessory creators, and visual artists";
const DEFAULT_APPLY_URL = "https://forms.gle/";

export default function ApplySettings() {
  const [applyText, setApplyText] = useState(DEFAULT_APPLY_TEXT);
  const [applyUrl, setApplyUrl] = useState(DEFAULT_APPLY_URL);
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
        .in('key', ['apply_text', 'apply_url']);

      if (!error && data) {
        data.forEach(({ key, value }) => {
          if (key === 'apply_text' && value) setApplyText(value);
          if (key === 'apply_url' && value) setApplyUrl(value);
        });
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert([
          { key: 'apply_text', value: applyText.trim(), updated_at: new Date().toISOString() },
          { key: 'apply_url', value: applyUrl.trim(), updated_at: new Date().toISOString() },
        ], { onConflict: 'key' });

      if (error) throw error;
      setStatus('success');
    } catch (err) {
      console.error('Error saving apply settings:', err);
      setStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3500);
    }
  }

  function handleReset() {
    if (!window.confirm('¿Restaurar los valores por defecto?')) return;
    setApplyText(DEFAULT_APPLY_TEXT);
    setApplyUrl(DEFAULT_APPLY_URL);
  }

  if (loading) return (
    <div className="apply-settings-view">
      <p className="apply-settings-loading">Cargando...</p>
    </div>
  );

  return (
    <div className="apply-settings-view">
      <div className="apply-settings-header">
        <h1>Configuración de Apply</h1>
        <p className="apply-settings-subtitle">
          Edita el texto persuasivo y el enlace al formulario de Google que verán los creadores.
        </p>
      </div>

      <form className="apply-settings-form" onSubmit={handleSave}>
        <div className="apply-settings-preview">
          <span className="apply-settings-preview__label">Vista previa del mensaje</span>
          <p className="apply-settings-preview__text">{applyText || 'Escribe algo...'}</p>
          <div className="apply-settings-preview__link">URL: <span className="url-text">{applyUrl}</span></div>
        </div>

        <div className="apply-settings-fields">
          <div className="apply-settings-field">
            <label htmlFor="apply-text" className="apply-settings-field__label">
              Texto descriptivo
            </label>
            <textarea
              id="apply-text"
              className="apply-settings-field__textarea"
              value={applyText}
              onChange={(e) => setApplyText(e.target.value)}
              placeholder="Introduce el texto para los diseñadores..."
              rows={6}
              required
            />
            <span className="apply-settings-field__count">{applyText.length} caracteres</span>
          </div>

          <div className="apply-settings-field">
            <label htmlFor="apply-url" className="apply-settings-field__label">
              Google Form URL
            </label>
            <input
              id="apply-url"
              type="url"
              className="apply-settings-field__input"
              value={applyUrl}
              onChange={(e) => setApplyUrl(e.target.value)}
              placeholder="https://forms.gle/..."
              required
            />
          </div>
        </div>

        <div className="apply-settings-actions">
          {status === 'success' && (
            <span className="apply-settings-msg apply-settings-msg--success">
              ✅ Cambios guardados correctamente
            </span>
          )}
          {status === 'error' && (
            <span className="apply-settings-msg apply-settings-msg--error">
              ❌ Error al guardar. Inténtalo de nuevo.
            </span>
          )}
          <button
            type="button"
            className="apply-settings-reset-btn"
            onClick={handleReset}
            disabled={saving}
          >
            ↩ Restaurar defecto
          </button>
          <button
            type="submit"
            className="apply-settings-save-btn"
            disabled={saving}
          >
            {saving ? 'Guardando...' : '💾 Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
