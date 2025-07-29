import React, { useState, useEffect } from 'react';
import { useIdioma } from '../context/IdiomaContext';

const idiomasDisponibles = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
];

export default function Configuracion() {
  const [preferencias, setPreferencias] = useState({
    tema: 'claro',
    idioma: 'es',
    notiEmail: true,
    notiPush: false,
  });

  const { cambiarIdioma, t, idioma } = useIdioma();

  useEffect(() => {
    const guardadas = localStorage.getItem('preferenciasApp');
    if (guardadas) {
      const prefs = JSON.parse(guardadas);
      setPreferencias(prefs);
      aplicarTema(prefs.tema);
      if (prefs.idioma !== idioma) {
        cambiarIdioma(prefs.idioma);
      }
    }
  }, [cambiarIdioma, idioma]);

  useEffect(() => {
    localStorage.setItem('preferenciasApp', JSON.stringify(preferencias));
    aplicarTema(preferencias.tema);
    if (preferencias.idioma !== idioma) {
      cambiarIdioma(preferencias.idioma);
    }
  }, [preferencias, cambiarIdioma, idioma]);

  const aplicarTema = (tema) => {
    document.body.classList.remove('claro', 'oscuro', 'modo-claro', 'modo-oscuro', 'dark-mode');
    if (tema === 'oscuro') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.add('modo-claro');
    }
  };

  const actualizarPreferencia = (clave, valor) => {
    setPreferencias((prev) => ({ ...prev, [clave]: valor }));
  };

  return (
    <div className="configuracion-container">
      <h2>{t('preferencias')}</h2>

      <section>
        <h3>{t('tema')}</h3>
        <label>
          <input
            type="radio"
            name="tema"
            value="claro"
            checked={preferencias.tema === 'claro'}
            onChange={() => actualizarPreferencia('tema', 'claro')}
          />
          {t('claro')}
        </label>
        <label style={{ marginLeft: '15px' }}>
          <input
            type="radio"
            name="tema"
            value="oscuro"
            checked={preferencias.tema === 'oscuro'}
            onChange={() => actualizarPreferencia('tema', 'oscuro')}
          />
          {t('oscuro')}
        </label>
      </section>

      <section>
        <h3>{t('idioma')}</h3>
        <select
          value={preferencias.idioma}
          onChange={(e) => actualizarPreferencia('idioma', e.target.value)}
        >
          {idiomasDisponibles.map((i) => (
            <option key={i.code} value={i.code}>
              {i.label}
            </option>
          ))}
        </select>
      </section>

      <section>
        <h3>{t('notificaciones')}</h3>
        <label>
          <input
            type="checkbox"
            checked={preferencias.notiEmail}
            onChange={() =>
              actualizarPreferencia('notiEmail', !preferencias.notiEmail)
            }
          />
          {t('notiEmail')}
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={preferencias.notiPush}
            onChange={() =>
              actualizarPreferencia('notiPush', !preferencias.notiPush)
            }
          />
          {t('notiPush')}
        </label>
      </section>
    </div>
  );
}
