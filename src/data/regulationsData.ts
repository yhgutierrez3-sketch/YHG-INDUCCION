import { RegulationArticle } from '../types';

export const SENA_VALUES = [
  { title: 'Respeto', description: 'Reconocimiento del valor inherente y los derechos de cada miembro de la comunidad SENA.' },
  { title: 'Librepensamiento y Pluralismo', description: 'Aceptación de diversas corrientes de pensamiento e ideas bajo un marco constructivo.' },
  { title: 'Responsabilidad', description: 'Compromiso ético con el propio aprendizaje, el trabajo colaborativo y la sociedad.' },
  { title: 'Justicia y Equidad', description: 'Oportunidades de formación sin distingos de etnia, género, condición socioeconómica ni credo.' },
  { title: 'Solidaridad', description: 'Cooperación mutua y espíritu de servicio para el desarrollo de la comunidad y del país.' },
];

export const REGULATION_ARTICLES: RegulationArticle[] = [
  // DERECHOS
  {
    id: 'der-1',
    chapter: 'Capítulo II - Derechos del Aprendiz SENA',
    chapterNumber: 2,
    category: 'derecho',
    title: 'Inducción Integral y Oportuna',
    summary: 'Recibir una inducción completa sobre la estructura del SENA, el programa formativo y el reglamento vigente.',
    details: [
      'Garantía de recibir información clara sobre el centro, el programa de formación y las plataformas virtuales.',
      'Acompañamiento pedagógico desde el primer día para entender la metodología por competencias y proyectos.',
      'Entrega y socialización del Reglamento del Aprendiz (Acuerdo 0009 de 2024).'
    ],
    practicalTip: 'Aprovecha las primeras semanas para despejar dudas con tu instructor vocero y equipo pedagógico.',
    badge: 'Derecho Fundamental',
    isRecent2024Highlight: false
  },
  {
    id: 'der-2',
    chapter: 'Capítulo II - Derechos del Aprendiz SENA',
    chapterNumber: 2,
    category: 'derecho',
    title: 'Formación Profesional Integral de Calidad',
    summary: 'Acceder a una formación pertinente, gratuita, ética y técnica que desarrolle todas tus dimensiones humanas.',
    details: [
      'Docencia calificada e instructores con idoneidad técnica y pedagógica.',
      'Planes de estudio actualizados alineados a las demandas del sector productivo.',
      'Metodología práctica en ambientes de formación especializados (talleres, laboratorios, granjas, aulas tic).'
    ],
    practicalTip: 'El SENA no cobra por ningún trámite de formación ni certificado; tu compromiso es la dedicación académica.',
    badge: 'Calidad SENA',
    isRecent2024Highlight: false
  },
  {
    id: 'der-3',
    chapter: 'Capítulo II - Derechos del Aprendiz SENA',
    chapterNumber: 2,
    category: 'derecho',
    title: 'Acceso a Ambientes, Maquinaria e Infraestructura Digital',
    summary: 'Hacer uso adecuado de talleres, laboratorios, biblioteca, plataformas LMS y herramientas tecnológicas del SENA.',
    details: [
      'Disposición de computadores, internet institucional, herramientas y materiales de formación para las prácticas.',
      'Acceso a biblioteca física y Sistema de Bibliotecas SENA en línea.',
      'Actualización 2024: Derecho al acceso guiado a herramientas digitales y entornos virtuales de aprendizaje.'
    ],
    practicalTip: 'Solicita a tu instructor el préstamo o inducción en equipos especializados antes de operarlos.',
    badge: 'Ambientes Tecnológicos',
    isRecent2024Highlight: true
  },
  {
    id: 'der-4',
    chapter: 'Capítulo II - Derechos del Aprendiz SENA',
    chapterNumber: 2,
    category: 'derecho',
    title: 'Elementos de Protección Personal (EPP) y Seguridad en el Taller',
    summary: 'Recibir la dotación reglamentaria o instrucciones claras sobre EPP necesarios para las prácticas en talleres.',
    details: [
      'Prioridad en seguridad y salud en el trabajo durante todas las prácticas de taller.',
      'Ambientes con señalización, protocolos de emergencia y primeros auxilios.',
      'Derecho a no operar maquinaria de alto riesgo si no se cuenta con los EPP mínimos certificados.'
    ],
    practicalTip: 'Nunca manipules maquinaria industrial sin gafas de seguridad, botas dieléctricas o el EPP asignado a tu especialidad.',
    badge: 'Seguridad y Salud',
    isRecent2024Highlight: false
  },
  {
    id: 'der-5',
    chapter: 'Capítulo II - Derechos del Aprendiz SENA',
    chapterNumber: 2,
    category: 'derecho',
    title: 'Carnetización Institucional Vigente',
    summary: 'Recibir oportunamente el carné físico o digital que acredite la condición de aprendiz SENA activo.',
    details: [
      'Identificación oficial requerida para ingresar a todas las sedes del SENA en el territorio nacional.',
      'Acceso a beneficios de transporte, convenios culturales y deportivos.',
      'Uso en biblioteca y préstamo de equipos institucionales.'
    ],
    practicalTip: 'Lleva siempre tu carné visible en el pecho o en el formato digital autorizado en tu dispositivo.',
    badge: 'Identidad SENA',
    isRecent2024Highlight: false
  },
  {
    id: 'der-6',
    chapter: 'Capítulo II - Derechos del Aprendiz SENA',
    chapterNumber: 2,
    category: 'derecho',
    title: 'Programas de Bienestar al Aprendiz',
    summary: 'Participar activamente en actividades deportivas, culturales, apoyo psicosocial, monitorías y apoyos de sostenimiento.',
    details: [
      'Acceso a enfermería, orientación psicológica y consejería estudiantil en el centro.',
      'Postulación a monitorías académicas remuneradas o de apoyo institucional.',
      'Inscripción a torneos deportivos, festivales de danza, música, teatro y actividades de liderazgo.'
    ],
    practicalTip: 'Acércate a la oficina de Bienestar de tu centro para conocer convocatorias de apoyo y actividades extracurriculares.',
    badge: 'Bienestar Integral',
    isRecent2024Highlight: false
  },
  {
    id: 'der-7',
    chapter: 'Capítulo II - Derechos del Aprendiz SENA',
    chapterNumber: 2,
    category: 'derecho',
    title: 'Evaluación Clara, Retroalimentación y Debido Proceso',
    summary: 'Conocer oportunamente los criterios, resultados de las evaluaciones y el derecho a solicitar revisión.',
    details: [
      'Conocer los resultados de las evidencias evaluadas en máximo ocho (8) días hábiles siguientes a la entrega.',
      'Explicación pedagógica cuando una evidencia no cumpla con los criterios ("Por Mejorar" o "Aprobado").',
      'Derecho a solicitar segundo evaluador debidamente argumentado si hay discrepancia justificada.'
    ],
    practicalTip: 'Revisa periódicamente el LMS institucional y solicita retroalimentación constructiva a tu instructor.',
    badge: 'Evaluación Justa',
    isRecent2024Highlight: true
  },
  {
    id: 'der-8',
    chapter: 'Capítulo II - Derechos del Aprendiz SENA',
    chapterNumber: 2,
    category: 'derecho',
    title: 'Representación, Vocería y Participación Democrática',
    summary: 'Elegir y ser elegido democráticamente como vocero de ficha o representante de aprendices del centro.',
    details: [
      'Representar los intereses de tus compañeros ante comités y directivas del centro.',
      'Participar en el Comité de Evaluación y Seguimiento con voz en los casos analizados.',
      'Postularte en las elecciones anuales organizadas por Bienestar al Aprendiz.'
    ],
    practicalTip: 'La vocería es una oportunidad de liderazgo formativo que enriquecerá tu perfil profesional.',
    badge: 'Liderazgo SENA',
    isRecent2024Highlight: true
  },

  // DEBERES
  {
    id: 'deb-1',
    chapter: 'Capítulo III - Deberes del Aprendiz SENA',
    chapterNumber: 3,
    category: 'deber',
    title: 'Suscripción del Compromiso y Conocimiento del Reglamento',
    summary: 'Firmar el acta de compromiso institucional al matricularse y acatar fielmente el Reglamento del Aprendiz.',
    details: [
      'Conocer de manera proactiva los estatutos y normativas del SENA.',
      'Aceptar los principios de la formación profesional integral.',
      'Actuar bajo la ética y los valores institucionales tanto dentro como fuera de la entidad.'
    ],
    practicalTip: 'El desconocimiento del reglamento no exime de su cumplimiento.',
    badge: 'Compromiso Ético',
    isRecent2024Highlight: false
  },
  {
    id: 'deb-2',
    chapter: 'Capítulo III - Deberes del Aprendiz SENA',
    chapterNumber: 3,
    category: 'deber',
    title: 'Asistencia, Puntualidad y Participación Activa',
    summary: 'Asistir con puntualidad a todas las sesiones presenciales o virtuales programadas en la ruta de formación.',
    details: [
      'Participar activamente en foros, talleres, proyectos y actividades del plan de estudio.',
      'Registrar asistencia según los mecanismos definidos por el centro.',
      'Permanecer en el ambiente de formación durante toda la jornada académica acordada.'
    ],
    practicalTip: 'La puntualidad es reflejo de tu disciplina laboral para la etapa productiva.',
    badge: 'Disciplina y Puntualidad',
    isRecent2024Highlight: false
  },
  {
    id: 'deb-3',
    chapter: 'Capítulo III - Deberes del Aprendiz SENA',
    chapterNumber: 3,
    category: 'deber',
    title: 'Justificación Oportuna de Inasistencias (3 Días Hábiles)',
    summary: 'Presentar soporte válido de inasistencia médica, laboral o de fuerza mayor en un plazo máximo de tres (3) días hábiles.',
    details: [
      'Entregar la incapacidad médica emitida o validada por EPS/IPS correspondiente.',
      'Remitir la justificación por escrito al instructor responsable y coordinador misional.',
      'Acordar plan de mejoramiento o entrega de evidencias pedagógicas pendientes.'
    ],
    practicalTip: 'No dejes pasar más de 3 días hábiles para radicar tu incapacidad; de lo contrario se considera inasistencia injustificada.',
    badge: 'Gestión Oportuna',
    isRecent2024Highlight: false
  },
  {
    id: 'deb-4',
    chapter: 'Capítulo III - Deberes del Aprendiz SENA',
    chapterNumber: 3,
    category: 'deber',
    title: 'Porte Adecuado del Carné y Presentación Personal',
    summary: 'Portar el carné en lugar visible y vestir el uniforme o ropa reglamentaria según el ambiente de formación.',
    details: [
      'Presentar el carné para el ingreso y permanencia en las instalaciones.',
      'Uso del overol, bata, botas o prendas técnicas requeridas según el área técnica.',
      'No prestar ni transferir el carné a terceras personas bajo ninguna circunstancia.'
    ],
    practicalTip: 'Tu imagen en el centro proyecta tu futura presencia corporativa o de taller.',
    badge: 'Identidad y Pulcritud',
    isRecent2024Highlight: false
  },
  {
    id: 'deb-5',
    chapter: 'Capítulo III - Deberes del Aprendiz SENA',
    chapterNumber: 3,
    category: 'deber',
    title: 'Cuidado de Recursos Físicos, Tecnológicos y Ambientales',
    summary: 'Proteger la infraestructura, herramientas, maquinaria, mobiliario y recursos digitales del SENA.',
    details: [
      'Dejar los ambientes limpios, organizados y los equipos debidamente apagados.',
      'Reportar de inmediato fallas o averías en las máquinas para evitar accidentes o daños mayores.',
      'Cumplir con la gestión de residuos y protocolos ambientales del Centro de Formación.'
    ],
    practicalTip: 'Aplica siempre las 5S (clasificar, ordenar, limpiar, estandarizar y disciplinar) en tu puesto de aprendizaje.',
    badge: 'Cuidado y Sostenibilidad',
    isRecent2024Highlight: false
  },
  {
    id: 'deb-6',
    chapter: 'Capítulo III - Deberes del Aprendiz SENA',
    chapterNumber: 3,
    category: 'deber',
    title: 'Integridad Académica y Uso Ético de la Inteligencia Artificial (2024)',
    summary: 'Entregar evidencias de autoría propia y citar fuentes de manera rigurosa sin cometer plagio ni fraude.',
    details: [
      'Novedad 2024: Uso ético, transparente y crítico de herramientas digitales e IA generativa en proyectos.',
      'Prohibición tajante de presentar trabajos elaborados por terceros o IA sin citación ni análisis propio.',
      'Respeto de licencias de software institucional y derechos de autor en el marco de la ley colombiana.'
    ],
    practicalTip: 'La IA es un asistente de aprendizaje, no un reemplazo de tu razonamiento crítico y técnico.',
    badge: 'Honestidad Intelectual',
    isRecent2024Highlight: true
  },

  // PROHIBICIONES
  {
    id: 'pro-1',
    chapter: 'Capítulo III / IV - Prohibiciones Expresas',
    chapterNumber: 3,
    category: 'prohibicion',
    title: 'Plagio, Fraude y Suplantación en Evaluaciones',
    summary: 'Copiar evidencias, comprar trabajos académicos o suplantar a compañeros en ambientes virtuales o presenciales.',
    details: [
      'Compartir credenciales de SofiaPlus o plataformas LMS para simular asistencia o presentar pruebas.',
      'Alterar notas, evidencias o documentos institucionales.',
      'Se clasifica como falta disciplinaria grave o gravísima según el impacto.'
    ],
    practicalTip: 'Si tienes dificultades con una evidencia, solicita asesoría a tu instructor o tutor de refuerzo.',
    badge: 'Cero Fraude',
    isRecent2024Highlight: false
  },
  {
    id: 'pro-2',
    chapter: 'Capítulo III / IV - Prohibiciones Expresas',
    chapterNumber: 3,
    category: 'prohibicion',
    title: 'Consumo o Porte de Sustancias Psicoactivas y Alcohol',
    summary: 'Ingresar o permanecer bajo efectos de alcohol o drogas, o comercializarlas dentro del SENA.',
    details: [
      'Falta gravísima que atenta contra la seguridad comunitaria y el orden institucional.',
      'Pone en riesgo vidas humanas en ambientes con maquinaria pesada, electricidad o químicos.',
      'Da lugar a proceso disciplinario inmediato ante el Comité de Evaluación y Seguimiento.'
    ],
    practicalTip: 'El SENA promueve ambientes 100% libres de humo y sustancias para la sana convivencia.',
    badge: 'Seguridad Colectiva',
    isRecent2024Highlight: false
  },
  {
    id: 'pro-3',
    chapter: 'Capítulo III / IV - Prohibiciones Expresas',
    chapterNumber: 3,
    category: 'prohibicion',
    title: 'Acoso, Ciberacoso y Actos de Discriminación (Actualizado 2024)',
    summary: 'Conductas de agresión verbal, física o digital, discriminación de género, etnia u orientación en cualquier canal.',
    details: [
      'Cero tolerancia con el acoso sexual, matoneo o agresiones en grupos de WhatsApp o redes de la ficha.',
      'Garantía de rutas de protección de género y atención inmediata por parte de Bienestar.',
      'Sanción ejemplar que puede conllevar a la cancelación de matrícula e inhabilidad.'
    ],
    practicalTip: 'La empatía y el respeto por la diversidad son pilares innegociables de la formación integral.',
    badge: 'Convivencia Segura',
    isRecent2024Highlight: true
  },
  {
    id: 'pro-4',
    chapter: 'Capítulo III / IV - Prohibiciones Expresas',
    chapterNumber: 3,
    category: 'prohibicion',
    title: 'Comercialización No Autorizada e Intereses Particulares',
    summary: 'Realizar rifas, ventas comerciales informales o cobros indebidos dentro de las instalaciones del SENA.',
    details: [
      'Las instalaciones educativas no pueden ser destinadas a lucro personal sin autorización de la Subdirección.',
      'Ningún aprendiz puede cobrar a sus compañeros por cupos, evaluaciones o materiales comunes.',
      'Falta sujeta a llamado de atención y medidas formativas.'
    ],
    practicalTip: 'El emprendimiento SENA se canaliza a través de Fondo Emprender y unidades productivas oficiales.',
    badge: 'Transparencia',
    isRecent2024Highlight: false
  },

  // MEDIDAS FORMATIVAS Y SANCIONES
  {
    id: 'san-1',
    chapter: 'Capítulo VII y VIII - Medidas Formativas y Sanciones',
    chapterNumber: 7,
    category: 'falta_sancion',
    title: 'Medidas Formativas Pedagógicas',
    summary: 'Estrategias pedagógicas preventivas para orientar al aprendiz ante incumplimientos leves o dificultades de rendimiento.',
    details: [
      'Llamado de atención verbal reflexivo por parte del instructor.',
      'Plan de Mejoramiento Académico: actividades pedagógicas acordadas para alcanzar competencias en tiempo límite.',
      'Plan de Mejoramiento Disciplinario: compromisos conductuales con seguimiento de coordinación y bienestar.'
    ],
    practicalTip: 'El plan de mejoramiento es una oportunidad para nivelar tus competencias y continuar tu ruta exitosa.',
    badge: 'Enfoque Pedagógico',
    isRecent2024Highlight: false
  },
  {
    id: 'san-2',
    chapter: 'Capítulo VII y VIII - Medidas Formativas y Sanciones',
    chapterNumber: 8,
    category: 'falta_sancion',
    title: 'Sanciones Disciplinarias Oficiales',
    summary: 'Medidas impuestas por la Subdirección de Centro tras informe del Comité de Evaluación y debido proceso.',
    details: [
      '1. Llamado de atención escrito con copia a la hoja de vida del aprendiz.',
      '2. Condicionamiento de matrícula (periodo de prueba con seguimiento especial).',
      '3. Cancelación definitiva de matrícula (con inhabilidad de 6 meses a 2 años para reingresar al SENA).'
    ],
    practicalTip: 'Todo proceso sancionatorio garantiza el derecho a la defensa y a presentar descargos formales.',
    badge: 'Régimen Sancionatorio',
    isRecent2024Highlight: false
  },

  // NOVEDADES ACADÉMICAS
  {
    id: 'nov-1',
    chapter: 'Capítulo IV y V - Novedades del Aprendiz y Trámites 2024',
    chapterNumber: 4,
    category: 'novedad',
    title: 'Aplazamiento, Traslado y Retiro Voluntario',
    summary: 'Procedimientos formales para solicitar cambios temporales o definitivos en la ruta de formación.',
    details: [
      'Aplazamiento: Solicitud por fuerza mayor o calamidad comprobada (hasta por 6 meses prorrogables).',
      'Traslado de Centro o Jornada: Requiere disponibilidad de cupo y equivalencia en el programa formativo.',
      'Retiro Voluntario: Solicitud formal radicada ante la coordinación académica para evitar sanción por deserción.',
      'Reingreso: Trámite para reactivar la formación antes de que venza el periodo de aplazamiento.'
    ],
    practicalTip: 'Si tienes problemas personales graves, solicita el aplazamiento a tiempo; nunca abandones la formación en silencio.',
    badge: 'Trámites de Novedad',
    isRecent2024Highlight: true
  },
  {
    id: 'nov-2',
    chapter: 'Capítulo IV y V - Novedades del Aprendiz y Trámites 2024',
    chapterNumber: 5,
    category: 'novedad',
    title: 'Deserción: Causales y Consecuencias',
    summary: 'Abandono injustificado de la formación durante 3 días hábiles consecutivos sin comunicación oficial.',
    details: [
      'Inasistencia injustificada reiterada en etapa lectiva o productiva.',
      'No presentarse a la etapa productiva dentro del término legal tras culminar la lectiva.',
      'Consecuencia: Cancelación de matrícula e inhabilidad para matricularse en el SENA por seis (6) meses.'
    ],
    practicalTip: 'Mantén comunicación fluida con tu instructor vocero para evitar alertas tempranas de deserción.',
    badge: 'Evita Deserción',
    isRecent2024Highlight: false
  }
];

export const INDUCTION_MODULES_PLAN = [
  {
    step: 1,
    title: 'Identidad, Principios y Filosofía SENA',
    duration: 'Módulo 1 • 20 min',
    description: 'Conoce los orígenes de la entidad más querida por los colombianos, sus símbolos (escudo, bandera, himno), misión, visión y principios institucionales que guían tu formación.',
    keyObjectives: [
      'Comprender la Formación Profesional Integral (FPI)',
      'Identificar la estructura de tu Centro de Formación y Regional',
      'Interiorizar los valores éticos institucionales'
    ],
    status: 'completed',
    icon: 'Sparkles'
  },
  {
    step: 2,
    title: 'Derechos del Aprendiz (Acuerdo 0009 de 2024)',
    duration: 'Módulo 2 • 35 min',
    description: 'Apropia las garantías que el SENA te ofrece: acceso a formación de calidad, infraestructura digital, dotación de EPP, Bienestar, representación democrática y evaluación justa.',
    keyObjectives: [
      'Dominar el catálogo de derechos en ambientes presenciales y virtuales',
      'Conocer los tiempos y derechos en la entrega de resultados y retroalimentación',
      'Descubrir los programas de Bienestar al Aprendiz y apoyos de sostenimiento'
    ],
    status: 'in-progress',
    icon: 'ShieldCheck'
  },
  {
    step: 3,
    title: 'Deberes, Prohibiciones y Ética Digital',
    duration: 'Módulo 3 • 40 min',
    description: 'Entiende tus compromisos como aprendiz: puntualidad, justificación de inasistencias en 3 días hábiles, cuidado de ambientes, integridad académica y uso responsable de IA.',
    keyObjectives: [
      'Cumplir el procedimiento de justificación oportuna de inasistencias',
      'Diferenciar entre uso ético y fraude en el uso de IA y herramientas digitales',
      'Identificar las prohibiciones para preservar la convivencia y seguridad'
    ],
    status: 'pending',
    icon: 'BookOpenCheck'
  },
  {
    step: 4,
    title: 'Régimen Disciplinario, Novedades y Comité',
    duration: 'Módulo 4 • 30 min',
    description: 'Conoce el funcionamiento del Comité de Evaluación y Seguimiento, tipos de faltas (leves, graves, gravísimas), medidas formativas, sanciones y trámites de novedades académicas.',
    keyObjectives: [
      'Conocer el debido proceso ante el Comité de Evaluación y Seguimiento',
      'Distinguir planes de mejoramiento de sanciones disciplinarias',
      'Gestionar aplazamientos, traslados o retiros voluntarios conforme a la norma'
    ],
    status: 'pending',
    icon: 'Scale'
  },
  {
    step: 5,
    title: 'Evaluación Gamificada & Reto de Certificación',
    duration: 'Reto Final • 15 min',
    description: 'Demuestra tus conocimientos en el simulador interactivo de casos y responde la trivia final para obtener tu puntaje de aprobación y expedir tu Certificado Oficial de Inducción.',
    keyObjectives: [
      'Resolver situaciones reales del ambiente de aprendizaje',
      'Alcanzar mínimo el 80% en la evaluación final',
      'Descargar y validar el Certificado Oficial de Inducción SENA'
    ],
    status: 'pending',
    icon: 'Award'
  }
];
