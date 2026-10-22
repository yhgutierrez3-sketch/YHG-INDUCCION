import { getAccessToken } from './googleAuth';
import { ApprenticeInfo } from '../types';

export const SPREADSHEET_TITLE = 'Inducción SENA - Registro de Aprendices (Acuerdo 0009 de 2024)';
export const SHEET_NAME = 'Registro_Aprendices';

export interface SpreadsheetRecord {
  id: string;
  timestamp: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
  programName: string;
  fichaNumber: string;
  regional: string;
  centerName: string;
  score: string;
  status: string;
  certificateCode: string;
  completionDate: string;
  userEmail: string;
  rowIndex?: number;
}

export interface SyncApprenticeParams {
  apprentice: ApprenticeInfo;
  score: number;
  quizPassed: boolean;
  certificateCode: string;
  completionDate: string | null;
  userEmail?: string;
}

function formatGoogleApiError(action: string, errorData: any, statusText: string, status?: number): string {
  const rawMsg = errorData?.error?.message || statusText || 'Error desconocido';
  if (
    status === 403 || 
    status === 401 || 
    rawMsg.toLowerCase().includes('insufficient') ||
    rawMsg.toLowerCase().includes('permission') ||
    errorData?.error?.status === 'PERMISSION_DENIED'
  ) {
    return `Permisos insuficientes de Google Sheets: Tu sesión actual no otorgó permisos a hojas de cálculo. Haz clic en "Conceder permisos de Google Sheets" para autorizar el acceso en la ventana de Google. (${rawMsg})`;
  }
  return `${action}: ${rawMsg}`;
}

/**
 * Searches user's Google Drive for an existing induction spreadsheet.
 * Prioritizes direct Sheets API lookup for high reliability, and gracefully handles Drive scope limitations.
 */
export async function findExistingSpreadsheet(accessToken: string): Promise<{ id: string; url: string } | null> {
  // 1. Check if we already have a saved spreadsheet ID in local storage
  const savedId = typeof window !== 'undefined' ? localStorage.getItem('sena_induction_spreadsheet_id') : null;
  if (savedId) {
    try {
      const checkRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${savedId}?fields=spreadsheetId,spreadsheetUrl,properties.title`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (checkRes.ok) {
        const data = await checkRes.json();
        const sheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}`;
        if (typeof window !== 'undefined') {
          localStorage.setItem('sena_sheets_url', sheetUrl);
        }
        return {
          id: data.spreadsheetId,
          url: sheetUrl
        };
      }
    } catch {
      // Saved ID invalid, continue search
    }
  }

  // 2. Try querying Google Drive API if available, catching scope restrictions gracefully
  try {
    const query = encodeURIComponent(`name = '${SPREADSHEET_TITLE}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`);
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.files && data.files.length > 0) {
        const found = {
          id: data.files[0].id,
          url: data.files[0].webViewLink || `https://docs.google.com/spreadsheets/d/${data.files[0].id}`
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem('sena_induction_spreadsheet_id', found.id);
          localStorage.setItem('sena_sheets_url', found.url);
        }
        return found;
      }
    }
  } catch {
    // If Drive files.list has insufficient scope or error, return null so we can create/use via Sheets API
  }

  return null;
}

/**
 * Creates the official induction spreadsheet on Google Drive with SENA styling and headers.
 */
export async function createInductionSpreadsheet(accessToken: string): Promise<{ id: string; url: string }> {
  const headers = [
    'Fecha de Registro',
    'Tipo Doc.',
    'No. Documento',
    'Nombre Completo',
    'Programa de Formación',
    'No. Ficha',
    'Regional SENA',
    'Centro de Formación',
    'Calificación (%)',
    'Estado Inducción',
    'Código Certificado',
    'Fecha Expedición',
    'Cuenta Google Registrador'
  ];

  const body = {
    properties: {
      title: SPREADSHEET_TITLE
    },
    sheets: [
      {
        properties: {
          title: SHEET_NAME,
          gridProperties: {
            frozenRowCount: 1
          }
        },
        data: [
          {
            startRow: 0,
            startColumn: 0,
            rowData: [
              {
                values: headers.map(headerText => ({
                  userEnteredValue: { stringValue: headerText },
                  userEnteredFormat: {
                    backgroundColor: { red: 0.223, green: 0.663, blue: 0.0 }, // #39A900 SENA Green
                    textFormat: {
                      foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                      bold: true,
                      fontSize: 10
                    },
                    horizontalAlignment: 'CENTER',
                    verticalAlignment: 'MIDDLE'
                  }
                }))
              }
            ]
          }
        ]
      }
    ]
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(formatGoogleApiError('Error creando la hoja en Google Sheets', errorData, response.statusText, response.status));
  }

  const created = await response.json();
  const spreadsheetId = created.spreadsheetId;
  const url = created.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

  if (typeof window !== 'undefined') {
    localStorage.setItem('sena_induction_spreadsheet_id', spreadsheetId);
    localStorage.setItem('sena_sheets_url', url);
  }

  return { id: spreadsheetId, url };
}

/**
 * Ensures the induction spreadsheet exists, retrieving or creating it.
 */
export async function getOrCreateSpreadsheet(accessToken: string): Promise<{ id: string; url: string }> {
  const existing = await findExistingSpreadsheet(accessToken);
  if (existing) {
    return existing;
  }
  return await createInductionSpreadsheet(accessToken);
}

/**
 * Verifies and links an existing spreadsheet by ID or URL.
 */
export async function linkExistingSpreadsheet(accessToken: string, idOrUrl: string): Promise<{ id: string; url: string }> {
  const match = idOrUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  const sheetId = match ? match[1] : idOrUrl.trim();

  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=spreadsheetId,spreadsheetUrl,properties.title`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(formatGoogleApiError('No se pudo vincular la hoja', errorData, response.statusText, response.status));
  }

  const data = await response.json();
  const url = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${sheetId}`;

  if (typeof window !== 'undefined') {
    localStorage.setItem('sena_induction_spreadsheet_id', sheetId);
    localStorage.setItem('sena_sheets_url', url);
  }

  return { id: sheetId, url };
}

/**
 * Reads all apprentice rows from the spreadsheet.
 */
export async function fetchApprenticeRecords(accessToken: string, spreadsheetId: string): Promise<SpreadsheetRecord[]> {
  const range = `${SHEET_NAME}!A2:M`;
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    // If the sheet name differs or is not ready yet, return empty
    return [];
  }

  const data = await response.json();
  const rows = data.values || [];

  return rows.map((row: string[], index: number) => ({
    id: `row-${index + 2}`,
    rowIndex: index + 2,
    timestamp: row[0] || '',
    documentType: row[1] || '',
    documentNumber: row[2] || '',
    fullName: row[3] || '',
    programName: row[4] || '',
    fichaNumber: row[5] || '',
    regional: row[6] || '',
    centerName: row[7] || '',
    score: row[8] || '',
    status: row[9] || '',
    certificateCode: row[10] || '',
    completionDate: row[11] || '',
    userEmail: row[12] || ''
  }));
}

/**
 * Saves or updates an apprentice record in the Google Sheets spreadsheet.
 */
export async function syncApprenticeToGoogleSheets(
  params: SyncApprenticeParams
): Promise<{ success: boolean; spreadsheetUrl: string; isNewRecord: boolean }> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error('No hay sesión activa con Google. Por favor inicia sesión primero.');
  }

  // 1. Get or create spreadsheet
  const { id: spreadsheetId, url: spreadsheetUrl } = await getOrCreateSpreadsheet(accessToken);

  // 2. Fetch existing rows to check if already present
  const existingRecords = await fetchApprenticeRecords(accessToken, spreadsheetId);
  const existingMatchIndex = existingRecords.findIndex(r => 
    r.documentNumber.trim() === params.apprentice.documentNumber.trim() ||
    (params.certificateCode && r.certificateCode.trim() === params.certificateCode.trim())
  );

  const formattedTimestamp = new Date().toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const rowValues = [
    formattedTimestamp,
    params.apprentice.documentType,
    params.apprentice.documentNumber,
    params.apprentice.fullName,
    params.apprentice.programName,
    params.apprentice.fichaNumber,
    params.apprentice.regional,
    params.apprentice.centerName,
    `${params.score}%`,
    params.quizPassed ? 'Aprobado y Certificado' : 'En Proceso',
    params.certificateCode,
    params.completionDate || (params.quizPassed ? 'Aprobado hoy' : 'Pendiente'),
    params.userEmail || ''
  ];

  if (existingMatchIndex !== -1) {
    // Update existing row
    const rowIndex = existingRecords[existingMatchIndex].rowIndex || (existingMatchIndex + 2);
    const updateRange = `${SHEET_NAME}!A${rowIndex}:M${rowIndex}`;

    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(updateRange)}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [rowValues]
        })
      }
    );

    if (!updateResponse.ok) {
      const err = await updateResponse.json().catch(() => ({}));
      throw new Error(formatGoogleApiError(`Error actualizando el registro en la fila ${rowIndex}`, err, updateResponse.statusText, updateResponse.status));
    }

    return { success: true, spreadsheetUrl, isNewRecord: false };
  } else {
    // Append new row
    const appendRange = `${SHEET_NAME}!A:M`;
    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(appendRange)}:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [rowValues]
        })
      }
    );

    if (!appendResponse.ok) {
      const err = await appendResponse.json().catch(() => ({}));
      throw new Error(formatGoogleApiError('Error agregando el registro en Google Sheets', err, appendResponse.statusText, appendResponse.status));
    }

    return { success: true, spreadsheetUrl, isNewRecord: true };
  }
}
