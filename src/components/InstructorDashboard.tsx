import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Award, 
  TrendingUp, 
  Search, 
  Download, 
  FileSpreadsheet, 
  ExternalLink, 
  RefreshCw, 
  Share2, 
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Filter,
  Eye,
  Send,
  CloudUpload
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  getStoredApprentices, 
  deleteApprenticeFromRegistry, 
  exportApprenticesToCsv 
} from '../services/apprenticeRegistry';
import { 
  SpreadsheetRecord, 
  SPREADSHEET_TITLE,
  syncApprenticeToGoogleSheets,
  getOrCreateSpreadsheet
} from '../services/googleSheetsService';
import { getAccessToken } from '../services/googleAuth';
import { CertificateView } from './CertificateView';
import { ApprenticeInfo } from '../types';

interface InstructorDashboardProps {
  onBackToApprenticeView: () => void;
  currentUser: User | null;
  onOpenDriveModal: () => void;
  onReturnToLanding?: () => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  onBackToApprenticeView,
  currentUser,
  onOpenDriveModal,
  onReturnToLanding
}) => {
  const [records, setRecords] = useState<SpreadsheetRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'in_progress'>('all');
  const [selectedFicha, setSelectedFicha] = useState<string>('all');
  
  // Link Generator State
  const [generatorFicha, setGeneratorFicha] = useState('2894520');
  const [generatorProgram, setGeneratorProgram] = useState('Tecnólogo en Análisis y Desarrollo de Software');
  const [isCopiedLink, setIsCopiedLink] = useState(false);

  // Sync state
  const [isBatchSyncing, setIsBatchSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Preview certificate
  const [previewApprentice, setPreviewApprentice] = useState<SpreadsheetRecord | null>(null);

  // Spreadsheet URL from storage
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('sena_sheets_url') : null;
  });

  const loadData = () => {
    const list = getStoredApprentices();
    setRecords(list);
    const savedUrl = localStorage.getItem('sena_sheets_url');
    if (savedUrl) setSpreadsheetUrl(savedUrl);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sena_apprentice_updated', handleUpdate);
    return () => window.removeEventListener('sena_apprentice_updated', handleUpdate);
  }, []);

  // Compute metrics
  const totalCount = records.length;
  const approvedCount = records.filter(r => r.status.toLowerCase().includes('aprobado')).length;
  const passRate = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;
  
  const avgScore = totalCount > 0 
    ? Math.round(
        records.reduce((acc, curr) => {
          const num = parseInt(curr.score.replace('%', ''), 10) || 0;
          return acc + num;
        }, 0) / totalCount
      )
    : 0;

  // Extract unique fichas
  const uniqueFichas = Array.from(new Set(records.map(r => r.fichaNumber).filter(Boolean)));

  // Filtered records
  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.documentNumber.includes(searchTerm) ||
      r.fichaNumber.includes(searchTerm) ||
      r.certificateCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'approved' ? r.status.toLowerCase().includes('aprobado') :
      !r.status.toLowerCase().includes('aprobado');

    const matchesFicha = selectedFicha === 'all' || r.fichaNumber === selectedFicha;

    return matchesSearch && matchesStatus && matchesFicha;
  });

  // Generate shareable link
  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const shareableUrl = `${baseUrl}?role=aprendiz&ficha=${encodeURIComponent(generatorFicha.trim())}${
    generatorProgram.trim() ? `&programa=${encodeURIComponent(generatorProgram.trim())}` : ''
  }`;

  const handleCopyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl);
      setIsCopiedLink(true);
      setTimeout(() => setIsCopiedLink(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `¡Hola aprendices! Por favor ingresen al siguiente enlace institucional para realizar la Inducción al Reglamento del Aprendiz SENA (Acuerdo 0009 de 2024) para la Ficha ${generatorFicha}: ${shareableUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDeleteRecord = (docNumber: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el registro del aprendiz "${name}" (${docNumber})?`)) {
      deleteApprenticeFromRegistry(docNumber);
      loadData();
    }
  };

  // Push all stored records to Google Sheets
  const handleBatchSyncToGoogleSheets = async () => {
    try {
      setIsBatchSyncing(true);
      setSyncFeedback(null);
      const token = await getAccessToken();
      if (!token) {
        onOpenDriveModal();
        return;
      }

      // Ensure sheet exists
      const sheet = await getOrCreateSpreadsheet(token);
      setSpreadsheetUrl(sheet.url);
      localStorage.setItem('sena_sheets_url', sheet.url);

      // Sync each record
      let syncedCount = 0;
      for (const rec of records) {
        const apprenticeData: ApprenticeInfo = {
          fullName: rec.fullName,
          documentType: (rec.documentType as any) || 'C.C.',
          documentNumber: rec.documentNumber,
          programName: rec.programName,
          fichaNumber: rec.fichaNumber,
          regional: rec.regional,
          centerName: rec.centerName
        };

        const numericScore = parseInt(rec.score.replace('%', ''), 10) || 80;
        await syncApprenticeToGoogleSheets({
          apprentice: apprenticeData,
          score: numericScore,
          quizPassed: rec.status.toLowerCase().includes('aprobado'),
          certificateCode: rec.certificateCode,
          completionDate: rec.completionDate,
          userEmail: currentUser?.email || ''
        });
        syncedCount++;
      }

      setSyncFeedback({
        type: 'success',
        message: `¡${syncedCount} registro(s) sincronizados con éxito en Google Sheets!`
      });
    } catch (err: any) {
      setSyncFeedback({
        type: 'error',
        message: err.message || 'Error al sincronizar con Google Sheets'
      });
    } finally {
      setIsBatchSyncing(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner Navigation */}
      <div className="bg-[#00324d] text-white rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#39A900] text-white text-[10px] font-black uppercase tracking-wider">
              Consola del Instructor
            </span>
            <span className="text-xs text-slate-300">
              Acuerdo 0009 de 2024
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Seguimiento y Gestión de Inducción SENA
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Monitorea el avance de tus aprendices, genera enlaces personalizados con ficha precargada y centraliza el respaldo oficial en Google Drive y Google Sheets.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap relative z-10">
          <button
            onClick={onBackToApprenticeView}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/20 cursor-pointer"
            title="Ver la plataforma tal como la ven los estudiantes"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Vista del Aprendiz</span>
          </button>

          {onReturnToLanding && (
            <button
              onClick={onReturnToLanding}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all border border-white/20 cursor-pointer"
              title="Volver a la pantalla de selección de rol"
            >
              <span>Cambiar Rol</span>
            </button>
          )}
          
          <button
            onClick={onOpenDriveModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#39A900] hover:bg-[#329400] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Configurar Google Sheets</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Evaluados</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Aprendices registrados
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Tasa Aprobación</span>
            <Award className="w-4 h-4 text-[#39A900]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#39A900] font-mono tabular-nums">
            {passRate}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {approvedCount} de {totalCount} certificados
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Promedio General</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            {avgScore}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Puntaje medio en evaluación
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Fichas Activas</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            {uniqueFichas.length || 1}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {uniqueFichas.slice(0, 2).join(', ') || 'Ficha única'}
          </div>
        </div>
      </div>

      {/* Sync Feedback Toast if any */}
      {syncFeedback && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm ${
          syncFeedback.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
        }`}>
          {syncFeedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
          <span className="font-semibold">{syncFeedback.message}</span>
        </div>
      )}

      {/* Two-Column Section: Share Link Generator & Google Sheets Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Link Generator Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                Generador de Enlaces para Aprendices
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Los aprendices recibirán la ficha precargada sin botones de instructor.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Número de Ficha:
              </label>
              <input
                type="text"
                value={generatorFicha}
                onChange={(e) => setGeneratorFicha(e.target.value)}
                placeholder="Ej: 2894520"
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-1 focus:ring-[#39A900] text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Programa de Formación:
              </label>
              <input
                type="text"
                value={generatorProgram}
                onChange={(e) => setGeneratorProgram(e.target.value)}
                placeholder="Nombre del programa"
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-1 focus:ring-[#39A900] text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3.5 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Enlace Listo para Compartir:
            </span>
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className="w-full text-[11px] font-mono px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 select-all"
            />
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <button
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#00324d] hover:bg-[#00253a] text-white shadow-2xs transition-all cursor-pointer"
              >
                {isCopiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar por WhatsApp</span>
              </button>
              <a
                href={shareableUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all ml-auto"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Vista Previa</span>
              </a>
            </div>
          </div>
        </div>

        {/* Google Sheets Cloud Backup Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#39A900] flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                  Google Drive & Hojas de Cálculo
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentUser ? `Conectado como ${currentUser.email}` : 'Sesión de Google no iniciada'}
                </p>
              </div>
            </div>

            {spreadsheetUrl && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Drive Vinculado
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              La plataforma consolida los registros en tu Google Drive bajo la hoja oficial 
              <strong className="text-slate-900 dark:text-white block mt-0.5">"{SPREADSHEET_TITLE}"</strong>.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2 flex-wrap">
            {spreadsheetUrl ? (
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#39A900] hover:bg-[#329400] shadow-xs transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir Hoja en Drive</span>
              </a>
            ) : null}

            <button
              onClick={handleBatchSyncToGoogleSheets}
              disabled={isBatchSyncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <CloudUpload className={`w-4 h-4 text-[#39A900] ${isBatchSyncing ? 'animate-bounce' : ''}`} />
              <span>{isBatchSyncing ? 'Sincronizando...' : 'Sincronizar a Google Sheets'}</span>
            </button>

            <button
              onClick={onOpenDriveModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all ml-auto"
            >
              <span>Ajustes Drive</span>
            </button>
          </div>
        </div>

      </div>

      {/* Main Apprentice Audit Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
        
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#39A900]" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Aprendices Registrados ({filteredRecords.length})
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, documento..."
                className="text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 w-full sm:w-60 focus:ring-1 focus:ring-[#39A900]"
              />
            </div>

            {/* Ficha filter */}
            {uniqueFichas.length > 1 && (
              <select
                value={selectedFicha}
                onChange={(e) => setSelectedFicha(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-[#39A900]"
              >
                <option value="all">Todas las Fichas</option>
                {uniqueFichas.map(f => (
                  <option key={f} value={f}>Ficha {f}</option>
                ))}
              </select>
            )}

            {/* Status Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  statusFilter === 'approved'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Aprobados
              </button>
            </div>

            {/* Export CSV button */}
            <button
              onClick={() => exportApprenticesToCsv(filteredRecords)}
              disabled={filteredRecords.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#00324d] hover:bg-[#00253a] text-white shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              title="Descargar lista completa en Excel / CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        {filteredRecords.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-400" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No se encontraron registros
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {searchTerm 
                ? 'Ningún aprendiz coincide con el criterio de búsqueda.' 
                : 'Aún no hay aprendices registrados. Comparte el enlace de la ficha para comenzar.'}
            </p>
          </div>
        ) : (
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#00324d] text-white">
                <tr>
                  <th className="p-3 font-bold">Fecha</th>
                  <th className="p-3 font-bold">Documento</th>
                  <th className="p-3 font-bold">Aprendiz</th>
                  <th className="p-3 font-bold">No. Ficha</th>
                  <th className="p-3 font-bold">Calificación</th>
                  <th className="p-3 font-bold">Estado</th>
                  <th className="p-3 font-bold">Código Certificado</th>
                  <th className="p-3 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/60">
                {filteredRecords.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono">
                      {r.timestamp}
                    </td>
                    <td className="p-3 whitespace-nowrap font-mono font-medium">
                      {r.documentType} {r.documentNumber}
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      <div>
                        <span>{r.fullName}</span>
                        <span className="block text-[10px] text-slate-400 font-normal truncate max-w-[200px]">
                          {r.programName}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap font-mono font-bold text-slate-700 dark:text-slate-300">
                      {r.fichaNumber}
                    </td>
                    <td className="p-3 font-bold text-[#39A900] whitespace-nowrap font-mono tabular-nums">
                      {r.score}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        r.status.toLowerCase().includes('aprobado')
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {r.certificateCode}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => setPreviewApprentice(r)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                        title="Ver certificado del aprendiz"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(r.documentNumber, r.fullName)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Certificate Preview Modal */}
      {previewApprentice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#39A900]" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Certificado de {previewApprentice.fullName}
                </h3>
              </div>
              <button
                onClick={() => setPreviewApprentice(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cerrar Vista Previa
              </button>
            </div>

            <CertificateView
              apprentice={{
                fullName: previewApprentice.fullName,
                documentType: (previewApprentice.documentType as any) || 'C.C.',
                documentNumber: previewApprentice.documentNumber,
                programName: previewApprentice.programName,
                fichaNumber: previewApprentice.fichaNumber,
                regional: previewApprentice.regional,
                centerName: previewApprentice.centerName
              }}
              quizPassed={previewApprentice.status.toLowerCase().includes('aprobado')}
              score={parseInt(previewApprentice.score.replace('%', ''), 10) || 100}
              certificateCode={previewApprentice.certificateCode}
              completionDate={previewApprentice.completionDate}
              onOpenProfile={() => {}}
              onNavigateToQuiz={() => {}}
              isInstructorView={true}
            />
          </div>
        </div>
      )}

    </div>
  );
};
