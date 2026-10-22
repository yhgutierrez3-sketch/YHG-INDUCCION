import React, { useRef } from 'react';
import { 
  Award, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Lock, 
  Edit3, 
  Download, 
  QrCode, 
  Calendar, 
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  ExternalLink
} from 'lucide-react';
import { ApprenticeInfo } from '../types';

interface CertificateViewProps {
  apprentice: ApprenticeInfo;
  quizPassed: boolean;
  score: number;
  certificateCode: string;
  completionDate: string | null;
  onOpenProfile: () => void;
  onNavigateToQuiz: () => void;
  onOpenDriveSync?: () => void;
  isInstructorView?: boolean;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  apprentice,
  quizPassed,
  score,
  certificateCode,
  completionDate,
  onOpenProfile,
  onNavigateToQuiz,
  onOpenDriveSync,
  isInstructorView = false
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `¡Completé exitosamente la Inducción al Reglamento del Aprendiz SENA (Acuerdo 0009 de 2024) con puntaje de ${score}%! Código de verificación: ${certificateCode}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('¡Información copiada al portapapeles! Puedes compartir tu logro.');
    }
  };

  const formattedDate = completionDate || new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const savedSheetsUrl = typeof window !== 'undefined' ? localStorage.getItem('sena_sheets_url') : null;

  if (!quizPassed) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center space-y-6">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm space-y-5 backdrop-blur-xs">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Lock className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Certificado Bloqueado
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Aún no has aprobado la Evaluación de Inducción
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
              Para expedir tu Certificado Oficial de Inducción al Reglamento del Aprendiz SENA (Acuerdo 0009 de 2024), 
              debes presentar la trivia y obtener un puntaje igual o superior al <strong>80%</strong>.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onNavigateToQuiz}
              className="inline-flex items-center gap-2 bg-[#39A900] hover:bg-[#329400] text-white font-bold px-6 py-3 rounded-xl shadow-xs transition-all text-sm"
            >
              <Award className="w-5 h-5" />
              <span>Ir a la Evaluación Gamificada</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Action Toolbar */}
      <div className="no-print bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Certificado Aprobado y Válido
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Certificado Oficial de Inducción SENA
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Acreditado con éxito para la etapa lectiva de tu ficha de formación.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={onOpenProfile}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all"
            title="Verificar o corregir nombres y ficha"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar Datos</span>
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartir</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#39A900] hover:bg-[#329400] shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar en PDF</span>
          </button>
        </div>
      </div>

      {/* For Aprendices: Clean Confirmation without Confusing Google Buttons */}
      {!isInstructorView ? (
        <div className="no-print bg-emerald-50/70 dark:bg-emerald-950/30 border border-[#39A900]/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#39A900]/15 text-[#39A900] flex items-center justify-center shadow-xs flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Registro Institucional Oficial y Respaldado
                </h3>
                <span className="text-[10px] font-semibold bg-[#39A900]/15 text-[#2e8500] dark:text-[#6ee236] px-2 py-0.5 rounded-full">
                  Ficha {apprentice.fichaNumber}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Tus resultados de inducción y código de certificado han sido registrados exitosamente en el sistema institucional.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 whitespace-nowrap hidden sm:inline">
            Aprobado y Registrado
          </span>
        </div>
      ) : (
        /* Instructor View: Google Drive & Sheets Backup Notification Banner */
        <div className="no-print bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-[#39A900]/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-[#39A900] flex items-center justify-center shadow-xs flex-shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Registro y Respaldo en Google Drive (Hojas de Cálculo)
                </h3>
                <span className="text-[10px] font-semibold bg-[#39A900]/15 text-[#2e8500] dark:text-[#6ee236] px-2 py-0.5 rounded-full">
                  Consola Instructor
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Guarda automáticamente los datos del aprendiz ({apprentice.fullName}, Ficha {apprentice.fichaNumber}) y el resultado de la inducción en la hoja oficial en Google Drive.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {savedSheetsUrl && (
              <a
                href={savedSheetsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 shadow-2xs transition-all whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#39A900]" />
                <span>Abrir Hoja en Drive</span>
              </a>
            )}
            {onOpenDriveSync && (
              <button
                onClick={onOpenDriveSync}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#39A900] hover:bg-[#329400] shadow-xs transition-all whitespace-nowrap cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{savedSheetsUrl ? 'Ver o Guardar en Sheets' : 'Almacenar en Google Sheets'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* The Printable Official SENA Certificate */}
      <div 
        ref={certificateRef}
        className="certificate-print-container bg-white border-8 border-double border-[#00324d] rounded-2xl p-8 sm:p-14 shadow-md relative overflow-hidden text-slate-800"
      >
        {/* Subtle Ornamental Background Guilloche Border */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-[800px] h-[800px] fill-current text-[#00324d]">
            <circle cx="50" cy="22" r="10" />
            <path d="M50 38 L32 58 L42 58 L42 85 L58 85 L58 58 L68 58 Z" />
          </svg>
        </div>

        {/* Certificate Header */}
        <div className="relative z-10 text-center space-y-2 border-b-2 border-slate-200 pb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            {/* SENA Official Emblem */}
            <div className="w-18 h-18 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
              <img 
                src="data:image/svg+xml,%3c?xml%20version=%271.0%27%20encoding=%27utf-8%27?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2026.0.1,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version=%271.1%27%20id=%27Capa_1%27%20xmlns=%27http://www.w3.org/2000/svg%27%20xmlns:xlink=%27http://www.w3.org/1999/xlink%27%20x=%270px%27%20y=%270px%27%20viewBox=%270%200%201000%201000%27%20style=%27enable-background:new%200%200%201000%201000;%27%20xml:space=%27preserve%27%3e%3cstyle%20type=%27text/css%27%3e%20.st0{fill:%2339a900;}%20%3c/style%3e%3cpath%20id=%27path47-5%27%20class=%27st0%27%20d=%27M504.2,20.5c-58.3,0.1-105.6,47.4-105.5,105.8c0.1,58.3,47.4,105.6,105.7,105.6%20c58.3,0,105.6-47.3,105.6-105.7V126C609.9,67.6,562.6,20.4,504.2,20.5z%20M155.6,264.6c-18.6,0.1-37.5,1.1-55.2,5.6%20c-11.7,3-23,7.8-30.3,15.4c-9.2,9.5-10.4,22.3-5.9,33.3c4,9.7,14.8,16.9,26.8,21.1c25.9,8.9,54.6,10.7,81.8,16.3%20c5,1.2,10.6,2.6,13.7,6c3.2,4.1,1.3,9.7-4,12.2c-8.8,4.5-20.1,4.5-30.4,4.4c-9.4-0.4-19.7-1.2-27.2-5.9c-5.5-3.4-6.5-9.1-5.2-14.1%20l-60.6,0c-0.2,9.2,1.6,18.9,8.4,26.8c5.6,6.8,14.8,11.5,24.6,14.4c15.7,4.6,32.7,6,49.4,6.4c22.7,0.4,45.8-0.3,67.6-5.4%20c13-3.2,25.8-8.3,34.1-16.6c14.8-14.8,11.3-38.3-8.3-49.8c-9.8-5.7-21.5-9.2-33.4-11.5c-17.5-3.6-35.3-6.3-52.9-9.2%20c-6.2-1.2-12.8-2.3-18-5.2c-5.5-2.9-5.9-9.8-0.3-12.9c7.2-4.1,16.8-4,25.4-4c9.1,0.2,19,0.7,26.5,5c4.2,2.3,5.9,6.3,5.9,10.1%20l57.6-0.1c-0.2-7.3-1.6-14.9-6.9-21.2c-6.2-7.8-17.1-12.7-28.3-15.5C192.8,265.6,174.1,264.7,155.6,264.6L155.6,264.6z%20M280.6,268.9%20l0,137.7l168.1,0l0-30H342.3v-26.7h94.9v-29.3h-94.9l0-21.9l102.6,0l-0.1-29.7L280.6,268.9z%20M557.5,269c0,0-51.9,0-77.9,0l0,137.7%20l59,0l0-92.7l80.8,92.6l81,0.1l0-137.7l-59.1,0l0.1,92L557.5,269z%20M805.6,269.2c0,0-63.6,91.9-95.6,137.7l61.9,0l14.9-24.8h95.7%20l13.9,24.9l68.8,0L874,269.2L805.6,269.2z%20M836.6,302.1l29.4,49.9l-60.7,0.1L836.6,302.1z%20M10.6,445.6l0.5,75l280.1-1%20c14.3,3.1,22.6,12.4,19.7,33.5L138.6,854.7l56.1,52.5l266.9-461.6L10.6,445.6z%20M545.2,446.2l262.4,459.6l58-52.1L691.3,552.9%20c-2.9-21.2,5.4-30.6,19.7-33.7l280.2,1l-0.1-73.7L545.2,446.2z%20M500.9,522.3L254.8,944.7l65.4,31.9L484.4,699%20c5.7-4.6,11.4-7.1,17.1-7.3c6-0.2,12.2,2,18.3,6.8l163.8,278.4l67.4-35.2L500.9,522.3z%27/%3e%3cg%20id=%27_x23_000000ff-2%27%20transform=%27matrix(0.31570611,0,0,0.23560774,-391.49698,-10.601126)%27%3e%3c/g%3e%3c/svg%3e" 
                alt="Logo Oficial SENA" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-black tracking-widest text-slate-600 uppercase">
              República de Colombia • Ministerio del Trabajo
            </h4>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#00324d]">
              SERVICIO NACIONAL DE APRENDIZAJE • SENA
            </h1>
            <p className="text-xs font-semibold text-[#39A900] uppercase tracking-wider">
              Dirección de Formación Profesional Integral
            </p>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="relative z-10 text-center py-8 space-y-6">
          <div>
            <span className="font-certificate-title text-sm tracking-widest text-slate-500 uppercase font-semibold">
              Certifica que:
            </span>
            <div className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2 font-serif uppercase">
              {apprentice.fullName}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              Identificado(a) con {apprentice.documentType} No. <span className="font-bold text-slate-900">{apprentice.documentNumber}</span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Ha culminado y aprobado satisfactoriamente todos los módulos del proceso institucional de inducción y apropiación formativa del:
            </p>

            <div className="bg-emerald-50/70 border-y-2 border-[#39A900] py-3.5 px-6 rounded-lg">
              <h2 className="text-base sm:text-xl font-black text-[#00324d] tracking-tight uppercase">
                Reglamento del Aprendiz SENA
              </h2>
              <p className="text-xs font-bold text-[#39A900] mt-0.5 uppercase tracking-wide">
                Acuerdo No. 0009 del 21 de Noviembre de 2024
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              Habiendo demostrado comprensión integral de sus <strong>Derechos</strong>, cumplimiento de sus <strong>Deberes</strong>, 
              prohibiciones, medidas formativas, trámites de novedades académicas y compromiso ético con la comunidad educativa.
            </p>
          </div>

          {/* Academic Records Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-left text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Programa Formativo:</span>
              <span className="font-bold text-slate-800 line-clamp-2">{apprentice.programName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Ficha de Caracterización:</span>
              <span className="font-bold text-slate-800">{apprentice.fichaNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Regional y Centro:</span>
              <span className="font-bold text-slate-800 line-clamp-2">{apprentice.regional}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Calificación Obtenida:</span>
              <span className="font-extrabold text-[#39A900] text-sm">{score}% (Aprobado)</span>
            </div>
          </div>
        </div>

        {/* Certificate Signatures & Verification */}
        <div className="relative z-10 border-t-2 border-slate-200 pt-8 mt-4 grid sm:grid-cols-3 gap-6 items-end">
          {/* Signature 1 */}
          <div className="text-center space-y-1">
            <div className="h-10 flex items-center justify-center">
              <span className="font-serif italic text-lg text-slate-700 tracking-wider">
                Jorge A. Ramirez V.
              </span>
            </div>
            <div className="border-t border-slate-400 w-44 mx-auto pt-1">
              <p className="text-xs font-bold text-slate-800">Subdirector(a) de Centro</p>
              <p className="text-[10px] text-slate-500">{apprentice.centerName}</p>
            </div>
          </div>

          {/* Verification QR & Code */}
          <div className="text-center space-y-1.5 flex flex-col items-center">
            {/* Stylized QR Code */}
            <div className="w-18 h-18 p-1.5 bg-white border border-slate-300 rounded-lg shadow-2xs">
              <svg viewBox="0 0 24 24" className="w-full h-full fill-slate-800">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm8-2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm2-2h2v2h-2v-2zm-6 4h4v2h-4v-2zm4 2h4v2h-4v-2zm2-4h2v2h-2v-2z" />
              </svg>
            </div>
            <div className="text-[10px] text-slate-600">
              <span className="block font-mono font-bold text-slate-800 text-[9px]">{certificateCode}</span>
              <span className="text-[9px] text-slate-500 block">Expedición: {formattedDate}</span>
            </div>
          </div>

          {/* Signature 2 */}
          <div className="text-center space-y-1">
            <div className="h-10 flex items-center justify-center">
              <span className="font-serif italic text-lg text-slate-700 tracking-wider">
                Martha Elena Rincón
              </span>
            </div>
            <div className="border-t border-slate-400 w-44 mx-auto pt-1">
              <p className="text-xs font-bold text-slate-800">Coordinación Misional y Pedagógica</p>
              <p className="text-[10px] text-slate-500">Gestión de la Formación Profesional</p>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="relative z-10 text-center mt-6 text-[9px] text-slate-400">
          Este documento certifica la aprobación de la inducción formativa en cumplimiento del Sistema Integrado de Gestión y el Reglamento del Aprendiz SENA.
        </div>
      </div>
    </div>
  );
};
