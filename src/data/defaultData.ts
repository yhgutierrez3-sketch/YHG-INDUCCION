import { ApprenticeInfo, BadgeItem } from '../types';

export const INITIAL_APPRENTICE: ApprenticeInfo = {
  fullName: 'Yenny Hernández Gutiérrez',
  documentType: 'C.C.',
  documentNumber: '1.032.485.912',
  programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
  fichaNumber: '2874910',
  regional: 'Regional Distrito Capital',
  centerName: 'Centro de Gestión de Mercados, Logística y Tecnologías de la Información'
};

export const INITIAL_BADGES: BadgeItem[] = [
  {
    id: 'badge-identidad',
    title: 'ADN SENA',
    description: 'Explora la misión, himno y valores institucionales.',
    icon: 'Sparkles',
    unlocked: true
  },
  {
    id: 'badge-derechos',
    title: 'Guardián de Derechos',
    description: 'Revisa y apropia los 8 derechos fundamentales del aprendiz.',
    icon: 'ShieldCheck',
    unlocked: false
  },
  {
    id: 'badge-deberes',
    title: 'Compromiso y Ética',
    description: 'Conoce los deberes y buenas prácticas de integridad digital.',
    icon: 'BookOpenCheck',
    unlocked: false
  },
  {
    id: 'badge-casos',
    title: 'Estratega del Taller',
    description: 'Resuelve satisfactoriamente 3 dilemas o casos reales del ambiente.',
    icon: 'Target',
    unlocked: false
  },
  {
    id: 'badge-maestro',
    title: 'Aprobación de Inducción',
    description: 'Supera el reto final con más del 80% y genera tu certificado oficial.',
    icon: 'Award',
    unlocked: false
  }
];

export const SENA_REGIONALES = [
  'Regional Amazonas',
  'Regional Antioquia',
  'Regional Arauca',
  'Regional Atlántico',
  'Regional Bolívar',
  'Regional Boyacá',
  'Regional Caldas',
  'Regional Caquetá',
  'Regional Casanare',
  'Regional Cauca',
  'Regional Cesar',
  'Regional Chocó',
  'Regional Córdoba',
  'Regional Cundinamarca',
  'Regional Distrito Capital',
  'Regional Guainía',
  'Regional Guaviare',
  'Regional Huila',
  'Regional La Guajira',
  'Regional Magdalena',
  'Regional Meta',
  'Regional Nariño',
  'Regional Norte de Santander',
  'Regional Putumayo',
  'Regional Quindío',
  'Regional Risaralda',
  'Regional San Andrés y Providencia',
  'Regional Santander',
  'Regional Sucre',
  'Regional Tolima',
  'Regional Valle del Cauca',
  'Regional Vaupés',
  'Regional Vichada'
];

export const FAQ_ITEMS = [
  {
    q: '¿Qué es el Acuerdo 0009 de 2024?',
    a: 'Es la normativa más reciente expedida por el Consejo Directivo Nacional del SENA en noviembre de 2024. Adopta el nuevo Reglamento del Aprendiz, derogando los acuerdos anteriores (como el 007 de 2012) e integrando regulaciones actualizadas sobre inclusión, digitalización, uso ético de IA, debido proceso y comités.'
  },
  {
    q: '¿Cuántos días tengo para radicar una incapacidad médica?',
    a: 'Dispones de un plazo máximo e improrrogable de tres (3) días hábiles contados a partir del inicio de la novedad, radicando la incapacidad formal de tu EPS ante el instructor técnico y coordinación.'
  },
  {
    q: '¿Qué pasa si falto tres días continuos sin avisar?',
    a: 'Incurres en causal de deserción formativa. Si no presentas justificación en los términos legales, el Centro iniciará el trámite de cancelación de matrícula e inhabilidad para matricularte en el SENA durante seis (6) meses.'
  },
  {
    q: '¿Puedo usar ChatGPT o Inteligencia Artificial en mis tareas?',
    a: 'Sí, como herramienta de apoyo, investigación o ideación, pero NUNCA para entregar resultados sin citación o fingiendo autoría propia. Debes ser transparente, citar las herramientas utilizadas y aportar tu propio análisis crítico y desarrollo técnico.'
  },
  {
    q: '¿Quién conforma el Comité de Evaluación y Seguimiento?',
    a: 'Está presidido por el Subdirector o su delegado (Coordinador de Formación), instructores de la ficha, un representante de Bienestar al Aprendiz, y cuenta con la participación del Vocero de la ficha (con voz), garantizando el debido proceso y derecho a la defensa.'
  },
  {
    q: '¿Qué requisitos necesito para obtener mi Certificado de Inducción?',
    a: 'Completar la ruta de aprendizaje de los módulos del reglamento, superar el simulador de casos prácticos y responder la evaluación final con un puntaje mínimo de 80/100 puntos.'
  }
];
