import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './views/Home';
import Pacientes from './views/pacientes/Pacientes';
import PacienteForm from './views/pacientes/PacienteForm';
import Agenda from './views/controles/Agenda';
import ControlCard from './views/controles/ControlCard';
import ControlForm from './views/controles/ControlForm';
import Estadisticas from './views/Estadisticas';
import Configuracion from './views/Configuracion';
import PrivateRoute from './components/PrivateRoute';
import Login from './views/Login';
import Recuperar from './views/Recuperar';
import { useAuth } from './firebase/AuthContext';
import { IdiomaProvider } from './context/IdiomaContext';

import './App.css';

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();

  // Rutas que no deben mostrar Sidebar (como login y recuperar)
  const noSidebarRoutes = ['/login', '/recuperar'];

  return (
    <div className="app">
      {/* Sidebar solo si hay usuario logueado y no estamos en rutas sin barra lateral */}
      {user && !noSidebarRoutes.includes(location.pathname) && <Sidebar />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Pacientes */}
          <Route path="/pacientes" element={<Pacientes />} />
          <Route
            path="/pacientes/nuevo"
            element={
              <PrivateRoute>
                <PacienteForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/pacientes/:id/editar"
            element={
              <PrivateRoute>
                <PacienteForm />
              </PrivateRoute>
            }
          />

          {/* Controles */}
          <Route path="/controles" element={<Agenda />} />
          <Route
            path="/controles/nuevo"
            element={
              <PrivateRoute>
                <ControlForm />
              </PrivateRoute>
            }
          />
          <Route path="/controles/:id" element={<ControlCard />} />
          <Route
            path="/controles/:id/editar"
            element={
              <PrivateRoute>
                <ControlForm />
              </PrivateRoute>
            }
          />
          <Route path="/controles/:id/estadisticas" element={<Estadisticas />} />

          {/* Estadísticas */}
          <Route path="/estadisticas" element={<Estadisticas />} />

          {/* Configuración */}
          <Route path="/configuracion" element={<Configuracion />} />

          {/* Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar" element={<Recuperar />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <IdiomaProvider>
      <AppContent />
    </IdiomaProvider>
  );
}
