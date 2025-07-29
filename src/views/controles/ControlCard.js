import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseInit';
import { useIdioma } from '../../context/IdiomaContext';

function formatoFecha(fecha) {
  if (!fecha) return '';
  if (fecha.toDate) {
    fecha = fecha.toDate();
  } else {
    fecha = new Date(fecha);
  }
  return fecha.toLocaleDateString();
}

export default function ControlCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useIdioma();

  const [control, setControl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerControl = async () => {
      try {
        const docRef = doc(db, 'controles', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setControl(docSnap.data());
        } else {
          setControl(null);
        }
      } catch (error) {
        console.error('Error obteniendo control:', error);
        setControl(null);
      }
      setLoading(false);
    };

    obtenerControl();
  }, [id, t]);  // <-- agregar t como dependencia para que cambie con el idioma

  if (loading) {
    return <p>{t('cargando')}</p>;
  }

  if (!control) {
    return <p>{t('controlNoEncontrado')}</p>;
  }

  return (
    <div className="control-card">
      <h2>{t('detalleControl')}</h2>
      <p><strong>{t('paciente')}:</strong> {control.paciente}</p>
      <p><strong>{t('fecha')}:</strong> {formatoFecha(control.fecha)}</p>
      <p><strong>{t('realizado')}:</strong> {control.realizado ? t('si') : t('no')}</p>
      <p><strong>{t('observaciones')}:</strong> {control.observaciones || '-'}</p>

      <div className="buttons">
        <button onClick={() => navigate(`/controles/${id}/editar`)}>
          {t('editar')}
        </button>
        <button onClick={() => navigate('/controles')}>
          {t('volverAgenda')}
        </button>
      </div>
    </div>
  );
}
