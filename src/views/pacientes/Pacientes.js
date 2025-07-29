import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebaseInit';
import { 
  collection, 
  deleteDoc, 
  doc, 
  onSnapshot 
} from 'firebase/firestore';
import { useIdioma } from '../../context/IdiomaContext';

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();
  const { t } = useIdioma();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pacientes'), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPacientes(lista);
    }, (error) => {
      console.error(t('errorCargandoPacientes'), error);
      // Opcional: mostrar mensaje al usuario
    });

    return () => unsubscribe();
  }, [t]);

  const eliminarPaciente = async (id) => {
    const confirmacion = window.confirm(t('confirmarEliminarPaciente'));
    if (confirmacion) {
      try {
        await deleteDoc(doc(db, 'pacientes', id));
      } catch (error) {
        console.error(t('errorEliminarPaciente'), error);
        alert(t('errorEliminarPaciente'));
      }
    }
  };

  return (
    <div className="pacientes-container">
      <div className="header">
        <h2>{t('pacientes')}</h2>
        <button 
          onClick={() => navigate('/pacientes/nuevo')} 
          aria-label={t('agregarPaciente')}
        >
          {t('agregarPaciente')}
        </button>
      </div>

      <ul className="lista-pacientes">
        {pacientes.map(({ id, nombre, rut, edad }) => (
          <li key={id} className="paciente-item">
            <div>
              <strong>{nombre}</strong> — {t('rut')}: {rut} — {t('edad')}: {edad}
            </div>
            <div className="acciones">
              <button 
                onClick={() => navigate(`/pacientes/${id}/editar`)} 
                aria-label={`${t('editar')} ${nombre}`}
              >
                {t('editar')}
              </button>
              <button 
                onClick={() => eliminarPaciente(id)} 
                aria-label={`${t('eliminar')} ${nombre}`}
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
