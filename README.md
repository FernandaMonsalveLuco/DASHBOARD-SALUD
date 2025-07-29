# DASHBOARD-SALUD - Seguimiento Clínico para doctor particular.

Aplicación web interactiva desarrollada en **React** para el **seguimiento individual de datos de salud**. Permite registrar, visualizar y gestionar información clínica de pacientes mediante un panel centralizado, con gráficos y configuraciones personalizadas.

## Funcionalidades principales

### Gestión Clínica por Paciente
- Visualización de controles médicos.
- Agenda de próximos controles.
- Detalles por paciente con evolución en el tiempo.

### Estadísticas Interactivas
- Gráficos de evolución de salud usando **Recharts**.
- Datos como IMC, peso, frecuencia de controles, entre otros.

### Preferencias Personalizadas
- **Modo claro / oscuro**.
- **Selección de idioma**: Español, Inglés, Francés.
- Configuración de **notificaciones** (por email o push).
- Preferencias guardadas en `localStorage`.

### Autenticación y Seguridad *(opcional)*
- Integración con **Firebase Authentication**.
- Protección de rutas con `PrivateRoute`.

### Almacenamiento en la nube *(opcional)*
- Registro de pacientes, controles e historial en **Firebase Firestore**.
- Persistencia automática al confirmar registros.

## Tecnologías utilizadas

- **React 18**
- **React Router DOM** (navegación)
- **Firebase 12** (auth + Firestore)
- **Recharts** (gráficos)
- **Framer Motion** (animaciones)
- **react-i18next** (internacionalización)
- **CSS personalizado** (modo oscuro y responsive)

## Estructura del proyecto

\`\`\`
src/
│
├── components/
│   └── Sidebar.js
│   └── Header.js
│
├── pages/
│   └── Home.js
│   └── Estadisticas.js
│   └── Configuracion.js
│   └── Login.js
│   └── Recuperar.js
│
├── context/
│   └── AuthContext.js
│   └── LanguageContext.js
│
├── firebase/
│   └── config.js
│
├── App.js
├── App.css
└── index.js
\`\`\`

## Próximas mejoras

- Soporte para historial médico detallado por paciente.
- Integración con notificaciones reales.
- Exportación de datos en PDF o Excel.
- Panel de administración para múltiples roles.

## Licencia

Este proyecto está licenciado bajo la **MIT License**. Puedes usarlo, modificarlo y distribuirlo libremente.


Desarrollado por Fernanda Monsalve.
