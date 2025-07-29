import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseInit';
import { useNavigate } from 'react-router-dom';
import { useIdioma } from '../context/IdiomaContext';

export default function LogoutButton() {
  const navigate = useNavigate();
  const { t } = useIdioma();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      {t('cerrarSesion')}
    </button>
  );
}
