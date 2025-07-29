import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseInit';
import { collection, getDocs } from 'firebase/firestore';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useIdioma } from '../context/IdiomaContext';

const COLORS = {
  Realizados: '#fca311',
  Pendientes: '#cc0202',
};

export default function Estadisticas() {
  const [controles, setControles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useIdioma();

  useEffect(() => {
    const fetchControles = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'controles'));
        const datos = snapshot.docs.map(doc => doc.data());
        setControles(datos);
      } catch (error) {
        console.error('Error cargando controles:', error);
      }
      setLoading(false);
    };
    fetchControles();
  }, []); // No es necesario agregar idioma aquí porque los datos no dependen del idioma

  if (loading) {
    return <p>{t('cargando')}</p>;
  }

  const realizados = controles.filter(c => c.realizado).length;
  const noRealizados = controles.length - realizados;

  const controlesPorPaciente = controles.reduce((acc, c) => {
    acc[c.paciente] = (acc[c.paciente] || 0) + 1;
    return acc;
  }, {});

  const dataPacientes = Object.entries(controlesPorPaciente)
    .map(([paciente, count]) => ({ paciente, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const dataRealizados = [
    { key: 'Realizados', name: t('Realizados'), value: realizados },
    { key: 'Pendientes', name: t('Pendientes'), value: noRealizados },
  ];

  return (
    <div className="estadisticas-container">
      <h2 className="titulo-general">{t('EstadisticasControles')}</h2>

      <div className="estadisticas-charts">
        {/* GRÁFICO DE TORTA */}
        <div className="chart-box">
          <h3 className="titulo-grafico">{t('GraficoRealizadosPendientes')}</h3>
          <div className="grafico-torta-contenedor">
            <PieChart width={280} height={280}>
              <Pie
                data={dataRealizados}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
              >
                {dataRealizados.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.key]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>

            <div className="leyenda-personalizada">
              {dataRealizados.map((entry, index) => (
                <div key={index} className="leyenda-item">
                  <span
                    className="color-cuadro"
                    style={{ backgroundColor: COLORS[entry.key] }}
                  />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GRÁFICO DE BARRAS */}
        <div className="chart-box">
          <h3 className="titulo-grafico">{t('GraficoTopPacientes')}</h3>
          <BarChart
            width={400}
            height={280}
            data={dataPacientes}
            margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="paciente" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
