import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { useIdioma } from '../context/IdiomaContext';

function Sidebar() {
  const { t } = useIdioma(); 

  return (
    <aside className="sidebar">
      <h2>Salud+</h2>
      <nav>
        <ul>
          <li><Link to="/">{t('bienvenido')}</Link></li>
          <li><Link to="/pacientes">{t('pacientes')}</Link></li>
          <li><Link to="/controles">{t('controlesMes')}</Link></li>
          <li><Link to="/estadisticas">{t('estadisticas')}</Link></li>
          <li><Link to="/configuracion">{t('configuracion')}</Link></li>
        </ul>
        <div className="sidebar-footer">
          <LogoutButton />
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
