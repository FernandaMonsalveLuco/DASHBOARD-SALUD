import React from 'react';
import { useIdioma } from '../context/IdiomaContext';

function Dashboard() {
  const { t } = useIdioma();

  return (
    <div className="dashboard">
      <h1>{t('bienvenida')}</h1>
      <p>{t('seleccionaOpcion')}</p>
    </div>
  );
}

export default Dashboard;
