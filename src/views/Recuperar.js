import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebaseInit';
import { useNavigate } from 'react-router-dom';
import { useIdioma } from '../context/IdiomaContext';
import '../App.css';

export default function Recuperar() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useIdioma();

  const handleReset = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMensaje(t('correoRecuperacionEnviado'));
    } catch (err) {
      console.error(err);
      setError(t('errorEnviarCorreo'));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{t('recuperar')}</h2>
        {mensaje && <p className="login-success">{mensaje}</p>}
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder={t('correoElectronico')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">{t('enviarRecuperacion')}</button>
        </form>
        <p className="recuperar">
          {t('recordasteContrasena')}{' '}
          <span
            style={{ color: '#007aff', cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            {t('iniciarSesion')}
          </span>
        </p>
      </div>
    </div>
  );
}
