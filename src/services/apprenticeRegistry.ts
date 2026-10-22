import { SpreadsheetRecord, syncApprenticeToGoogleSheets } from './googleSheetsService';
import { ApprenticeInfo } from '../types';

const STORAGE_KEY = 'sena_all_apprentice_records';

const SAMPLE_RECORDS: SpreadsheetRecord[] = [
  {
    id: 'sena-rec-1',
    rowIndex: 2,
    timestamp: '21/10/2026, 08:15 AM',
    documentType: 'C.C.',
    documentNumber: '1023948571',
    fullName: 'Laura Marcela Gómez Rojas',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software',
    fichaNumber: '2894520',
    regional: 'Distrito Capital - Centro de Tecnologías para la Construcción y la Madera',
    centerName: 'Centro de Tecnologías para la Construcción y la Madera',
    score: '95%',
    status: 'Aprobado y Certificado',
    certificateCode: 'SENA-IND-2024-LM89A2-REG',
    completionDate: '21 de octubre de 2026',
    userEmail: 'lgomez@soy.sena.edu.co'
  },
  {
    id: 'sena-rec-2',
    rowIndex: 3,
    timestamp: '21/10/2026, 09:30 AM',
    documentType: 'C.C.',
    documentNumber: '1098472911',
    fullName: 'Carlos Andrés Restrepo Osorio',
    programName: 'Tecnólogo en Gestión de Redes de Datos',
    fichaNumber: '2894520',
    regional: 'Antioquia - Centro de Tecnología de la Manufactura Avanzada',
    centerName: 'Centro de Tecnología de la Manufactura Avanzada',
    score: '88%',
    status: 'Aprobado y Certificado',
    certificateCode: 'SENA-IND-2024-CR77K1-REG',
    completionDate: '21 de octubre de 2026',
    userEmail: 'crestreso@soy.sena.edu.co'
  }
];

/**
 * Returns all apprentice records stored locally.
 */
export function getStoredApprentices(): SpreadsheetRecord[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_RECORDS));
    return SAMPLE_RECORDS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error parsing apprentice records:', e);
    return SAMPLE_RECORDS;
  }
}

/**
 * Saves or updates an apprentice record in the central registry.
 */
export function saveApprenticeToRegistry(
  apprentice: ApprenticeInfo,
  score: number,
  quizPassed: boolean,
  certificateCode: string,
  completionDate: string | null
): SpreadsheetRecord {
  const existing = getStoredApprentices();
  const formattedTimestamp = new Date().toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const recordIndex = existing.findIndex(
    r => r.documentNumber.trim() === apprentice.documentNumber.trim()
  );

  const updatedRecord: SpreadsheetRecord = {
    id: recordIndex !== -1 ? existing[recordIndex].id : `sena-rec-${Date.now()}`,
    rowIndex: recordIndex !== -1 ? existing[recordIndex].rowIndex : existing.length + 2,
    timestamp: formattedTimestamp,
    documentType: apprentice.documentType,
    documentNumber: apprentice.documentNumber,
    fullName: apprentice.fullName,
    programName: apprentice.programName,
    fichaNumber: apprentice.fichaNumber,
    regional: apprentice.regional,
    centerName: apprentice.centerName,
    score: `${score}%`,
    status: quizPassed ? 'Aprobado y Certificado' : 'En Proceso',
    certificateCode: certificateCode,
    completionDate: completionDate || (quizPassed ? 'Aprobado' : 'Pendiente'),
    userEmail: ''
  };

  let updatedList: SpreadsheetRecord[];
  if (recordIndex !== -1) {
    updatedList = [...existing];
    updatedList[recordIndex] = updatedRecord;
  } else {
    updatedList = [updatedRecord, ...existing];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    // Trigger custom event for reactivity across components
    window.dispatchEvent(new CustomEvent('sena_apprentice_updated', { detail: updatedRecord }));
  }

  // Attempt background sync to Google Sheets if possible (fails quietly without disturbing student)
  attemptBackgroundSync(apprentice, score, quizPassed, certificateCode, completionDate);

  return updatedRecord;
}

/**
 * Deletes an apprentice record by document number.
 */
export function deleteApprenticeFromRegistry(documentNumber: string): SpreadsheetRecord[] {
  const existing = getStoredApprentices();
  const filtered = existing.filter(r => r.documentNumber.trim() !== documentNumber.trim());
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('sena_apprentice_updated'));
  }
  return filtered;
}

/**
 * Attempts a silent background sync to Google Sheets without interrupting the student.
 */
async function attemptBackgroundSync(
  apprentice: ApprenticeInfo,
  score: number,
  quizPassed: boolean,
  certificateCode: string,
  completionDate: string | null
) {
  try {
    await syncApprenticeToGoogleSheets({
      apprentice,
      score,
      quizPassed,
      certificateCode,
      completionDate
    });
    console.log('Sincronización en segundo plano con Google Sheets exitosa.');
  } catch (e) {
    // Graceful background fallback: record remains safely in local registry for instructor to batch-push
    console.debug('Guardado en segundo plano en Google Sheets pendiente de sesión de instructor:', e);
  }
}

/**
 * Exports all apprentice records to a downloadable CSV formatted with official SENA columns.
 */
export function exportApprenticesToCsv(records: SpreadsheetRecord[], filename = 'Reporte_Induccion_SENA_Acuerdo_0009_2024.csv') {
  const headers = [
    'Fecha de Registro',
    'Tipo Documento',
    'No. Documento',
    'Nombre Completo',
    'Programa de Formacion',
    'Ficha',
    'Regional',
    'Centro de Formacion',
    'Calificacion',
    'Estado',
    'Codigo Certificado',
    'Fecha Expedicion'
  ];

  const rows = records.map(r => [
    `"${r.timestamp}"`,
    `"${r.documentType}"`,
    `"${r.documentNumber}"`,
    `"${r.fullName}"`,
    `"${r.programName}"`,
    `"${r.fichaNumber}"`,
    `"${r.regional}"`,
    `"${r.centerName}"`,
    `"${r.score}"`,
    `"${r.status}"`,
    `"${r.certificateCode}"`,
    `"${r.completionDate}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
