import React, { useEffect, useState } from 'react';
import { useIdioma } from '../context/IdiomaContext';

const idiomasDisponibles = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
];

export default function Configuracion() {
  const { idioma, setIdioma, t } = useIdioma();

  const [preferencias, setPreferencias] = useState({
    tema: 'claro',
    idioma: idioma || 'es',
    notiEmail: true,
    notiPush: false,
  });

  // Al cargar, lee las preferencias guardadas y aplica tema e idioma
  useEffect(() => {
    const guardadas = localStorage.getItem('preferenciasApp');
    if (guardadas) {
      const prefs = JSON.parse(guardadas);
      setPreferencias(prefs);
      setIdioma(prefs.idioma);
      aplicarTema(prefs.tema);
    } else {
      aplicarTema('claro');
    }
  }, [setIdioma]);

  // Guarda en localStorage y aplica tema cuando preferencias cambian
  useEffect(() => {
    localStorage.setItem('preferenciasApp', JSON.stringify(preferencias));
    aplicarTema(preferencias.tema);
  }, [preferencias]);

  // Aplica clases para tema
  const aplicarTema = (tema) => {
    document.body.classList.remove('claro', 'oscuro', 'modo-claro', 'modo-oscuro', 'dark-mode');
    if (tema === 'oscuro') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.add('modo-claro');
    }
  };

  // Actualiza preferencias y sincroniza idioma en contexto
  const actualizarPreferencia = (clave, valor) => {
    if (clave === 'idioma') {
      setIdioma(valor);
    }
    setPreferencias((prev) => ({ ...prev, [clave]: valor }));
  };

  return (
    <div className="configuracion-container">
      <h2>{t.titulo}</h2>

      {/* Tema */}
      <section>
        <h3>{t.tema}</h3>
        <label>
          <input
            type="radio"
            name="tema"
            value="claro"
            checked={preferencias.tema === 'claro'}
            onChange={() => actualizarPreferencia('tema', 'claro')}
          />
          {t.claro}
        </label>
        <label style={{ marginLeft: '15px' }}>
          <input
            type="radio"
            name="tema"
            value="oscuro"
            checked={preferencias.tema === 'oscuro'}
            onChange={() => actualizarPreferencia('tema', 'oscuro')}
          />
          {t.oscuro}
        </label>
      </section>

      {/* Idioma */}
      <section>
        <h3>{t.idioma}</h3>
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

      {/* Notificaciones */}
      <section>
        <h3>{t.notificaciones}</h3>
        <label>
          <input
            type="checkbox"
            checked={preferencias.notiEmail}
            onChange={() =>
              actualizarPreferencia('notiEmail', !preferencias.notiEmail)
            }
          />
          {t.notiEmail}
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
          {t.notiPush}
        </label>
      </section>
    </div>
  );
}
