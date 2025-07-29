import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase/firebaseInit';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { useAuth } from '../../firebase/AuthContext';
import { useIdioma } from '../../context/IdiomaContext';

export default function FormularioPaciente() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, rol } = useAuth();
  const { t } = useIdioma();

  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    edad: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !rol || (rol !== 'admin' && rol !== 'medico')) {
      navigate('/');
    }
  }, [user, rol, navigate]);

  useEffect(() => {
    if (id) {
      const obtenerPaciente = async () => {
        try {
          const docRef = doc(db, 'pacientes', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data());
          } else {
            setError(t('pacienteNoEncontrado'));
          }
        } catch (err) {
          console.error(err);
          setError(t('errorCargarPaciente'));
        }
      };
      obtenerPaciente();
    }
  }, [id, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'edad') {
      // Permite sólo números enteros positivos o vacío
      if (value === '' || (/^\d+$/.test(value) && Number(value) >= 0)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validar = () => {
    const { nombre, rut, edad } = formData;
    if (!nombre.trim() || !rut.trim() || edad === '') {
      setError(t('todosCamposObligatorios'));
      return false;
    }
    if (isNaN(Number(edad)) || Number(edad) < 0) {
      setError(t('edadNumeroValido'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validar()) return;

    try {
      if (id) {
        await updateDoc(doc(db, 'pacientes', id), formData);
      } else {
        await addDoc(collection(db, 'pacientes'), formData);
      }
      navigate('/pacientes');
    } catch (err) {
      console.error(err);
      setError(t('errorGuardarPaciente'));
    }
  };

  return (
    <div className="formulario-container">
      <h2>{id ? t('editarPaciente') : t('nuevoPaciente')}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="nombre">{t('nombre')}:</label>
        <input
          id="nombre"
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <label htmlFor="rut">{t('rut')}:</label>
        <input
          id="rut"
          type="text"
          name="rut"
          value={formData.rut}
          onChange={handleChange}
          required
        />

        <label htmlFor="edad">{t('edad')}:</label>
        <input
          id="edad"
          type="number"
          name="edad"
          value={formData.edad}
          onChange={handleChange}
          min="0"
          step="1"
          required
        />

        <button type="submit">{id ? t('guardarCambios') : t('agregarPaciente')}</button>
      </form>
    </div>
  );
}
