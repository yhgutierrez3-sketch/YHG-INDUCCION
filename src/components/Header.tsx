import { 
  Award, 
  BookOpen, 
  Compass, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  User as UserIcon, 
  Zap,
  CheckCircle2,
  FileCheck2,
  FileSpreadsheet,
  Lock,
  LogOut
} from 'lucide-react';
import { ApprenticeInfo, UserRole } from '../types';
import { Sun, Moon } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  apprentice: ApprenticeInfo;
  xp: number;
  level: number;
  quizPassed: boolean;
  onOpenProfile: () => void;
  unlockedBadgesCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser: User | null;
  onOpenDriveSync: () => void;
  userRole: UserRole;
  onOpenInstructorAuth: () => void;
  onSwitchToAprendiz: () => void;
  onReturnToLanding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  apprentice,
  xp,
  level,
  quizPassed,
  onOpenProfile,
  unlockedBadgesCount,
  isDarkMode,
  onToggleDarkMode,
  currentUser,
  onOpenDriveSync,
  userRole,
  onOpenInstructorAuth,
  onSwitchToAprendiz,
  onReturnToLanding
}) => {
  const apprenticeTabs = [
    { id: 'plan', label: '1. Plan de Inducción', icon: Compass, count: null },
    { id: 'reglamento', label: '2. Reglamento 2024', icon: BookOpen, count: '14 temas' },
    { id: 'casos', label: '3. Simulador de Casos', icon: Zap, count: '5 retos' },
    { id: 'quiz', label: '4. Evaluación Trivia', icon: Award, count: '10 preg.' },
    { id: 'certificado', label: '5. Certificado Oficial', icon: FileCheck2, highlight: quizPassed },
    { id: 'tutor', label: 'Tutor Sofia', icon: HelpCircle, count: null }
  ];

  const instructorTabs = [
    { id: 'instructor_dashboard', label: 'Tablero de Control Instructor', icon: ShieldCheck, highlight: true },
    { id: 'plan', label: 'Plan de Inducción', icon: Compass, count: null },
    { id: 'reglamento', label: 'Reglamento 2024', icon: BookOpen, count: null },
    { id: 'quiz', label: 'Evaluación Trivia', icon: Award, count: null },
    { id: 'certificado', label: 'Certificado Modelo', icon: FileCheck2, highlight: false },
    { id: 'tutor', label: 'Tutor Sofia', icon: HelpCircle, count: null }
  ];

  const tabs = userRole === 'instructor' ? instructorTabs : apprenticeTabs;

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      {/* Top Colombian / SENA Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FCD116] via-[#003893] to-[#CE1126] flex">
        <div className="h-full w-2/5 bg-[#FCD116]"></div>
        <div className="h-full w-1/5 bg-[#003893]"></div>
        <div className="h-full w-1/5 bg-[#CE1126]"></div>
        <div className="h-full w-1/5 bg-[#39A900]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Institution Details */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs ring-2 ring-[#39A900]/20 flex-shrink-0 p-1.5">
              {/* Official SENA Logo Image */}
              <img 
                src="data:image/svg+xml,%3c?xml%20version=%271.0%27%20encoding=%27utf-8%27?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2026.0.1,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version=%271.1%27%20id=%27Capa_1%27%20xmlns=%27http://www.w3.org/2000/svg%27%20xmlns:xlink=%27http://www.w3.org/1999/xlink%27%20x=%270px%27%20y=%270px%27%20viewBox=%270%200%201000%201000%27%20style=%27enable-background:new%200%200%201000%201000;%27%20xml:space=%27preserve%27%3e%3cstyle%20type=%27text/css%27%3e%20.st0{fill:%2339a900;}%20%3c/style%3e%3cpath%20id=%27path47-5%27%20class=%27st0%27%20d=%27M504.2,20.5c-58.3,0.1-105.6,47.4-105.5,105.8c0.1,58.3,47.4,105.6,105.7,105.6%20c58.3,0,105.6-47.3,105.6-105.7V126C609.9,67.6,562.6,20.4,504.2,20.5z%20M155.6,264.6c-18.6,0.1-37.5,1.1-55.2,5.6%20c-11.7,3-23,7.8-30.3,15.4c-9.2,9.5-10.4,22.3-5.9,33.3c4,9.7,14.8,16.9,26.8,21.1c25.9,8.9,54.6,10.7,81.8,16.3%20c5,1.2,10.6,2.6,13.7,6c3.2,4.1,1.3,9.7-4,12.2c-8.8,4.5-20.1,4.5-30.4,4.4c-9.4-0.4-19.7-1.2-27.2-5.9c-5.5-3.4-6.5-9.1-5.2-14.1%20l-60.6,0c-0.2,9.2,1.6,18.9,8.4,26.8c5.6,6.8,14.8,11.5,24.6,14.4c15.7,4.6,32.7,6,49.4,6.4c22.7,0.4,45.8-0.3,67.6-5.4%20c13-3.2,25.8-8.3,34.1-16.6c14.8-14.8,11.3-38.3-8.3-49.8c-9.8-5.7-21.5-9.2-33.4-11.5c-17.5-3.6-35.3-6.3-52.9-9.2%20c-6.2-1.2-12.8-2.3-18-5.2c-5.5-2.9-5.9-9.8-0.3-12.9c7.2-4.1,16.8-4,25.4-4c9.1,0.2,19,0.7,26.5,5c4.2,2.3,5.9,6.3,5.9,10.1%20l57.6-0.1c-0.2-7.3-1.6-14.9-6.9-21.2c-6.2-7.8-17.1-12.7-28.3-15.5C192.8,265.6,174.1,264.7,155.6,264.6L155.6,264.6z%20M280.6,268.9%20l0,137.7l168.1,0l0-30H342.3v-26.7h94.9v-29.3h-94.9l0-21.9l102.6,0l-0.1-29.7L280.6,268.9z%20M557.5,269c0,0-51.9,0-77.9,0l0,137.7%20l59,0l0-92.7l80.8,92.6l81,0.1l0-137.7l-59.1,0l0.1,92L557.5,269z%20M805.6,269.2c0,0-63.6,91.9-95.6,137.7l61.9,0l14.9-24.8h95.7%20l13.9,24.9l68.8,0L874,269.2L805.6,269.2z%20M836.6,302.1l29.4,49.9l-60.7,0.1L836.6,302.1z%20M10.6,445.6l0.5,75l280.1-1%20c14.3,3.1,22.6,12.4,19.7,33.5L138.6,854.7l56.1,52.5l266.9-461.6L10.6,445.6z%20M545.2,446.2l262.4,459.6l58-52.1L691.3,552.9%20c-2.9-21.2,5.4-30.6,19.7-33.7l280.2,1l-0.1-73.7L545.2,446.2z%20M500.9,522.3L254.8,944.7l65.4,31.9L484.4,699%20c5.7-4.6,11.4-7.1,17.1-7.3c6-0.2,12.2,2,18.3,6.8l163.8,278.4l67.4-35.2L500.9,522.3z%27/%3e%3cg%20id=%27_x23_000000ff-2%27%20transform=%27matrix(0.31570611,0,0,0.23560774,-391.49698,-10.601126)%27%3e%3c/g%3e%3c/svg%3e" 
                alt="Logo Oficial SENA" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#00324d] dark:text-white">SENA</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#39A900]/15 dark:bg-[#39A900]/25 text-[#2e8500] dark:text-[#6ee236] border border-[#39A900]/30">
                  Acuerdo 0009 de 2024
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Inducción Integral de Aprendices • Reglamento Oficial Vigente
              </p>
            </div>
          </div>

          {/* Gamification Stats, Apprentice Info & Dark Mode Toggle in Top Right */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
            {/* XP & Level Badge */}
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 px-3 py-1.5 rounded-xl shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                Nv.{level}
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Experiencia
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {xp} <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">XP</span>
                </div>
              </div>
            </div>

            {/* Badges Counter */}
            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 px-2.5 py-1.5 rounded-xl shadow-2xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-[#39A900]" />
              <div className="text-xs font-bold">
                {unlockedBadgesCount}/5 <span className="text-[10px] font-normal text-emerald-700 dark:text-emerald-400">Insignias</span>
              </div>
            </div>

            {/* Certificate Status Indicator */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border ${
              quizPassed 
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}>
              {quizPassed ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Certificado Desbloqueado</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>Certificado Pendiente</span>
                </>
              )}
            </div>

            {/* Role-Specific Controls */}
            {userRole === 'instructor' ? (
              <>
                {/* Google Drive / Sheets Sync Button for Instructor */}
                <button
                  onClick={onOpenDriveSync}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                    currentUser
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                  }`}
                  title="Almacenar y sincronizar datos en Google Drive / Google Sheets"
                >
                  <FileSpreadsheet className={`w-4 h-4 ${currentUser ? 'text-[#39A900]' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span className="hidden sm:inline">
                    {currentUser ? 'Drive Conectado' : 'Google Sheets'}
                  </span>
                  {currentUser && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  )}
                </button>

                {/* Switch to Apprentice Mode Button */}
                <button
                  onClick={onSwitchToAprendiz}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#00324d] hover:bg-[#002235] text-white shadow-2xs transition-all cursor-pointer"
                  title="Cambiar a la vista del estudiante/aprendiz"
                >
                  <span>Vista Aprendiz</span>
                </button>
              </>
            ) : (
              /* For Aprendiz: Discreet Instructor Access Portal */
              <button
                onClick={onOpenInstructorAuth}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                title="Acceso exclusivo para instructores y administración"
              >
                <Lock className="w-3.5 h-3.5 text-[#39A900]" />
                <span className="hidden sm:inline">Portal Instructor</span>
              </button>
            )}

            {/* User Profile Quick Access */}
            <button
              onClick={onOpenProfile}
              className="group flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl transition-all text-xs font-medium cursor-pointer"
              title="Configurar datos del aprendiz para el certificado"
            >
              <div className="w-6 h-6 rounded-full bg-[#00324d] text-white flex items-center justify-center font-bold text-[10px]">
                {apprentice.fullName ? apprentice.fullName.charAt(0) : 'A'}
              </div>
              <div className="text-left hidden lg:block max-w-[120px] truncate">
                <span className="block font-semibold text-slate-800 dark:text-slate-200 truncate">{apprentice.fullName}</span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400">Ficha: {apprentice.fichaNumber}</span>
              </div>
              <UserIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
            </button>

            {/* Return to Role Selector Landing Button */}
            <button
              onClick={onReturnToLanding}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
              title="Volver a la pantalla de selección de rol"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Cambiar Rol</span>
            </button>

            {/* Top Right Dark Mode Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              className="relative p-2 rounded-xl transition-all duration-200 border flex items-center justify-center gap-1.5 shadow-2xs group cursor-pointer bg-slate-100 hover:bg-slate-200/90 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/90 dark:text-amber-400 dark:border-slate-700/80 ring-1 ring-transparent hover:ring-[#39A900]/30"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow transition-transform group-hover:rotate-45" />
                  <span className="text-[11px] font-bold text-amber-300 hidden md:inline">Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600 group-hover:text-[#00324d] transition-transform group-hover:-rotate-12" />
                  <span className="text-[11px] font-bold text-slate-700 hidden md:inline">Oscuro</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none border-t border-slate-100 dark:border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-[#39A900] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                } ${tab.highlight && !isActive ? 'ring-2 ring-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.highlight && !isActive && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
