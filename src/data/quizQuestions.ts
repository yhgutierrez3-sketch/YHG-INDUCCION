import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: '¿Cuál es la norma más reciente adoptada por el SENA que expide el nuevo Reglamento del Aprendiz y deroga los acuerdos anteriores?',
    category: 'general',
    options: [
      'Acuerdo 007 de 2012',
      'Acuerdo 0009 de 2024 (expedido en noviembre de 2024)',
      'Resolución 100 de 2019',
      'Decreto 2420 de 2015'
    ],
    correctIndex: 1,
    justification: 'El Consejo Directivo Nacional del SENA expidió el Acuerdo 0009 de 2024 (21 de noviembre de 2024), actualizando y modernizando el Reglamento del Aprendiz.',
    acuerdoRef: 'Acuerdo 0009 de 2024 - Preámbulo y Disposiciones Generales'
  },
  {
    id: 'q2',
    question: 'Si un aprendiz presenta una inasistencia por motivos de salud o fuerza mayor justificada, ¿cuál es el plazo máximo para radicar el soporte ante su instructor y coordinación?',
    category: 'deberes',
    options: [
      'Dentro de las 24 horas siguientes',
      'Máximo tres (3) días hábiles siguientes al hecho',
      'Al finalizar el trimestre académico',
      'Treinta (30) días calendario'
    ],
    correctIndex: 1,
    justification: 'El reglamento estipula con claridad que el aprendiz debe presentar la justificación debidamente soportada en un plazo máximo de tres (3) días hábiles.',
    acuerdoRef: 'Capítulo III - Deberes del Aprendiz SENA'
  },
  {
    id: 'q3',
    question: '¿En qué término máximo el instructor debe registrar la evaluación y retroalimentación de las evidencias presentadas por el aprendiz?',
    category: 'derechos',
    options: [
      'Al día siguiente de la entrega sin falta',
      'Ocho (8) días hábiles siguientes a la entrega de la evidencia',
      'Quince (15) días calendario',
      'Solo al cierre de la etapa lectiva'
    ],
    correctIndex: 1,
    justification: 'Es un derecho fundamental del aprendiz conocer los resultados y recibir retroalimentación pedagógica en un plazo máximo de 8 días hábiles tras la entrega.',
    acuerdoRef: 'Capítulo II - Derechos del Aprendiz SENA'
  },
  {
    id: 'q4',
    question: '¿Cuál de las siguientes acciones NO constituye una medida formativa, sino una sanción disciplinaria formal impuesta por Subdirección?',
    category: 'sanciones',
    options: [
      'Llamado de atención verbal reflexivo',
      'Plan de mejoramiento académico por competencias',
      'Plan de mejoramiento disciplinario',
      'Condicionamiento o cancelación de la matrícula'
    ],
    correctIndex: 3,
    justification: 'Las medidas formativas son pedagógicas (llamado verbal, planes de mejoramiento). Las sanciones formales son el llamado escrito con copia a hoja de vida, el condicionamiento y la cancelación de matrícula.',
    acuerdoRef: 'Capítulo VII y VIII - Medidas Formativas y Sanciones'
  },
  {
    id: 'q5',
    question: 'Bajo el enfoque de actualización digital e Inteligencia Artificial del nuevo reglamento, ¿cuál es la pauta correcta sobre el uso de tecnologías en evidencias formativas?',
    category: 'deberes',
    options: [
      'Está totalmente prohibido encender computadores o usar internet en talleres.',
      'Se permite el uso ético, crítico y documentado de herramientas tecnológicas e IA, citando adecuadamente y garantizando análisis de autoría propia.',
      'El aprendiz puede entregar textos generados al 100% por IA sin citar ni leerlos.',
      'Solo los instructores pueden usar herramientas digitales.'
    ],
    correctIndex: 1,
    justification: 'El Acuerdo 0009 de 2024 fomenta la inclusión digital y el pensamiento crítico: la IA y plataformas digitales son aliadas de formación siempre que se utilicen con honestidad intelectual y rigurosa citación.',
    acuerdoRef: 'Capítulo III - Integridad Académica y Competencias Digitales'
  },
  {
    id: 'q6',
    question: '¿Por cuánto tiempo máximo puede un aprendiz solicitar el aplazamiento justificado de su programa de formación?',
    category: 'general',
    options: [
      'Máximo 15 días calendario',
      'Hasta por seis (6) meses prorrogables de conformidad con el reglamento',
      'Dos (2) años continuos',
      'El SENA no permite bajo ninguna circunstancia el aplazamiento'
    ],
    correctIndex: 1,
    justification: 'El aplazamiento es una novedad autorizada que permite congelar la formación hasta por 6 meses por motivos justificados (médicos, servicio militar, fuerza mayor), prorrogable según el caso.',
    acuerdoRef: 'Capítulo IV y V - Novedades del Aprendiz'
  },
  {
    id: 'q7',
    question: '¿Qué consecuencia normativa genera la declaratoria de "Deserción" en un programa de formación del SENA?',
    category: 'sanciones',
    options: [
      'Una felicitación por cambio de rumbo profesional',
      'Cancelación de la matrícula e imposibilidad de participar en procesos de ingreso al SENA durante seis (6) meses',
      'Traslado automático a otra carrera técnica',
      'Una multa económica a pagar al Ministerio del Trabajo'
    ],
    correctIndex: 1,
    justification: 'La deserción declarada en firme produce la cancelación de la matrícula y la inhabilidad para ingresar a programas del SENA por el término de seis (6) meses.',
    acuerdoRef: 'Capítulo V - Deserción y Consecuencias Disciplinarias'
  },
  {
    id: 'q8',
    question: '¿Cuál de las siguientes conductas está catalogada expresamente como PROHIBICIÓN dentro de los ambientes de formación del SENA?',
    category: 'prohibiciones',
    options: [
      'Portar el carné en lugar visible durante toda la jornada',
      'Ingresar bajo el efecto de bebidas embriagantes o sustancias psicoactivas',
      'Hacer uso de la biblioteca institucional en horarios libres',
      'Participar en actividades de liderazgo y torneos deportivos de Bienestar'
    ],
    correctIndex: 1,
    justification: 'El ingreso, porte o consumo de sustancias psicoactivas o alcohol está tajantemente prohibido y constituye una falta de extrema gravedad para la seguridad integral.',
    acuerdoRef: 'Capítulo III - Prohibiciones'
  },
  {
    id: 'q9',
    question: 'Respecto a los Elementos de Protección Personal (EPP), ¿cuál afirmación describe con exactitud el derecho y deber del aprendiz?',
    category: 'derechos',
    options: [
      'El aprendiz puede prescindir de los EPP si siente calor o incomodidad en el taller.',
      'El aprendiz tiene derecho a ser instruido en seguridad industrial y el deber estricto de portar los EPP requeridos antes de operar cualquier equipo o maquinaria.',
      'Los EPP solo son obligatorios en las últimas dos semanas antes de graduarse.',
      'El SENA no exige normas de seguridad en sus laboratorios.'
    ],
    correctIndex: 1,
    justification: 'La seguridad y salud en el trabajo es un binomio indivisible: el SENA garantiza ambientes seguros y el aprendiz tiene el deber ineludible de usar los EPP reglamentarios.',
    acuerdoRef: 'Capítulo II y III - Seguridad y Salud en el Trabajo'
  },
  {
    id: 'q10',
    question: '¿Cuál es el papel del Vocero de Aprendices y el Representante en el Centro de Formación según el reglamento?',
    category: 'derechos',
    options: [
      'Sancionar a los instructores que lleguen tarde',
      'Canalizar inquietudes de los aprendices, promover el bienestar y participar en el Comité de Evaluación y Seguimiento con voz',
      'Decidir el horario de entrada de los vigilantes',
      'Reemplazar al Subdirector en eventos públicos'
    ],
    correctIndex: 1,
    justification: 'Los voceros y representantes son líderes democráticos elegidos por sus pares para fortalecer la comunicación, defender los derechos formativos y aportar en los comités con voz.',
    acuerdoRef: 'Capítulo X - Representación de los Aprendices'
  }
];
