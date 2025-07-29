import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseInit';
import { useIdioma } from '../../context/IdiomaContext';

export default function PacienteCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useIdioma();

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const docRef = doc(db, 'pacientes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPaciente(docSnap.data());
        } else {
          setError(t('pacienteNoEncontrado'));
        }
      } catch (err) {
        setError(t('errorCargarPaciente'));
        console.error(err);
      }
      setLoading(false);
    };

    fetchPaciente();
  }, [id, t]);

  if (loading) return <p>{t('cargandoPaciente')}</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="paciente-card">
      <h2>{t('detallePaciente')}</h2>
      <p><strong>{t('nombre')}:</strong> {paciente?.nombre || '-'}</p>
      <p><strong>{t('rut')}:</strong> {paciente?.rut || '-'}</p>
      <p><strong>{t('edad')}:</strong> {paciente?.edad || '-'}</p>

      <div className="buttons">
        <button onClick={() => navigate(`/pacientes/${id}/editar`)}>
          {t('editar')}
        </button>
        <button onClick={() => navigate('/pacientes')}>
          {t('volverPacientes')}
        </button>
      </div>
    </div>
  );
}
