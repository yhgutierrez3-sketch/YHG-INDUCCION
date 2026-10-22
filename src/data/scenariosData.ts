import { CaseScenario } from '../types';

export const SCENARIO_CASES: CaseScenario[] = [
  {
    id: 'caso-1',
    title: 'Incapacidad Médica y Tiempos de Justificación',
    category: 'deberes',
    context: 'Juan, aprendiz del tecnólogo en Gestión de Redes de Datos, tuvo un accidente en bicicleta el domingo y la EPS le expidió una incapacidad médica por 4 días.',
    problem: 'Juan no sabe cómo ni cuándo debe reportar su inasistencia al centro de formación.',
    options: [
      {
        id: 'c1-o1',
        text: 'Esperar a regresar la próxima semana al centro y mostrar la incapacidad en físico si algún instructor le pregunta.',
        isCorrect: false,
        explanation: 'Incorrecto. Dejar pasar más de 3 días hábiles sin radicar la justificación se considera inasistencia injustificada y puede iniciar alerta de deserción.',
        points: 0
      },
      {
        id: 'c1-o2',
        text: 'Enviar la incapacidad por los canales oficiales al instructor y coordinación dentro de los tres (3) días hábiles siguientes al inicio de la incapacidad.',
        isCorrect: true,
        explanation: '¡Correcto! El Acuerdo 0009 de 2024 (Art. Deberes) estipula que las justificaciones de inasistencia médica o fuerza mayor deben presentarse dentro de los 3 días hábiles siguientes a la novedad.',
        points: 50
      },
      {
        id: 'c1-o3',
        text: 'Decirle a un compañero de ficha que le firme la lista de asistencia para que no le cuente la falla.',
        isCorrect: false,
        explanation: 'Incorrecto. Suplantar la firma o registrar asistencia ajena es una falta disciplinaria grave que sanciona tanto a quien lo pide como a quien lo ejecuta.',
        points: -10
      }
    ]
  },
  {
    id: 'caso-2',
    title: 'Uso Ético de Inteligencia Artificial en el Proyecto',
    category: 'academico',
    context: 'Luisa y Camilo deben entregar una propuesta de diseño para su proyecto formativo. Utilizaron una herramienta de IA generativa para generar borradores de código y esquemas.',
    problem: '¿Cómo deben presentar el trabajo para cumplir con el principio de integridad académica del nuevo reglamento 2024?',
    options: [
      {
        id: 'c2-o1',
        text: 'Presentar el código y textos generados como autoría 100% propia sin mencionar que usaron IA, para no ser juzgados.',
        isCorrect: false,
        explanation: 'Incorrecto. Presentar contenido generado por terceros o modelos como propio sin dar crédito ni justificación constituye plagio y falta a la integridad académica.',
        points: 0
      },
      {
        id: 'c2-o2',
        text: 'Citar y documentar el uso de la herramienta de IA, explicar el razonamiento técnico propio aplicado, contrastar los resultados y validar las fuentes.',
        isCorrect: true,
        explanation: '¡Excelente! El Acuerdo 0009 de 2024 promueve la adopción tecnológica y digital responsable: la IA puede usarse como soporte formativo siempre que exista transparencia, rigor crítico y análisis propio.',
        points: 50
      },
      {
        id: 'c2-o3',
        text: 'Borrar todo el trabajo porque el SENA prohíbe completamente cualquier uso de computadores o herramientas de IA.',
        isCorrect: false,
        explanation: 'Incorrecto. El SENA no prohíbe la tecnología moderna; fomenta las competencias digitales y el uso ético, transparente y productivo de la innovación.',
        points: 10
      }
    ]
  },
  {
    id: 'caso-3',
    title: 'Seguridad en el Taller y Elementos de Protección (EPP)',
    category: 'seguridad',
    context: 'En el taller de Mecánica Industrial, a Mateo se le olvidaron sus botas con puntera de seguridad y gafas de protección reglamentarias. El instructor le indica que no puede ingresar a la zona de máquinas.',
    problem: 'Mateo argumenta que tiene derecho a la formación y que entrará bajo su propia responsabilidad.',
    options: [
      {
        id: 'c3-o1',
        text: 'Mateo tiene la razón: el derecho a la educación está por encima de cualquier norma de bioseguridad del taller.',
        isCorrect: false,
        explanation: 'Incorrecto. Los derechos individuales tienen como límite la seguridad colectiva y la normativa de seguridad y salud en el trabajo (SST) del SENA.',
        points: 0
      },
      {
        id: 'c3-o2',
        text: 'El instructor actúa conforme al reglamento: es un deber del aprendiz portar los EPP reglamentarios y una obligación institucional preservar la vida e integridad física.',
        isCorrect: true,
        explanation: '¡Muy bien! Según el reglamento, es deber inexcusable usar los EPP correspondientes a cada área técnica. Ningún aprendiz puede operar maquinaria si esto compromete su integridad o la de sus pares.',
        points: 50
      },
      {
        id: 'c3-o3',
        text: 'Mateo puede pedir prestadas unas zapatillas comunes a otro compañero y trabajar sin gafas si tiene mucho cuidado.',
        isCorrect: false,
        explanation: 'Incorrecto. La seguridad no se improvisa; el uso de calzado y protección inapropiada en zonas industriales puede derivar en graves accidentes laborales.',
        points: -10
      }
    ]
  },
  {
    id: 'caso-4',
    title: 'Derecho a Evaluación Oportuna y Retroalimentación',
    category: 'derechos',
    context: 'Sofía entregó su evidencia de aprendizaje a través de la plataforma virtual hace 14 días calendario (10 días hábiles) y no ha recibido calificación ni comentarios pedagógicos.',
    problem: 'Sofía necesita saber si fue aprobada para avanzar en el siguiente resultado de aprendizaje.',
    options: [
      {
        id: 'c4-o1',
        text: 'Sofía tiene el derecho de solicitar respetuosamente al instructor la revisión y retroalimentación, ya que el reglamento establece un plazo máximo de 8 días hábiles para la evaluación.',
        isCorrect: true,
        explanation: '¡Totalmente correcto! El reglamento establece como derecho del aprendiz conocer los resultados de sus evaluaciones en un término no mayor a ocho (8) días hábiles siguientes a la entrega.',
        points: 50
      },
      {
        id: 'c4-o2',
        text: 'Debe resignarse y esperar hasta el final del trimestre, ya que los instructores no tienen tiempos límites para calificar evidencias.',
        isCorrect: false,
        explanation: 'Incorrecto. La formación por competencias requiere retroalimentación oportuna para que el aprendiz pueda corregir y reforzar sus aprendizajes a tiempo.',
        points: 0
      },
      {
        id: 'c4-o3',
        text: 'Publicar una queja agresiva en redes sociales insultando a la institución.',
        isCorrect: false,
        explanation: 'Incorrecto. Los reclamos deben canalizarse por los conductos regulares institucionales (instructor, vocero de ficha, coordinador misional, subdirección).',
        points: -10
      }
    ]
  },
  {
    id: 'caso-5',
    title: 'Calamidad Familiar y Solicitud de Aplazamiento',
    category: 'deberes',
    context: 'Felipe debe trasladarse temporalmente a otra región por una situación médica grave de su madre durante dos meses, lo que le impedirá asistir a las clases de su tecnólogo.',
    problem: '¿Cuál es el procedimiento reglamentario que debe seguir para no perder su cupo ni ser sancionado?',
    options: [
      {
        id: 'c5-o1',
        text: 'Dejar de asistir sin avisar y volver cuando se solucione la situación para pedir que le reactiven la formación.',
        isCorrect: false,
        explanation: 'Incorrecto. El abandono de 3 días hábiles consecutivos sin justificación legal activa la causal de deserción con cancelación de matrícula e inhabilidad de 6 meses.',
        points: 0
      },
      {
        id: 'c5-o2',
        text: 'Radicar formalmente la solicitud de "Aplazamiento" por fuerza mayor ante la Coordinación Académica con los debidos soportes antes de ausentarse.',
        isCorrect: true,
        explanation: '¡Excelente decisión! El aplazamiento es una novedad del aprendiz que permite congelar temporalmente la matrícula hasta por seis (6) meses prorrogables, conservando el cupo sin incurrir en deserción.',
        points: 50
      },
      {
        id: 'c5-o3',
        text: 'Venderle su cupo a un amigo que quiera estudiar la misma carrera.',
        isCorrect: false,
        explanation: 'Incorrecto. Los cupos en el SENA son gratuitos, personales e intransferibles bajo ninguna circunstancia.',
        points: -20
      }
    ]
  }
];
