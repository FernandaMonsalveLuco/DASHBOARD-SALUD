import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebaseInit';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { useIdioma } from '../../context/IdiomaContext';

function formatoFecha(fecha) {
  if (!fecha) return '';
  // Si fecha es un Timestamp de Firestore:
  if (fecha.toDate) {
    fecha = fecha.toDate();
  } else {
    fecha = new Date(fecha);
  }
  return fecha.toLocaleDateString();
}

export default function Agenda() {
  const [controles, setControles] = useState([]);
  const navigate = useNavigate();
  const { t } = useIdioma();

  useEffect(() => {
    const q = collection(db, 'controles');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listaControles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setControles(listaControles);
    }, (error) => {
      console.error('Error al obtener controles:', error);
    });

    return () => unsubscribe();
  }, []);

  const toggleRealizado = async (id, realizado) => {
    const docRef = doc(db, 'controles', id);
    try {
      await updateDoc(docRef, { realizado: !realizado });
    } catch (error) {
      console.error('Error al actualizar control:', error);
      alert(t('errorActualizarControl'));
    }
  };

  const eliminarControl = async (id) => {
    if (window.confirm(t('confirmarEliminarControl'))) {
      try {
        await deleteDoc(doc(db, 'controles', id));
      } catch (error) {
        console.error('Error al eliminar control:', error);
        alert(t('errorEliminarControl'));
      }
    }
  };

  return (
    <div className="agenda-container">
      <h2>{t('agendaControles')}</h2>
      <button
        className="btn-nuevo"
        onClick={() => navigate('/controles/nuevo')}
        aria-label={t('agregarControl')}
      >
        + {t('agregarControl')}
      </button>

      <ul className="lista-controles">
        {controles.map(({ id, paciente, fecha, realizado }) => (
          <li key={id} className={`control-item ${realizado ? 'realizado' : ''}`}>
            <div className="info">
              <strong>{paciente}</strong> — {t('fecha')}: {formatoFecha(fecha)}
            </div>
            <div className="acciones">
              <button
                onClick={() => toggleRealizado(id, realizado)}
                aria-label={realizado ? t('desmarcar') : t('marcarRealizado')}
              >
                {realizado ? t('desmarcar') : t('marcarRealizado')}
              </button>
              <button
                onClick={() => navigate(`/controles/${id}/editar`)}
                aria-label={t('editar')}
              >
                {t('editar')}
              </button>
              <button
                onClick={() => eliminarControl(id)}
                aria-label={t('eliminar')}
              >
                {t('eliminar')}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
