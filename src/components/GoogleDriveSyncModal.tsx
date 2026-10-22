import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Search, 
  Database,
  CloudUpload,
  LogOut,
  FolderOpen,
  Copy,
  Check
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  googleSignIn, 
  logoutGoogle, 
  getAccessToken, 
  reauthenticateGoogle,
  formatAuthErrorMessage 
} from '../services/googleAuth';
import { 
  syncApprenticeToGoogleSheets, 
  fetchApprenticeRecords, 
  findExistingSpreadsheet,
  getOrCreateSpreadsheet,
  linkExistingSpreadsheet,
  SpreadsheetRecord, 
  SPREADSHEET_TITLE 
} from '../services/googleSheetsService';
import { ApprenticeInfo } from '../types';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  apprentice: ApprenticeInfo;
  quizScore: number;
  quizPassed: boolean;
  certificateCode: string;
  completionDate: string | null;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  apprentice,
  quizScore,
  quizPassed,
  certificateCode,
  completionDate,
  currentUser,
  onUserChange
}) => {
  const [records, setRecords] = useState<SpreadsheetRecord[]>([]);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(() => {
    return localStorage.getItem('sena_sheets_url');
  });
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(() => {
    return localStorage.getItem('sena_sheets_id');
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isLinking, setIsLinking] = useState(false);

  // Load spreadsheet info if user is authenticated
  useEffect(() => {
    if (isOpen && currentUser) {
      loadSpreadsheetData();
    }
  }, [isOpen, currentUser]);

  const loadSpreadsheetData = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessToken();
      if (!token) return;

      const existing = await findExistingSpreadsheet(token);
      if (existing) {
        setSpreadsheetId(existing.id);
        setSpreadsheetUrl(existing.url);
        localStorage.setItem('sena_sheets_url', existing.url);
        localStorage.setItem('sena_sheets_id', existing.id);
        const fetchedRecords = await fetchApprenticeRecords(token, existing.id);
        setRecords(fetchedRecords);
      } else {
        // Retain saved url if available, or keep null
        const savedUrl = localStorage.getItem('sena_sheets_url');
        if (savedUrl) setSpreadsheetUrl(savedUrl);
        setRecords([]);
      }
    } catch (err: any) {
      console.error('Error cargando hoja de cálculo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setStatusMessage(null);
      const result = await googleSignIn(true);
      if (result) {
        onUserChange(result.user);
        setStatusMessage({
          type: 'success',
          text: `Sesión iniciada como ${result.user.displayName || result.user.email}`
        });
        await loadSpreadsheetData();
      }
    } catch (err: any) {
      const authError = formatAuthErrorMessage(err);
      setStatusMessage({
        type: authError.isUserCancellation ? 'info' : 'error',
        text: authError.text
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReauthenticate = async () => {
    try {
      setIsLoading(true);
      setStatusMessage({
        type: 'info',
        text: 'Abriendo ventana de Google para autorizar los permisos de Google Sheets...'
      });
      const result = await reauthenticateGoogle();
      if (result) {
        onUserChange(result.user);
        setStatusMessage({
          type: 'success',
          text: `¡Permisos concedidos con éxito para ${result.user.displayName || result.user.email}! Ahora puedes guardar y consultar la hoja de cálculo.`
        });
        await loadSpreadsheetData();
      }
    } catch (err: any) {
      const authError = formatAuthErrorMessage(err);
      setStatusMessage({
        type: authError.isUserCancellation ? 'info' : 'error',
        text: authError.text
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    onUserChange(null);
    setRecords([]);
    setStatusMessage({
      type: 'info',
      text: 'Sesión de Google cerrada.'
    });
  };

  const handleCopyLink = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCreateSpreadsheetNow = async () => {
    try {
      setIsLoading(true);
      setStatusMessage(null);
      const token = await getAccessToken();
      if (!token) {
        await handleSignIn();
        return;
      }
      const sheet = await getOrCreateSpreadsheet(token);
      setSpreadsheetId(sheet.id);
      setSpreadsheetUrl(sheet.url);
      localStorage.setItem('sena_sheets_url', sheet.url);
      localStorage.setItem('sena_sheets_id', sheet.id);
      setStatusMessage({
        type: 'success',
        text: `¡Hoja de cálculo "${SPREADSHEET_TITLE}" creada exitosamente en tu Google Drive!`
      });
      const fetched = await fetchApprenticeRecords(token, sheet.id);
      setRecords(fetched);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error creando la hoja en Google Drive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkCustomSpreadsheet = async () => {
    if (!customUrlInput.trim()) return;
    try {
      setIsLinking(true);
      setStatusMessage(null);
      const token = await getAccessToken();
      if (!token) {
        await handleSignIn();
        return;
      }
      const linked = await linkExistingSpreadsheet(token, customUrlInput.trim());
      setSpreadsheetId(linked.id);
      setSpreadsheetUrl(linked.url);
      setCustomUrlInput('');
      setStatusMessage({
        type: 'success',
        text: `¡Hoja de cálculo vinculada exitosamente!`
      });
      const fetched = await fetchApprenticeRecords(token, linked.id);
      setRecords(fetched);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'No se pudo vincular la hoja especificada.'
      });
    } finally {
      setIsLinking(false);
    }
  };

  // Explicit confirmation before mutating user data in Google Sheets
  const promptSync = () => {
    if (!currentUser) {
      handleSignIn();
      return;
    }
    setShowConfirmDialog(true);
  };

  const executeSync = async () => {
    setShowConfirmDialog(false);
    try {
      setIsSyncing(true);
      setStatusMessage(null);

      const result = await syncApprenticeToGoogleSheets({
        apprentice,
        score: quizScore,
        quizPassed,
        certificateCode,
        completionDate,
        userEmail: currentUser?.email || ''
      });

      setSpreadsheetUrl(result.spreadsheetUrl);
      localStorage.setItem('sena_sheets_url', result.spreadsheetUrl);

      setStatusMessage({
        type: 'success',
        text: result.isNewRecord
          ? `¡Aprendiz registrado con éxito en Google Sheets!`
          : `¡Registro del aprendiz actualizado correctamente en Google Sheets!`
      });

      // Reload rows
      const token = await getAccessToken();
      if (token && spreadsheetId) {
        const fetched = await fetchApprenticeRecords(token, spreadsheetId);
        setRecords(fetched);
      } else {
        await loadSpreadsheetData();
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Ocurrió un error al guardar en la hoja de cálculo.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  const filteredRecords = records.filter(r => 
    r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.documentNumber.includes(searchTerm) ||
    r.fichaNumber.includes(searchTerm) ||
    r.certificateCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-[#39A900] flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                  Almacenamiento en Google Drive & Sheets
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#39A900]/15 text-[#2e8500] dark:text-[#6ee236]">
                  Acuerdo 0009 de 2024
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Centraliza y respalda automáticamente los registros de inducción en tu cuenta de Google.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200">
          
          {/* Status Alert if any */}
          {statusMessage && (
            <div className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                : statusMessage.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
            }`}>
              <div className="flex items-start gap-3">
                {statusMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />}
                {statusMessage.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />}
                {statusMessage.type === 'info' && <AlertCircle className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />}
                <div className="flex-1 font-medium">{statusMessage.text}</div>
              </div>
              {(statusMessage.text.toLowerCase().includes('insufficient') ||
                statusMessage.text.toLowerCase().includes('permiso') ||
                statusMessage.text.toLowerCase().includes('scopes')) && (
                <button
                  onClick={handleReauthenticate}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-[#39A900] hover:bg-[#329400] text-white shadow-xs cursor-pointer whitespace-nowrap transition-all self-end sm:self-center"
                >
                  {isLoading ? 'Abriendo Google...' : 'Conceder Permisos de Google Sheets'}
                </button>
              )}
              {statusMessage.text.includes('cerró antes de') && (
                <button
                  onClick={currentUser ? handleReauthenticate : handleSignIn}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-[#00324d] hover:bg-[#002235] text-white shadow-xs cursor-pointer whitespace-nowrap transition-all self-end sm:self-center"
                >
                  {isLoading ? 'Abriendo...' : 'Reintentar Ahora'}
                </button>
              )}
            </div>
          )}

          {/* Authentication Banner */}
          {!currentUser ? (
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center">
                <FolderOpen className="w-7 h-7 text-[#00324d] dark:text-blue-400" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Conecta tu cuenta de Google
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  La plataforma creará una hoja de cálculo estructurada con formato oficial SENA titulada 
                  <strong className="block text-slate-800 dark:text-slate-200 mt-1">"{SPREADSHEET_TITLE}"</strong> 
                  en tu unidad de Google Drive para consolidar todos los aprendices.
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium pt-1">
                  Nota: Recuerda marcar la casilla de permisos para Google Sheets cuando se abra la ventana de Google.
                </p>
              </div>

              {/* Official Google Sign-In Styled Button */}
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="inline-flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 rounded-xl border border-slate-300 shadow-xs hover:shadow-sm transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isLoading ? 'Conectando con Google...' : 'Iniciar Sesión con Google'}</span>
              </button>
            </div>
          ) : (
            /* User Info & Sheet Status Bar */
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'Google User'} 
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#00324d] text-white flex items-center justify-center font-bold text-sm">
                    {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'G'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {currentUser.displayName || 'Usuario Google'}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                      Conectado
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate max-w-[240px]">
                    {currentUser.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                {spreadsheetUrl && (
                  <a
                    href={spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 shadow-2xs transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#39A900]" />
                    <span>Abrir en Drive</span>
                  </a>
                )}
                <button
                  onClick={handleReauthenticate}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 shadow-2xs transition-all cursor-pointer"
                  title="Reconectar y otorgar permisos de Google Sheets"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#39A900] ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Actualizar Permisos</span>
                </button>
                <button
                  onClick={loadSpreadsheetData}
                  disabled={isLoading}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Actualizar datos desde Google Sheets"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Cerrar sesión de Google"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Prominent Spreadsheet Direct Link & Location Card */}
          {currentUser && (
            <div className="bg-white dark:bg-slate-800/90 border-2 border-emerald-500/30 dark:border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#39A900]/15 text-[#39A900] flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Enlace Directo de la Hoja de Cálculo en Google Drive
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Archivo: <strong className="text-slate-800 dark:text-slate-200">"{SPREADSHEET_TITLE}"</strong>
                    </p>
                  </div>
                </div>

                {spreadsheetUrl && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 self-start sm:self-auto flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Sincronizada en Google Drive
                  </span>
                )}
              </div>

              {spreadsheetUrl ? (
                <div className="space-y-2 pt-1">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        readOnly
                        value={spreadsheetUrl}
                        className="w-full text-xs font-mono px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 select-all pr-8"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(spreadsheetUrl)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs"
                        title="Copiar URL al portapapeles"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? '¡Copiado!' : 'Copiar Enlace'}</span>
                      </button>
                      <a
                        href={spreadsheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#39A900] hover:bg-[#329400] shadow-2xs transition-all whitespace-nowrap cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Abrir en Google Sheets</span>
                      </a>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Puedes abrir este enlace en cualquier momento desde tu navegador para auditar o descargar la lista oficial de aprendices.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-750 rounded-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                        Opción 1: Crear Hoja Oficial Automática
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Crea una nueva hoja con encabezados institucionales SENA en tu Google Drive.
                      </p>
                    </div>
                    <button
                      onClick={handleCreateSpreadsheetNow}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#39A900] text-white hover:bg-[#329400] shadow-xs whitespace-nowrap cursor-pointer disabled:opacity-50"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>{isLoading ? 'Creando...' : 'Crear Hoja en Google Drive'}</span>
                    </button>
                  </div>

                  <div>
                    <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">
                      Opción 2: Vincular Hoja de Cálculo Existente
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                      Si ya tienes una hoja de cálculo en tu Drive, pega aquí su enlace o ID:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                        className="flex-1 text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-[#39A900]"
                      />
                      <button
                        onClick={handleLinkCustomSpreadsheet}
                        disabled={isLinking || !customUrlInput.trim()}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 disabled:opacity-50 transition-all cursor-pointer"
                      >
                        {isLinking ? 'Vinculando...' : 'Vincular'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Current Apprentice Sync Card */}
          <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-[#39A900]/30 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#39A900]">
                  Datos a Sincronizar
                </span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {apprentice.fullName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {apprentice.documentType} {apprentice.documentNumber} • Ficha {apprentice.fichaNumber}
                </p>
              </div>

              <button
                onClick={promptSync}
                disabled={isSyncing}
                className="inline-flex items-center justify-center gap-2 bg-[#39A900] hover:bg-[#329400] text-white font-bold px-5 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-50"
              >
                <CloudUpload className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                <span>{isSyncing ? 'Sincronizando...' : 'Guardar en Google Sheets'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-500/20 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Programa:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">{apprentice.programName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Puntaje Inducción:</span>
                <span className="font-bold text-[#39A900]">{quizScore}% {quizPassed ? '(Aprobado)' : '(En curso)'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Código Certificado:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px] truncate block">{certificateCode}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Fecha Expedición:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{completionDate || 'No expedido aún'}</span>
              </div>
            </div>
          </div>

          {/* Live Preview of Registered Apprentices in Google Sheets */}
          {currentUser && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-500" />
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Registros en Google Sheets ({records.length})
                  </h5>
                </div>

                {records.length > 0 && (
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nombre, documento o ficha..."
                      className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 w-full sm:w-64 focus:ring-1 focus:ring-[#39A900]"
                    />
                  </div>
                )}
              </div>

              {records.length === 0 ? (
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  Aún no hay registros en la hoja de Google Sheets. Haz clic en "Guardar en Google Sheets" para registrar al primer aprendiz.
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden overflow-x-auto shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#00324d] text-white">
                      <tr>
                        <th className="p-2.5 font-bold">Fecha</th>
                        <th className="p-2.5 font-bold">Documento</th>
                        <th className="p-2.5 font-bold">Nombre Completo</th>
                        <th className="p-2.5 font-bold">Ficha</th>
                        <th className="p-2.5 font-bold">Calificación</th>
                        <th className="p-2.5 font-bold">Estado</th>
                        <th className="p-2.5 font-bold">Certificado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/60">
                      {filteredRecords.map((r, idx) => {
                        const isCurrent = r.documentNumber.trim() === apprentice.documentNumber.trim();
                        return (
                          <tr key={idx} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                            isCurrent ? 'bg-emerald-50/60 dark:bg-emerald-950/20 font-medium' : ''
                          }`}>
                            <td className="p-2.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{r.timestamp}</td>
                            <td className="p-2.5 whitespace-nowrap font-mono">{r.documentType} {r.documentNumber}</td>
                            <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-100">
                              <div className="flex items-center gap-1.5">
                                <span>{r.fullName}</span>
                                {isCurrent && (
                                  <span className="text-[9px] bg-[#39A900] text-white px-1.5 py-0.2 rounded-full font-bold">
                                    Actual
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-2.5 whitespace-nowrap font-mono">{r.fichaNumber}</td>
                            <td className="p-2.5 font-bold text-[#39A900]">{r.score}</td>
                            <td className="p-2.5 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                r.status.includes('Aprobado') 
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                              }`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="p-2.5 font-mono text-[10px] text-slate-600 dark:text-slate-400 whitespace-nowrap">{r.certificateCode}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/60">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#39A900]"></span>
            <span>Google Drive API v3 • Google Sheets API v4</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>

      {/* Mandatory User Confirmation Dialog before mutating Workspace data */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#39A900] flex items-center justify-center mx-auto">
              <CloudUpload className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                ¿Confirmar registro en Google Sheets?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Se guardará o actualizará la información del aprendiz <strong>{apprentice.fullName}</strong> ({apprentice.documentType} {apprentice.documentNumber}, Ficha {apprentice.fichaNumber}) en la hoja de cálculo <em>"{SPREADSHEET_TITLE}"</em> de tu Google Drive.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={executeSync}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#39A900] hover:bg-[#329400] shadow-xs transition-all"
              >
                Sí, Registrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
