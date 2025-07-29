import React, { useEffect, useState } from 'react';
import { useAuth } from '../firebase/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseInit';
import { useIdioma } from '../context/IdiomaContext';

function agruparControlesPorMes(controles) {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const conteoMeses = Array(12).fill(0);

  controles.forEach(control => {
    let fechaControl = null;
    if (control.fecha?.toDate) {
      fechaControl = control.fecha.toDate();
    } else {
      fechaControl = new Date(control.fecha);
    }
    if (fechaControl) {
      const mes = fechaControl.getMonth();
      conteoMeses[mes]++;
    }
  });

  return meses.map((mes, i) => ({
    name: mes,
    controles: conteoMeses[i]
  }));
}

export default function Home() {
  const { user, rol } = useAuth();
  const [datosGrafico, setDatosGrafico] = useState([]);
  const [controles, setControles] = useState([]);
  const { t } = useIdioma();

  useEffect(() => {
    async function fetchControles() {
      const querySnapshot = await getDocs(collection(db, 'controles'));
      const controlesObtenidos = querySnapshot.docs.map(doc => doc.data());
      setControles(controlesObtenidos);
      const datos = agruparControlesPorMes(controlesObtenidos);
      setDatosGrafico(datos);
    }

    fetchControles();
  }, []);

  const total = controles.length;
  const realizados = controles.filter(c => c.realizado).length;
  const pendientes = total - realizados;

  return (
    <div className="dashboard">
      <h1>{t('bienvenido')}{user ? `, ${user.email}` : ''}!</h1>
      <p>{t('tuRol')} <strong>{rol || t('noAsignado')}</strong></p>

      {/* Cards de resumen */}
      <div className="dashboard-summary">
        <div className="card">
          <h3>{t('totalControles')}</h3>
          <p style={{ fontSize: '1.5rem', color: 'white' }}>{total}</p>
        </div>
        <div className="card">
          <h3>{t('realizados')}</h3>
          <p style={{ fontSize: '1.5rem', color: 'white' }}>{realizados}</p>
        </div>
        <div className="card">
          <h3>{t('pendientes')}</h3>
          <p style={{ fontSize: '1.5rem', color: 'white' }}>{pendientes}</p>
        </div>
      </div>

      {/* Gráfico */}
      <div style={{ marginTop: '40px' }}>
        <h2>{t('controlesPorMes')}</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={datosGrafico} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="controles" fill="#000000ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
