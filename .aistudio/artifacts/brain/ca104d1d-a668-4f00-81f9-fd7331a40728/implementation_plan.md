# Arquitectura de Doble Rol (Instructor vs. Aprendiz) y Sincronización Automática en la Nube

Plan integral para separar completamente la experiencia del **Aprendiz** (estudiante de inducción sin botones de administración ni configuraciones técnicas) y el panel exclusivo del **Instructor** (seguimiento integral, métricas consolidadas, gestión de enlaces para compartir y sincronización automática en Google Sheets).

---

## Decisiones Críticas y Resumen de Alineación con el Usuario

> [!IMPORTANT]
> **Decisión Fundamental de Acceso:** 
> - **Enlace del Aprendiz (`?role=aprendiz` o vista estándar):** La interfaz para el estudiante estará 100% limpia de botones de Google Drive, ajustes de hojas de cálculo o configuraciones de instructor. Al registrar sus datos, cursar los módulos y aprobar la evaluación (80%), el prototipo emite su certificado oficial y **guarda su registro automáticamente en segundo plano** en la base de datos y en la hoja de cálculo del instructor sin pedirle al aprendiz login de Google de desarrollador ni confirmaciones complejas.
> - **Panel del Instructor (`?role=instructor` o switch protegido con clave/Google Auth):** Solo el instructor (`yhgutierrez3@gmail.com`) accede al Tablero de Control con métricas en tiempo real, tabla consolidada de todos los aprendices, enlace directo a Google Drive, sincronización y generador de enlaces para compartir por ficha o grupo.

---

## 1. Visión General y Concepto Central

- **¿Qué resuelve?**: Elimina la fricción de que el aprendiz deba configurar o vincular cuentas de Google, evitando errores de permisos (`scopes`) o cierres de popups en su dispositivo. El aprendiz únicamente se enfoca en su proceso formativo del Reglamento del Aprendiz SENA (Acuerdo 0009 de 2024).
- **Rol Aprendiz**:
  - Ingreso ágil mediante enlace compartido por el instructor (puede incluir número de ficha o programa preseleccionado).
  - Recorrido completo: Plan de Inducción, 14 Temas del Reglamento 2024, Simulador de 5 Retos Éticos, Evaluación Trivia y Certificado Oficial con QR y código de verificación.
  - Al completar la evaluación con $\ge 80\%$, se genera el certificado y se despacha la sincronización automática sin fricción.
- **Rol Instructor**:
  - Panel de control directivo (Dashboard) con estadísticas: total aprendices evaluados, porcentaje de aprobación, promedio de calificaciones y desglose por fichas formativas.
  - Generador de Enlaces para Compartir: Permite al instructor copiar un enlace directo para enviar por WhatsApp o correo institucional a sus aprendices (ej. `.../?ficha=2849102&role=aprendiz`), que precarga la ficha o programa para evitar que los aprendices cometan errores al escribirla.
  - Visualización y auditoría de la lista consolidada de aprendices con filtros de búsqueda instantáneos.
  - Vinculación permanente de Google Sheets: Abre y actualiza la hoja de cálculo institucional *"Inducción SENA - Registro de Aprendices (Acuerdo 0009 de 2024)"* en su propio Google Drive.
  - Exportación inmediata de respaldo en formato CSV/Excel con un solo clic.

---

## 2. Experiencia de Usuario y Diseño Visual

### A. Vista del Aprendiz (Estudiante)
1. **Cabecera Institucional Limpia**:
   - Logo oficial SENA vectorizado, ribbon tricolor institucional.
   - Navegación clara por pasos: `1. Plan de Inducción`, `2. Reglamento 2024`, `3. Simulador de Casos`, `4. Evaluación Trivia`, `5. Certificado Oficial` y `Tutor Sofia`.
   - Selector de Modo Oscuro con desenfoque de pantalla y selector de tamaño/accesibilidad.
   - **Cero botones de administración:** Ninguna mención de tokens, OAuth o configuración de Google Drive.
2. **Flujo de Registro y Certificación**:
   - Modal o formulario de datos personales (Nombre, Documento, Ficha, Regional, Centro). Si el enlace venía con la ficha predefinida, el campo aparece listo.
   - Al finalizar y aprobar la evaluación: mensaje de felicitaciones institucional y guardado automático en segundo plano con indicador discreto de éxito (`Registro institucional sincronizado exitosamente`).

### B. Vista del Instructor (Dashboard de Gestión y Seguimiento)
1. **Acceso Seguro al Panel de Instructor**:
   - Pestaña discreta en el pie de página o acceso por URL/botón `Portal del Instructor` protegido por autenticación Google de la instructora (`yhgutierrez3@gmail.com`) o código PIN rápido institucional (ej. `SENA2024`).
2. **Barra de Métricas de la Ficha (KPI Cards)**:
   - Total de Aprendices Registrados (con tipografía tabular `font-mono tabular-nums`).
   - Tasa de Aprobación (%) con indicador visual de rendimiento.
   - Promedio de Calificación general de la inducción.
   - Fichas activas registradas.
3. **Generador y Compartidor de Enlace a Aprendices**:
   - Caja interactiva donde el instructor ingresa el número de ficha y programa (opcional), generando un enlace listo para copiar con un botón de 1 clic:
     *`https://[url-plataforma]/?role=aprendiz&ficha=2901234`*
   - Botón directo "Compartir por WhatsApp" y "Copiar Enlace".
4. **Tabla de Auditoría en Tiempo Real**:
   - Buscador rápido por nombre, documento o ficha.
   - Filtro por estado: `Aprobados` / `En Proceso`.
   - Columnas: Fecha, Documento, Aprendiz, Ficha, Calificación, Estado, Código Certificado y Acciones (Ver Certificado / Reintentar).
5. **Control de Almacenamiento en Google Drive**:
   - Enlace directo destacado para abrir la hoja en Google Drive en una nueva pestaña.
   - Estado de sincronización en tiempo real y botón para forzar actualización de filas o reconectar credenciales si expiraron.

---

## 3. Decisiones de Producto y Arquitectura de Datos

1. **Persistencia Dual Resiliente**:
   - **Capa Local / Firestore:** Almacena todos los aprendices que realizan la inducción en la base de datos del prototipo para que ningún dato se pierda aunque Google Drive tenga un microcorte o token expirado.
   - **Capa Google Sheets:** Cada vez que un aprendiz aprueba o el instructor pulsa sincronizar, se actualiza la hoja de cálculo del instructor en Google Drive.
2. **Separación Estricta por Parámetro de URL y Estado de Sesión**:
   - `?role=aprendiz` fuerza el modo 100% alumno sin posibilidad de acceder a configuraciones de instructor.
   - Si no se especifica rol, inicia por defecto en modo Aprendiz para garantizar seguridad al compartir la URL principal.
   - El instructor puede alternar a su consola mediante autenticación o acceso seguro.

---

## 4. Diagrama de Arquitectura del Sistema

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PLATAFORMA INDUCCIÓN SENA                       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
            ┌───────────────────────┴───────────────────────┐
            ▼                                               ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│       ROL APRENDIZ            │               │        ROL INSTRUCTOR         │
│  (URL: /?role=aprendiz)       │               │   (Acceso Seguro / Consola)   │
├───────────────────────────────┤               ├───────────────────────────────┤
│ • Plan de Inducción           │               │ • Métricas de Aprobación KPI  │
│ • 14 Capítulos Acuerdo 0009   │               │ • Tabla Auditoría Aprendices  │
│ • Simulador 5 Casos Éticos    │               │ • Enlace Directo Google Drive │
│ • Evaluación Trivia (10 preg) │               │ • Generador de Enlaces Ficha  │
│ • Expedición de Certificado   │               │ • Exportar CSV / Respaldo     │
└───────────────┬───────────────┘               └───────────────┬───────────────┘
                │                                               │
                │ 1. Al aprobar trivia (≥80%)                   │ 2. Consulta y Gestiona
                ▼                                               ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                    CAPA DE SINCRONIZACIÓN AUTOMÁTICA                          │
│                                                                               │
│  • Guarda aprendiz en Registro Local / Firestore                              │
│  • Despacha registro a Google Sheets en Drive del Instructor                  │
│  • Genera Código Único de Certificación Institucional                         │
└───────────────────────────────────────┬───────────────────────────────────────┘
                                        │
                                        ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                HOJA DE CÁLCULO OFICIAL EN GOOGLE DRIVE                        │
│     "Inducción SENA - Registro de Aprendices (Acuerdo 0009 de 2024)"          │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Plan de Ejecución por Pasos

1. **Estado Global de Roles (`RoleContext` / `AppRole`):**
   - Implementar detección de rol (`'aprendiz' | 'instructor'`) vía URL (`?role=...`) y selector en el pie de página con autenticación/PIN de seguridad para el instructor.
2. **Aislamiento de la Interfaz del Aprendiz:**
   - Ocultar del Header y del Certificado los botones de vinculación de Google Sheets, modales de conexión y configuraciones administrativas cuando el usuario esté en rol Aprendiz.
3. **Módulo de Guardado Automático Transparente:**
   - Crear el disparador en `QuizView.tsx` y `CertificateView.tsx` para que al obtener el puntaje aprobatorio se guarde el aprendiz sin abrir ningún modal ni pedir autorizaciones al alumno.
4. **Desarrollo del Panel del Instructor (`InstructorDashboard.tsx`):**
   - Crear el componente del dashboard con métricas de desempeño, tabla de seguimiento de aprendices, buscador interactivo, generador de enlaces de ficha para WhatsApp y gestión de Google Drive.
5. **Verificación y Pruebas de Compilación:**
   - Ejecutar `compile_applet` y validar que el cambio de rol funcione fluidamente, el enlace a compartir sea funcional y no existan errores de TypeScript.
