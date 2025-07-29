import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';

export default function PrivateRoute({ children, roles }) {
  const { user, rol } = useAuth();

  // Si no está autenticado, redirige a login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si el rol no está permitido, redirige a página de no autorizado
  if (roles && !roles.includes(rol)) {
    return <Navigate to="/no-autorizado" />;
  }

  // Si todo bien, renderiza el componente hijo protegido
  return children;
}
