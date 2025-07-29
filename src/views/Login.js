import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseInit';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useIdioma } from '../context/IdiomaContext';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useIdioma();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resetMode, setResetMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (resetMode) {
      if (!email) {
        setError(t('porFavorIngresaCorreo'));
        return;
      }
      try {
        await sendPasswordResetEmail(auth, email);
        setMessage(t('correoRecuperacionEnviado'));
        setResetMode(false);
      } catch (err) {
        setError(t('errorEnviarCorreo') + ': ' + err.message);
      }
    } else {
      if (!email || !password) {
        setError(t('porFavorCompletaCampos'));
        return;
      }
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } catch (err) {
        setError(t('correoContrasenaIncorrectos'));
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{t('inicioSesion')}</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={t('correoElectronico')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!resetMode && (
            <input
              type="password"
              placeholder={t('contrasena')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          <button type="submit">
            {resetMode ? t('enviarRecuperacion') : t('iniciarSesion')}
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}
        {message && <p style={{ color: 'green', marginTop: 10, fontSize: '13px' }}>{message}</p>}

        <p style={{ marginTop: 15, fontSize: 13 }}>
          {resetMode ? (
            <>
              {t('recordasteContrasena')}{' '}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0095f6',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '13px',
                  fontWeight: 600,
                }}
                onClick={() => {
                  setResetMode(false);
                  setError('');
                  setMessage('');
                }}
              >
                {t('iniciaSesion')}
              </button>
            </>
          ) : (
            <>
              {t('olvidasteContrasena')}{' '}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0095f6',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '13px',
                  fontWeight: 600,
                }}
                onClick={() => {
                  setResetMode(true);
                  setError('');
                  setMessage('');
                }}
              >
                {t('recuperar')}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
