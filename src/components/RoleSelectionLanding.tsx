import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  User as UserIcon, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  Award,
  Sun,
  Moon,
  Building,
  MapPin,
  Eye,
  EyeOff,
  Play
} from 'lucide-react';
import { ApprenticeInfo } from '../types';
import { googleSignIn } from '../services/googleAuth';
import { User } from 'firebase/auth';
import { VideoModal } from './VideoModal';

interface RoleSelectionLandingProps {
  onSelectAprendiz: (apprenticeData: ApprenticeInfo) => void;
  onSelectInstructor: (googleUser?: User | null) => void;
  initialApprenticeData: ApprenticeInfo;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  onSelectAprendiz,
  onSelectInstructor,
  initialApprenticeData,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [activeRoleTab, setActiveRoleTab] = useState<'aprendiz' | 'instructor'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('role') === 'instructor' ? 'instructor' : 'aprendiz';
    }
    return 'aprendiz';
  });

  // Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Aprendiz Form State
  const [formData, setFormData] = useState<ApprenticeInfo>({ ...initialApprenticeData });
  const [aprendizError, setAprendizError] = useState<string | null>(null);

  // Instructor Form State
  const [instructorPassword, setInstructorPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [instructorError, setInstructorError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Submit Aprendiz
  const handleAprendizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setAprendizError('Por favor ingresa tu nombre completo');
      return;
    }
    if (!formData.documentNumber.trim()) {
      setAprendizError('Por favor ingresa tu número de documento');
      return;
    }
    if (!formData.fichaNumber.trim()) {
      setAprendizError('Por favor ingresa tu número de ficha');
      return;
    }
    if (!formData.programName.trim()) {
      setAprendizError('Por favor ingresa el nombre de tu programa de formación');
      return;
    }

    setAprendizError(null);
    onSelectAprendiz(formData);
  };

  // Submit Instructor
  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInstructorError(null);
    const cleanedPassword = instructorPassword.trim();
    
    // Accepts Sena1234 (case tolerant to assist instructors, but standard is Sena1234)
    if (cleanedPassword === 'Sena1234' || cleanedPassword.toLowerCase() === 'sena1234') {
      sessionStorage.setItem('sena_instructor_auth', 'true');
      onSelectInstructor();
    } else {
      setInstructorError('Clave de acceso incorrecta. Por favor verifica e intenta de nuevo.');
    }
  };

  const handleGoogleAuthInstructor = async () => {
    try {
      setIsGoogleLoading(true);
      setInstructorError(null);
      const result = await googleSignIn(true);
      if (result) {
        sessionStorage.setItem('sena_instructor_auth', 'true');
        onSelectInstructor(result.user);
      }
    } catch (err: any) {
      if (!err.message?.includes('popup-closed-by-user')) {
        setInstructorError(err.message || 'Error al iniciar sesión con Google');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070e17] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Colombian / SENA Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FCD116] via-[#003893] to-[#CE1126] flex">
        <div className="h-full w-2/5 bg-[#FCD116]"></div>
        <div className="h-full w-1/5 bg-[#003893]"></div>
        <div className="h-full w-1/5 bg-[#CE1126]"></div>
        <div className="h-full w-1/5 bg-[#39A900]"></div>
      </div>

      {/* Header Bar */}
      <header className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3.5 px-4 sm:px-8 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center w-[64px] h-[64px] rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs ring-2 ring-[#39A900]/20 flex-shrink-0 p-1.5">
              <img 
                src="data:image/svg+xml,%3c?xml%20version=%271.0%27%20encoding=%27utf-8%27?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2026.0.1,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version=%271.1%27%20id=%27Capa_1%27%20xmlns=%27http://www.w3.org/2000/svg%27%20xmlns:xlink=%27http://www.w3.org/1999/xlink%27%20x=%270px%27%20y=%270px%27%20viewBox=%270%200%201000%201000%27%20style=%27enable-background:new%200%200%201000%201000;%27%20xml:space=%27preserve%27%3e%3cstyle%20type=%27text/css%27%3e%20.st0{fill:%2339a900;}%20%3c/style%3e%3cpath%20id=%27path47-5%27%20class=%27st0%27%20d=%27M504.2,20.5c-58.3,0.1-105.6,47.4-105.5,105.8c0.1,58.3,47.4,105.6,105.7,105.6%20c58.3,0,105.6-47.3,105.6-105.7V126C609.9,67.6,562.6,20.4,504.2,20.5z%20M155.6,264.6c-18.6,0.1-37.5,1.1-55.2,5.6%20c-11.7,3-23,7.8-30.3,15.4c-9.2,9.5-10.4,22.3-5.9,33.3c4,9.7,14.8,16.9,26.8,21.1c25.9,8.9,54.6,10.7,81.8,16.3%20c5,1.2,10.6,2.6,13.7,6c3.2,4.1,1.3,9.7-4,12.2c-8.8,4.5-20.1,4.5-30.4,4.4c-9.4-0.4-19.7-1.2-27.2-5.9c-5.5-3.4-6.5-9.1-5.2-14.1%20l-60.6,0c-0.2,9.2,1.6,18.9,8.4,26.8c5.6,6.8,14.8,11.5,24.6,14.4c15.7,4.6,32.7,6,49.4,6.4c22.7,0.4,45.8-0.3,67.6-5.4%20c13-3.2,25.8-8.3,34.1-16.6c14.8-14.8,11.3-38.3-8.3-49.8c-9.8-5.7-21.5-9.2-33.4-11.5c-17.5-3.6-35.3-6.3-52.9-9.2%20c-6.2-1.2-12.8-2.3-18-5.2c-5.5-2.9-5.9-9.8-0.3-12.9c7.2-4.1,16.8-4,25.4-4c9.1,0.2,19,0.7,26.5,5c4.2,2.3,5.9,6.3,5.9,10.1%20l57.6-0.1c-0.2-7.3-1.6-14.9-6.9-21.2c-6.2-7.8-17.1-12.7-28.3-15.5C192.8,265.6,174.1,264.7,155.6,264.6L155.6,264.6z%20M280.6,268.9%20l0,137.7l168.1,0l0-30H342.3v-26.7h94.9v-29.3h-94.9l0-21.9l102.6,0l-0.1-29.7L280.6,268.9z%20M557.5,269c0,0-51.9,0-77.9,0l0,137.7%20l59,0l0-92.7l80.8,92.6l81,0.1l0-137.7l-59.1,0l0.1,92L557.5,269z%20M805.6,269.2c0,0-63.6,91.9-95.6,137.7l61.9,0l14.9-24.8h95.7%20l13.9,24.9l68.8,0L874,269.2L805.6,269.2z%20M836.6,302.1l29.4,49.9l-60.7,0.1L836.6,302.1z%20M10.6,445.6l0.5,75l280.1-1%20c14.3,3.1,22.6,12.4,19.7,33.5L138.6,854.7l56.1,52.5l266.9-461.6L10.6,445.6z%20M545.2,446.2l262.4,459.6l58-52.1L691.3,552.9%20c-2.9-21.2,5.4-30.6,19.7-33.7l280.2,1l-0.1-73.7L545.2,446.2z%20M500.9,522.3L254.8,944.7l65.4,31.9L484.4,699%20c5.7-4.6,11.4-7.1,17.1-7.3c6-0.2,12.2,2,18.3,6.8l163.8,278.4l67.4-35.2L500.9,522.3z%27/%3e%3cg%20id=%27_x23_000000ff-2%27%20transform=%27matrix(0.31570611,0,0,0.23560774,-391.49698,-10.601126)%27%3e%3c/g%3e%3c/svg%3e" 
                alt="Logo SENA" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-[#00324d] dark:text-white">
                  SENA
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#39A900]/15 dark:bg-[#39A900]/25 text-[#2e8500] dark:text-[#6ee236]">
                  Acuerdo 0009 de 2024
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Inducción Integral al Reglamento Oficial del Aprendiz
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 transition-colors text-slate-700 dark:text-amber-400 cursor-pointer"
              title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Welcome & Role Selection Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Title Area */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <span className="text-xs font-black tracking-widest text-[#39A900] uppercase">
            Dirección de Formación Profesional Integral
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Portal de Acceso a la Inducción SENA
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Selecciona tu rol para ingresar al entorno correspondiente y acceder a las herramientas oficiales del Reglamento del Aprendiz.
          </p>
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-xs font-bold text-[#00324d] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Ver Tutorial de Inducción</span>
          </button>
        </div>

        {/* Role Toggle Selector */}
        <div className="max-w-md mx-auto w-full mb-6 p-1.5 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center shadow-inner">
          <button
            onClick={() => setActiveRoleTab('aprendiz')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeRoleTab === 'aprendiz'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm ring-2 ring-[#39A900]/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className={`w-4 h-4 ${activeRoleTab === 'aprendiz' ? 'text-[#39A900]' : ''}`} />
            <span>Soy Aprendiz</span>
          </button>

          <button
            onClick={() => setActiveRoleTab('instructor')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeRoleTab === 'instructor'
                ? 'bg-[#00324d] text-white shadow-sm ring-2 ring-blue-500/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${activeRoleTab === 'instructor' ? 'text-[#39A900]' : ''}`} />
            <span>Soy Instructor</span>
          </button>
        </div>

        <VideoModal 
          isOpen={isVideoModalOpen} 
          onClose={() => setIsVideoModalOpen(false)} 
          videoUrl="https://drive.google.com/file/d/1t_zY6G1nFpS_l8YQn1c7d235cQz44q5T/view"
        />

        {/* Main Interactive Card */}
        <div className="max-w-xl mx-auto w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-8">
          
          {/* TAB 1: APRENDIZ CHARACTERIZATION (NO PASSWORD REQUIRED) */}
          {activeRoleTab === 'aprendiz' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#39A900] flex items-center justify-center flex-shrink-0 shadow-xs border border-emerald-200 dark:border-emerald-800/60">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      Identificación del Aprendiz
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      Sin Clave
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Diligencia tus datos oficiales para expedir tu certificado institucional y registrar tu avance.
                  </p>
                </div>
              </div>

              {aprendizError && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl flex items-center gap-2.5 text-xs text-rose-800 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>{aprendizError}</span>
                </div>
              )}

              <form onSubmit={handleAprendizSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre Completo (tal como aparece en tu documento): *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ej: Juan Camilo Pérez Rodríguez"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  />
                </div>

                {/* Document Type & Number */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tipo Doc.:
                    </label>
                    <select
                      value={formData.documentType}
                      onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                      className="w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    >
                      <option value="C.C.">C.C. - Cédula</option>
                      <option value="T.I.">T.I. - Tarjeta de Identidad</option>
                      <option value="C.E.">C.E. - Cédula de Extranjería</option>
                      <option value="P.E.P.">P.E.P. - Permiso Especial</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Número de Documento: *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.documentNumber}
                      onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                      placeholder="Ej: 1023456789"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                  </div>
                </div>

                {/* Ficha & Program */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      No. Ficha: *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fichaNumber}
                      onChange={(e) => setFormData({ ...formData, fichaNumber: e.target.value })}
                      placeholder="Ej: 2894520"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Programa de Formación: *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.programName}
                      onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                      placeholder="Ej: Tecnólogo en Análisis y Desarrollo de Software"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                  </div>
                </div>

                {/* Regional & Center */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Regional SENA:
                    </label>
                    <input
                      type="text"
                      value={formData.regional}
                      onChange={(e) => setFormData({ ...formData, regional: e.target.value })}
                      placeholder="Ej: Regional Distrito Capital"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Centro de Formación:
                    </label>
                    <input
                      type="text"
                      value={formData.centerName}
                      onChange={(e) => setFormData({ ...formData, centerName: e.target.value })}
                      placeholder="Ej: Centro de Gestión de Mercados"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-[#39A900] hover:bg-[#329400] text-white font-extrabold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Comenzar mi Inducción SENA</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: INSTRUCTOR LOGIN */}
          {activeRoleTab === 'instructor' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-[#00324d] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <ShieldCheck className="w-6 h-6 text-[#39A900]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      Portal del Instructor
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                      Consola de Gestión
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Ingresa con la clave institucional para acceder al seguimiento de aprendices y sincronización con Google Drive.
                  </p>
                </div>
              </div>

              {instructorError && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl flex items-center gap-2.5 text-xs text-rose-800 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>{instructorError}</span>
                </div>
              )}

              <form onSubmit={handleInstructorSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Clave de Acceso del Instructor: *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoFocus
                      value={instructorPassword}
                      onChange={(e) => setInstructorPassword(e.target.value)}
                      placeholder="Ingresa tu clave de acceso"
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-[#00324d] hover:bg-[#002235] text-white font-extrabold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-5 h-5 text-[#39A900]" />
                    <span>Ingresar a la Consola del Instructor</span>
                  </button>
                </div>
              </form>

              <div className="relative flex items-center justify-center pt-2">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute">
                  O acceder con Google
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuthInstructor}
                disabled={isGoogleLoading}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isGoogleLoading ? 'Verificando...' : 'Iniciar Sesión con Google (Instructor)'}</span>
              </button>
            </div>
          )}

        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-10 text-xs">
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-1.5 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#39A900] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">Acuerdo 0009 de 2024</h4>
            <p className="text-slate-500 dark:text-slate-400">
              14 capítulos explicados con lenguaje claro, derechos, deberes y medidas formativas.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-1.5 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">Certificado Inmediato</h4>
            <p className="text-slate-500 dark:text-slate-400">
              Expedición con código de verificación QR al aprobar la evaluación interactiva (80%).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-1.5 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">Sincronización Automática</h4>
            <p className="text-slate-500 dark:text-slate-400">
              Los aprendices se registran en Google Drive sin tener que configurar nada en sus pantallas.
            </p>
          </div>
        </div>

      </main>

      {/* Landing Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#39A900]"></div>
            <span className="font-bold text-slate-700 dark:text-slate-300">SENA</span>
            <span>•</span>
            <span>Servicio Nacional de Aprendizaje</span>
          </div>
          <div>
            República de Colombia • Ministerio del Trabajo
          </div>
        </div>
      </footer>

    </div>
  );
};
