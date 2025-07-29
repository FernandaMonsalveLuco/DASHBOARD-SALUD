import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { db } from '../../firebase/firebaseInit';
import { collection, doc, getDoc, addDoc, updateDoc, getDocs } from 'firebase/firestore';
import { useIdioma } from '../../context/IdiomaContext';

function formatoFechaInput(fecha) {
  // Convierte Firestore Timestamp o string a formato yyyy-mm-dd para input date
  if (!fecha) return '';
  if (fecha.toDate) {
    const d = fecha.toDate();
    return d.toISOString().split('T')[0];
  }
  if (typeof fecha === 'string') {
    return fecha.split('T')[0];
  }
  return '';
}

export default function ControlForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useIdioma();

  const [paciente, setPaciente] = useState('');
  const [fecha, setFecha] = useState('');
  const [realizado, setRealizado] = useState(false);
  const [loadingControl, setLoadingControl] = useState(false);
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPacientes = async () => {
      setLoadingPacientes(true);
      try {
        const snapshot = await getDocs(collection(db, 'pacientes'));
        // Guarda id y nombre para usar id como key y value
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          nombre: doc.data().nombre,
        }));
        setPacientes(lista);
      } catch (error) {
        console.error('Error cargando pacientes:', error);
        setError(t('errorCargandoPacientes'));
      }
      setLoadingPacientes(false);
    };
    fetchPacientes();
  }, [t]);

  useEffect(() => {
    if (id) {
      setLoadingControl(true);
      const fetchControl = async () => {
        try {
          const docRef = doc(db, 'controles', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setPaciente(data.paciente); // Ahora paciente es id
            setFecha(formatoFechaInput(data.fecha));
            setRealizado(data.realizado);
          } else {
            setError(t('controlNoEncontrado'));
          }
        } catch (err) {
          console.error(err);
          setError(t('errorCargandoControl'));
        }
        setLoadingControl(false);
      };
      fetchControl();
    }
  }, [id, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!paciente || !fecha) {
      setError(t('completaTodosCampos'));
      return;
    }

    setLoadingControl(true);

    try {
      const data = {
        paciente,
        fecha, // Guarda string yyyy-mm-dd o convertir a timestamp si quieres
        realizado,
      };

      if (id) {
        // Actualizar documento sin reemplazar todo
        const docRef = doc(db, 'controles', id);
        await updateDoc(docRef, data);
      } else {
        // Crear nuevo documento
        const collectionRef = collection(db, 'controles');
        await addDoc(collectionRef, data);
      }
      navigate('/controles');
    } catch (err) {
      console.error(err);
      setError(t('errorGuardandoControl') + ': ' + err.message);
    } finally {
      setLoadingControl(false);
    }
  };

  if (loadingControl) return <p>{t('cargando')}...</p>;

  return (
    <div className="control-form-container">
      <h2>{id ? t('editarControl') : t('nuevoControl')}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          {t('paciente')}:
          <select
            value={paciente}
            onChange={(e) => setPaciente(e.target.value)}
            required
            disabled={loadingPacientes || pacientes.length === 0}
          >
            <option value="">{t('seleccionePaciente')}</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t('fecha')}:
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={realizado}
            onChange={(e) => setRealizado(e.target.checked)}
          />
          {t('realizado')}
        </label>

        <div className="buttons">
          <button type="submit" disabled={loadingControl}>
            {id ? t('guardarCambios') : t('agregarControl')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/controles')}
            disabled={loadingControl}
          >
            {t('cancelar')}
          </button>
        </div>
      </form>
    </div>
  );
}
